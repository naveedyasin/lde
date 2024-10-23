import {Question} from "./Question";
import {Options, QuestionSchema, ValidationRule} from "../types/types";
import {themeStore} from "../../stores/ThemeStore";
import answersStore from "../../stores/AnswersStore";
import LabelComponent from "../components/labelComponent";
import {replaceNotation} from "../utils/helpers";

export class CheckboxQuestion extends Question {
    private choices: Options[];
    protected theme = themeStore.theme;
    protected question: QuestionSchema;

    constructor(question: QuestionSchema) {
        super(question);
        this.choices = question.options;
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

        this.choices.forEach(choice => {
            const div = document.createElement("div");
            div.className = 'flex ml-4';

            const inputElement = document.createElement("input");
            inputElement.type = "checkbox";
            inputElement.name = this.name+'[]';
            radio_id = this.name + '_' + counter++;
            inputElement.id = radio_id;
            inputElement.className = this.theme.radioInput;
            inputElement.value = choice.value;
            // inputElement.checked = responses[this.name] === choice;
            // inputElement.checked = answersStore.getAnswer(this.name).includes(choice.value) || false;
            inputElement.checked = answersStore.getAnswer(this.name) ? answersStore.getAnswer(this.name).includes(choice.value) : false;

            inputElement.addEventListener("change", (event) => {
                const target = event.target as HTMLInputElement;
                let selectedValues: string | string[] = answersStore.getAnswer(this.name) || [];
                if (target.checked) {
                    if (typeof selectedValues !== "string") {
                        selectedValues.push(target.value);
                    }
                } else {
                    if (typeof selectedValues !== "string") {
                        selectedValues = selectedValues.filter((value: string) => value !== target.value);
                    }
                }
                // setResponse(this.name, selectedValues);
                // answersStore.addAnswer({questionId: this.name, answer: selectedValues});
                answersStore.updateAnswer(this.name, selectedValues);

                if (this.validate(selectedValues)) {
                    inputElement.classList.remove('error');
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