/* eslint-disable no-undef */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { db } = require('./db.js');
const { accounts, events, chat_messages, joined_events, users } = require('./drizzle-schema.js');
const { eq, and, gt, sql, count, desc, or } = require('drizzle-orm');
const verifyToken = require('./middlewares/verifyToken.js');
const multer = require('multer');
const upload = multer();
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const qr = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const server = express();
const host = 'localhost';
const port = 4435;

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

server.use(cors({
  origin: ['http://localhost:5173', 'http://dungaw.ua:5173'],
  credentials: true
}));



server.post("/verify-ticket", async (req, res) => {
  try {
    const { email, eventId, ticketId } = req.body;

    // 1. Check for missing data
    if (!email || !eventId || !ticketId) {
      return res.status(400).json({
        status: "error",
        message: "Invalid QR Code: Missing required data."
      });
    }

    // 2. Find the user's ticket AND the Event Name
    const result = await db.select({
      user_email: joined_events.user_email,
      event_id: joined_events.event_id,
      ticket_id: joined_events.ticket_id,
      time_in: joined_events.time_in,
      time_out: joined_events.time_out,
      event_name: events.event_name
    }).from(joined_events).innerJoin(events, eq(joined_events.event_id, events.event_id)).where(and(eq(joined_events.user_email, email), eq(joined_events.event_id, eventId), eq(joined_events.ticket_id, ticketId)));

    const ticket = result[0];

    // 3. Check if the ticket is valid
    if (!ticket) {
      return res.status(404).json({
        status: "error",
        message: "❌ Ticket Not Found. Not registered for this event."
      });
    }

    // 4. Handle the Time In / Time Out logic
    const now = new Date();
    const friendlyTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // --- THIS IS THE FIRST SCAN (TIME IN) ---
    if (ticket.time_in === null) {
      await db.update(joined_events).set({ time_in: now }).where(and(eq(joined_events.user_email, email), eq(joined_events.event_id, eventId)));

      // --- Send TIME IN Email ---
      try {
        const msg = {
          to: ticket.user_email,
          from: 'jmmvenegas@antiquespride.edu.ph', // Your verified sender
          subject: `Scan Confirmation: ${ticket.event_name}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <h2 style="color: #006400;">Scan Successful!</h2>
              <p>This email confirms your attendance for the event:</p>
              <p><strong>Event:</strong> ${ticket.event_name}</p>
              <p><strong>Status:</strong> <span style="color: #006400; font-weight: bold;">TIME IN</span></p>
              <p><strong>Time:</strong> ${friendlyTime}</p>
              <p style="margin-top: 20px; font-size: 0.9em; color: #777;">
                University of Antique Event Management
              </p>
            </div>
          `,
        };
        await sgMail.send(msg);
      } catch (emailError) {
        console.error("Failed to send TIME IN email:", emailError.response?.body || emailError);
      }

      return res.json({
        status: "success",
        message: "✅ TIME IN Successful!",
        email: ticket.user_email,
        time: now
      });

      // --- THIS IS THE SECOND SCAN (TIME OUT) ---
    } else if (ticket.time_out === null) {
      await db.update(joined_events).set({ time_out: now }).where(and(eq(joined_events.user_email, email), eq(joined_events.event_id, eventId)));

      // --- Send TIME OUT Email ---
      try {
        const msg = {
          to: ticket.user_email,
          from: 'jmmvenegas@antiquespride.edu.ph', // Your verified sender
          subject: `Scan Confirmation: ${ticket.event_name}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <h2 style="color: #b8860b;">Scan Successful!</h2>
              <p>This email confirms your checkout for the event:</p>
              <p><strong>Event:</strong> ${ticket.event_name}</p>
              <p><strong>Status:</strong> <span style="color: #b8860b; font-weight: bold;">TIME OUT</span></p>
              <p><strong>Time:</strong> ${friendlyTime}</p>
              <p style="margin-top: 20px; font-size: 0.9em; color: #777;">
                University of Antique Event Management
              </p>
            </div>
          `,
        };
        await sgMail.send(msg);
      } catch (emailError) {
        console.error("Failed to send TIME OUT email:", emailError.response?.body || emailError);
      }

      return res.json({
        status: "warning", // Use 'warning' for time out
        message: "✅ TIME OUT Successful!",
        email: ticket.user_email,
        time: now
      });

      // --- THIS IS THE THIRD (OR MORE) SCAN ---
    } else {
      return res.status(409).json({ // 409 Conflict
        status: "error",
        message: "❌ Already Scanned. User has already timed in and timed out.",
        email: ticket.user_email,
        time: ticket.time_out
      });
    }

  } catch (err) {
    console.error("Error verifying ticket:", err);
    res.status(500).json({
      status: "error",
      message: "Server Error. Please check logs."
    });
  }
});


