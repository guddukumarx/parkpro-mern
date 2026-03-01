// scripts/createAdmin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

import User from '../models/User.js';

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const adminData = {
      name: 'Super Admin',
      email: 'admins@parkpro.com',
      password: 'Admin@123', // ye automatically hash ho jayega (pre-save hook)
      role: 'admin',
      ownerApprovalStatus: 'approved',
      isActive: true,
    };

    // Check if already exists
    const existing = await User.findOne({ email: adminData.email });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const admin = new User(adminData);
    await admin.save();
    console.log('Admin created successfully!');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();