import express from 'express';
import { Log } from 'campus-logging-middleware';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// Application logic using the logger
app.get('/api/status', (req, res) => {
  // Using package: 'route'
  Log('backend', 'info', 'route', 'Received request on /api/status');
  
  try {
    // Simulating database or cache check
    // Using package: 'db'
    Log('backend', 'debug', 'db', 'Checking database connection health...');
    
    res.status(200).json({ status: 'ok', service: 'notification-app-be' });
    
    // Using package: 'handler'
    Log('backend', 'info', 'handler', 'Successfully responded to /api/status');
  } catch (error) {
    Log('backend', 'error', 'handler', `Error processing status route: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Added a POST endpoint to fulfill the screenshot requirement for 'Request Body'
app.post('/api/notifications', (req, res) => {
  const { title, message, type } = req.body;
  
  Log('backend', 'info', 'route', `Received POST request to create notification: ${title}`);
  
  if (!title || !message || !type) {
    Log('backend', 'warn', 'handler', 'Missing required fields in request body');
    return res.status(400).json({ error: 'title, message, and type are required' });
  }

  Log('backend', 'info', 'db', 'Simulating saving notification to database...');
  
  res.status(201).json({
    success: true,
    message: 'Notification created successfully',
    data: {
      id: Math.floor(Math.random() * 10000),
      title,
      message,
      type,
      createdAt: new Date().toISOString()
    }
  });
});

// A route that forces an error to demonstrate 'error' or 'fatal' logging
app.get('/api/error', (req, res) => {
  Log('backend', 'error', 'controller', 'Intentional error triggered by /api/error');
  res.status(500).json({ error: 'Intentional Server Error' });
});

app.listen(PORT, () => {
  Log('backend', 'info', 'config', `Backend Server running on port ${PORT}`);
  console.log(`Server listening on port ${PORT}`);
});
