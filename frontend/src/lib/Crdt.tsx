
type Identifier = {
    digit: number,
    siteId: number,
}

type TreeNode = {
    parent: TreeNode | null,
    identifier: Identifier
}





class CRDT {
    base: number
    boundary: number
    strategy: string
    strategyCache: boolean[]
    siteId: number
    constructor(base: number = 32, boundary = 10, strategy = 'random') {
        this.base = base;
        this.boundary = boundary;
        this.strategy = strategy;
        this.strategyCache = [];
        this.siteId = Math.random() * (100 - 1) + 1
    }
    retrieveDepthStrategy(level: number): boolean {
        //true: + 
        //false: -
        const strategy = this.strategyCache.length - 1 <= level ? this.strategyCache[level] : Math.random() >= 0.5
        this.strategyCache[level] = strategy
        return strategy
    }
    getPath(node: TreeNode | null): TreeNode[] {
        const stack: TreeNode[] = [];

        while (node !== null) {
            stack.push(node);
            node = node.parent;
        }
        return stack
    }
    allocation(node1: TreeNode, node2: TreeNode): TreeNode {

        // may be I should implement LEQSTree??
        // TreeNode: {child:} 
        // getting the path is complex but...
        // adding the node to the tree should be eaiser
        let depth: number = 0
        let interval: number = 0
        let path1 = this.getPath(node1)
        let path2 = this.getPath(node2)
        while (interval < 1) {
            let val1 = path1[depth].identifier.digit || 0
            let val2 = path2[depth].identifier.digit || 0
            interval = Math.max(val2, val1) - Math.min(val2, val1) - 1
            depth++;
        }
        depth -= 1;

        const step = Math.min(this.boundary, interval)

        const strategy = this.retrieveDepthStrategy(depth)

        let digit;
        if (strategy) {
            const addValue = Math.floor(Math.random() * (step - 0)) + step
            digit = path1[depth].identifier.digit + addValue;
        } else {
            const subValue = Math.floor(Math.random() * (step - 0)) + step
            digit = path2[depth].identifier.digit - subValue;
        }

        const parent = strategy ? node1 : node2
        return { parent: parent, identifier: { digit: digit, siteId: this.siteId } }

    }
}

