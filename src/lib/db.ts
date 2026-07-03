import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("Missing environment variable: MONGODB_URI");
}

const MONGODB_URI: string = process.env.MONGODB_URI;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Reuse the connection across hot reloads (dev) and serverless invocations
// to avoid exhausting the MongoDB connection pool.
const globalForMongoose = globalThis as typeof globalThis & {
  _mongoose?: MongooseCache;
};

const cached: MongooseCache = globalForMongoose._mongoose ?? {
  conn: null,
  promise: null,
};

globalForMongoose._mongoose = cached;

/**
 * Returns a singleton Mongoose connection, creating it on first call.
 * Repositories should call this before any database access.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
