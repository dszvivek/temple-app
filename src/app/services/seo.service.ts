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
      keywords: 'virtual temple, online darshan, virtual mandir, online puja, e darshan India, hindu temple online, digital mandir, virtual worship, online prayer India, internet temple, hindus online, aarti online, diya online, virtual pooja, mandir app, digital puja, manokamna, e temple india',
      ogImage: '/assets/images/og-image.png'
    },
    '/hanuman': {
      title: 'Hanuman Temple Online | Virtual Hanuman Darshan - Manokamna',
      description: 'Visit the Virtual Hanuman Temple at Manokamna. Listen to Hanuman Chalisa, light diyas, perform aarti, ring the temple bell and receive Bajrangbali blessings online 24/7. Free Hanuman darshan anytime. Jai Hanuman! 🙏',
      keywords: 'hanuman temple online, hanuman darshan, virtual hanuman mandir, hanuman chalisa online, bajrangbali darshan, jai hanuman, online hanuman pooja, hanuman aarti, sankat mochan hanuman, pawanputra hanuman, anjani putra darshan, hanuman ji online, maruti nandan puja, hanuman jayanti, hanuman chalisa path online, bajrang bali mandir, hanuman ji darshan free, hanumanji blessings, hanuman temple pooja',
      ogImage: '/assets/images/og-image.png'
    },
    '/hanuman/wish': {
      title: 'Make a Wish to Hanuman Ji Online | Manokamna Virtual Temple',
      description: 'Submit your prayers and wishes to Hanuman Ji online. Experience the divine grace of Bajrangbali. Light a diya, say your manokamna and receive blessings at Manokamna virtual temple.',
      keywords: 'hanuman wish online, pray to hanuman ji, hanuman prayers, mannat hanuman, wish to bajrangbali, hanuman mannat, online wish to god, hanuman blessings pray, jai bajrangbali wish, bajrang bali mannat, hanuman blessings for success',
      ogImage: '/assets/images/og-image.png'
    },
    '/ganesh': {
      title: 'Ganesh Temple Online | Virtual Ganpati Darshan - Manokamna',
      description: 'Visit the Virtual Ganesh Temple at Manokamna. Perform Ganesh aarti, light diyas, offer modak, and receive Vighnaharta blessings online. Free Ganpati darshan 24/7. Ganpati Bappa Morya! 🐘',
      keywords: 'ganesh temple online, ganpati darshan, virtual ganesh mandir, ganesh chaturthi puja, vighnaharta darshan, ganpati bappa morya, online ganesh pooja, ganesh aarti online, vakratunda puja, ganapati bappa worya, vinayak darshan, chaturthi puja, pratham pujya ganesh, ekdant darshan, lambodar puja, ganesh ji online, ganesha blessings online, ganesh puja free, vigna vinayaka darshan, siddhivinayak online',
      ogImage: '/assets/images/og-image.png'
    },
    '/ganesh/wish': {
      title: 'Make a Wish to Ganesh Ji Online | Manokamna Virtual Temple',
      description: 'Submit your prayers and wishes to Lord Ganesha online. Seek blessings from Vighnaharta for success, prosperity and obstacle removal at Manokamna virtual temple.',
      keywords: 'ganesh wish online, pray to ganesha, ganpati prayers, mannat ganesh, vighnaharta blessings, success prayers, ganesh mannat, online wish ganesha, ganapati blessings, obstacle removal prayer',
      ogImage: '/assets/images/og-image.png'
    },
    '/shiva': {
      title: 'Shiva Temple Online | Virtual Mahadev Darshan - Manokamna',
      description: 'Visit the Virtual Shiva Temple at Manokamna. Perform Shiva aarti (Om Jai Shiv Omkara), light diyas, offer bel patra, and receive Mahadev blessings online 24/7. Om Namah Shivaya! 🔱',
      keywords: 'shiva temple online, mahadev darshan, virtual shiv mandir, om namah shivaya, shiva darshan online, bholenath darshan, shivratri puja online, shiv aarti online, mahashivratri pooja, shiv pooja free, neelkanth darshan, har har mahadev, pashupati nath online, lord shiva online, shivlinga puja, shiva blessings, mahadev ji online mandir, rudra online puja, shankar ji darshan, adi yogi darshan',
      ogImage: '/assets/images/og-image.png'
    },
    '/shiva/wish': {
      title: 'Make a Wish to Lord Shiva Online | Manokamna Virtual Temple',
      description: 'Submit your prayers and wishes to Lord Shiva online. Seek Mahadev blessings for peace, health, spiritual growth and fulfilment at Manokamna virtual temple.',
      keywords: 'shiva wish online, pray to shiva online, mahadev prayers, om namah shivaya mannat, shiva blessings pray, mahadev mannat, shiv ji mannat, bholenath wish, lord shiva prayer, har har mahadev prayer',
      ogImage: '/assets/images/og-image.png'
    },
    '/krishna': {
      title: 'Krishna Temple Online | Virtual Radhe Krishna Darshan - Manokamna',
      description: 'Visit the Virtual Krishna Temple at Manokamna. Listen to Krishna aarti (Aarti Kunj Bihari Ki), perform Govind puja, light diyas, and receive Lord Krishna blessings online 24/7. Hare Krishna! 🦚',
      keywords: 'krishna temple online, krishna darshan, virtual krishna mandir, radhe krishna darshan, hare krishna online, govind puja, krishna bhajan online, janmashtami puja, kanha ji darshan, laddu gopal puja, krishna leela, vrindavan darshan online, mathura darshan, gopala krishna, radha krishna online, shri krishna puja free, govinda aarti, devki nandan krishna, banke bihari darshan, krishna blessings',
      ogImage: '/assets/images/og-image.png'
    },
    '/krishna/wish': {
      title: 'Make a Wish to Lord Krishna Online | Manokamna Virtual Temple',
      description: 'Submit your prayers and wishes to Lord Krishna online. Seek divine blessings from Govind for joy, love, wisdom and fulfilment at Manokamna virtual temple.',
      keywords: 'krishna wish online, pray to krishna, hare krishna prayers, govind blessings, radhe krishna mannat, krishna mannat, lord krishna prayer, kanha ji mannat, vrindavan wish',
      ogImage: '/assets/images/og-image.png'
    },
    '/durga': {
      title: 'Durga Temple Online | Virtual Maa Durga Darshan - Manokamna',
      description: 'Visit the Virtual Durga Temple at Manokamna. Perform Durga aarti (Jai Ambe Gauri), light diyas, and receive Maa Durga blessings online 24/7. Free Navratri darshan every day. Jai Mata Di! 🦁',
      keywords: 'durga temple online, maa durga darshan, virtual durga mandir, jai mata di, navratri puja online, durga puja online, ambe maa darshan, sherawali mata darshan, mahakali online, devi maa darshan, kali mata puja, bhawani mata, vaishno devi darshan, navdurga darshan, maa bhagwati online, durga saptashati, chandika devi, amba mata, shakti puja free',
      ogImage: '/assets/images/og-image.png'
    },
    '/durga/wish': {
      title: 'Make a Wish to Maa Durga Online | Manokamna Virtual Temple',
      description: 'Submit your prayers and wishes to Maa Durga online. Seek divine protection, strength and blessings from Sherawali Maa at Manokamna virtual temple.',
      keywords: 'durga wish online, pray to durga, jai mata di mannat, maa durga prayers, durga blessings pray, sherawali maa mannat, navratri mannat, durga mannat, maa kali prayer, amba maa mannat',
      ogImage: '/assets/images/og-image.png'
    },
    '/donate': {
      title: 'Support Manokamna | Donate for Free Virtual Temple Development',
      description: 'Support the Manokamna virtual temple project. Your donations help maintain free spiritual services for devotees worldwide. Contribute to spreading divine blessings online.',
      keywords: 'donate temple online, support virtual temple, temple donation india, spiritual donation, dharma seva, manokamna donation, online temple donation',
      ogImage: '/assets/images/og-image.png'
    }
  };

  // ─── Per-deity rich structured data (FAQ + AudioObject + Place) ──────────────
  private readonly deityStructuredData: Record<string, object[]> = {
    '/hanuman': [
      {
        '@context': 'https://schema.org',
        '@type': 'Place',
        'name': 'Virtual Hanuman Temple - Manokamna',
        'alternateName': ['हनुमान मंदिर', 'Bajrangbali Temple Online', 'Sankat Mochan Virtual Mandir'],
        'description': 'Free online virtual Hanuman temple for darshan, Hanuman Chalisa, aarti and prayers 24/7.',
        'url': 'https://manokamna.online/hanuman',
        'sameAs': ['https://en.wikipedia.org/wiki/Hanuman'],
        'additionalProperty': [
          { '@type': 'PropertyValue', 'name': 'Deity', 'value': 'Hanuman Ji (Bajrangbali)' },
          { '@type': 'PropertyValue', 'name': 'Services', 'value': 'Online Darshan, Hanuman Chalisa, Aarti, Diya, Prayers' }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'How do I do Hanuman online darshan?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Visit manokamna.online/hanuman to perform free online Hanuman darshan 24/7. You can light a diya, perform aarti, listen to Hanuman Chalisa, ring the temple bell and make your wishes to Bajrangbali.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Can I listen to Hanuman Chalisa online for free?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes! At Manokamna virtual Hanuman temple you can listen to the full Hanuman Chalisa online for free anytime. Simply visit manokamna.online/hanuman and tap the Chalisa button.'
            }
          },
          {
            '@type': 'Question',
            'name': 'What is the best time for Hanuman aarti online?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Hanuman aarti is performed at 8:00 AM (morning), 1:00 PM (afternoon) and 7:00 PM (evening) at Manokamna virtual temple. You can also perform aarti manually at any time.'
            }
          },
          {
            '@type': 'Question',
            'name': 'How to make a wish to Hanuman Ji online?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Visit manokamna.online/hanuman/wish. Light a virtual diya, write your wish and submit it to Hanuman Ji. Your manokamna reaches Bajrangbali and you receive punya points for every prayer.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Is Manokamna virtual Hanuman temple free?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes, the Manokamna virtual Hanuman temple is completely free. You can visit anytime for darshan, Chalisa, aarti, and prayers without any cost.'
            }
          }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'AudioObject',
        'name': 'Hanuman Chalisa - Virtual Temple Audio',
        'description': 'Full Hanuman Chalisa audio for online listening at Manokamna virtual Hanuman temple. Forty verses written by Tulsidas in praise of Lord Hanuman.',
        'contentUrl': 'https://manokamna.online/assets/audio/mantras/hanuman-chalisa.mp3',
        'encodingFormat': 'audio/mpeg',
        'inLanguage': 'hi',
        'about': { '@type': 'Thing', 'name': 'Hanuman Chalisa', 'sameAs': 'https://en.wikipedia.org/wiki/Hanuman_Chalisa' }
      }
    ],
    '/ganesh': [
      {
        '@context': 'https://schema.org',
        '@type': 'Place',
        'name': 'Virtual Ganesh Temple - Manokamna',
        'alternateName': ['गणेश मंदिर', 'Ganpati Mandir Online', 'Vighnaharta Virtual Temple'],
        'description': 'Free online virtual Ganesh temple for darshan, Ganesh aarti, diya offerings and prayers 24/7.',
        'url': 'https://manokamna.online/ganesh',
        'sameAs': ['https://en.wikipedia.org/wiki/Ganesha'],
        'additionalProperty': [
          { '@type': 'PropertyValue', 'name': 'Deity', 'value': 'Lord Ganesha (Vighnaharta)' },
          { '@type': 'PropertyValue', 'name': 'Services', 'value': 'Online Darshan, Ganesh Aarti, Diya, Modak Offering, Prayers' }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'How do I do Ganesh online darshan?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Visit manokamna.online/ganesh for free online Ganesh darshan 24/7. Light a diya, offer flowers or modak, perform Ganesh aarti and seek Vighnaharta blessings. Ganpati Bappa Morya!'
            }
          },
          {
            '@type': 'Question',
            'name': 'How to pray to Ganesha online for success?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Visit manokamna.online/ganesh, light a virtual diya, perform aarti and then go to the wish page at manokamna.online/ganesh/wish to seek Lord Ganesha\'s blessings for removing obstacles and achieving success.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Is there an online Ganesh Chaturthi puja?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes! Manokamna virtual Ganesh temple is available 24/7, including on Ganesh Chaturthi. You can perform virtual puja, light diyas, and seek Ganpati Bappa\'s blessings anytime for free.'
            }
          },
          {
            '@type': 'Question',
            'name': 'What are the benefits of Ganesh puja online?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Online Ganesh puja at Manokamna helps remove obstacles (Vighna), brings success, wisdom and prosperity. Ideal for before starting any new venture, exam preparation, or business endeavours.'
            }
          }
        ]
      }
    ],
    '/shiva': [
      {
        '@context': 'https://schema.org',
        '@type': 'Place',
        'name': 'Virtual Shiva Temple - Manokamna',
        'alternateName': ['शिव मंदिर', 'Mahadev Mandir Online', 'Bholenath Virtual Mandir'],
        'description': 'Free online virtual Shiva temple for darshan, Shiva aarti, Om Namah Shivaya chanting, bel patra offering and prayers 24/7.',
        'url': 'https://manokamna.online/shiva',
        'sameAs': ['https://en.wikipedia.org/wiki/Shiva'],
        'additionalProperty': [
          { '@type': 'PropertyValue', 'name': 'Deity', 'value': 'Lord Shiva (Mahadev, Bholenath)' },
          { '@type': 'PropertyValue', 'name': 'Services', 'value': 'Online Darshan, Shiva Aarti, Om Namah Shivaya, Diya, Bel Patra, Prayers' }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'How do I do Mahadev online darshan?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Visit manokamna.online/shiva for free online Mahadev darshan 24/7. Chant Om Namah Shivaya, offer bel patra, light a diya and perform Shiva aarti. Har Har Mahadev!'
            }
          },
          {
            '@type': 'Question',
            'name': 'Can I do Mahashivratri puja online?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes! Manokamna virtual Shiva temple is open 24/7 including on Mahashivratri. Perform virtual Shivling puja, chant Om Namah Shivaya, light 108 diyas and seek Bholenath\'s blessings anytime, completely free.'
            }
          },
          {
            '@type': 'Question',
            'name': 'What is the most powerful Shiva mantra to chant online?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'The most powerful Shiva mantra is "Om Namah Shivaya" - the Panchakshara mantra. At Manokamna virtual Shiva temple, you can chant this mantra during online darshan, perform Shiva aarti and receive Mahadev blessings anytime.'
            }
          },
          {
            '@type': 'Question',
            'name': 'How to pray to Shiva online at home?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'At Manokamna virtual Shiva temple (manokamna.online/shiva), you can perform complete online puja: light a diya, offer flowers and bel patra, chant Om Namah Shivaya, ring the temple bell, perform Shiva aarti and make wishes to Mahadev.'
            }
          }
        ]
      }
    ],
    '/krishna': [
      {
        '@context': 'https://schema.org',
        '@type': 'Place',
        'name': 'Virtual Krishna Temple - Manokamna',
        'alternateName': ['कृष्ण मंदिर', 'Radhe Krishna Mandir Online', 'Govind Virtual Temple'],
        'description': 'Free online virtual Krishna temple for darshan, Krishna aarti, bhajans and prayers 24/7. Radhe Radhe!',
        'url': 'https://manokamna.online/krishna',
        'sameAs': ['https://en.wikipedia.org/wiki/Krishna'],
        'additionalProperty': [
          { '@type': 'PropertyValue', 'name': 'Deity', 'value': 'Lord Krishna (Govind, Radhe Krishna)' },
          { '@type': 'PropertyValue', 'name': 'Services', 'value': 'Online Darshan, Krishna Aarti, Bhajan, Diya, Tulsi Offering, Prayers' }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'How do I take Krishna darshan online?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Visit manokamna.online/krishna for free online Krishna darshan 24/7. Listen to "Aarti Kunj Bihari Ki", light a diya, offer tulsi and receive Govind\'s blessings. Radhe Radhe!'
            }
          },
          {
            '@type': 'Question',
            'name': 'Is there an online puja for Janmashtami?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes! Manokamna virtual Krishna temple is open 24/7 on Janmashtami. Perform virtual puja at midnight, listen to Krishna bhajans, light 108 diyas and celebrate Kanha Ji\'s birthday online for free.'
            }
          },
          {
            '@type': 'Question',
            'name': 'How to pray to Lord Krishna for love and peace?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Visit manokamna.online/krishna, light a diya, perform Aarti Kunj Bihari Ki aarti and then go to manokamna.online/krishna/wish to seek Lord Krishna\'s divine blessings for love, peace and wisdom.'
            }
          }
        ]
      }
    ],
    '/durga': [
      {
        '@context': 'https://schema.org',
        '@type': 'Place',
        'name': 'Virtual Durga Temple - Manokamna',
        'alternateName': ['दुर्गा मंदिर', 'Maa Durga Mandir Online', 'Sherawali Mata Virtual Temple'],
        'description': 'Free online virtual Durga temple for darshan, Durga aarti (Jai Ambe Gauri), Navratri puja and prayers 24/7. Jai Mata Di!',
        'url': 'https://manokamna.online/durga',
        'sameAs': ['https://en.wikipedia.org/wiki/Durga'],
        'additionalProperty': [
          { '@type': 'PropertyValue', 'name': 'Deity', 'value': 'Maa Durga (Sherawali Mata, Ambe Maa)' },
          { '@type': 'PropertyValue', 'name': 'Services', 'value': 'Online Darshan, Durga Aarti, Navratri Puja, Diya, Chunri Offering, Prayers' }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'How do I do Maa Durga online darshan?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Visit manokamna.online/durga for free online Maa Durga darshan 24/7. Perform "Jai Ambe Gauri" aarti, offer chunri and flowers, light a diya and seek Sherawali Mata\'s blessings. Jai Mata Di!'
            }
          },
          {
            '@type': 'Question',
            'name': 'Can I do Navratri puja online?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes! Manokamna virtual Durga temple offers free Navratri puja online for all 9 days. Light diyas for each form of Navdurga, perform aarti and seek Maa Durga\'s blessings from your home.'
            }
          },
          {
            '@type': 'Question',
            'name': 'How to get Maa Durga blessings online?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Visit manokamna.online/durga for darshan, perform Durga aarti, light a diya and offer virtual chunri to Sherawali Mata. Then visit manokamna.online/durga/wish to submit your prayers and seek her divine blessings.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Is there an online Vaishno Devi darshan?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Manokamna virtual Durga temple offers online darshan of Maa Durga / Ambe Maa, similar in spirit to Vaishno Devi darshan. Seek the goddess\'s blessings anytime at manokamna.online/durga, completely free.'
            }
          }
        ]
      }
    ]
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

    // Inject per-deity rich structured data (FAQ, Place, AudioObject schemas)
    this.injectDeityStructuredData(path);
  }

  /**
   * Inject per-page deity structured data (FAQ, Place, AudioObject).
   * Replaces previously injected dynamic schemas without touching static site-level ones.
   */
  private injectDeityStructuredData(path: string): void {
    // Remove previously injected dynamic schemas
    const existing = document.querySelectorAll('script[type="application/ld+json"]');
    existing.forEach(el => {
      if (!this.STATIC_LD_IDS.includes(el.id)) {
        el.remove();
      }
    });

    const schemas = this.deityStructuredData[path];
    if (!schemas) { return; }

    schemas.forEach(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    });
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
