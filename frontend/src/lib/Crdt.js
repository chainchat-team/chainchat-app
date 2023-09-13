var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var e_1, _a;
var TreeNode = /** @class */ (function () {
    function TreeNode(id, parent) {
        if (parent === void 0) { parent = null; }
        this.id = id;
        this.parent = parent;
    }
    return TreeNode;
}());
// // Example usage:
// const root = new TreeNode({ id: 1, siteId: 1 });
// const child1 = new TreeNode({ id: 2, siteId: 1 }, root);
// const child2 = new TreeNode({ id: 3, siteId: 1 }, child1);
// class CRDT {
//     base: number
//     boundary: number
//     strategy: string
//     constructor(base: number = 32, boundary = 10, strategy = 'random') {
//         this.base = base;
//         this.boundary = 10;
//         this.strategy = strategy;
//     }
//     getLevelStrategy(level: number): string {
//         return '+'
//     }
//     * getPath(node: TreeNode | null): Generator<TreeNode, void, void> {
//         const stack: TreeNode[] = [];
//         while (node !== null) {
//             stack.push(node);
//             node = node.parent;
//         }
//         while (stack.length > 0) {
//             yield stack.pop()!;
//         }
//     }
//     allocation(node1: TreeNode, node2: TreeNode) {
//         // let base = Math.pow(2, level) * this.base;
//         // let levelStrategy = this.getLevelStrategy(level)
//         //we need to generate a valid id between node1 and node2
//         //we need to access to parents of node1 and node2
//         // iterate from the first parent 
//         let depth: number = 0
//         let interval: number = 0
//         let generator_1 = this.getPath(node1)
//         let generator_2 = this.getPath(node2)
//         while (interval < 1) {
//             let parent_1 = generator_1.next().value
//             let val_1 = 0
//             if (parent_1 != null) {
//                 val_1 = parent_1.id.digit
//             }
//             let parent_2 = generator_2.next().value
//             let val_2 = 0
//             if (parent_2 != null) {
//                 val_2 = parent_2.id.digit
//             }
//             interval = Math.max(val_2, val_1) - Math.min(val_2, val_1) - 1
//         }
//     }
// }
function getParents(node) {
    var stack;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                stack = [];
                while (node !== null) {
                    stack.push(node);
                    node = node.parent;
                }
                _a.label = 1;
            case 1:
                if (!(stack.length > 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, stack.pop()];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
// Example usage:
var root = new TreeNode({ digit: 1, siteId: 1 });
var child1 = new TreeNode({ digit: 2, siteId: 1 }, root);
var child2 = new TreeNode({ digit: 3, siteId: 1 }, child1);
try {
    for (var _b = __values(getParents(child2)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var parent_1 = _c.value;
        console.log(parent_1.id);
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    }
    finally { if (e_1) throw e_1.error; }
}
