import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TempleStatusPillComponent } from './temple-status-pill.component';
import { TempleScheduleService } from '../../services/temple-schedule.service';

describe('TempleStatusPillComponent', () => {
  let component: TempleStatusPillComponent;
  let fixture: ComponentFixture<TempleStatusPillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TempleStatusPillComponent ],
      providers: [ TempleScheduleService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TempleStatusPillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize observables from service', () => {
    expect(component.isOpen$).toBeDefined();
    expect(component.nextEventLabel$).toBeDefined();
    expect(component.countdown$).toBeDefined();
  });
});
