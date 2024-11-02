db = db.getSiblingDB('history_db');
db.createCollection('history');
db.createCollection('database_sequences');
console.log(
  '------------------------------------------------------I am running---------------------------------------------------------------'
);

const seedHistory = [
  {
    questionId: 1,
    userId: 1,
    code: 'console.log("Hello, World!")',
    attemptedAt: new Date('2024-03-15T10:30:00Z').toISOString(),
    _id: 1,
  },
  {
    questionId: 2,
    userId: 1,
    code: 'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n-1) + fibonacci(n-2);\n}',
    attemptedAt: new Date('2024-03-15T11:15:00Z').toISOString(),
    _id: 2,
  },
  {
    questionId: 1,
    userId: 2,
    code: 'print("Hello, Python!")',
    attemptedAt: new Date('2024-03-14T09:20:00Z').toISOString(),
    _id: 3,
  },
  {
    questionId: 3,
    userId: 1,
    code: 'function reverseString(str) {\n  return str.split("").reverse().join("");\n}',
    attemptedAt: new Date('2024-03-14T15:45:00Z').toISOString(),
    _id: 4,
  },
  {
    questionId: 2,
    userId: 3,
    code: 'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]',
    attemptedAt: new Date('2024-03-13T16:30:00Z').toISOString(),
    _id: 5,
  },
  {
    questionId: 4,
    userId: 2,
    code: 'function isPalindrome(str) {\n  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return cleaned === cleaned.split("").reverse().join("");\n}',
    attemptedAt: new Date('2024-03-13T14:20:00Z').toISOString(),
    _id: 6,
  },
  {
    questionId: 3,
    userId: 3,
    code: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}',
    attemptedAt: new Date('2024-03-12T11:10:00Z').toISOString(),
    _id: 7,
  }
];

db.history.insertMany(seedHistory);
db.database_sequences.insert({ _id: 'history_sequence', seq: seedHistory.length });
