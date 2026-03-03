(() => {
  const isShortsPage = () => location.pathname.startsWith('/shorts');

  const stop = (event) => {
    if (!isShortsPage()) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
  };

  // ホイールスクロールを無効化
  window.addEventListener('wheel', stop, { capture: true, passive: false });

  // タッチスワイプを無効化（モバイル）
  window.addEventListener('touchmove', stop, { capture: true, passive: false });

  // キー操作での移動を無効化
  const blockedKeys = new Set([
    'ArrowUp',
    'ArrowDown',
    'PageUp',
    'PageDown',
    'Space',
    ' ',
    'j',
    'k'
  ]);

  window.addEventListener(
    'keydown',
    (event) => {
      if (!isShortsPage()) return;
      if (blockedKeys.has(event.key)) stop(event);
    },
    { capture: true }
  );

  // Shorts の上下ナビゲーションボタンを無効化
  const disableNavButtons = () => {
    if (!isShortsPage()) return;

    const selectors = [
      '#navigation-button-up',
      '#navigation-button-down',
      '.navigation-container.style-scope.ytd-shorts',
      'button[aria-label="前の動画"]',
      'button[aria-label="次の動画"]'
    ];

    for (const selector of selectors) {
      document.querySelectorAll(selector).forEach((el) => {
        el.style.pointerEvents = 'none';
        el.style.visibility = 'hidden';
      });
    }
  };

  // 念のため、クリックイベントを握りつぶす
  window.addEventListener(
    'click',
    (event) => {
      if (!isShortsPage()) return;
      const t = event.target;
      if (!(t instanceof Element)) return;

      const hit = t.closest(
        '#navigation-button-up, #navigation-button-down, button[aria-label="前の動画"], button[aria-label="次の動画"]'
      );
      if (hit) stop(event);
    },
    { capture: true }
  );

  // スクロール自体をロック
  const lockScroll = () => {
    if (!isShortsPage()) {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      return;
    }

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    disableNavButtons();
  };

  const observer = new MutationObserver(() => {
    lockScroll();
    disableNavButtons();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class', 'aria-label']
  });

  window.addEventListener('yt-navigate-finish', () => {
    lockScroll();
    disableNavButtons();
  }, { capture: true });

  window.addEventListener('popstate', () => {
    lockScroll();
    disableNavButtons();
  }, { capture: true });

  lockScroll();
  disableNavButtons();
})();
