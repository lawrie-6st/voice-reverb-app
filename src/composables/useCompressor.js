import { ref } from 'vue'

export function useCompressor() {
  const compressorEnabled = ref(false)
  const compressorThreshold = ref(-24)
  const compressorRatio = ref(12)
  const compressorKnee = ref(30)
  const compressorAttack = ref(0.003)
  const compressorRelease = ref(0.25)

  let compressor = null

  function toggleCompressor(audioContext, masterGain) {
    if (!audioContext) return

    if (compressorEnabled.value) {
      // コンプレッサーを作成
      compressor = audioContext.createDynamicsCompressor()

      // 設定を適用
      compressor.threshold.value = compressorThreshold.value
      compressor.ratio.value = compressorRatio.value
      compressor.knee.value = compressorKnee.value
      compressor.attack.value = compressorAttack.value
      compressor.release.value = compressorRelease.value

      // 接続を再構築
      masterGain.disconnect()

      // マスターゲイン -> コンプレッサー -> スピーカー
      masterGain.connect(compressor)
      compressor.connect(audioContext.destination)
    } else {
      // コンプレッサーを無効化
      if (compressor) {
        masterGain.disconnect()
        compressor.disconnect()

        // 直接接続に戻す
        masterGain.connect(audioContext.destination)

        compressor = null
      }
    }
  }

  function updateCompressor() {
    if (compressor) {
      compressor.threshold.value = compressorThreshold.value
      compressor.ratio.value = compressorRatio.value
      compressor.knee.value = compressorKnee.value
      compressor.attack.value = compressorAttack.value
      compressor.release.value = compressorRelease.value
    }
  }

  function cleanup() {
    compressor = null
  }

  return {
    compressorEnabled,
    compressorThreshold,
    compressorRatio,
    compressorKnee,
    compressorAttack,
    compressorRelease,
    toggleCompressor,
    updateCompressor,
    cleanup
  }
}