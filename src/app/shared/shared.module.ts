import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Shared Components
import { AudioPlayerComponent } from '../components/audio-player/audio-player.component';
import { DiyaCounterComponent } from '../components/diya-counter/diya-counter.component';
import { DiyaDisplayComponent } from '../components/diya-display/diya-display.component';
import { LightDiyaModalComponent } from '../components/light-diya-modal/light-diya-modal.component';
import { OnboardingWelcomeComponent } from '../components/onboarding-welcome/onboarding-welcome.component';
import { SacredBgComponent } from '../components/sacred-bg/sacred-bg.component';
import { FlowerOfferingDirective } from '../directives/flower-offering.directive';

/**
 * SharedModule - Contains components and directives used across multiple feature modules
 */
@NgModule({
  declarations: [
    AudioPlayerComponent,
    DiyaCounterComponent,
    DiyaDisplayComponent,
    LightDiyaModalComponent,
    OnboardingWelcomeComponent,
    SacredBgComponent,
    FlowerOfferingDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AudioPlayerComponent,
    DiyaCounterComponent,
    DiyaDisplayComponent,
    LightDiyaModalComponent,
    OnboardingWelcomeComponent,
    SacredBgComponent,
    FlowerOfferingDirective
  ]
})
export class SharedModule { }
