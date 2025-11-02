import { TestBed } from '@angular/core/testing';
import { AmbientAudioService } from './ambient-audio.service';

describe('AmbientAudioService', () => {
  let service: AmbientAudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmbientAudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have isTempleOpen$ observable', (done) => {
    service.isTempleOpen$.subscribe(isOpen => {
      expect(typeof isOpen).toBe('boolean');
      done();
    });
  });

  it('should have isMuted$ observable', (done) => {
    service.isMuted$.subscribe(isMuted => {
      expect(typeof isMuted).toBe('boolean');
      done();
    });
  });

  it('should toggle mute state', () => {
    const initialState = service.isMuted();
    service.toggleMute();
    expect(service.isMuted()).toBe(!initialState);
  });
});
