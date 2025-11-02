import { Component, OnInit } from '@angular/core';
import { DevModeService, DevModeConfig } from '../../services/dev-mode.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-dev-controls',
  templateUrl: './dev-controls.component.html',
  styleUrls: ['./dev-controls.component.css']
})
export class DevControlsComponent implements OnInit {
  config!: DevModeConfig;
  isVisible = false;

  constructor(
    public devMode: DevModeService,
    public lang: LanguageService
  ) {}

  ngOnInit(): void {
    this.devMode.config$.subscribe(config => {
      this.config = config;
      this.isVisible = config.enabled;
    });
  }

  toggleOverrideTemple(): void {
    this.devMode.updateConfig({
      overrideTempleOpen: !this.config.overrideTempleOpen
    });
  }

  toggleForceTempleOpen(): void {
    this.devMode.updateConfig({
      forceTempleOpen: !this.config.forceTempleOpen
    });
  }

  toggleDebugInfo(): void {
    this.devMode.updateConfig({
      showDebugInfo: !this.config.showDebugInfo
    });
  }

  toggleOverrideHourlyChalisa(): void {
    this.devMode.updateConfig({
      overrideHourlyChalisa: !this.config.overrideHourlyChalisa
    });
  }

  toggleForceChalisaPlay(): void {
    this.devMode.updateConfig({
      forceChalisaPlay: !this.config.forceChalisaPlay
    });
  }

  triggerScheduledChants(): void {
    this.devMode.updateConfig({
      triggerScheduledChants: true
    });
    console.log('🔔 Triggered all scheduled chants!');
  }

  closePanel(): void {
    this.devMode.disableDevMode();
  }
}
