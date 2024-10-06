db = db.getSiblingDB('question_db');
db.createCollection('questions');
db.createCollection('database_sequences');

console.log(
  '------------------------------------------------------I am running---------------------------------------------------------------'
);

const seedQuestions = [
  {
    title: 'Reverse a String 1',
    description:
      'Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.',
    difficulty: 'Easy',
    categories: ['Strings', 'Algorithms'],
    examples: [
      {
        output: '["o","l","l","e","h"]',
        input: 's = ["h","e","l","l","o"]',
      },
      {
        output: '["h","a","n","n","a","H"]',
        input: 's = ["H","a","n","n","a","h"]',
      },
    ],
    constraints: [
      '1 <= s.length <= 105',
      's[i] is a printable ascii character.',
    ],
    link: 'https://leetcode.com/problems/reverse-string/',
    _id: 1,
  },
  {
    title: 'linked List Cycle Detection',
    description:
      "Given head, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer is connected to. Note that pos is not passed as a parameter.\n\nReturn true if there is a cycle in the linked list. Otherwise, return false.",
    difficulty: 'Easy',
    categories: ['Data Structures', 'Algorithms'],
    examples: [
      {
        output: 'true',
        explanation:
          'There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed)',
        input: 'head = [3,2,0,-4], pos = 1',
      },
      {
        output: 'true',
        explanation:
          'There is a cycle in the linked list, where the tail connects to the 0th node.',
        input: 'head = [1,2], pos = 0',
      },
      {
        output: 'false',
        explanation: 'There is no cycle in the linked list.',
        input: 'head = [1], pos = -1',
      },
    ],
    constraints: [
      'The number of the nodes in the list is in the range [0, 104].',
      '-105 <= Node.val <= 105',
      'pos is -1 or a val_id index in the linked-list.',
    ],
    link: 'https://leetcode.com/problems/linked-list-cycle/',
    _id: 2,
  },
  {
    title: 'Course Schedule',
    description:
      'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.\n\nFor example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.\nReturn true if you can finish all courses. Otherwise, return false.',
    difficulty: 'Medium',
    categories: ['Data Structures', 'Algorithms'],
    examples: [
      {
        prerequisites: '[[1, 0]]',
        output: 'true',
        numCourses: '2',
      },
      {
        prerequisites: '[[1, 0], [0, 1]]',
        output: 'false',
        numCourses: '2',
      },
    ],
    constraints: [
      '1 <= numCourses <= 2000',
      '0 <= prerequisites.length <= 5000',
      'prerequisites[i].length == 2',
      '0 <= ai, bi < numCourses',
      'All the pairs prerequisites[i] are unique.',
    ],
    link: 'https://leetcode.com/problems/course-schedule/',
    _id: 3,
  },
  {
    title: 'Course Schedule',
    description:
      'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.\n\nFor example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.\nReturn true if you can finish all courses. Otherwise, return false.',
    difficulty: 'Medium',
    categories: ['Data Structures', 'Algorithms'],
    examples: [
      {
        prerequisites: '[[1, 0]]',
        output: 'true',
        numCourses: '2',
      },
      {
        prerequisites: '[[1, 0], [0, 1]]',
        output: 'false',
        numCourses: '2',
      },
    ],
    constraints: [
      '1 <= numCourses <= 2000',
      '0 <= prerequisites.length <= 5000',
      'prerequisites[i].length == 2',
      '0 <= ai, bi < numCourses',
      'All the pairs prerequisites[i] are unique.',
    ],
    link: 'https://leetcode.com/problems/course-schedule/',
    _id: 4,
  },
  {
    title: 'Fibonacci Number',
    description:
      'The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is,\n\nF(0) = 0, F(1) = 1\nF(n) = F(n - 1) + F(n - 2), for n > 1.\nGiven n, calculate F(n).',
    difficulty: 'Easy',
    categories: ['Recursion', 'Algorithms'],
    examples: [
      {
        output: '1',
        input: '2',
      },
      {
        output: '2',
        input: '3',
      },
      {
        output: '3',
        input: '4',
      },
    ],
    constraints: ['0 <= n <= 30'],
    link: 'https://leetcode.com/problems/fibonacci-number/',
    _id: 5,
  },
  {
    title: 'Implement Stack using Queues',
    description:
      "Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (push, top, pop, and empty).\n\nImplement the MyStack class:\n\nvo_id push(int x) Pushes element x to the top of the stack.\nint pop() Removes the element on the top of the stack and returns it.\nint top() Returns the element on the top of the stack.\nboolean empty() Returns true if the stack is empty, false otherwise.\nNotes:\n\nYou must use only standard operations of a queue, which means that only push to back, peek/pop from front, size and is empty operations are val_id.\nDepending on your language, the queue may not be supported natively. You may simulate a queue using a list or deque (double-ended queue) as long as you use only a queue's standard operations.",
    difficulty: 'Easy',
    categories: ['Data Structures'],
    examples: [
      {
        output: '[null, null, null, 2, 2, false]',
        explanation:
          'MyStack myStack = new MyStack();\nmyStack.push(1);\nmyStack.push(2);\nmyStack.top(); // return 2\nmyStack.pop(); // return 2\nmyStack.empty(); // return False',
        input:
          '["MyStack", "push", "push", "top", "pop", "empty"]\n[[], [1], [2], [], [], []]',
      },
    ],
    constraints: [
      '1 <= x <= 9',
      'At most 100 calls will be made to push, pop, top, and empty.',
      'All the calls to pop and top are val_id.',
    ],
    link: 'https://leetcode.com/problems/implement-stack-using-queues/',
    _id: 6,
  },
  {
    title: 'Combine Two Tables',
    description:
      'Table: Person\n\n+-------------+---------+\n| Column Name | Type    |\n+-------------+---------+\n| person_id    | int     |\n| lastName    | varchar |\n| firstName   | varchar |\n+-------------+---------+\nperson_id is the primary key (column with unique values) for this table.\nThis table contains information about the _id of some persons and their first and last names.\n \n\nTable: Address\n\n+-------------+---------+\n| Column Name | Type    |\n+-------------+---------+\n| address_id   | int     |\n| person_id    | int     |\n| city        | varchar |\n| state       | varchar |\n+-------------+---------+\naddress_id is the primary key (column with unique values) for this table.\nEach row of this table contains information about the city and state of one person with _id = Person_id.\n \n\nWrite a solution to report the first name, last name, city, and state of each person in the Person table. If the address of a person_id is not present in the Address table, report null instead.\n\nReturn the result table in any order.\n\nThe result format is in the following example.\n\n',
    difficulty: 'Easy',
    categories: ['Databases'],
    examples: [
      {
        output:
          '+-----------+----------+---------------+----------+\n| firstName | lastName | city          | state    |\n+-----------+----------+---------------+----------+\n| Allen     | Wang     | Null          | Null     |\n| Bob       | Alice    | New York City | New York |\n+-----------+----------+---------------+----------+',
        explanation:
          'There is no address in the address table for the person_id = 1 so we return null in their city and state.\naddress_id = 1 contains information about the address of person_id = 2.',
        input:
          'Person table:\n+----------+----------+-----------+\n| person_id | lastName | firstName |\n+----------+----------+-----------+\n| 1        | Wang     | Allen     |\n| 2        | Alice    | Bob       |\n+----------+----------+-----------+\nAddress table:\n+-----------+----------+---------------+------------+\n| address_id | person_id | city          | state      |\n+-----------+----------+---------------+------------+\n| 1         | 2        | New York City | New York   |\n| 2         | 3        | Leetcode      | California |\n+-----------+----------+---------------+------------+',
      },
    ],
    constraints: null,
    link: 'https://leetcode.com/problems/combine-two-tables/',
    _id: 7,
  },
  {
    title: 'Repeated DNA Sequences',
    description:
      "The DNA sequence is composed of a series of nucleot_ides abbreviated as 'A', 'C', 'G', and 'T'.\n\nFor example, \"ACGAATTCCG\" is a DNA sequence.\nWhen studying DNA, it is useful to _identify repeated sequences within the DNA.\n\nGiven a string s that represents a DNA sequence, return all the 10-letter-long sequences (substrings) that occur more than once in a DNA molecule. You may return the answer in any order.",
    difficulty: 'Medium',
    categories: ['Algorithms', 'Bit Manipulation'],
    examples: [
      {
        output: 'AAAAACCCCC,CCCCCAAAAA',
        input: 'AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT',
      },
      {
        output: 'AAAAAAAAAA',
        input: 'AAAAAAAAAAAAA',
      },
    ],
    constraints: [
      '1 <= s.length <= 105',
      "s[i] is either 'A', 'C', 'G', or 'T'.",
    ],
    link: 'https://leetcode.com/problems/repeated-dna-sequences/',
    _id: 8,
  },
  {
    title: 'Course Schedule',
    description:
      'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.\n\nFor example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.\nReturn true if you can finish all courses. Otherwise, return false.',
    difficulty: 'Medium',
    categories: ['Data Structures', 'Algorithms'],
    examples: [
      {
        prerequisites: '[[1, 0]]',
        output: 'true',
        numCourses: '2',
      },
      {
        prerequisites: '[[1, 0], [0, 1]]',
        output: 'false',
        numCourses: '2',
      },
    ],
    constraints: [
      '1 <= numCourses <= 2000',
      '0 <= prerequisites.length <= 5000',
      'prerequisites[i].length == 2',
      '0 <= ai, bi < numCourses',
      'All the pairs prerequisites[i] are unique.',
    ],
    link: 'https://leetcode.com/problems/course-schedule/',
    _id: 9,
  },
  {
    title: 'LRU Cache Design',
    description:
      'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the LRUCache class:\n\nLRUCache(int capacity) Initialize the LRU cache with positive size capacity.\nint get(int key) Return the value of the key if the key exists, otherwise return -1.\nvoid put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.\nThe functions get and put must each run in O(1) average time difficulty.\n\n',
    difficulty: 'Medium',
    categories: ['Data Structures'],
    examples: [
      {
        output: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
        explanation:
          'LRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1); // cache is {1=1}\nlRUCache.put(2, 2); // cache is {1=1, 2=2}\nlRUCache.get(1);    // return 1\nlRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}\nlRUCache.get(2);    // returns -1 (not found)\nlRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}\nlRUCache.get(1);    // return -1 (not found)\nlRUCache.get(3);    // return 3\nlRUCache.get(4);    // return 4',
        input:
          '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
      },
    ],
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 104',
      '0 <= value <= 105',
      'At most 2 * 105 calls will be made to get and put.',
    ],
    link: 'https://leetcode.com/problems/lru-cache/',
    _id: 10,
  },
  {
    title: 'Longest Common Subsequence',
    description:
      'Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.\n\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.\n\nFor example, "ace" is a subsequence of "abcde".\nA common subsequence of two strings is a subsequence that is common to both strings.',
    difficulty: 'Medium',
    categories: ['Strings', 'Algorithms'],
    examples: [
      {
        output: '3',
        explanation:
          'The longest common subsequence is "ace" and its length is 3.',
        input: 'text1 = "abcde", text2 = "ace"',
      },
      {
        output: '3',
        explanation:
          'The longest common subsequence is "abc" and its length is 3.',
        input: 'text1 = "abc", text2 = "abc"',
      },
      {
        output: '0',
        explanation: 'There is no such common subsequence, so the result is 0.',
        input: 'text1 = "abc", text2 = "def"',
      },
    ],
    constraints: [
      '1 <= text1.length, text2.length <= 1000',
      'text1 and text2 consist of only lowercase English characters',
    ],
    link: 'https://leetcode.com/problems/longest-common-subsequence/',
    _id: 11,
  },
  {
    title: 'Rotate Image',
    description:
      'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).\n\nYou have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.',
    difficulty: 'Medium',
    categories: ['Arrays', 'Algorithms'],
    examples: [
      {
        output: '[[7,4,1],[8,5,2],[9,6,3]]',
        input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
      },
      {
        output: '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]',
        input: 'matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]',
      },
    ],
    constraints: [
      'n == matrix.length == matrix[i].length',
      '1 <= n <= 20',
      '-1000 <= matrix[i][j] <= 1000',
    ],
    link: 'https://leetcode.com/problems/rotate-image/',
    _id: 12,
  },
  {
    title: 'Airplane Seat Assignment Probability',
    description:
      'n passengers board an airplane with exactly n seats. The first passenger has lost the ticket and picks a seat randomly. But after that, the rest of the passengers will:\n\nTake their own seat if it is still available, and\nPick other seats randomly when they find their seat occupied\nReturn the probability that the nth person gets his own seat.\n\n',
    difficulty: 'Medium',
    categories: ['Brainteaser'],
    examples: [
      {
        output: '1.00000',
        explanation: 'The first person can only get the first seat.',
        input: 'n = 1',
      },
      {
        output: '0.50000',
        explanation:
          'The second person has a probability of 0.5 to get the second seat (when first person gets the first seat).',
        input: 'n = 2',
      },
    ],
    constraints: ['1 <= n <= 105'],
    link: 'https://leetcode.com/problems/airplane-seat-assignment-probability/',
    _id: 13,
  },
  {
    title: 'Validate Binary Search Tree',
    description:
      "Given the root of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n\nThe left \nsubtree\n of a node contains only nodes with keys less than the node's key.\nThe right subtree of a node contains only nodes with keys greater than the node's key.\nBoth the left and right subtrees must also be binary search trees.\n",
    difficulty: 'Medium',
    categories: ['Data Structures', 'Algorithms'],
    examples: [
      {
        output: 'true',
        input: 'root = [2,1,3]',
      },
      {
        output: 'false',
        explanation:
          "The root node's value is 5 but its right child's value is 4.",
        input: 'root = [5,1,4,null,null,3,6]',
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [1, 104].',
      '-231 <= Node.val <= 231 - 1',
    ],
    link: 'https://leetcode.com/problems/val_idate-binary-search-tree/',
    _id: 14,
  },
  {
    title: 'Sliding Window Maximum',
    description:
      'You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window.\n\n',
    difficulty: 'Hard',
    categories: ['Arrays', 'Algorithms'],
    examples: [
      {
        output: '[3,3,5,5,6,7]',
        explanation:
          'Window position                Max\n---------------               -----\n[1  3  -1] -3  5  3  6  7       3\n 1 [3  -1  -3] 5  3  6  7       3\n 1  3 [-1  -3  5] 3  6  7       5\n 1  3  -1 [-3  5  3] 6  7       5\n 1  3  -1  -3 [5  3  6] 7       6\n 1  3  -1  -3  5 [3  6  7]      7',
        input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
      },
      {
        output: '[1]',
        input: 'nums = [1], k = 1',
      },
    ],
    constraints: [
      '1 <= nums.length <= 105',
      '-104 <= nums[i] <= 104',
      '1 <= k <= nums.length',
    ],
    link: 'https://leetcode.com/problems/sl_iding-window-maximum/',
    _id: 15,
  },
  {
    title: 'N-Queen Problem',
    description:
      "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.\n\nGiven an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.\n\nEach solution contains a distinct board configuration of the n-queens' placement, where 'Q' and '.' both indicate a queen and an empty space, respectively.",
    difficulty: 'Hard',
    categories: ['Algorithms'],
    examples: [
      {
        output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]',
        explanation:
          'There exist two distinct solutions to the 4-queens puzzle as shown above',
        input: 'n = 4',
      },
      {
        output: '[["Q"]]',
        input: 'n = 1',
      },
    ],
    constraints: ['1 <= n <= 9'],
    link: 'https://leetcode.com/problems/n-queens/',
    _id: 16,
  },
  {
    title: 'Serialize and Deserialize a Binary Tree',
    description:
      'Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.\n\nDesign an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.\n\nClarification: The input/output format is the same as how LeetCode serializes a binary tree. You do not necessarily need to follow this format, so please be creative and come up with different approaches yourself.',
    difficulty: 'Hard',
    categories: ['Data Structures', 'Algorithms'],
    examples: [
      {
        output: '[1,2,3,null,null,4,5]',
        input: 'root = [1,2,3,null,null,4,5]',
      },
      {
        output: '[]',
        input: 'root = []',
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 104].',
      '-1000 <= Node.val <= 1000',
    ],
    link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
    _id: 17,
  },
  {
    title: 'Wildcard Matching',
    description:
      "Given an input string (s) and a pattern (p), implement wildcard pattern matching with support for '?' and '*' where:\n\n'?' Matches any single character.\n'*' Matches any sequence of characters (including the empty sequence).\nThe matching should cover the entire input string (not partial).",
    difficulty: 'Hard',
    categories: ['Strings', 'Algorithms'],
    examples: [
      {
        output: 'false',
        explanation: '"a" does not match the entire string "aa".',
        input: 's = "aa", p = "a"',
      },
      {
        output: '[]',
        explanation: "'*' matches any sequence.",
        input: 'root = []',
      },
      {
        output: '[]',
        explanation:
          "'?' matches 'c', but the second letter is 'a', which does not match 'b'.",
        input: 'root = []',
      },
    ],
    constraints: [
      '0 <= s.length, p.length <= 2000',
      's contains only lowercase English letters.',
      "p contains only lowercase English letters, '?' or '*'.",
    ],
    link: 'https://leetcode.com/problems/wildcard-matching/',
    _id: 18,
  },
  {
    title: 'Chalkboard XOR Game',
    description:
      'You are given an array of integers nums represents the numbers written on a chalkboard.\n\nAlice and Bob take turns erasing exactly one number from the chalkboard, with Alice starting first. If erasing a number causes the bitwise XOR of all the elements of the chalkboard to become 0, then that player loses. The bitwise XOR of one element is that element itself, and the bitwise XOR of no elements is 0.\n\nAlso, if any player starts their turn with the bitwise XOR of all the elements of the chalkboard equal to 0, then that player wins.\n\nReturn true if and only if Alice wins the game, assuming both players play optimally.',
    difficulty: 'Hard',
    categories: ['Brainteaser'],
    examples: [
      {
        output: 'false',
        explanation:
          'Alice has two choices: erase 1 or erase 2. \nIf she erases 1, the nums array becomes [1, 2]. The bitwise XOR of all the elements of the chalkboard is 1 XOR 2 = 3. Now Bob can remove any element he wants, because Alice will be the one to erase the last element and she will lose. \nIf Alice erases 2 first, now nums become [1, 1]. The bitwise XOR of all the elements of the chalkboard is 1 XOR 1 = 0. Alice will lose.',
        input: 'nums = [1,1,2]',
      },
      {
        output: 'true',
        input: 'nums = [0,1]',
      },
      {
        output: 'true',
        input: 'nums = [1,2,3]',
      },
    ],
    constraints: ['1 <= nums.length <= 1000', '0 <= nums[i] < 216'],
    link: 'https://leetcode.com/problems/chalkboard-xor-game/',
    _id: 19,
  },
  {
    title: 'Trips and Users',
    description:
      "Table: Trips\n\n+-------------+----------+\n| Column Name | Type     |\n+-------------+----------+\n| id          | int      |\n| client_id   | int      |\n| driver_id   | int      |\n| city_id     | int      |\n| status      | enum     |\n| request_at  | varchar  |     \n+-------------+----------+\nid is the primary key (column with unique values) for this table.\nThe table holds all taxi trips. Each trip has a unique id, while client_id and driver_id are foreign keys to the users_id at the Users table.\nStatus is an ENUM (category) type of ('completed', 'cancelled_by_driver', 'cancelled_by_client').\n \n\nTable: Users\n\n+-------------+----------+\n| Column Name | Type     |\n+-------------+----------+\n| users_id    | int      |\n| banned      | enum     |\n| role        | enum     |\n+-------------+----------+\nusers_id is the primary key (column with unique values) for this table.\nThe table holds all users. Each user has a unique users_id, and role is an ENUM type of ('client', 'driver', 'partner').\nbanned is an ENUM (category) type of ('Yes', 'No').\n \n\nThe cancellation rate is computed by dividing the number of canceled (by client or driver) requests with unbanned users by the total number of requests with unbanned users on that day.\n\nWrite a solution to find the cancellation rate of requests with unbanned users (both client and driver must not be banned) each day between \"2013-10-01\" and \"2013-10-03\". Round Cancellation Rate to two decimal points.\n\nReturn the result table in any order.\n\nThe result format is in the following example.\n\n",
    difficulty: 'Hard',
    categories: ['Databases'],
    examples: [
      {
        output:
          '+------------+-------------------+\n| Day        | Cancellation Rate |\n+------------+-------------------+\n| 2013-10-01 | 0.33              |\n| 2013-10-02 | 0.00              |\n| 2013-10-03 | 0.50              |',
        explanation:
          'On 2013-10-01:\n  - There were 4 requests in total, 2 of which were canceled.\n  - However, the request with Id=2 was made by a banned client (User_Id=2), so it is ignored in the calculation.\n  - Hence there are 3 unbanned requests in total, 1 of which was canceled.\n  - The Cancellation Rate is (1 / 3) = 0.33\nOn 2013-10-02:\n  - There were 3 requests in total, 0 of which were canceled.\n  - The request with Id=6 was made by a banned client, so it is ignored.\n  - Hence there are 2 unbanned requests in total, 0 of which were canceled.\n  - The Cancellation Rate is (0 / 2) = 0.00\nOn 2013-10-03:\n  - There were 3 requests in total, 1 of which was canceled.\n  - The request with Id=8 was made by a banned client, so it is ignored.\n  - Hence there are 2 unbanned request in total, 1 of which were canceled.\n  - The Cancellation Rate is (1 / 2) = 0.50',
        input:
          'Trips table:\n+----+-----------+-----------+---------+---------------------+------------+\n| id | client_id | driver_id | city_id | status              | request_at |\n+----+-----------+-----------+---------+---------------------+------------+\n| 1  | 1         | 10        | 1       | completed           | 2013-10-01 |\n| 2  | 2         | 11        | 1       | cancelled_by_driver | 2013-10-01 |\n| 3  | 3         | 12        | 6       | completed           | 2013-10-01 |\n| 4  | 4         | 13        | 6       | cancelled_by_client | 2013-10-01 |\n| 5  | 1         | 10        | 1       | completed           | 2013-10-02 |\n| 6  | 2         | 11        | 6       | completed           | 2013-10-02 |\n| 7  | 3         | 12        | 6       | completed           | 2013-10-02 |\n| 8  | 2         | 12        | 12      | completed           | 2013-10-03 |\n| 9  | 3         | 10        | 12      | completed           | 2013-10-03 |\n| 10 | 4         | 13        | 12      | cancelled_by_driver | 2013-10-03 |\n+----+-----------+-----------+---------+---------------------+------------+\nUsers table:\n+----------+--------+--------+\n| users_id | banned | role   |\n+----------+--------+--------+\n| 1        | No     | client |\n| 2        | Yes    | client |\n| 3        | No     | client |\n| 4        | No     | client |\n| 10       | No     | driver |\n| 11       | No     | driver |\n| 12       | No     | driver |\n| 13       | No     | driver |\n+----------+--------+--------+',
      },
    ],
    constraints: [],
    link: 'https://leetcode.com/problems/trips-and-users/',
    _id: 20,
  },
];

// Seed sample questions
db.questions.insertMany(seedQuestions);

db.database_sequences.insertOne({
  _id: 'question_sequence',
  seq: seedQuestions.length,
});
