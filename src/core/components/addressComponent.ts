import {QuestionSchema} from "../types/types";
import {themeStore} from "../../stores/ThemeStore";
import {fetchApi} from "../utils/FetchApi";
import {POSTCODER_API} from "../config/conf";
import {getNextObject, getQuerySelector} from "../utils/helpers";
import answersStore from "../../stores/AnswersStore";


export default class AddressComponent{
    private question: QuestionSchema;
    private inputElement: HTMLInputElement;
    protected theme = themeStore.theme;

    constructor(question: QuestionSchema, inputElement: HTMLInputElement) {
        this.question = question;
        this.inputElement = inputElement;
    }

    debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
        let timeout: number | undefined;
        return function(this: any, ...args: any[]) {
            clearTimeout(timeout);
            timeout = window.setTimeout(() => func.apply(this, args), wait);
        } as T;
    }

    showOptions(data: any){

        const listElement = document.getElementById('autocomplete-list' + this.inputElement.name) as HTMLUListElement;

        listElement.classList.remove('hidden');

        // hide dropdown list if clicked outside of it
        document.addEventListener('click', (event) => {
            listElement.innerHTML = '';
            listElement.classList.add('hidden');
        });

        if(data?.error){
            listElement.innerHTML = '';
            const listItem = document.createElement('li');
            listItem.textContent = data.error;
            listItem.classList.add('autocomplete-item');
            listItem.addEventListener('click', () => {
                listElement.innerHTML = '';
                listElement.classList.add('hidden');
            });
            listElement.appendChild(listItem);
        }else if(data?.postcode){
            let addresses: string[] = data.postcode;
            if(addresses.length > 0) {
                addresses.forEach(address => {
                    const listItem = document.createElement('li');
                    listItem.textContent = address;
                    listItem.classList.add('autocomplete-item');
                    listItem.addEventListener('click', () => {
                        this.divideAddress(address);
                        listElement.innerHTML = '';
                        listElement.classList.add('hidden');
                    });
                    listElement.appendChild(listItem);
                });
            }
        }
    }

    divideAddress(address: string){

        let addressField = getQuerySelector(this.question.name) as HTMLInputElement;

        if (this.question.subsequent === 0) {
            addressField.value = address;
        } else{
            let filled = 0; // to see how many fields has been filled
            let address_array = address.split(',');
            for(let i = this.question.subsequent; i >= 0; i--){
                let nextObject = getNextObject(this.question.name, this.question.question_type, i);
                if (nextObject) {
                    if(i == 0 || address_array.length <= 1){
                        nextObject.value = address_array.join(',');
                        answersStore.updateAnswer(nextObject.name, nextObject.value);
                        break;
                    }else if(filled >= 2 && address_array.length >= 4){
                        let tempAdd = [];
                        do{
                            tempAdd.push(address_array.pop());
                        }while(address_array.length > i+1);
                        nextObject.value = tempAdd.join(',');
                        answersStore.updateAnswer(nextObject.name, nextObject.value);
                        filled++;
                    }else {
                        nextObject.value = address_array.pop().trim();
                        answersStore.updateAnswer(nextObject.name, nextObject.value);
                        filled++;
                    }
                }
            }
        }
    }

    render(){
        const debouncedFetchData = this.debounce(async (event) => {
            const target = event.target as HTMLInputElement;
            if(target.value.length > 3) {
                await fetchApi.postData(POSTCODER_API, {postcode: target.value})
                    .then(data =>
                        this.showOptions(data)
                    )
                    .catch(error => console.error(error)
                    );
            }
        }, 0);


        this.inputElement.addEventListener("input", debouncedFetchData);
    }

}