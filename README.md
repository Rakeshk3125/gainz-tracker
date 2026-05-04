# GAINZ Tracker — Expo React Native App

## 🚀 Quick Setup (10 minutes)

### Step 1: Install Node.js
Download from https://nodejs.org (choose LTS version)

### Step 2: Install Expo Go on your phone
- iPhone: App Store → search "Expo Go"
- Android: Play Store → search "Expo Go"

### Step 3: Extract and open this folder
Unzip gainz-tracker.zip somewhere on your computer.

### Step 4: Open Terminal / Command Prompt
Navigate to the folder:
```
cd gainz-tracker
```

### Step 5: Install dependencies
```
npm install
```

### Step 6: Start the app
```
npx expo start
```

### Step 7: Scan the QR code
- iPhone: Open Camera app → point at QR code → tap the Expo Go banner
- Android: Open Expo Go app → tap "Scan QR code"

That's it! The app opens on your phone instantly. 🎉

---

## 📱 Features

### PIN Lock
- First launch: create a 4-digit PIN
- Every open requires your PIN
- Data stays private on your device

### 🏋️ Gym
- Today's plan auto-loads based on day of week
- Mon/Fri = Push · Tue/Sat = Pull · Wed = Legs · Thu = Strength · Sun = Rest
- Each session shows exercises, sets, reps, rest times, coaching tips
- Progressive overload reminders

### 🥩 Food — AI Analysis
- Type a paragraph describing what you ate
- Claude AI breaks it into individual items
- Returns: calories, protein, carbs, fat, fibre, sugar per item
- Full day running totals with goal bars
- Muscle gain notes for each meal

### 📚 Learn — SFMC Curriculum
- Daily 1-hour structured session
- 0–20 min: Study 5 concepts
- 20–40 min: Hands-on practice
- 40–60 min: Interview prep questions
- 6-week rotating curriculum covering all SFMC senior dev topics
- Swipe topics with ‹ › arrows

### 💻 Work
- Log sessions with hours, focus level, notes
- Weekly hours summary

### 📈 Stats
- Streak tracking (gym, learn, work)
- 7-day protein bar chart with goal line
- 28-day activity heatmap

---

## 🔄 Making it permanent (optional)

To install as a real app without needing Expo Go:
1. Create free account at expo.dev
2. Run: `npx expo build:android` or `npx expo build:ios`
3. This creates an APK/IPA you can install directly

---

## 📞 Support
Built with Expo SDK + React Navigation + AsyncStorage + Claude AI API
