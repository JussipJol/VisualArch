import mongoose from 'mongoose';
import { config } from './env';

let isConnected = false;

export const connectDB = async (): Promise<boolean> => {
  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    isConnected = true;
    console.log('[DB] MongoDB connected successfully');

    mongoose.connection.on('error', (err) => {
      console.error('[DB] Error:', err);
    });

    return true;
  } catch (error) {
    isConnected = false;
    console.error('[DB] Connection failed:', error);
    console.error('---------------------------------------------');
    console.error('[DB] ПРИЧИНА: MongoDB Atlas отклоняет соединение.');
    console.error('[DB] РЕШЕНИЕ: Зайдите в MongoDB Atlas -> Network Access -> Add IP Address -> Allow Access from Anywhere (0.0.0.0/0)');
    console.error('[DB] Сервер продолжает работать, но запросы к базе данных будут возвращать ошибку.');
    console.error('---------------------------------------------');
    return false;
  }
};

export const getDBStatus = () => isConnected;
