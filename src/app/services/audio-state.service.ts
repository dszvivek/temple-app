import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioStateService {
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  public isPlaying$ = this.isPlayingSubject.asObservable();

  setPlayingState(isPlaying: boolean): void {
    this.isPlayingSubject.next(isPlaying);
  }

  getPlayingState(): boolean {
    return this.isPlayingSubject.value;
  }
}
