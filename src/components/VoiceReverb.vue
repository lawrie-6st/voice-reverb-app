<template>
  <div class="reverb-container">
    <h1>🎤 Voice Reverb</h1>

    <div class="preset-buttons">
      <button class="preset-btn" @click="applyPreset('small')">小さな部屋</button>
      <button class="preset-btn" @click="applyPreset('medium')">中くらいの部屋</button>
      <button class="preset-btn" @click="applyPreset('hall')">ホール</button>
      <button class="preset-btn" @click="applyPreset('cathedral')">大聖堂</button>
    </div>

    <div class="control-group">
      <label>
        リバーブの深さ (Decay Time)
        <span class="value-display">{{ decay.toFixed(1) }}s</span>
      </label>
      <input type="range" v-model.number="decay" min="0.1" max="10" step="0.1" @input="updateReverb" />
    </div>

    <div class="control-group">
      <label>
        ミックス (Wet/Dry)
        <span class="value-display">{{ mix }}%</span>
      </label>
      <input type="range" v-model.number="mix" min="0" max="100" step="1" @input="updateMix" />
    </div>

    <div class="control-group">
      <label>
        音量
        <span class="value-display">{{ volume }}%</span>
      </label>
      <input type="range" v-model.number="volume" min="0" max="100" step="1" @input="updateVolume" />
    </div>

    <button class="main-btn start-btn" @click="startAudio" :disabled="isActive">
      マイクを開始
    </button>
    <button class="main-btn stop-btn" @click="stopAudio" :disabled="!isActive">
      停止
    </button>

    <div class="status" :class="{ active: isActive, inactive: !isActive }">
      {{ isActive ? 'マイクが動作中です' : 'マイクが停止中です' }}
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const isActive = ref(false)
const decay = ref(2.0)
const mix = ref(50)
const volume = ref(80)

let audioContext = null
let microphone = null
let convolver = null
let dryGain = null
let wetGain = null
let masterGain = null
let stream = null

// リバーブのインパルスレスポンスを生成
function createReverbImpulse(duration, decay) {
  const sampleRate = audioContext.sampleRate
  const length = sampleRate * duration
  const impulse = audioContext.createBuffer(2, length, sampleRate)

  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel)
    for (let i = 0; i < length; i++) {
      // ランダムノイズに減衰を適用
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
    }
  }

  return impulse
}

async function startAudio() {
  try {
    // マイクアクセスを要求
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    // Audio Contextを作成
    audioContext = new (window.AudioContext || window.webkitAudioContext)()

    // マイク入力ノード
    microphone = audioContext.createMediaStreamSource(stream)

    // Convolverノード（リバーブ）
    convolver = audioContext.createConvolver()
    convolver.buffer = createReverbImpulse(3, decay.value)

    // Dry（原音）とWet（エフェクト音）のゲイン
    dryGain = audioContext.createGain()
    wetGain = audioContext.createGain()

    // マスターゲイン
    masterGain = audioContext.createGain()
    masterGain.gain.value = volume.value / 100

    // ミックス比を設定
    updateMix()

    // 接続: マイク -> dry -> マスター -> スピーカー
    microphone.connect(dryGain)
    dryGain.connect(masterGain)

    // 接続: マイク -> リバーブ -> wet -> マスター -> スピーカー
    microphone.connect(convolver)
    convolver.connect(wetGain)
    wetGain.connect(masterGain)

    masterGain.connect(audioContext.destination)

    isActive.value = true
  } catch (error) {
    console.error('マイクアクセスエラー:', error)
    alert('マイクへのアクセスが拒否されました。ブラウザの設定を確認してください。')
  }
}

function stopAudio() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }

  if (audioContext) {
    audioContext.close()
  }

  isActive.value = false
  audioContext = null
  microphone = null
  convolver = null
  dryGain = null
  wetGain = null
  masterGain = null
  stream = null
}

function updateReverb() {
  if (convolver && audioContext) {
    convolver.buffer = createReverbImpulse(3, decay.value)
  }
}

function updateMix() {
  if (dryGain && wetGain) {
    const wetValue = mix.value / 100
    const dryValue = 1 - wetValue

    dryGain.gain.value = dryValue
    wetGain.gain.value = wetValue
  }
}

function updateVolume() {
  if (masterGain) {
    masterGain.gain.value = volume.value / 100
  }
}

function applyPreset(preset) {
  const presets = {
    small: { decay: 1.0, mix: 30 },
    medium: { decay: 2.5, mix: 50 },
    hall: { decay: 5.0, mix: 70 },
    cathedral: { decay: 8.0, mix: 80 }
  }

  const selected = presets[preset]
  decay.value = selected.decay
  mix.value = selected.mix

  updateReverb()
  updateMix()
}

onUnmounted(() => {
  stopAudio()
})
</script>

<style scoped>
.reverb-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

h1 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
  font-size: 28px;
}

.preset-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.preset-btn {
  padding: 10px;
  background: #f0f0f0;
  color: #333;
  font-size: 14px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.preset-btn:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}

.control-group {
  margin-bottom: 25px;
}

label {
  display: block;
  color: #555;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 14px;
}

.value-display {
  float: right;
  color: #667eea;
  font-weight: 700;
}

input[type="range"] {
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: #ddd;
  outline: none;
  -webkit-appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  transition: all 0.3s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  background: #764ba2;
  transform: scale(1.2);
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

input[type="range"]::-moz-range-thumb:hover {
  background: #764ba2;
  transform: scale(1.2);
}

.main-btn {
  width: 100%;
  padding: 15px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

.start-btn {
  background: #667eea;
  color: white;
}

.start-btn:hover:not(:disabled) {
  background: #764ba2;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.stop-btn {
  background: #e74c3c;
  color: white;
}

.stop-btn:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
}

.main-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.status {
  text-align: center;
  margin-top: 20px;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
}

.status.active {
  background: #d4edda;
  color: #155724;
}

.status.inactive {
  background: #f8d7da;
  color: #721c24;
}
</style>
