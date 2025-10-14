import mongoose from "mongoose";

export async function connectDB(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  const { name, host } = mongoose.connection;
  console.log(`✅ Mongo connecté | db: ${name} | host: ${host}`);
}

export function dbState() {
  // 0=disconnected,1=connected,2=connecting,3=disconnecting,4=unauthorized
  return mongoose.connection.readyState;
}