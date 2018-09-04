# LCL - Lambda Calculus Language

Lambda Calculus is a formal system for expressing computations based on functions (**λ**):  https://en.wikipedia.org/wiki/Lambda_calculus

LCL - is a minimalistic programming language that embraces the Lambda Calculus theory and notation.

## Keywords

 - **λ** (lambda) - notation for a function. Example `λx.x`.
 - **.** (dot) - the `.` delimits the function arguments by the function body.
 - **( )** (parenthesis) - express a function application. Example: `(f x)`.
 - **;** - line comment.
 
## Grammar

LCL is designed to be as closed to the Lambda Calculus notation as possible.
It adds some rules for variables binding and printing in order to make the language more practical.

A line of LCL code consists of one of the following:
 - an empty line. The empty lines are ignored.
 - a comment. The comments are ignored.
 - variable binding
 - variable id. If a variable id is not part of a binding, it is printed to the output. 

```
;; A line comment
<var-id> <lambda-abstraction> ; bind a lambda to a variable
<var-id> <application>        ; bind an application result to a varibal
<var-id>                      ; print 'var-id'
```


### Variable identifier 

We can bind a variable to a lambda abstraction or to a function application.
A variable identifier `<var-id>` consist of one or more characters except `;`.
It is separated from its value by one or more spaces or tabs.

Examples for valid bindings;

```
id     λx.x                   ; 'id' is bind to the identity function
1      λf.λx.(f x)            ; '1' is a valid function name
2      λf.λx.(f (f x))        ; '2' is bind to a lambda
++     λn.λf.λx.(f (n (f x))) ; '++' is bind to the successor function
three (++ 2)                  ; bind three to the result of the application of '++' to 2 
```

The binding is immutable. You can bind a variable name only once. 

### Lambda Abstraction - function

A lambda abstraction `λx.t` is a definition of an anonymous function that is capable of taking a single input `x` and substituting it into the expression `t`. 

```λx.t```

A function notation starts with `λ`, it has one parameter (`x`) and returns the expression `t`.

Each function has exactly one parameter and returns one expression. The expression can be a multiple application.

### Application

Application of a function `f` to an argument `x`

```(f x)```

An application is surrounded in parenthesis `(f x)`. LCL resolves nested applications from the innermost one.


### print

```one ;; prints the value of 'one' to the output.```

When a variable name is not part of a binding, it is printed at the output. LCL prints an adjacent comment
to the output before the variable value.  


### Comment

```id λx.x ; Definition of an identity function```

LCL starts a line comment with `;`. A comment continues to the end of the line.
