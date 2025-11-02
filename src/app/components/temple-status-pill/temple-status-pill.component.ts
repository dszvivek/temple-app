import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TempleScheduleService } from '../../services/temple-schedule.service';

@Component({
  selector: 'app-temple-status-pill',
  templateUrl: './temple-status-pill.component.html',
  styleUrls: ['./temple-status-pill.component.css']
})
export class TempleStatusPillComponent implements OnInit {
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
