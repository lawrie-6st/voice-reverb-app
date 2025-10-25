import { ref } from 'vue'

export function useReverb() {
  const reverbEnabled = ref(false)
  const decay = ref(2.0)
  const mix = ref(50)

  let convolver = null
  let dryGain = null
  let wetGain = null

  // リバーブのインパルスレスポンスを生成
  function createReverbImpulse(audioContext, duration, decayValue) {
    const sampleRate = audioContext.sampleRate
    const length = sampleRate * duration
    const impulse = audioContext.createBuffer(2, length, sampleRate)

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        // ランダムノイズに減衰を適用
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decayValue)
      }
    }

    return impulse
  }

  function setupReverb(audioContext, microphone, masterGain) {
    // Convolverノード（リバーブ）
    convolver = audioContext.createConvolver()
    convolver.buffer = createReverbImpulse(audioContext, 3, decay.value)

    // Dry（原音）とWet（エフェクト音）のゲイン
    dryGain = audioContext.createGain()
    wetGain = audioContext.createGain()

    // ミックス比を設定
    updateMix()

    // 接続: マイク -> dry -> マスター
    microphone.connect(dryGain)
    dryGain.connect(masterGain)

    // 接続: マイク -> リバーブ -> wet -> マスター
    microphone.connect(convolver)
    convolver.connect(wetGain)
    wetGain.connect(masterGain)
  }

  function updateReverb(audioContext) {
    if (convolver && audioContext) {
      convolver.buffer = createReverbImpulse(audioContext, 3, decay.value)
    }
  }

  function updateMix() {
    if (dryGain && wetGain) {
      const wetValue = reverbEnabled.value ? mix.value / 100 : 0
      const dryValue = 1 - wetValue

      dryGain.gain.value = dryValue
      wetGain.gain.value = wetValue
    }
  }

  function toggleReverb() {
    updateMix()
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
  }

  function cleanup() {
    convolver = null
    dryGain = null
    wetGain = null
  }

  return {
    reverbEnabled,
    decay,
    mix,
    setupReverb,
    updateReverb,
    updateMix,
    toggleReverb,
    applyPreset,
    cleanup
  }
}