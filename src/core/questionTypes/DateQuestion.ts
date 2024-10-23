import {Question} from "./Question";
import {themeStore} from "../../stores/ThemeStore";
import {QuestionSchema, ValidationRule} from "../types/types";
import answersStore from "../../stores/AnswersStore";
import LabelComponent from "../components/labelComponent";

export class DateQuestion extends Question {

    protected theme = themeStore.theme;
    protected question: QuestionSchema;

    constructor(question: QuestionSchema) {
        super(question);
        this.question = question;
    }

    render(container: HTMLElement): void {
        const questionElement = document.createElement("div"); // create question div
        questionElement.className = this.theme.questionClass;
        if(this.question.is_conditional){
            questionElement.className += ' hidden';
        }

        // show label here
        const label = new LabelComponent(this.question);
        questionElement.appendChild(label.render());

        const inputElement = document.createElement("input"); // show input
        inputElement.type = "date";
        inputElement.name = this.name;
        inputElement.placeholder = this.question.default_value;
        if(this.question.min_year){
            inputElement.min = this.question.min_year + "-01-01";
        }
        if(this.question.max_year){
            inputElement.max = this.question.max_year + "-12-31";
        }

        inputElement.value = <string>answersStore.getAnswer(this.name) || "";
        inputElement.className = this.theme.inputClass;

        inputElement.addEventListener("input", (event) => {
            const target = event.target as HTMLInputElement;
            // setResponse(this.name, target.value);
            answersStore.updateAnswer(this.name, target.value);

            if (this.validate(target.value)) {
                inputElement.classList.remove('error');
            }else{
                inputElement.classList.add('error');
                questionElement.appendChild(this.errorElement);
            }
        });

        questionElement.appendChild(inputElement);
        container.appendChild(questionElement);
    }
}