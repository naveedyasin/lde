// questionnaire
export interface SurveySchema {
    title: string;
    currentStep: number;
    pages: PageSchema[];
    countries: Country[];
}

export interface Country{
    id: number;
    name: string;
}

// sections
export interface PageSchema {
    title: string;
    label: string;
    custom_text: string | undefined;
    groups: GroupSchema[];
}

// groups
export interface  GroupSchema {
    title: string;
    group_id: number;
    description?: string;
    helpText?: string;
    questions: QuestionSchema[];
    allow_add_more: boolean;
    max_add_more: number;
    add_more_counter: number;
    add_more_text: string | '';
    remove_add_more_text: string | '';
    add_more_heading: string | '';
}

//Questions
export interface QuestionSchema {
    question_id: number;
    name: string;
    label: string;
    variable_name: string;
    question_type: string;
    default_value: any;
    text_field_width: number;
    is_required: boolean;
    is_recommended: boolean;
    define_symbol: boolean;
    symbol_position: any;
    symbol_val: any;
    question_help: string | null;
    input_length: number | null;
    is_group: boolean;
    is_single_line: number;
    group_btn_text: string | null;
    subsequent?:number;
    validation_type: string;
    input_restriction: number;
    input_restricted_qs: string;
    input_restrict_value: number;
    is_conditional: boolean;
    min_year?: string;
    max_year?: number;
    default_year?:number;
    rules: any;
    options?: Options[];
    list_options?: string[];
    buttonText?: string;
    cond_q_ids?: ConditionalQuestions;
    read_only_questions?: ReadOnlyQuestions;
}
export interface ConditionalQuestions {
    [key: string]: string[];
}
export interface ReadOnlyQuestions {
    counter: number;
    max: number;
    q1: number;
    q2: number;
    q1_type: string;
    q2_type: string;
    operator: string;
    readonly_id: number;
}

export interface Options {
    text: string;
    value: string;
}

// questionnaire config
export interface SurveyConfig {
    schemaUrl: string;
    theme: string;
    pageNo: number;
    onComplete: string;
}

// rules
export interface ValidationRule {
    rule: (value: any) => boolean;
    errorMessage: string;
}

export interface Response {
    questionId: string;
    answer: string | string[];
}