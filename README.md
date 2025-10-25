# Voice Reverb App

リアルタイムで自分の声にリバーブエフェクトをかけるWebアプリケーション。Web Audio APIを使用して、マイク入力に対してリバーブ処理を施します。

## 機能

- **リアルタイムボイスエフェクト**: マイクからの入力音声にリアルタイムでリバーブをかけます
- **4つのプリセット**:
  - 小さな部屋 (Decay: 1.0s, Mix: 30%)
  - 中くらいの部屋 (Decay: 2.5s, Mix: 50%)
  - ホール (Decay: 5.0s, Mix: 70%)
  - 大聖堂 (Decay: 8.0s, Mix: 80%)
- **カスタマイズ可能なパラメータ**:
  - リバーブの深さ (Decay Time): 0.1秒〜10秒
  - ミックス比 (Wet/Dry): 0%〜100%
  - 音量: 0%〜100%

## 技術スタック

- Vue 3 (Composition API)
- Web Audio API
- Vite

## 必要要件

- Node.js ^20.19.0 || >=22.12.0
- マイク付きデバイス
- モダンブラウザ（Chrome、Firefox、Edge、Safariなど）

## セットアップ

依存関係をインストール:

```sh
npm install
```

## 開発サーバーの起動

```sh
npm run dev
```

ブラウザで http://localhost:5173/ にアクセスします。

## 使い方

1. 「マイクを開始」ボタンをクリック
2. ブラウザのマイクアクセス許可ダイアログで「許可」を選択
3. プリセットボタンで好みの部屋の響きを選択、またはスライダーで細かく調整
4. 自分の声にリバーブがかかってスピーカーから出力されます
5. 「停止」ボタンでマイクを停止

## ビルド

本番用にビルド:

```sh
npm run build
```

ビルドしたファイルのプレビュー:

```sh
npm run preview
```

## 実装の詳細

### Web Audio APIの構成

```
マイク入力
  ↓
  ├→ Dry Gain → Master Gain → スピーカー出力
  └→ Convolver (Reverb) → Wet Gain → Master Gain → スピーカー出力
```

- **Convolver**: インパルスレスポンスを使用してリバーブエフェクトを生成
- **Dry Gain**: 原音（エフェクトなし）の音量を制御
- **Wet Gain**: エフェクト音の音量を制御
- **Master Gain**: 最終的な出力音量を制御

### コンポーネント構成

- `src/App.vue`: アプリケーションのメインコンポーネント
- `src/components/VoiceReverb.vue`: リバーブエフェクトのUIとロジック
