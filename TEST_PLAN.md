# 🧪 E-Darshan Mandir - Complete Test Plan

## Test Environment
- **URL**: http://localhost:4200
- **Browsers to Test**: Chrome, Firefox, Safari, Edge
- **Devices**: Desktop, Mobile (iOS Safari, Android Chrome)
- **Network Conditions**: Online, Offline (test PWA)

---

## 🎯 Feature Test Cases

### 1. ✅ Devotional Loading Messages
**What to Test:**
- [ ] App shows loading screen on first load
- [ ] Loading messages rotate every 2 seconds
- [ ] Messages include spiritual phrases (10 different messages)
- [ ] Om symbol pulses with animation
- [ ] Progress bar fills smoothly
- [ ] Screen fades out after loading completes

**Expected Results:**
- Smooth fade-in of devotional messages
- Professional loading experience
- No flickering or jumps

---

### 2. ✅ PWA Quick Actions
**What to Test:**
- [ ] Install app to home screen (mobile/desktop)
- [ ] Long-press app icon shows shortcuts menu
- [ ] "Light Diya" shortcut opens wish flow directly
- [ ] "Play Chalisa" shortcut starts audio playback
- [ ] "Ring Bell" shortcut triggers bell sound

**How to Test:**
1. Install PWA: Click browser's install button
2. Android: Long-press app icon → See shortcuts
3. iOS: Add to home screen → Force touch icon
4. Desktop: Right-click app icon in taskbar

**Expected Results:**
- All 3 shortcuts appear in context menu
- Each shortcut performs correct action
- Shortcuts work immediately on app open

---

### 3. ✅ Diya Counter Animation
**What to Test:**
- [ ] Counter displays on home page
- [ ] Shows total diyas lit (starts at 10,000+)
- [ ] Today's count increments when you light a diya
- [ ] Month's count increments when you light a diya
- [ ] Numbers animate with ticker effect
- [ ] Counts persist after page reload
- [ ] Simulated real-time updates (random increments)

**How to Test:**
1. Note current counts
2. Navigate to wish flow
3. Light a diya with any name
4. Return to home page
5. Verify all counts increased by 1
6. Refresh page - counts should persist
7. Wait 1-2 minutes - total may randomly increase

**Expected Results:**
- Smooth number animations
- Accurate counting
- Beautiful gradient card design
- Responsive on mobile

---

### 4. ✅ Meditation Timer
**What to Test:**
- [ ] Timer card displays on home page
- [ ] 4 preset buttons: 5, 10, 15, 30 minutes
- [ ] Clicking preset starts countdown
- [ ] Circular progress ring fills clockwise
- [ ] Time displays in MM:SS format
- [ ] Stop button pauses timer
- [ ] Temple bell rings when timer completes
- [ ] Stats panel shows total sessions, minutes, streaks
- [ ] Current streak increments on consecutive days
- [ ] Stats persist after reload

**How to Test:**
1. Click "5" minutes button
2. Watch timer count down
3. Verify progress ring animates
4. Click stop to test early termination
5. Let a timer complete fully
6. Listen for temple bell sound
7. Click stats icon (📊) to view statistics
8. Test meditation on consecutive days for streak

**Expected Results:**
- Accurate countdown
- Smooth circular progress
- Bell rings at completion
- Streak tracking works correctly
- Green gradient theme

---

### 5. ✅ Offline Support Indicator
**What to Test:**
- [ ] Badge appears when going offline
- [ ] Toast notification shows status change
- [ ] "Blessed even offline ✨" message displays
- [ ] Badge disappears when back online
- [ ] "Back Online!" notification shows
- [ ] App functions work offline (PWA features)

**How to Test:**
1. Open app online normally
2. Open DevTools → Network tab
3. Set to "Offline" mode
4. Observe yellow badge in top-right
5. See toast notification slide in
6. Set back to "Online"
7. Badge should disappear
8. See green "Back Online!" notification

**Expected Results:**
- Instant offline detection
- Clear visual indicators
- Auto-dismiss notifications after 5 seconds
- Smooth animations

---

### 6. ✅ Dark Mode for Night Prayers
**What to Test:**
- [ ] Moon/Sun toggle button appears in header
- [ ] Clicking toggles dark mode on/off
- [ ] Dark mode persists after page reload
- [ ] Auto-enables after 7 PM (19:00)
- [ ] Auto-disables after 6 AM
- [ ] Background gradients change to dark themes
- [ ] Text remains readable in both modes
- [ ] All components look good in dark mode

