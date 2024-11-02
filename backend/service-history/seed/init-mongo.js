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
    attemptedAt: new Date().toISOString(),
    _id: 1,
  },
];

db.history.insertMany(seedHistory);
db.database_sequences.insert({ _id: 'history_sequence', seq: seedHistory.length });
