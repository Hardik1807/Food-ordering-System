const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./db'); // Import connectDB

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('message', (data) => {
    console.log('Message received:', data);
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

module.exports = { io, server };

app.use('/api/auth', require('./Routes/Auth')); // Ensure the path is correct

(async () => {
  try {
    await connectDB(); // Connect to the database

    server.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
      console.log("Server started successfully");
    }).on('error', (err) => {
      console.error('Server error:', err);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
})();
