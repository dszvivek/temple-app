import { TestBed } from '@angular/core/testing';
import { BlessingsService } from './blessings.service';

describe('BlessingsService', () => {
  let service: BlessingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlessingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have 24 blessings', () => {
    expect(service.getBlessingsCount()).toBe(24);
  });

  it('should return a random blessing', () => {
    const blessing = service.getRandomBlessing();
    expect(blessing).toBeDefined();
    expect(blessing.hindi).toBeDefined();
    expect(blessing.english).toBeDefined();
  });

  it('should get blessing by index', () => {
    const blessing = service.getBlessing(0);
    expect(blessing.hindi).toContain('हनुमान');
    expect(blessing.english).toContain('Hanuman');
  });

  it('should cycle through blessings', () => {
    const first = service.getNextBlessing();
    const second = service.getNextBlessing();
    expect(first).not.toEqual(second);
  });

  it('should expose current blessing observable', (done) => {
    service.currentBlessing$.subscribe(blessing => {
      expect(blessing).toBeDefined();
      expect(blessing.hindi).toBeDefined();
      done();
    });
  });

  it('should get blessing text in correct language', () => {
    const blessing = service.getBlessing(0);
    const hindiText = service.getBlessingText(blessing, 'hi');
    const englishText = service.getBlessingText(blessing, 'en');
    
    expect(hindiText).toBe(blessing.hindi);
    expect(englishText).toBe(blessing.english);
  });
});
