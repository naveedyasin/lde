import {QuestionSchema, ValidationRule} from "../types/types";
import {isEmail, isRequired, isRecommended, validate, extractValidationRules} from "../utils/validators";


export abstract class Question {
    name: string;
    question_type: string;
    is_recommended: boolean;
    protected title: string;
    validations?: ValidationRule[];
    errorElement: HTMLElement;

    constructor(question: QuestionSchema) {
        this.name = question.name;
        this.title = question.label;
        this.is_recommended = question.is_recommended;
        this.question_type = question.question_type;
        this.validations = extractValidationRules(question);
        this.errorElement = document.createElement("div");
        this.errorElement.className = "error-message";
    }

    abstract render(container: HTMLElement): void;

    public validate(answer: any): boolean {
        // console.log('validate called');
        this.errorElement.textContent = "";
        if (!this.validations) {
            return true;
        }
        const errors = validate(answer, this.validations);
        if(errors.length > 0){
            // console.log(errors.toString());
            this.errorElement.textContent = errors[0].toString();
            return false;
        }
        return true;
    }

    public removeValidation(){

    }

}