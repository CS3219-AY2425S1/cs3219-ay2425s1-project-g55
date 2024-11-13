db = db.getSiblingDB('question_db');
db.createCollection('questions');
db.createCollection('database_sequences');

console.log(
  '------------------------------------------------------I am running---------------------------------------------------------------'
);

const seedQuestions = [
  {
    title: 'Reverse a String',
    description:
      'Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.',
    categories: ['Strings', 'Algorithms'],
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/reverse-string/',
    constraints: [
      '1 <= s.length <= 10^5',
      's[i] is a printable ascii character',
    ],
    examples: [
      'Input: s = ["h","e","l","l","o"]\nOutput: ["o","l","l","e","h"]',
      'Input: s = ["H","a","n","n","a","h"]\nOutput: ["h","a","n","n","a","H"]',
    ],
    _id: 1,
  },
  {
    title: 'Linked List Cycle Detection',
    description:
      'Implement a function to detect if a linked list contains a cycle.',
    categories: ['Data Structures', 'Algorithms'],
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/linked-list-cycle/',
    constraints: [
      'The number of nodes in the list is in range [0, 10^4]',
      '-10^5 <= Node.val <= 10^5',
    ],
    examples: [
      'Input: head = [3,2,0,-4], pos = 1\nOutput: true\nExplanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).',
      'Input: head = [1,2], pos = 0\nOutput: true\nExplanation: There is a cycle in the linked list, where the tail connects to the 0th node.',
    ],
    _id: 2,
  },
  {
    title: 'Roman to Integer',
    description: 'Given a roman numeral, convert it to an integer.',
    categories: ['Algorithms'],
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/roman-to-integer/',
    constraints: [
      '1 <= s.length <= 15',
      "s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M')",
    ],
    examples: [
      'Input: s = "III"\nOutput: 3\nExplanation: III = 3',
      'Input: s = "LVIII"\nOutput: 58\nExplanation: L = 50, V= 5, III = 3',
    ],
    _id: 3,
  },
  {
    title: 'Add Binary',
    description:
      'Given two binary strings a and b, return their sum as a binary string.',
    categories: ['Bit Manipulation', 'Algorithms'],
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/add-binary/',
    constraints: [
      '1 <= a.length, b.length <= 10^4',
      "a and b consist only of '0' or '1' characters",
      'Each string does not contain leading zeros except for the zero itself',
    ],
    examples: [
      'Input: a = "11", b = "1"\nOutput: "100"',
      'Input: a = "1010", b = "1011"\nOutput: "10101"',
    ],
    _id: 4,
  },
  {
    title: 'Fibonacci Number',
    description:
      'The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is,\n\nF(0) = 0, F(1) = 1\nF(n) = F(n - 1) + F(n - 2), for n > 1.\n\nGiven n, calculate F(n).',
    categories: ['Recursion', 'Algorithms'],
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/fibonacci-number/',
    constraints: ['0 <= n <= 30'],
    examples: [
      'Input: n = 2\nOutput: 1\nExplanation: F(2) = F(1) + F(0) = 1 + 0 = 1',
      'Input: n = 3\nOutput: 2\nExplanation: F(3) = F(2) + F(1) = 1 + 1 = 2',
    ],
    _id: 5,
  },
  {
    title: 'Implement Stack using Queues',
    description:
      'Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (push, top, pop, and empty).',
    categories: ['Data Structures'],
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/implement-stack-using-queues/',
    constraints: [
      '1 <= x <= 9',
      'At most 100 calls will be made to push, pop, top, and empty',
    ],
    examples: [
      'Input: ["MyStack", "push", "push", "top", "pop", "empty"]\n[[], [1], [2], [], [], []]\nOutput: [null, null, null, 2, 2, false]\nExplanation:\nMyStack myStack = new MyStack();\nmyStack.push(1);\nmyStack.push(2);\nmyStack.top(); // return 2\nmyStack.pop(); // return 2\nmyStack.empty(); // return False',
    ],
    _id: 6,
  },
  {
    title: 'Combine Two Tables',
    description:
      'Write a solution to report the first name, last name, city, and state of each person in the Person table. If the address of a personId is not present in the Address table, report null instead.\n\nReturn the result table in any order.',
    categories: ['Databases'],
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/combine-two-tables/',
    constraints: [
      'No more than 1000 rows in each table',
      'Each personId is unique for Person table',
      'Each addressId is unique for Address table',
    ],
    examples: [
      'Input: \nPerson table:\n+----------+----------+-----------+\n| personId | lastName | firstName |\n+----------+----------+-----------+\n| 1        | Wang     | Allen     |\n| 2        | Alice    | Bob       |\n+----------+----------+-----------+\nAddress table:\n+-----------+----------+---------------+------------+\n| addressId | personId | city          | state      |\n+-----------+----------+---------------+------------+\n| 1         | 2        | New York City | New York   |\n| 2         | 3        | Leetcode      | California |\n+-----------+----------+---------------+------------+\nOutput: \n+-----------+----------+---------------+----------+\n| firstName | lastName | city          | state    |\n+-----------+----------+---------------+----------+\n| Allen     | Wang     | null          | null     |\n| Bob       | Alice    | New York City | New York |\n+-----------+----------+---------------+----------+',
    ],
    _id: 7,
  },
  {
    title: 'Repeated DNA Sequences',
    description:
      "The DNA sequence is composed of a series of nucleotides abbreviated as 'A', 'C', 'G', and 'T'.\n\nFor example, \"ACGAATTCCG\" is a DNA sequence.\n\nWhen studying DNA, it is useful to identify repeated sequences within the DNA.\n\nGiven a string s that represents a DNA sequence, return all the 10-letter-long sequences (substrings) that occur more than once in a DNA molecule.\n\nYou may return the answer in any order.",
    categories: ['Algorithms', 'Bit Manipulation'],
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/repeated-dna-sequences/',
    constraints: [
      '1 <= s.length <= 10^5',
      "s[i] is either 'A', 'C', 'G', or 'T'",
    ],
    examples: [
      'Input: s = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"\nOutput: ["AAAAACCCCC","CCCCCAAAAA"]',
      'Input: s = "AAAAAAAAAAAAA"\nOutput: ["AAAAAAAAAA"]',
    ],
    _id: 8,
  },
  {
    title: 'Course Schedule',
    description:
      'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.\n\nFor example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.\n\nReturn true if you can finish all courses. Otherwise, return false.',
    categories: ['Data Structures', 'Algorithms'],
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/course-schedule/',
    constraints: [
      '1 <= numCourses <= 2000',
      '0 <= prerequisites.length <= 5000',
      'prerequisites[i].length == 2',
      '0 <= ai, bi < numCourses',
      'All the pairs prerequisites[i] are unique',
    ],
    examples: [
      'Input: numCourses = 2, prerequisites = [[1,0]]\nOutput: true\nExplanation: There are a total of 2 courses to take. To take course 1 you should have finished course 0. So it is possible.',
      'Input: numCourses = 2, prerequisites = [[1,0],[0,1]]\nOutput: false\nExplanation: There are a total of 2 courses to take. To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible.',
    ],
    _id: 9,
  },
  {
    title: 'LRU Cache Design',
    description: 'Design and implement an LRU (Least Recently Used) cache.',
    categories: ['Data Structures'],
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/lru-cache/',
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
    ],
    examples: [
      'Input: ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]\nOutput: [null, null, null, 1, null, -1, null, -1, 3, 4]',
    ],
    _id: 10,
  },
  {
    title: 'Longest Common Subsequence',
    description:
      'Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.\n\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.\n\nFor example, "ace" is a subsequence of "abcde".\n\nA common subsequence of two strings is a subsequence that is common to both strings.',
    categories: ['Strings', 'Algorithms'],
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/longest-common-subsequence/',
    constraints: [
      '1 <= text1.length, text2.length <= 1000',
      'text1 and text2 consist of only lowercase English characters',
    ],
    examples: [
      'Input: text1 = "abcde", text2 = "ace"\nOutput: 3\nExplanation: The longest common subsequence is "ace" and its length is 3.',
      'Input: text1 = "abc", text2 = "abc"\nOutput: 3\nExplanation: The longest common subsequence is "abc" and its length is 3.',
    ],
    _id: 11,
  },
  {
    title: 'Rotate Image',
    description:
      'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).',
    categories: ['Arrays', 'Algorithms'],
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/rotate-image/',
    constraints: [
      'n == matrix.length == matrix[i].length',
      '1 <= n <= 20',
      '-1000 <= matrix[i][j] <= 1000',
    ],
    examples: [
      'Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [[7,4,1],[8,5,2],[9,6,3]]',
      'Input: matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]\nOutput: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]',
    ],
    _id: 12,
  },
  {
    title: 'Airplane Seat Assignment Probability',
    description:
      'n passengers board an airplane with exactly n seats. The first passenger has lost the ticket and picks a seat randomly. But after that, the rest of the passengers will:\n\nTake their own seat if it is still available, and\nPick other seats randomly when they find their seat occupied\n\nReturn the probability that the nth person gets his own seat.',
    categories: ['Brainteaser'],
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/airplane-seat-assignment-probability/',
    constraints: ['1 <= n <= 10^5'],
    examples: [
      'Input: n = 1\nOutput: 1.00000\nExplanation: The first person can only sit in their own seat.',
      'Input: n = 2\nOutput: 0.50000\nExplanation: The second person has probability 0.5 to sit in their own seat.',
    ],
    _id: 13,
  },
  {
    title: 'Validate Binary Search Tree',
    description:
      'Given the root of a binary tree, determine if it is a valid binary search tree (BST).',
    categories: ['Data Structures', 'Algorithms'],
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/validate-binary-search-tree/',
    constraints: [
      'The number of nodes in the tree is in the range [1, 10^4]',
      '-2^31 <= Node.val <= 2^31 - 1',
    ],
    examples: [
      'Input: root = [2,1,3]\nOutput: true',
      "Input: root = [5,1,4,null,null,3,6]\nOutput: false\nExplanation: The root node's value is 5 but its right child's value is 4.",
    ],
    _id: 14,
  },
  {
    title: 'Sliding Window Maximum',
    description:
      'You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window.',
    categories: ['Arrays', 'Algorithms'],
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/sliding-window-maximum/',
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      '1 <= k <= nums.length',
    ],
    examples: [
      'Input: nums = [1,3,-1,-3,5,3,6,7], k = 3\nOutput: [3,3,5,5,6,7]\nExplanation: \nWindow position                Max\n---------------               -----\n[1  3  -1] -3  5  3  6  7       3\n 1 [3  -1  -3] 5  3  6  7       3\n 1  3 [-1  -3  5] 3  6  7       5\n 1  3  -1 [-3  5  3] 6  7       5\n 1  3  -1  -3 [5  3  6] 7       6\n 1  3  -1  -3  5 [3  6  7]      7',
    ],
    _id: 15,
  },
  {
    title: 'N-Queen Problem',
    description:
      "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.\n\nGiven an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.\n\nEach solution contains a distinct board configuration of the n-queens' placement, where 'Q' and '.' both indicate a queen and an empty space, respectively.",
    categories: ['Algorithms'],
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/n-queens/',
    constraints: ['1 <= n <= 9'],
    examples: [
      'Input: n = 4\nOutput: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]\nExplanation: There exist two distinct solutions to the 4-queens puzzle as shown above',
      'Input: n = 1\nOutput: [["Q"]]',
    ],
    _id: 16,
  },
  {
    title: 'Serialize and Deserialize a Binary Tree',
    description:
      'Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.\n\nDesign an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.',
    categories: ['Data Structures', 'Algorithms'],
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
    constraints: [
      'The number of nodes in the tree is in the range [0, 10^4]',
      '-1000 <= Node.val <= 1000',
    ],
    examples: [
      'Input: root = [1,2,3,null,null,4,5]\nOutput: [1,2,3,null,null,4,5]',
      'Input: root = []\nOutput: []',
    ],
    _id: 17,
  },
  {
    title: 'Wildcard Matching',
    description:
      "Given an input string (s) and a pattern (p), implement wildcard pattern matching with support for '?' and '*' where:\n\n'?' Matches any single character.\n'*' Matches any sequence of characters (including the empty sequence).\n\nThe matching should cover the entire input string (not partial).",
    categories: ['Strings', 'Algorithms'],
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/wildcard-matching/',
    constraints: [
      '0 <= s.length, p.length <= 2000',
      's contains only lowercase English letters',
      "p contains only lowercase English letters, '?' or '*'",
    ],
    examples: [
      'Input: s = "aa", p = "a"\nOutput: false\nExplanation: "a" does not match the entire string "aa".',
      'Input: s = "aa", p = "*"\nOutput: true\nExplanation: \'*\' matches any sequence.',
    ],
    _id: 18,
  },
  {
    title: 'Chalkboard XOR Game',
    description:
      'You are given an array of integers nums represents the numbers written on a chalkboard.\n\nAlice and Bob take turns erasing exactly one number from the chalkboard, with Alice starting first. If erasing a number causes the bitwise XOR of all the elements of the chalkboard to become 0, then that player loses. The bitwise XOR of one element is that element itself, and the bitwise XOR of no elements is 0.\n\nAlso, if any player starts their turn with the bitwise XOR of all the elements of the chalkboard equal to 0, then that player wins.\n\nReturn true if and only if Alice wins the game, assuming both players play optimally.',
    categories: ['Brainteaser'],
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/chalkboard-xor-game/',
    constraints: ['1 <= nums.length <= 1000', '0 <= nums[i] < 2^16'],
    examples: [
      'Input: nums = [1,1,2]\nOutput: false\nExplanation: Alice has two choices: erase 1 or erase 2. If she erases 1, the nums array becomes [1, 2]. The bitwise XOR of all the elements of the chalkboard is 1 XOR 2 = 3. Now Bob can remove any element he wants, because Alice will be the one to erase the last element and she will lose. If Alice erases 2 first, now nums become [1, 1]. The bitwise XOR of all the elements of the chalkboard is 1 XOR 1 = 0. Alice will lose.',
      'Input: nums = [0,1]\nOutput: true',
      'Input: nums = [1,2,3]\nOutput: true',
    ],
    _id: 19,
  },
  {
    title: 'Trips and Users',
    description:
      'Write a solution to find the cancellation rate of requests with unbanned users (both client and driver must not be banned) each day between "2013-10-01" and "2013-10-03". Round Cancellation Rate to two decimal points.\n\nReturn the result table in any order.',
    categories: ['Databases'],
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/trips-and-users/',
    constraints: [
      'The Trips table contains at least one trip',
      'Each client_id is a foreign key to the Users table',
      'Each driver_id is a foreign key to the Users table',
    ],
    examples: [
      'Input: \nTrips table:\n+----+-----------+-----------+---------+---------------------+------------+\n| id | client_id | driver_id | city_id | status              | request_at |\n+----+-----------+-----------+---------+---------------------+------------+\n| 1  | 1         | 10        | 1       | completed           | 2013-10-01 |\n| 2  | 2         | 11        | 1       | cancelled_by_driver | 2013-10-01 |\n| 3  | 3         | 12        | 6       | completed           | 2013-10-01 |\n| 4  | 4         | 13        | 6       | cancelled_by_client | 2013-10-01 |\n| 5  | 1         | 10        | 1       | completed           | 2013-10-02 |\n| 6  | 2         | 11        | 6       | completed           | 2013-10-02 |\n| 7  | 3         | 12        | 6       | completed           | 2013-10-02 |\n| 8  | 2         | 12        | 12      | completed           | 2013-10-03 |\n| 9  | 3         | 10        | 12      | completed           | 2013-10-03 |\n| 10 | 4         | 13        | 12      | cancelled_by_driver | 2013-10-03 |\n+----+-----------+-----------+---------+---------------------+------------+\nUsers table:\n+----------+--------+--------+\n| users_id | banned | role   |\n+----------+--------+--------+\n| 1        | No     | client |\n| 2        | Yes    | client |\n| 3        | No     | client |\n| 4        | No     | client |\n| 10       | No     | driver |\n| 11       | No     | driver |\n| 12       | No     | driver |\n| 13       | No     | driver |\n+----------+--------+--------+\nOutput: \n+------------+-------------------+\n| Day        | Cancellation Rate |\n+------------+-------------------+\n| 2013-10-01 | 0.33              |\n| 2013-10-02 | 0.00              |\n| 2013-10-03 | 0.50              |\n+------------+-------------------+',
    ],
    _id: 20,
  },
];

// Seed sample questions
db.questions.insertMany(seedQuestions);

db.database_sequences.insertOne({
  _id: 'question_sequence',
  seq: seedQuestions.length,
});