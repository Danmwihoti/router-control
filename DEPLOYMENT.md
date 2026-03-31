# 🚀 Deployment Guide - Testing on Another Laptop

## Prerequisites

Before you start, ensure the new laptop has:

- **Node.js** >= 16.0.0
- **npm** or **yarn**
- **Git**
- **Same WiFi network** as the router

---

## 📥 Step 1: Check Prerequisites

### On the new laptop, run:

```bash
# Check Node.js
node --version
# Should show: v16.0.0 or higher

# Check npm
npm --version
# Should show: 8.0.0 or higher

# Check Git
git --version
# Should show: git version 2.x.x
```

### If Node.js is missing:

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Mac:**
```bash
brew install node
```

**Or use nvm (recommended):**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

---

## 📦 Step 2: Clone Repository

```bash
# Navigate to where you want the project
cd ~/Documents  # or wherever you prefer

# Clone from GitHub
git clone https://github.com/Danmwihoti/router-control.git

# Enter directory
cd router-control

# Verify files are there
ls -la
```

**You should see:**
```
.env.example
.gitignore
LICENSE
README.md
SETUP.md
TEST.md
package.json
server.js
public/
```

---

## ⚙️ Step 3: Install Dependencies

```bash
# Install all packages
npm install

# This will install:
# - express (web server)
# - axios (HTTP client)
# - dotenv (environment variables)
# - puppeteer (optional, for advanced features)
# - nodemon (dev mode)
```

**Expected output:**
```
added 224 packages, and audited 225 packages in 2m
```

**If you see warnings about puppeteer:** That's normal, it's optional.

---

## 🔧 Step 4: Configure Environment

### Create your configuration file:

```bash
# Copy the example
cp .env.example .env

# Edit it
nano .env
# or
code .env
# or use any text editor
```

### Update these values in `.env`:

```env
# Router Configuration
ROUTER_IP=192.168.1.1              # Your router's IP
ROUTER_USERNAME=admin               # Router admin username
ROUTER_PASSWORD=your_actual_password # Router admin password

# Server Configuration
PORT=3000                           # Port to run on
NODE_ENV=development

# Security
ALLOWED_IPS=192.168.1.0/24
API_KEY=your-secret-key
```

### Find your router IP:

**Linux/Mac:**
```bash
ip route | grep default
# or
netstat -rn | grep default
```

**Windows:**
```cmd
ipconfig | findstr "Default Gateway"
```

---

## 🚀 Step 5: Start the Server

```bash
# Production mode
npm start

# OR Development mode (auto-restarts on changes)
npm run dev
```

**You should see:**
```
===========================================
Router Control Server Started
===========================================
Server running on: http://0.0.0.0:3000
Router IP: 192.168.1.1
Environment: development
===========================================
Access from network: http://192.168.1.XXX:3000
===========================================
```

**Note the network IP!** You'll need it to access from other devices.

---

## ✅ Step 6: Test Locally

### On the new laptop:

```bash
# Test server health
curl http://localhost:3000/health

# Expected:
{"status":"ok","timestamp":"..."}
```

```bash
# Test router status
curl http://localhost:3000/api/status

# Expected:
{"online":true,"ip":"192.168.1.1","timestamp":"..."}
```

```bash
# Open in browser
xdg-open http://localhost:3000
# or on Mac:
open http://localhost:3000
# or Windows:
start http://localhost:3000
```

---

## 🌐 Step 7: Test from Original Laptop

### On your FIRST laptop:

```bash
# Find the new laptop's IP
# Example: 192.168.1.200

# Test the API
curl http://192.168.1.200:3000/api/status

# Open in browser
xdg-open http://192.168.1.200:3000
```

**You should see:** The same router control interface!

---

## 📱 Step 8: Test from Phone

### On your phone (same WiFi):

