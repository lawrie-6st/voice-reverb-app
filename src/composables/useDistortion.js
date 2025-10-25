import { ref } from 'vue'

export function useDistortion() {
  const distortionEnabled = ref(false)
  const distortionDrive = ref(50)
  const distortionMix = ref(50)

  let distortion = null
  let distortionDryGain = null
  let distortionWetGain = null

  // ディストーション用のカーブを生成
  function makeDistortionCurve(amount) {
    const samples = 44100
    const curve = new Float32Array(samples)
    const deg = Math.PI / 180
    const k = amount

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x))
    }

    return curve
  }

  function toggleDistortion(audioContext, microphone, masterGain, dryGain, wetGain, convolver) {
    if (!audioContext) return

    if (distortionEnabled.value) {
      // ディストーションノードを作成
      distortion = audioContext.createWaveShaper()
      distortion.curve = makeDistortionCurve(distortionDrive.value)
      distortion.oversample = '4x'

      // Dry/Wet用のゲインノードを作成
      distortionDryGain = audioContext.createGain()
      distortionWetGain = audioContext.createGain()

      // ミックス比を設定
      updateDistortion()

      // 既存の接続を切断して再構築
      dryGain.disconnect()
      wetGain.disconnect()

      // マイク -> distortionDry -> マスター
      microphone.connect(distortionDryGain)
      distortionDryGain.connect(masterGain)

      // マイク -> distortion -> distortionWet -> マスター
      microphone.connect(distortion)
      distortion.connect(distortionWetGain)
      distortionWetGain.connect(masterGain)

      // リバーブの接続も再構築
      microphone.connect(convolver)
      convolver.connect(wetGain)
      wetGain.connect(masterGain)

      // Dry信号の接続
      microphone.connect(dryGain)
      dryGain.connect(masterGain)
    } else {
      // ディストーションを無効化
      if (distortion) {
        distortion.disconnect()
        distortionDryGain.disconnect()
        distortionWetGain.disconnect()

        distortion = null
        distortionDryGain = null
        distortionWetGain = null

        // 元の接続に戻す
        dryGain.disconnect()
        wetGain.disconnect()

        microphone.connect(dryGain)
        dryGain.connect(masterGain)

        microphone.connect(convolver)
        convolver.connect(wetGain)
        wetGain.connect(masterGain)
      }
    }
  }

  function updateDistortion() {
    if (distortion) {
      // カーブを更新
      distortion.curve = makeDistortionCurve(distortionDrive.value)

      // ミックス比を更新
      const wetValue = distortionMix.value / 100
      const dryValue = 1 - wetValue

      if (distortionDryGain && distortionWetGain) {
        distortionDryGain.gain.value = dryValue
        distortionWetGain.gain.value = wetValue
      }
    }
  }

  function cleanup() {
    distortion = null
    distortionDryGain = null
    distortionWetGain = null
  }

  return {
    distortionEnabled,
    distortionDrive,
    distortionMix,
    toggleDistortion,
    updateDistortion,
    cleanup
  }
}