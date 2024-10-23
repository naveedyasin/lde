import {ValidationRule} from "../types/types";
import {remove} from "mobx";

export const isRequired: ValidationRule = {
    rule: (value) => value && value.length > 0,
    errorMessage: "This field is required."
};
export const isCheckboxRequired: ValidationRule = {
    rule: (values: string[]) => values && values.length > 0,
    errorMessage: "This field is required."
};
export const isRecommended: ValidationRule = {
    rule: (value) => value && value.length > 0,
    errorMessage: "This field is recommended."
};

export const isEmail: ValidationRule = {
    rule: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    errorMessage: "This field must be a valid email address."
};
export const isURL: ValidationRule = {
    rule: (value) => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value),
    errorMessage: "This field must be a valid URL."
};

export const isCreditCard: ValidationRule = {
    rule: (value) => {
        const regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/;
        return regex.test(value);
    },
    errorMessage: "This field must be a valid credit card number."
};
export const isDigit: ValidationRule = {
    rule: (value) => {
        if (value === '' || value === null || value === undefined) {
            return true; // No error for empty values
        }
        return /^[0-9]+$/.test(value);
    },
    errorMessage: "This field must contain only numbers."
};
export const isDecimal: ValidationRule = {
    rule: (value) =>{
        if (value === '' || value === null || value === undefined) {
            return true; // No error for empty values
        }
        return /^[0-9]*\.?[0-9]+$/.test(value);
        },
    errorMessage: "This field must be a valid decimal number."
};

export const maxValue = (max: number): ValidationRule => ({
    rule: (value) => +value <= max,
    errorMessage: `This field must be less than or equal to ${max}.`
});

export const exactValue = (max: number): ValidationRule => ({
    rule: (value) => +value === max,
    errorMessage: `This sum of values of this question must be equal to ${max}.`
});

export function validate(value: any, rules: ValidationRule[]): string[] {
    return rules
        .filter(rule => !rule.rule(value))
        .map(rule => rule.errorMessage);
}

export function extractValidationRules(question: { [key: string]: any }) {
    let validations: any[] = [];
    if (question.is_required) {
        if(question.question_type == 'checkbox'){
            validations.push(isCheckboxRequired);
        }else {
            validations.push(isRequired);
        }
    }
    if (question.rules.number) {
        validations.push(isDecimal);
    }
    if (question.rules.email) {
        validations.push(isEmail);
    }
    if (question.rules.url) {
        validations.push(isURL);
    }
    if (question.rules.creditcard) {
        validations.push(isCreditCard);
    }
    if (question.rules.digits) {
        validations.push(isDigit);
    }
    // if (schema.rules.max_val) {
    //     validations.push(maxValue(+schema.rules.max_val.length));
    // }
    // console.log(validations)
    return validations;
}


// export function addValidationRule()
