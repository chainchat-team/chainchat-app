import LSeqTree from 'lseqtree';

// #1 We create a first distributed data structure for sequences'
const lseq1 = new LSeqTree(1, { base: 1 });

//#2 We insert an element in the structure
const idInsert = lseq1.insert('A', 0);
const idInsert2 = lseq1.insert('B', 0);
const idInsert3 = lseq1.insert('c', 0);
// console.log(lseq1.root.children[0].children[0].children[0])
console.log(lseq1.root.children[1])
// console.log(idInsert3)
