import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DiyaService } from '../../services/diya.service';
import { LanguageService } from '../../services/language.service';
import { ToastService } from '../../services/toast.service';
import { trigger, transition, style, animate } from '@angular/animations';

/**
 * LightDiyaModalComponent - Modal for lighting a virtual diya
 * 
 * Features:
 * - Name input with validation (max 20 chars)
 * - Real-time character count
 * - Success/error feedback
 * - Accessible keyboard navigation
 * - Smooth animations
 */
@Component({
  selector: 'app-light-diya-modal',
  templateUrl: './light-diya-modal.component.html',
  styleUrls: ['./light-diya-modal.component.css'],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ]),
    trigger('backdropAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class LightDiyaModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() diyaLit = new EventEmitter<string>(); // Emits name when diya is lit

  name = '';
  maxLength = 20;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private diyaService: DiyaService,
    public lang: LanguageService,
    private toast: ToastService
  ) {}

  /**
   * Get remaining character count
   */
  get remainingChars(): number {
    return this.maxLength - this.name.length;
  }

  /**
   * Check if name is valid
   */
  get isValidName(): boolean {
    return this.name.trim().length > 0 && this.name.trim().length <= this.maxLength;
  }

  /**
   * Handle form submission
   */
  async onSubmit(): Promise<void> {
    if (!this.isValidName || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const diya = await this.diyaService.addDiya(this.name.trim());
      
      this.successMessage = `Diya lit for ${diya.name} 🪔`;
      this.toast.success(`🪔 Diya lit for ${diya.name}! May your prayers be answered`);
      this.diyaLit.emit(diya.name);
      
      // Reset form and close after short delay
      setTimeout(() => {
        this.resetForm();
        this.close();
      }, 1500);
      
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to light diya. Please try again.';
      this.toast.error('Failed to light diya. Please try again.');
      this.isSubmitting = false;
    }
  }

  /**
   * Close modal
   */
  close(): void {
    this.resetForm();
    this.closeModal.emit();
  }

  /**
   * Reset form state
   */
  private resetForm(): void {
    this.name = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = false;
  }

  /**
   * Handle backdrop click
   */
  onBackdropClick(event: MouseEvent): void {
    // Close only if clicking backdrop (not modal content)
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  /**
   * Handle Escape key
   */
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
  }
}
