import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-install-prompt',
  templateUrl: './install-prompt.component.html',
  styleUrls: ['./install-prompt.component.css']
})
export class InstallPromptComponent implements OnInit {
  showInstallPrompt = false;
  deferredPrompt: any = null;

  ngOnInit(): void {
    // Check if user previously dismissed the prompt
    const dismissed = localStorage.getItem('installPromptDismissed');
    if (dismissed === 'true') {
      return; // Don't show if previously dismissed
    }

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the default install prompt
      e.preventDefault();
      
      // Save the event for later use
      this.deferredPrompt = e;
      
      // Show custom install prompt (set to false to disable completely)
      this.showInstallPrompt = false; // Changed from true to false
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      this.showInstallPrompt = false;
      this.deferredPrompt = null;
    });
  }

  /**
   * Show install prompt
   */
  async install(): Promise<void> {
    if (!this.deferredPrompt) {
      return;
    }

    // Show the install prompt
    this.deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await this.deferredPrompt.userChoice;
    
    // Clear the deferred prompt
    this.deferredPrompt = null;
    
    // Hide the install button
    this.showInstallPrompt = false;
  }

  /**
   * Dismiss the install prompt
   */
  dismissPrompt(): void {
    this.showInstallPrompt = false;
    
    // Remember user dismissed (optional - could use localStorage)
    localStorage.setItem('installPromptDismissed', 'true');
  }

  /**
   * Check if running as PWA
   */
  isRunningAsPWA(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }
}
