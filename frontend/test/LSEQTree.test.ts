import LSEQTree, { Identifier, TreeNode, LSEQTreeSerializable, Allocation } from '../src/lib/LSEQTree'

describe('LSEQTree Test', () => {
    const createSampleTree = (): LSEQTree => {
        // Define a test TreeNode structure for a hypothetical tree
        const rootNode: TreeNode = {
            children: [
                {
                    children: [
                        {
                            children:
                                [
                                    {
                                        children: [],
                                        identifier: { digit: 15, siteId: 1 }
                                    }
                                ],
                            identifier: { digit: 10, siteId: 1 }
                        },
                        { children: [], identifier: { digit: 5, siteId: 1 } },
                    ],
                    identifier: { digit: 0, siteId: 1 },
                },
                {
                    children: [],
                    identifier: { digit: 32, siteId: 1 },
                },
            ],
            identifier: { digit: -1, siteId: 1 },
        }
        const lseqSerializable: LSEQTreeSerializable = { root: rootNode }

        // Initialize a LEQSTree instance for testing
        const tree = LSEQTree.fromJson(lseqSerializable)
        return tree;
    };
    describe('Initialization Test', () => {
        const tree = new LSEQTree(1, 32, 10);

        expect(tree.root.children.length).toBe(2);
        expect(tree.root.children[0].identifier.digit).toBe(0);
        expect(tree.root.children[1].identifier.digit).toBe(31);
    });




    describe('LEQSTree retrievePath', () => {
        const tree = createSampleTree()
        it('should return the correct path for a leaf node', () => {
            const path = tree.retreviePath(tree.root.children[0].children[0].identifier);

            const expectedPath: Identifier[] = [
                tree.root.identifier, // Root node
                tree.root.children[0].identifier, // First child of root
                tree.root.children[0].children[0].identifier, // First child of the first child
            ];

            expect(path).toEqual(expectedPath);
        });

        it('should return the correct path for a non-leaf node', () => {
            const path = tree.retreviePath(tree.root.children[0].identifier);

            const expectedPath: Identifier[] = [
                tree.root.identifier, // Root node
                tree.root.children[0].identifier, // First child of root
            ];

            expect(path).toEqual(expectedPath);
        });

        it('should return undefined for a non-existent node', () => {
            const nonExistentIdentifier: Identifier = { digit: 100, siteId: 1 };
            const path = tree.retreviePath(nonExistentIdentifier);
            expect(path).toBeUndefined();
        });

    });




    describe('LSEQTree findNode', () => {
        it('should find the root node', () => {
            const tree = createSampleTree();
            const rootNode = tree.findNode({ digit: -1, siteId: 1 });
            expect(rootNode).toBeDefined();
            expect(rootNode!.identifier).toEqual({ digit: -1, siteId: 1 });
        });

        it('should find a child node', () => {
            const tree = createSampleTree();
            const childNode = tree.findNode({ digit: 0, siteId: 1 });
            expect(childNode).toBeDefined();
            expect(childNode!.identifier).toEqual({ digit: 0, siteId: 1 });
        });

        it('should find a grandchild node', () => {
            const tree = createSampleTree();
            const grandchildNode = tree.findNode({ digit: 15, siteId: 1 });
            expect(grandchildNode).toBeDefined();
            expect(grandchildNode!.identifier).toEqual({ digit: 15, siteId: 1 });
        });

        it('should return undefined for a non-existent node', () => {
            const tree = createSampleTree();
            const nonexistentNode = tree.findNode({ digit: 123, siteId: 1 });
            expect(nonexistentNode).toBeUndefined();
        });
    });

    describe('LSEQTree retrieveAllocation', () => {
        let tree: LSEQTree;
        let identifier1: Identifier;
        let identifier2: Identifier;
        let identifier3: Identifier;
        let identifier4: Identifier;
        let allocation: Allocation;

        beforeEach(() => {
            // Initialize a new LSEQTree with your desired parameters
            tree = createSampleTree()
            // Create two test nodes
            identifier1 = { digit: 0, siteId: 1 };
            identifier2 = { digit: 32, siteId: 1 };

            identifier3 = { digit: 15, siteId: 1 }
            identifier4 = { digit: 5, siteId: 1 }

        });

        it('should allocate closer to node1 if strategy is +', () => {
            // Set a specific strategy cache value (true for +)
            tree.strategyCache[1] = true

            // Retrieve allocation for the two nodes
            allocation = tree.retreiveAllocation(identifier1, identifier2);

            // Check if the allocation is closer to node1
            expect(allocation.parentIdentifier).toStrictEqual(identifier1);
        });

        it('should allocate closer to node2 if strategy is -', () => {
            // Set a specific strategy cache value (false for -)
            tree.strategyCache[1] = false;

            // Retrieve allocation for the two nodes
            allocation = tree.retreiveAllocation(identifier1, identifier2);

            // Check if the allocation is closer to node1
            expect(allocation.parentIdentifier).toStrictEqual(identifier2);
        });

        it('should allocate closer to node1 and make correct parent selection', () => {
            tree.strategyCache[2] = true;

            // Retrieve allocation for the two nodes
            allocation = tree.retreiveAllocation(identifier3, identifier4);

            // Check if the allocation is closer to node1
            expect(allocation.parentIdentifier).toStrictEqual({ digit: 10, siteId: 1 });

        });

        it('should allocate correct parent when both retervial paths are idetical', () => {
            tree.strategyCache[2] = true;

            // Retrieve allocation for the two nodes
            allocation = tree.retreiveAllocation({ digit: 5, siteId: 1 }, { digit: 5, siteId: 1 });
            // Check if the allocation is closer to node1
            expect(allocation.parentIdentifier).toStrictEqual({ digit: 5, siteId: 1 });

        });

    });


    describe('LSEQTree addNode', () => {

        it('should add a new node between two existing nodes', () => {
            // Arrange: Create an LSEQTree and two existing nodes
            const tree = new LSEQTree(1);
            tree.retreiveAllocation = () => {
                return { parentIdentifier: { digit: -1, siteId: 1 }, identifier: { digit: 7, siteId: 1 } }
            }


            // Act: Add a new node between node1 and node2
            tree.addNode({ digit: 5, siteId: 1 }, { digit: 10, siteId: 1 });

            // Assert: Verify that the new node is added in the correct position
            expect(tree.root.children).toHaveLength(3);
            expect(tree.root.children[2].identifier).toEqual({ digit: 7, siteId: 1 });
            expect(tree.root.children[2].children).toHaveLength(0);
        });

    });


});



