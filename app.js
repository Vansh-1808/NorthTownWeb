/**
 * NORTH TOWN - Interactive Scroll-Triggered Website Engine
 * 33 High-Rise Towers & 111 Signature Luxury Villas
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initHeaderNavigation();
  initGSAPAnimations();
  initLivingComparison();
  initAmenitiesFilter();
  initMasterCampusMap();
  initAmenityBookingSimulator();
  initAmenityModal();
  initCampusVisitForm();
  initAmbientSoundscape();
  initTiltEffect();
});

/* ===================================================================
   1. SCROLL PROGRESS BAR
   =================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${scrollPercent}%`;
  }, { passive: true });
}

/* ===================================================================
   2. HEADER & NAVIGATION BEHAVIOR
   =================================================================== */
function initHeaderNavigation() {
  const header = document.getElementById('main-header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

  // Sticky Header state on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile drawer toggle
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const icon = mobileMenuBtn.querySelector('i');
      if (mobileDrawer.classList.contains('open')) {
        icon.classList.remove('fa-bars-staggered');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars-staggered');
      }
    });

    // Close mobile drawer on link click
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars-staggered');
      });
    });
  }

  // Active link highlighting based on section
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNav = document.querySelector(`.desktop-nav a[href*="${sectionId}"]`);

      if (targetNav) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNav.classList.add('active');
        } else {
          targetNav.classList.remove('active');
        }
      }
    });
  }, { passive: true });
}

/* ===================================================================
   3. GSAP & SCROLLTRIGGER ANIMATIONS
   =================================================================== */
function initGSAPAnimations() {
  // Check if GSAP and ScrollTrigger are loaded
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    initFallbackAnimations();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Hero Section Staggered Reveal
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero-badge', { opacity: 0, y: -25, duration: 0.8, delay: 0.2 })
    .from('.hero-title-top', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    .from('.hero-title-main', { opacity: 0, scale: 0.94, y: 30, duration: 0.9 }, '-=0.3')
    .from('.hero-title-gold', { opacity: 0, y: 20, duration: 0.7 }, '-=0.5')
    .from('.hero-desc', { opacity: 0, y: 20, duration: 0.8 }, '-=0.4')
    .from('.hero-buttons', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    .from('.stat-card', { opacity: 0, y: 35, stagger: 0.15, duration: 0.7 }, '-=0.3');

  // Animated Stats Counter
  const statsElements = document.querySelectorAll('.stat-number');
  statsElements.forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = current;
          }
        }, 30);
      }
    });
  });

  // Journey Slides Scroll-Triggered Parallax Reveal
  const slides = document.querySelectorAll('.journey-slide');
  slides.forEach((slide, index) => {
    const imgWrap = slide.querySelector('.slide-media-wrap');
    const content = slide.querySelector('.slide-content');

    gsap.from(slide, {
      scrollTrigger: {
        trigger: slide,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 50,
      duration: 0.9,
      ease: 'power2.out'
    });

    if (imgWrap) {
      gsap.from(imgWrap, {
        scrollTrigger: {
          trigger: slide,
          start: 'top 80%',
          scrub: 1.2
        },
        y: 20,
        ease: 'none'
      });
    }
  });

  // Section Headers Reveal
  const sectionIntros = document.querySelectorAll('.section-intro');
  sectionIntros.forEach(intro => {
    gsap.from(intro, {
      scrollTrigger: {
        trigger: intro,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out'
    });
  });
}

// Fallback if GSAP CDN fails
function initFallbackAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.journey-slide, .amenity-card, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
  });
}

/* ===================================================================
   4. 33 TOWERS VS 111 VILLAS INTERACTIVE SELECTOR
   =================================================================== */
