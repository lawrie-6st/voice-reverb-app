import { ref } from 'vue'

export function useAudioContext() {
  const isActive = ref(false)
  const volume = ref(80)

  let audioContext = null
  let microphone = null
  let masterGain = null
  let stream = null

  async function startAudio() {
    try {
      // マイクアクセスを要求
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Audio Contextを作成
      audioContext = new (window.AudioContext || window.webkitAudioContext)()

      // マイク入力ノード
      microphone = audioContext.createMediaStreamSource(stream)

      // マスターゲイン
      masterGain = audioContext.createGain()
      masterGain.gain.value = volume.value / 100

      masterGain.connect(audioContext.destination)

      isActive.value = true

      return { audioContext, microphone, masterGain }
    } catch (error) {
      console.error('マイクアクセスエラー:', error)
      alert('マイクへのアクセスが拒否されました。ブラウザの設定を確認してください。')
      throw error
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
    masterGain = null
    stream = null
  }

  function updateVolume() {
    if (masterGain) {
      masterGain.gain.value = volume.value / 100
    }
  }

  function getContext() {
    return { audioContext, microphone, masterGain }
  }

  return {
    isActive,
    volume,
    startAudio,
    stopAudio,
    updateVolume,
    getContext
  }
}