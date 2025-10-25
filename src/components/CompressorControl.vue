<template>
  <div class="effect-section">
    <div class="effect-toggle">
      <label class="toggle-label">
        <input type="checkbox" v-model="enabled" @change="$emit('toggle')" :disabled="!isActive" />
        <span class="toggle-text">コンプレッサー</span>
        <span class="toggle-status">{{ enabled ? 'ON' : 'OFF' }}</span>
      </label>
    </div>

    <div v-if="enabled" class="effect-controls">
      <div class="control-group">
        <label>
          Threshold
          <span class="value-display">{{ threshold }} dB</span>
        </label>
        <input
          type="range"
          :value="threshold"
          @input="$emit('update:threshold', Number($event.target.value))"
          min="-100"
          max="0"
          step="1"
        />
      </div>

      <div class="control-group">
        <label>
          Ratio
          <span class="value-display">{{ ratio }}:1</span>
        </label>
        <input
          type="range"
          :value="ratio"
          @input="$emit('update:ratio', Number($event.target.value))"
          min="1"
          max="20"
          step="1"
        />
      </div>

      <div class="control-group">
        <label>
          Knee
          <span class="value-display">{{ knee }} dB</span>
        </label>
        <input
          type="range"
          :value="knee"
          @input="$emit('update:knee', Number($event.target.value))"
          min="0"
          max="40"
          step="1"
        />
      </div>

      <div class="control-group">
        <label>
          Attack
          <span class="value-display">{{ attack.toFixed(3) }} s</span>
        </label>
        <input
          type="range"
          :value="attack"
          @input="$emit('update:attack', Number($event.target.value))"
          min="0"
          max="1"
          step="0.001"
        />
      </div>

      <div class="control-group">
        <label>
          Release
          <span class="value-display">{{ release.toFixed(2) }} s</span>
        </label>
        <input
          type="range"
          :value="release"
          @input="$emit('update:release', Number($event.target.value))"
          min="0"
          max="1"
          step="0.01"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  enabled: Boolean,
  threshold: Number,
  ratio: Number,
  knee: Number,
  attack: Number,
  release: Number,
  isActive: Boolean
})

defineEmits(['toggle', 'update:threshold', 'update:ratio', 'update:knee', 'update:attack', 'update:release'])
</script>