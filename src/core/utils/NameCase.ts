class NameCase{

    constructor() {

    }
    checkName(name: string): boolean{
        return name === name.toLowerCase() || name === name.toUpperCase();
    }

    correctName(name: string): string{
        name = this.normalize(name);
        name = this.correct(name);
        return name;
    }

    private normalize(name: string){
        return name.replace(/\s{2,}/g, ' ');
    }

    private correct(name:string): string{
        name = name.trim().toLowerCase();

        // Split names on regex whitespace, dash or apostrophe, workaround for
        // Javascript regex word boundary \b splitting on unicode characters
        // http://stackoverflow.com/questions/5311618/javascript-regular-expression-problem-with-b-and-international-characters
        var splitters = [
            { s : /\s/, r : " "},
            { s : /\-/, r : "-"},
            { s : /\'/, r : "'"},
            { s : /\"/, r : '"'},
            { s : /\(/, r : "("},
            { s : /\./, r : "."},
            { s : /,/,  r : ","},
            { s : /\//, r : "/"}
        ];

        for (var i = 0; i < splitters.length; i++) {
            var elArr = name.split(splitters[i].s);
            for (var j = 0; j < elArr.length; j++) {
                elArr[j] = elArr[j].charAt(0).toUpperCase() + elArr[j].slice(1);
            }
            name = elArr.join(splitters[i].r);
        }


        // Name case Mcs and Macs
        // Exclude names with 1-2 letters after prefix like Mack, Macky, Mace
        // Exclude names ending in a,c,i,o, or j are typically Polish or Italian
        if (new RegExp(/\bMac[A-Za-z]{2,}[^aciozj]\b/).test(name) ||
            new RegExp(/\bMc/).test(name)) {

            name = name.replace(
                /\b(Ma?c)([A-Za-z]+)/,
                function (x,y,z) {
                    return y + z.charAt(0).toUpperCase() + z.substring(1);
                });

            // Now correct for "Mac" exceptions
            name =  name
                .replace(/\bMacEvicius\b/,  "Macevicius")
                .replace(/\bMacHado\b/,     "Machado")
                .replace(/\bMacHar\b/,      "Machar")
                .replace(/\bMacHin\b/,      "Machin")
                .replace(/\bMacHlin\b/,     "Machlin")
                .replace(/\bMacIas\b/,      "Macias")
                .replace(/\bMacIulis\b/,    "Maciulis")
                .replace(/\bMacKie\b/,      "Mackie")
                .replace(/\bMacKle\b/,      "Mackle")
                .replace(/\bMacKlin\b/,     "Macklin")
                .replace(/\bMacQuarie\b/,   "Macquarie")
                .replace(/\bMacOmber\b/,    "Macomber")
                .replace(/\bMacIn\b/,       "Macin")
                .replace(/\bMacKintosh\b/,  "Mackintosh")
                .replace(/\bMacKen\b/,      "Macken")
                .replace(/\bMacHen\b/,      "Machen")
                .replace(/\bMacHiel\b/,     "Machiel")
                .replace(/\bMacIol\b/,      "Maciol")
                .replace(/\bMacKell\b/,     "Mackell")
                .replace(/\bMacKlem\b/,     "Macklem")
                .replace(/\bMacKrell\b/,    "Mackrell")
                .replace(/\bMacLin\b/,      "Maclin")
                .replace(/\bMacKey\b/,      "Mackey")
                .replace(/\bMacKley\b/,     "Mackley")
                .replace(/\bMacHell\b/,     "Machell")
                .replace(/\bMacHon\b/,      "Machon")
                .replace(/\bMacAyla\b/,     "Macayla");
        }


        // And correct Mac exceptions otherwise missed
        name = name
            .replace(/\bMacmurdo/,        "MacMurdo")
            .replace(/\bMacisaac/,        "MacIsaac")


            // Fixes for "son (daughter) of" etc. in various languages.
            .replace(/\bAl(?=\s+\w)\b/g,  "al")     // al Arabic or forename Al.
            .replace(/\bAp\b/g,           "ap")     // ap Welsh.
            .replace(/\bBen(?=\s+\w)\b/g, "ben")    // ben Hebrew or forename Ben.
            .replace(/\bDell([ae])\b/g,   "dell$1") // della and delle Italian.
            .replace(/\bD([aeiu])\b/g,    "d$1")    // da, de, di Italian; du French.
            .replace(/\bDe([lr])\b/g,     "de$1")   // del Italian; der Dutch/Flemish.
            .replace(/\bEl\b/g,           "el")     // el Greek
            .replace(/\bLa\b/g,           "la")     // la French
            .replace(/\bLe(?=\s+\w)\b/g,  "le")     // le French
            .replace(/\bLo\b/g,           "lo")     // lo Italian
            .replace(/\bVan(?=\s+\w)\b/g, "van")    // van German or forename Van.
            .replace(/\bVon\b/g,          "von")    // von Dutch/Flemish


            // Fixes for roman numeral names, e.g. Henry VIII
            .replace(/\b(?:\d{4}|(?:[IVX])(?:X{0,3}I{0,3}|X{0,2}VI{0,3}|X{0,2}I?[VX]))$/i,
                function (v) {
                    return v.toUpperCase();
                })


            // Nation of Islam 2X, 3X, etc. names
            .replace(/\b[0-9](x)\b/, function (v) { return v.toUpperCase(); } )


            // Somewhat arbitrary rule where two letter combos not containing vowels should be capitalized
            // fixes /JJ Abrams/ and /JD Salinger/
            // With some exceptions
            .replace(/\b[bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ]{2}\s/, function (v) { return v.toUpperCase(); } )
            .replace(/\bMR\.?\b/,         "Mr")
            .replace(/\bMS\.?\b/,         "Ms")
            .replace(/\bDR\.?\b/,         "Dr")
            .replace(/\bST\.?\b/,         "St")
            .replace(/\bJR\.?\b/,         "Jr")
            .replace(/\bSR\.?\b/,         "Sr")
            .replace(/\bLT\.?\b/,         "Lt")


            // lowercase words
            .replace(/\bThe\b/g,          "the")
            .replace(/\bOf\b/g,           "of")
            .replace(/\bAnd\b/g,          "and")
            .replace(/\bY\s/g,            "y")

            // strip extra spaces
            .replace(/\s{2,}/g,           ' ');

        // force first character to be uppercase
        return name.charAt(0).toUpperCase() + name.substring(1);
    }

}
export const nameCase = new NameCase();