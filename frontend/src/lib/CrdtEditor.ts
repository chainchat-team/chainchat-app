// import { CharType } from '../types/Char';
// import { Descendant } from '../types/Descendant';
// import { Transforms, InsertTextOperation, Path, Point, path, Editor } from 'slate';
// import Char from './interfaces/Char';
// import { Characters } from '../types/Characters';
// import { Element } from '../types/Element';
// class CrdtEditor {
//     strategyCache: boolean[];
//     children: Descendant[]
//     siteId: string
//     base: number
//     boundary: number
//     constructor(siteId: string, base: number = 32, boundary: number = 10) {
//         this.strategyCache = [];
//         this.siteId = siteId;
//         this.base = base;
//         this.boundary = boundary;
//         this.children = []
//     }

//     /**
//      * This should tell us where in the tree we should add
//      */
//     handleLocalInsert(operation: InsertTextOperation): void {
//         // {type: 'insert_text', path: [0,0], offset: 31, text: 'a'}
//         // check if the nodes at Point exist
//         // we need to create nodes at that path if
//         const newChar = this.generateChar(operation)
//         this.insertChar(newChar, operation)
//     }
//     generateChar(operation: InsertTextOperation): Char {
//         return new Char();
//     }
//     insertChar(char: Char, point: Point) {
//         //what if the point doesn't exist???
//         //eg. path=[0,0,0,0,0]
//         Transforms.insertText()

//         let descendants: Descendant[] = this.children;
//         for (let i = 0; i < point.path.length; i++) {
//             const childIndex = point.path[i]
//             if (descendants[childIndex] === undefined) {
//                 insertNode(path, node);
//                 insertNode(path, node);
//             }

//             if (i === point.path.length - 1) {
//                 (descendants[childIndex] as Characters).text.splice(point.offset, 0, char)
//             } else {
//                 descendants = (descendants[childIndex] as Element).children
//             }
//         }

//     }

//     insertNode(path: Path, nodeType: string) {
//         //This function should be applicaable for Node: Element
//         let descendants: Descendant[] = this.children;
//         for (let i = 0; i < path.length; i++) {
//             descendants = this.children[i].children;
//         }
//     }

//     /**
//      * Property 'text' does not exist on type 'Descendant'.
//   Property 'text' does not exist on type 'Element'.
//      */

// }
