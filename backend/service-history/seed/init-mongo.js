db = db.getSiblingDB('history_db');
db.createCollection('history');

console.log(
  '------------------------------------------------------I am running---------------------------------------------------------------'
);

const seedHistory = [
  {
    questionId: '1',
    userId: '1',
    attemptedCode: 'console.log("Hello, World!")',
    attemptDateTime: new Date(),
    _id: 1,
  },
];

db.history.insertMany(seedHistory);
