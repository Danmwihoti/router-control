# 🌐 Router Control - Remote Router Restart Web App

A simple, elegant web application that allows you to restart your router remotely from any device on your network. No more walking to the router to power cycle it!

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

---

## ✨ Features

- 🎯 **One-Click Restart** - Restart your router with a single button press
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔒 **Rate Limiting** - Prevents accidental spam restarts (5-minute cooldown)
- 📊 **Real-time Status** - Shows whether router is online or offline
- ⏱️ **Countdown Timer** - Visual feedback during restart process
- 🌈 **Beautiful UI** - Modern gradient design with smooth animations
- 🚀 **Zero Dependencies** (runtime) - Lightweight and fast
- 🔌 **Multi-Router Support** - Works with most common routers

---

## 🎯 Use Cases

### **Personal Use**
- Restart router when you're away from home
- Let family members restart without accessing admin panel
- Quick fix for connection issues

### **Small Business**
- Office staff can restart without IT support
- Reduce downtime from router hangs
- Remote management for small networks

### **Rentals/AirBnB**
- Guests can restart router themselves
- No need to share admin credentials
- Better guest experience

---

## 🚀 Quick Start

### **Prerequisites**

- Node.js >= 16.0.0
- npm or yarn
- Router with web admin interface

### **Installation**

```bash
# Clone the repository
git clone https://github.com/Danmwihoti/router-control.git
cd router-control

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your router details
nano .env
```

### **Configuration**

Edit `.env` file:

```env
ROUTER_IP=192.168.1.1          # Your router's IP address
ROUTER_USERNAME=admin           # Router admin username
ROUTER_PASSWORD=your_password   # Router admin password
PORT=3000                       # Server port
```

### **Run the App**

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

### **Access the Dashboard**

Open your browser:
```
http://localhost:3000
```

Or from another device on your network:
```
http://YOUR_LAPTOP_IP:3000
```

Example: `http://192.168.1.155:3000`

---

## 📖 How It Works

1. **Web Server** - Express.js server runs on your laptop/PC
2. **Status Check** - Pings router every 30 seconds to check if online
3. **Restart Trigger** - Sends HTTP request to router's restart endpoint
4. **Power Cycle** - Router reboots (typically 60-90 seconds)
5. **Auto-Recovery** - Dashboard automatically refreshes when router is back

---

## 🛠️ Finding Your Router's Restart Endpoint

Different routers use different endpoints. Here's how to find yours:

### **Method 1: Browser Inspection**

1. Open your router admin panel (`http://192.168.1.1`)
2. Right-click → Inspect → Network tab
3. Click the "Restart" or "Reboot" button
4. Look for the request URL (e.g., `/reboot.cgi`)

### **Method 2: Common Endpoints**

The app automatically tries these common endpoints:
- `/reboot.cgi`
- `/api/system/reboot`
- `/goform/formReboot`
- `/restart.html`
- `/apply.cgi?submit_button=Reboot`

### **Method 3: Manual Configuration**

Edit `server.js` and add your router's specific endpoint:

```javascript
const restartEndpoints = [
  '/your-custom-endpoint',  // Add your endpoint here
  '/reboot.cgi',
  // ... other endpoints
];
```

---

## 📱 Access from Mobile

### **Option 1: Local Network (Free)**

Just bookmark `http://YOUR_IP:3000` on your phone. Only works when connected to same WiFi.

### **Option 2: Remote Access (ngrok)**

Access from anywhere in the world:

```bash
# Install ngrok
npm install -g ngrok

# Start your app
npm start

# In another terminal
ngrok http 3000
```

You'll get a public URL like: `https://abc123.ngrok.io`

⚠️ **Security Note:** Use ngrok's authentication feature or implement your own API key for remote access.

---

## 🔐 Security Considerations

### **Current Security**

✅ Rate limiting (5-minute cooldown)  
✅ Confirmation dialog before restart  
✅ Local network only by default  
✅ No exposed credentials in frontend

### **Recommended Enhancements**

For production use, consider adding:

1. **API Key Authentication**
   ```javascript
   // Add to server.js
   app.use((req, res, next) => {
     const apiKey = req.headers['x-api-key'];
     if (apiKey !== process.env.API_KEY) {
       return res.status(401).json({ error: 'Unauthorized' });
     }
     next();
   });
   ```

2. **HTTPS** (for remote access)
3. **User Authentication** (login system)
4. **IP Whitelisting**
5. **Audit Logging**

---

## 🎨 Customization

### **Change Router Name**

Edit `public/index.html`:
```html
<div class="router-name">My Home Router</div>
```

### **Change Colors**

Edit the gradient in `public/index.html`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### **Add Features**

Common additions:
- Scheduled restarts (e.g., 3 AM daily)
- Multiple router support
- Email notifications
- Restart history log
- Telegram bot integration

---

## 🐛 Troubleshooting

### **Router not restarting**

1. Check router IP is correct in `.env`
2. Verify username/password are correct
3. Find your router's specific restart endpoint
4. Check router logs for errors

### **Cannot access from other devices**

1. Check firewall allows port 3000
2. Verify laptop IP address
3. Ensure devices are on same network
4. Try `0.0.0.0` instead of `localhost`

### **Status always shows offline**

1. Router might block ping requests
2. Check if router web interface is accessible
3. Try different status check methods

---

## 📊 Tested Routers

| Brand | Model | Status | Endpoint |
|-------|-------|--------|----------|
| TP-Link | Archer C7 | ✅ Works | `/reboot.cgi` |
| Netgear | R7000 | ✅ Works | `/api/system/reboot` |
| Asus | RT-AC68U | ✅ Works | `/apply.cgi` |
| D-Link | DIR-615 | ✅ Works | `/goform/formReboot` |
| Tozed Kangwei | Generic | 🧪 Testing | `/reboot.html` |

**Add your router:** Submit a PR with your router model and endpoint!

---

## 🚀 Roadmap

### **v1.1** (Next Release)
- [ ] Telegram bot integration
- [ ] Auto-restart on connection loss
- [ ] Multiple router support
- [ ] Dark/light theme toggle

### **v2.0** (Future)
- [ ] Mobile app (React Native)
- [ ] User authentication
- [ ] Scheduled restarts
- [ ] Analytics dashboard
- [ ] Docker support

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Daniel Mwihoti**
- GitHub: [@Danmwihoti](https://github.com/Danmwihoti)
- LinkedIn: [daniel-mwihoti](https://linkedin.com/in/daniel-mwihoti-3aaa652b9)
- Email: danmwihoti@gmail.com

---

## 🙏 Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- Icons from emoji unicode
- Inspired by the frustration of walking to the router 🏃‍♂️

---

## 📞 Support

- 🐛 **Bug Reports:** [Open an issue](https://github.com/Danmwihoti/router-control/issues)
- 💡 **Feature Requests:** [Open an issue](https://github.com/Danmwihoti/router-control/issues)
- 💬 **Questions:** [Discussions](https://github.com/Danmwihoti/router-control/discussions)

---

## ⭐ Star History

If this project helped you, please give it a ⭐!

---

**Made with ❤️ in Nairobi, Kenya 🇰🇪**
