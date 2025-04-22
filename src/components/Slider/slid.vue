<template>
  <div class="slider-container">
    <div class="slider-track" :style="trackStyle">
      <video
        ref="video"
        src="/assets/ch.mp4"
        autoplay
        muted
        loop
        @loadedmetadata="onVideoLoad"
      ></video>
      <div class="slide-content">
        <h2>Your Products are great.</h2>
        <div>
          <button class="shop" @click="scrollToProducts">Shop Product</button>
          
        </div>
        
      </div>
    </div>
    <div class="progress-indicator">
      <div class="progress-bar active">
        <div class="progress-fill" :style="getProgressStyle"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SimpleVideoSlider',
  data() {
    return {
      currentSlide: 0,
      timeoutID: null,
      videoDuration: 0,
    };
  },
  computed: {
    trackStyle() {
      // Стили для перемещения слайдера
      return {
        transform: `translateX(${this.currentSlide * -100}%)`,
        transition: "transform 0.5s ease",
      };
    },
    getProgressStyle() {
      // Прогресс-бар, основанный на текущем времени видео
      const video = this.$refs.video;
      if (video) {
        const progress = (video.currentTime / video.duration) * 100;
        return { width: `${progress}%` };
      }
      return { width: "0%" };
    },
  },
  methods: {
    onVideoLoad() {
      // Загружаем длительность видео и запускаем таймер
      const video = this.$refs.video;
      this.videoDuration = video.duration;
      this.startSlideTimer();
    },
    startSlideTimer() {
      // Запускаем таймер для сброса слайда
      this.clearTimeout();
      this.timeoutID = setTimeout(() => {
        this.resetSlide();
      }, this.videoDuration * 1000); // Переводим секунды в миллисекунды
    },
    clearTimeout() {
      // Очищаем таймер, если он существует
      if (this.timeoutID) {
        clearTimeout(this.timeoutID);
        this.timeoutID = null;
      }
    },
    resetSlide() {
      // Сбрасываем слайд и видео на начало
      this.currentSlide = 0;
      const video = this.$refs.video;
      if (video) {
        video.currentTime = 0;
        video.play();
      }
      this.startSlideTimer();
    },
    scrollToProducts() {
      // Прокрутка до секции с карточками товаров
      const productList = document.querySelector('.product-list');
      if (productList) {
        productList.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.error('Секция .product-list не найдена');
      }
    },
  },
  mounted() {
    // Обновляем прогресс-бар при воспроизведении видео
    this.$refs.video.addEventListener("timeupdate", () => {
      this.$forceUpdate();
    });
  },
  beforeDestroy() {
    // Очищаем таймер перед уничтожением компонента
    this.clearTimeout();
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap');
.slider-container {
  width: 100%;
  height: 800px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  margin-top: -30px;
}
.slider-track {
  display: flex;
}
video {
  width: 100%;
  height: 900px;
  object-fit: cover;
}
.slide-content {
  position: absolute;
  bottom: 220px;
  left: 20px;
  color: white;
  max-width: 60%;
  padding: 10px;
  border-radius: 5px;
  width: 80%;
  margin-left: 10%;
}
.slide-content h2 {
  margin: 0;
  font-size: 94px;
  width: 74%;
  font-family: 'Lato', sans-serif;
  font-weight: 400;
}
.shop {
  padding: 10px 20px;
  background: #181818;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 250px;
  height: 60px;
  font-size: 20px;
  margin-top: 20px;
  font-family: 'Lato', sans-serif;
  font-weight: 400;

}


.progress-indicator {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}
.progress-bar {
  width: 100px;
  height: 5px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  overflow: hidden;
}
.progress-bar.active .progress-fill {
  height: 100%;
  background: #fff;
  transition: width linear;
}
</style>