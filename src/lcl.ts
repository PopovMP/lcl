"use strict";

class Lcl {
    public evaluate(codeText: string, callback?: Function) {
        const parser = new Parser();
        const interpreter = new Interpreter();

        try {
            const ilCode = parser.parse(codeText);
            return interpreter.evalCodeTree(ilCode, callback);
        } catch (e) {
            if (typeof callback === "function") {
                callback(e.toString());
            } else {
                return e.toString();
            }
        }
    }
}

if (typeof module === "object") {
    module.exports.Lcl = Lcl;
}
