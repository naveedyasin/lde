import {schemaStore} from "../../stores/SchemaStore";
import {GroupSchema, ValidationRule} from "../types/types";
import answersStore from "../../stores/AnswersStore";
import {Question} from "../questionTypes/Question";

import Swal from "sweetalert2";

export function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


// actually begins here
export function confirm(message: string, title:string = '', yes: string = '', no:string = '', icon: any = ''): Promise<boolean> {
    return Swal.fire({
        title: title ? title : 'Confirm',
        text: message,
        icon: icon ? icon : 'warning',
        showCancelButton: true,
        confirmButtonText: yes ? yes : 'Yes',
        cancelButtonText: no ? no : 'No'
    }).then(result => result.isConfirmed);
}

export function selectPopUp(items: string[], fieldName: string){
    let target = document.getElementById(fieldName) as HTMLInputElement;
    const ul = document.createElement('ul');
    // ul.style.listStyleType = 'none';
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        li.style.cursor = 'pointer';
        li.style.padding = '5px';
        li.addEventListener('click', (event) => {
            target.value = item;
            answersStore.updateAnswer(fieldName, item);
            Swal.close();
        });
        ul.appendChild(li);
    });

    Swal.fire({
        title: 'Select an option',
        html: ul,
        showConfirmButton: false
    });
}

export function getQuerySelector(q_name: string, q_type: string = 'text'): HTMLElement {
    if(q_type == 'checkbox'){
        return document.querySelector(`[name="${q_name}[]"]`).parentElement.parentElement;
    }else
        if(q_type == 'radio' || q_type == 'boolean') {
        return document.querySelector(`[name="${q_name}"]`).parentElement.parentElement;
    }
    return document.querySelector(`[name="${q_name}"]`);
}

export function getNextObject(q_name: string, q_type: string = 'text', level: number = 0): any {
    let nextObject: Element = getQuerySelector(q_name, q_type).parentElement;
    for (let i = 0; i < level; i++) {
        if (nextObject.nextElementSibling) {
            nextObject = nextObject.nextElementSibling;
        } else {
            return null; // Return null if there are not enough siblings
        }
    }
    return nextObject.childNodes.item(1) as HTMLInputElement;
}

export function getQuestionType(q_name: string): string{
    let pages = schemaStore.schema.pages;
    let questionType;
    for (const page of pages) {
        for (const group of page.groups) {
            for (const question of group.questions) {
                if (question.name === q_name) {
                    questionType = question.question_type;
                    break;
                }
            }
            if (questionType) break;
        }
        if (questionType) break;
    }
    return questionType;
}

export function getConditionals(q_name: string){
    let pages = schemaStore.schema.pages;
    let cond_qids;
    for (const page of pages) {
        for (const group of page.groups) {
            for (const question of group.questions) {
                if (question.name === q_name) {
                    cond_qids = question.cond_q_ids;
                    break;
                }
            }
            if (cond_qids) break;
        }
        if (cond_qids) break;
    }
    return cond_qids;
}

export function getNewAddMoreName(name: string, newIndex: number): string {
    const parts = name.split('_');
    parts[parts.length - 1] = newIndex.toString();
    return parts.join('_');
}

export function extractQidByName(name: string): number {
    const parts = name.split('_');
    return +parts[0];
}
export function extractCounterByName(name: string): number {
    const parts = name.split('_');
    return parts[1] ? +parts[1] : -1;
}

export function getNewCondQids(old_cond_q_ids: { [key: string]: string[] }, counter: number) {
    if(old_cond_q_ids == undefined){
        return old_cond_q_ids;
    }
    const new_cond_q_ids = JSON.parse(JSON.stringify(old_cond_q_ids));
    let newKey: string;
    Object.keys(old_cond_q_ids).forEach(function (key, values){
        newKey = getNewAddMoreName(key, counter);
        new_cond_q_ids[newKey] = old_cond_q_ids[key];
        delete new_cond_q_ids[key];
    });
    return new_cond_q_ids;
}

export function getNewReadOnly(oldReadOnly: any, counter: number){
    if(oldReadOnly == undefined){
        return oldReadOnly;
    }
    const new_readOnly = JSON.parse(JSON.stringify(oldReadOnly));
    new_readOnly.counter = counter;
    return new_readOnly;
}

