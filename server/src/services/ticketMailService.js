const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create Nodemailer Transporter
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 465;

  console.log(`[SMTP SETUP] Connecting to ${host}:${port} as ${user}...`);

  if (host && user && pass) {
    return nodemailer.createTransport({
      host: host,
      port: port,
      secure: port === 465, // True for 465 (SSL), false for 587/2525 (TLS)
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  console.warn('[SMTP WARNING] Missing SMTP config. Using fallback transport.');
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'ethereal.user@ethereal.email',
      pass: 'ethereal_password',
    },
  });
};

// Helper: Format duration from minutes into Hours and Minutes (e.g. 145 mins -> 2h 25m)
const formatDuration = (mins) => {
  if (!mins) return '2h 00m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

/**
 * Send HTML Email Ticket Receipt to User
 */
const sendTicketEmail = async (userEmail, booking, selectedSnacks = []) => {
  try {
    const transporter = createTransporter();

    const show = booking.showId || {};
    const movie = show.movieId || {};
    const theatre = show.theatreId || {};

    const seatList = Array.isArray(booking.seats) ? booking.seats.join(', ') : booking.seats;
    const seatCount = Array.isArray(booking.seats) ? booking.seats.length : 1;
    const movieTitle = movie.title || 'Batwara 1947';
    const posterUrl = movie.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80';
    const durationFormatted = formatDuration(movie.duration || 145);
    const languagesStr = movie.language ? (Array.isArray(movie.language) ? movie.language.join(', ') : movie.language) : 'Hindi';

    const showDate = show.startTime ? new Date(show.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Mon, Aug 17, 2026';
    const showTime = show.startTime ? new Date(show.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '06:30 PM';

    // Calculate snacks total and generate HTML rows
    const snacksList = (selectedSnacks && selectedSnacks.length > 0) ? selectedSnacks : (booking.snacks || []);
    const snacksTotal = snacksList.reduce((sum, s) => sum + (s.price * s.quantity), 0);
    const ticketsSubtotal = booking.totalAmount || 0;
    const convenienceFee = 35;
    const grandTotal = ticketsSubtotal + convenienceFee + snacksTotal;

    const snacksHtmlRows = snacksList.length > 0 ? `
      <tr>
        <td colspan="2" style="padding-top: 6px; font-weight: bold; color: #F59E0B; font-size: 11px; text-transform: uppercase;">🍿 Pre-ordered Food & Snacks:</td>
      </tr>
      ${snacksList.map((s) => `
        <tr>
          <td style="padding: 4px 0 4px 12px; color: #F59E0B; font-size: 12px;">• ${s.name} (x${s.quantity})</td>
          <td style="text-align: right; font-weight: bold; color: #F59E0B; font-size: 12px;">+₹${s.price * s.quantity}</td>
        </tr>
      `).join('')}
    ` : '';

    // HTML Email Template with Table Layout for 100% Email Client Compatibility
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0B0F19; color: #F3F4F6; margin: 0; padding: 20px; }
          .container { max-width: 540px; margin: 0 auto; background-color: #161F30; border-radius: 20px; overflow: hidden; border: 1px solid #1F293D; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
          .header { background: linear-gradient(135deg, #E50914, #6366F1); padding: 28px 20px; text-align: center; color: #FFFFFF; }
          .header h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
          .header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; }
          .content { padding: 24px; }
          
          /* Table Poster Card */
          .movie-table { width: 100%; border-collapse: collapse; background-color: #0B0F19; border-radius: 14px; overflow: hidden; border: 1px solid #1F293D; margin-bottom: 20px; }
          .poster-td { width: 90px; padding: 14px; vertical-align: top; }
          .poster-img { width: 80px; height: 115px; object-fit: cover; border-radius: 10px; display: block; border: 1px solid rgba(255,255,255,0.15); }
          .details-td { padding: 14px 14px 14px 4px; vertical-align: top; }
          .badge { display: inline-block; background-color: rgba(229, 9, 20, 0.2); color: #E50914; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(229, 9, 20, 0.4); text-transform: uppercase; margin-bottom: 8px; }
          .movie-title { font-size: 20px; font-weight: 800; color: #FFFFFF; margin: 0 0 6px 0; line-height: 1.2; }
          .meta-text { font-size: 13px; color: #9CA3AF; margin-bottom: 4px; }

          /* Details Table */
          .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border-radius: 14px; overflow: hidden; border: 1px solid #1F293D; }
          .info-table td { padding: 14px; background-color: #0B0F19; font-size: 13px; border-bottom: 1px solid #1F293D; vertical-align: top; }
          .label { color: #9CA3AF; font-size: 11px; text-transform: uppercase; font-weight: 700; margin-bottom: 4px; }
          .val { font-weight: 700; color: #FFFFFF; font-size: 14px; }
          .val-green { font-weight: 800; color: #10B981; font-size: 14px; }

          /* Receipt Summary Table */
          .bill-box { background-color: #0B0F19; padding: 18px; border-radius: 14px; border: 1px solid #1F293D; margin-bottom: 20px; }
          .bill-table { width: 100%; border-collapse: collapse; }
          .bill-table td { padding: 6px 0; font-size: 13px; color: #D1D5DB; }
          .bill-table .amount { text-align: right; font-weight: 700; color: #FFFFFF; }
          .bill-table .total-label { padding-top: 12px; border-top: 1px solid #374151; font-weight: 800; color: #10B981; font-size: 15px; }
          .bill-table .total-amount { padding-top: 12px; border-top: 1px solid #374151; font-weight: 800; color: #10B981; font-size: 18px; text-align: right; }

          .gate-pass { text-align: center; background-color: #FFFFFF; padding: 18px; border-radius: 14px; }
          .footer { text-align: center; padding: 18px; font-size: 11px; color: #6B7280; border-top: 1px solid #1F293D; background-color: #0B0F19; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍿 Booking Confirmed!</h1>
            <p>Your CineMatrix Ticket & Receipt Pass</p>
          </div>

          <div class="content">
            
            <!-- Movie Poster & Info Table -->
            <table class="movie-table">
              <tr>
                <td class="poster-td">
                  <img src="${posterUrl}" alt="${movieTitle}" class="poster-img" />
                </td>
                <td class="details-td">
                  <div class="badge">Official Digital Pass</div>
                  <div class="movie-title">${movieTitle}</div>
                  <div class="meta-text">★ ${movie.rating || '8.8'} IMDb • <strong style="color: #F3F4F6;">${durationFormatted}</strong></div>
                  <div class="meta-text">${languagesStr}</div>
                </td>
              </tr>
            </table>

            <!-- Show & Seat Details Table -->
            <table class="info-table">
              <tr>
                <td style="width: 50%;">
                  <div class="label">Show Date</div>
                  <div class="val">${showDate}</div>
                </td>
                <td style="width: 50%;">
                  <div class="label">Show Timing</div>
                  <div class="val-green">${showTime}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="label">Theatre & Screen</div>
                  <div class="val">${theatre.name || 'PVR : SuperPlex Mall'}</div>
                  <div style="font-size: 11px; color: #9CA3AF; margin-top: 2px;">${theatre.address || theatre.city || '742 Broadways'} • Screen ${show.screenNumber || 1}</div>
                </td>
                <td>
                  <div class="label">Reserved Seats (${seatCount})</div>
                  <div class="val-green">${seatList}</div>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <div class="label">Booking Reference ID</div>
                  <div style="font-family: monospace; font-size: 15px; font-weight: 800; color: #FFFFFF; letter-spacing: 1px;">${booking.bookingId}</div>
                </td>
              </tr>
            </table>

            <!-- Itemized Receipt Summary Table -->
            <div class="bill-box">
              <div style="font-size: 12px; font-weight: 800; color: #E50914; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Payment Receipt Summary</div>
              <table class="bill-table">
                <tr>
                  <td>Tickets Subtotal (${seatCount} Seat${seatCount > 1 ? 's' : ''})</td>
                  <td class="amount">₹${ticketsSubtotal}</td>
                </tr>
                <tr>
                  <td>Convenience Booking Fee</td>
                  <td class="amount">₹${convenienceFee}</td>
                </tr>
                ${snacksHtmlRows}
                <tr>
                  <td class="total-label">Total Amount Paid</td>
                  <td class="total-amount">₹${grandTotal}</td>
                </tr>
              </table>
            </div>

            <!-- Gate Pass Scanner Info -->
            <div class="gate-pass">
              <div style="font-weight: 800; color: #111827; font-size: 14px; font-family: monospace;">BOOKING REF: ${booking.bookingId}</div>
              <div style="font-size: 11px; color: #4B5563; margin-top: 4px;">Present this ticket pass or QR code at the cinema gate entrance.</div>
            </div>

          </div>

          <div class="footer">
            © 2026 CineMatrix Cinema Ticket Booking Platform. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'CineMatrix Tickets'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: userEmail,
      subject: `🍿 Booking Confirmed: ${movieTitle} - Ticket ID #${booking.bookingId}`,
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL TICKET SUCCESS] Ticket email sent to ${userEmail} (Message ID: ${info.messageId})`);
    return info;
  } catch (error) {
    console.error(`[EMAIL TICKET ERROR] Failed to send ticket email to ${userEmail}:`, error.message);
  }
};

module.exports = { sendTicketEmail, formatDuration };