**How to Test:**
1. Click moon icon (🌙) in top-right
2. Verify background darkens
3. Icon changes to sun (☀️)
4. Click again to toggle back
5. Refresh page - preference should persist
6. Change system time to 7:30 PM
7. Reload - should auto-enable dark mode
8. Change time to 7:00 AM
9. Reload - should auto-disable

**Expected Results:**
- Smooth theme transitions
- All text readable
- Icons and images visible
- Preference remembered
- Auto-switching works at correct times

---

### 7. ✅ Hanuman Chalisa Lyrics Display
**What to Test:**
- [ ] "Show Lyrics" button appears when audio plays
- [ ] Button is hidden when audio stops
- [ ] Clicking shows lyrics panel
- [ ] Panel slides up from bottom smoothly
- [ ] Current verse highlights in yellow
- [ ] Auto-scrolls to current verse
- [ ] Shows Hindi, transliteration, and English
- [ ] Doha verses have special styling
- [ ] Numbered verses show verse number
- [ ] Scrollable if content overflows
- [ ] "Hide Lyrics" closes panel

**How to Test:**
1. Start playing Hanuman Chalisa (click play button)
2. Wait for lyrics button to appear at bottom center
3. Click "📖 Show Lyrics"
4. Verify panel opens with smooth animation
5. Watch current verse highlight change
6. Scroll manually through verses
7. Let auto-scroll bring you back to current
8. Click "📖 Hide Lyrics" to close

**Expected Results:**
- Synchronized highlighting
- Smooth scrolling
- Beautiful typography
- Easy to read
- Responsive on mobile

**Note**: Only sample verses included. Add complete 40 verses in `src/app/models/chalisa-verses.ts` with accurate timing.

---

### 8. ✅ Aarti Notification System (Previous Feature)
**What to Test:**
- [ ] Toggle switch in audio player works
- [ ] Browser requests notification permission
- [ ] Next aarti time displays correctly
- [ ] Notifications fire at 8 AM, 1 PM, 7 PM
- [ ] Daily schedule shows all 3 times
- [ ] Settings persist after reload

**How to Test:**
1. Scroll to audio player section
2. Find purple notification settings card
3. Toggle switch ON
4. Allow browser notifications
5. Verify next aarti time is displayed
6. Mock system time to aarti time (optional)
7. Or wait for actual aarti time

**Expected Results:**
- Permission request appears once
- Next aarti calculated correctly
- Settings saved in localStorage

---

## 🎨 UI/UX Test Cases

### Visual Consistency
- [ ] All cards have consistent border-radius (16px)
- [ ] Color scheme matches (orange/saffron theme)
- [ ] Spacing is uniform across components
- [ ] Fonts are readable on all devices
- [ ] Icons render properly (emojis visible)

### Responsive Design
- [ ] Desktop (1920x1080): All features visible, good spacing
- [ ] Tablet (768x1024): Components stack nicely
- [ ] Mobile (375x667): Everything readable, no horizontal scroll
- [ ] Mobile landscape: Content adjusts properly

### Animations & Transitions
- [ ] All buttons have hover effects
- [ ] Cards have subtle shadows
- [ ] Transitions are smooth (not choppy)
- [ ] Loading states are clear
- [ ] No layout shifts during loading

### Accessibility
- [ ] All buttons have clear labels
- [ ] Color contrast passes WCAG AA
- [ ] Keyboard navigation works
- [ ] Screen reader friendly (test with screen reader)
- [ ] Focus indicators visible

---

## 🔧 Technical Test Cases

### Performance
- [ ] Initial load < 3 seconds on 3G
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] No memory leaks (check DevTools)
- [ ] Smooth 60fps animations

### Browser Compatibility
- [ ] Chrome (latest): All features work
- [ ] Firefox (latest): All features work
- [ ] Safari (latest): All features work
- [ ] Edge (latest): All features work
- [ ] Mobile Safari (iOS 14+): All features work
- [ ] Chrome Mobile (Android 10+): All features work

### PWA Functionality
- [ ] Service worker installs correctly
- [ ] Offline mode works (cached assets load)
- [ ] Add to home screen prompt appears
- [ ] App installs properly
- [ ] Manifest.json loads correctly
- [ ] Icons display in all sizes

### Data Persistence
- [ ] Diya counts survive page reload
- [ ] Meditation stats persist
- [ ] Dark mode preference saved
- [ ] Notification settings remembered
- [ ] Language preference maintained
- [ ] Audio volume level saved

### Audio System
- [ ] Audio plays at top of each hour
- [ ] Manual play/pause works
- [ ] Volume control adjusts sound
- [ ] Audio syncs to correct timestamp
- [ ] Multiple tabs don't conflict
- [ ] Audio stops when leaving page

