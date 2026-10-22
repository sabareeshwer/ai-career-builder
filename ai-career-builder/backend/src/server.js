const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const { connectDB, getDBStatus } = require('./config/db');
const { getAIStatus } = require('./services/aiService');
const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const coverLetterRoutes = require('./routes/coverLetterRoutes');
const careerRoutes = require('./routes/careerRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// System Status & Health Check
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  const aiStatus = getAIStatus();
  res.json({
    status: 'online',
    appName: 'AI Career Builder API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      connected: dbStatus.isConnected,
      fallbackMode: dbStatus.isFallbackMode,
      engine: dbStatus.isConnected ? 'MongoDB Active' : 'Resilient File-Backed Persistence (Active)',
    },
    aiEngine: {
      provider: aiStatus.provider,
      description: aiStatus.engine,
      isConfigured: aiStatus.hasKey,
    },
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/cover-letters', coverLetterRoutes);
app.use('/api/career', careerRoutes);

// Root greeting
app.get('/', (req, res) => {
  res.json({
    message: 'AI Career Builder Backend API is running smoothly.',
    documentation: '/api/health',
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Server & Database
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 AI Career Builder Server running on port ${PORT}`);
    console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🤖 AI Status: ${getAIStatus().engine}`);
    console.log(`💾 Database: ${getDBStatus().isConnected ? 'MongoDB' : 'Resilient Persistence Engine'}`);
    console.log(`====================================================`);
  });
};

startServer();
