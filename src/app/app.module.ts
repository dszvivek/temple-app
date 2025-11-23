import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// Firebase imports - kept for AngularFire compatibility
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

// Components (only eagerly loaded ones that aren't in SharedModule)
import { HomeComponent } from './components/home/home.component';
import { TempleSelectorComponent } from './components/temple-selector/temple-selector.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { FloatingBellComponent } from './components/floating-bell/floating-bell.component';
import { FloatingFlowerComponent } from './components/floating-flower/floating-flower.component';
import { FloatingShankhComponent } from './components/floating-shankh/floating-shankh.component';
import { FloatingIncenseComponent } from './components/floating-incense/floating-incense.component';
import { ViralSharePromptComponent } from './components/viral-share-prompt/viral-share-prompt.component';
import { OfflineIndicatorComponent } from './components/offline-indicator/offline-indicator.component';
import { ToastComponent } from './components/toast/toast.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    // Removed components now in SharedModule or lazy-loaded
    TempleSelectorComponent,
    LoadingScreenComponent,
    LanguageSwitcherComponent,
    FloatingBellComponent,
    FloatingFlowerComponent,
    FloatingShankhComponent,
    FloatingIncenseComponent,
    ViralSharePromptComponent,
    OfflineIndicatorComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    // Firebase providers are required for AngularFire services
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
