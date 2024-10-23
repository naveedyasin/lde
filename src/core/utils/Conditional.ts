import {getQuerySelector, getQuestionType, getConditionals} from "../utils/helpers";
import {schemaStore} from "../../stores/SchemaStore";

import answersStore from "../../stores/AnswersStore";

export function showHideConditional(question_name: string, value: string){
    // const pages = schemaStore.schema.pages;

    let condQuestions = schemaStore.conditionalQuestions();
    // console.log(condQuestions);
    // console.log(question_name);
    // console.log(value);

    let found = false;

    Object.keys(condQuestions).forEach(function(child_qid, index) {
        let cond_q = condQuestions[child_qid];
        Object.keys(cond_q).forEach( function (parent_qid, index2){
            if(question_name == parent_qid) {

                if(isParentAnswered(child_qid)){
                    showQuestion(child_qid);
                }else{
                    hideQuestion(child_qid);
                }
            }
        });
    });
    return found;
}

export function isParentAnswered(q_name: string){

    let answers = answersStore.getAnswers();
    // console.log('answers are: ');
    // console.log(answers);

    let conditionals = getConditionals(q_name);
    let isAnswered: boolean[] = [];
    Object.keys(conditionals).forEach(function (parent_qid, index2){
        // console.log(parent_qid + ' answer is: ' + answersStore.getAnswer(parent_qid));

        let answer = answersStore.getAnswer(parent_qid);
        if(answer == undefined){
            isAnswered.push(false);
        }else if (typeof answer === 'string' && conditionals[parent_qid].includes(answer)) {
            isAnswered.push(true);
        }else if(Array.isArray(answer) && answer.some(item => conditionals[parent_qid].includes(item)) ){
            isAnswered.push(true);
        }else{
            isAnswered.push(false);
        }
    });
    // console.log(isAnswered);
    return isAnswered.includes(false) ? false : true;
}

export function isAnswerFound (question_name: string, value: string): boolean {
    let condQuestions = schemaStore.conditionalQuestions();
    let found = false;
    Object.keys(condQuestions).forEach(function(question_id, index) {
        let cond_q = condQuestions[question_id];
        Object.keys(cond_q).forEach( function (qid, index2){
            if(question_name == qid && cond_q[qid].includes(value)){
                found = true;
            }
        });
    });
    return found;
}

export function showQuestion(name: string){
    let inputElement: HTMLElement | null = null;
    let q_type = getQuestionType(name);
    inputElement = getQuerySelector(name, q_type);
    inputElement.parentElement.classList.remove('hidden');
}
export function hideQuestion(name: string){
    // console.log('hide question: '+name);
    let inputElement: HTMLElement | null = null;
    let q_type = getQuestionType(name);
    inputElement = getQuerySelector(name, q_type);
    // console.log(inputElement)
    inputElement.parentElement.classList.add('hidden');
}