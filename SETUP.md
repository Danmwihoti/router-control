# 🚀 Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment

```bash
# Copy the template
cp .env.example .env

# Edit with your details
nano .env
```

**Update these values:**
- `ROUTER_IP` - Your router's IP (usually 192.168.1.1)
- `ROUTER_USERNAME` - Admin username
- `ROUTER_PASSWORD` - Admin password

## Step 3: Find Your Router's IP

```bash
# On Linux/Mac
ip route | grep default

# Result example: default via 192.168.1.1
```

The IP after "via" is your router!

## Step 4: Test Router Access

Open your browser:
```
http://192.168.1.1
```

Can you log in? ✅ Good! Use those credentials in `.env`

## Step 5: Run the Server

```bash
npm start
```

You should see:
```
===========================================
Router Control Server Started
===========================================
Server running on: http://0.0.0.0:3000
Router IP: 192.168.1.1
Access from network: http://192.168.1.155:3000
===========================================
```

## Step 6: Open the Dashboard

On your laptop:
```
http://localhost:3000
```

On your phone (same WiFi):
```
http://YOUR_LAPTOP_IP:3000
```

Example: `http://192.168.1.155:3000`

## Step 7: Test Restart

1. Click "🔄 Restart Router" button
2. Confirm the dialog
3. Wait 60-90 seconds
4. Internet should come back!

---

## 🐛 Troubleshooting

### "Cannot access from phone"

**Fix:** Check your firewall

```bash
# Ubuntu/Debian
sudo ufw allow 3000/tcp

# Or disable firewall temporarily
sudo ufw disable
```

### "Router not restarting"

**Fix:** Find your router's restart endpoint

1. Open http://192.168.1.1
2. Right-click → Inspect → Network tab
3. Click router's restart button
4. Look for the request URL
5. Add it to `server.js`:

```javascript
const restartEndpoints = [
  '/your-custom-endpoint',  // Add here!
  '/reboot.cgi',
  // ...
];
```

### "Status always offline"

Your router might need specific detection. Edit `server.js`:

```javascript
// Try ping instead
const { exec } = require('child_process');
exec('ping -c 1 ' + ROUTER_CONFIG.ip, (error) => {
  const isOnline = !error;
  // ...
});
```

---

## 📱 Access from Anywhere

Want to control from work/coffee shop?

```bash
# Install ngrok
npm install -g ngrok

# Start your app
npm start

# In another terminal
ngrok http 3000
```

You'll get: `https://abc123.ngrok.io` ← Bookmark this!

⚠️ **Security:** Add API key authentication for remote access!

---

## ✅ You're Done!

Bookmark the URL on your phone and never walk to the router again! 🎉

**Need help?** Open an issue on GitHub:
https://github.com/Danmwihoti/router-control/issues
