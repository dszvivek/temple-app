import { Injectable } from '@angular/core';

export type ProductEventName =
  | 'app_load'
  | 'page_view'
  | 'temple_selected'
  | 'daily_darshan_started'
  | 'daily_challenge_started'
  | 'daily_challenge_completed'
  | 'daily_loop_completed'
  | 'ritual_action'
  | 'diya_lit'
  | 'audio_started'
  | 'wish_started'
  | 'wish_created'
  | 'wish_submitted'
  | 'share_sent'
  | 'install_prompt_shown'
  | 'install_prompt_result'
  | 'notification_prompt_shown'
  | 'notification_opt_in'
  | 'runtime_error';

export interface ProductAnalyticsEvent {
  name: ProductEventName;
  timestamp: string;
  sessionId: string;
  path: string;
  source?: string;
  properties: Record<string, string | number | boolean | null | undefined>;
}

@Injectable({
  providedIn: 'root'
})
export class ProductAnalyticsService {
  private readonly STORAGE_KEY = 'manokamna_product_events';
  private readonly REFERRAL_KEY = 'manokamna_referral_source';
  private readonly SESSION_KEY = 'manokamna_session_id';
  private readonly MAX_LOCAL_EVENTS = 150;

  captureReferral(): void {
    try {
      const params = new URLSearchParams(window.location.search);
      const source = params.get('ref') || params.get('utm_source');
      if (source) {
        localStorage.setItem(this.REFERRAL_KEY, source.slice(0, 80));
      }
    } catch {
      // Ignore unavailable storage or malformed URLs.
    }
  }

  track(name: ProductEventName, properties: Record<string, string | number | boolean | null | undefined> = {}): void {
    const event: ProductAnalyticsEvent = {
      name,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      path: this.getPath(),
      source: this.getReferralSource(),
      properties
    };

    this.persistLocally(event);
    this.pushToProvider(event);
  }

  trackError(error: unknown, context: string): void {
    this.track('runtime_error', {
      context,
      message: this.getErrorMessage(error)
    });
  }

  getStoredEvents(): ProductAnalyticsEvent[] {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]') as ProductAnalyticsEvent[];
    } catch {
      return [];
    }
  }

  private getSessionId(): string {
    try {
      const existing = sessionStorage.getItem(this.SESSION_KEY);
      if (existing) {
        return existing;
      }

      const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(this.SESSION_KEY, sessionId);
      return sessionId;
    } catch {
      return 'session-unavailable';
    }
  }

  private getReferralSource(): string | undefined {
    try {
      return localStorage.getItem(this.REFERRAL_KEY) || undefined;
    } catch {
      return undefined;
    }
  }

  private getPath(): string {
    try {
      return `${window.location.pathname}${window.location.search}`;
    } catch {
      return '';
    }
  }

  private persistLocally(event: ProductAnalyticsEvent): void {
    try {
      const events = this.getStoredEvents();
      events.push(event);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events.slice(-this.MAX_LOCAL_EVENTS)));
    } catch {
      // Analytics should never break the devotional experience.
    }
  }

  private pushToProvider(event: ProductAnalyticsEvent): void {
    try {
      const win = window as unknown as {
        dataLayer?: unknown[];
        gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
      };

      win.dataLayer?.push({
        event: event.name,
        session_id: event.sessionId,
        source: event.source,
        path: event.path,
        ...event.properties
      });

      win.gtag?.('event', event.name, {
        session_id: event.sessionId,
        source: event.source,
        path: event.path,
        ...event.properties
      });
    } catch {
      // Provider failures should not affect the app.
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message.slice(0, 300);
    }
    return String(error).slice(0, 300);
  }
}
