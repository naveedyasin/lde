import './styles.css';
import './tailwind.css';
import {Question} from "./core/questionTypes/Question";
import {defaultTheme, themes} from "./core/Themes";
import {lde_schema} from "./lde_schema";
import {GroupSchema, QuestionSchema, SurveyConfig, SurveySchema} from "./core/types/types";
import {RadioQuestion} from "./core/questionTypes/RadioQuestion";
import {themeStore} from "./stores/ThemeStore";
import {TextQuestion} from "./core/questionTypes/TextQuestion";
import {TextAreaQuestion} from "./core/questionTypes/TextAreaQuestion";
import {DateQuestion} from "./core/questionTypes/DateQuestion";
import {SelectQuestion} from "./core/questionTypes/SelectQuestion";
import {CheckboxQuestion} from "./core/questionTypes/CheckboxQuestion";
import {schemaStore} from "./stores/SchemaStore";
import answersStore from "./stores/AnswersStore";
import {
    backButton,
    confirm,
    findLastIndexByGroupId,
    findMaxCounterByGroupId, getDistinctMsgs, getDistinctQInstances,
    getNewAddMoreName, getNewCondQids, getNewReadOnly,
    getQuerySelector, nextButton,
    showAddMore
} from "./core/utils/helpers";
import {GLOBAL_ERRORS} from "./core/utils/errorHandler";
import {fetchApi} from "./core/utils/FetchApi";
import {
    COMPLETE_ANSWERS, GET_ANSWERS,
    POSTCODER_API,
    QUESTIONNAIRE_ID,
    REQUEST_FROM, SAVE_ANSWERS,
    SCHEMA_URL,
    USER_EMAIL, VARIATION,
    VENDOR_ID
} from "./core/config/conf";

class Survey {
    private schema: SurveySchema;
    private config: SurveyConfig;
    private currentPage: number = 0;
    private totalPages: number = 0;
    private currentGroup: number = 0;
    private questionInstances: Question[] = [];

    activeTheme: typeof defaultTheme;

    // schema: SurveySchema,
    constructor(config: SurveyConfig) {
        // this.schema = lde_schema;
        this.config = config;
        themeStore.setTheme("light");
        this.activeTheme = themeStore.theme;
        // this.activeTheme = this.themes[config?.theme] || this.themes["default"];
        this.currentPage = config?.pageNo || 0;
        // this.getSchema();
        // schemaStore.setSchema(this.schema);
    }

    public start() {
        console.log('start called');
        this.renderPage();
    }

    public registerTheme(name: keyof typeof themes) {
        console.log('register theme called');
        themeStore.setTheme(name);
        // this.themes[name] = theme;
    }

