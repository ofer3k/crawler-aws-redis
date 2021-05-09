const  {
    BitVector,
    StringBuilder,
    Stack,
    Queue,
    SinglyLinkedList,
    SinglyLinkedListNode,
    DoublyLinkedList,
    DoublyLinkedListNode,
    BinaryTree,
    BinaryTreeNode,
    MinHeap,
    MaxHeap,
    Graph,
    GraphNode,
} =require('efficient-data-structures') ;

const malca = new GraphNode('malca');

const ido = new GraphNode('ido');
const yosi = new GraphNode('yosi');
const ronit = new GraphNode('ronit');

const ofer = new GraphNode('ofer');

const eitan = new GraphNode('eitan');
let i=0
malca.children.push(ido);
malca.children.push(yosi);
malca.children.push(ronit);
ido.children.push(ofer);
yosi.children.push(eitan)


const klein = new Graph(malca);

const kleinElse=new Graph(ido)

const kleinLsat=new Graph(ofer)

console.log(klein.traverseDepthFirst()); 

