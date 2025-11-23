import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  constructor() { }

  /**
   * Show a success toast notification
   */
  success(message: string, duration: number = 3000): void {
    this.show('success', message, duration);
  }

  /**
   * Show an error toast notification
   */
  error(message: string, duration: number = 4000): void {
    this.show('error', message, duration);
  }

  /**
   * Show an info toast notification
   */
  info(message: string, duration: number = 3000): void {
    this.show('info', message, duration);
  }

  /**
   * Show a warning toast notification
   */
  warning(message: string, duration: number = 3500): void {
    this.show('warning', message, duration);
  }

  /**
   * Generic show method for all toast types
   */
  private show(type: Toast['type'], message: string, duration: number): void {
    const id = this.generateId();
    const toast: Toast = { id, type, message, duration };
    
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }

  /**
   * Dismiss a specific toast
   */
  dismiss(id: string): void {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(toast => toast.id !== id));
  }

  /**
   * Clear all toasts
   */
  clearAll(): void {
    this.toastsSubject.next([]);
  }

  /**
   * Generate unique ID for toast
   */
  private generateId(): string {
    return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
