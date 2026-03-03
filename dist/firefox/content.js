(() => {
  const isShortsPage = () => location.pathname.startsWith('/shorts');

  const stop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
  };

  // ホイールスクロールを無効化
  window.addEventListener('wheel', (e) => {
    if (!isShortsPage()) return;
    stop(e);
  }, { capture: true, passive: false });

  // タッチスワイプを無効化（モバイル）
  window.addEventListener('touchmove', (e) => {
    if (!isShortsPage()) return;
    stop(e);
  }, { capture: true, passive: false });

  // キー操作での移動を無効化
  const blockedKeys = new Set([
    'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Space', ' ', 'j', 'k'
  ]);

  window.addEventListener('keydown', (event) => {
    if (!isShortsPage()) return;
    if (blockedKeys.has(event.key)) stop(event);
  }, { capture: true });

  // Shorts 入口と上下ナビゲーションを無効化/非表示
  const disableShortsEntrypointsAndNav = () => {
    const selectors = [
      // Shorts 内の上下ボタン
      '#navigation-button-up',
      '#navigation-button-down',
      '.navigation-container.style-scope.ytd-shorts',
      'button[aria-label="前の動画"]',
      'button[aria-label="次の動画"]',

      // 左メニューの「ショート」導線
      'ytd-guide-entry-renderer a[title="ショート"]',
      'ytd-guide-entry-renderer tp-yt-paper-item[aria-label="ショート"]',
      'ytd-guide-entry-renderer:has(yt-formatted-string.title)',
      'a#endpoint[title="ショート"]',
      'a.yt-simple-endpoint[title="ショート"]'
    ];

    for (const selector of selectors) {
      document.querySelectorAll(selector).forEach((el) => {
        const text = (el.textContent || '').trim();

        // :has を含む広めセレクタは誤爆防止して「ショート」だけ処理
        if (selector.includes(':has') && !text.includes('ショート')) return;

        el.style.pointerEvents = 'none';
        el.style.visibility = 'hidden';
        el.style.display = 'none';
      });
    }
  };

  // クリック抑止（ショート導線 + Shorts上下ナビ）
  window.addEventListener('click', (event) => {
    const t = event.target;
    if (!(t instanceof Element)) return;

    const hit = t.closest(
      '#navigation-button-up, #navigation-button-down, button[aria-label="前の動画"], button[aria-label="次の動画"], ytd-guide-entry-renderer a[title="ショート"], a#endpoint[title="ショート"], a.yt-simple-endpoint[title="ショート"]'
    );

    if (hit) stop(event);
  }, { capture: true });

  // スクロールロック
  const lockScroll = () => {
    if (!isShortsPage()) {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      return;
    }

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
  };

  const refresh = () => {
    lockScroll();
    disableShortsEntrypointsAndNav();
  };

  const observer = new MutationObserver(refresh);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class', 'aria-label', 'title', 'href']
  });

  window.addEventListener('yt-navigate-finish', refresh, { capture: true });
  window.addEventListener('popstate', refresh, { capture: true });

  refresh();
})();
