(function () {
  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scenes = Array.from(document.querySelectorAll('.scene'));
  const leftTabs = Array.from(document.querySelectorAll('.tab-nav a'));
  const topLinks = Array.from(document.querySelectorAll('.top-nav a'));
  const progressFill = document.querySelector('.scene-progress-fill');
  const reactionAvatar = document.getElementById('reactionAvatar');
  const reactionCaption = document.getElementById('reactionCaption');
  const publicConfig = window.PORTFOLIO_CONFIG || {};

  function clean(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  const config = {
    displayName: clean(publicConfig.displayName),
    siteTitle: clean(publicConfig.siteTitle),
    siteDescription: clean(publicConfig.siteDescription),
    githubUrl: clean(publicConfig.githubUrl),
    linkedinUrl: clean(publicConfig.linkedinUrl),
    contactEmail: clean(publicConfig.contactEmail),
    contactPhone: clean(publicConfig.contactPhone),
    contactFormEndpoint: clean(publicConfig.contactFormEndpoint),
    contactFormMethod: clean(publicConfig.contactFormMethod) || 'post'
  };

  config.emailHref = config.contactEmail ? `mailto:${config.contactEmail}` : '';
  config.phoneHref = config.contactPhone ? `tel:${config.contactPhone.replace(/[^\d+]/g, '')}` : '';

  function setNameHeading(element, name) {
    if (!element || !name) return;
    const parts = name.split(/\s+/).filter(Boolean);
    element.textContent = '';
    parts.forEach((part, index) => {
      if (index) element.appendChild(document.createElement('br'));
      element.appendChild(document.createTextNode(part));
    });
  }

  function setConfiguredHref(anchor, href) {
    if (!anchor) return;
    if (!href) {
      anchor.classList.add('is-config-missing');
      anchor.setAttribute('aria-disabled', 'true');
      anchor.setAttribute('tabindex', '-1');
      anchor.removeAttribute('href');
      return;
    }
    anchor.href = href;
    anchor.classList.remove('is-config-missing');
    anchor.removeAttribute('aria-disabled');
    anchor.removeAttribute('tabindex');
    if (!/^https?:\/\//i.test(href)) {
      anchor.removeAttribute('target');
      anchor.removeAttribute('rel');
    }
  }

  function applyPublicConfig() {
    if (config.siteTitle) document.title = config.siteTitle;
    const metaDescription = document.querySelector('[data-config-meta="siteDescription"]');
    if (metaDescription && config.siteDescription) {
      metaDescription.setAttribute('content', config.siteDescription);
    }

    setNameHeading(document.querySelector('[data-config-name]'), config.displayName);

    document.querySelectorAll('[data-config-text]').forEach((element) => {
      const key = element.dataset.configText;
      const value = clean(config[key]);
      if (value) element.textContent = value;
    });

    document.querySelectorAll('[data-config-href]').forEach((anchor) => {
      setConfiguredHref(anchor, clean(config[anchor.dataset.configHref]));
    });

    document.querySelectorAll('[data-config-required]').forEach((element) => {
      const value = clean(config[element.dataset.configRequired]);
      element.classList.toggle('is-config-missing', !value);
    });

    const contactForm = document.querySelector('[data-config-form]');
    if (contactForm) {
      if (config.contactFormEndpoint) {
        contactForm.action = config.contactFormEndpoint;
        contactForm.method = config.contactFormMethod;
      } else {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.setAttribute('title', 'Set PUBLIC_CONTACT_FORM_ENDPOINT to enable this form.');
        }
        contactForm.addEventListener('submit', (event) => event.preventDefault());
      }
    }
  }

  applyPublicConfig();

  const navMap = {
    home: 'home',
    journey: 'about',
    toolkit: 'skills',
    projects: 'projects',
    sketchbook: 'sketchbook',
    experience: 'experience',
    'experience-timeline': 'experience',
    education: 'education',
    about: 'about',
    contact: 'contact'
  };

  function setProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height <= 0 ? 0 : (scrollTop / height) * 100;
    root.style.setProperty('--progress', progress.toFixed(2) + '%');
  }

  function setActiveScene(section) {
    if (!section) return;
    const id = section.id;
    const scene = section.dataset.scene || id;
    body.dataset.scene = scene;

    const activeTarget = navMap[id] || id;
    leftTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.target === activeTarget));
    topLinks.forEach((link) => {
      const target = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', target === id || target === activeTarget);
    });

    const avatarSrc = section.dataset.avatar;
    const caption = section.dataset.caption;
    if (reactionAvatar && avatarSrc && !reactionAvatar.src.endsWith(avatarSrc)) {
      reactionAvatar.style.opacity = '0';
      reactionAvatar.style.transform = 'scale(0.96) rotate(-2deg)';
      window.setTimeout(() => {
        reactionAvatar.src = avatarSrc;
        reactionAvatar.style.opacity = '1';
        reactionAvatar.style.transform = 'scale(1) rotate(0deg)';
      }, reduceMotion ? 0 : 160);
    }
    if (reactionCaption && caption) reactionCaption.textContent = caption;
  }

  const sceneObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActiveScene(visible.target);
  }, {
    root: null,
    threshold: [0.28, 0.42, 0.62]
  });

  scenes.forEach((section) => sceneObserver.observe(section));

  const revealTargets = [
    ...document.querySelectorAll('.reveal'),
    ...document.querySelectorAll('.reveal-grid > *')
  ];

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -8% 0px'
  });

  revealTargets.forEach((item) => revealObserver.observe(item));

  if (!reduceMotion) {
    window.addEventListener('pointermove', (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      root.style.setProperty('--cursor-x', x.toFixed(4));
      root.style.setProperty('--cursor-y', y.toFixed(4));
    }, { passive: true });

    document.querySelectorAll('[data-tilt-card]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((centerY - y) / centerY) * 3.5;
        const rotateY = ((x - centerX) / centerX) * 3.5;
        card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  leftTabs.concat(topLinks).forEach((link) => {
    link.addEventListener('click', () => {
      leftTabs.concat(topLinks).forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  window.addEventListener('scroll', setProgress, { passive: true });
  window.addEventListener('resize', setProgress, { passive: true });
  setProgress();
  setActiveScene(document.getElementById('home'));
})();
