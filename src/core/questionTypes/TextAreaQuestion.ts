import {Question} from "./Question";
import {themeStore} from "../../stores/ThemeStore";
import {QuestionSchema, ValidationRule} from "../types/types";
import answersStore from "../../stores/AnswersStore";
import LabelComponent from "../components/labelComponent";
import {nameCase} from "../utils/NameCase";
import {confirm, selectPopUp} from "../utils/helpers";
import Swal from "sweetalert2";

export class TextAreaQuestion extends Question {

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

        if(this.question.question_type != 'paragraph') {
            const inputElement = document.createElement("textarea"); // show input
            // inputElement.type = "textarea";
            inputElement.name = this.name;
            inputElement.id = this.name;
            inputElement.placeholder = this.question.default_value ?? '';
            inputElement.value = <string>answersStore.getAnswer(this.name) || "";
            inputElement.className = this.theme.inputClass;

            inputElement.addEventListener("input", (event) => {
                const target = event.target as HTMLInputElement;
                // setResponse(this.name, target.value);
                answersStore.updateAnswer(this.name, target.value);
                if (this.validate(target.value)) {
                    inputElement.classList.remove('error');
                } else {
                    inputElement.classList.add('error');
                    questionElement.appendChild(this.errorElement);
                }
            });
            questionElement.appendChild(inputElement);

            if(this.question.question_type == 'textarea_list') {
                const selectButton = document.createElement("button"); // show input
                selectButton.className = 'mt-0.5 btn btn-secondary';
                selectButton.innerText = this.question.buttonText;
                selectButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    selectPopUp(this.question.list_options, this.name);
                });
                questionElement.appendChild(selectButton);
            }

        }

        container.appendChild(questionElement);
    }

}