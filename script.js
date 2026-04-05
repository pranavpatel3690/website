/* ============================================================
   RANCHO PATEL PHOTOGRAPHY — Main JavaScript
   ============================================================ */

'use strict';

// ===== PAGE TRANSITION =====
const pageTransition = document.getElementById('page-transition');

// Fade in on load
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// Intercept nav links for smooth transitions
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http')) return;
  link.addEventListener('click', e => {
    e.preventDefault();
    pageTransition.classList.add('active');
    setTimeout(() => { window.location.href = href; }, 600);
  });
});

// ===== HAMBURGER MENU =====
const menuBtn = document.getElementById('nav-menu-btn');
const menuOverlay = document.getElementById('menu-overlay');
const hamburger = document.getElementById('hamburger');
const menuLabel = menuBtn ? menuBtn.querySelector('span') : null;
let menuOpen = false;

if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    menuOverlay.classList.toggle('active', menuOpen);
    menuOverlay.setAttribute('aria-hidden', String(!menuOpen));
    if (menuLabel) menuLabel.textContent = menuOpen ? 'Close' : 'Menu';
    if (hamburger) {
      const spans = hamburger.querySelectorAll('span');
      if (menuOpen) {
        spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
      }
    }
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  });
}

// Close menu on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuOpen) menuBtn.click();
});

// ===== HERO SLIDESHOW (index.html) =====
const heroSlides = document.querySelectorAll('.hero-slide');
const slideCurrentEl = document.getElementById('slide-current');
const slideTotalEl = document.getElementById('slide-total');
const siteHeader = document.getElementById('site-header');

if (heroSlides.length > 0) {
  let currentSlide = 0;
  const totalSlides = heroSlides.length;

  // Initialize counter text
  if (slideCurrentEl) slideCurrentEl.textContent = String(currentSlide + 1).padStart(2, '0');
  if (slideTotalEl) slideTotalEl.textContent = String(totalSlides).padStart(2, '0');

  function advanceSlide() {
    const prevSlide = heroSlides[currentSlide];

    // Mark previous slide as 'last-active' so it stays underneath during fade
    prevSlide.classList.remove('active');
    prevSlide.classList.add('last-active');

    currentSlide = (currentSlide + 1) % totalSlides;
    heroSlides[currentSlide].classList.add('active');

    if (slideCurrentEl) {
      slideCurrentEl.textContent = String(currentSlide + 1).padStart(2, '0');
    }
    if (slideTotalEl) {
      slideTotalEl.textContent = String(totalSlides).padStart(2, '0');
    }

    // Clean up the 'last-active' class after the transition is complete
    setTimeout(() => {
      prevSlide.classList.remove('last-active');
    }, 3000); // Matches the 2.5s CSS transition + buffer
  }

  setInterval(advanceSlide, 6500); // Slightly longer interval (6.5s) for a more relaxed feel

  // Header transparency on scroll
  if (siteHeader && siteHeader.classList.contains('hero-mode')) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        siteHeader.classList.remove('hero-mode');
        siteHeader.classList.add('solid-mode');
      } else {
        siteHeader.classList.remove('solid-mode');
        siteHeader.classList.add('hero-mode');
      }
    });
  }
}

// ===== VERTICAL JUSTIFIED GALLERY — STILLS (stills.html) =====
const galleryWrapper = document.getElementById('gallery-wrapper');
const galleryTrack = document.getElementById('gallery-track');

if (galleryWrapper && galleryTrack) {
  const items = galleryTrack.querySelectorAll('.gallery-item');


  // Lightbox Expansion
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox) {
    const prevBtn = document.createElement('button');
    prevBtn.id = 'lightbox-prev';
    prevBtn.innerHTML = '&#10094;';
    prevBtn.setAttribute('aria-label', 'Previous image');
    lightbox.appendChild(prevBtn);

    const nextBtn = document.createElement('button');
    nextBtn.id = 'lightbox-next';
    nextBtn.innerHTML = '&#10095;';
    nextBtn.setAttribute('aria-label', 'Next image');
    lightbox.appendChild(nextBtn);

    let currentLightboxIndex = 0;
    let currentVisibleItems = [];

    const updateLightboxImage = () => {
      if (currentVisibleItems.length === 0) return;
      const img = currentVisibleItems[currentLightboxIndex].querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
      }
    };

    const showNextImage = () => {
      if (currentVisibleItems.length <= 1) return;
      currentLightboxIndex = (currentLightboxIndex + 1) % currentVisibleItems.length;
      updateLightboxImage();
    };

    const showPrevImage = () => {
      if (currentVisibleItems.length <= 1) return;
      currentLightboxIndex = (currentLightboxIndex - 1 + currentVisibleItems.length) % currentVisibleItems.length;
      updateLightboxImage();
    };

    items.forEach(item => {
      item.addEventListener('click', () => {
        // Find visible items logic for galleries
        currentVisibleItems = Array.from(items).filter(i => !i.classList.contains('hidden'));
        currentLightboxIndex = currentVisibleItems.indexOf(item);
        if(currentLightboxIndex === -1) {
          currentLightboxIndex = 0;
          currentVisibleItems = [item];
        }

        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    // Lightbox Keyboard Nav
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      }
    });
  }

  // IntersectionObserver for Scroll Reveal
  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add a slight staggered delay for a more premium entry
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, index * 80); 
        galleryObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  items.forEach(item => galleryObserver.observe(item));

  // Category filter with smooth transition
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      // Update UI
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // 1. Fade out current items first (Whisper-soft fade)
      galleryTrack.style.opacity = '0';
      galleryTrack.style.transform = 'translateY(10px)';
      galleryTrack.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

      setTimeout(() => {
        items.forEach(item => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.classList.toggle('hidden', !match);
          
          // Reset reveal state for re-animation if needed
          if (match) {
            item.classList.remove('revealed');
          }
        });

        // 2. Fade back in and re-observe
        galleryTrack.style.opacity = '1';
        galleryTrack.style.transform = 'translateY(0)';
        
        items.forEach(item => {
          if (!item.classList.contains('hidden')) {
            galleryObserver.observe(item);
          }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 650);
    });
  });
}

