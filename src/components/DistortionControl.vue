<template>
  <div class="effect-section">
    <div class="effect-toggle">
      <label class="toggle-label">
        <input type="checkbox" v-model="enabled" @change="$emit('toggle')" :disabled="!isActive" />
        <span class="toggle-text">ディストーション</span>
        <span class="toggle-status">{{ enabled ? 'ON' : 'OFF' }}</span>
      </label>
    </div>

    <div v-if="enabled" class="effect-controls">
      <div class="control-group">
        <label>
          Drive (歪み量)
          <span class="value-display">{{ drive }}</span>
        </label>
        <input
          type="range"
          :value="drive"
          @input="$emit('update:drive', Number($event.target.value))"
          min="0"
          max="100"
          step="1"
        />
      </div>

      <div class="control-group">
        <label>
          Mix (ミックス)
          <span class="value-display">{{ mix }}%</span>
        </label>
        <input
          type="range"
          :value="mix"
          @input="$emit('update:mix', Number($event.target.value))"
          min="0"
          max="100"
          step="1"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  enabled: Boolean,
  drive: Number,
  mix: Number,
  isActive: Boolean
})

defineEmits(['toggle', 'update:drive', 'update:mix'])
</script>