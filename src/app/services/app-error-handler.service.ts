import { ErrorHandler, Injectable } from '@angular/core';
import { ProductAnalyticsService } from './product-analytics.service';

@Injectable()
export class AppErrorHandlerService implements ErrorHandler {
  private fallbackRendered = false;

  constructor(private analytics: ProductAnalyticsService) {}

  handleError(error: unknown): void {
    console.error(error);
    this.analytics.trackError(error, 'app_error_handler');

    if (this.fallbackRendered) {
      return;
    }

    this.fallbackRendered = true;
    setTimeout(() => this.renderFallback(), 0);
  }

  private renderFallback(): void {
    const host = document.querySelector('app-root');
    if (!host) {
      return;
    }

    const hasVisibleContent = (host.textContent || '').trim().length > 0;
    if (hasVisibleContent) {
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.style.cssText = [
      'min-height:100vh',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'padding:24px',
      'background:#fff7ed',
      'font-family:Arial,sans-serif',
      'color:#7c2d12'
    ].join(';');

    const card = document.createElement('div');
    card.style.cssText = [
      'max-width:420px',
      'background:#fff',
      'border:1px solid #fed7aa',
      'border-radius:16px',
      'box-shadow:0 12px 36px rgba(124,45,18,.12)',
      'padding:24px',
      'text-align:center'
    ].join(';');

    const title = document.createElement('h1');
    title.textContent = 'We could not open the temple';
    title.style.cssText = 'font-size:22px;margin:0 0 12px;font-weight:700;color:#9a3412';

    const body = document.createElement('p');
    body.textContent = 'Please reload once. If the issue continues, reset local app data and try again.';
    body.style.cssText = 'font-size:14px;line-height:1.5;margin:0 0 20px;color:#7c2d12';

    const reloadButton = document.createElement('button');
    reloadButton.textContent = 'Reload';
    reloadButton.type = 'button';
    reloadButton.style.cssText = this.buttonStyles('#ea580c', '#fff');
    reloadButton.onclick = () => window.location.reload();

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset local data';
    resetButton.type = 'button';
    resetButton.style.cssText = this.buttonStyles('#ffedd5', '#9a3412');
    resetButton.onclick = () => {
      localStorage.clear();
      window.location.reload();
    };

    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:12px;justify-content:center;flex-wrap:wrap';
    actions.append(reloadButton, resetButton);

    card.append(title, body, actions);
    wrapper.append(card);
    host.replaceChildren(wrapper);
  }

  private buttonStyles(background: string, color: string): string {
    return [
      'border:0',
      'border-radius:10px',
      'padding:11px 16px',
      'font-weight:700',
      'cursor:pointer',
      `background:${background}`,
      `color:${color}`
    ].join(';');
  }
}
