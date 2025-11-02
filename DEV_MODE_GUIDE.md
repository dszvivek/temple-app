# 🔧 Developer Mode - Complete Control Guide

## Overview
Developer Mode gives you **complete control** over all time-based and scheduled features in the Temple app. No more waiting for specific times to test features!

## Activation

### Keyboard Shortcut
Press **Ctrl + Shift + D** anywhere in the app to toggle Developer Mode on/off.

### Visual Indicator
When active, you'll see a floating **🔧 Developer Controls** panel in the bottom-right corner.

---

## Features You Can Control

### 1. ⏰ Temple Hours (5AM-7PM Override)
**What it controls:**
- Temple open/closed status
- Ambient sounds (temple bells, shankh, background audio)
- Temple status pill indicator

**How to use:**
1. ✅ Check "Override temple open/close times"
2. ✅ Check "Force temple to be OPEN" to simulate temple being open anytime
3. ❌ Uncheck to simulate temple being closed

**What you can test:**
- Ambient sounds playing outside 5AM-7PM hours
- Temple status pill showing "OPEN" or "CLOSED"
- Time-based UI changes

**Services affected:**
- `TempleScheduleService` - Temple hours logic
- `AmbientAudioService` - Background ambient sounds

---

### 2. 🎵 Hourly Hanuman Chalisa (Automatic Playback)
**What it controls:**
- Automatic Hanuman Chalisa playback every hour
- Normally only plays 5AM-7PM for the first ~8 minutes of each hour

**How to use:**
1. ✅ Check "Override hourly Chalisa timing"
2. ✅ Check "Force Chalisa to play now" to start immediate playback
3. ⚠️ **Important:** You must enable the audio player first (click the audio button in the app)

**What you can test:**
- Chalisa playing outside scheduled hours
- Automatic playback at any time
- Audio synchronization

**Services affected:**
- `AudioPlayerService` - Hourly Chalisa scheduling

---

### 3. 🔔 Scheduled Chants (Manual Trigger)
**What it controls:**
- Morning Hanuman Chalisa (6:00 AM)
- Evening Aarti (6:00 PM)
- Night Prayer (9:00 PM)

**How to use:**
1. Click **"⚡ Trigger All Scheduled Chants Now"** button
2. All enabled scheduled chants will fire immediately
3. Notifications will appear (if permission granted)

**What you can test:**
- Scheduled chant notifications
- Chant callback handlers
- Audio playback triggers

**Services affected:**
- `SchedulerService` - Scheduled chants management

---

### 4. 🐛 Debug Console Logs
**What it controls:**
- Verbose logging in browser console

**How to use:**
1. ✅ Check "Show debug console logs"
2. Open browser DevTools (F12) → Console tab
3. See detailed logs for all dev mode operations

**What you'll see:**
- Dev mode toggle messages
- Override state changes
- Service method calls
- Time calculations

---

## Complete Feature Matrix

| Feature | Normal Behavior | Dev Mode Override |
|---------|----------------|-------------------|
| **Temple Hours** | 5AM-7PM only | Override to OPEN/CLOSED anytime |
| **Ambient Audio** | Only during temple hours | Force ON/OFF regardless of time |
| **Hourly Chalisa** | Every hour 5AM-7PM (first 8min) | Force play/stop anytime |
| **Scheduled Chants** | At specific times (6AM, 6PM, 9PM) | Trigger all immediately |
| **Status Pill** | Shows actual temple status | Shows forced status |
| **Temple Background** | Changes based on time | Changes based on override |

---

## Technical Implementation

### Services Enhanced with Dev Mode

1. **DevModeService** (`dev-mode.service.ts`)
   - Central control service
   - localStorage persistence
   - Observable config stream
   - Keyboard shortcut handler

2. **TempleScheduleService** (`temple-schedule.service.ts`)
   ```typescript
   private checkIfOpen(): boolean {
     const forcedState = this.devMode.getForcedTempleOpenState();
     if (forcedState !== null) return forcedState;
     // Normal time-based logic...
   }
   ```

3. **AmbientAudioService** (`ambient-audio.service.ts`)
   ```typescript
   private checkIfTempleOpen(): boolean {
     const forcedState = this.devMode.getForcedTempleOpenState();
     if (forcedState !== null) return forcedState;
     // Normal time-based logic...
   }
   ```

4. **AudioPlayerService** (`audio-player.service.ts`)
   ```typescript
   private checkAndAutoPlay(): void {
     const forcedPlay = this.devMode.getForcedChalisaPlayState();
     if (forcedPlay !== null) {
       // Handle forced play/stop
       return;
     }
     // Normal hourly logic...
   }
   ```

5. **SchedulerService** (`scheduler.service.ts`)
   ```typescript
   private checkScheduledChants(): void {
     if (this.devMode.shouldTriggerScheduledChants()) {
       // Trigger all enabled chants immediately
       return;
     }
     // Normal scheduled checks...
   }
   ```

