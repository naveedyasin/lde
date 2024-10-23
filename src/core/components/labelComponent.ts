import {QuestionSchema} from "../types/types";
import LabelRequiredComponent from "./labelRequiredComponent";
import {themeStore} from "../../stores/ThemeStore";
import {replaceNotation} from "../utils/helpers";

export default class LabelComponent{
    private label: string;
    private question: QuestionSchema;
    protected theme = themeStore.theme;

    constructor(question: QuestionSchema) {
        this.label = question.label;
        this.question = question;
    }

    render(){
        const label = document.createElement("label");
        // show required component
        const is_required =  new LabelRequiredComponent(this.question);

        label.className = this.theme.labelClass + ' flex';
        label.innerHTML = is_required.render() + this.question.name + ' - ' + replaceNotation(this.question.label);
        if(this.question.question_help){
            label.className += ' flex relative';
            label.innerHTML += '<svg class="h-6 w-6 text-gray-500 self-center"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="12" r="9" />  <line x1="12" y1="17" x2="12" y2="17.01" />  <path d="M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -4" /></svg>';
            const tooltip = document.createElement("div");
            tooltip.className = 'absolute hidden px-2 py-1 text-sm text-white bg-black rounded';
            tooltip.style.bottom = '1.5rem';
            tooltip.id = this.question.name;
            tooltip.textContent = this.question.question_help;

            label.addEventListener('click', () => {
                tooltip.classList.remove('hidden');
                tooltip.classList.add('block');
            });
            label.addEventListener('mouseleave', () => {
                tooltip.classList.remove('block');
                tooltip.classList.add('hidden');
            });
            label.appendChild(tooltip);
        }
        return label;
    }

}