    async renderPage() {
        this.totalPages = this.schema.pages.length - 1;
        let pageIndex: number = this.currentPage;
        const page = this.schema.pages[pageIndex];
        document.body.innerHTML = "";
        const container = document.createElement("form");
        container.className = this.activeTheme.containerClass;

        container.action = '';
        container.method = 'post';
        container.id = 'survey_form';

        const h1 = document.createElement("h1");
        h1.className = 'font-arima-koshi';
        h1.textContent = page.label;
        container.appendChild(h1);

        // reset question instances
        this.questionInstances = [];

        // group tabs here
        if (page.groups.length > 1 && VARIATION === 'group_vise') {
            const tabs = document.createElement("div");
            tabs.id = 'tab-lines';
            // tabs.className = "grid gap-2 grid-cols-" + page.groups.length;
            tabs.className = "grid gap-2 grid-cols-5";
            for (let i = 0; i < page.groups.length; i++) {
                const tab_div = document.createElement("div");
                tab_div.className = "tab-line" //tab-line-active
                if(this.currentGroup == i){
                    tab_div.className += " tab-line-active"
                }
                tab_div.addEventListener("click", (event) => {
                    this.showTab(i);
                });
                tabs.appendChild(tab_div);
            }
            container.appendChild(tabs);
        }

        const tab_content = document.createElement("div");
        tab_content.id = 'tab-content';

        page.groups.forEach((group, groupIndex) => {
            this.renderGroup(group, groupIndex, page.groups.length, container);
        });

        container.appendChild(tab_content);

        // show a global error here
        const globalError = document.createElement("div");
        globalError.id = 'global_error';
        globalError.className = 'global_error hidden';
        container.appendChild(globalError);

        // save and continue button
        let submit_btn_text = 'Submit';
        if(this.currentPage < this.totalPages){
            submit_btn_text = 'Save & Continue';
        }
        //  submit button
        const submitButton = document.createElement("button");
        submitButton.textContent = submit_btn_text;
        submitButton.type = "submit";
        submitButton.id = "submit_btn";
        submitButton.className = "btn btn-primary";
        submitButton.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent the default form submission
            this.handleSubmit();
        });
        container.appendChild(submitButton);

        // loader button
        const loaderButton = document.createElement("button");
        loaderButton.id = 'loader_btn';
        loaderButton.disabled = true;
        loaderButton.className = "hidden btn btn-primary flex flex-row-reverse items-center";
        loaderButton.textContent = "Processing... ";
        const spinner = document.createElement("svg");
        spinner.className = 'spinner';
        spinner.setAttribute("viewBox", "0 0 24 24");
        loaderButton.appendChild(spinner);
        container.appendChild(loaderButton);

        if(VARIATION == 'page_vise') {
            // back button for previous page
            const backButton = document.createElement("button");
            backButton.textContent = 'Previous Page';
            backButton.id = "back_btn";
            backButton.className = "btn btn-secondary";
            if (this.currentPage === 0) {
                backButton.className += " hidden ";
            }
            backButton.addEventListener("click", (event) => {
                if (this.currentPage > 0) {
                    event.preventDefault(); // Prevent the default form submission
                    this.currentPage--;
                    this.renderPage();
                }
            });
            container.appendChild(backButton);
        }

        document.body.appendChild(container);
    }

    private renderGroup(group: GroupSchema, groupIndex: number, totalGroups: number,  container: HTMLElement) {
        const groupElement = document.createElement("div");
        groupElement.className = this.activeTheme?.groupClass;
        groupElement.className += ' mb-6';
        if(VARIATION == 'group_vise') {
            groupElement.className += ' tab';
            if (groupIndex == this.currentGroup) {
                groupElement.className += " tab-active";
            }
            groupElement.id = 'tab-' + groupIndex;
        }

        const h2 = document.createElement("h2");
        h2.textContent = group.title;
        if(group.helpText){
            h2.className += ' flex relative';
            h2.innerHTML += '<svg class="h-6 w-6 text-gray-500 self-center"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="12" r="9" />  <line x1="12" y1="17" x2="12" y2="17.01" />  <path d="M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -4" /></svg>';
            const tooltip = document.createElement("div");
            tooltip.className = 'absolute hidden px-2 py-1 text-sm text-white bg-black rounded z-20';
            tooltip.style.top = '1.5rem';
            tooltip.id = group.title;
            tooltip.innerHTML = group.helpText;

            h2.addEventListener('click', () => {
                tooltip.classList.remove('hidden');
                tooltip.classList.add('block');
            });
            h2.addEventListener('mouseleave', () => {
                tooltip.classList.remove('block');
                tooltip.classList.add('hidden');
            });
            h2.appendChild(tooltip);
        }
        groupElement.appendChild(h2);

        // if description and help
        if(group.description){
            const p = document.createElement("p");
            p.innerHTML = group.description;
            groupElement.appendChild(p);
        }

        group.questions.forEach((question) => {
            const questionInstance = this.createQuestionInstance(question);
            questionInstance.render(groupElement);
            this.questionInstances.push(questionInstance);
        });

        // show add more button
        if (group.allow_add_more && groupIndex < group.max_add_more && showAddMore(this.currentPage, groupIndex, group.group_id)) {
            const addMoreButton = document.createElement("button");
            addMoreButton.textContent = group.add_more_text ? group.add_more_text : 'Add more';
            addMoreButton.className = "btn btn-secondary";
            addMoreButton.id = group.group_id+'_'+group.add_more_counter;
            addMoreButton.addEventListener("click", (event) => {
                event.preventDefault(); // Prevent the default form submission
                this.addGroup(group);
            });
            groupElement.appendChild(addMoreButton);
        }

        // hide/remove add more
        if (group.add_more_counter > 0) {
            const addMoreButton = document.createElement("button");
            addMoreButton.textContent = group.remove_add_more_text ? group.remove_add_more_text : 'Remove';
            addMoreButton.className = "btn btn-secondary";
            addMoreButton.addEventListener("click", () => {
                this.removeGroup(groupIndex);
            });
            groupElement.appendChild(addMoreButton);
        }

        // back and next buttons navigations
        const navigation = document.createElement("div");
        navigation.className = 'flex mt-8 flex-wrap flex-row justify-between';
        // back button for group
        if(groupIndex > 0 && VARIATION === 'group_vise') {
            const back_btn = backButton();
            back_btn.addEventListener("click", (event) => {
                event.preventDefault();
                this.navigate(-1);
            });
            navigation.appendChild(back_btn);
        }

        // next button for group
        if(groupIndex < totalGroups-1 && VARIATION === 'group_vise') {
            const next_btn = nextButton();
            next_btn.addEventListener("click", (event) => {
                event.preventDefault();
                this.navigate(1);
            });
            navigation.appendChild(next_btn);
        }
        groupElement.appendChild(navigation);

        container.appendChild(groupElement);
    }


    showTab(index: number){
        const tabs = document.querySelectorAll('.tab');
        const lines = document.querySelectorAll('.tab-line');
        tabs.forEach((tab, i) => {
            tab.classList.toggle('tab-active', i === index);
        });
        lines.forEach((line, i) => {
            line.classList.toggle('tab-line-active', i === index);
        });
        this.currentGroup = index;
    }

    navigate(direction: number){
        const tabs = document.querySelectorAll('.tab');
        let newIndex = this.currentGroup + direction;
        if (newIndex >= 0 && newIndex < tabs.length) {
            this.showTab(newIndex);
        }
    }

    private addGroup(group: GroupSchema) {
        let lastIndex = findLastIndexByGroupId(this.schema.pages[this.currentPage].groups, group.group_id) + 1;
        let maxAddMoreCounter = findMaxCounterByGroupId(this.schema.pages[this.currentPage].groups, group.group_id) + 1;
        const newGroup = { ...group, title: group.add_more_heading, add_more_counter: maxAddMoreCounter,
            questions: group.questions.map(q => ({ ...q,
                name: getNewAddMoreName(q.name, maxAddMoreCounter),
                cond_q_ids: getNewCondQids(q.cond_q_ids, maxAddMoreCounter),
                read_only_questions: getNewReadOnly(q.read_only_questions, maxAddMoreCounter)
            }))
        };
        this.schema.pages[this.currentPage].groups.splice(lastIndex, 0, newGroup);
        this.currentGroup = lastIndex;
        this.renderPage();
    }
    private removeGroup(groupIndex: number) {
        this.schema.pages[this.currentPage].groups.splice(groupIndex, 1);
        this.currentGroup = groupIndex-1;
        this.renderPage();
    }

    private createQuestionInstance(question: QuestionSchema): Question {
        switch (question.question_type) {
            case "text":
            case "readonly":
            case "postcode":
                return new TextQuestion(question);
            case "textarea":
            case "paragraph":
            case "textarea_list":
                return new TextAreaQuestion(question);
            case "date":
                return new DateQuestion(question);
            case "boolean":
            case "radio":
                return new RadioQuestion(question);
            case "select":
            case "country":
                return new SelectQuestion(question);
            case "checkbox":
            case "hidden_checkbox":
                return new CheckboxQuestion(question);
            // case "hidden":
            //     return new TextQuestion(question);
            default:
                throw new Error(`Unknown question type: ${question.question_type}`);
        }
    }

    private handleSubmit() {
        // console.log('handle submit called');
        let isValid = true;
        let isRecommendedAnswered = true;
        let firstInvalidElement: HTMLElement | null = null;
        let inputElement: HTMLElement | null = null;

        this.questionInstances = getDistinctQInstances(this.questionInstances);
        this.questionInstances.forEach((question) => {
            const response = answersStore.getAnswer(question.name);
            question.validations = getDistinctMsgs(question.validations);
            if (!question.validate(response)) {
                inputElement = getQuerySelector(question.name, question.question_type);

                if (inputElement) { // if an element id hidden then do not count it as error
                    if(inputElement.parentElement.classList.contains('hidden')){
                        inputElement.parentElement.classList.remove('error');
                    }else {
                        isValid = false;
                        inputElement.classList.add("error"); // add error class
                        inputElement.after(question.errorElement); // show error message
                        if (!firstInvalidElement) {
                            firstInvalidElement = inputElement as HTMLElement;
                        }
                    }
                }
            }else{
                const inputElement = document.querySelector(`[name="${question.name}"]`);
                if (inputElement) {
                    inputElement.classList.remove('error');
                }
            }
        //     for is recommended
            if(question.is_recommended && response == undefined){
                isRecommendedAnswered = false;
            }
        });

        let global_error = document.getElementById('global_error');

        if (!isValid && firstInvalidElement) {
            let parentNode = firstInvalidElement.parentElement;
            if(!parentNode.hasAttribute('id')){
                parentNode = parentNode.parentElement
            }
            let parentId = parentNode.id;
            let parentIndex = parentId.split('-');
            let errorIndex = 0;
            if(parentIndex[1]){
                errorIndex = +parentIndex[1];
            }
            this.showTab(errorIndex);
            firstInvalidElement?.scrollIntoView({ behavior: "smooth", block: "center" });
            firstInvalidElement?.focus();
        } else if (GLOBAL_ERRORS.length) {
            global_error.innerText = GLOBAL_ERRORS[0];
            global_error.classList.remove('hidden');
            global_error.classList.add('block');
        } else if (isValid) {
            global_error.classList.remove('block');
            global_error.classList.add('hidden');
            if(!isRecommendedAnswered){
                let msg = "You haven't answered some of the questions on this page that are important to your document. " +
                    "You can continue to the next page without answering them now and return to them later. Be aware that if you don't answer them, your final document may not be complete.";
                confirm(msg, 'Warning', 'Continue to next page', 'Stay on this page')
                    .then(userConfirmed => {
                        if (userConfirmed) {
                            if(this.currentPage === this.totalPages) {
                                this.complete();
                            }else{
                                this.saveAnswers();
                                this.currentPage++;
                                this.currentGroup = 0;
                                this.renderPage();
                            }
                        }
                    });
            }else{
                if(this.currentPage === this.totalPages) {
                    this.complete();
                }else{
                    this.saveAnswers();
                    this.currentPage++;
                    this.currentGroup = 0;
                    this.renderPage();
                }
            }
            // this.config.onComplete(this.responses);
        }
    }

    saveAnswers(){
        console.log('Save answers')
        return
        let data ={
            vendor_id: VENDOR_ID,
            questionnaire_id: QUESTIONNAIRE_ID,
            user_email: USER_EMAIL,
            request_from: REQUEST_FROM,
            answers: answersStore.getAnswers(),
        };
        fetchApi.postData(SAVE_ANSWERS, data)
            .then(data => {
                    // this.reviewAnswers(data)
                    console.log('Answers saved')
                    // console.log(data)
                }

            )
            .catch(error => {
                    console.error(error);
                }
            );
    }

    public complete() {
        if(this.config.onComplete){
            const submit_btn = document.getElementById('submit_btn');
            const loader_btn = document.getElementById('loader_btn');
            submit_btn.classList.add('hidden');
            loader_btn.classList.remove('hidden');

            let data ={
                vendor_id: VENDOR_ID,
                questionnaire_id: QUESTIONNAIRE_ID,
                user_email: USER_EMAIL,
                request_from: REQUEST_FROM,
                answers: answersStore.getAnswers(),
                };
            fetchApi.postData(this.config.onComplete, data)
                .then(data => {
                    this.reviewAnswers(data)
                        // console.log(data)
                    }

                )
                .catch(error => {
                        // console.error(error);
                        submit_btn.classList.remove('hidden');
                        loader_btn.classList.add('hidden');
                    }
                );
        }
    }

    reviewAnswers(data: any){
        console.log(data);
        document.body.innerHTML = "";
        const container = document.createElement("div");
        container.className = 'survey-container';
        let h1 =  document.createElement('h1');
        h1.className = 'font-arima-koshi';
        h1.textContent = 'Review your answers and submit to LDE';

        const p = document.createElement("p");
        p.textContent = 'Review your answers and submit to LDE. Once submitted will not be editable';
        container.appendChild(h1);
        container.appendChild(p);

        const submitButton = document.createElement("button");
        submitButton.textContent = "Submit my answers";
        submitButton.type = "submit";
        submitButton.id = "submit_btn";
        submitButton.className = "btn btn-primary";
        submitButton.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent the default form submission
            this.submitAnswers(data.answer_key);
        });
        container.appendChild(submitButton);
        document.body.appendChild(container);
    }

    submitAnswers(answer_key: string){
        let data ={
            answer_key: answer_key,
            vendor_id: VENDOR_ID
        };
        fetchApi.postData(COMPLETE_ANSWERS, data)
            .then(data => {
                    this.thankYou(data)
                }

            )
            .catch(error => {
                    console.error(error);
                }
            );
    }

    async getAnswers(){
        console.log('Get answers called')
        let data ={
            questionnaire_id: QUESTIONNAIRE_ID,
            user_email: USER_EMAIL
        };
        await fetchApi.postData(GET_ANSWERS, data)
            .then(data => {
                    // console.log(data.answers)
                    answersStore.setAnswers(data.answers);
                }

            )
            .catch(error => {
                    console.error(error);
                }
            );
    }

    thankYou(data: any){
        console.log(data);
        document.body.innerHTML = "";
        const container = document.createElement("div");
        container.className = 'survey-container';
        let h1 =  document.createElement('h1');
        h1.className = 'font-arima-koshi';
        h1.textContent = 'Thank you';

        const p = document.createElement("p");
        p.textContent = 'Your answers has been submitted.';
        container.appendChild(h1);
        container.appendChild(p);
        document.body.appendChild(container);
        return data;
    }

    async getSchema() {
        console.log('get schema called')
        this.schema = lde_schema;
        schemaStore.setSchema(this.schema);
        return;
        try {
            let data = {
                vendor_id: VENDOR_ID,
                questionnaire_id: QUESTIONNAIRE_ID,
                user_email: USER_EMAIL,
                request_from: REQUEST_FROM,
            };
            let schema_url = this.config.schemaUrl.length ? this.config.schemaUrl : SCHEMA_URL;

            await fetchApi.postData(schema_url, data)
                .then(data => {
                        // this.schema = data;
                        // schemaStore.setSchema(this.schema);
                        // console.log(data);
                    }
                )
                .catch(error => {
                        console.error(error);
                    }
                );
        }catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async render(el: string){
        const rootElement = document.getElementById(el);
        let elem =  document.createElement('h2');
        elem.textContent = 'Hello h1 world';

        await this.getSchema();
        await this.getAnswers();
        this.renderPage();
        rootElement.appendChild(elem);
    }

}

export default Survey;