export function showAddMore(pindex: number, gindex: number, group_id: number):boolean{
    let pages = schemaStore.schema.pages;
    let counter = -1;
    let found = false;
    let tmp = 0;
    pages[pindex].groups.forEach(function (group, index) {
        if (group.group_id == group_id) {
            if (!found) {
                tmp = index;
                found = true;
            }
            counter++;
        }
    });
    tmp = tmp + counter;
    return tmp == gindex;
}
export function findLastIndexByGroupId(groups: GroupSchema[], groupId: number): number {
    let lastIndex = -1;
    for (let i = 0; i < groups.length; i++) {
        if (groups[i].group_id === groupId) {
            lastIndex = i;
        }
    }
    return lastIndex;
}
export function findMaxCounterByGroupId(groups: GroupSchema[], groupId: number): number {
    let maxCounter = 0;
    groups.forEach(function (group, index){
        if (group.group_id === groupId && group.add_more_counter > maxCounter) {
            maxCounter = group.add_more_counter;
        }
    });
    return maxCounter;
}

export function appendSymbol(element: HTMLElement, symbol: string){
    const span = document.createElement("span"); // show input
    span.textContent = symbol;
    element.appendChild(span);
}

export function updateReadOnlyValues(question_name:string){
    const readOnlyQuestions = schemaStore.readOnlyQuestions();
    if(readOnlyQuestions){
        const parts = question_name.split('_');
        let qid = +parts[0];
        let counter: number = -1;
        if(parts.length > 1) counter = +parts[1];

        let q1, q2, operator, readOnlyQ;

        readOnlyQuestions.forEach(function(q){
            if(counter >= 0){
                if((q.q1 === qid || q.q2 === qid) && q.counter === counter){
                    q1 = q.q1.toString();
                    q2 = q.q2.toString();
                    operator = q.operator;
                    readOnlyQ = q.readonly_id;
                }
            }else{
                if((q.q1 === qid || q.q2 === qid)){
                    q1 = q.q1.toString();
                    q2 = q.q2.toString();
                    operator = q.operator;
                    readOnlyQ = q.readonly_id;
                }
            }

        });
        if(counter >= 0){
            q1 =  q1 + '_' + counter;
            q2 =  q2 + '_' + counter;
            readOnlyQ = readOnlyQ + '_' + counter;
        }else{
            q1 =  q1;
            q2 =  q2;
            readOnlyQ = readOnlyQ;
        }
        if(q1 && q2 && answersStore.getAnswer(q1) && answersStore.getAnswer(q2)){
            let ans: number;
            switch (operator) {
                case '-':
                    ans = +answersStore.getAnswer(q1) - +answersStore.getAnswer(q2);
                    break;
                case '*':
                    ans = +answersStore.getAnswer(q1) * +answersStore.getAnswer(q2);
                    break;
                case '/':
                    ans = +answersStore.getAnswer(q1) / +answersStore.getAnswer(q2);
                    break;
                default:
                    ans = +answersStore.getAnswer(q1) + +answersStore.getAnswer(q2);
                    break;
            }
            let inputs = document.getElementsByName(readOnlyQ);
            const input = inputs[0] as HTMLInputElement;
            input.value = ans.toString();
            answersStore.updateAnswer(readOnlyQ, ans.toString());
        }
    }
}

export function countValues(question: any): number{
    const parts = question.name.split('_');
    let qid = +parts[0];
    let counter: number = -1;
    let total = 0;
    let other_total = 0;
    if(parts.length > 1) counter = +parts[1];

    if(counter >= 0){
        for (let i= 0; i < 20; i++){
            if(answersStore.getAnswer(qid + '_' + i)) {
                total += +answersStore.getAnswer(qid + '_' + i);
                other_total += countInputRestrictedQValues(i, question.input_restricted_qs);
            }
        }
    }else {
        total = +answersStore.getAnswer(question.name);
        other_total = countInputRestrictedQValues(counter, question.input_restricted_qs);
    }
    return total + other_total;
}

export function countInputRestrictedQValues(counter: number, question_ids: string): number{
    let input_restricted_qs = question_ids.split('||');
    let count = 0;
    input_restricted_qs.forEach(function (qid){
        if(counter >= 0){
            count += answersStore.getAnswer(qid+'_'+counter) ? +answersStore.getAnswer(qid+'_'+counter) : 0;
        }else{
            count += answersStore.getAnswer(qid) ? +answersStore.getAnswer(qid) : 0;
        }
    });
    return +count;
}

export function getDistinctMsgs(obj: ValidationRule[]){
    const uniqueMsgs = new Set();
    const uniqueArray = obj.filter(element => {
        const isDuplicate = uniqueMsgs.has(element.errorMessage);
        uniqueMsgs.add(element.errorMessage);
        return !isDuplicate;
    });
    return uniqueArray;
}
export function getDistinctQInstances(obj: Question[]){
    const uniqueMsgs = new Set();
    const uniqueArray = obj.filter(element => {
        const isDuplicate = uniqueMsgs.has(element.name);
        uniqueMsgs.add(element.name);
        return !isDuplicate;
    });
    return uniqueArray;
}

