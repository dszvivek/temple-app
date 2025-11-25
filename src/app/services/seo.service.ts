import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface PageSEO {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly baseUrl = 'https://manokamna.online';
  private readonly defaultImage = '/assets/images/og-image.png';
  
  // SEO data for each route
  private readonly pageSEOData: Record<string, PageSEO> = {
    '/': {
      title: 'Manokamna - Virtual Hindu Temple | Online Darshan & Prayers',
      description: 'Experience divine blessings online at Manokamna. Choose from Hanuman Temple or Ganesh Temple. Light diyas, perform aarti, make wishes. Free 24/7 darshan.',
      keywords: 'virtual temple, online darshan, hindu temple, hanuman, ganesh, spiritual, devotional'
    },
    '/hanuman': {
      title: 'Virtual Hanuman Temple | Manokamna - Online Hanuman Darshan',
      description: 'Visit the Virtual Hanuman Temple. Listen to Hanuman Chalisa, light diyas, perform aarti, and receive Bajrangbali blessings online. Jai Hanuman! 🙏',
      keywords: 'hanuman temple, hanuman chalisa, bajrangbali, hanuman darshan, virtual hanuman mandir, jai hanuman'
    },
    '/hanuman/wish': {
      title: 'Make a Wish to Hanuman Ji | Manokamna',
      description: 'Submit your prayers and wishes to Hanuman Ji. Experience the divine grace of Bajrangbali. Light a diya and make your wish at our virtual temple.',
      keywords: 'hanuman wish, pray to hanuman, hanuman prayers, mannat, wish to god'
    },
    '/ganesh': {
      title: 'Virtual Ganesh Temple | Manokamna - Online Ganpati Darshan',
      description: 'Visit the Virtual Ganesh Temple. Perform Ganesh aarti, light diyas, and receive Vighnaharta blessings online. Ganpati Bappa Morya! 🐘',
      keywords: 'ganesh temple, ganpati, ganesha, vighnaharta, ganesh darshan, virtual ganesh mandir'
    },
    '/ganesh/wish': {
      title: 'Make a Wish to Ganesh Ji | Manokamna',
      description: 'Submit your prayers and wishes to Lord Ganesha. Seek blessings from Vighnaharta for success and obstacle removal at our virtual temple.',
      keywords: 'ganesh wish, pray to ganesha, ganpati prayers, mannat, vighnaharta blessings'
    },
    '/donate': {
      title: 'Support Manokamna | Donate for Temple Development',
      description: 'Support the Manokamna virtual temple. Your donations help maintain free spiritual services for devotees worldwide. Contribute to spreading divine blessings.',
      keywords: 'donate temple, support temple, temple donation, spiritual donation, dharma'
    }
  };

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router
  ) {
    this.setupRouteListener();
  }

  /**
   * Initialize SEO service - call from AppComponent
   */
  init(): void {
    // Initial page SEO
    this.updateSEO(this.router.url);
  }

  /**
   * Listen to route changes and update meta tags
   */
  private setupRouteListener(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.updateSEO(event.urlAfterRedirects);
    });
  }

  /**
   * Update all SEO tags for a given route
   */
  private updateSEO(url: string): void {
    const seoData = this.pageSEOData[url] || this.pageSEOData['/'];
    
    // Update title
    this.titleService.setTitle(seoData.title);
    
    // Update meta tags
    this.metaService.updateTag({ name: 'description', content: seoData.description });
    this.metaService.updateTag({ name: 'keywords', content: seoData.keywords });
    
    // Update canonical URL
    this.updateCanonicalUrl(url);
    
    // Update Open Graph tags
    this.metaService.updateTag({ property: 'og:title', content: seoData.title });
    this.metaService.updateTag({ property: 'og:description', content: seoData.description });
    this.metaService.updateTag({ property: 'og:url', content: `${this.baseUrl}${url}` });
    this.metaService.updateTag({ property: 'og:image', content: `${this.baseUrl}${seoData.ogImage || this.defaultImage}` });
    
    // Update Twitter tags
    this.metaService.updateTag({ name: 'twitter:title', content: seoData.title });
    this.metaService.updateTag({ name: 'twitter:description', content: seoData.description });
    this.metaService.updateTag({ name: 'twitter:url', content: `${this.baseUrl}${url}` });
  }

  /**
   * Update canonical URL
   */
  private updateCanonicalUrl(url: string): void {
    const canonicalUrl = `${this.baseUrl}${url}`;
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    
    if (link) {
      link.setAttribute('href', canonicalUrl);
    } else {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', canonicalUrl);
      document.head.appendChild(link);
    }
  }

  /**
   * Set custom page title (for dynamic pages)
   */
  setTitle(title: string): void {
    this.titleService.setTitle(`${title} | Manokamna`);
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
  }

  /**
   * Set custom meta description
   */
  setDescription(description: string): void {
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
  }

  /**
   * Add structured data for specific pages
   */
  addStructuredData(data: object): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }
}
