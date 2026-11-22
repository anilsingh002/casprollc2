/**
 * CASPRO LLC - Interactive Enterprise Scripts
 * Consulting and Services Pro LLC
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initStickyHeader();
  initMobileNav();
  initAnimatedCounters();
  initServiceTabs();
  initProjectEstimator();
  initModalHandling();
  initContactForms();
  initFaqAccordions();
});

/* -------------------------------------------------------------------------- */
/* Theme Management (Dark Mode Enforced)                                      */
/* -------------------------------------------------------------------------- */
function initThemeToggle() {
  document.documentElement.setAttribute('data-theme', 'dark');
  try {
    localStorage.setItem('caspro-theme', 'dark');
  } catch (e) {
    /* storage catch */
  }
}

/* -------------------------------------------------------------------------- */
/* Sticky Navigation Bar on Scroll                                            */
/* -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.header-nav');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* -------------------------------------------------------------------------- */
/* Mobile Drawer Navigation                                                   */
/* -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      toggleBtn.innerHTML = isOpen ? '&times;' : '&#9776;';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        if (toggleBtn) toggleBtn.innerHTML = '&#9776;';
      });
    });
  }
}

/* -------------------------------------------------------------------------- */
/* Animated Metrics Counter                                                   */
/* -------------------------------------------------------------------------- */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseFloat(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';
        const prefix = counter.getAttribute('data-prefix') || '';
        const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
        let count = 0;
        const speed = 2000 / target;

        const updateCount = () => {
          const increment = target / (2000 / 30);
          count += increment;
          if (count < target) {
            counter.innerText = prefix + count.toFixed(decimals) + suffix;
            requestAnimationFrame(updateCount);
          } else {
            counter.innerText = prefix + target.toFixed(decimals) + suffix;
          }
        };

        updateCount();
        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* -------------------------------------------------------------------------- */
/* Filterable Service Matrix                                                  */
/* -------------------------------------------------------------------------- */
function initServiceTabs() {
  const tabBtns = document.querySelectorAll('.service-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card-item');

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* -------------------------------------------------------------------------- */
/* Interactive Project Estimator & ROI Calculator                             */
/* -------------------------------------------------------------------------- */
function initProjectEstimator() {
  const serviceBtns = document.querySelectorAll('.calc-service-btn');
  const tierBtns = document.querySelectorAll('.calc-tier-btn');
  const velocityBtns = document.querySelectorAll('.calc-velocity-btn');
  const durationSlider = document.getElementById('calcDurationSlider');
  const durationDisplay = document.getElementById('calcDurationVal');

  const estTimeVal = document.getElementById('estTimeVal');
  const estTeamVal = document.getElementById('estTeamVal');
  const estSavingsVal = document.getElementById('estSavingsVal');
  const estCostVal = document.getElementById('estCostVal');
  const estRoiVal = document.getElementById('estRoiVal');

  if (!durationSlider) return;

  let selectedServiceMultiplier = 1.2;
  let selectedTierMultiplier = 1.0;
  let selectedVelocityMultiplier = 1.0;
  let months = 3;

  serviceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedServiceMultiplier = parseFloat(btn.getAttribute('data-multiplier') || '1.0');
      recalculate();
    });
  });

  tierBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tierBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedTierMultiplier = parseFloat(btn.getAttribute('data-tier') || '1.0');
      recalculate();
    });
  });

  if (velocityBtns.length) {
    velocityBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        velocityBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedVelocityMultiplier = parseFloat(btn.getAttribute('data-velocity') || '1.0');
        recalculate();
      });
    });
  }

  durationSlider.addEventListener('input', (e) => {
    months = parseInt(e.target.value, 10);
    if (durationDisplay) durationDisplay.innerText = `${months} Month${months > 1 ? 's' : ''}`;
    recalculate();
  });

  function recalculate() {
    const rawWeeks = Math.round((months * 4.2 * selectedTierMultiplier) / selectedVelocityMultiplier);
    const baseWeeks = Math.max(3, rawWeeks);
    const teamSize = Math.max(3, Math.round(3 * selectedTierMultiplier + (selectedServiceMultiplier > 1.3 ? 2 : 1) + (selectedVelocityMultiplier > 1.1 ? 2 : 0)));
    const estimatedSavings = Math.round(38 + (selectedTierMultiplier * 6) + (months > 4 ? 6 : 2));
    const estimatedCostRange = `$${Math.round(15 * months * selectedTierMultiplier * selectedServiceMultiplier)}k - $${Math.round(28 * months * selectedTierMultiplier * selectedServiceMultiplier)}k`;
    const roiMultiplier = (2.4 + (selectedTierMultiplier * 0.4) + (months * 0.15)).toFixed(1);

    if (estTimeVal) estTimeVal.innerText = `${baseWeeks} Weeks (${months} mo)`;
    if (estTeamVal) estTeamVal.innerText = `${teamSize} Senior Engineers`;
    if (estSavingsVal) estSavingsVal.innerText = `~${estimatedSavings}% vs In-House`;
    if (estCostVal) estCostVal.innerText = estimatedCostRange;
    if (estRoiVal) estRoiVal.innerText = `${roiMultiplier}x Estimated ROI`;
  }

  recalculate();
}

