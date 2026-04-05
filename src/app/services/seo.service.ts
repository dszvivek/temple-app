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

  // IDs of static LD+JSON scripts in index.html that must never be removed
  private readonly STATIC_LD_IDS = ['ld-organization', 'ld-webapp', 'ld-breadcrumb'];

  private readonly pageSEOData: Record<string, PageSEO> = {
    '/': {
      title: 'Manokamna - Virtual Hindu Temple | Online Darshan & Prayers',
      description: 'Experience divine blessings online at Manokamna. Choose from Hanuman, Ganesh, Shiva, Krishna or Durga Temple. Light diyas, perform aarti, make wishes. Free 24/7 darshan. मनोकामना पूरी हो।',
      keywords: 'virtual temple, online darshan, virtual mandir, hindu temple, hanuman, ganesh, shiva, krishna, durga, spiritual, devotional app, online puja, e darshan',
      ogImage: '/assets/images/og-image.png'
    },
    '/hanuman': {
      title: 'Virtual Hanuman Temple | Manokamna - Online Hanuman Darshan',
      description: 'Visit the Virtual Hanuman Temple at Manokamna. Listen to Hanuman Chalisa, light diyas, perform aarti, and receive Bajrangbali blessings online 24/7. Jai Hanuman! 🙏',
      keywords: 'hanuman temple, hanuman chalisa, bajrangbali, hanuman darshan, virtual hanuman mandir, jai hanuman, online hanuman pooja, hanuman aarti',
      ogImage: '/assets/images/og-image.png'
    },
    '/hanuman/wish': {
      title: 'Make a Wish to Hanuman Ji | Manokamna Virtual Temple',
      description: 'Submit your prayers and wishes to Hanuman Ji online. Experience the divine grace of Bajrangbali. Light a diya and make your wish at Manokamna virtual temple.',
      keywords: 'hanuman wish, pray to hanuman, hanuman prayers, mannat hanuman, wish to god, bajrangbali mannat',
      ogImage: '/assets/images/og-image.png'
    },
    '/ganesh': {
      title: 'Virtual Ganesh Temple | Manokamna - Online Ganpati Darshan',
      description: 'Visit the Virtual Ganesh Temple at Manokamna. Perform Ganesh aarti, light diyas, and receive Vighnaharta blessings online. Ganpati Bappa Morya! 🐘',
      keywords: 'ganesh temple, ganpati, ganesha, vighnaharta, ganesh darshan, virtual ganesh mandir, ganpati bappa, online ganesh pooja',
      ogImage: '/assets/images/og-image.png'
    },
    '/ganesh/wish': {
      title: 'Make a Wish to Ganesh Ji | Manokamna Virtual Temple',
      description: 'Submit your prayers and wishes to Lord Ganesha online. Seek blessings from Vighnaharta for success and obstacle removal at Manokamna virtual temple.',
      keywords: 'ganesh wish, pray to ganesha, ganpati prayers, mannat ganesh, vighnaharta blessings, success prayers',
      ogImage: '/assets/images/og-image.png'
    },
    '/shiva': {
      title: 'Virtual Shiva Temple | Manokamna - Online Mahadev Darshan',
      description: 'Visit the Virtual Shiva Temple at Manokamna. Perform Shiva aarti (Om Jai Shiv Omkara), light diyas, and receive Mahadev blessings online. Om Namah Shivaya! 🔱',
      keywords: 'shiva temple, mahadev, shiv mandir, om namah shivaya, shiva darshan, virtual shiva temple, mahadev online, shiv aarti',
      ogImage: '/assets/images/og-image.png'
    },
    '/shiva/wish': {
      title: 'Make a Wish to Lord Shiva | Manokamna Virtual Temple',
      description: 'Submit your prayers and wishes to Lord Shiva online. Seek Mahadev blessings for peace, health, and spiritual growth at Manokamna virtual temple.',
      keywords: 'shiva wish, pray to shiva, mahadev prayers, om namah shivaya mannat, shiva blessings, mahadev mannat',
      ogImage: '/assets/images/og-image.png'
    },
    '/krishna': {
      title: 'Virtual Krishna Temple | Manokamna - Online Krishna Darshan',
      description: 'Visit the Virtual Krishna Temple at Manokamna. Listen to Krishna aarti (Aarti Kunj Bihari Ki), light diyas, and receive Govind blessings online. Hare Krishna! 🦚',
      keywords: 'krishna temple, hare krishna, govind, krishna darshan, virtual krishna mandir, radhe krishna, krishna bhajan, online krishna pooja',
      ogImage: '/assets/images/og-image.png'
    },
    '/krishna/wish': {
      title: 'Make a Wish to Lord Krishna | Manokamna Virtual Temple',
      description: 'Submit your prayers and wishes to Lord Krishna online. Seek divine blessings from Govind for joy, love, and wisdom at Manokamna virtual temple.',
      keywords: 'krishna wish, pray to krishna, hare krishna prayers, govind blessings, radhe krishna mannat',
      ogImage: '/assets/images/og-image.png'
    },
    '/durga': {
      title: 'Virtual Durga Temple | Manokamna - Online Maa Durga Darshan',
      description: 'Visit the Virtual Durga Temple at Manokamna. Perform Durga aarti (Jai Ambe Gauri), light diyas, and receive Maa Durga blessings online. Jai Mata Di! 🦁',
      keywords: 'durga temple, maa durga, durga mandir, jai mata di, durga darshan, virtual durga temple, ambe maa, online durga pooja, navratri',
      ogImage: '/assets/images/og-image.png'
    },
    '/durga/wish': {
      title: 'Make a Wish to Maa Durga | Manokamna Virtual Temple',
      description: 'Submit your prayers and wishes to Maa Durga online. Seek divine protection and strength from Sherawali Maa at Manokamna virtual temple.',
      keywords: 'durga wish, pray to durga, jai mata di mannat, maa durga prayers, durga blessings, sherawali maa',
      ogImage: '/assets/images/og-image.png'
    },
    '/donate': {
      title: 'Support Manokamna | Donate for Temple Development',
      description: 'Support the Manokamna virtual temple. Your donations help maintain free spiritual services for devotees worldwide. Contribute to spreading divine blessings.',
      keywords: 'donate temple, support temple, temple donation, spiritual donation, dharma, manokamna donation',
      ogImage: '/assets/images/og-image.png'
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
    this.updateSEO(this.router.url);
  }

  /**
   * Listen to route changes and update meta tags
   */
  private setupRouteListener(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => {
      // Strip query string and fragment before lookup
      const path = event.urlAfterRedirects.split('?')[0].split('#')[0];
      this.updateSEO(path);
    });
  }

  /**
   * Update all SEO tags for a given route
   */
  private updateSEO(url: string): void {
    // Strip query string/fragment for lookup
    const path = url.split('?')[0].split('#')[0];
    const seoData = this.pageSEOData[path] || this.pageSEOData['/'];
    const ogImageUrl = `${this.baseUrl}${seoData.ogImage || this.defaultImage}`;

    // Update title
    this.titleService.setTitle(seoData.title);

    // Update primary meta tags
    this.metaService.updateTag({ name: 'title', content: seoData.title });
    this.metaService.updateTag({ name: 'description', content: seoData.description });
    this.metaService.updateTag({ name: 'keywords', content: seoData.keywords });

    // Update canonical URL
    this.updateCanonicalUrl(path);

    // Update Open Graph tags
    this.metaService.updateTag({ property: 'og:title', content: seoData.title });
    this.metaService.updateTag({ property: 'og:description', content: seoData.description });
    this.metaService.updateTag({ property: 'og:url', content: `${this.baseUrl}${path}` });
    this.metaService.updateTag({ property: 'og:image', content: ogImageUrl });
    this.metaService.updateTag({ property: 'og:image:type', content: 'image/png' });
    this.metaService.updateTag({ property: 'og:image:width', content: '1200' });
    this.metaService.updateTag({ property: 'og:image:height', content: '630' });

    // Update Twitter tags
    this.metaService.updateTag({ name: 'twitter:title', content: seoData.title });
    this.metaService.updateTag({ name: 'twitter:description', content: seoData.description });
    this.metaService.updateTag({ name: 'twitter:url', content: `${this.baseUrl}${path}` });
    this.metaService.updateTag({ name: 'twitter:image', content: ogImageUrl });
  }

  /**
   * Update canonical URL link element
   */
  private updateCanonicalUrl(path: string): void {
    const canonicalUrl = `${this.baseUrl}${path}`;
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
   * Set custom page title
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
   * Add page-specific structured data.
   * Only removes previously injected dynamic scripts — preserves the static
   * ld-organization, ld-webapp, and ld-breadcrumb scripts from index.html.
   */
  addStructuredData(data: object): void {
    const existing = document.querySelectorAll('script[type="application/ld+json"]');
    existing.forEach(el => {
      // Keep the static site-level schemas in index.html
      if (!this.STATIC_LD_IDS.includes(el.id)) {
        el.remove();
      }
    });

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }
}
