const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const BloodUnit = require('./models/BloodUnit');

dotenv.config();

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blood_bank');
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await BloodUnit.deleteMany({});

    // Admin
    await User.create({
      name: 'Admin User',
      email: 'admin@bloodbank.com',
      password: 'admin123',
      role: 'admin',
      phone: '+923001111111'
    });

    // Staff
    await User.create({
      name: 'Blood Bank Staff',
      email: 'staff@bloodbank.com',
      password: 'staff123',
      role: 'staff',
      phone: '+923002222222'
    });

    // Donors
    await User.create({
      name: 'Ali Khan',
      email: 'ali@donor.com',
      password: 'donor123',
      role: 'donor',
      phone: '+923003333333',
      bloodGroup: 'O+',
      isEligible: true,
      city: 'Lahore'
    });

    await User.create({
      name: 'Sara Ahmed',
      email: 'sara@donor.com',
      password: 'donor123',
      role: 'donor',
      phone: '+923004444444',
      bloodGroup: 'A+',
      isEligible: true,
      city: 'Karachi'
    });

    await User.create({
      name: 'Usman Raza',
      email: 'usman@donor.com',
      password: 'donor123',
      role: 'donor',
      phone: '+923005555555',
      bloodGroup: 'B+',
      isEligible: true,
      city: 'Islamabad'
    });

    // Hospital
    await User.create({
      name: 'City Hospital',
      email: 'hospital@city.com',
      password: 'hospital123',
      role: 'hospital',
      phone: '+923006666666',
      hospitalName: 'City General Hospital',
      address: 'Main Boulevard',
      city: 'Lahore'
    });

    // Initial inventory
    const initialStock = {
      'A+': 25, 'A-': 8, 'B+': 18, 'B-': 5,
      'AB+': 6, 'AB-': 2, 'O+': 30, 'O-': 12
    };

    for (const bg of BLOOD_GROUPS) {
      await BloodUnit.create({
        bloodGroup: bg,
        units: initialStock[bg] || 0,
        bags: []
      });
    }

    console.log('Seed data created successfully!');
    console.log('\n=== Login Credentials ===');
    console.log('Admin:    admin@bloodbank.com / admin123');
    console.log('Staff:    staff@bloodbank.com / staff123');
    console.log('Donor:    ali@donor.com / donor123');
    console.log('Hospital: hospital@city.com / hospital123');

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
