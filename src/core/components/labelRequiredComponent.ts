interface LabelRequired{
    is_required: boolean,
    is_recommended: boolean
}

export default class LabelRequiredComponent{
    private label: LabelRequired;

    constructor(label: LabelRequired) {
        this.label = label;
    }

    render():string{
        let sterik = '*';
        if(this.label.is_required){
            return `<span class="text-red">*
                </span>`;
        }else if(this.label.is_recommended){
            return `<span>*
                </span>`;
        }
        return '';
    }

}