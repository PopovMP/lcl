# LCL - Lambda Calculus Language

Lambda Calculus is a formal system for expressing computations based on functions (**λ**):  https://en.wikipedia.org/wiki/Lambda_calculus

LCL - is a miniature programming language that embraces the Lambda Calculus theory and notations.

## Keywords

 **Lambda calculus notation**
 - **λ** (lambda) - notation for a function. Example `λx.x`
 - **.** (dot) - the **.** delimits the function arguments by the function body
 - **( )** (parenthesis) - express a function application, when it is necessary.

**Auxiliary notation**
 - **let** - binds a lambda to a name. Example: `let id λx.x`
 - **;** - line comment
 - **print** - prints output
 
## Grammar

LCL is designed to be as closed to the Lambda Calculus notation as possible. However, we add some rules in order to make it easier for parsing.

### Variable binding:

```let varid <lambda-abstraction>```

There is no binding in the original Lambda Calculus. We add variable bindings in LCL to make the language more practical. The `varid` can be any
combination of characters. The variable id cannot start with `λ`.

### Lambda Abstraction - function

A lambda abstraction `λx.t` is a definition of an anonymous function that is capable of taking a single input `x` and substituting it into the expression `t`. 

```λx.t```

A function notation starts with `λ`, it has one parameter (`x`) and returns the expression `t`.

Each function has exactly one parameter and returns one expression.

### Application

Application of a function `f` to an argument `x`

```f x```

An application can be surrounded in parenthesis `(f x)`

### print

```print a```

Prints an expression to the output.

### Comment

```let id λx.x ; Definition of an identity function```

LCL starts a line comment with `;`. A comment continues to the end of the line

