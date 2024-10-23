import {Question} from "./Question";
import {Options, QuestionSchema, ValidationRule} from "../types/types";
import {themeStore} from "../../stores/ThemeStore";
import {showHideConditional} from "../utils/Conditional";
import answersStore from "../../stores/AnswersStore";
import LabelComponent from "../components/labelComponent";
import {replaceNotation} from "../utils/helpers";
import {schemaStore} from "../../stores/SchemaStore";

export class SelectQuestion extends Question {
    private choices: any[];
    protected theme = themeStore.theme;
    protected question: QuestionSchema;

    constructor(question: QuestionSchema) {
        super(question);
        if(question.question_type == 'country'){
            this.choices = schemaStore.countryList();
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

        // Create select element
        const selectElement = document.createElement("select");
        selectElement.name = this.name;
        selectElement.className = this.theme.inputClass;

        // create first empty selection
        const optionElement = document.createElement("option");
        optionElement.value = "";
        optionElement.text = "Please select a value";
        optionElement.selected = answersStore.getAnswer(this.name) === "";
        selectElement.appendChild(optionElement);

        // Create options for select element
        this.choices.forEach((choice, index) => {
            const optionElement = document.createElement("option");
            if(this.question.question_type == 'country'){
                optionElement.value = replaceNotation(choice.name);
                optionElement.text = replaceNotation(choice.name);
                if(answersStore.getAnswer(this.name) === undefined && this.question.default_value == choice.name){
                    optionElement.selected = true;
                    answersStore.updateAnswer(this.name, choice.name);
                }else{
                    optionElement.selected = answersStore.getAnswer(this.name) == choice.name ? true : false;
                }
            }else{
                optionElement.value = replaceNotation(choice.value);
                optionElement.text = replaceNotation(choice.text);
                if(answersStore.getAnswer(this.name) === undefined && this.question.default_value == choice.value){
                    optionElement.selected = true;
                    answersStore.updateAnswer(this.name, choice.value);
                }else{
                    optionElement.selected = answersStore.getAnswer(this.name) == choice.value ? true : false;
                }
            }
            selectElement.appendChild(optionElement);
        });

        selectElement.addEventListener("change", (event) => {
            const target = event.target as HTMLSelectElement;
            answersStore.updateAnswer(this.name, target.value);
            if (this.validate(target.value)) {
                selectElement.classList.remove('error');
                showHideConditional(this.name, target.value);
            } else {
                selectElement.classList.add('error');
                questionElement.appendChild(this.errorElement);
            }
        });

        questionElement.appendChild(selectElement);
        container.appendChild(questionElement);
    }
}