# Temple Schedule Service

## Overview
The `TempleScheduleService` provides real-time temple status tracking with countdown functionality. It automatically monitors temple hours (5:00 AM - 7:00 PM local time) and provides observables for temple status, next events, and countdown timers.

## Features

### 🕐 Temple Hours
- **Open:** 5:00 AM - 7:00 PM (Local Time)
- Automatically detects current status
- Updates every second for real-time accuracy

### 📊 Observables
```typescript
isOpen$: Observable<boolean>
// Emits true when temple is open, false when closed

nextEventLabel$: Observable<string>
// Emits event description: "Temple Opens", "Evening Aarti", "Temple Closes"

countdown$: Observable<string>
// Emits formatted countdown: "12:35:42" (hh:mm:ss)
```

### 🎯 Next Events
The service tracks three types of events:
1. **Temple Opens** - 5:00 AM daily
2. **Evening Aarti** - 7:00 PM (when temple closes)
3. **Temple Closes** - 7:00 PM daily

## Usage

### In a Component
```typescript
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TempleScheduleService } from './services/temple-schedule.service';

@Component({
  selector: 'app-my-component',
  template: `
    <div>
      <p>Temple is: {{ (isOpen$ | async) ? 'Open' : 'Closed' }}</p>
      <p>Next: {{ nextEventLabel$ | async }}</p>
      <p>Countdown: {{ countdown$ | async }}</p>
    </div>
  `
})
export class MyComponent implements OnInit {
  isOpen$!: Observable<boolean>;
  nextEventLabel$!: Observable<string>;
  countdown$!: Observable<string>;

  constructor(private scheduleService: TempleScheduleService) {}

  ngOnInit(): void {
    this.isOpen$ = this.scheduleService.isOpen$;
    this.nextEventLabel$ = this.scheduleService.nextEventLabel$;
    this.countdown$ = this.scheduleService.countdown$;
  }
}
```

### Get Schedule Info
```typescript
// Get current schedule configuration
const schedule = this.scheduleService.getSchedule();
// Returns: { openHour: 5, openMinute: 0, closeHour: 19, closeMinute: 0 }

// Get formatted times
const openingTime = this.scheduleService.getOpeningTime(); // "05:00"
const closingTime = this.scheduleService.getClosingTime(); // "19:00"
```

## Temple Status Pill Component

A beautiful, ready-to-use UI component that displays temple status with countdown.

### Usage
```html
<app-temple-status-pill></app-temple-status-pill>
```

### Features
- 🟢 Green indicator when open
- 🔴 Red indicator when closed
- ⏱️ Live countdown to next event
- 📱 Responsive design (adapts to mobile)
- 🌙 Dark mode support
- ✨ Smooth animations and hover effects

### Visual Examples
**When Open:**
```
┌────────────────────────────────────────────────────┐
│  🟢 OPEN  │  Next: Evening Aarti in 12:35:42      │
└────────────────────────────────────────────────────┘
```

**When Closed:**
```
┌────────────────────────────────────────────────────┐
│  🔴 CLOSED  │  Next: Temple Opens in 08:15:30     │
└────────────────────────────────────────────────────┘
```

## Integration

The service and component have been integrated into:
- ✅ `HomeComponent` - Displays at top of main page
- ✅ `WishFlowComponent` - Shows status during wish creation
- ✅ `AppModule` - Registered globally

## Dependencies

### Required Packages
```json
{
  "date-fns": "^3.0.0"  // For date manipulation
}
```

### RxJS Operators Used
- `interval(1000)` - Updates every second
- `BehaviorSubject` - Maintains current state
- `map` - Transforms observables
- `distinctUntilChanged` - Prevents duplicate emissions

## Technical Details

### Performance
- ⚡ Efficient: Uses single `interval(1000)` subscription
- 🎯 Optimized: `distinctUntilChanged` prevents unnecessary updates
- 📦 Lightweight: ~5KB gzipped

### Time Calculations
The service uses `date-fns` for accurate date/time operations:
- `differenceInSeconds()` - Calculates countdown
- `setHours()`, `setMinutes()`, `setSeconds()` - Constructs event times
- `addDays()` - Handles next-day events

### Auto-Updates
The service automatically:
1. Updates status when temple opens/closes
2. Recalculates next event
3. Updates countdown every second
4. Handles day transitions (midnight rollover)

## Customization

### Modify Temple Hours
Edit `temple-schedule.service.ts`:
```typescript
private readonly schedule: TempleSchedule = {
  openHour: 5,    // Change opening hour (24-hour format)
  openMinute: 0,  // Change opening minute
  closeHour: 19,  // Change closing hour
  closeMinute: 0  // Change closing minute
};
```

### Add More Aarti Times
```typescript
private readonly aartiTimes = [
  { hour: 6, minute: 0, label: 'Morning Aarti' },
  { hour: 12, minute: 0, label: 'Noon Aarti' },
  { hour: 19, minute: 0, label: 'Evening Aarti' }
];
```

### Customize Pill Styling
Edit `temple-status-pill.component.css`:
- Change colors in `.status-indicator.open` and `.status-indicator.closed`
- Modify animations in `@keyframes pulse`
- Adjust responsive breakpoints in `@media` queries

## Testing

### Unit Tests Included
- ✅ Service creation and initialization
- ✅ Schedule retrieval
- ✅ Time formatting
- ✅ Observable emissions
- ✅ Component creation and binding

### Run Tests
```bash
ng test
```

## Future Enhancements

Potential improvements:
- [ ] Multiple temple locations with different schedules
- [ ] Special holiday hours
- [ ] Notification system for upcoming events
- [ ] Integration with calendar/reminder apps
- [ ] Multi-timezone support for international devotees

## Files Created

```
src/app/
├── services/
│   ├── temple-schedule.service.ts
│   └── temple-schedule.service.spec.ts
└── components/
    └── temple-status-pill/
        ├── temple-status-pill.component.ts
        ├── temple-status-pill.component.html
        ├── temple-status-pill.component.css
        └── temple-status-pill.component.spec.ts
```

## License
Part of the Karya Siddhi Temple PWA project.
