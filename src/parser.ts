"use strict";

class Parser {
    private lambdaChar: string[] = ["λ"];
    private dotChar: string[] = ["."];
    private openParenChars: string[] = ["(", "[", "{"];
    private closeParenChars: string[] = [")", "]", "}"];
    private whiteSpaceChars: string[] = [" ", "\t"];
    private endOfLineChars: string[] = ["\r", "\n"];
    private commentStartChars: string[] = [";"];

    public parse(codeText: string): any[] {
        const codeTree = this.tokenize(codeText);
        const ilTree = this.nest(codeTree);
        return ilTree;
    }

    public tokenize(code: string): any[] {
        const lexList: any[] = [];

        const pushSymbol = (symbol: string): void => {
            if (symbol === "") return;
            lexList.push(symbol);
        };

        for (let i = 0, symbol = ""; i < code.length; i++) {
            const ch = code[i];

            if (ch === '"') {
                const charList: string[] = [];
                for (i++; i < code.length; i++) {
                    const c = code[i];
                    if (c === '"' && i < code.length - 1 && code[i + 1] === '"') {
                        charList.push('"');
                        i++;
                        continue;
                    } else if (c === '"') {
                        break;
                    }
                    charList.push(c);
                }
                const str = charList.join("");
                lexList.push("(", "string", str, ")");
                continue;
            }

            if (this.isLineComment(ch)) {
                for (; i < code.length; i++) {
                    const c = code[i];
                    if (this.isEndOfLine(c)) {
                        break;
                    }
                }
                continue;
            }

            if (this.isParen(ch) || this.isLambda(ch) || this.isDotChar(ch)) {
                pushSymbol(symbol);
                symbol = "";
                lexList.push(ch);
                continue;
            }

            if (this.isWhiteSpace(ch)) {
                pushSymbol(symbol);
                symbol = "";
                continue;
            }

            symbol += ch;
            if (i === code.length - 1) {
                pushSymbol(symbol);
                symbol = "";
            }
        }

        return lexList;
    }

    public nest(tree: any[]): any[] {
        let i: number = -1;

        function pass(list: any[]): any[] {
            if (++i === tree.length) return list;
            const token: string = tree[i];

            if (["{", "[", "("].indexOf(token) > -1) {
                return list.concat([pass([])]).concat(pass([]));
            }

            if ([")", "]", "}"].indexOf(token) > -1) {
                return list;
            }

            return pass(list.concat(token));
        }

        return pass([]);
    }

    private isLambda(ch: string): boolean {
        return this.lambdaChar.indexOf(ch) > -1;
    }

    private isDotChar(ch: string): boolean {
        return this.dotChar.indexOf(ch) > -1;
    }

    private isParen(ch: string): boolean {
        return this.isOpenParen(ch) || this.isCloseParen(ch);
    }

    private isOpenParen(ch: string): boolean {
        return this.openParenChars.indexOf(ch) > -1;
    }

    private isCloseParen(ch: string): boolean {
        return this.closeParenChars.indexOf(ch) > -1;
    }

    private isWhiteSpace(ch: string): boolean {
        return this.whiteSpaceChars.indexOf(ch) > -1 ||
            this.endOfLineChars.indexOf(ch) > -1;
    }

    private isLineComment(ch: string): boolean {
        return this.commentStartChars.indexOf(ch) > -1;
    }

    private isEndOfLine(ch: string): boolean {
        return this.endOfLineChars.indexOf(ch) > -1;
    }
}

if (typeof module === "object") {
    module.exports.Parser = Parser;
}
