const cron = require('node-cron');
const Show = require('../models/Show');
const Booking = require('../models/Booking');

const initExpiredHoldsCron = () => {
  // Schedule task to run every 1 minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      // Find shows with expired seat holds
      const shows = await Show.find({
        'seats.status': 'HELD',
        'seats.heldUntil': { $lt: now },
      });

      let totalReleased = 0;

      for (const show of shows) {
        let showUpdated = false;

        show.seats.forEach((seat) => {
          if (seat.status === 'HELD' && seat.heldUntil && new Date(seat.heldUntil) < now) {
            seat.status = 'AVAILABLE';
            seat.heldBy = null;
            seat.heldUntil = null;
            showUpdated = true;
            totalReleased++;
          }
        });

        if (showUpdated) {
          await show.save();
        }
      }

      // Mark associated held bookings as EXPIRED
      const expiredBookings = await Booking.updateMany(
        {
          status: 'HELD',
          expiresAt: { $lt: now },
        },
        {
          $set: { status: 'EXPIRED' },
        }
      );

      if (totalReleased > 0 || expiredBookings.modifiedCount > 0) {
        console.log(
          `[CRON] Cleaned up ${totalReleased} expired seat holds and ${expiredBookings.modifiedCount} expired booking records.`
        );
      }
    } catch (error) {
      console.error('[CRON Error] Failed to release expired holds:', error.message);
    }
  });

  console.log('Background cron worker for releasing expired seat holds initialized.');
};

module.exports = initExpiredHoldsCron;
