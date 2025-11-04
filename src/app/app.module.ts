import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { HomeComponent } from './components/home/home.component';
import { WishFlowComponent } from './components/wish-flow/wish-flow.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { DonateComponent } from './components/donate/donate.component';
import { DevControlsComponent } from './components/dev-controls/dev-controls.component';
import { FloatingBellComponent } from './components/floating-bell/floating-bell.component';
import { LightDiyaModalComponent } from './components/light-diya-modal/light-diya-modal.component';
import { DiyaDisplayComponent } from './components/diya-display/diya-display.component';
import { OnboardingWelcomeComponent } from './components/onboarding-welcome/onboarding-welcome.component';
import { ViralSharePromptComponent } from './components/viral-share-prompt/viral-share-prompt.component';

// Directives
import { FlowerOfferingDirective } from './directives/flower-offering.directive';
import { DiyaCounterComponent } from './components/diya-counter/diya-counter.component';
import { MeditationTimerComponent } from './components/meditation-timer/meditation-timer.component';
import { OfflineIndicatorComponent } from './components/offline-indicator/offline-indicator.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WishFlowComponent,
    AudioPlayerComponent,
    LoadingScreenComponent,
    LanguageSwitcherComponent,
    DonateComponent,
    DevControlsComponent,
    FloatingBellComponent,
    LightDiyaModalComponent,
    DiyaDisplayComponent,
    OnboardingWelcomeComponent,
    ViralSharePromptComponent,
    FlowerOfferingDirective,
    DiyaCounterComponent,
    MeditationTimerComponent,
    OfflineIndicatorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    // All services use providedIn: 'root', so no need to declare here
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
