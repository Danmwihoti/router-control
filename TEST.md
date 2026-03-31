# 🧪 Router Control - Testing Guide

## Quick Test Commands

### 1. Server Health
```bash
curl http://localhost:3000/health
```
**Expected:** `{"status":"ok","timestamp":"..."}`

---

### 2. Router Status
```bash
curl http://localhost:3000/api/status
```
**Expected:** `{"online":true,"ip":"192.168.1.1","timestamp":"..."}`

---

### 3. Server Info
```bash
curl http://localhost:3000/api/info
```
**Expected:** Router configured: true, Server version: 1.0.0

---

### 4. Web Interface Test
```bash
# Open in browser
xdg-open http://localhost:3000
```

**Checklist:**
- [ ] Page loads
- [ ] Status shows "Router Online" (green)
- [ ] IP shows: 192.168.1.1
- [ ] Restart button visible
- [ ] Last check timestamp updates

---

### 5. Restart Test (Safe)

**Option A: Dry Run (Recommended First)**
```bash
# Just test the API endpoint
curl -X POST http://localhost:3000/api/restart
```

**Option B: Real Test (Will Disconnect Internet!)**

1. Open web interface: http://localhost:3000
2. Click "🔄 Restart Router" button
3. Confirm the warning
4. Observe countdown timer
5. Wait 60-90 seconds
6. Check if internet returns

**Success Criteria:**
- [ ] Button triggers restart
- [ ] Countdown shows
- [ ] Internet goes down for ~60 sec
- [ ] Internet comes back
- [ ] Status returns to "Online"

---

## 🔍 Verify Actual Restart

### Check Router Uptime (Before Test)
```bash
# Note current uptime
curl -s http://192.168.1.1 | grep -i uptime
```

### Check Router Uptime (After Test)
```bash
# Uptime should be < 2 minutes if restart worked
curl -s http://192.168.1.1 | grep -i uptime
```

---

## 📱 Mobile Device Test

### Prerequisites
- Phone connected to same WiFi
- Laptop IP: 192.168.1.155

### Steps
1. Open phone browser
2. Visit: `http://192.168.1.155:3000`
3. Bookmark the page
4. Test restart button
5. Observe countdown
6. Wait for internet to return

**Success Criteria:**
- [ ] Page loads on phone
- [ ] Status shows correctly
- [ ] Restart button works
- [ ] Countdown visible
- [ ] Router actually restarts

---

## 🐛 Troubleshooting Tests

### Test 1: Can you reach router admin?
```bash
curl -s http://192.168.1.1 | head -20
```
**Expected:** HTML content from router

### Test 2: Are credentials correct?
```bash
curl -u admin:admin http://192.168.1.1/reboot.cgi
```
**Expected:** Some response (not 401 Unauthorized)

### Test 3: Is server running?
```bash
ps aux | grep "node server.js"
```
**Expected:** Process listed

### Test 4: Check server logs
```bash
cd ~/workspace/router-control
cat server.log | tail -20
```
**Expected:** Recent status checks logged

### Test 5: Network connectivity
```bash
ping -c 3 192.168.1.1
```
**Expected:** 0% packet loss

---

## 🔧 Finding Your Router's Restart Endpoint

### Method 1: Browser Inspection
1. Open http://192.168.1.1 in browser
2. Press F12 (Developer Tools)
3. Go to Network tab
4. Click router's restart button
5. Look for the request URL
6. Note the endpoint

### Method 2: Try Common Endpoints
```bash
# Test each endpoint manually
curl -u admin:password http://192.168.1.1/reboot.cgi
curl -u admin:password http://192.168.1.1/api/system/reboot
curl -u admin:password http://192.168.1.1/goform/formReboot
curl -u admin:password http://192.168.1.1/restart.html
```

One of these should work!

### Method 3: Check Router Documentation
- Search: "[Your Router Model] restart API endpoint"
- Check manufacturer's documentation

---

## ✅ Success Indicators

### Application is Working if:
1. ✅ Server responds to all API calls
2. ✅ Web interface loads correctly
3. ✅ Router status detected accurately
4. ✅ Restart command sends without errors
5. ✅ Mobile devices can access the app
6. ✅ Router actually reboots when triggered

### Application Needs Fixing if:
1. ❌ Status always shows "Offline"
2. ❌ Restart button shows error
3. ❌ Server not accessible from phone
4. ❌ Router doesn't actually restart
5. ❌ Timeouts or connection errors

---

## 📊 Test Report Template

After testing, fill this out:

```
✅ Server Health: PASS / FAIL
✅ Router Detection: PASS / FAIL
✅ Web Interface: PASS / FAIL
✅ Status Updates: PASS / FAIL
✅ Restart Button: PASS / FAIL
✅ Actual Router Reboot: PASS / FAIL
✅ Mobile Access: PASS / FAIL

Notes:
- 
- 
- 

Issues Found:
- 
- 
```

---

## 🚀 Next Steps After Testing

### If All Tests Pass:
1. ✅ Bookmark on all devices
2. ✅ Share with family/roommates
3. ✅ Post on LinkedIn!
4. ✅ Add to GitHub README as "Tested & Working"

### If Some Tests Fail:
1. Check troubleshooting section
2. Verify router endpoint
3. Check firewall settings
4. Review server logs

---

## 💡 Advanced Testing

### Load Test (Optional)
```bash
# Spam the status endpoint
for i in {1..100}; do
  curl -s http://localhost:3000/api/status > /dev/null
done
```

### Rate Limiting Test
```bash
# Try multiple restarts (should fail after first)
curl -X POST http://localhost:3000/api/restart
sleep 1
curl -X POST http://localhost:3000/api/restart
# Second should return 429 Too Many Requests
```

### Stress Test
```bash
# Multiple concurrent requests
for i in {1..10}; do
  curl -s http://localhost:3000/api/status &
done
wait
```

---

**Testing Complete!** 🎉

All tests passed? You're ready to use your router control app!

Issue found? Check the troubleshooting section or open an issue on GitHub.
