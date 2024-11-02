db = db.getSiblingDB('history_db');
db.createCollection('history');

console.log(
  '------------------------------------------------------I am running---------------------------------------------------------------'
);

const seedHistory = [
  {
    questionId: '1',
    userId: '1',
    code: 'console.log("Hello, World!")',
    attemptedAt: new Date().toDateString(),
    _id: 1,
  },
];

db.history.insertMany(seedHistory);
