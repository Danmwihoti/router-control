const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Configuration
const ROUTER_CONFIG = {
  ip: process.env.ROUTER_IP || '192.168.1.1',
  username: process.env.ROUTER_USERNAME || 'admin',
  password: process.env.ROUTER_PASSWORD || 'admin',
};

// Rate limiting - prevent spam restarts
let lastRestartTime = 0;
const RESTART_COOLDOWN = 5 * 60 * 1000; // 5 minutes

// Logging helper
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type}] ${message}`);
}

// Check if router is online
app.get('/api/status', async (req, res) => {
  try {
    const response = await axios.get(`http://${ROUTER_CONFIG.ip}`, {
      timeout: 3000,
      validateStatus: () => true, // Accept any status code
    });
    
    const isOnline = response.status >= 200 && response.status < 500;
    
    log(`Router status check: ${isOnline ? 'ONLINE' : 'OFFLINE'}`);
    
    res.json({
      online: isOnline,
      ip: ROUTER_CONFIG.ip,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    log(`Router status check failed: ${error.message}`, 'ERROR');
    res.json({
      online: false,
      ip: ROUTER_CONFIG.ip,
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

// Restart router
app.post('/api/restart', async (req, res) => {
  try {
    // Rate limiting check
    const now = Date.now();
    if (now - lastRestartTime < RESTART_COOLDOWN) {
      const remainingTime = Math.ceil((RESTART_COOLDOWN - (now - lastRestartTime)) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${remainingTime} seconds before restarting again`,
        cooldown: remainingTime,
      });
    }

    log('Router restart requested', 'INFO');

    // Method 1: Try common restart endpoints
    const restartEndpoints = [
      '/reboot.cgi',
      '/api/system/reboot',
      '/goform/formReboot',
      '/restart.html',
      '/apply.cgi?submit_button=Reboot',
    ];

    let restartSuccess = false;
    let usedEndpoint = '';

    for (const endpoint of restartEndpoints) {
      try {
        const url = `http://${ROUTER_CONFIG.ip}${endpoint}`;
        log(`Trying restart endpoint: ${url}`, 'DEBUG');
        
        await axios.get(url, {
          auth: {
            username: ROUTER_CONFIG.username,
            password: ROUTER_CONFIG.password,
          },
          timeout: 5000,
          validateStatus: () => true,
        });

        restartSuccess = true;
        usedEndpoint = endpoint;
        break;
      } catch (error) {
        // Try next endpoint
        continue;
      }
    }

    if (restartSuccess) {
      lastRestartTime = now;
      log(`Router restart triggered successfully via ${usedEndpoint}`, 'SUCCESS');
      
      res.json({
        success: true,
        message: 'Router restarting... Please wait 60-90 seconds',
        method: 'HTTP Request',
        endpoint: usedEndpoint,
        estimatedDowntime: 60,
      });
    } else {
      log('All restart endpoints failed', 'WARN');
      res.json({
        success: false,
        message: 'Could not trigger restart via HTTP. Manual restart may be required.',
        note: 'Your router may require different credentials or endpoints',
      });
    }

  } catch (error) {
    log(`Router restart error: ${error.message}`, 'ERROR');
    res.status(500).json({
      success: false,
      message: 'Failed to restart router',
      error: error.message,
    });
  }
});

// Get router info
app.get('/api/info', (req, res) => {
  res.json({
    router: {
      ip: ROUTER_CONFIG.ip,
      configured: !!ROUTER_CONFIG.username && !!ROUTER_CONFIG.password,
    },
    server: {
      version: '1.0.0',
      uptime: process.uptime(),
      nodeVersion: process.version,
    },
    features: {
      autoRestart: false,
      scheduling: false,
      telegram: false,
    },
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  log(`===========================================`);
  log(`Router Control Server Started`);
  log(`===========================================`);
  log(`Server running on: http://0.0.0.0:${PORT}`);
  log(`Router IP: ${ROUTER_CONFIG.ip}`);
  log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  log(`===========================================`);
  
  // Print local IP for easy access
  const os = require('os');
  const interfaces = os.networkInterfaces();
  Object.keys(interfaces).forEach(name => {
    interfaces[name].forEach(iface => {
      if (iface.family === 'IPv4' && !iface.internal) {
        log(`Access from network: http://${iface.address}:${PORT}`);
      }
    });
  });
  
  log(`===========================================`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  log('SIGTERM received, shutting down gracefully', 'INFO');
  process.exit(0);
});

process.on('SIGINT', () => {
  log('SIGINT received, shutting down gracefully', 'INFO');
  process.exit(0);
});