function initLivingComparison() {
  const towersBtn = document.getElementById('tab-towers-btn');
  const villasBtn = document.getElementById('tab-villas-btn');
  const cardTowers = document.getElementById('card-towers');
  const cardVillas = document.getElementById('card-villas');

  if (!towersBtn || !villasBtn || !cardTowers || !cardVillas) return;

  function switchTab(target) {
    if (target === 'towers') {
      towersBtn.classList.add('active');
      villasBtn.classList.remove('active');
      cardTowers.classList.add('active');
      cardVillas.classList.remove('active');
    } else {
      villasBtn.classList.add('active');
      towersBtn.classList.remove('active');
      cardVillas.classList.add('active');
      cardTowers.classList.remove('active');
    }
  }

  towersBtn.addEventListener('click', () => switchTab('towers'));
  villasBtn.addEventListener('click', () => switchTab('villas'));
}

/* ===================================================================
   5. AMENITIES & FACILITIES FILTER MATRIX
   =================================================================== */
function initAmenitiesFilter() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const amenityCards = document.querySelectorAll('.amenity-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Update active pill
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterValue = pill.getAttribute('data-filter');

      amenityCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          // subtle pop animation
          card.style.animation = 'none';
          card.offsetHeight; // trigger reflow
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ===================================================================
   6. MASTER CAMPUS MAP & HOTSPOT EXPLORER
   =================================================================== */
const HOTSPOT_DATA = {
  'entrance': {
    title: 'Main Township Gated Portal',
    badge: 'Security & Main Entry',
    image: 'assets/images/entrance_gate.jpg',
    coords: 'GPS: 13.1147° N, 80.2486° E • North Town Main Gate',
    desc: 'The landmark gated entrance of North Town. Features 24/7 smart RFID boom barriers, biometric visitor identification, emergency control room, and wide 60ft palm boulevard.',
    features: [
      '24/7 RFID Automated Boom Barriers',
      'Visitor Pre-Approval App Synced',
      'Wide Palm-lined Divided Avenue'
    ],
    amenityKey: 'entrance'
  },
  'towers-alpha': {
    title: 'Towers Alpha Cluster (Towers 1 - 16)',
    badge: 'Skyline Residences',
    image: 'assets/images/tower_19.jpg',
    coords: 'Towers 1 to 16 • Northern Sector',
    desc: 'Comprising 16 high-rise apartment towers (G+14). Features 2 and 3 BHK homes, shaded internal driveways, dedicated kids play parks, and direct sheltered walkways to the clubhouse.',
    features: [
      '16 High-Rise Towers (G+14 Floors)',
      'High-Speed Otis Elevators (3 per core)',
      '100% DG Power Backup & Intercom'
    ],
    amenityKey: 'towers'
  },
  'towers-beta': {
    title: 'Towers Beta Cluster (Feat. Tower 19 & 17-33)',
    badge: 'Skyline Residences',
    image: 'assets/images/tower_19.jpg',
    coords: 'Towers 17 to 33 • Central Skyline Sector',
    desc: 'The central tower cluster showcasing Tower 19 with grand glass reception foyer, multi-level podium car parking, and unobstructed balconies overlooking the Olympic swimming pools.',
    features: [
      'Tower 19 Landmark Tower & Lobby',
      'Panoramic Balconies Facing Central Pool',
      '3-Tier Access Controlled Lobbies'
    ],
    amenityKey: 'towers'
  },
  'villas': {
    title: '111 Signature Luxury Villas Enclave',
    badge: 'Independent Estates',
    image: 'assets/images/luxury_villas.png',
    coords: 'Eastern Serenity Enclave • Villas 1 - 111',
    desc: 'A serene private sanctuary of 111 independent duplex and triplex luxury villas. Complete with manicured front lawns, private shaded parking, and peaceful speed-calmed avenues.',
    features: [
      '111 Independent Luxury Villas',
      'Zero Shared Walls & Private Gardens',
      'Dedicated Dual Covered Car Parking'
    ],
    amenityKey: 'villas'
  },
  'pools': {
    title: 'Clubhouse & Dual Olympic Swimming Pools',
    badge: 'Aquatic Center & Club',
    image: 'assets/images/olympic_pool.jpg',
    coords: 'Central Community Core • 50,000 Sq.Ft.',
    desc: 'The central pride of North Town. Hosts the semi-Olympic competition lap pool, kids shallow splash pool, resort sun deck, and the 50,000 sq.ft. multi-tiered clubhouse.',
    features: [
      'Semi-Olympic Competition Lap Pool',
      'Dedicated Shallow Kids Splash Pool',
      'Sunbed Loungers & Juice Kiosk'
    ],
    amenityKey: 'pool-olympic'
  },
  'sports': {
    title: 'Central Sports Arena & Landscaped Parks',
    badge: 'Fitness & Recreation',
    image: 'assets/images/pool_deck.jpg',
    coords: 'South-Western Green Sector',
    desc: 'Home to international-sized badminton courts, indoor squash, jogging paths, senior citizen gazebos, and safe rubber-floored children adventure play zones.',
    features: [
      'Indoor Wooden Sprung Badminton Courts',
      'Reflexology Paved Walking Track',
      'Kids Adventure Play Equipment'
    ],
    amenityKey: 'badminton'
  }
};

function initMasterCampusMap() {
  const pins = document.querySelectorAll('.map-pin-hotspot');
  const cardImg = document.getElementById('hotspot-card-img');
  const badge = document.getElementById('hotspot-badge');
  const coords = document.getElementById('hotspot-coords');
  const title = document.getElementById('hotspot-title');
  const desc = document.getElementById('hotspot-desc');
  const featuresWrap = document.getElementById('hotspot-features');
  const detailBtn = document.getElementById('hotspot-detail-btn');

  pins.forEach(pin => {
    pin.addEventListener('click', () => {
      pins.forEach(p => p.classList.remove('active'));
      pin.classList.add('active');

      const zoneKey = pin.getAttribute('data-zone');
      const data = HOTSPOT_DATA[zoneKey];
      if (!data) return;

      // Update Card
      cardImg.src = data.image;
      cardImg.alt = data.title;
      badge.textContent = data.badge;
      coords.textContent = data.coords;
      title.textContent = data.title;
      desc.textContent = data.desc;

      // Update features
      featuresWrap.innerHTML = data.features.map(f => `<span><i class="fa-solid fa-check text-gold"></i> ${f}</span>`).join('');

      // Update detail modal link
      if (detailBtn) {
        detailBtn.setAttribute('data-amenity', data.amenityKey);
      }
    });
  });
}

/* ===================================================================
   7. AMENITY BOOKING SIMULATOR & PASS GENERATION
   =================================================================== */
function initAmenityBookingSimulator() {
  const form = document.getElementById('amenity-booking-form');
  const dateInput = document.getElementById('booking-date');

  // Set default date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;
  }

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const amenitySelect = document.getElementById('amenity-select');
    const facilityTitle = amenitySelect.options[amenitySelect.selectedIndex].text;
    const resType = document.getElementById('residence-type').value;
    const unitNumber = document.getElementById('unit-number').value || 'Tower 19 - Flat 1204';
    const dateVal = document.getElementById('booking-date').value || 'Today';
    const slotVal = document.getElementById('booking-slot').value;
    const resName = document.getElementById('resident-name').value || 'Resident';
    const attendeesVal = document.getElementById('attendees-count').value;

    // Update Pass preview
    document.getElementById('pass-facility-title').textContent = facilityTitle;
    document.getElementById('pass-res-name').textContent = resName;
    document.getElementById('pass-res-unit').textContent = unitNumber;
    document.getElementById('pass-date-val').textContent = dateVal;
    document.getElementById('pass-slot-val').textContent = slotVal;
    document.getElementById('pass-attendees-val').textContent = attendeesVal;

    // Generate random pass code
    const randomCode = 'NT-PASS-' + Math.floor(1000 + Math.random() * 9000) + '-' + new Date().getFullYear();
    document.getElementById('pass-code').textContent = randomCode;

    // Pass bounce animation
    const pass = document.getElementById('pass-preview');
    pass.style.animation = 'none';
    pass.offsetHeight; // trigger reflow
    pass.style.animation = 'pulsePass 0.6s ease';

    showToast(`Access Pass ${randomCode} generated successfully!`);
  });
}

