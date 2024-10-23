import {Question} from "./Question";
import {themeStore} from "../../stores/ThemeStore";
import {QuestionSchema, ValidationRule} from "../types/types";
import {isParentAnswered} from "../utils/Conditional";
import answersStore from "../../stores/AnswersStore";
import {
    appendSymbol, confirm,
    countValues, extractCounterByName, extractQidByName,
    updateReadOnlyValues
} from "../utils/helpers";
import LabelComponent from "../components/labelComponent";
import {addGlobalError, removeGlobalError} from "../utils/errorHandler";
import {schemaStore} from "../../stores/SchemaStore";
import {nameCase} from "../utils/NameCase";
import {fetchApi} from "../utils/FetchApi";
import {POSTCODER_API} from "../config/conf";
import AddressComponent from "../components/addressComponent";

export class TextQuestion extends Question {

    protected theme = themeStore.theme;
    protected question: QuestionSchema;

    constructor(question: QuestionSchema) {
        super(question);
        this.question = question;
    }

    render(container: HTMLElement): void {
        const questionElement = document.createElement("div"); // create question div
        questionElement.className = this.theme.questionClass;

        if(this.question.is_conditional && !isParentAnswered(this.name) ){
            questionElement.className += ' hidden';
        }
        if(this.question.question_type == 'postcode'){
            questionElement.className += ' autocomplete';
        }

        const label = new LabelComponent(this.question);
        questionElement.appendChild(label.render());

        if(this.question.define_symbol && this.question.symbol_position == 'l') {
            appendSymbol(questionElement,this.question.symbol_val);
        }

        const inputElement = document.createElement("input"); // show input
        if(this.question.rules.number || this.question.rules.digits){
            inputElement.type = "number";
        }else {
            inputElement.type = "text";
        }
        // if(this.question.question_type == 'postcode'){
        //     inputElement.id = 'autocomplete-input';
        // }
        inputElement.name = this.name;
        inputElement.placeholder = this.question.default_value ?? '';
        inputElement.value = <string> answersStore.getAnswer(this.name) || "";
        inputElement.className = this.theme.inputClass;
        if(this.question_type == 'readonly'){
            inputElement.readOnly = true;
        }
        inputElement.addEventListener("input", (event) => {
            const target = event.target as HTMLInputElement;

            if (this.validate(target.value)) {
                inputElement.classList.remove('error');
            }else{
                inputElement.classList.add('error');
                questionElement.appendChild(this.errorElement);
            }
        });
        if(this.question.question_type == 'postcode'){
            const postcode = new AddressComponent(this.question, inputElement);
            postcode.render();
        }

        inputElement.addEventListener("blur", (event) => {
            const target = event.target as HTMLInputElement;
            answersStore.updateAnswer(this.name, target.value);
            target.value = target.value.trim();

            // if text field is number
            if(this.question.rules.number || this.question.rules.digits){
                updateReadOnlyValues(this.name);

                this.countOtherValuesOfInputRestrictions(); // if other input restricted questions are changed

                if(this.question.input_restriction){
                    let values = countValues(this.question);
                    let msg = "'"+ this.question.label + "' values should be equal to '"+ this.question.rules.max_val.length + "'";
                    if(this.question.rules.max_val.length !== values){
                        addGlobalError(msg);
                    }else{
                        removeGlobalError(msg);
                    }
                }
            }
            //  name case correction
            if(this.question.validation_type === 'name_case'){
                this.correctNameCase(target);
            }
        });

        questionElement.appendChild(inputElement);

        if(this.question.define_symbol && this.question.symbol_position == 'r') {
            appendSymbol(questionElement,this.question.symbol_val);
        }

        if(this.question.question_type == 'postcode'){
            const ul = document.createElement("ul");
            ul.id = 'autocomplete-list'+this.name;
            ul.className = 'autocomplete-list hidden'
            questionElement.appendChild(ul);
        }

        container.appendChild(questionElement);
    }

    countOtherValuesOfInputRestrictions(){
        if(schemaStore.inputRestrictedQuestions().includes(this.question.question_id)){
            let restricted_qid = schemaStore.inputRestrictedQuestions().indexOf(this.question.question_id);
            let counter = extractCounterByName(this.name);
            if(counter >= 0){
                let inputs = document.getElementsByName(restricted_qid+'_'+counter);
                const input = inputs[0] as HTMLInputElement;
                input.focus();
            }
        }
    }

    correctNameCase(field: HTMLInputElement){
        let correct_name = nameCase.correctName(field.value);
        if(correct_name !== field.value){
            confirm("Should the name be '" + correct_name + "'",'', '', 'Keep as I entered', '')
                .then(userConfirmed => {
                    if (userConfirmed) {
                        field.value = correct_name;
                        answersStore.updateAnswer(this.name, field.value);
                    }
                });
        }
    }



}