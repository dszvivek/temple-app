import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiyaCounterService } from '../../services/diya-counter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-diya-counter',
  templateUrl: './diya-counter.component.html',
  styleUrls: ['./diya-counter.component.css']
})
export class DiyaCounterComponent implements OnInit, OnDestroy {
  totalCount = 0;
  todayCount = 0;
  monthCount = 0;
  
  displayedTotal = 0;
  displayedToday = 0;
  displayedMonth = 0;

  private subscriptions: Subscription[] = [];

  constructor(private diyaCounterService: DiyaCounterService) {}

  ngOnInit(): void {
    // Subscribe to counter updates
    const totalSub = this.diyaCounterService.getTotalCount().subscribe(count => {
      this.totalCount = count;
      this.animateCounter('total', count);
    });

    const todaySub = this.diyaCounterService.getTodayCount().subscribe(count => {
      this.todayCount = count;
      this.animateCounter('today', count);
    });

    const monthSub = this.diyaCounterService.getMonthCount().subscribe(count => {
      this.monthCount = count;
      this.animateCounter('month', count);
    });

    this.subscriptions.push(totalSub, todaySub, monthSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Animate counter with ticker effect
   */
  private animateCounter(type: 'total' | 'today' | 'month', targetValue: number): void {
    const currentValue = type === 'total' ? this.displayedTotal : 
                        type === 'today' ? this.displayedToday : 
                        this.displayedMonth;
    
    if (currentValue === targetValue) return;

    const diff = targetValue - currentValue;
    const duration = 1000; // 1 second animation
    const steps = 30;
    const increment = diff / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newValue = Math.round(currentValue + (increment * currentStep));

      if (type === 'total') {
        this.displayedTotal = newValue;
      } else if (type === 'today') {
        this.displayedToday = newValue;
      } else {
        this.displayedMonth = newValue;
      }

      if (currentStep >= steps) {
        clearInterval(timer);
        // Ensure final value is exact
        if (type === 'total') {
          this.displayedTotal = targetValue;
        } else if (type === 'today') {
          this.displayedToday = targetValue;
        } else {
          this.displayedMonth = targetValue;
        }
      }
    }, stepDuration);
  }

  /**
   * Format large numbers with commas
   */
  formatNumber(num: number): string {
    return num.toLocaleString('en-US');
  }
}
