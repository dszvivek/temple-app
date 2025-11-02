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
import { InstallPromptComponent } from './components/install-prompt/install-prompt.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';

// Services
import { WishService } from './services/wish.service';
import { SchedulerService } from './services/scheduler.service';
import { AssetLoaderService } from './services/asset-loader.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WishFlowComponent,
    AudioPlayerComponent,
    InstallPromptComponent,
    LoadingScreenComponent,
    LanguageSwitcherComponent
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
    WishService,
    SchedulerService,
    AssetLoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
