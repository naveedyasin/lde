import {Question} from "./Question";
import {Options, QuestionSchema, ValidationRule} from "../types/types";
import {themeStore} from "../../stores/ThemeStore";
import {showHideConditional} from "../utils/Conditional";
import answersStore from "../../stores/AnswersStore";
import LabelComponent from "../components/labelComponent";
import {replaceNotation} from "../utils/helpers";

export class RadioQuestion extends Question {
    private choices: Options[];
    protected theme = themeStore.theme;
    protected question: QuestionSchema;

    constructor(question: QuestionSchema) {
        super(question);
        if(question.question_type == 'boolean'){
            this.choices = [
                {
                    "text": "Yes",
                    "value": "yes"
                },{
                    "text": "No",
                    "value": "no"
                },
            ];
        }else {
            this.choices = question.options;
        }
        this.question = question;
    }

    render(container: HTMLElement): void {
        const questionElement = document.createElement("div");
        questionElement.className = this.theme.questionClass;
        if(this.question.is_conditional){
            questionElement.className += ' hidden';
        }

        // show label here
        const label = new LabelComponent(this.question);
        questionElement.appendChild(label.render());

        let counter:number = 1;
        let radio_id:string;

        // console.log(answersStore.getAnswers())
        // console.log(this.question.name)
        // console.log(answersStore.getAnswer(this.question.name));

        this.choices.forEach(choice => {
            const div = document.createElement("div");
            div.className = 'flex ml-4';

            const inputElement = document.createElement("input");
            inputElement.type = "radio";
            inputElement.name = this.name;
            radio_id = this.name + '_' + counter++;
            inputElement.id = radio_id;
            inputElement.className = this.theme.radioInput;
            inputElement.value = choice.value;
            inputElement.checked = answersStore.getAnswer(this.name) ? answersStore.getAnswer(this.name).includes(choice.value) : false;

            inputElement.addEventListener("change", (event) => {
                const target = event.target as HTMLInputElement;
                // setResponse(this.name, target.value);
                answersStore.updateAnswer(this.name, target.value);

                if (this.validate(target.value)) {
                    inputElement.classList.remove('error');
                    showHideConditional(this.name, target.value);
                }else{
                    inputElement.classList.add('error');
                    questionElement.appendChild(this.errorElement);
                }
            });
            div.appendChild(inputElement);

            // options label text
            const labelElement = document.createElement("label");
            labelElement.className = this.theme.radioLabel;
            labelElement.htmlFor = radio_id;
            labelElement.appendChild(document.createTextNode(replaceNotation(choice.text)));
            div.appendChild(labelElement);

            questionElement.appendChild(div);

        });

        container.appendChild(questionElement);
    }
}