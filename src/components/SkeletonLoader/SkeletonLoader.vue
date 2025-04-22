<!-- src/components/SkeletonLoader.vue -->
<template>
    <div class="skeleton-loader">
      <div class="skeleton-image"></div>
      <div class="skeleton-text"></div>
      <div class="skeleton-text"></div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SkeletonLoader',
  };
  </script>
  
  <style scoped>
  .skeleton-loader {
    width: 100%;
    padding: 10px;
    margin: 10px;
    box-sizing: border-box;
  }
  
  .skeleton-image {
    width: 100%;
    height: 150px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 8px;
  }
  
  .skeleton-text {
    width: 80%;
    height: 16px;
    background: #f0f0f0;
    margin: 10px 0;
    border-radius: 4px;
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
  </style>