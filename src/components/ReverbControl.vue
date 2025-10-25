<template>
  <div class="effect-section">
    <div class="effect-toggle">
      <label class="toggle-label">
        <input type="checkbox" v-model="enabled" @change="$emit('toggle')" :disabled="!isActive" />
        <span class="toggle-text">リバーブ</span>
        <span class="toggle-status">{{ enabled ? 'ON' : 'OFF' }}</span>
      </label>
    </div>

    <div v-if="enabled" class="effect-controls">
      <div class="preset-buttons">
        <button class="preset-btn" @click="$emit('apply-preset', 'small')">小さな部屋</button>
        <button class="preset-btn" @click="$emit('apply-preset', 'medium')">中くらいの部屋</button>
        <button class="preset-btn" @click="$emit('apply-preset', 'hall')">ホール</button>
        <button class="preset-btn" @click="$emit('apply-preset', 'cathedral')">大聖堂</button>
      </div>

      <div class="control-group">
        <label>
          リバーブの深さ (Decay Time)
          <span class="value-display">{{ decay.toFixed(1) }}s</span>
        </label>
        <input
          type="range"
          :value="decay"
          @input="$emit('update:decay', Number($event.target.value))"
          min="0.1"
          max="10"
          step="0.1"
        />
      </div>

      <div class="control-group">
        <label>
          ミックス (Wet/Dry)
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
  decay: Number,
  mix: Number,
  isActive: Boolean
})

defineEmits(['toggle', 'apply-preset', 'update:decay', 'update:mix'])
</script>

<style scoped>
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
</style>