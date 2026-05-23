import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DigitalPrasadService, DigitalPrasad } from '../../services/digital-prasad.service';
import { SmartShareService } from '../../services/smart-share.service';
import { LanguageService } from '../../services/language.service';

/**
 * PrasadCollectionComponent - View collected divine prasad
 * 
 * Shows the user's prasad collection with:
 * - Collection progress bar (X/15 unique items)
 * - Grouped by rarity (Common, Uncommon, Rare, Divine)
 * - Each prasad item with emoji, name, date, and share button
 * - Empty state encouraging users to perform aarti
 * - Expandable/collapsible section
 */
@Component({
  selector: 'app-prasad-collection',
  template: `
    <div class="prasad-section" *ngIf="collection.length > 0 || showEmpty">
      <!-- Header (always visible, toggles expansion) -->
      <div class="prasad-header" (click)="toggleExpanded()">
        <div class="header-left">
          <span class="header-icon">📿</span>
          <h3 class="header-title">
            {{ lang.t('prasadCollection.title') }}
          </h3>
        </div>
        <div class="header-right">
          <span class="collection-count">
            {{ uniqueCount }}/{{ totalPossible }}
          </span>
          <span class="expand-arrow" [class.rotated]="expanded">▼</span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="collection-progress">
        <div class="progress-track">
          <div class="progress-fill" [style.width.%]="collectionPercent"></div>
        </div>
        <span class="progress-label">
          {{ getProgressLabel() }}
        </span>
      </div>

      <!-- Expanded Collection -->
      <div class="prasad-grid" *ngIf="expanded">
        <!-- Rarity sections -->
        <div class="rarity-section" *ngIf="divineItems.length > 0">
          <div class="rarity-label divine-label">
            ✨ {{ getRarityText('divine') }} ({{ divineItems.length }})
          </div>
          <div class="items-row">
            <div class="prasad-item divine" *ngFor="let p of divineItems; trackBy: trackPrasad" 
                 (click)="selectPrasad(p); $event.stopPropagation()">
              <span class="item-emoji">{{ p.emoji }}</span>
              <span class="item-name">{{ getPrasadName(p) }}</span>
              <span class="item-deity">{{ p.fromDeity }}</span>
            </div>
          </div>
        </div>

        <div class="rarity-section" *ngIf="rareItems.length > 0">
          <div class="rarity-label rare-label">
            💎 {{ getRarityText('rare') }} ({{ rareItems.length }})
          </div>
          <div class="items-row">
            <div class="prasad-item rare" *ngFor="let p of rareItems; trackBy: trackPrasad"
                 (click)="selectPrasad(p); $event.stopPropagation()">
              <span class="item-emoji">{{ p.emoji }}</span>
              <span class="item-name">{{ getPrasadName(p) }}</span>
              <span class="item-deity">{{ p.fromDeity }}</span>
            </div>
          </div>
        </div>

        <div class="rarity-section" *ngIf="uncommonItems.length > 0">
          <div class="rarity-label uncommon-label">
            🌟 {{ getRarityText('uncommon') }} ({{ uncommonItems.length }})
          </div>
          <div class="items-row">
            <div class="prasad-item uncommon" *ngFor="let p of uncommonItems; trackBy: trackPrasad"
                 (click)="selectPrasad(p); $event.stopPropagation()">
              <span class="item-emoji">{{ p.emoji }}</span>
              <span class="item-name">{{ getPrasadName(p) }}</span>
              <span class="item-deity">{{ p.fromDeity }}</span>
            </div>
          </div>
        </div>

        <div class="rarity-section" *ngIf="commonItems.length > 0">
          <div class="rarity-label common-label">
            🙏 {{ getRarityText('common') }} ({{ commonItems.length }})
          </div>
          <div class="items-row">
            <div class="prasad-item common" *ngFor="let p of commonItems; trackBy: trackPrasad"
                 (click)="selectPrasad(p); $event.stopPropagation()">
              <span class="item-emoji">{{ p.emoji }}</span>
              <span class="item-name">{{ getPrasadName(p) }}</span>
              <span class="item-deity">{{ p.fromDeity }}</span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="collection.length === 0">
          <span class="empty-icon">🪔</span>
          <p class="empty-text">
            {{ lang.t('prasadCollection.emptyMessage') }}
          </p>
        </div>
      </div>

      <!-- Selected Prasad Detail Modal -->
      <div class="prasad-modal-overlay" *ngIf="selectedPrasad" (click)="selectedPrasad = null">
        <div class="prasad-modal" [class]="'prasad-modal ' + selectedPrasad.rarity" (click)="$event.stopPropagation()">
          <button class="modal-close" (click)="selectedPrasad = null">✕</button>
          <div class="modal-emoji">{{ selectedPrasad.emoji }}</div>
          <div class="modal-rarity" [class]="selectedPrasad.rarity + '-badge'">
            {{ getRarityLabel(selectedPrasad.rarity) }}
          </div>
          <h4 class="modal-name">{{ getPrasadName(selectedPrasad) }}</h4>
          <p class="modal-desc">{{ getPrasadDescription(selectedPrasad) }}</p>
          <p class="modal-from">
            {{ lang.t('prasadCollection.fromLabel') }} {{ selectedPrasad.fromDeity }}
          </p>
          <p class="modal-date">
            {{ formatDate(selectedPrasad.receivedDate) }}
          </p>
          <button class="modal-share-btn" (click)="sharePrasad(selectedPrasad)">
            {{ lang.t('prasadCollection.shareWhatsApp') }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .prasad-section {
      margin: 12px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 248, 225, 0.88));
      backdrop-filter: blur(12px);
      border-radius: 16px;
      padding: 14px;
      border: 1px solid rgba(249, 115, 22, 0.15);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    }

    .prasad-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-icon { font-size: 1.3rem; }

    .header-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #92400e;
      margin: 0;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .collection-count {
      font-size: 0.8rem;
      font-weight: 700;
      color: #d97706;
      background: rgba(251, 191, 36, 0.2);
      padding: 2px 10px;
      border-radius: 12px;
    }

    .expand-arrow {
      font-size: 0.65rem;
      color: #92400e;
      transition: transform 0.3s ease;
      opacity: 0.6;
    }

    .expand-arrow.rotated { transform: rotate(180deg); }

    /* Progress */
    .collection-progress {
      margin-top: 10px;
    }

    .progress-track {
      height: 6px;
      background: rgba(249, 115, 22, 0.12);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #f59e0b, #10b981);
      border-radius: 3px;
      transition: width 0.6s ease;
    }

    .progress-label {
      display: block;
      text-align: center;
      font-size: 0.6rem;
      color: #92400e;
      margin-top: 4px;
    }

    /* Grid */
    .prasad-grid {
      margin-top: 14px;
    }

    .rarity-section {
      margin-bottom: 12px;
    }

    .rarity-label {
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      padding: 2px 8px;
      border-radius: 8px;
      display: inline-block;
    }

    .divine-label {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      color: #92400e;
    }

    .rare-label {
      background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
      color: #3730a3;
    }

    .uncommon-label {
      background: linear-gradient(135deg, #d1fae5, #a7f3d0);
      color: #065f46;
    }

    .common-label {
      background: rgba(0, 0, 0, 0.05);
      color: #6b7280;
    }

    .items-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .prasad-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 8px;
      border-radius: 12px;
      min-width: 70px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      border: 1px solid transparent;
    }

    .prasad-item:active {
      transform: scale(0.95);
    }

    .prasad-item.divine {
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.15));
      border-color: rgba(251, 191, 36, 0.3);
      animation: divineGlow 2s ease-in-out infinite;
    }

    @keyframes divineGlow {
      0%, 100% { box-shadow: 0 0 8px rgba(251, 191, 36, 0.2); }
      50% { box-shadow: 0 0 16px rgba(251, 191, 36, 0.4); }
    }

    .prasad-item.rare {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(129, 140, 248, 0.1));
      border-color: rgba(99, 102, 241, 0.2);
    }

    .prasad-item.uncommon {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(52, 211, 153, 0.08));
      border-color: rgba(16, 185, 129, 0.15);
    }

    .prasad-item.common {
      background: rgba(0, 0, 0, 0.03);
    }

    .item-emoji { font-size: 1.5rem; }

    .item-name {
      font-size: 0.6rem;
      font-weight: 600;
      color: #78350f;
      text-align: center;
      line-height: 1.2;
      max-width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-deity {
      font-size: 0.5rem;
      color: #9a3412;
      opacity: 0.6;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 20px;
    }

    .empty-icon { font-size: 2rem; }

    .empty-text {
      font-size: 0.8rem;
      color: #92400e;
      margin-top: 8px;
    }

    /* Modal */
    .prasad-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .prasad-modal {
      background: white;
      border-radius: 20px;
      padding: 24px;
      max-width: 300px;
      width: 90%;
      text-align: center;
      animation: scaleIn 0.3s ease;
      position: relative;
    }

    @keyframes scaleIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .prasad-modal.divine {
      border: 2px solid #fbbf24;
      box-shadow: 0 0 30px rgba(251, 191, 36, 0.3);
    }

    .prasad-modal.rare {
      border: 2px solid #818cf8;
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
    }

    .prasad-modal.uncommon {
      border: 2px solid #34d399;
    }

    .prasad-modal.common {
      border: 1px solid #e5e7eb;
    }

    .modal-close {
      position: absolute;
      top: 10px;
      right: 14px;
      background: none;
      border: none;
      font-size: 1.2rem;
      color: #9ca3af;
      cursor: pointer;
    }

    .modal-emoji {
      font-size: 3rem;
      margin-bottom: 8px;
    }

    .modal-rarity {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 1px;
      padding: 3px 12px;
      border-radius: 10px;
      display: inline-block;
      margin-bottom: 8px;
    }

    .divine-badge {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      color: #92400e;
    }

    .rare-badge {
      background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
      color: #3730a3;
    }

    .uncommon-badge {
      background: linear-gradient(135deg, #d1fae5, #a7f3d0);
      color: #065f46;
    }

    .common-badge {
      background: rgba(0, 0, 0, 0.05);
      color: #6b7280;
    }

    .modal-name {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1f2937;
      margin: 4px 0;
    }

    .modal-desc {
      font-size: 0.78rem;
      color: #6b7280;
      margin: 8px 0;
      line-height: 1.5;
    }

    .modal-from {
      font-size: 0.7rem;
      color: #9a3412;
      margin: 4px 0;
    }

    .modal-date {
      font-size: 0.65rem;
      color: #9ca3af;
      margin: 2px 0 12px;
    }

    .modal-share-btn {
      background: linear-gradient(135deg, #25d366, #128c7e);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 10px 20px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
      width: 100%;
    }

    .modal-share-btn:active {
      transform: scale(0.97);
    }
  `]
})
export class PrasadCollectionComponent implements OnInit, OnDestroy {
  collection: DigitalPrasad[] = [];
  divineItems: DigitalPrasad[] = [];
  rareItems: DigitalPrasad[] = [];
  uncommonItems: DigitalPrasad[] = [];
  commonItems: DigitalPrasad[] = [];
  
