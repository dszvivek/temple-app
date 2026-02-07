import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from '@angular/fire/app';
import { getFirestore, Firestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseInitService {
  private app?: FirebaseApp;
  private firestoreInstance?: Firestore;
  private initialized = false;

  constructor() {}

  /**
   * Initialize Firebase lazily - only when needed
   */
  initialize(): void {
    if (this.initialized) {
      return;
    }

    this.app = initializeApp(environment.firebase);
    this.firestoreInstance = getFirestore(this.app);
    this.initialized = true;
  }

  /**
   * Get Firestore instance (initializes Firebase if needed)
   */
  getFirestore(): Firestore {
    if (!this.initialized) {
      this.initialize();
    }
    return this.firestoreInstance!;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}
