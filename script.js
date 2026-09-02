(() => {
  document.body.classList.add('js-ready');

  const q = (selector, scope = document) => scope.querySelector(selector);
  const qa = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = q('#site-header');
  const progress = q('#scroll-progress');
  const menuToggle = q('.menu-toggle');
  const mobileNav = q('#mobile-nav');
  const heroBackdrop = q('.hero-backdrop');
  const chwStage = q('#chw-stage');
  const chwFrame = q('.chw-stage-frame');
  const chwImage = q('#chw-stage-image');
  const chwStageIndex = q('#chw-stage-index');
  const chwStageCode = q('#chw-stage-code');
  const chwStageStatus = q('#chw-stage-status');
  const chwStageKicker = q('#chw-stage-kicker');
  const chwStageTitle = q('#chw-stage-title');
  const chwStageTraits = q('#chw-stage-traits');
  const chwStageProgress = q('.chw-stage-progress span');
  const chwBeats = qa('.chw-beat');
  const drawer = q('#gene-drawer');
  const drawerBackdrop = q('#drawer-backdrop');
  const drawerClose = q('.drawer-close');
  const drawerImage = q('#drawer-image');
  const drawerTitle = q('#drawer-title');
  const drawerCode = q('#drawer-code');
  const drawerLevel = q('#drawer-level');
  const drawerTraits = q('#drawer-traits');
  const drawerLineage = q('#drawer-lineage');
  const drawerStatus = q('#drawer-status');
  const drawerImageStatus = q('#drawer-image-status');
  const drawerPhotoStatus = q('#drawer-photo-status');
  const drawerNote = q('#drawer-note');
  const drawerSource = q('#drawer-source');
  const toast = q('#toast');
  const inquiryForm = q('#inquire-form');
  const formSuccess = q('#form-success');
  let toastTimer;
  const swapTimers = new WeakMap();
  let scrollFrame;
  let pointerFrame;
  let pointerX = 0;
  let pointerY = 0;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
  };

  const closeMobileNav = () => {
    menuToggle?.classList.remove('is-open');
    mobileNav?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    mobileNav?.setAttribute('aria-hidden', 'true');
  };
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.classList.toggle('is-open');
    mobileNav?.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    mobileNav?.setAttribute('aria-hidden', String(!open));
  });

  const updateScrollUI = () => {
    scrollFrame = null;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (progress) progress.style.width = `${ratio * 100}%`;
    header?.classList.toggle('is-scrolled', window.scrollY > 18);
    if (heroBackdrop && !reducedMotion && window.scrollY < window.innerHeight * 1.1) {
      heroBackdrop.style.setProperty('--hero-shift', `${window.scrollY * 0.065}px`);
    }
  };
  const requestScrollUI = () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollUI);
  };
  window.addEventListener('scroll', requestScrollUI, { passive: true });
  updateScrollUI();

  if (!reducedMotion && window.matchMedia('(pointer: fine)').matches && heroBackdrop) {
    window.addEventListener('pointermove', (event) => {
      pointerX = ((event.clientX / window.innerWidth) - .5) * 7;
      pointerY = ((event.clientY / window.innerHeight) - .5) * 5;
      if (!pointerFrame) {
        pointerFrame = window.requestAnimationFrame(() => {
          pointerFrame = null;
          heroBackdrop.style.setProperty('--mouse-x', `${pointerX}px`);
          heroBackdrop.style.setProperty('--mouse-y', `${pointerY}px`);
        });
      }
    }, { passive: true });
    window.addEventListener('pointerleave', () => {
      heroBackdrop.style.setProperty('--mouse-x', '0px');
      heroBackdrop.style.setProperty('--mouse-y', '0px');
    });
  }

  // Reveal-on-scroll, with a visible no-JS fallback in CSS.
  const revealItems = qa('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-in'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .13, rootMargin: '0px 0px -8% 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
    window.setTimeout(() => qa('.hero .reveal').forEach((item) => item.classList.add('is-in')), 120);
  }

  const swapImage = (image, src, alt, animate = true, fallback = '') => {
    if (!image || !src) return;
    window.clearTimeout(swapTimers.get(image));
    swapTimers.delete(image);
    if (image.getAttribute('src') === src) {
      image.alt = alt || image.alt;
      if (animate && !reducedMotion) {
        image.classList.add('is-changing');
        const sameImageTimer = window.setTimeout(() => image.classList.remove('is-changing'), 520);
        swapTimers.set(image, sameImageTimer);
      } else {
        image.classList.remove('is-changing');
      }
      return;
    }
    if (animate && !reducedMotion) image.classList.add('is-changing');
    const timer = window.setTimeout(() => {
      image.alt = alt || '';
      image.onload = () => image.classList.remove('is-changing');
      image.onerror = () => {
        image.classList.remove('is-changing');
        image.onerror = null;
        if (fallback && image.getAttribute('src') !== fallback) image.src = fallback;
      };
      image.src = src;
      window.setTimeout(() => image.classList.remove('is-changing'), 760);
    }, animate && !reducedMotion ? 170 : 0);
    swapTimers.set(image, timer);
  };

  const updateChwStage = (beat, index = chwBeats.indexOf(beat), animate = true) => {
    if (!beat || !chwFrame) return;
    const safeIndex = Math.max(0, index);
    chwBeats.forEach((item) => item.classList.toggle('is-active', item === beat));
    chwFrame.dataset.chapter = beat.dataset.chapter || 'origin';
    if (chwStageIndex) chwStageIndex.textContent = `${String(safeIndex + 1).padStart(2, '0')} / 03`;
    if (chwStageCode) chwStageCode.textContent = beat.dataset.code || '';
    if (chwStageStatus) chwStageStatus.textContent = beat.dataset.status || '';
    if (chwStageKicker) chwStageKicker.textContent = beat.dataset.kicker || '';
    if (chwStageTitle) chwStageTitle.textContent = beat.dataset.title || '';
    if (chwStageTraits) chwStageTraits.textContent = beat.dataset.traits || '';
    if (chwStageProgress) chwStageProgress.style.top = `${safeIndex * 33.333}%`;
    swapImage(chwImage, beat.dataset.image, beat.dataset.alt, animate);
  };

  const openDrawerData = (data) => {
    if (!drawer || !data) return;
    if (drawerImage) {
      drawerImage.src = data.image || '';
      drawerImage.alt = data.alt || '';
      drawerImage.style.objectPosition = data.imagePosition || 'center 50%';
      drawerImage.onerror = () => {
        drawerImage.onerror = null;
        if (data.fallback && drawerImage.getAttribute('src') !== data.fallback) drawerImage.src = data.fallback;
      };
    }
    if (drawerTitle) drawerTitle.textContent = data.title || '';
    if (drawerCode) drawerCode.textContent = data.code || '';
    if (drawerLevel) drawerLevel.textContent = data.kicker || data.tier || '';
    if (drawerTraits) drawerTraits.textContent = data.traits || '';
    if (drawerLineage) drawerLineage.textContent = data.lineage || 'LUKA LINE / PROFILE ARCHIVE';
    if (drawerStatus) drawerStatus.textContent = data.status || '';
    if (drawerImageStatus) drawerImageStatus.textContent = data.imageTag || data.photoStatus || (data.image?.includes('chw-purple') ? 'CHW / SIGNATURE LINE' : 'LUKA VISUAL / LINE PROFILE');
    if (drawerPhotoStatus) drawerPhotoStatus.textContent = data.photoStatus || (data.image?.includes('chw-purple') ? 'CHW / SIGNATURE VISUAL' : 'LUKA LINE / VISUAL PROFILE');
    if (drawerNote) drawerNote.textContent = data.description || (data.image?.includes('chw-purple')
      ? 'CHW 主视觉 · LUKA 核心项目。'
      : `${data.title || 'LUKA'} 以色泽、结构与成长轨迹，建立可持续阅读的主线档案。`);
    if (drawerSource) {
      const hasSource = Boolean(data.source);
      drawerSource.hidden = !hasSource;
      if (hasSource) {
        drawerSource.href = data.source;
        drawerSource.textContent = data.sourceLabel || '查看 X 原帖';
      }
    }
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    drawerBackdrop?.classList.add('is-visible');
    drawerBackdrop?.setAttribute('aria-hidden', 'false');
    body.classList.add('drawer-open');
    drawerClose?.focus();
  };
  const openDrawer = (beat) => openDrawerData(beat?.dataset);
  const closeDrawer = () => {
    drawer?.classList.remove('is-open');
    drawer?.setAttribute('aria-hidden', 'true');
    drawerBackdrop?.classList.remove('is-visible');
    drawerBackdrop?.setAttribute('aria-hidden', 'true');
    body.classList.remove('drawer-open');
  };

  const stageObserver = ('IntersectionObserver' in window && !reducedMotion)
    ? new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) updateChwStage(visible.target);
    }, { threshold: [.15, .35, .6], rootMargin: '-30% 0px -45% 0px' })
    : null;
  chwBeats.forEach((beat, index) => {
    stageObserver?.observe(beat);
    beat.addEventListener('click', (event) => {
      if (event.target.closest('button')) return;
      updateChwStage(beat, index);
    });
    beat.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        updateChwStage(beat, index);
      }
    });
    beat.querySelector('.beat-link')?.addEventListener('click', (event) => {
      event.stopPropagation();
      updateChwStage(beat, index, false);
      openDrawer(beat);
    });
  });
  updateChwStage(chwBeats[0], 0, false);

  // Gene line image data. Each line keeps a distinct visual language,
  // palette and archive code for the interactive product-page sequence.
  const linePhoto = (title, image, traits, profile, code, tier, description, lineage, source, sourceLabel, alt, fallback = '', imagePosition = 'center 43%') => ({
    title,
    tier,
    code,
    traits,
    profile,
    status: 'ACTIVE',
    description,
    image,
    alt: alt || `${title} 主线视觉`,
    lineage,
    source,
    sourceLabel: sourceLabel || '查看 X 原帖',
    fallback,
    imagePosition,
    photoState: 'active',
    photoStatus: `${title.toUpperCase()} / VISUAL PROFILE`,
    imageTag: `${title.toUpperCase()} / SIGNATURE LINE`,
  });
  const lineData = {
    sable: linePhoto('Sable', 'assets/references/x/sable.jpg', '深烟棕底色 / 奶油背线 / 低饱和层次', '底色与背线档案', 'LK–SBL–01', 'CORE LINE', '以深烟棕收束光线，奶油背线沿轮廓展开。底色的均匀度、背线的连续性与静息时的低饱和层次，共同构成 Sable 的识别秩序。', 'LUKA SABLE LINE / PROFILE ARCHIVE', '', '', 'Sable 深烟棕底色与奶油背线', 'assets/gene-sable-pending.svg', 'center 47%'),
    'sable-lily': linePhoto('Sable Lily', 'assets/references/x/sable-lily.jpg', '深烟棕底色 / Lily 白覆盖 / 边缘结构', '覆盖率与边缘档案', 'LK–SBL-L–02', 'LIMITED LINE', '深烟棕的沉静，与 Lily 的明亮留白相遇，形成由深至浅的连续构图。白覆盖的起止、边缘净度与成长后的视觉平衡，定义这条复合主线的节奏。', 'LUKA SABLE LILY LINE / PROFILE ARCHIVE', '', '', 'Sable Lily 深色底与 Lily 白覆盖', 'assets/gene-sable-lily-pending.svg', 'center 48%'),
    lily: linePhoto('Lily', 'assets/references/x/lily.jpg', '珍珠白覆盖 / 暖色基底 / 背线留白', '留白与覆盖率档案', 'LK–LIL–03', 'SIGNATURE LINE', '大面积珍珠白建立明度，暖色底层从留白之间透出，背线像被光刻出。覆盖率、边缘过渡与成长后的稳定观感，构成 Lily 的光感档案。', 'LUKA LILY LINE / PROFILE ARCHIVE', '', '', 'Lily 珍珠白覆盖与暖色基底', 'assets/gene-lily-pending.svg', 'center 50%'),
    ax: linePhoto('Ax', 'assets/references/x/ax.jpg', '银灰底色 / 石墨层次 / 冷调灰阶', '色谱与灰阶档案', 'LK–AX–04', 'FOUNDATION LINE', '色彩收束于银灰与石墨之间，冷暖平衡留下一条克制而清晰的灰阶。底色干净度与纹理对比，构成 Ax 的冷调识别。', 'LUKA AX LINE / PROFILE ARCHIVE', '', '', 'Ax 银灰底色与石墨层次', 'assets/gene-ax-pending.svg', 'center 43%'),
    'ax-lily': linePhoto('Ax Lily', 'assets/references/x/ax-lily.jpg', '石墨底色 / 珍珠白覆盖 / 高对比结构', '复合表现与结构档案', 'LK–AX-L–05', 'RARE COMBINATION', 'Ax 的冷静灰阶承接 Lily 的明亮覆盖，明暗交界成为复合主线的视觉核心。背线连续性、白覆盖边缘与整体对比度，在成长中持续重塑平衡。', 'LUKA AX LILY LINE / PROFILE ARCHIVE', '', '', 'Ax Lily 石墨底色与珍珠白覆盖', 'assets/gene-ax-lily-pending.svg', 'center 50%'),
  };
  const lineImage = q('#line-image');
  const lineImageTag = q('#line-image-tag');
  const lineTier = q('#line-tier');
  const lineCode = q('#line-code');
  const lineTitle = q('#line-title');
  const lineTraits = q('#line-traits');
  const lineDescription = q('#line-description');
  const lineProfile = q('#line-profile');
  const lineStatus = q('#line-status');
  const linePhotoStatus = q('#line-photo-status');
  const lineSource = q('#line-source');
  const linePanel = q('#line-panel');
  const lineTabs = qa('.line-tab');
  let activeLine = 'sable';
  const updateLine = (key, animate = true) => {
    const data = lineData[key];
    if (!data) return;
    activeLine = key;
    lineTabs.forEach((tab) => {
      const active = tab.dataset.line === key;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    if (lineTier) lineTier.textContent = data.tier;
    if (lineCode) lineCode.textContent = data.code;
    if (lineTitle) lineTitle.textContent = data.title;
    if (lineTraits) lineTraits.textContent = data.traits;
    if (lineDescription) lineDescription.textContent = data.description;
    if (lineProfile) lineProfile.textContent = data.profile;
    if (lineStatus) lineStatus.textContent = data.status;
    if (linePhotoStatus) linePhotoStatus.textContent = data.photoStatus || 'LUKA LINE / VISUAL PROFILE';
    if (lineImageTag) lineImageTag.textContent = data.imageTag || 'LUKA VISUAL / LINE PROFILE';
    if (linePanel) {
      linePanel.dataset.photoState = data.photoState || 'active';
      linePanel.dataset.imagePosition = data.imagePosition || 'center 43%';
    }
    if (lineSource) lineSource.hidden = true;
    if (lineImage) lineImage.style.objectPosition = data.imagePosition || 'center 43%';
    swapImage(lineImage, data.image, data.alt, animate, data.fallback);
  };
  lineTabs.forEach((tab) => tab.addEventListener('click', () => updateLine(tab.dataset.line)));
  q('#line-profile-button')?.addEventListener('click', () => openDrawerData(lineData[activeLine]));
  updateLine(activeLine, false);

  // Count-up numbers animate only once when the record enters the viewport.
  const countItems = qa('[data-count]');
  const animateCount = (element) => {
    const target = Number(element.dataset.count || 0);
    if (reducedMotion) { element.textContent = String(target); return; }
    const start = performance.now();
    const duration = 980;
    const tick = (now) => {
      const progressValue = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      element.textContent = String(Math.round(target * eased));
      if (progressValue < 1) window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && !reducedMotion) {
    const metricObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { animateCount(entry.target); observer.unobserve(entry.target); }
      });
    }, { threshold: .65 });
    countItems.forEach((item) => metricObserver.observe(item));
  } else countItems.forEach((item) => animateCount(item));

  drawerClose?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeDrawer(); closeMobileNav(); } });
  document.querySelector('.drawer-cta')?.addEventListener('click', closeDrawer);
  qa('[data-toast]').forEach((button) => button.addEventListener('click', () => showToast(button.dataset.toast || '已保存')));
  inquiryForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    formSuccess?.classList.add('is-visible');
    showToast('预约已送达 · Luka 会在 48 小时内联系你');
    inquiryForm.reset();
  });
  qa('a[href^="#"]').forEach((link) => link.addEventListener('click', () => { closeMobileNav(); if (drawer?.classList.contains('is-open')) closeDrawer(); }));
})();
