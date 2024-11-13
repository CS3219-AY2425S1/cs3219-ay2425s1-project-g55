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
    code: 'function reverseString(str) {\n  return str.split("").reverse().join("");\n}',
    attemptedAt: new Date('2024-03-15T10:30:00Z').toISOString(),
    _id: 1,
  },
  {
    questionId: 2,
    userId: 1,
    code: 'function hasCycle(head) {\n  let slow = head;\n  let fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}',
    attemptedAt: new Date('2024-03-15T11:15:00Z').toISOString(),
    _id: 2,
  },
  {
    questionId: 1,
    userId: 2,
    code: 'function reverseString(str) {\n  return str.split("").reverse().join("");\n}',
    attemptedAt: new Date('2024-03-14T09:20:00Z').toISOString(),
    _id: 3,
  },
  {
    questionId: 3,
    userId: 1,
    code: 'function romanToInt(s) {\n  const romanMap = {\n    I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000\n  };\n  let result = 0;\n  for (let i = 0; i < s.length; i++) {\n    const current = romanMap[s[i]];\n    const next = romanMap[s[i+1]];\n    if (next && current < next) result -= current;\n    else result += current;\n  }\n  return result;\n}',
    attemptedAt: new Date('2024-03-14T15:45:00Z').toISOString(),
    _id: 4,
  },
  {
    questionId: 2,
    userId: 3,
    code: 'function hasCycle(head) {\n  let slow = head;\n  let fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}',
    attemptedAt: new Date('2024-03-13T16:30:00Z').toISOString(),
    _id: 5,
  },
  {
    questionId: 4,
    userId: 2,
    code: 'function addBinary(a, b) {\n  let carry = 0;\n  let result = "";\n  let i = a.length - 1;\n  let j = b.length - 1;\n  while (i >= 0 || j >= 0 || carry > 0) {\n    const digitA = i >= 0 ? parseInt(a[i]) : 0;\n    const digitB = j >= 0 ? parseInt(b[j]) : 0;\n    const sum = digitA + digitB + carry;\n    result = (sum % 2) + result;\n    carry = Math.floor(sum / 2);\n    i--;\n    j--;\n  }\n  return result;\n}',
    attemptedAt: new Date('2024-03-13T14:20:00Z').toISOString(),
    _id: 6,
  },
  {
    questionId: 3,
    userId: 3,
    code: 'function romanToInt(s) {\n  const romanMap = {\n    I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000\n  };\n  let result = 0;\n  for (let i = 0; i < s.length; i++) {\n    const current = romanMap[s[i]];\n    const next = romanMap[s[i+1]];\n    if (next && current < next) result -= current;\n    else result += current;\n  }\n  return result;\n}',
    attemptedAt: new Date('2024-03-12T11:10:00Z').toISOString(),
    _id: 7,
  },
];

db.history.insertMany(seedHistory);
db.database_sequences.insert({
  _id: 'history_sequence',
  seq: seedHistory.length,
});
