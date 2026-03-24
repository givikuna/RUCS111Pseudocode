import * as AST from "../interfaces/ASTNode";

import { Program } from "../interfaces/Program";
import { Token } from "../interfaces/Token";

import { TokenType } from "../types/types";

export class Parser {
    private tokens: Token[];
    private current: number = 0;

    public constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    // entry

    public parse(): Program {
        const statements: AST.Statement[] = [];

        while (!this.atEOF()) {
            statements.push(this.parseStatement());
        }

        return {
            type: "Program",
            body: statements,
            line: statements[0]?.line ?? 1,
            col: statements[0]?.col ?? 0,
        };
    }

    // parsing

    private parseStatement(): AST.Statement {
        if (this.matchKeyword("READ")) return this.parseRead();
        if (this.matchKeyword("DISPLAY")) return this.parseDisplay();
        if (this.matchKeyword("SET")) return this.parseSet();
        if (this.matchKeyword("COMPUTE")) return this.parseCompute();
        if (this.matchKeyword("ADD")) return this.parseAdd();
        if (this.matchKeyword("SUBTRACT")) return this.parseSubtract();
        if (this.matchKeyword("IF")) return this.parseIf();
        if (this.matchKeyword("WHILE")) return this.parseWhile();
        if (this.matchKeyword("DO")) return this.parseDoWhile();
        if (this.matchKeyword("REPEAT")) return this.parseRepeatUntil();
        if (this.matchKeyword("FOR")) return this.parseFor();
        if (this.matchKeyword("HALT")) return this.parseHalt();

        throw new Error(
            `Unexpected token '${this.peek().value}' at line ${this.peek().line}, col ${this.peek().idx}`,
        );
    }

    private parseRead(): AST.ReadStatement {
        const startToken: Token = this.previous();

        return {
            type: "ReadStatement",
            variable: this.parseIdentifier(),
            line: startToken.line,
            col: startToken.idx,
        };
    }

    private parseDisplay(): AST.DisplayStatement {
        const startToken: Token = this.previous();

        return {
            type: "DisplayStatement",
            value: this.parseExpression(),
            line: startToken.line,
            col: startToken.idx,
        };
    }

    private parseSet(): AST.SetStatement {
        const startToken: Token = this.previous();
        const variable: AST.Identifier = this.parseIdentifier();

        this.consumeKeyword("TO", "Expected 'TO' after variable in SET statement.");

        return {
            type: "SetStatement",
            variable: variable,
            value: this.parseExpression(),
            line: startToken.line,
            col: startToken.idx,
        };
    }

    private parseCompute(): AST.ComputeStatement {
        const startToken: Token = this.previous();
        const variable: AST.Identifier = this.parseIdentifier();

        this.consumeKeyword("AS", "Expected 'AS' after variable in COMPUTE statement.");

        return {
            type: "ComputeStatement",
            variable: variable,
            value: this.parseExpression(),
            line: startToken.line,
            col: startToken.idx,
        };
    }

    private parseAdd(): AST.AddStatement {
        const startToken: Token = this.previous();
        const value: AST.Expression = this.parseExpression();

        this.consumeKeyword("TO", "Expected 'TO' in ADD statement.");

        return {
            type: "AddStatement",
            value: value,
            variable: this.parseIdentifier(),
            line: startToken.line,
            col: startToken.idx,
        };
    }

    private parseSubtract(): AST.SubtractStatement {
        const startToken: Token = this.previous();
        const value: AST.Expression = this.parseExpression();

        this.consumeKeyword("FROM", "Expected 'FROM' in SUBTRACT statement.");

        return {
            type: "SubtractStatement",
            value: value,
            variable: this.parseIdentifier(),
            line: startToken.line,
            col: startToken.idx,
        };
    }

