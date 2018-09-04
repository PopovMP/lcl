"use strict";

class Interpreter {
    private isDebug: boolean;
    private callback: Function | undefined;

    constructor() {
        this.isDebug = false;
        this.callback = undefined;
    }

    public evalCodeTree(codeTree: any[], callback?: Function): any {
        this.callback = callback;

        const res: any = this.evalExprLst(codeTree, []);

        if (callback) {
            callback(res);
        } else {
            return res;
        }
    }

    public evalExprLst(exprLst: any[], env: any[]): void {
        let res: any;
        for (const expr of exprLst) {
            res = this.evalExpr(expr, env);
        }
        return res;
    }

    public evalExpr(expr: any, env: any[]): any {
        switch (typeof expr) {
            case "string"   :
                return this.lookup(expr, env);
        }

        switch (expr[0]) {
            case "list" :
                return this.mapExprLst(expr.slice(1), env);
            case "string" :
                return expr[1];
        }

        if (this.isDebug) {
            this.isDebug = false;
            this.dumpState(expr, env);
        }

        switch (expr[0]) {
            case "λ":
                return this.evalLambda(expr, env);
            case "let" :
                return this.evalLet(expr, env);
            case "print" :
                return this.evalPrint(expr, env);
            case "debug" :
                return this.evalDebug();
        }

        return this.callProc(expr, env);
    }

    public mapExprLst(exprLst: any[], env: any[]): any[] {
        const res: any[] = [];
        for (const expr of exprLst) {
            res.push(this.evalExpr(expr, env));
        }
        return res;
    }

    private lookup(symbol: string, env: any[]): any {
        for (let i = env.length - 1; i > -1; i--) {
            if (symbol === env[i][0]) {
                return env[i][1];
            }
        }

        throw `Error: Unbound identifier: ${symbol}`;
    }

    // [func-id, arg1, arg2, ...]
    // [[lambda, [par1, par2, ...], expr], arg1, arg2, ...]
    private callProc(expr: any[], env: any[]): any {
        const proc: string | any[] = expr[0];
        const isNamed: boolean = typeof proc === "string";
        const lambda: any[] | string = isNamed ? this.lookup(<string>proc, env) : this.evalExpr(proc, env);

        if (typeof lambda === "string") {
            const newExpr = expr.slice();
            newExpr[0] = lambda;
            return this.evalExpr(newExpr, env);
        }

        if (!Array.isArray(lambda)) {
            throw `Error: Improper function: ${lambda}`;
        }

        const args: any[] = expr.length === 1 ? [] : expr.length === 2
            ? [this.evalExpr(expr[1], env)]
            : this.mapExprLst(expr.slice(1), env);

        const closureEnv: any[] = this.makeProcEnv(lambda[1], args, lambda[3]);

        return this.evalExpr(lambda[2], closureEnv);
    }

    private makeProcEnv(params: string | string[], args: any[], env: any[]): any[] {
        const closureEnv = env.slice();

        if (typeof params === "string") {
            closureEnv.push([params, args.length > 0 ? args[0] : null]);
        } else {
            for (let i = 0; i < params.length; i++) {
                closureEnv.push([params[i], i < args.length ? args[i] : null]);
            }
        }

        return closureEnv;
    }

    // [λ, par1, par2, ..., ., expr]
    private evalLambda(expr: any[], env: any[]): any[] {
        const lambdaIndex: number = expr.indexOf("λ");
        const dotIndex: number = expr.indexOf(".");

        if (lambdaIndex !== 0) throw "Error: The notation doesn't start with 'λ'.";
        if (dotIndex === -1) throw "Error: There is no . in the lambda notation.";
        if (dotIndex === 1) throw "Error: The lambda notation has no parameters.";
        if (dotIndex === expr.length - 1) throw "Error: The lambda notation has no expression.";

        const params: any[] = expr.slice(1, dotIndex);
        const body: any[] = expr.slice(dotIndex + 1);

        return ["lambda", params, body, env];
    }

    // [let, symbol, expr]
    private evalLet(expr: any[], env: any[]): any {
        const symbol: string = expr[1];
        this.throwOnExistingDef(symbol, env);
        const value: any = this.evalLetValue(expr, env);

        env.push([symbol, value]);

        return value;
    }

    // [let, symbol, λ...]
    // [let, symbol, application]
    private evalLetValue(expr: any[], env: any[]): any {
        const letExpr: any = expr[2];

        const res: any = (Array.isArray(letExpr) && letExpr[0] === "λ")
            ? this.evalLambda(expr.slice(2), env)
            : this.evalExpr(letExpr, env);

        return res;
    }

    private throwOnExistingDef(symbol: string, env: any[]): void {
        for (let i = env.length - 1; i > -1; i--) {
            const cellKey = env[i][0];
            if (cellKey === "#scope#") return;
            if (cellKey === symbol) throw `Error: Identifier already defined: ${symbol}`;
        }
    }

    // [debug]
    private evalDebug(): null {
        this.isDebug = true;
        return null;
    }

    private evalPrint(expr: any[], env: any[]): any {
        const text = this.evalToString(expr, env);
        if (typeof this.callback === "function") {
            this.callback(text);
        }
        return null;
    }

    private evalToString(expr: any[], env: any[]): string {
        function bodyToString(body: any): string {
            if (Array.isArray(body)) {
                if (body[0] === "block") {
                    return body.slice(1).join(" ");
                }

                return body.join(" ");
            }

            return String(body);
        }

        function getText(entity: any): string {
            const type = typeof entity;
            if (entity === null) {
                return "null";
            }

            if (type === "string") {
                return entity;
            }

            if (type === "boolean" || type === "number") {
                return String(entity);
            }

            if (Array.isArray(entity)) {
                if (entity[0] === "lambda") {
                    return "{lambda (" + entity[1].join(" ") + ") (" + bodyToString(entity[2]) + ")}";
                } else {
                    return entity.join(" ");
                }
            }

            return JSON.stringify(entity);
        }

        let text = "";
        if (expr.length === 2) {
            text = getText(this.evalExpr(expr[1], env));
        } else if (expr.length > 2) {
            text = getText(this.mapExprLst(expr.slice(1), env));
        }

        return text;
    }

    private dumpState(expr: any[], env: any[]): null {
        const getCircularReplacer = () => {
            const seen = new WeakSet();
            return (key: string, value: any) => {
                if (typeof value === "object" && value !== null) {
                    if (seen.has(value)) return;
                    seen.add(value);
                }
                return value;
            };
        };

        const envDumpList: string[] = [];
        const maxLength: number = Math.min(env.length - 1, 10);

        for (let i = maxLength; i > -1; i--) {
            const record = env[i];
            envDumpList.push(`${record[0]} : ${JSON.stringify(record[1], getCircularReplacer()).substr(0, 500)}`);
        }

        const envDumpText: string = envDumpList.join("\n      ");
        const message: string = `Expr: ${JSON.stringify(expr)}\nEnv : ${envDumpText}`;

        if (typeof this.callback === "function") {
            this.callback(message);
        }
        return null;
    }
}
