// export interface Theme {
//     containerClass: string;
//     pageClass: string;
//     groupClass: string;
//     questionClass: string;
//     inputClass: string;
//     labelClass: string;
//     radioInput: string;
//     radioLabel: string;
//     errorMsgClass: string;
// }

// export const defaultThemes: { [key: string]: Theme } = {
//     default: {
//         containerClass: "survey-container",
//         pageClass: "survey-page",
//         groupClass: "survey-group",
//         questionClass: "survey-question",
//         inputClass: "survey-input",
//         labelClass: "survey-label",
//         radioInput: "radio-input",
//         radioLabel: "radio-label",
//         errorMsgClass: "error-message",
//     },
//     dark: {
//         containerClass: "survey-container-dark",
//         pageClass: "survey-page-dark",
//         groupClass: "survey-group-dark",
//         questionClass: "survey-question-dark",
//         inputClass: "survey-input-dark",
//         labelClass: "survey-label-dark",
//         radioInput: "radio-input-dark",
//         radioLabel: "radio-label-dark",
//         errorMsgClass: "error-message",
//     }
// };

export const lightTheme = {
    containerClass: "survey-container",
    pageClass: "survey-page",
    groupClass: "survey-group",
    questionClass: "survey-question",
    inputClass: "survey-input",
    labelClass: "survey-label",
    radioInput: "radio-input",
    radioLabel: "radio-label",
    selectInput: "select-input",
    errorMsgClass: "error-message",
}
export const darkTheme = {
    containerClass: "survey-container-dark",
    pageClass: "survey-page-dark",
    groupClass: "survey-group-dark",
    questionClass: "survey-question-dark",
    inputClass: "survey-input-dark",
    labelClass: "survey-label-dark",
    radioInput: "radio-input-dark",
    radioLabel: "radio-label-dark",
    selectInput: "select-input-dark",
    errorMsgClass: "error-message",
}

export const defaultTheme = lightTheme;

export const themes = {
    light: lightTheme,
    dark: darkTheme,
}

