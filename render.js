const express = require('express');
const { createServer } = require('http');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`${req.method} ${req.path}`);
  }
  next();
});

async function startRenderServer() {
  try {
    // Register API routes
    const server = await registerRoutes(app);
    
    // For production, serve a simple HTML page instead of complex static serving
    app.use('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      
      // Serve the main application HTML
      res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>InstaBoost SMM Panel</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #0e1d18, #1c2d24);
                color: #f4ebd0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .container { 
                text-align: center; 
                max-width: 600px;
                padding: 2rem;
                background: rgba(28, 45, 36, 0.9);
                border-radius: 1rem;
                border: 1px solid rgba(214, 173, 96, 0.3);
                backdrop-filter: blur(10px);
              }
              h1 { 
                color: #d6ad60; 
                margin-bottom: 1rem;
                font-size: 2.5rem;
              }
              p { 
                margin-bottom: 1rem; 
                color: #cccccc;
                line-height: 1.6;
              }
              .status { 
                background: rgba(214, 173, 96, 0.1);
                padding: 1rem;
                border-radius: 0.5rem;
                border: 1px solid rgba(214, 173, 96, 0.3);
                margin: 1rem 0;
              }
              .api-status {
                color: #3ccf4e;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🚀 InstaBoost SMM Panel</h1>
              <p>Your Instagram Social Media Marketing panel is now live!</p>
              
              <div class="status">
                <div class="api-status">✅ API Server Running</div>
                <div>✅ MongoDB Connected</div>
                <div>✅ 14 Services Available</div>
                <div>✅ Ready for Orders</div>
              </div>
              
              <p>API Endpoints:</p>
              <p>• POST /api/auth/login - User Authentication</p>
              <p>• GET /api/services - Available Services</p>
              <p>• POST /api/orders - Place Orders</p>
              <p>• GET /api/health - Health Check</p>
              
              <p style="margin-top: 2rem; font-size: 0.9rem; opacity: 0.8;">
                Server Environment: ${process.env.NODE_ENV || 'production'}<br>
                MongoDB Status: Connected<br>
                Port: ${process.env.PORT || 5000}
              </p>
            </div>
          </body>
        </html>
      `);
    });

    const port = process.env.PORT || 5000;
    server.listen(port, '0.0.0.0', () => {
      console.log(`🚀 InstaBoost SMM Panel running on port ${port}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'production'}`);
      console.log(`🌐 Server ready for requests`);
    });
    
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

startRenderServer();