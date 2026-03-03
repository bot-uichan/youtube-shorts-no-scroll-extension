# YouTube Shorts Scroll Blocker

YouTube Shortsで、スクロール/スワイプ/キー操作による次動画への移動を無効化する拡張機能です。

## できること
- マウスホイールでの上下移動をブロック
- モバイルのスワイプ（touchmove）をブロック
- `↑ / ↓ / PageUp / PageDown / Space / j / k` での移動をブロック
- Shortsページ (`/shorts/*`) では `overflow: hidden` でスクロールロック
- Shorts 内上下ボタン / 左メニューの「ショート」導線を無効化・非表示

## クロスビルド（Chrome / Firefox）
```bash
npm run build
```

個別ビルド:
```bash
npm run build:chrome
npm run build:firefox
```

出力先:
- `dist/chrome`
- `dist/firefox`

※ Firefoxビルドでは `browser_specific_settings.gecko` を自動付与します。

## インストール（開発版）
### Chrome / Edge
1. `chrome://extensions` を開く
2. 右上の **デベロッパーモード** をON
3. **パッケージ化されていない拡張機能を読み込む** をクリック
4. `dist/chrome` を選択

### Firefox
1. `about:debugging#/runtime/this-firefox` を開く
2. **一時的なアドオンを読み込む** をクリック
3. `dist/firefox/manifest.json` を選択

## 注意
- YouTube側のDOM変更により効かなくなる可能性があります
- `Shift + n / Shift + p` などYouTube固有ショートカットの挙動は将来変わる場合があります


## Release（GitHub）
- タグ `v*` を push すると GitHub Actions が自動で:
  - Chrome/Firefox をビルド
  - `youtube-shorts-no-scroll-chrome.zip` / `youtube-shorts-no-scroll-firefox.zip` を作成
  - GitHub Release を作成して zip を添付

例:
```bash
git tag v1.0.1
git push origin v1.0.1
```

手動実行: Actions の `Release Extension` を `Run workflow`