  uniqueCount = 0;
  totalPossible = 0;
  collectionPercent = 0;
  
  expanded = false;
  showEmpty = false;
  selectedPrasad: DigitalPrasad | null = null;
  
  private sub?: Subscription;

  get isHindi(): boolean {
    return this.lang.getCurrentLanguage() === 'hi';
  }

  constructor(
    private prasadService: DigitalPrasadService,
    private shareService: SmartShareService,
    public lang: LanguageService
  ) {}

  ngOnInit(): void {
    this.totalPossible = this.prasadService.getTotalPossible();
    
    this.sub = this.prasadService.collection$.subscribe(collection => {
      this.collection = collection;
      this.uniqueCount = this.prasadService.getUniqueCount();
      this.collectionPercent = this.totalPossible > 0 
        ? Math.round((this.uniqueCount / this.totalPossible) * 100) : 0;
      
      // Group by rarity (show most recent first within each group)
      const reversed = [...collection].reverse();
      this.divineItems = reversed.filter(p => p.rarity === 'divine');
      this.rareItems = reversed.filter(p => p.rarity === 'rare');
      this.uncommonItems = reversed.filter(p => p.rarity === 'uncommon');
      this.commonItems = reversed.filter(p => p.rarity === 'common');
    });

    // Show empty state after a brief delay if no prasad
    setTimeout(() => {
      if (this.collection.length === 0) {
        this.showEmpty = true;
      }
    }, 2000);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleExpanded(): void {
    this.expanded = !this.expanded;
  }

  selectPrasad(prasad: DigitalPrasad): void {
    this.selectedPrasad = prasad;
  }

  trackPrasad(index: number, prasad: DigitalPrasad): string {
    return prasad.id;
  }

  getProgressLabel(): string {
    return this.lang.format('prasadCollection.progressLabel', {
      count: this.uniqueCount,
      total: this.totalPossible
    });
  }

  getPrasadName(prasad: DigitalPrasad): string {
    return this.isHindi ? prasad.nameHi : prasad.name;
  }

  getPrasadDescription(prasad: DigitalPrasad): string {
    return this.isHindi ? prasad.descriptionHi : prasad.description;
  }

  getRarityText(rarity: string): string {
    switch (rarity) {
      case 'divine':
        return this.lang.t('prasadCollection.rarityDivine');
      case 'rare':
        return this.lang.t('prasadCollection.rarityRare');
      case 'uncommon':
        return this.lang.t('prasadCollection.rarityUncommon');
      default:
        return this.lang.t('prasadCollection.rarityCommon');
    }
  }

  getRarityLabel(rarity: string): string {
    switch (rarity) {
      case 'divine': return `✨ ${this.lang.t('prasadCollection.rarityDivine')}`;
      case 'rare': return `💎 ${this.lang.t('prasadCollection.rarityRare')}`;
      case 'uncommon': return `🌟 ${this.lang.t('prasadCollection.rarityUncommon')}`;
      default: return `🙏 ${this.lang.t('prasadCollection.rarityCommon')}`;
    }
  }

  formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(this.isHindi ? 'hi-IN' : 'en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
    } catch {
      return '';
    }
  }

  sharePrasad(prasad: DigitalPrasad): void {
    const message = this.isHindi ? prasad.shareMessageHi : prasad.shareMessage;
    this.shareService.shareOnWhatsApp(message);
    this.selectedPrasad = null;
  }
}
