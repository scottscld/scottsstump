/**
 * Scott's Stump Grinding — Main JavaScript
 * Vanilla JS — no dependencies
 */

(function () {
  'use strict';

  /* ============================================================
     EMAILJS CONFIG — replace these three values after setup
     https://www.emailjs.com/docs/tutorial/overview/
     ============================================================ */
  const EMAILJS_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY',       // Account → API Keys → Public Key
    serviceId: 'YOUR_SERVICE_ID',     // Email Services → Service ID
    templateId: 'YOUR_TEMPLATE_ID'    // Email Templates → Template ID
  };

  /* Template variables sent to EmailJS (must match your template):
     {{from_name}}  — customer name
     {{phone}}      — customer phone number
     {{message}}    — project description
     {{time}}       — submission date/time
  */

  /* ============================================================
     DOM References
     ============================================================ */
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const quoteForm = document.getElementById('quoteForm');
  const formSuccess = document.getElementById('formSuccess');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const yearEl = document.getElementById('year');
  const submitBtn = document.getElementById('submitBtn');
  const formSubmitError = document.getElementById('formSubmitError');

  /* Initialize EmailJS when library and config are ready */
  if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
  }

  /* ============================================================
     Gallery Data
     Replace placeholder gradients with actual image paths
     when Facebook photos are downloaded to /images/
     ============================================================ */
  const galleryItems = [
    {
      src: 'images/gallery-01.jpg',
      caption: 'Before — Ann Arbor job with stumps ready for removal'
    },
    {
      src: 'images/gallery-02.jpg',
      caption: 'During — Stump grinding in progress, Ann Arbor'
    },
    {
      src: 'images/gallery-03.jpg',
      caption: 'During — Rayco grinder at work, Davisburg'
    },
    {
      src: 'images/gallery-04.jpg',
      caption: 'After — Stump removed, Davisburg backyard'
    },
    {
      src: 'images/gallery-05.jpg',
      caption: 'Tight Access — Grinder fits through narrow side yard, Clinton Township'
    },
    {
      src: 'images/gallery-06.jpg',
      caption: 'Large Stump — Oak stump in Fenton, Michigan'
    }
  ];

  let currentGalleryIndex = 0;

  /* ============================================================
     Footer Year
     ============================================================ */
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ============================================================
     Sticky Header Scroll Effect
     ============================================================ */
  function handleScroll() {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ============================================================
     Mobile Navigation
     ============================================================ */
  function toggleMobileNav() {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
    mobileNav.classList.toggle('open', !isOpen);
    mobileNav.hidden = isOpen;
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeMobileNav() {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    mobileNav.classList.remove('open');
    mobileNav.hidden = true;
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMobileNav);
  }

  /* Close mobile nav on link click */
  mobileNav?.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  /* Close mobile nav on escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav?.classList.contains('open')) {
      closeMobileNav();
    }
  });

  /* ============================================================
     Scroll Reveal Animations (Intersection Observer)
     ============================================================ */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ============================================================
     Gallery Lightbox
     ============================================================ */
  function openLightbox(index) {
    currentGalleryIndex = index;
    updateLightboxImage();
    lightbox.hidden = false;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    const item = galleryItems[currentGalleryIndex];
    if (!item) return;

    lightboxImg.style.backgroundImage = 'url(' + item.src + ')';
    lightboxImg.className = 'lightbox-img';
    lightboxCaption.textContent = item.caption;
  }

  function nextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    updateLightboxImage();
  }

  function prevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightboxImage();
  }

  document.querySelectorAll('.gallery-item').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openLightbox(parseInt(btn.dataset.index, 10));
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxNext?.addEventListener('click', nextImage);
  lightboxPrev?.addEventListener('click', prevImage);

  lightbox?.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  /* ============================================================
     Quote Form Validation & Submission
     ============================================================ */
  const validators = {
    name: function (value) {
      if (!value.trim()) return 'Please enter your name.';
      if (value.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
    phone: function (value) {
      if (!value.trim()) return 'Please enter your phone number.';
      const digits = value.replace(/\D/g, '');
      if (digits.length < 10) return 'Please enter a valid 10-digit phone number.';
      return '';
    },
    project: function (value) {
      if (!value.trim()) return 'Please describe your project.';
      if (value.trim().length < 10) return 'Please provide a bit more detail (at least 10 characters).';
      return '';
    }
  };

  function validateField(field) {
    const errorEl = document.getElementById(field.id + '-error');
    const error = validators[field.name](field.value);
    field.classList.toggle('error', !!error);
    field.setAttribute('aria-invalid', !!error);
    if (errorEl) errorEl.textContent = error;
    return !error;
  }

  function validateForm() {
    const fields = quoteForm.querySelectorAll('input, textarea');
    let isValid = true;
    fields.forEach(function (field) {
      if (!validateField(field)) isValid = false;
    });
    return isValid;
  }

  /* Real-time validation on blur */
  quoteForm?.querySelectorAll('input, textarea').forEach(function (field) {
    field.addEventListener('blur', function () {
      if (field.value.trim()) validateField(field);
    });

    field.addEventListener('input', function () {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  function isEmailJsConfigured() {
    return (
      EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY' &&
      EMAILJS_CONFIG.serviceId !== 'YOUR_SERVICE_ID' &&
      EMAILJS_CONFIG.templateId !== 'YOUR_TEMPLATE_ID'
    );
  }

  function setSubmitLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? 'Sending…' : 'Submit Quote Request';
  }

  function showSubmitError(message) {
    if (!formSubmitError) return;
    formSubmitError.textContent = message;
    formSubmitError.hidden = false;
  }

  function clearSubmitError() {
    if (!formSubmitError) return;
    formSubmitError.textContent = '';
    formSubmitError.hidden = true;
  }

  function showFormSuccess() {
    const fields = quoteForm.querySelectorAll('.form-group, #submitBtn, #formSubmitError');
    fields.forEach(function (el) {
      el.style.display = 'none';
    });
    formSuccess.hidden = false;
  }

  quoteForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    clearSubmitError();

    if (!validateForm()) {
      const firstError = quoteForm.querySelector('.error');
      firstError?.focus();
      return;
    }

    if (!isEmailJsConfigured()) {
      /* Demo mode until EmailJS IDs are added to EMAILJS_CONFIG above */
      console.info('EmailJS not configured — showing demo success. Add your IDs in script.js to enable email.');
      showFormSuccess();
      return;
    }

    if (typeof emailjs === 'undefined') {
      showSubmitError('Email service failed to load. Please call (313) 570-0352.');
      return;
    }

    const templateParams = {
      from_name: quoteForm.name.value.trim(),
      phone: quoteForm.phone.value.trim(),
      message: quoteForm.project.value.trim(),
      time: new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'America/Detroit'
      })
    };

    setSubmitLoading(true);

    emailjs
      .send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams)
      .then(function () {
        showFormSuccess();
      })
      .catch(function (err) {
        console.error('EmailJS error:', err);
        showSubmitError(
          'Something went wrong sending your request. Please call (313) 570-0352 and we\'ll help you directly.'
        );
      })
      .finally(function () {
        setSubmitLoading(false);
      });
  });

  /* ============================================================
     Smooth scroll offset for fixed header
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ============================================================
     Phone number click tracking (future analytics hook)
     ============================================================ */
  document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      /*
        FUTURE ENHANCEMENT: Add analytics event
        Example with Google Analytics 4:
        gtag('event', 'phone_call', { event_category: 'engagement' });
      */
    });
  });

})();