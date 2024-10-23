import {makeAutoObservable} from "mobx";

interface Answer{
    questionId: string,
    answer: string | string[]
}

class AnswersStore{

    answers: Answer[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setAnswers(answers: any){
        // console.log(answers);
        if(answers.length){
            answers.forEach((answer: any) => {
                let questionId: string;
                let multiple = false;
                questionId = answer.question_id;
                if(answer.add_more_counter >= 0){
                    questionId = questionId + answer.add_more_counter
                }
                if(answer.has_options){
                    multiple = true;
                }
                this.updateAnswer(questionId, answer.value, multiple);
            });
        }
        // console.log(this.getAnswers())
    }
    hasAnswers(): boolean {
        return this.answers.length > 0;
    }

    addAnswer(answer: Answer) {
        this.answers.push(answer);
    }

    updateAnswer(questionId: string, newAnswer: string | string[], multiple: boolean = false) {
        const answer = this.answers.find(a => a.questionId == questionId);
        if (answer) {
            if (multiple && Array.isArray(answer.answer)) {
                answer.answer = [...(answer.answer as string[]), ...(Array.isArray(newAnswer) ? newAnswer : [newAnswer])];
            } else {
                answer.answer = newAnswer;
            }
        } else {
            this.addAnswer({ questionId, answer: newAnswer });
        }
    }

    getAnswer(questionId: string): string | string[] | undefined {
        const answer = this.answers.find(a => a.questionId == questionId);
        return answer ? answer.answer : undefined;
    }
    getAnswers(){
        return this.answers.reduce((acc, curr) => {
            acc[curr.questionId] = curr.answer;
            return acc;
        }, {} as { [key: string]: string | string[] });
    }

}

const answersStore = new AnswersStore();
export default answersStore;