1. Open browser
2. Type: `http://192.168.1.200:3000` (use new laptop's IP)
3. Should see router control interface
4. Try the restart button
5. Observe countdown and WiFi disconnect

---

## 🧪 Complete Test Checklist

Run these tests on the **new laptop**:

### API Tests:
```bash
# Health check
curl http://localhost:3000/health
# ✅ Expected: {"status":"ok"}

# Router status
curl http://localhost:3000/api/status
# ✅ Expected: {"online":true,"ip":"192.168.1.1"}

# Server info
curl http://localhost:3000/api/info
# ✅ Expected: Shows server version and uptime
```

### Web Interface Tests:
```bash
# Open in browser
xdg-open http://localhost:3000

# Check these:
# ✅ Page loads with purple gradient
# ✅ Shows "Router Control" header
# ✅ Status shows "Router Online" (green)
# ✅ IP shows: 192.168.1.1
# ✅ Restart button is clickable
```

### Network Access Tests:
```bash
# From FIRST laptop, test second laptop's server
curl http://NEW_LAPTOP_IP:3000/api/status

# From phone (same WiFi)
# Open: http://NEW_LAPTOP_IP:3000
```

### Restart Test (Optional):
```bash
# Send restart command
curl -X POST http://localhost:3000/api/restart

# Expected:
# {"success":true,"message":"Router restarting..."}

# Watch for:
# - WiFi disconnect
# - 60-90 second downtime
# - WiFi reconnect
```

---

## 🐛 Troubleshooting

### Problem: "npm install" fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install

# If still fails, try with legacy peer deps
npm install --legacy-peer-deps
```

---

### Problem: "Cannot access from other devices"

**Check firewall:**

**Ubuntu/Linux:**
```bash
# Allow port 3000
sudo ufw allow 3000/tcp

# Check status
sudo ufw status
```

**Mac:**
```bash
# Go to: System Preferences > Security & Privacy > Firewall
# Allow incoming connections for Node
```

**Windows:**
```cmd
# Go to: Windows Defender Firewall
# Allow port 3000 through firewall
```

---

### Problem: "Router status shows offline"

**Check:**
1. Is router IP correct in `.env`?
2. Can you ping the router?
   ```bash
   ping 192.168.1.1
   ```
3. Can you access router admin panel?
   ```bash
   curl http://192.168.1.1
   ```

---

### Problem: "Restart doesn't work"

**Find your router's correct endpoint:**

1. Open router admin: http://192.168.1.1
2. Open browser DevTools (F12)
3. Go to Network tab
4. Click router's restart button
5. Look for the request URL
6. Update `server.js` line ~45:

```javascript
const restartEndpoints = [
  '/your-custom-endpoint',  // Add yours here!
  '/reboot.cgi',
  '/api/system/reboot',
  // ...
];
```

---

### Problem: "Port 3000 already in use"

**Find what's using it:**
```bash
# Linux/Mac
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
# Edit .env:
PORT=3001
```

---

## 🔄 Multiple Laptops Scenario

### Can both laptops run the server?

**YES!** Here's how:

### Option A: Run on BOTH laptops (different ports)

**Laptop 1:**
```env
PORT=3000
```
Access: `http://192.168.1.155:3000`

**Laptop 2:**
```env
PORT=3001
```
Access: `http://192.168.1.200:3001`

**Both can control the same router!**

---

### Option B: Run on ONE laptop only

**Best practice:**
- Choose the laptop that's on most often
- Or the one closest to router
- Other devices just access that IP

---

## 📊 Network Diagram

```
Router (192.168.1.1)
    ↓
WiFi Network (192.168.1.0/24)
    ↓
    ├── Laptop 1 (192.168.1.155:3000) ← Running server
    ├── Laptop 2 (192.168.1.200:3001) ← Running server
    ├── Phone    (192.168.1.XXX)      ← Accessing either
    └── Other devices                 ← Can access either
```

---

## 🎯 Success Criteria

Your setup is working if:

✅ **On new laptop:**
- Server starts without errors
- Health endpoint responds
- Router status shows "online"
- Web interface loads in browser

✅ **From original laptop:**
- Can access new laptop's server
- API calls work
- Web interface loads
- Restart button functions

✅ **From phone:**
- Same as above
- Touch interface works smoothly

---

## 🚀 Next Steps

### Make it permanent:

**Install PM2 (process manager):**
```bash
# Install globally
npm install -g pm2

# Start with PM2
cd ~/router-control
pm2 start server.js --name router-control

# Make it start on boot
pm2 startup
pm2 save

# View logs
pm2 logs router-control

# Stop
pm2 stop router-control

# Restart
pm2 restart router-control
```

---

## 💡 Pro Tips

### Tip 1: Use Hostname Instead of IP
```bash
# On new laptop, set a hostname
sudo hostnamectl set-hostname router-laptop

# Then access via:
http://router-laptop.local:3000
```

### Tip 2: Bookmark on All Devices
Save these URLs:
- `http://localhost:3000` (on laptop running server)
- `http://192.168.1.XXX:3000` (from other devices)

### Tip 3: Check Server Status Remotely
```bash
# Quick status check
curl http://laptop-ip:3000/health

# If returns {"status":"ok"} → Server is running!
```

### Tip 4: Sync Updates
```bash
# On new laptop, get latest changes
cd ~/router-control
git pull origin main
npm install  # If dependencies changed
npm start
```

---

## 🔐 Security Reminder

If you expose this to internet (ngrok, port forwarding):

**MUST ADD:**
1. ✅ User authentication
2. ✅ HTTPS/SSL
3. ✅ Rate limiting (already included!)
4. ✅ API keys
5. ✅ Access logs

---

## ✅ Summary

**To test on another laptop:**

1. Clone repo from GitHub ✅
2. Run `npm install` ✅
3. Copy `.env.example` to `.env` ✅
4. Update router IP/credentials ✅
5. Run `npm start` ✅
6. Test locally first ✅
7. Test from other devices ✅

**Expected time:** 10-15 minutes

**Result:** Full router control from new laptop!

---

## 📞 Need Help?

**If something doesn't work:**
1. Check this guide's troubleshooting section
2. Review `TEST.md` for detailed testing
3. Check server logs: `cat server.log`
4. Open GitHub issue with details

**Your new laptop setup should be identical to original!** 🎉
