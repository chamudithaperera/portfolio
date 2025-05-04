const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Message = require('./models/Message');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Create message in database
    const newMessage = new Message({
      name,
      email,
      subject,
      message
    });

    await newMessage.save();

    // Try to send email
    try {
      const msg = {
        to: 'chamudithaperera.dev@gmail.com',
        from: 'chamudithaperera.dev@gmail.com',
        subject: subject || `New Contact Form Submission from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Contact Form Submission</h2>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject || 'No subject provided'}</p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <p style="margin-top: 20px; color: #666; font-size: 12px;">
              This email was sent from your portfolio website contact form.
            </p>
          </div>
        `
      };

      await sgMail.send(msg);
      newMessage.status = 'sent';
      await newMessage.save();
      
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      newMessage.status = 'failed';
      await newMessage.save();
      
      res.status(200).json({ 
        message: 'Message received. We will get back to you soon.',
        warning: 'Email notification failed, but your message was saved.'
      });
    }
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message. Please try again later.' });
  }
});

// Admin endpoint to view messages (protected with basic auth)
app.get('/api/messages', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || auth !== `Bearer ${process.env.ADMIN_TOKEN}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 