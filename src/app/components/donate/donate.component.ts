import { Component, OnInit } from '@angular/core';
import * as QRCode from 'qrcode';
import { LanguageService } from '../../services/language.service';
import { FirebaseBackendService } from '../../services/firebase-backend.service';
import { ToastService } from '../../services/toast.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit {
  upiId = environment.upiVpa;
  upiUrl = '';
  qrCodeUrl = '';
  totalDonations$ = this.firebaseBackend.getTotalDonations();
  
  showDonationInput = false;
  donationAmount = 0;
  donationPurpose = 'General';

  constructor(
    public lang: LanguageService,
    private firebaseBackend: FirebaseBackendService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.upiUrl = `upi://pay?pa=${this.upiId}&pn=Temple%20App&cu=INR`;
    QRCode.toDataURL(this.upiUrl, { width: 300, margin: 2 })
      .then(url => { this.qrCodeUrl = url; })
      .catch(() => { this.qrCodeUrl = ''; });
  }

  copyUpiId(): void {
    navigator.clipboard.writeText(this.upiId).then(() => {
      this.toastService.success(this.lang.t('donate.copySuccess'));
    });
  }

  /**
   * Show donation tracking input (optional transparency feature)
   */
  toggleDonationInput(): void {
    this.showDonationInput = !this.showDonationInput;
  }

  /**
   * Log donation for transparency (after user completes payment)
   */
  async logDonation(): Promise<void> {
    if (this.donationAmount <= 0) {
      this.toastService.warning(this.lang.t('donate.invalidAmount'));
      return;
    }

    try {
      await this.firebaseBackend.logDonation(this.donationAmount, this.donationPurpose);
      this.toastService.success(this.lang.t('donate.loggedSuccess'));
      this.donationAmount = 0;
      this.showDonationInput = false;
    } catch (error) {
      console.error('Error logging donation:', error);
    }
  }
}
