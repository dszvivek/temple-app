import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language.service';
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

  constructor(public lang: LanguageService) {}

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
}