/* -------------------------------------------------------------------------- */
/* Modals & Lead Capture                                                      */
/* -------------------------------------------------------------------------- */
function initModalHandling() {
  const modalOverlay = document.getElementById('discoveryModal');
  const openBtns = document.querySelectorAll('.open-discovery-modal');
  const closeBtn = document.getElementById('closeDiscoveryModal');

  if (!modalOverlay) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });
}

/* -------------------------------------------------------------------------- */
/* Contact & Newsletter Forms Submission                                      */
/* -------------------------------------------------------------------------- */
function initContactForms() {
  const contactForm = document.getElementById('contactForm');
  const modalForm = document.getElementById('modalContactForm');
  const newsletterForm = document.getElementById('newsletterForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Transmitting securely...';
      submitBtn.disabled = true;

      // Extract values
      const firstName = contactForm.querySelector('[name="firstName"], #contactFirstName, input[type="text"]')?.value || '';
      const lastName = contactForm.querySelector('[name="lastName"], #contactLastName')?.value || '';
      const email = contactForm.querySelector('[name="email"], #contactEmail, input[type="email"]')?.value || '';
      const phone = contactForm.querySelector('[name="phone"], #contactPhone, input[type="tel"]')?.value || 'Not provided';
      const company = contactForm.querySelector('[name="company"], #contactCompany')?.value || 'Not provided';
      const service = contactForm.querySelector('[name="service"], #contactService, select')?.value || 'General Inquiry';
      const message = contactForm.querySelector('[name="message"], #contactMessage, textarea')?.value || '';

      const fullName = (firstName + ' ' + lastName).trim() || 'Prospective Client';
      const mailSubject = encodeURIComponent(`CASPRO Consulting Inquiry: ${service} - ${company || fullName}`);
      const mailBody = encodeURIComponent(
        `New Inquiry from CASPRO Website:\n\n` +
        `Client Name: ${fullName}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n` +
        `Company: ${company}\n` +
        `Practice: ${service}\n\n` +
        `How We Can Help / Requirements:\n${message}\n\n` +
        `Target SLA: Less than 24 hours`
      );

      // Background submission
      fetch('https://formsubmit.co/ajax/support@casprollc.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New Enterprise Inquiry: ${fullName} (${company})`,
          name: fullName,
          email: email,
          phone: phone,
          company: company,
          service: service,
          requirements: message
        })
      }).catch(() => {});

      // Direct email trigger to support@casprollc.com
      const mailtoUrl = `mailto:support@casprollc.com?subject=${mailSubject}&body=${mailBody}`;
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 300);

      setTimeout(() => {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
        showToast('Inquiry sent to support@casprollc.com! Our Solutions Architect will reach out in less than 24 hours.', 'success');
      }, 1000);
    });
  }

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = modalForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Transmitting securely...';
      submitBtn.disabled = true;

      const name = modalForm.querySelector('[name="name"], #modalName, input[type="text"]')?.value || 'Prospective Client';
      const email = modalForm.querySelector('[name="email"], #modalEmail, input[type="email"]')?.value || '';
      const service = modalForm.querySelector('[name="service"], #modalService, select')?.value || 'Discovery Consultation';
      const message = modalForm.querySelector('[name="message"], #modalMessage, textarea')?.value || '';

      const mailSubject = encodeURIComponent(`CASPRO Discovery Call Request: ${service} - ${name}`);
      const mailBody = encodeURIComponent(
        `Discovery Call Booking Request:\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Area of Interest: ${service}\n` +
        `Project Summary / Questions:\n${message}\n\n` +
        `Target SLA: Less than 24 hours`
      );

      // Background submission
      fetch('https://formsubmit.co/ajax/support@casprollc.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Discovery Call Request: ${name} (${service})`,
          name: name,
          email: email,
          area_of_interest: service,
          project_summary: message
        })
      }).catch(() => {});

      // Direct email trigger to support@casprollc.com
      const mailtoUrl = `mailto:support@casprollc.com?subject=${mailSubject}&body=${mailBody}`;
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 300);

      setTimeout(() => {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        modalForm.reset();
        const modal = document.getElementById('discoveryModal');
        if (modal) modal.classList.remove('active');
        showToast('Discovery Call Request sent to support@casprollc.com! We will confirm your calendar invitation shortly.', 'success');
      }, 1000);
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterForm.reset();
      showToast('Subscribed to CASPRO Enterprise Tech Insights.', 'success');
    });
  }
}

/* -------------------------------------------------------------------------- */
/* FAQ Accordions                                                             */
/* -------------------------------------------------------------------------- */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-question');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* Toast System                                                               */
/* -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';

  let iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>`;
  if (type === 'success') {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  }

  toast.innerHTML = `${iconSvg} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}