export function replaceNotation(label: string): string{
    const regex = /#\w+#/g;
    const matches = label.match(regex);
    if (matches) { // Output: ['#q1#', '#q2#']
        matches.forEach(function (var_name){
            let q_name = getQuestionNameByVarName(var_name.replace('#', ''));
            let answer = answersStore.getAnswer(q_name);
            if(answer){
                if (typeof answer === "string") {
                    label.replace(var_name, answer)
                }else{
                    label.replace(var_name, answer.toString)
                }
            }
        });
    }
    return label;
}

export function getQuestionNameByVarName(var_name: string): string{
    let pages = schemaStore.schema.pages;
    let question_name = '';
    for (const page of pages) {
        for (const group of page.groups) {
            for (const question of group.questions) {
                if (question.variable_name === var_name) {
                    question_name = question.name;
                    break;
                }
            }
            if (question_name) break;
        }
        if (question_name) break;
    }
    return question_name;
}

export function backButton(){
    const back_btn = document.createElement("div");
    back_btn.className = 'flex text-lg items-center cursor-pointer';
    const arrow = document.createElement("span");
    arrow.innerHTML = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><g clip-path=\"url(#clip0_1579_3171)\">" +
        "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M17 9.0003H5.14L8.77 4.6403C9.12346 4.21504 9.06526 3.58376 8.64 3.2303C8.21474 2.87684 7.58346 2.93504 7.23 3.3603V3.3603L2.23 9.3603H2.23C2.19636 9.40802 2.16628 9.45816 2.14 9.5103C2.14 9.5603 2.14 9.5903 2.07 9.6403H2.07C2.02467 9.75496 2.00094 9.87701 2 10.0003L2 10.0003C2.00094 10.1236 2.02467 10.2456 2.07 10.3603C2.07 10.4103 2.07 10.4403 2.14 10.4903C2.16628 10.5424 2.19636 10.5926 2.23 10.6403L7.23 16.6403C7.42036 16.8688 7.70257 17.0008 8 17.0003C8.23365 17.0008 8.46009 16.9194 8.64 16.7703C9.06517 16.4178 9.12409 15.7874 8.7716 15.3622C8.77107 15.3616 8.77053 15.3609 8.77 15.3603L5.14 11.0003H17C17.5523 11.0003 18 10.5526 18 10.0003C18 9.44801 17.5523 9.0003 17 9.0003V9.0003Z\" fill=\"#475569\"/>" +
        "</g><defs><clipPath id=\"clip0_1579_3171\"><rect width=\"20\" height=\"20\" rx=\"10\" fill=\"white\"/></clipPath></defs></svg>";
    back_btn.appendChild(arrow);
    const arrow_text = document.createElement("span");
    arrow_text.textContent = 'Back';
    back_btn.appendChild(arrow_text);
    return back_btn;
}
export function nextButton(){
    const next_btn = document.createElement("div");
    next_btn.className = 'flex text-lg items-center cursor-pointer flex-row-reverse';
    const arrow = document.createElement("span");
    next_btn.innerHTML = "<svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'><g clip-path='url(#clip0_1579_3172)'>" +
        "<path fill-rule='evenodd' clip-rule='evenodd' d='M3 11.0003H14.86L11.23 15.3603C10.8765 15.7856 10.9347 16.4169 11.36 16.7703C11.7853 17.1238 12.4165 17.0656 12.77 16.6403L17.77 10.6403H17.77C17.8036 10.5926 17.8337 10.5424 17.86 10.4903C17.86 10.4403 17.86 10.4103 17.93 10.3603H17.93C17.9753 10.2456 17.9991 10.1236 18 10.0003L18 10.0003C17.9991 9.87701 17.9753 9.75496 17.93 9.6403C17.93 9.5903 17.93 9.5603 17.86 9.5103C17.8337 9.45816 17.8036 9.40802 17.77 9.3603L12.77 3.3603C12.5796 3.1318 12.2974 3 12 3.0003C11.7663 3 11.5399 3.08136 11.36 3.2303C10.9348 3.58282 10.8759 4.21324 11.2284 4.63847C11.2289 4.63911 11.2295 4.63977 11.23 4.6403L14.86 9.0003H3C2.44772 9.0003 2 9.44801 2 10.0003C2 10.5526 2.44772 11.0003 3 11.0003V11.0003Z' fill='#475569'/>" +
        "</g><defs><clipPath id='clip0_1579_3172'><rect width='20' height='20' rx='10' fill='white'/></clipPath></defs></svg>";
    next_btn.appendChild(arrow);
    const arrow_text = document.createElement("span");
    arrow_text.textContent = 'Next';
    next_btn.appendChild(arrow_text);
    return next_btn;
}