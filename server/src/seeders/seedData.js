const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Booking = require('../models/Booking');

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cinematrix');
};

const seedData = async () => {
  try {
    await connectDB();
    console.log('Connected to Database for Seeding...');

    // Clear existing data
    await User.deleteMany();
    await Movie.deleteMany();
    await Theatre.deleteMany();
    await Show.deleteMany();
    await Booking.deleteMany();

    console.log('Cleared existing collection data.');

    // 1. Create Users (Admin and Normal User)
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@cinematrix.com',
      password: 'adminpassword123',
      role: 'ADMIN',
      phone: '+19998887777',
    });

    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'userpassword123',
      role: 'USER',
      phone: '+12223334444',
    });

    console.log(`Created Admin User: ${admin.email} (Role: ${admin.role})`);
    console.log(`Created Test User: ${user.email} (Role: ${user.role})`);

    // 2. Create Sample Movies
    const movies = await Movie.insertMany([
      {
        title: 'Inception: Resonance',
        description: 'A mind-bending thriller exploring the deep layers of subconscious reality.',
        duration: 148,
        genre: ['Sci-Fi', 'Action', 'Thriller'],
        language: ['English', 'Hindi'],
        posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80',
        releaseDate: new Date('2026-05-15'),
        rating: 9.1,
      },
      {
        title: 'Cyberpunk Metropolis',
        description: 'In a futuristic neon city, a rogue hacker uncover a dangerous artificial intelligence conspiracy.',
        duration: 132,
        genre: ['Cyberpunk', 'Action'],
        language: ['English'],
        posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80',
        releaseDate: new Date('2026-07-20'),
        rating: 8.7,
      },
    ]);

    console.log(`Created ${movies.length} Movies.`);

    // 3. Create Sample Theatre with Screens and Seat Layout
    const rows = ['A', 'B', 'C', 'D'];
    const seatsPerRow = 8;
    const generateScreenSeats = () => {
      const seats = [];
      rows.forEach((r) => {
        for (let col = 1; col <= seatsPerRow; col++) {
          let seatType = 'STANDARD';
          if (r === 'C') seatType = 'PREMIUM';
          if (r === 'D') seatType = 'VIP';
          seats.push({
            seatNumber: `${r}${col}`,
            row: r,
            column: col,
            seatType,
          });
        }
      });
      return seats;
    };

    const theatre = await Theatre.create({
      name: 'CineMatrix IMAX & Multiplex',
      city: 'New York',
      address: '742 Broadway Ave, Manhattan, NY',
      screens: [
        {
          screenNumber: 1,
          name: 'IMAX Laser Screen 1',
          totalSeats: rows.length * seatsPerRow,
          seats: generateScreenSeats(),
        },
      ],
    });

    console.log(`Created Theatre: ${theatre.name} in ${theatre.city}`);

    // 4. Create Sample Show
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(18, 30, 0, 0);

    const screenSeats = theatre.screens[0].seats;
    const showSeats = screenSeats.map((s) => ({
      seatNumber: s.seatNumber,
      status: 'AVAILABLE',
      heldBy: null,
      heldUntil: null,
      price: s.seatType === 'VIP' ? 500 : s.seatType === 'PREMIUM' ? 350 : 200,
    }));

    const show = await Show.create({
      movieId: movies[0]._id,
      theatreId: theatre._id,
      screenNumber: 1,
      startTime: tomorrow,
      pricing: { STANDARD: 200, PREMIUM: 350, VIP: 500 },
      seats: showSeats,
    });

    console.log(`Created Show for '${movies[0].title}' at ${show.startTime}`);
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
