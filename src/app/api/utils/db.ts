

import mongoose from "mongoose";

const MONGODB_URI = process.env.DB_URL as string;
if (!MONGODB_URI) throw new Error(" MONGODB_URI is not defined");

const globalForMongoose = global as unknown as {
  mongooseConn?: typeof mongoose;
  mongoosePromise?: Promise<typeof mongoose>;
};

mongoose.set("strictQuery", true);
// Optional for debugging slow queries
if (process.env.NODE_ENV === "development") {
  mongoose.set("debug", true);
}

export async function connectDB() {
  if (globalForMongoose.mongooseConn) {
    return globalForMongoose.mongooseConn;
  }

  if (!globalForMongoose.mongoosePromise) {
    console.time(" MongoDB Connect");

    globalForMongoose.mongoosePromise = mongoose
      .connect(MONGODB_URI, {
        maxPoolSize: 10,  // maintain up to 10 concurrent sockets
        minPoolSize: 2,   // keep a few warm sockets ready
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,        // IPv4
      })
      .then((mongooseInstance) => {
        console.timeEnd("MongoDB Connect");
        console.log(" MongoDB connected with connection pooling enabled");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error(" MongoDB connection failed:", err);
        throw err;
      });
  }

  globalForMongoose.mongooseConn = await globalForMongoose.mongoosePromise;
  return globalForMongoose.mongooseConn;
}