    private parseIf(): AST.IfStatement {
        const startToken: Token = this.previous();
        const condition: AST.Expression = this.parseExpression();

        this.consumeKeyword("THEN", "Expected 'THEN' after IF condition.");

        const thenBranch: AST.Statement[] = [];

        while (!this.checkKeyword("ELSE") && !this.checkKeyword("ENDIF") && !this.atEOF()) {
            thenBranch.push(this.parseStatement());
        }

        const ifNode: AST.IfStatement = {
            type: "IfStatement",
            condition: condition,
            thenBranch: thenBranch,
            line: startToken.line,
            col: startToken.idx,
        };

        if (this.matchKeyword("ELSE")) {
            const elseBranch: AST.Statement[] = [];

            while (!this.checkKeyword("ENDIF") && !this.atEOF()) {
                elseBranch.push(this.parseStatement());
            }

            ifNode.elseBranch = elseBranch;
        }

        this.consumeKeyword("ENDIF", "Expected 'ENDIF' to close IF block.");

        return ifNode;
    }

    private parseWhile(): AST.WhileStatement {
        const startToken: Token = this.previous();
        const condition: AST.Expression = this.parseExpression();

        const body: AST.Statement[] = [];

        while (!this.checkKeyword("ENDWHILE") && !this.atEOF()) {
            body.push(this.parseStatement());
        }

        this.consumeKeyword("ENDWHILE", "Expected 'ENDWHILE' to close WHILE loop.");

        return {
            type: "WhileStatement",
            condition: condition,
            body: body,
            line: startToken.line,
            col: startToken.idx,
        };
    }

    private parseDoWhile(): AST.DoWhileStatement {
        const startToken = this.previous();
        const body: AST.Statement[] = [];

        while (!this.checkKeyword("WHILE") && !this.atEOF()) {
            body.push(this.parseStatement());
        }

        this.consumeKeyword("WHILE", "Expected 'WHILE' at the end of DO block.");

        const condition: AST.Expression = this.parseExpression();

        return {
            type: "DoWhileStatement",
            body: body,
            condition: condition,
            line: startToken.line,
            col: startToken.idx,
        };
    }

    private parseRepeatUntil(): AST.RepeatUntilStatement {
        const startToken: Token = this.previous();
        const body: AST.Statement[] = [];

        while (!this.checkKeyword("UNTIL") && !this.atEOF()) {
            body.push(this.parseStatement());
        }

        this.consumeKeyword("UNTIL", "Expected 'UNTIL' at the end of REPEAT block.");

        const condition: AST.Expression = this.parseExpression();

        return {
            type: "RepeatUntilStatement",
            body: body,
            condition: condition,
            line: startToken.line,
            col: startToken.idx,
        };
    }

    private parseFor(): AST.ForStatement {
        const startToken: Token = this.previous();
        const variable: AST.Identifier = this.parseIdentifier();

        const start: AST.Expression = this.parseExpression();

        this.consumeKeyword("TO", "Expected 'TO' to denote end bound of FOR loop.");

        const end: AST.Expression = this.parseExpression();

        const forNode: AST.ForStatement = {
            type: "ForStatement",
            variable: variable,
            start: start,
            end: end,
            body: [],
            line: startToken.line,
            col: startToken.idx,
        };

        if (this.matchKeyword("STEP")) {
            forNode.step = this.parseExpression();
        }

        const body: AST.Statement[] = [];

        while (!this.checkKeyword("ENDFOR") && !this.atEOF()) {
            body.push(this.parseStatement());
        }

        forNode.body = body;

        this.consumeKeyword("ENDFOR", "Expected 'ENDFOR' to close FOR block.");

        return forNode;
    }

    private parseHalt(): AST.HaltStatement {
        const startToken: Token = this.previous();

        return { type: "HaltStatement", line: startToken.line, col: startToken.idx };
    }

    private createBinaryExpression(
        operator: string,
        left: AST.Expression,
        right: AST.Expression,
    ): AST.BinaryExpression {
        const binExpr: AST.BinaryExpression = {
            type: "BinaryExpression",
            operator,
            left,
            right,
        };

        if (left.line !== undefined) {
            binExpr.line = left.line;
        }
        if (left.col !== undefined) {
            binExpr.col = left.col;
        }

        return binExpr;
    }