### Configuration Structure
```typescript
interface DevModeConfig {
  enabled: boolean;                // Master toggle
  overrideTempleOpen: boolean;     // Override temple hours?
  forceTempleOpen: boolean;        // Force open (true) or closed (false)
  overrideHourlyChalisa: boolean;  // Override Chalisa timing?
  forceChalisaPlay: boolean;       // Force play (true) or stop (false)
  overrideScheduler: boolean;      // Override scheduler?
  triggerScheduledChants: boolean; // Trigger all chants now
  showDebugInfo: boolean;          // Console logging
}
```

### localStorage Persistence
All settings are saved to `localStorage` under key `'temple_dev_mode'` and persist across:
- Page refreshes
- Browser restarts
- App updates

---

## Testing Workflows

### Workflow 1: Test Ambient Sounds Outside Hours
1. Press **Ctrl+Shift+D**
2. ✅ Check "Override temple open/close times"
3. ✅ Check "Force temple to be OPEN"
4. 🎵 Ambient sounds should now play (if not muted)
5. Click the unmute button if needed
6. Verify temple status pill shows "OPEN"

### Workflow 2: Test Hourly Chalisa Anytime
1. Press **Ctrl+Shift+D**
2. ✅ Check "Override hourly Chalisa timing"
3. Enable audio player in the app (click audio button)
4. ✅ Check "Force Chalisa to play now"
5. 🎵 Chalisa should start playing immediately
6. Check countdown timer updates

### Workflow 3: Test All Scheduled Chants
1. Press **Ctrl+Shift+D**
2. Grant notification permissions (if not already)
3. Click **"⚡ Trigger All Scheduled Chants Now"**
4. 🔔 All enabled chants trigger at once
5. Check notifications appear
6. Verify callbacks fire

### Workflow 4: Test Temple Closed State
1. Press **Ctrl+Shift+D**
2. ✅ Check "Override temple open/close times"
3. ❌ **Uncheck** "Force temple to be OPEN"
4. 🔒 Temple is now "CLOSED"
5. Verify ambient sounds stop
6. Verify status pill shows "CLOSED"
7. Verify background dims/changes

---

## Troubleshooting

### Problem: Dev panel doesn't appear
**Solution:** 
- Press Ctrl+Shift+D
- Check browser console for errors
- Clear localStorage and try again

### Problem: Chalisa won't play when forced
**Solution:**
- Enable audio player first (click audio button in app)
- Browser might block autoplay - user interaction required
- Check volume isn't muted

### Problem: Changes not taking effect
**Solution:**
- Refresh the page after enabling overrides
- Check that main "Override" checkbox is enabled
- Look for console errors (enable debug mode)

### Problem: Settings reset after refresh
**Solution:**
- Check browser localStorage is enabled
- Check for private/incognito mode (localStorage limited)
- Verify no browser extensions are blocking storage

---

## Best Practices

✅ **DO:**
- Enable debug logs when troubleshooting
- Use Ctrl+Shift+D to quickly toggle on/off
- Test one feature at a time
- Refresh page after major changes
- Check console for dev mode messages

❌ **DON'T:**
- Leave dev mode on in production
- Forget to re-enable overrides after page refresh
- Try to force Chalisa without enabling audio first
- Expect instant effects without page refresh

---

## Quick Reference Card

| Action | Shortcut/Steps |
|--------|----------------|
| **Toggle Dev Mode** | Ctrl + Shift + D |
| **Force Temple Open** | Dev Panel → Temple Hours → Override → Force OPEN |
| **Force Temple Closed** | Dev Panel → Temple Hours → Override → Force CLOSED (uncheck) |
| **Play Chalisa Now** | Dev Panel → Hourly Chalisa → Override → Force Play |
| **Stop Chalisa** | Dev Panel → Hourly Chalisa → Override → Uncheck Force Play |
| **Trigger Chants** | Dev Panel → Scheduled Chants → Click Trigger Button |
| **Enable Debug Logs** | Dev Panel → Debugging → Show debug logs |
| **Close Panel** | Click ✕ or press Ctrl + Shift + D |

---

## For Production

### Disabling Dev Mode
Dev mode is **always available** (it's for developers!), but you can:
1. Not mention it in user docs
2. Require Ctrl+Shift+D knowledge
3. Remove the keyboard shortcut in production build (optional)

### Security Considerations
- Dev mode is **client-side only**
- No server API calls affected
- No data is modified permanently
- Only affects local browser state
- Safe for production use

---

## Support

If you encounter issues:
1. Enable debug logs
2. Check browser console
3. Verify localStorage permissions
4. Test in incognito mode to rule out extensions
5. Clear localStorage: `localStorage.removeItem('temple_dev_mode')`

---

**Happy Testing! 🙏 Jai Hanuman! 🚩**
