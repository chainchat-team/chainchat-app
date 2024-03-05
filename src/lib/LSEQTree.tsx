// import { Queue } from "typescript-collections";

// export type Identifier = {
//     digit: number,
//     siteId: string,
// }

// export type TreeNode = {
//     children: TreeNode[]
//     identifier: Identifier
// }

// export type Allocation = {
//     parentIdentifier: Identifier
//     identifier: Identifier
// }

// export type LSEQTreeSerializable = {
//     root: TreeNode,
//     strategyCache?: boolean[],
//     siteId?: number,
//     base?: number,
//     boundary?: number,
// }

// class LSEQTree {
//     strategyCache: boolean[];
//     root: TreeNode;
//     siteId: string
//     base: number
//     boundary: number
//     constructor(siteId: string, base: number = 32, boundary: number = 10) {
//         this.strategyCache = [];
//         this.siteId = siteId;
//         this.base = base;
//         this.boundary = boundary;
//         this.root = { children: [], identifier: { digit: -1, siteId: this.siteId } };
//         this.initTree();
//     }
//     /**
//      * Initalize the tree with 2 starting node
//      */
//     initTree() {
//         const node1 = { children: [], identifier: { digit: 0, siteId: this.siteId } }
//         const node2 = { children: [], identifier: { digit: this.base - 1, siteId: this.siteId } }
//         this.root.children.push(node1)
//         this.root.children.push(node2)
//     }
//     /**
//      * Find node with particular Identifier in the tree
//      */
//     findNode(identifier: Identifier): TreeNode | undefined {
//         const queue = new Queue<TreeNode>();
//         queue.enqueue(this.root);
//         while (!queue.isEmpty()) {
//             const numOfChildren: number = queue.size()
//             for (let i = 0; i <= numOfChildren; i++) {
//                 const node = queue.dequeue();
//                 if (node!.identifier.digit === identifier.digit
//                     && node!.identifier.siteId === identifier.siteId) {
//                     return node;
//                 }
//                 node!.children.forEach(child => queue.enqueue(child))
//             }
//         }
//         return undefined
//     }

//     /**
//      * If the node doesn't exist we return empty list. Else, return it's path
//      */
//     retreviePath(identifier: Identifier): Identifier[] | undefined {
//         const dfs = (node: TreeNode, currPath: Identifier[]): Identifier[] => {
//             currPath.push(node.identifier)
//             if (node!.identifier.digit === identifier!.digit
//                 && node!.identifier.siteId === identifier!.siteId) {
//                 return currPath
//             }
//             let path: Identifier[] = []
//             for (const child of node.children) {
//                 path = dfs(child, currPath.slice())
//                 if (path.length) {
//                     break;
//                 }
//             }
//             return path;
//         }
//         const path = dfs(this.root, [])
//         return path.length ? path : undefined;
//     }

//     /**
//      * Given a (0-indexed) depth of a tree, get the +/- depth strategy.
//      * + strategy is represented as `true`.
//      * - strategy is represented as `false`.
//      * @param level
//      * @returns
//     */
//     retrieveStrategy(level: number): boolean {
//         const strategy = this.strategyCache.length - 1 <= level ? this.strategyCache[level] : Math.random() >= 0.5
//         this.strategyCache[level] = strategy
//         return strategy
//     }

//     /**
//      * Given 2 nodes, return the parent node for which the new node may fall under
//      */
//     retreiveAllocation(identifier1: Identifier, identifier2: Identifier): Allocation {
//         let depth: number = 0
//         let interval: number = 0
//         let path1 = this.retreviePath(identifier1)
//         let path2 = this.retreviePath(identifier2)
//         if (path1 === undefined) {
//             throw new Error("node1 doesn't exist in the tree");
//         }
//         if (path2 === undefined) {
//             throw new Error("node1 doesn't exist in the tree");
//         }
//         let val1 = 0;
//         let val2 = this.base;
//         while (interval < 1) {
//             val1 = path1[depth] !== undefined ? path1[depth].digit : 0;
//             val2 = path2[depth] !== undefined ? path2[depth].digit : this.base;
//             interval = Math.max(val2, val1) - Math.min(val2, val1) - 1
//             depth++;
//         }
//         depth -= 1;

//         const step = Math.min(this.boundary, interval)

//         const strategy = this.retrieveStrategy(depth)

//         let digit;
//         if (strategy) {
//             const addValue = Math.floor(Math.random() * (step - 0)) + step
//             // digit = path1[depth].digit + addValue;
//             digit = val1 + addValue;
//         } else {
//             const subValue = Math.floor(Math.random() * (step - 0)) + step
//             digit = val2 - subValue;
//         }

//         const parentDepth = strategy ? Math.min(path1.length - 1, depth) : Math.min(path2.length - 1, depth);
//         const parentIdentifier = strategy ? path1[parentDepth] : path2[parentDepth]
//         return { parentIdentifier: parentIdentifier, identifier: { digit: digit, siteId: this.siteId } }

//     }

//     /**
//      * Adds node to the tree, between 2 given nodes
//      */
//     addNode(identifier1: Identifier, identifier2: Identifier) {
//         const allocation = this.retreiveAllocation(identifier1, identifier2)
//         const parent = this.findNode(allocation.parentIdentifier)
//         const newNode: TreeNode = { children: [], identifier: allocation.identifier }
//         if (parent !== undefined) {
//             parent.children.push(newNode)
//         } else {
//             throw new Error(`Node not found with Identifier: ${allocation.parentIdentifier}`)
//         }
//     }

//     static fromJson(data: LSEQTreeSerializable): LSEQTree {
//         const tree = new LSEQTree(
//             data.siteId ? data.siteId : 1,
//             data.base ? data.base : 32,
//             data.boundary ? data.boundary : 10
//         )
//         tree.root = data.root
//         tree.strategyCache = data.strategyCache ? data.strategyCache : []
//         return tree;
//     }

//     drawTree(node: TreeNode, depth: number = 0, isLastChild: boolean = true): string {
//         const indent = "  ".repeat(depth);
//         const branch = isLastChild ? "└─" : "├─";
//         let result = `${indent}${branch}${node.identifier.digit},${node.identifier.siteId}\n`;

//         for (let i = 0; i < node.children.length; i++) {
//             const child = node.children[i];
//             const isLast = i === node.children.length - 1;
//             result += this.drawTree(child, depth + 1, isLast);
//         }

//         return result;
//     }

// }

// export default LSEQTree
