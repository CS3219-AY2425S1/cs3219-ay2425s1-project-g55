db = db.getSiblingDB('history_db');
db.createCollection('history');

console.log(
  '------------------------------------------------------I am running---------------------------------------------------------------'
);

const seedHistory = [
  {
    _id: 1,
    questionId: '1',
    userId: '1',
    code: 'console.log("Hello, World!")',
    attemptedAt: new Date().toISOString(),
  },
];

db.history.insertMany(seedHistory);
