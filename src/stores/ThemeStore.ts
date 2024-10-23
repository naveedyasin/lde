import {makeAutoObservable} from "mobx";
import {themes, defaultTheme} from "../core/Themes";

interface Theme{
    containerClass: string;
    pageClass: string;
    groupClass: string;
    questionClass: string;
    inputClass: string;
    labelClass: string;
    radioInput: string;
    radioLabel: string;
    selectInput: string;
    errorMsgClass: string;
}

class ThemeStore{

    theme: typeof defaultTheme;

    constructor() {
        makeAutoObservable(this);
    }

    setTheme(themeName: keyof typeof themes){
        this.theme = themes[themeName];
    }

}

export const themeStore = new ThemeStore();