<template>
  <div class="address-page">
    <h1>Наш адрес</h1>
    <div class="map-container">
      <iframe
        :src="mapUrl"
        width="100%"
        height="400"
        frameborder="0"
        style="border: 0;"
        allowfullscreen
      ></iframe>
    </div>
    <p>Вы можете найти нас по адресу: <strong>{{ address }}</strong></p>
  </div>
</template>

<script>
export default {
  name: 'address',
  data() {
    return {
      address: 'IThub Magas, Заводская ул., 10, Назрань',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d93055.19129058244!2d44.64316966249998!3d43.2100194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40506f6b5960e3fb%3A0x7a11bb2416c0ebb4!2sIThub%20college!5e0!3m2!1sru!2sru!4v1741212681342!5m2!1sru!2sru'
      
      
    };
  },
};
</script>

<style scoped>
.address-page {
  max-width: 1200px;
  margin: 30px auto;
  padding: 20px;
  text-align: center;
  font-family: Arial, sans-serif;
  height: 570px;
}

h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 20px;
}

.map-container {
  margin: 20px 0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

p {
  font-size: 18px;
  color: #555;
}

strong {
  color: #333;
}
</style>