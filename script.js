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
    publicKey: '0Zs53-XPJpSTp8vzv',       // Account → API Keys → Public Key
    serviceId: 'service_p15w4y7',     // Email Services → Service ID
    templateId: 'template_7p2j60s'    // Email Templates → Template ID
  };

  /* Template variables sent to EmailJS (must match your template):
     {{from_name}}  — customer name
     {{phone}}      — customer phone number
     {{message}}    — project description  (also used for chat leads, prefixed "Lead from website quick chat:")
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

  /* Chatbot elements */
  const chatFab = document.getElementById('chatFab');
  const chatPanel = document.getElementById('chatPanel');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatQuickReplies = document.getElementById('chatQuickReplies');
  const chatClose = document.getElementById('chatClose');
  const chatInputArea = document.getElementById('chatInputArea');

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

  /* ============================================================
     QUICK CHATBOT — Short on-brand lead capture
     3 quick guided interactions → sends structured lead via EmailJS
     Tone: direct, helpful, no fluff. Matches site voice.
     ============================================================ */
  let chatOpen = false;
  let chatStep = 0;
  let chatData = { name: '', phone: '', details: '' };

  function resetChatState() {
    chatStep = 0;
    chatData = { name: '', phone: '', details: '' };
    if (chatMessages) chatMessages.innerHTML = '';
    if (chatQuickReplies) chatQuickReplies.innerHTML = '';
    if (chatInputArea) chatInputArea.style.display = '';
    if (chatInput) {
      chatInput.disabled = false;
      chatInput.placeholder = 'Type your answer...';
    }
    if (chatSend) chatSend.disabled = false;
  }

  function appendChatMessage(role, text) {
    if (!chatMessages) return;
    const msg = document.createElement('div');
    msg.className = 'chat-msg chat-msg-' + role;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    msg.appendChild(bubble);
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function clearQuickReplies() {
    if (chatQuickReplies) chatQuickReplies.innerHTML = '';
  }

  function showQuickReplies(replies, onSelect) {
    clearQuickReplies();
    if (!chatQuickReplies) return;
    replies.forEach(function (label) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        clearQuickReplies();
        appendChatMessage('user', label);
        onSelect(label);
      });
      chatQuickReplies.appendChild(btn);
    });
  }

  function showChatInput() {
    if (!chatInputArea) return;
    chatInputArea.style.display = '';
    if (chatInput) {
      chatInput.disabled = false;
      chatInput.focus();
    }
  }

  function hideChatInput() {
    if (chatInputArea) chatInputArea.style.display = 'none';
  }

  function validateName(value) {
    return value.trim().length >= 2;
  }

  function validatePhone(value) {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 10;
  }

  function validateDetails(value) {
    return value.trim().length >= 6;
  }

  function processChatInput(raw) {
    const text = (raw || '').trim();
    if (!text) return;

    appendChatMessage('user', text);

    // Handle current step
    if (chatStep === 1) {
      // Name
      if (!validateName(text)) {
        setTimeout(function () {
          appendChatMessage('bot', 'Please enter at least your first name.');
        }, 250);
        return;
      }
      chatData.name = text;
      chatStep = 2;
      clearQuickReplies();
      setTimeout(function () {
        appendChatMessage('bot', "Thanks. Best phone number to reach you?");
      }, 320);
      showChatInput();
      return;
    }

    if (chatStep === 2) {
      // Phone
      if (!validatePhone(text)) {
        setTimeout(function () {
          appendChatMessage('bot', 'Need a full 10-digit phone number (area code included).');
        }, 250);
        return;
      }
      chatData.phone = text;
      chatStep = 3;
      clearQuickReplies();
      setTimeout(function () {
        appendChatMessage('bot', "Got it. Project details — # of stumps, rough sizes, city/area?");
      }, 280);
      // Show helpful quick chips for speed
      showQuickReplies([
        '1 stump, backyard, Davisburg',
        '2-3 stumps, Holly / Clarkston',
        '4+ stumps or large oak'
      ], function (choice) {
        // Treat quick chip as the details input
        chatData.details = choice;
        chatStep = 4;
        clearQuickReplies();
        showSummaryAndConfirm();
      });
      showChatInput();
      return;
    }

    if (chatStep === 3) {
      // Details (free text path)
      if (!validateDetails(text)) {
        setTimeout(function () {
          appendChatMessage('bot', 'A bit more detail helps (e.g. "two 24-inch stumps in back yard, Waterford").');
        }, 250);
        return;
      }
      chatData.details = text;
      chatStep = 4;
      clearQuickReplies();
      showSummaryAndConfirm();
      return;
    }

    // Fallback (shouldn't reach)
    setTimeout(function () {
      appendChatMessage('bot', "Thanks. If you need anything else, call (313) 570-0352.");
    }, 200);
  }

  function sendCurrentChatInput() {
    if (!chatInput || chatInput.disabled) return;
    const val = chatInput.value;
    chatInput.value = '';
    processChatInput(val);
  }

  function showSummaryAndConfirm() {
    hideChatInput();
    clearQuickReplies();

    const summaryLines = [
      'Name: ' + chatData.name,
      'Phone: ' + chatData.phone,
      'Details: ' + chatData.details
    ].join('\n');

    setTimeout(function () {
      appendChatMessage('bot', "Here's what I'll send Scott:\n" + summaryLines + "\n\nSend for a quote?");
    }, 220);

    // Replace quick/input area with action buttons
    setTimeout(function () {
      if (!chatQuickReplies) return;
      chatQuickReplies.innerHTML = '';

      const actions = document.createElement('div');
      actions.className = 'chat-actions';

      const sendBtn = document.createElement('button');
      sendBtn.className = 'chat-send-btn';
      sendBtn.textContent = 'Yes — send to Scott';
      sendBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        actions.remove();
        sendChatLead();
      });

      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'chat-secondary-btn';
      cancelBtn.textContent = 'Use full form instead';
      cancelBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeChat();
        // scroll to quote section
        const quote = document.getElementById('quote');
        if (quote) {
          const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 72;
          const top = quote.getBoundingClientRect().top + window.scrollY - headerOffset - 20;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });

      actions.appendChild(sendBtn);
      actions.appendChild(cancelBtn);
      chatQuickReplies.appendChild(actions);
    }, 380);
  }

  function sendChatLead() {
    if (!chatMessages) return;

    appendChatMessage('bot', 'Sending your info to Scott now...');

    const timeStr = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'America/Detroit'
    });

    const messageBody = 'Lead from website quick chat:\n\n' +
      'Name: ' + chatData.name + '\n' +
      'Phone: ' + chatData.phone + '\n' +
      'Details: ' + chatData.details + '\n\n' +
      'Source: Chatbot on this site\nTime: ' + timeStr;

    const templateParams = {
      from_name: chatData.name,
      phone: chatData.phone,
      message: messageBody,
      time: timeStr
    };

    function onSuccess() {
      appendChatMessage('bot', "Sent. Scott will call or text you shortly with a quote and schedule.");
      showPostSendActions();
    }

    function onError(msg) {
      appendChatMessage('bot', msg || "Couldn't send right now. Please call (313) 570-0352.");
      showPostSendActions(true);
    }

    if (!isEmailJsConfigured() || typeof emailjs === 'undefined') {
      setTimeout(function () {
        // Demo mode (matches existing quote form behavior)
        console.info('EmailJS not configured — demo chat lead captured.');
        onSuccess();
      }, 650);
      return;
    }

    setTimeout(function () {  // tiny delay feels natural
      emailjs
        .send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams)
        .then(function () {
          onSuccess();
        })
        .catch(function (err) {
          console.error('Chat lead EmailJS error:', err);
          onError("Send failed. Call (313) 570-0352 and we'll get it sorted.");
        });
    }, 420);
  }

  function showPostSendActions(hadError) {
    hideChatInput();
    clearQuickReplies();
    if (!chatQuickReplies) return;

    const actions = document.createElement('div');
    actions.className = 'chat-actions';

    const callBtn = document.createElement('button');
    callBtn.className = 'chat-send-btn';
    callBtn.textContent = 'Call (313) 570-0352';
    callBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      window.location.href = 'tel:+13135700352';
    });

    const doneBtn = document.createElement('button');
    doneBtn.className = 'chat-secondary-btn';
    doneBtn.textContent = hadError ? 'Close' : 'Done';
    doneBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeChat();
    });

    actions.appendChild(callBtn);
    actions.appendChild(doneBtn);
    chatQuickReplies.appendChild(actions);

    // Lock further typing
    if (chatInput) chatInput.disabled = true;
    if (chatSend) chatSend.disabled = true;
  }

  function openChat() {
    if (!chatPanel || !chatFab) return;
    if (chatPanel.classList.contains('open')) return;

    chatPanel.classList.add('open');
    chatPanel.setAttribute('aria-hidden', 'false');
    chatFab.setAttribute('aria-expanded', 'true');
    chatFab.setAttribute('aria-label', 'Close quick quote chat');
    chatOpen = true;

    // Fresh start each open for simplicity
    resetChatState();
    hideChatInput();  // shown only during input steps

    // Greeting — short & on-brand
    setTimeout(function () {
      appendChatMessage('bot', "Hi! Scott's Stump Grinding. Need a stump ground?");
    }, 180);

    setTimeout(function () {
      appendChatMessage('bot', "3 quick questions and I'll send it straight to Scott for a quote.");
      showQuickReplies(['Start quick quote', 'How much does it cost?'], function (choice) {
        if (choice.toLowerCase().indexOf('cost') !== -1) {
          appendChatMessage('bot', "Price depends on size + access. Takes 30 seconds — answer the questions and Scott calls you with a number.");
          setTimeout(function () {
            appendChatMessage('bot', "Ready?");
            showQuickReplies(['Start quick quote', 'Use full quote form'], function (c2) {
              if (c2.indexOf('full') !== -1) {
                closeChat();
                const q = document.getElementById('quote');
                if (q) q.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                beginNameStep();
              }
            });
          }, 650);
        } else {
          beginNameStep();
        }
      });
    }, 620);

    if (chatInput) chatInput.focus();
  }

  function beginNameStep() {
    clearQuickReplies();
    chatStep = 1;
    setTimeout(function () {
      appendChatMessage('bot', "What's your name?");
    }, 140);
    showChatInput();
  }

  function closeChat() {
    if (!chatPanel || !chatFab) return;
    chatPanel.classList.remove('open');
    chatPanel.setAttribute('aria-hidden', 'true');
    chatFab.setAttribute('aria-expanded', 'false');
    chatFab.setAttribute('aria-label', 'Open quick quote chat');
    chatOpen = false;

    // Clean for next open
    setTimeout(resetChatState, 220);
  }

  function toggleChat() {
    if (chatOpen) {
      closeChat();
    } else {
      openChat();
    }
  }

  // Wire up chatbot
  if (chatFab) {
    chatFab.addEventListener('click', toggleChat);
  }
  if (chatClose) {
    chatClose.addEventListener('click', closeChat);
  }
  if (chatSend) {
    chatSend.addEventListener('click', function (e) {
      e.stopPropagation();
      sendCurrentChatInput();
    });
  }
  if (chatInput) {
    chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendCurrentChatInput();
      }
    });
  }

  // Close chat on Escape (when open)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && chatOpen) {
      closeChat();
    }
  });

  // Optional: click outside panel closes (desktop only, ignore fab)
  document.addEventListener('click', function (e) {
    if (!chatOpen || !chatPanel) return;
    if (chatPanel.contains(e.target) || chatFab.contains(e.target)) return;
    // Only on wider screens to avoid fighting mobile taps
    if (window.innerWidth >= 768) {
      closeChat();
    }
  });

  // Keyboard hint: "?" opens chat (nice power-user touch, non-intrusive)
  document.addEventListener('keydown', function (e) {
    if (e.key === '?' && !chatOpen && document.activeElement.tagName === 'BODY') {
      e.preventDefault();
      openChat();
    }
  });

  // Make any in-chat anchor links (e.g. "Use full form" in footer) also close the panel
  if (chatPanel) {
    chatPanel.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function () {
        // let the href scroll happen, then close
        setTimeout(closeChat, 50);
      });
    });
  }

  // Prevent any clicks that originate inside the chat panel (including quick-reply buttons
  // and action buttons that clear their own containers) from reaching the document-level
  // "click outside to close" handler. This fixes the bug where selecting a quick option
  // would immediately close the panel on desktop.
  if (chatPanel) {
    chatPanel.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }

})();
