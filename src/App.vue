<script setup>
import MultiEffecter from './components/MultiEffecter.vue'
</script>

<template>
  <div class="app-container">
    <MultiEffecter />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.app-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
