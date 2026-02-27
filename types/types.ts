export type Keyword =
    | "READ"
    | "DISPLAY"
    | "SET"
    | "COMPUTE"
    | "ADD"
    | "SUBTRACT"
    | "IF"
    | "THEN"
    | "ENDIF"
    | "ELSE"
    | "WHILE"
    | "ENDWHILE"
    | "DO"
    | "REPEAT"
    | "UNTIL"
    | "FOR"
    | "ENDFOR"
    | "HALT"
    | "TO"
    | "TRUE"
    | "FALSE"
    | "FROM";

export enum TokenType {
    Keyword = "Keyword",
    Identifier = "Identifier",
    Number = "Number",
    String = "String", // ""

    // Operators
    Plus = "Plus", // +
    Minus = "Minus", // -
    Multiply = "Multiply", // *
    Divide = "Divide", // /

    // Relational Operators
    Equals = "Equals", // ==
    NotEquals = "NotEquals", // !=
    Greater = "Greater", // >
    Less = "Less", // <
    GreaterEquals = "GreaterEquals", // >=
    LessEquals = "LessEquals", // <=

    // Punctuation
    ParenL = "ParenL", // (
    ParenR = "ParenR", // )

    EOF = "EOF",
    Unknown = "Unknown",
}

export type ASTNodeType =
    | "Program"
    | "ReadStatement"
    | "DisplayStatement"
    | "SetStatement"
    | "ComputeStatement"
    | "AddStatement"
    | "SubtractStatement"
    | "IfStatement"
    | "WhileStatement"
    | "DoWhileStatement"
    | "RepeatUntilStatement"
    | "ForStatement"
    | "HaltStatement"
    | "NumericLiteral"
    | "StringLiteral"
    | "BooleanLiteral"
    | "Identifier"
    | "BinaryExpression";
