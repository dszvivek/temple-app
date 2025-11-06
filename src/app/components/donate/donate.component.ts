import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { FirebaseBackendService } from '../../services/firebase-backend.service';
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
    private firebaseBackend: FirebaseBackendService
  ) {}

  ngOnInit(): void {
    // Generate UPI payment URL
    this.upiUrl = `upi://pay?pa=${this.upiId}&pn=Temple%20App&cu=INR`;
    
    // Generate QR code URL using a public QR code API
    const encodedUpiUrl = encodeURIComponent(this.upiUrl);
    this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUpiUrl}`;
  }

  copyUpiId(): void {
    navigator.clipboard.writeText(this.upiId).then(() => {
      alert(this.lang.getCurrentLanguage() === 'hi' ? 'UPI ID कॉपी हो गया!' : 'UPI ID copied!');
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
      alert('Please enter a valid donation amount');
      return;
    }

    try {
      await this.firebaseBackend.logDonation(this.donationAmount, this.donationPurpose);
      alert(
        this.lang.getCurrentLanguage() === 'hi'
          ? 'धन्यवाद! आपका दान दर्ज किया गया। 🙏'
          : 'Thank you! Your donation has been recorded. 🙏'
      );
      this.donationAmount = 0;
      this.showDonationInput = false;
    } catch (error) {
      console.error('Error logging donation:', error);
    }
  }
}