---

## 🐛 Bug Testing

### Edge Cases
- [ ] Lighting 1000+ diyas (counter handles large numbers)
- [ ] Running meditation timer for 30+ minutes
- [ ] Switching dark mode rapidly (no UI glitches)
- [ ] Poor network conditions (graceful degradation)
- [ ] Clearing localStorage (app initializes correctly)
- [ ] Multiple browser tabs open (state syncs)

### Error Scenarios
- [ ] Audio file fails to load (error message shown)
- [ ] Notification permission denied (graceful handling)
- [ ] Invalid data in localStorage (app recovers)
- [ ] Network drops during meditation (timer continues)
- [ ] Browser doesn't support features (fallbacks work)

---

## 📱 Mobile-Specific Tests

### Touch Interactions
- [ ] All buttons respond to touch
- [ ] No accidental triggers
- [ ] Swipe gestures don't interfere
- [ ] Pull-to-refresh disabled appropriately
- [ ] Touch targets are 44x44px minimum

### Mobile Features
- [ ] Haptic feedback on supported devices
- [ ] Notifications work when app in background
- [ ] Screen stays on during meditation (optional)
- [ ] Landscape mode works properly
- [ ] Safe area (notch) handled correctly

---

## ✅ Acceptance Criteria

### Must Pass
1. No console errors or warnings
2. All 8 features functional
3. Responsive on mobile and desktop
4. Works in at least Chrome and Safari
5. PWA installable
6. Data persists across sessions
7. Smooth performance (no lag)

### Nice to Have
1. Perfect Lighthouse score
2. Works on older browsers
3. Haptic feedback
4. Advanced PWA features
5. Animations disabled option

---

## 🚀 Deployment Checklist

Before going live:
- [ ] All test cases passed
- [ ] No console errors in production build
- [ ] Service worker caching correctly
- [ ] Analytics integrated (if needed)
- [ ] Error tracking setup
- [ ] Performance optimized
- [ ] SEO metadata complete
- [ ] Social sharing works
- [ ] Manifest.json validated
- [ ] Icons for all sizes included

---

## 📊 Test Summary Template

```
Test Date: _______________
Tester: __________________
Environment: _____________

Features Tested: ___/8
Pass Rate: ____%
Critical Bugs: ___
Minor Issues: ___

Status: ☐ Pass  ☐ Fail  ☐ Needs Revision

Notes:
_________________________________
_________________________________
```

---

## 🎯 Quick Test Script (5-minute smoke test)

1. **Load App** (30s)
   - Watch loading messages
   - Verify home page loads

2. **Light a Diya** (1 min)
   - Navigate to wish flow
   - Enter name, light diya
   - Check counter increased

3. **Start Meditation** (1 min)
   - Click 5-minute preset
   - Verify timer counts down
   - Stop early

4. **Test Dark Mode** (30s)
   - Toggle dark mode on/off
   - Verify it looks good

5. **Play Chalisa** (1 min)
   - Click play button
   - Show lyrics
   - Verify highlighting works

6. **Go Offline** (30s)
   - Disable network
   - Check offline badge appears

7. **Check Mobile** (1 min)
   - Open on phone
   - Test responsive design
   - Try PWA shortcuts

**PASS CRITERIA**: All 7 steps work without errors

---

## 📞 Support & Debugging

### Common Issues & Solutions

**Issue**: Counter not incrementing
- **Fix**: Check browser's localStorage isn't disabled
- **Fix**: Clear site data and reload

**Issue**: Notifications not working
- **Fix**: Check browser notification permissions
- **Fix**: Verify HTTPS (required for notifications)

**Issue**: Audio not playing
- **Fix**: User must interact with page first (browser policy)
- **Fix**: Check audio file path is correct

**Issue**: Dark mode not persisting
- **Fix**: Check localStorage permissions
- **Fix**: Verify theme service is initialized

**Issue**: Lyrics not syncing
- **Fix**: Verify verse timings in chalisa-verses.ts
- **Fix**: Check audio.currentTime is accessible

---

## 🎉 Success Metrics

Your app is production-ready if:
- ✅ All 8 features work flawlessly
- ✅ Mobile experience is excellent  
- ✅ No performance issues
- ✅ Users can complete full user journey
- ✅ PWA installs and works offline
- ✅ Data persists correctly
- ✅ Beautiful UI with smooth animations

---

**Happy Testing! 🙏**

May Lord Hanuman bless your testing efforts! 🚩
