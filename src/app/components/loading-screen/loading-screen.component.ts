import { Component, OnInit } from '@angular/core';
import { AssetLoaderService, LoadingProgress } from '../../services/asset-loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.css']
})
export class LoadingScreenComponent implements OnInit {
  loading$: Observable<LoadingProgress>;
  isVisible = true;

  constructor(private assetLoader: AssetLoaderService) {
    this.loading$ = this.assetLoader.loading$;
  }

  ngOnInit(): void {
    this.loadAssets();
  }

  private async loadAssets(): Promise<void> {
    await this.assetLoader.preloadAssets();
    
    // Fade out animation
    setTimeout(() => {
      this.isVisible = false;
    }, 300);
  }
}
