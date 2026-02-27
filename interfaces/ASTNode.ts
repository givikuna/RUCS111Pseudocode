import { ASTNodeType } from "../types/types";

export interface ASTNode {
    type: ASTNodeType;
    line?: number;
    col?: number;
}

export interface Identifier extends ASTNode {
    type: "Identifier";
    name: string;
}

export interface NumericLiteral extends ASTNode {
    type: "NumericLiteral";
    value: number;
}

export interface StringLiteral extends ASTNode {
    type: "StringLiteral";
    value: string;
}

export interface BooleanLiteral extends ASTNode {
    type: "BooleanLiteral";
    value: boolean;
}

export interface BinaryExpression extends ASTNode {
    type: "BinaryExpression";
    operator: string;
    left: Expression;
    right: Expression;
}

export type Expression = Identifier | NumericLiteral | StringLiteral | BooleanLiteral | BinaryExpression;

//

export interface ReadStatement extends ASTNode {
    type: "ReadStatement";
    variable: Identifier;
}

export interface DisplayStatement extends ASTNode {
    type: "DisplayStatement";
    value: Expression;
}

export interface SetStatement extends ASTNode {
    type: "SetStatement";
    variable: Identifier;
    value: Expression;
}

export interface ComputeStatement extends ASTNode {
    type: "ComputeStatement";
    variable: Identifier;
    value: Expression;
}

export interface AddStatement extends ASTNode {
    type: "AddStatement";
    value: Expression;
    variable: Identifier;
}

export interface SubtractStatement extends ASTNode {
    type: "SubtractStatement";
    value: Expression;
    variable: Identifier;
}

export interface IfStatement extends ASTNode {
    type: "IfStatement";
    condition: Expression;
    thenBranch: Statement[];
    elseBranch?: Statement[];
}

export interface WhileStatement extends ASTNode {
    type: "WhileStatement";
    condition: Expression;
    body: Statement[];
}

export interface DoWhileStatement extends ASTNode {
    type: "DoWhileStatement";
    body: Statement[];
    condition: Expression;
}

export interface RepeatUntilStatement extends ASTNode {
    type: "RepeatUntilStatement";
    body: Statement[];
    condition: Expression;
}
export interface ForStatement extends ASTNode {
    // subject to change
    type: "ForStatement";
    variable: Identifier;
    start: Expression;
    end: Expression;
    step?: Expression;
    body: Statement[];
}

export interface HaltStatement extends ASTNode {
    type: "HaltStatement";
}

export type Statement =
    | ReadStatement
    | DisplayStatement
    | SetStatement
    | ComputeStatement
    | AddStatement
    | SubtractStatement
    | IfStatement
    | WhileStatement
    | DoWhileStatement
    | RepeatUntilStatement
    | ForStatement
    | HaltStatement;
