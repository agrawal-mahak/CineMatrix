const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cinematrix');
};

const seedData = async () => {
  try {
    await connectDB();
    console.log('Connected to Database for Seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Movie.deleteMany();
    await Theatre.deleteMany();
    await Show.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();

    console.log('Cleared existing collections.');

    // 1. Create Users
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

    const user2 = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      password: 'userpassword123',
      role: 'USER',
      phone: '+15556667777',
    });

    console.log('Created Users.');

    // 2. Create Movies with YouTube Trailer URLs & Format tags
    const movies = await Movie.insertMany([
      {
        title: 'Inception: Resonance',
        description: 'A mind-bending sci-fi thriller exploring the deep layers of subconscious reality and dream extraction.',
        duration: 148,
        genre: ['Sci-Fi', 'Action', 'Thriller'],
        language: ['English', 'Hindi'],
        format: ['2D', '3D', 'IMAX 3D'],
        posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80',
        trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0',
        releaseDate: new Date('2026-05-15'),
        rating: 9.2,
      },
      {
        title: 'Cyberpunk Metropolis',
        description: 'In a futuristic neon city, a rogue hacker uncovers a high-stakes AI conspiracy that threatens humanity.',
        duration: 132,
        genre: ['Cyberpunk', 'Action', 'Mystery'],
        language: ['English', 'Telugu'],
        format: ['2D', 'IMAX 3D', '4DX'],
        posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80',
        trailerUrl: 'https://www.youtube.com/embed/LembwKOiWPE',
        releaseDate: new Date('2026-07-20'),
        rating: 8.8,
      },
      {
        title: 'Starlight Symphony',
        description: 'An inspiring musical romantic journey across Paris and Tokyo between two passionate street musicians.',
        duration: 118,
        genre: ['Romance', 'Drama', 'Music'],
        language: ['English', 'Hindi', 'Tamil'],
        format: ['2D', 'Dolby Atmos'],
        posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80',
        trailerUrl: 'https://www.youtube.com/embed/c3sBBRxDAqk',
        releaseDate: new Date('2026-08-01'),
        rating: 8.5,
      },
      {
        title: 'Shadow Realm Chronicles',
        description: 'An epic fantasy blockbuster following a brave band of warriors battling dark magical warlords.',
        duration: 165,
        genre: ['Fantasy', 'Adventure', 'Action'],
        language: ['English', 'Hindi', 'Telugu', 'Tamil'],
        format: ['3D', 'IMAX 3D', '4DX'],
        posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80',
        trailerUrl: 'https://www.youtube.com/embed/tcTY5382h-w',
        releaseDate: new Date('2026-08-10'),
        rating: 9.0,
      },
    ]);

    console.log(`Created ${movies.length} Movies.`);

    // 3. Create Sample Theatres in Mumbai, Delhi, Bengaluru
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

    const theatres = await Theatre.insertMany([
      {
        name: 'PVR INOX : Phoenix Palladium',
        city: 'Mumbai',
        address: '462 Senapati Bapat Marg, Lower Parel, Mumbai',
        screens: [
          { screenNumber: 1, name: 'IMAX Laser Screen 1', totalSeats: 32, seats: generateScreenSeats() },
          { screenNumber: 2, name: 'Audi 2 Dolby Atmos', totalSeats: 32, seats: generateScreenSeats() },
        ],
      },
      {
        name: 'Cinepolis : Viviana Mall',
        city: 'Mumbai',
        address: 'Eastern Express Highway, Thane West, Mumbai',
        screens: [
          { screenNumber: 1, name: '4DX Screen 1', totalSeats: 32, seats: generateScreenSeats() },
        ],
      },
      {
        name: 'PVR Director\'s Cut : Vasant Kunj',
        city: 'Delhi',
        address: 'Ambience Mall, Vasant Kunj, New Delhi',
        screens: [
          { screenNumber: 1, name: 'VIP Gold Screen 1', totalSeats: 32, seats: generateScreenSeats() },
        ],
      },
      {
        name: 'INOX : Forum Rex Walk',
        city: 'Bengaluru',
        address: 'Brigade Road, Ashok Nagar, Bengaluru',
        screens: [
          { screenNumber: 1, name: 'IMAX Screen 1', totalSeats: 32, seats: generateScreenSeats() },
        ],
      },
    ]);

    console.log(`Created ${theatres.length} Theatres.`);

    // 4. Create Multi-Date Showtimes (Today, Tomorrow, +2 Days, +3 Days)
    const showtimes = [];
    const timeOffsets = [
      { h: 10, m: 30 },
      { h: 14, m: 15 },
      { h: 18, m: 30 },
      { h: 21, m: 45 },
    ];

    for (let dayOffset = 0; dayOffset < 4; dayOffset++) {
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() + dayOffset);

      theatres.forEach((th) => {
        movies.forEach((mv, mIdx) => {
          // Add 2 showtimes per movie per theatre
          timeOffsets.slice(mIdx % 2, (mIdx % 2) + 2).forEach((time) => {
            const startTime = new Date(baseDate);
            startTime.setHours(time.h, time.m, 0, 0);

            const showSeats = th.screens[0].seats.map((s, sIdx) => ({
              seatNumber: s.seatNumber,
              // Randomly mark a few seats booked to demonstrate seat states
              status: sIdx === 3 || sIdx === 11 ? 'BOOKED' : 'AVAILABLE',
              heldBy: null,
              heldUntil: null,
              price: s.seatType === 'VIP' ? 500 : s.seatType === 'PREMIUM' ? 350 : 200,
            }));

            showtimes.push({
              movieId: mv._id,
              theatreId: th._id,
              screenNumber: 1,
              startTime,
              pricing: { STANDARD: 200, PREMIUM: 350, VIP: 500 },
              seats: showSeats,
            });
          });
        });
      });
    }

    await Show.insertMany(showtimes);
    console.log(`Created ${showtimes.length} multi-date showtimes.`);

    // 5. Seed Reviews
    await Review.insertMany([
      {
        movieId: movies[0]._id,
        userId: user._id,
        userName: 'John Doe',
        rating: 5,
        headline: 'Absolute Masterpiece of Cinema!',
        comment: 'Mind-bending visuals, astonishing sound design, and unmatched storytelling. Must watch in IMAX 3D!',
        likes: 14,
      },
      {
        movieId: movies[0]._id,
        userId: user2._id,
        userName: 'Sarah Connor',
        rating: 5,
        headline: 'Christopher Nolan Vibes',
        comment: 'The background score gives goosebumps! Easily the best sci-fi film of the decade.',
        likes: 9,
      },
      {
        movieId: movies[1]._id,
        userId: user._id,
        userName: 'John Doe',
        rating: 4,
        headline: 'Thrilling Cyberpunk Action',
        comment: 'Great world-building and neon aesthetics. High energy throughout!',
        likes: 5,
      },
    ]);

    console.log('Seeded User Reviews.');
    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
