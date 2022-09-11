const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

module.exports.connect = async () => {
  try {
    mongod = await MongoMemoryServer.create();
    const mongooseOpts = {
      dbName: 'test',
    };
    await mongoose.connect(mongod.getUri(), mongooseOpts);
  } catch (err) {
    console.log(err);
  }
};

module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