// Add animation keyframe dynamically
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes pulsePass {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(230, 200, 117, 0.7); }
  50% { transform: scale(1.03); box-shadow: 0 0 30px 10px rgba(230, 200, 117, 0.4); }
  100% { transform: scale(1); box-shadow: 0 25px 50px rgba(0,0,0,0.8); }
}`;
document.head.appendChild(styleSheet);

/* ===================================================================
   8. AMENITY SPECIFICATION MODAL CATALOG & HANDLER
   =================================================================== */
const AMENITY_CATALOG = {
  'entrance': {
    category: 'SECURITY & INFRASTRUCTURE',
    title: 'Monumental Gated Portal & 24/7 Security',
    image: 'assets/images/entrance_gate.jpg',
    timings: '24 Hours / 365 Days Guarded',
    desc: 'The grand gated entrance of North Town serves as the secure, monumental gateway for all 33 towers and 111 villas. Fitted with automated RFID sensor readers, multi-lane divided carriage, stone mushroom bollard illumination, and a landscaped welcome plaza.',
    features: [
      'Separate entry and exit lanes for residents and visitors',
      'Automated high-speed RFID boom barriers',
      'Perimeter CCTV cameras with AI motion detection',
      'Under-vehicle scanning mirrors and 24/7 armed security staff',
      'Direct panic-button emergency response link to central tower control'
    ]
  },
  'towers': {
    category: 'RESIDENTIAL TOWERS (33 TOWERS)',
    title: '33 Majestic High-Rise Residential Towers',
    image: 'assets/images/tower_19.jpg',
    timings: '24/7 Lobby Reception & Elevator Operations',
    desc: 'Tower 19 stands as an emblem of North Town\'s 33 high-rise towers. Each structure is engineered with earthquake-resistant RCC shear walls, grand double-height entrance lobbies, high-speed elevators, and cross-ventilated balcony residences offering sweeping city vistas.',
    features: [
      '33 Towers with G+14 residential storeys',
      'Double-height air-conditioned reception foyer with guest seating',
      '3 High-speed Otis passenger elevators per tower + service stretcher lift',
      '100% DG back-up for all apartments and common utilities',
      'Solar-powered lighting for corridors and podiums'
    ]
  },
  'villas': {
    category: 'VILLA ENCLAVE (111 LUXURY VILLAS)',
    title: '111 Signature Duplex & Triplex Villas',
    image: 'assets/images/luxury_villas.png',
    timings: 'Private Independent Estates',
    desc: 'An exclusive low-density enclave of 111 luxury villas. Designed with zero shared walls, each residence enjoys private front lawns, covered porticos for two cars, spacious sun decks, and tree-shaded quiet internal avenues.',
    features: [
      '111 Independent duplex & triplex luxury residences',
      'Zero common walls ensuring complete acoustic privacy',
      'Private manicured front lawn and personal terrace gardens',
      'Covered portico with provision for EV vehicle charging',
      'Dedicated avenue security patrols and low-speed pedestrian zones'
    ]
  },
  'pool-olympic': {
    category: 'AQUATIC & WELLNESS COMPLEX',
    title: 'Olympic Dual Swimming Pool Complex',
    image: 'assets/images/olympic_pool.jpg',
    timings: '06:00 AM - 09:30 PM Daily (Lifeguard on Duty)',
    desc: 'North Town features a magnificent dual-pool configuration: a semi-Olympic competition-grade lap pool alongside a dedicated, shallow kids splash pool. Treated with modern ozonated filtration systems to maintain pristine turquoise clarity with zero harsh chemicals.',
    features: [
      'Semi-Olympic competition lap pool (25m length)',
      'Dedicated shallow splash pool for toddlers and children',
      'Advanced German ozonated water purification system',
      'Certified lifeguards and first-aid station on-site at all open hours',
      'Adjoining modern changing suites with steam and sauna'
    ]
  },
  'pool-deck': {
    category: 'RESORT LEISURE & SUN DECK',
    title: 'Poolside Sun Deck, Loungers & Cabanas',
    image: 'assets/images/pool_deck.jpg',
    timings: '06:00 AM - 10:00 PM Daily',
    desc: 'Surrounding the Olympic waters, the sun deck is paved in heat-resistant, anti-slip natural stone. Features cushioned sun loungers, large shade umbrellas, poolside beverage pavilions, and lush tropical trees providing a serene resort atmosphere.',
    features: [
      '30+ Ergonomic cushioned sunbed loungers',
      'Shaded umbrella cabanas for reading and lounging',
      'Poolside juice and refreshment counter for residents',
      'High-speed township Wi-Fi coverage across the entire deck',
      'Submerged and deck ambient mood lighting for evening leisure'
    ]
  },
  'clubhouse': {
    category: 'COMMUNITY & SOCIAL HUB',
    title: '50,000 Sq.Ft. Multi-Storey Grand Clubhouse',
    image: 'assets/images/olympic_pool.jpg',
    timings: '06:00 AM - 11:00 PM Daily',
    desc: 'The architectural centerpiece of North Town. Spread over multiple levels, the clubhouse houses banquet halls, squash courts, card and billiards rooms, a business center, and an expansive resident terrace.',
    features: [
      'Air-conditioned banquet halls with pre-function lobby',
      'Indoor games room with table tennis, snooker, and chess',
      'Co-working business lounge with conference pods',
      'Resident library and tranquil reading alcove',
      'Convenience supermarket and resident cafe on ground floor'
    ]
  },
  'gym': {
    category: 'SPORTS & HEALTH STUDIO',
    title: 'State-of-the-Art Technogym Fitness Arena',
    image: 'assets/images/fitness_gym.jpg',
    timings: '05:30 AM - 10:30 PM Daily',
    desc: 'A commercial-standard fitness center overlooking panoramic poolside greenery. Equipped with commercial Technogym cardio treadmills, cross trainers, free-weight racks, and a dedicated yoga/aerobics studio.',
    features: [
      'Commercial Technogym cardio and strength equipment',
      'Floor-to-ceiling glass windows with lush garden views',
      'Certified resident trainers and personalized fitness counseling',
      'Dedicated soundproof yoga, pilates, and aerobics studio',
      'Electronic biometric lockers and sanitized towel service'
    ]
  },
  'badminton': {
    category: 'INDOOR SPORTS ARENA',
    title: 'Indoor Wooden Sprung Badminton Arena',
    image: 'assets/images/fitness_gym.jpg',
    timings: '06:00 AM - 10:00 PM (Slot Reservation via App)',
    desc: 'International tournament-grade indoor badminton courts featuring anti-glare overhead LED floodlights, professional maple wood sprung flooring to protect joints, and spectator viewing galleries.',
    features: [
      '2 BWF standard maple wood sprung badminton courts',
      'Spectator viewing gallery and warm-up stretching zone',
      'International tournament non-glare LED illumination',
      'Air-conditioned indoor viewing lounge',
      'Equipment locker rentals and professional stringing support'
    ]
  },
  'park': {
    category: 'NATURE & LANDSCAPED GREENS',
    title: 'Central Landscaped Parks & Toddler Play Arena',
    image: 'assets/images/entrance_gate.jpg',
    timings: '05:00 AM - 10:00 PM Daily',
    desc: 'Acres of manicured greenery with flowering canopies, reflexology walking trails, wooden pergolas, and child-safe rubber-cushioned playground equipment.',
    features: [
      '1.5 km rubberized perimeter jogging track',
      'Toddler play castle with slides, swings, and climbing frames',
      'Senior citizen tranquility pavilion with chess tables',
      'Butterfly garden and tropical botanical species',
      'Pet-friendly exercise lawn with agility hoops'
    ]
  },
  'banquet': {
    category: 'CELEBRATIONS & EVENTS',
    title: 'Grand Banquet Hall & Poolside Celebration Lawn',
    image: 'assets/images/pool_deck.jpg',
    timings: 'Reservations Open for Resident Celebrations',
    desc: 'Designed for family milestones, birthday celebrations, and township festival galas. Features grand acoustics, stage setup, and direct spill-over to the illuminated poolside lawn.',
    features: [
      'Capacity for up to 350 seated guests',
      'Commercial-grade catering and warming kitchen',
      'Integrated Bose acoustic sound system and dual 4K projectors',
      'Spillover access to the illuminated poolside deck lawn',
      'Dedicated guest parking and drop-off porch'
    ]
  }
};

function initAmenityModal() {
  const modal = document.getElementById('amenity-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const dismissBtn = document.getElementById('modal-dismiss-btn');
  const bookCta = document.getElementById('modal-book-cta');

  if (!modal) return;

  function openModal(key) {
    const data = AMENITY_CATALOG[key] || AMENITY_CATALOG['pool-olympic'];

    document.getElementById('modal-img').src = data.image;
    document.getElementById('modal-img').alt = data.title;
    document.getElementById('modal-cat').textContent = data.category;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-timings').innerHTML = `<i class="fa-regular fa-clock"></i> <span>${data.timings}</span>`;
    document.getElementById('modal-desc').textContent = data.desc;

    const list = document.getElementById('modal-features-list');
    list.innerHTML = data.features.map(f => `<li><i class="fa-solid fa-circle-check"></i> <span>${f}</span></li>`).join('');

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Attach click listeners to all open-modal buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.open-modal-btn');
    if (btn) {
      const key = btn.getAttribute('data-amenity');
      openModal(key);
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);
  if (bookCta) {
    bookCta.addEventListener('click', () => {
      closeModal();
    });
  }

  // Close on backdrop click
  modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ===================================================================
   9. CAMPUS VISIT VIP TOUR FORM
   =================================================================== */
function initCampusVisitForm() {
  const form = document.getElementById('campus-visit-form');
  const dateInput = document.getElementById('visitor-date');

  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('visitor-name').value;
    const date = document.getElementById('visitor-date').value;

    showToast(`Thank you, ${name}! Your VIP Campus Tour for ${date} has been confirmed. Our team will contact you shortly.`);
    form.reset();
  });
}

/* ===================================================================
   10. TOAST NOTIFICATION UTILITY
   =================================================================== */
function showToast(message) {
  const toast = document.getElementById('toast-notify');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ===================================================================
   11. AMBIENT SOUNDSCAPE SYNTHESIZER (WEB AUDIO API)
   Generates soothing ambient gentle water / garden breeze
   =================================================================== */
function initAmbientSoundscape() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  const soundText = document.getElementById('sound-text');

  if (!soundBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let noiseNode = null;
  let filterNode = null;
  let gainNode = null;

  function startAmbientAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Pink noise buffer generator for soothing water/wind murmur
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.04; // Gentle volume
        b6 = white * 0.115926;
      }

      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      // Low pass filter for deep relaxing water / breeze sound
      filterNode = audioCtx.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(380, audioCtx.currentTime);

      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + 2);

      noiseNode.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      noiseNode.start();
      isPlaying = true;

      soundBtn.classList.add('playing');
      soundIcon.className = 'fa-solid fa-volume-high';
      soundText.textContent = 'Ambient Sound: On';
      showToast('Relaxing poolside ambient soundscape enabled');
    } catch (e) {
      console.warn('Web Audio could not start:', e);
    }
  }

  function stopAmbientAudio() {
    if (gainNode && audioCtx) {
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      setTimeout(() => {
        if (noiseNode) noiseNode.stop();
        if (audioCtx) audioCtx.close();
        isPlaying = false;
        soundBtn.classList.remove('playing');
        soundIcon.className = 'fa-solid fa-volume-xmark';
        soundText.textContent = 'Ambient Sound: Off';
      }, 800);
    }
  }

  soundBtn.addEventListener('click', () => {
    if (!isPlaying) {
      startAmbientAudio();
    } else {
      stopAmbientAudio();
    }
  });
}

/* ===================================================================
   12. 3D TILT EFFECT FOR STAT CARDS
   =================================================================== */
function initTiltEffect() {
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}