    private parseExpression(): AST.Expression {
        return this.parseEquality();
    }

    private parseEquality(): AST.Expression {
        let expr: AST.Expression = this.parseRelational();

        while (this.matchType(TokenType.Equals, TokenType.NotEquals)) {
            expr = this.createBinaryExpression(this.previous().value, expr, this.parseRelational());
        }

        return expr;
    }

    private parseRelational(): AST.Expression {
        let expr: AST.Expression = this.parseAdditive();

        while (this.matchType(TokenType.Greater, TokenType.GreaterEquals, TokenType.Less, TokenType.LessEquals)) {
            expr = this.createBinaryExpression(this.previous().value, expr, this.parseAdditive());
        }

        return expr;
    }

    private parseAdditive(): AST.Expression {
        let expr: AST.Expression = this.parseMultiplicative();

        while (this.matchType(TokenType.Plus, TokenType.Minus)) {
            expr = this.createBinaryExpression(this.previous().value, expr, this.parseMultiplicative());
        }

        return expr;
    }

    private parseMultiplicative(): AST.Expression {
        let expr: AST.Expression = this.parsePrimary();

        while (this.matchType(TokenType.Multiply, TokenType.Divide)) {
            expr = this.createBinaryExpression(this.previous().value, expr, this.parsePrimary());
        }

        return expr;
    }

    private parsePrimary(): AST.Expression {
        if (this.matchType(TokenType.Number)) {
            return {
                type: "NumericLiteral",
                value: Number(this.previous().value),
                line: this.previous().line,
                col: this.previous().idx,
            };
        }

        if (this.matchType(TokenType.String)) {
            return {
                type: "StringLiteral",
                value: this.previous().value,
                line: this.previous().line,
                col: this.previous().idx,
            };
        }

        if (this.matchType(TokenType.Identifier)) {
            const token: Token = this.previous();

            if (token.value === "TRUE" || token.value === "FALSE") {
                return { type: "BooleanLiteral", value: token.value === "TRUE", line: token.line, col: token.idx };
            }

            return { type: "Identifier", name: token.value, line: token.line, col: token.idx };
        }

        if (this.matchType(TokenType.ParenL)) {
            const expr: AST.Expression = this.parseExpression();

            this.consumeType(TokenType.ParenR, "Expected ')' after expression.");

            return expr;
        }

        throw new Error(
            `Expected expression, got '${this.peek().value}' at line ${this.peek().line}, col ${this.peek().idx}`,
        );
    }

    private parseIdentifier(): AST.Identifier {
        this.consumeType(TokenType.Identifier, "Expected identifier.");

        return {
            type: "Identifier",
            name: this.previous().value,
            line: this.previous().line,
            col: this.previous().idx,
        };
    }

    // helpers

    private atEOF(): boolean {
        return this.peek().type === TokenType.EOF;
    }

    private peek(): Token {
        return this.tokens[this.current];
    }

    private previous(): Token {
        return this.tokens[this.current - 1];
    }

    private advance(): Token {
        if (!this.atEOF()) this.current++;

        return this.previous();
    }

    private checkType(tokenType: TokenType): boolean {
        if (this.atEOF()) return false;

        return this.peek().type === tokenType;
    }

    private matchType(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.checkType(type)) {
                this.advance();
                return true;
            }
        }

        return false;
    }

    private consumeType(tokenType: TokenType, message: string): Token {
        if (this.checkType(tokenType)) return this.advance();

        throw new Error(message);
    }

    private checkKeyword(keyword: string): boolean {
        if (this.atEOF()) return false;

        return this.peek().type === TokenType.Keyword && this.peek().value === keyword;
    }

    private matchKeyword(...keywords: string[]): boolean {
        for (const keyword of keywords) {
            if (this.checkKeyword(keyword)) {
                this.advance();
                return true;
            }
        }

        return false;
    }

    private consumeKeyword(keyword: string, message: string): Token {
        if (this.checkKeyword(keyword)) return this.advance();

        throw new Error(message);
    }
}
