import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDatabase(): Promise<void> {
  if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not found in environment. Running in persistent-mock mode (no DB).');
    return;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      autoIndex: true,
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`\n✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n❌ Error connecting to MongoDB: ${error instanceof Error ? error.message : error}`);
    console.warn('⚠️  Proceeding in persistent-mock mode (no DB).');
    // Do not call process.exit(1) - allowed to fallback to InMemoryStore
  }
}

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
