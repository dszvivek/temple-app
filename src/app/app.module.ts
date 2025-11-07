import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';

// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { HomeComponent } from './components/home/home.component';
import { HanumanHomeComponent } from './components/hanuman-home/hanuman-home.component';
import { GaneshHomeComponent } from './components/ganesh-home/ganesh-home.component';
import { TempleSelectorComponent } from './components/temple-selector/temple-selector.component';
import { WishFlowComponent } from './components/wish-flow/wish-flow.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { DonateComponent } from './components/donate/donate.component';
import { DevControlsComponent } from './components/dev-controls/dev-controls.component';
import { FloatingBellComponent } from './components/floating-bell/floating-bell.component';
import { FloatingFlowerComponent } from './components/floating-flower/floating-flower.component';
import { LightDiyaModalComponent } from './components/light-diya-modal/light-diya-modal.component';
import { DiyaDisplayComponent } from './components/diya-display/diya-display.component';
import { OnboardingWelcomeComponent } from './components/onboarding-welcome/onboarding-welcome.component';
import { ViralSharePromptComponent } from './components/viral-share-prompt/viral-share-prompt.component';

// Directives
import { FlowerOfferingDirective } from './directives/flower-offering.directive';
import { DiyaCounterComponent } from './components/diya-counter/diya-counter.component';
import { OfflineIndicatorComponent } from './components/offline-indicator/offline-indicator.component';
import { SacredBgComponent } from './components/sacred-bg/sacred-bg.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HanumanHomeComponent,
    GaneshHomeComponent,
    TempleSelectorComponent,
    WishFlowComponent,
    AudioPlayerComponent,
    LoadingScreenComponent,
    LanguageSwitcherComponent,
    DonateComponent,
    DevControlsComponent,
    FloatingBellComponent,
    FloatingFlowerComponent,
    LightDiyaModalComponent,
    DiyaDisplayComponent,
    OnboardingWelcomeComponent,
    ViralSharePromptComponent,
    FlowerOfferingDirective,
    DiyaCounterComponent,
    OfflineIndicatorComponent,
    SacredBgComponent
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
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