server.put("/chats/mark-all-read", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  try {
    // Update the 'last_read_at' timestamp for ALL events this user has joined
    await db.update(joined_events).set({ last_read_at: new Date() }).where(eq(joined_events.user_email, email));
    res.json({ success: true });
  } catch (err) {
    console.error("Error marking all chats as read:", err);
    res.status(500).json({ error: "Server error" });
  }
});

server.get("/chats/notifications/:email", async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // 1. Get all chatrooms (events) the user is in, now JOINing to get the EventName
    const joinedRows = await db.select({
      event_id: joined_events.event_id,
      last_read_at: joined_events.last_read_at,
      event_name: events.event_name
    }).from(joined_events).innerJoin(events, eq(joined_events.event_id, events.event_id)).where(eq(joined_events.user_email, email));

    if (joinedRows.length === 0) {
      return res.json({ unreadChats: [] }); // User isn't in any chats
    }

    const unreadChats = []; // This will hold our list of unread chats

    // 2. Loop and check each chatroom for new messages
    for (const event of joinedRows) {
      const { event_id, last_read_at, event_name } = event;

      // 3. Check for any message sent by ANOTHER user
      let messageRows;
      if (last_read_at === null) {
        // If they've never read, any message from others is new
        messageRows = await db.select().from(chat_messages).where(and(eq(chat_messages.chatroom_id, event_id), sql`${chat_messages.user_email} != ${email}`)).limit(1);
      } else {
        // If they have read, check for messages sent after that time
        messageRows = await db.select().from(chat_messages).where(and(eq(chat_messages.chatroom_id, event_id), sql`${chat_messages.user_email} != ${email}`, gt(chat_messages.sent_at, last_read_at))).limit(1);
      }

      // 4. If we find a new message, add this event to our list
      if (messageRows.length > 0) {
        unreadChats.push({
          eventId: event_id,
          eventName: event_name
        });
      }
    }

    // 5. If the loop finishes, return the complete list
    return res.json({ unreadChats: unreadChats });

  } catch (err) {
    console.error("Error checking notifications:", err);
    res.status(500).json({ error: "Server error checking notifications" });
  }
});

// ✅ Get joined count per event
server.get("/event/:id/join-count", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.select({ total: count() }).from(joined_events).where(eq(joined_events.event_id, id));

    // Convert BigInt to number safely
    const total = Number(result[0]?.total ?? 0);

    res.json({ total });
  } catch (err) {
    console.error("Error getting join count:", err);
    res.status(500).json({ error: "Failed to get join count" });
  }
});


server.get("/event/:id/participants", async (req, res) => {
  const { id } = req.params;

  try {
    const rows = await db.select({
      email: joined_events.user_email,
      name: sql`COALESCE(${users.name}, ${joined_events.user_email})`,
      joinedAt: joined_events.joined_at,
      timeIn: joined_events.time_in,
      timeOut: joined_events.time_out
    }).from(joined_events).leftJoin(users, eq(joined_events.user_email, users.email)).where(eq(joined_events.event_id, id));

    res.set('Cache-Control', 'no-store');
    res.json(rows);
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ message: "Server error" });
  }
});



server.get('/auth/verify', verifyToken, (req, res) => {
  res.json({
    valid: true,
    user: req.user
  });
});


