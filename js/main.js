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

  function createSketchSoundboard() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    function isMuted() {
      try {
        return window.localStorage?.getItem('portfolioSoundMuted') === 'true';
      } catch {
        return false;
      }
    }
    let audioContext = null;
    let unlocked = false;
    const lastPlayed = new Map();
    const throttle = {
      pencilTap: 90,
      paperRustle: 180,
      pageFlick: 520,
      markerSqueak: 480,
      tapePop: 300
    };

    function getContext() {
      if (!AudioContextClass || isMuted()) return null;
      if (!audioContext) audioContext = new AudioContextClass();
      return audioContext;
    }

    function unlock() {
      const context = getContext();
      if (!context) return;
      context.resume?.();
      unlocked = true;
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    }

    function canPlay(type) {
      if (!unlocked || document.hidden || isMuted()) return false;
      const now = performance.now();
      const wait = throttle[type] || 120;
      if (now - (lastPlayed.get(type) || 0) < wait) return false;
      lastPlayed.set(type, now);
      return true;
    }

    function envelope(gain, start, peak, attack, release) {
      gain.gain.cancelScheduledValues(start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(peak, start + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + release);
    }

    function noiseSource(context, duration) {
      const sampleCount = Math.max(1, Math.floor(context.sampleRate * duration));
      const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < sampleCount; i += 1) {
        data[i] = Math.random() * 2 - 1;
      }
      const source = context.createBufferSource();
      source.buffer = buffer;
      return source;
    }

    function playPencilTap(context) {
      const start = context.currentTime;
      const gain = context.createGain();
      const filter = context.createBiquadFilter();
      const click = noiseSource(context, 0.04);
      const knock = context.createOscillator();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1850, start);
      filter.Q.setValueAtTime(1.2, start);
      envelope(gain, start, 0.028, 0.003, 0.052);

      knock.type = 'triangle';
      knock.frequency.setValueAtTime(740, start);
      knock.frequency.exponentialRampToValueAtTime(260, start + 0.045);

      click.connect(filter);
      filter.connect(gain);
      knock.connect(gain);
      gain.connect(context.destination);
      click.start(start);
      knock.start(start);
      click.stop(start + 0.045);
      knock.stop(start + 0.06);
    }

    function playPaperRustle(context) {
      const start = context.currentTime;
      const gain = context.createGain();
      const filter = context.createBiquadFilter();
      const rustle = noiseSource(context, 0.15);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(950, start);
      filter.frequency.linearRampToValueAtTime(1650, start + 0.08);
      filter.Q.setValueAtTime(0.7, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.018, start + 0.025);
      gain.gain.linearRampToValueAtTime(0.006, start + 0.075);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.15);

      rustle.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      rustle.start(start);
      rustle.stop(start + 0.15);
    }

    function playPageFlick(context) {
      const start = context.currentTime;
      const gain = context.createGain();
      const filter = context.createBiquadFilter();
      const flick = noiseSource(context, 0.2);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(420, start);
      filter.frequency.exponentialRampToValueAtTime(2100, start + 0.16);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.026, start + 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.19);

      flick.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      flick.start(start);
      flick.stop(start + 0.2);
    }

    function playMarkerSqueak(context) {
      const start = context.currentTime;
      const gain = context.createGain();
      const tone = context.createOscillator();
      const filter = context.createBiquadFilter();

      tone.type = 'sawtooth';
      tone.frequency.setValueAtTime(760, start);
      tone.frequency.linearRampToValueAtTime(1080, start + 0.045);
      tone.frequency.linearRampToValueAtTime(690, start + 0.075);
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(980, start);
      filter.Q.setValueAtTime(7, start);
      envelope(gain, start, 0.012, 0.012, 0.075);

      tone.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      tone.start(start);
      tone.stop(start + 0.095);
    }

    function playTapePop(context) {
      const start = context.currentTime;
      const gain = context.createGain();
      const pop = context.createOscillator();
      const peel = noiseSource(context, 0.075);
      const filter = context.createBiquadFilter();

      pop.type = 'sine';
      pop.frequency.setValueAtTime(180, start);
      pop.frequency.exponentialRampToValueAtTime(84, start + 0.055);
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, start);
      envelope(gain, start, 0.022, 0.006, 0.075);

      pop.connect(gain);
      peel.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      pop.start(start);
      peel.start(start + 0.012);
      pop.stop(start + 0.085);
      peel.stop(start + 0.09);
    }

    function play(type) {
      if (!canPlay(type)) return;
      const context = getContext();
      if (!context) return;
      const sounds = {
        pencilTap: playPencilTap,
        paperRustle: playPaperRustle,
        pageFlick: playPageFlick,
        markerSqueak: playMarkerSqueak,
        tapePop: playTapePop
      };
      sounds[type]?.(context);
    }

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });

    return { play, unlock };
  }

  const sketchSounds = createSketchSoundboard();

  function bindInteractionSound(elements, soundName) {
    const uniqueElements = Array.from(new Set(elements)).filter(Boolean);
    uniqueElements.forEach((element) => {
      element.addEventListener('pointerenter', () => sketchSounds.play(soundName), { passive: true });
      element.addEventListener('focus', () => sketchSounds.play(soundName));
    });
  }

  const navMap = {
    home: 'home',
    journey: 'journey',
    toolkit: 'skills',
    projects: 'projects',
    sketchbook: 'sketchbook',
    experience: 'experience',
    'experience-timeline': 'experience',
    education: 'education',
    about: 'about',
    contact: 'contact'
  };
  let activeSceneId = '';

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
    const sceneChanged = activeSceneId && activeSceneId !== id;
    activeSceneId = id;
    body.dataset.scene = scene;
    if (sceneChanged) sketchSounds.play('pageFlick');

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

  function getCurrentScene() {
    if (!scenes.length) return null;
    const referenceY = Math.min(window.innerHeight * 0.38, 320);
    let current = scenes[0];
    let closestDistance = Infinity;

    scenes.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= referenceY && rect.bottom > referenceY) {
        current = section;
        closestDistance = 0;
        return;
      }

      if (closestDistance !== 0) {
        const distance = Math.min(Math.abs(rect.top - referenceY), Math.abs(rect.bottom - referenceY));
        if (distance < closestDistance) {
          closestDistance = distance;
          current = section;
        }
      }
    });

    return current;
  }

  let activeSceneFrame = 0;
  function updateActiveScene() {
    if (activeSceneFrame) return;
    activeSceneFrame = window.requestAnimationFrame(() => {
      activeSceneFrame = 0;
      setActiveScene(getCurrentScene());
    });
  }

  const sceneObserver = new IntersectionObserver(() => updateActiveScene(), {
    root: null,
    threshold: [0, 0.18, 0.38, 0.62, 1]
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

  bindInteractionSound([
    ...leftTabs,
    ...topLinks,
    ...document.querySelectorAll('.btn:not(.btn-primary), .top-socials a, .blue-link, .project-more-link, .sketchbook-action, .contact-list a')
  ], 'pencilTap');

  bindInteractionSound([
    ...document.querySelectorAll('[data-tilt-card]:not(.hero-stage):not(.notebook-page)'),
    ...document.querySelectorAll('.stat-card, .about-card, .contact-form')
  ], 'paperRustle');

  bindInteractionSound(document.querySelectorAll('.btn-primary'), 'markerSqueak');
  bindInteractionSound(document.querySelectorAll('.notebook-page, .tape'), 'tapePop');

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
      sketchSounds.play('pageFlick');
      leftTabs.concat(topLinks).forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  window.addEventListener('scroll', () => {
    setProgress();
    updateActiveScene();
  }, { passive: true });
  window.addEventListener('resize', () => {
    setProgress();
    updateActiveScene();
  }, { passive: true });
  setProgress();
  updateActiveScene();
})();
