import { ASTNodeType } from "../types/types";

export interface ASTNode {
    type: ASTNodeType;
    line?: number;
    column?: number;
}
