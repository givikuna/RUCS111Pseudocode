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

    // parsing

    /*

    public parse(): Program {
        //
    }

    */

    // checks

    private atEOF(): boolean {
        return this.peek().type === TokenType.EOF;
    }

    private checkType(tokenType: TokenType): boolean {
        if (this.atEOF()) return false;
        return this.peek().type === tokenType;
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

    private consume(
        tokenType: TokenType,
        message: string = `Error at line ${this.peek().line} on index ${this.peek().idx}`,
    ): Token {
        if (this.checkType(tokenType)) return this.advance();
        throw new Error(message);
    }
}
