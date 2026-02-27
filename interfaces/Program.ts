import { ASTNode, Statement } from "./ASTNode";

export interface Program extends ASTNode {
    type: "Program";
    body: Statement[];
}
