(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const videos = [...document.querySelectorAll('video')];
  const applyMotionPreference = () => {
    for (const video of videos) {
      if (reducedMotion.matches) {
        video.removeAttribute('autoplay');
        video.pause();
        video.controls = true;
      } else {
        video.autoplay = true;
        video.controls = false;
        video.play().catch(() => {});
      }
    }
  };
  applyMotionPreference();
  reducedMotion.addEventListener('change', applyMotionPreference);

  // The thumbnail remains in place while the full image opens above the story.
  const viewer = document.querySelector('.media-lightbox');
  const photoTriggers = [...document.querySelectorAll('[data-photo-index]')];
  const photoControls = viewer.querySelector('.photo-controls');
  const previousPhoto = viewer.querySelector('.photo-previous');
  const nextPhoto = viewer.querySelector('.photo-next');
  let photoIndex = -1;
  let activeTrigger = null;
  let pageOverflow = '';
  const closeViewer = () => {
    viewer.close();
    document.documentElement.style.overflowY = pageOverflow;
    activeTrigger?.focus({ preventScroll: true });
  };
  const displayImage = source => {
      const fullImage = new Image();
      fullImage.src = source.currentSrc || source.src;
      fullImage.alt = source.alt;
      fullImage.width = source.naturalWidth || source.width;
      fullImage.height = source.naturalHeight || source.height;
      viewer.querySelector('.viewer-image').replaceChildren(fullImage);
      viewer.querySelector('.viewer-caption p').textContent = source.alt;
      viewer.querySelector('.viewer-caption a').href = fullImage.src;
  };
  const showPhoto = index => {
    if (index < 0 || index >= photoTriggers.length) return;
    photoIndex = index;
    displayImage(photoTriggers[index].querySelector('img'));
    viewer.querySelector('.photo-position').textContent = `${String(index + 1).padStart(2, '0')} / ${String(photoTriggers.length).padStart(2, '0')}`;
    previousPhoto.disabled = index === 0;
    nextPhoto.disabled = index === photoTriggers.length - 1;
  };
  for (const trigger of document.querySelectorAll('.media-open')) {
    trigger.addEventListener('click', () => {
      const source = trigger.querySelector('img');
      if (!source) return;
      activeTrigger = trigger;
      const isPhoto = trigger.hasAttribute('data-photo-index');
      viewer.classList.toggle('photo-mode', isPhoto);
      photoControls.hidden = !isPhoto;
      if (isPhoto) showPhoto(Number(trigger.dataset.photoIndex));
      else {
        photoIndex = -1;
        displayImage(source);
      }
      pageOverflow = document.documentElement.style.overflowY;
      document.documentElement.style.overflowY = 'hidden';
      viewer.showModal();
    });
  }
  viewer.querySelector('.viewer-close').addEventListener('click', closeViewer);
  viewer.addEventListener('click', event => {
    if (event.target === viewer) closeViewer();
  });
  viewer.addEventListener('cancel', event => {
    event.preventDefault();
    closeViewer();
  });
  previousPhoto.addEventListener('click', () => showPhoto(photoIndex - 1));
  nextPhoto.addEventListener('click', () => showPhoto(photoIndex + 1));
  viewer.addEventListener('keydown', event => {
    if (!viewer.classList.contains('photo-mode')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(photoIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  let touchStart = null;
  viewer.querySelector('.viewer-image').addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' && photoIndex >= 0) touchStart = { x: event.clientX, y: event.clientY };
  });
  viewer.querySelector('.viewer-image').addEventListener('pointerup', event => {
    if (!touchStart) return;
    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 50 && Math.abs(dy) < 80) showPhoto(photoIndex + (dx < 0 ? 1 : -1));
  });
  viewer.querySelector('.viewer-image').addEventListener('pointercancel', () => { touchStart = null; });

  if (document.querySelector('.photography')) {
    const sizeGallery = () => document.documentElement.style.setProperty('--gallery-width', `${document.documentElement.clientWidth}px`);
    sizeGallery();
    window.addEventListener('resize', sizeGallery, { passive: true });
  }

  const companion = document.querySelector('.hero-companion');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (companion) {
    let frame = 0;
    let x = 0;
    let y = 0;
    companion.addEventListener('pointermove', event => {
      if (reducedMotion.matches || !finePointer.matches) return;
      const bounds = companion.getBoundingClientRect();
      x = (event.clientX - bounds.left) / bounds.width - .5;
      y = (event.clientY - bounds.top) / bounds.height - .5;
      if (!frame) frame = requestAnimationFrame(() => {
        companion.style.setProperty('--turn', `${x * 9}deg`);
        companion.style.setProperty('--lift', `${y * 10 - 4}px`);
        frame = 0;
      });
    });
    const resetCompanion = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      companion.style.setProperty('--turn', '0deg');
      companion.style.setProperty('--lift', '0px');
    };
    companion.addEventListener('pointerleave', resetCompanion);
    reducedMotion.addEventListener('change', resetCompanion);
  }
})();