// ===== MOTION PAGE — Vertical Layout with Scroll Reveal =====
const projectsContainer = document.getElementById('projects-container');
const videoPlayer = document.getElementById('video-player');
const videoPlayerEl = document.getElementById('video-player-el');
const videoClose = document.getElementById('video-close');
const videoTitleDisplay = document.getElementById('video-title-display');

if (projectsContainer) {
  const projectCards = projectsContainer.querySelectorAll('.project-card');

  // Scroll-reveal animation using IntersectionObserver
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  projectCards.forEach(card => revealObserver.observe(card));

  // Hover to play preview video + click to fullscreen
  projectCards.forEach(card => {
    const visual = card.querySelector('.project-visual');
    const vid = card.querySelector('.project-video');
    if (!visual || !vid) return;

    visual.addEventListener('mouseenter', () => {
      vid.currentTime = 0;
      vid.play().catch(() => { });
    });

    visual.addEventListener('mouseleave', () => {
      vid.pause();
      vid.currentTime = 0;
    });

    // Click — open fullscreen player
    visual.addEventListener('click', () => {
      const src = card.dataset.video;
      const title = card.querySelector('.project-title')?.textContent || '';
      if (!src || !videoPlayer) return;

      const srcEl = videoPlayerEl.querySelector('source');
      if (srcEl) srcEl.src = src;
      videoPlayerEl.load();
      if (videoTitleDisplay) videoTitleDisplay.textContent = title;
      videoPlayer.classList.add('active');
      videoPlayer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      vid.pause();
      videoPlayerEl.play().catch(() => { });
    });
  });

  // Close fullscreen player
  function closeVideoPlayer() {
    if (!videoPlayer) return;
    videoPlayer.classList.remove('active');
    videoPlayer.setAttribute('aria-hidden', 'true');
    videoPlayerEl.pause();
    videoPlayerEl.currentTime = 0;
    document.body.style.overflow = '';
  }

  if (videoClose) videoClose.addEventListener('click', closeVideoPlayer);
  if (videoPlayer) {
    videoPlayer.addEventListener('click', e => {
      if (e.target === videoPlayer) closeVideoPlayer();
    });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && videoPlayer?.classList.contains('active')) closeVideoPlayer();
  });
}

// ===== ABOUT PAGE — Scroll-based effects =====
if (document.body.classList.contains('about-page')) {
  // 1. Portrait Parallax
  const portrait = document.getElementById('about-side-portrait');
  if (portrait) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      // Subtracting a fraction of scroll for subtle lag/parallax
      portrait.style.transform = `translateY(${scrolled * 0.1}px)`;
    });
  }
}

// ===== CONTACT FORM =====
async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('form-submit');

  // Store original state
  const originalText = btn.textContent;

  // Set loading state
  btn.textContent = 'Sending...';
  btn.style.opacity = '0.7';
  btn.style.pointerEvents = 'none';

  const formData = new FormData(form);

  try {
    // Send form data via AJAX to formsubmit.co endpoint
    const response = await fetch('https://formsubmit.co/ajax/Helloranchoo@gmail.com', {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    });

    if (response.ok) {
      // Success state animation
      form.classList.add('faded');
      const overlay = document.getElementById('form-success-overlay');
      if (overlay) {
        overlay.classList.add('active');
        form.reset();
      }
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    console.error('Submission error:', error);

    // Error state
    btn.textContent = 'Error';
    btn.style.background = '#c92a2a';
    btn.style.opacity = '1';

    // Reset button after 3 seconds
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.pointerEvents = 'auto';
    }, 3000);
  }
}

// ===== LIGHTBOX HOME (if present) =====
const homeLightboxClose = document.getElementById('lightbox-close');
const homeLightbox = document.getElementById('lightbox');
if (homeLightboxClose && homeLightbox) {
  homeLightboxClose.addEventListener('click', () => {
    homeLightbox.classList.remove('active');
    document.body.style.overflow = '';
  });
}

// ===== BACK TO TOP BUTTON =====
const backToTopBtn = document.createElement('button');
backToTopBtn.id = 'back-to-top';
backToTopBtn.innerHTML = 'Back to top <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
  // Show button when scrolled down slightly
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ===== GLOBAL PRELOADER =====
const preloader = document.createElement('div');
preloader.id = 'global-preloader';
preloader.innerHTML = '<img src="images/logo.png" alt="Loading" class="preloader-logo">';
document.body.appendChild(preloader);

window.addEventListener('load', () => {
  // Wait a fraction of a second to ensure smooth render
  setTimeout(() => {
    preloader.classList.add('hide');
    setTimeout(() => preloader.remove(), 800);
  }, 200);
});

// Can you convert this static website tp nextjs framework. I intend to host on vercel.
// Cloudinary - I want to use videos and photos to host here. 

