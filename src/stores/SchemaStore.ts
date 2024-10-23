import {makeAutoObservable} from "mobx";
import {ReadOnlyQuestions, SurveySchema} from "../core/types/types";


class SchemaStore{

    schema: SurveySchema;

    constructor() {
        makeAutoObservable(this);
    }

    setSchema(schema: SurveySchema){
        this.schema = schema;
    }
    getSchema(){
        return this.schema;
    }
    conditionalQuestions(){
        let conditionalQuestions: { [key: string]: { [key: string]: string[] } } = {};

        // conditionalQuestions['460_0'] = { "463_0": ["male"],
        //     "462_0": ["english, welsh or northern irish","scottish","that of an eu member state (excluding denmark or the republic of ireland)"]
        // };

        this.schema.pages.forEach(page => {
            page.groups.forEach(group => {
                group.questions.forEach(question => {
                    if (question.is_conditional && question.cond_q_ids) {
                        conditionalQuestions[question.name] = question.cond_q_ids;
                    }
                });
            });
        });
        return conditionalQuestions;
    }
    readOnlyQuestions(){
        let readOnlyQuestions: any[] = [];

        // let read_only_questions= [{
        // "counter": 0,
        //     "max": 0,
        //     "q1": 467,
        //     "q2": 472,
        //     "q1_type": "text",
        //     "q2_type": "text",
        //     "operator": "+",
        //     "readonly_id": 473
        //     }];

        this.schema.pages.forEach(page => {
            page.groups.forEach(group => {
                group.questions.forEach(question => {
                    if (question.question_type == 'readonly' && question.read_only_questions) {
                        readOnlyQuestions.push(question.read_only_questions);
                    }
                });
            });
        });
        return readOnlyQuestions;
    }
    inputRestrictedQuestions(){
        let inputRestrictedQuestions: any[] = [];
        this.schema.pages.forEach(page => {
            page.groups.forEach(group => {
                group.questions.forEach(question => {
                    if (question.input_restriction && question.input_restricted_qs) {
                        let input_res_questions = +question.input_restricted_qs.split(',');
                        inputRestrictedQuestions[question.question_id] = input_res_questions;
                    }
                });
            });
        });
        return inputRestrictedQuestions;
    }

    countryList(){
        return this.schema.countries;
    }

}

export const schemaStore = new SchemaStore();