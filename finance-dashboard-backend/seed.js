require('dotenv').config();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const User = require('./models/User');
const FinancialRecord = require('./models/FinancialRecord');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await FinancialRecord.deleteMany({});
    console.log('Cleared existing data');

    // Create test users
    const hashedPassword = await bcryptjs.hash('Password123', 10);

    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        status: 'active'
      },
      {
        name: 'Analyst User',
        email: 'analyst@example.com',
        password: hashedPassword,
        role: 'analyst',
        status: 'active'
      },
      {
        name: 'Viewer User',
        email: 'viewer@example.com',
        password: hashedPassword,
        role: 'viewer',
        status: 'active'
      },
      {
        name: 'Inactive User',
        email: 'inactive@example.com',
        password: hashedPassword,
        role: 'analyst',
        status: 'inactive'
      }
    ]);

    console.log('✓ Created 4 test users');

    // Create sample financial records
    const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Bonus'];
    const expenseCategories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping'];
    const adminId = users[0]._id;

    const records = [];
    const today = new Date();

    // Generate sample records for the last 3 months
    for (let i = 0; i < 30; i++) {
      const isIncome = Math.random() > 0.3;
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor(Math.random() * 90));

      if (isIncome) {
        records.push({
          amount: Math.round(Math.random() * 5000) + 500,
          type: 'income',
          category: incomeCategories[Math.floor(Math.random() * incomeCategories.length)],
          date,
          notes: 'Sample income record',
          createdBy: adminId,
          isDeleted: false
        });
      } else {
        records.push({
          amount: Math.round(Math.random() * 500) + 10,
          type: 'expense',
          category: expenseCategories[Math.floor(Math.random() * expenseCategories.length)],
          date,
          notes: 'Sample expense record',
          createdBy: adminId,
          isDeleted: false
        });
      }
    }

    await FinancialRecord.insertMany(records);
    console.log(`✓ Created ${records.length} sample financial records`);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Test User Credentials:');
    console.log('─────────────────────');
    console.log('Admin:    admin@example.com / Password123');
    console.log('Analyst:  analyst@example.com / Password123');
    console.log('Viewer:   viewer@example.com / Password123');
    console.log('Inactive: inactive@example.com / Password123 (inactive status)');
    console.log('\nRoles can now test their respective access levels.');

  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
  }
};

connectDB().then(() => seedData());
