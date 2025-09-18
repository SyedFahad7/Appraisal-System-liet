import mongoose from 'mongoose';

interface GlobalWithMongoose {
  mongooseConn?: typeof mongoose;
  mongoosePromise?: Promise<typeof mongoose>;
}

const globalForMongoose = global as unknown as GlobalWithMongoose;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (globalForMongoose.mongooseConn) return globalForMongoose.mongooseConn;

  const uri = (process.env.MONGODB_URI || '').trim();
  if (!uri) {
    throw new Error('MONGODB_URI is not configured');
  }

  if (!globalForMongoose.mongoosePromise) {
    globalForMongoose.mongoosePromise = mongoose.connect(uri);
  }

  globalForMongoose.mongooseConn = await globalForMongoose.mongoosePromise;
  return globalForMongoose.mongooseConn;
}
