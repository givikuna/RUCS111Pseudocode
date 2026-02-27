import * as AST from "../interfaces/ASTNode";

import { Program } from "../interfaces/Program";
import { Token } from "../interfaces/Token";

import { Keyword, TokenType } from "../types/types";

export class Parser {
    private tokens: Token[];
    private current: number = 0;

    public constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    // parsing

    // returns type of Program | void instead of just Program in order to avoid issues from vscode yelling at me
    public parse(): Program | void {
        const statements: AST.Statement[] = [];

        while (!this.atEOF()) {
            if (this.checkKeyword("HALT")) {
                this.advance();
                statements.push({ type: "HaltStatement", line: this.previous().line, col: this.previous().idx });
                break;
            }
            // parse statement (implement a method)
        }
    }

    // TO-DO:
    // Implement a method(s) for parsing statements
    // for expressions/terms

    // checks

    private atEOF(): boolean {
        return this.peek().type === TokenType.EOF;
    }

    // commenting so vscode wont yell at me
    /*

    private checkType(tokenType: TokenType): boolean {
        if (this.atEOF()) return false;
        return this.peek().type === tokenType;
    }

    */

    private checkKeyword(keyword: Keyword): boolean {
        if (this.atEOF()) return false;
        return this.peek().type === TokenType.Keyword && this.peek().value === keyword;
    }

    // advance forward or backward

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

    // commenting so vscode wont yell at me
    /*

    private consume(
        tokenType: TokenType,
        message: string = `Error at line ${this.peek().line} on index ${this.peek().idx}`,
    ): Token {
        if (this.checkType(tokenType)) return this.advance();
        throw new Error(message);
    }

    */
}
