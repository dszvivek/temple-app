import { TestBed } from '@angular/core/testing';
import { TempleScheduleService } from './temple-schedule.service';

describe('TempleScheduleService', () => {
  let service: TempleScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TempleScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should provide temple schedule', () => {
    const schedule = service.getSchedule();
    expect(schedule.openHour).toBe(5);
    expect(schedule.closeHour).toBe(19);
  });

  it('should format opening time correctly', () => {
    expect(service.getOpeningTime()).toBe('05:00');
  });

  it('should format closing time correctly', () => {
    expect(service.getClosingTime()).toBe('19:00');
  });

  it('should expose isOpen$ observable', (done) => {
    service.isOpen$.subscribe(isOpen => {
      expect(typeof isOpen).toBe('boolean');
      done();
    });
  });

  it('should expose nextEventLabel$ observable', (done) => {
    service.nextEventLabel$.subscribe(label => {
      expect(typeof label).toBe('string');
      done();
    });
  });

  it('should expose countdown$ observable', (done) => {
    service.countdown$.subscribe(countdown => {
      expect(countdown).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      done();
    });
  });
});
