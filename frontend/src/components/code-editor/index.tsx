import Editor from '@monaco-editor/react';

const sampleInitialValue = `
// Definition for singly-linked list node
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

/**
 * @param {ListNode} head
 * @return {boolean}
 */
function hasCycle(head) {
    if (!head || !head.next) {
        return false;
    }
    
    let slow = head;
    let fast = head.next;
    
    while (slow !== fast) {
        if (!fast || !fast.next) {
            return false;
        }
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return true;
}

// Example usage:
// Create a linked list with a cycle
let node1 = new ListNode(3);
let node2 = new ListNode(2);
let node3 = new ListNode(0);
let node4 = new ListNode(-4);

node1.next = node2;
node2.next = node3;
node3.next = node4;
node4.next = node2; // Creates a cycle

console.log(hasCycle(node1)); // Output: true

// Create a linked list without a cycle
let list1 = new ListNode(1);
let list2 = new ListNode(2);
let list3 = new ListNode(3);

list1.next = list2;
list2.next = list3;

console.log(hasCycle(list1)); // Output: false
`;

const CodeEditor = ({
  //   initialValue = '// Write your JavaScript code here\n',
  initialValue = sampleInitialValue,
  onChange = () => {},
}) => {
  return (
      <Editor
        defaultLanguage='javascript'
        defaultValue={initialValue}
        onChange={onChange}
      />
  );
};

export default CodeEditor;