server.get("/my-chats/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const result = await db.select({
      event_id: events.event_id,
      event_name: events.event_name,
      event_photo: events.event_photo,
      event_dept: events.event_dept,
      event_venue: events.event_venue
    }).from(joined_events).innerJoin(events, eq(joined_events.event_id, events.event_id)).where(eq(joined_events.user_email, email)).orderBy(desc(joined_events.joined_at));

    res.json(result);
  } catch (err) {
    console.error("Error fetching joined chats:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ SEND MESSAGE
server.post("/chatroom/:id", async (req, res) => {
  const chatroomId = req.params.id;
  const { user_email, message_content } = req.body;

  if (!user_email || !message_content) {
    return res.status(400).json({ error: "Missing user_email or message_content" });
  }

  try {
    await db.insert(chat_messages).values({
      chatroom_id: chatroomId,
      user_email,
      message_content,
      sent_at: new Date()
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Error sending chat message:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// ✅ GET MESSAGES
server.get("/chatroom/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await db.select().from(chat_messages).where(eq(chat_messages.chatroom_id, id)).orderBy(chat_messages.sent_at);
    res.json(rows);

  } catch (err) {
    console.error("Error fetching chat messages:", err);
    res.status(500).json({ error: "Database error" });
  }
});



// 🌟 --- REPLACE your /join-event endpoint with this updated version --- 🌟
server.post("/join-event", async (req, res) => {
  const { email, eventId, eventName } = req.body;

  if (!email || !eventId || !eventName) {
    return res.status(400).json({ success: false, message: "Missing email, eventId, or eventName" });
  }

  // 🌟 --- This is the FIXED code --- 🌟

  try {
    // 1. Check if already joined
    const existing = await db.select().from(joined_events).where(and(eq(joined_events.user_email, email), eq(joined_events.event_id, eventId)));

    if (existing.length > 0) {
      // ...
      return res.status(409).json({ success: false, message: "Already joined this event" });
    }

    // 2. Generate unique ticket ID and QR Code (Unchanged)
    const ticket_id = uuidv4();
    const qrData = JSON.stringify({
      email: email,
      eventId: eventId,
      ticketId: ticket_id
    });

    // Generate the QR code as a Base64 Data URL
    const qrCodeDataURL = await qr.toDataURL(qrData);

    // 3. Save to database (Unchanged)
    await db.insert(joined_events).values({
      user_email: email,
      event_id: eventId,
      ticket_id
    });

    // ✅ --- 4. PREPARE EMAIL ATTACHMENT ---
    // Extract the base64 content from the data URL
    // The data URL is "data:image/png;base64,THE_BASE64_DATA"
    // We split at the comma and take the second part.
    const base64Data = qrCodeDataURL.split(",")[1];

    try {
      const msg = {
        to: email,
        from: 'jmmvenegas@antiquespride.edu.ph', // Your verified sender
        subject: `Your Ticket for ${eventName}`,

        // ✅ HTML is updated to use 'cid:'
        html: `
                      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                          <h2>You're In!</h2>
                          <p>You have successfully joined the event: <strong>${eventName}</strong>.</p>
                          <p>Please present this unique QR code to the event admin for scanning.</p>

                          <img src="cid:eventqrcode" alt="Your Event QR Code" style="width: 250px; height: 250px; margin-top: 20px;" />

                          <p style="margin-top: 30px; font-size: 0.9em; color: #777;">
                              University of Antique Event Management
                          </p>
                      </div>
                `,

        // ✅ --- ADD THIS ATTACHMENTS ARRAY ---
        attachments: [
          {
            content: base64Data,      // The raw base64 data
            filename: 'qrcode.png',   // The name of the file
            type: 'image/png',        // The MIME type
            disposition: 'inline',    // Tells the email client to display it inline
            content_id: 'eventqrcode' // The unique ID we reference in the HTML src
          }
        ]
      };
      await sgMail.send(msg); // Send the email

    } catch (emailError) {
      console.error("Email (SendGrid) failed to send, but user was joined:", emailError.response?.body || emailError);
    }

    // 5. Send success response back to frontend (Unchanged)
    // This is still correct because the browser modal CAN display base64 images
    res.json({
      success: true,
      message: "Event added to chat list!",
      qrCodeDataURL: qrCodeDataURL
    });

  } catch (err) {
    console.error("Join event error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


server.post("/send-join-email", async (req, res) => {
  const { email, eventName } = req.body;

  if (!email || !eventName) {
    return res.status(400).json({ success: false, message: "Email or eventName missing" });
  }

  try {
    const msg = {
      to: email, // Recipient
      from: {
        email: 'jmmvenegas@antiquespride.edu.ph', // Must match verified sender
        name: 'Joshua Miguel Venegas',
      },
      subject: `Event Confirmation: ${eventName}`,
      text: `You have successfully joined the event "${eventName}". See you there!`,
      html: `<p>🎉 You have successfully joined the event <b>${eventName}</b>.<br/>See you there!</p>`,
    };

    await sgMail.send(msg);

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending join email:", error.response ? error.response.body : error);
    res.status(500).json({
      success: false,
      message: "Email sending failed.",
      error: error.response ? error.response.body : error.message
    });
  }
});


server.post("/events/delete", async (req, res) => {
  try {
    const { id } = req.body;


    await db.delete(joined_events).where(eq(joined_events.event_id, id));


    await db.delete(events).where(eq(events.event_id, id));

    res.json({ success: true, message: "Event and joined entries deleted successfully!" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});



const uploadsPath = path.join(__dirname, 'uploads');
console.log("Serving static files from:", uploadsPath);

server.use('/api/upload', express.static(uploadsPath));

// POST /google-login
server.post("/google-login", async (req, res) => {
  try {
    console.log(">>> /google-login body:", req.body);

    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: "Missing idToken" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ success: false, message: "Invalid Google token" });
    }

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || "";
    const picture = payload.picture || null;

    // ✅ Restrict domain
    if (!email.endsWith("@antiquespride.edu.ph")) {
      return res.status(403).json({ success: false, message: "Email not allowed" });
    }

    // ✅ query DB
    const usersResult = await db.select().from(users).where(eq(users.email, email));

    let user = usersResult.length > 0 ? usersResult[0] : null;

    if (!user) {
      const insertResult = await db.insert(users).values({
        google_id,
        name,
        email,
        picture
      }).returning({ id: users.id });

      user = {
        id: insertResult[0].id,
        google_id,
        name,
        email,
        picture,
      };


      console.log("Inserted new user:", user);
    }

    const token = jwt.sign(
      {
        id: Number(user.id), // ✅ VERY IMPORTANT FIX
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ success: true, token, user });
  } catch (err) {
    console.error("Google auth error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});



server.get('/manageEvents', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json({ success: true, message: "Access granted to admin" });
});

// --- MODIFIED: Get Events (changed ORDER BY) ---
server.get("/events", async (req, res) => {
  try {
    const rows = await db.select({
      ...events,
      EventDate: events.event_start_date
    }).from(events).orderBy(events.event_start_date);
    res.send(rows);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});


// Example of protecting backend routes:
server.get('/adminEvents', verifyToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'co-admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  // continue with logic...
});

server.get('/accounts', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  // continue with logic...
});

// --- MODIFIED: Get events by status (changed ORDER BY) ---
server.get("/events/status/:status", async (req, res) => {
  try {
    const { status } = req.params;
    const rows = await db.select({
      ...events,
      EventDate: events.event_start_date
    }).from(events).where(eq(events.event_status, status)).orderBy(desc(events.event_start_date));
    res.json(rows);

  } catch (err) {
    console.error("Error fetching events by status:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// ✅ Update event status (approve/deny)
server.put("/events/status/update", async (req, res) => {
  try {
    // 1. Destructure all potential data from the body
    const { id, status, reason } = req.body;

    // 2. Check if all required fields are present
    if (!id || !status) {
      return res.status(400).json({ error: "Missing ID or Status" });
    }

    let query;
    let params;

    if (status === "Denied") {
      // 3. If denying, update status AND the reason
      // We default the reason to an empty string if it's not provided
      await db.update(events).set({ event_status: status, event_denial_reason: reason || "" }).where(eq(events.event_id, id));

    } else if (status === "Approved") {
      // 4. If approving, update status and CLEAR any previous denial reason
      await db.update(events).set({ event_status: status, event_denial_reason: null }).where(eq(events.event_id, id));

    } else {
      // 5. Fallback for any other status (if you have them)
      await db.update(events).set({ event_status: status }).where(eq(events.event_id, id));
    }
    res.json({ success: true, message: `Event ${status} successfully!` });

  } catch (err) {
    console.error("Error updating event status:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});


// --- MODIFIED: /events/add endpoint ---
server.post('/events/add', upload.single('photo'), async (req, res) => {
  const task = req.body;
  const file = req.file;

  // --- ADDED: Handle null/empty endDate ---
  // If task.endDate is an empty string "" or undefined, set it to null for the database
  const startDate = task.startDate;
  const endDate = task.endDate || null;

  await db.insert(events).values({
    event_name: task.title,
    event_time: task.time,
    event_start_date: startDate,
    event_end_date: endDate,
    event_venue: task.venue,
    event_description: task.description,
    event_photo: file ? file.originalname : null,
    event_dept: task.dept,
    event_status: 'Submitted'
  });
  // --- END OF MODIFICATION ---

  res.json({ success: true });
});



//Protect Endpoint
server.get('/adminEvents', verifyToken, async (req, res) => {
  try {
    res.json({
      success: true,
      message: `Access granted to ${req.user.username}`,
      user: req.user,
    });
  } catch (err) {
    console.error('Error in /adminEvents:', err);
    res
      .status(500)
      .json({ success: false, message: 'Server error' });
  }
});
//JWT token nga darwa ka adlaw gin problemahan



server.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login attempt:", username, password);

    const accountsResult = await db.select().from(accounts).where(and(eq(accounts.account_username, username), eq(accounts.account_password, password)));

    const user = accountsResult[0];
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    console.log("DB result:", user);

    const payload = {
      id: user.account_id,
      username: user.account_username,
      role: user.account_type,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      success: true,
      message: "Login successful",
      token,
      role: user.account_type.trim(),
      user: {
        id: user.account_id,
        username: user.account_username,
        role: user.account_type.trim(),
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


//GET By Juswa

server.get('/accounts/order/id', async (req, res) => {
  try {
    const data = await db.select().from(accounts).orderBy(accounts.account_id);
    res.json(data);
  } catch (err) {
    console.error("Database query failed:", err);
    res.status(500).json({ error: err.message });
  }
});

//Edit Account
server.put('/accounts/edit', async (req, res) => {
  try {
    const task = req.body;

    await db.update(accounts).set({
      account_username: task.username,
      account_password: task.password
    }).where(eq(accounts.account_id, task.id));

    console.log("Update result:", result);
    res.json({ message: "Account updated successfully!" });
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({ message: "Failed to update account" });
  }
});

//Delete Account

server.post('/accounts/delete', async (req, res) => {
  try {
    console.log('Request body:', req.body);

    const { id } = req.body;

    await db.delete(accounts).where(eq(accounts.account_id, id));

    console.log('Deleted:', result);

    res.json({ success: true, deletedId: id });
  } catch (err) {
    console.error('Error deleting account:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});


//Search ka mga Event

//Sakit sa likod tak an ako Sir

server.post('/account/search', async (req, res) => {
  try {
    const { department, role } = req.body;

    const depKeyword = `%${department || ''}%`;
    const roleKeyword = `%${role || ''}%`;

    console.log("Searching accounts:", depKeyword, roleKeyword);

    const rows = await db.select().from(accounts).where(or(
      sql`LOWER(${accounts.account_name}) LIKE LOWER(${depKeyword})`,
      sql`LOWER(${accounts.account_type}) LIKE LOWER(${roleKeyword})`
    ));

    res.json(rows);
  } catch (err) {
    console.error("Error searching accounts:", err);
    res.status(500).json({ error: err.message });
  }
});

server.post('/accounts/post', async (req, res) => {
  try {
    const task = req.body;
    const result = await db.insert(accounts).values({
      account_name: task.name,
      account_username: task.username,
      account_password: task.password,
      account_type: task.role,
      account_creation: task.creation
    });

    console.log(result);
    res.json({ success: true, insertedId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

(async () => {
  server.listen(port, () => console.log(`API server is now running at ${host}:${port}`));
})();
