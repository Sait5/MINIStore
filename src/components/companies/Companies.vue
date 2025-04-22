<template>
  <div class="companies-page">
    <h1>О компании</h1>
    <section class="intro">
      <p>
        Добро пожаловать в <strong>TechStore</strong> — ваш надежный партнер в мире электроники! 
        Мы предлагаем широкий ассортимент современных гаджетов, от смартфонов и ноутбуков до умных устройств для дома. 
        Наша миссия — сделать технологии доступными для каждого, обеспечивая высокое качество, быструю доставку и отличный сервис.
      </p>
    </section>

    <section class="about">
      <h2>Наша история</h2>
      <p>
        TechStore был основан в 2020 году группой энтузиастов, мечтающих упростить доступ к инновациям. 
        За эти годы мы выросли из небольшого стартапа в полноценный интернет-магазин, обслуживающий тысячи клиентов по всей России. 
        Мы гордимся тем, что каждый день помогаем людям находить идеальные устройства для работы, учебы и развлечений.
      </p>
    </section>

    <section class="values">
      <h2>Наши ценности</h2>
      <div class="values-container">
        <div class="value-card side-card">
          <h3>Качество</h3>
          <p>Мы сотрудничаем только с проверенными брендами и гарантируем оригинальность каждого товара.</p>
        </div>
        <div class="value-card center-card">
          <h3>Сервис</h3>
          <p>Наша команда поддержки работает 24/7, чтобы вы могли получить помощь в любое время.</p>
        </div>
        <div class="value-card side-card">
          <h3>Доступность</h3>
          <p>Мы предлагаем конкурентные цены и регулярные акции, чтобы технологии были доступны всем.</p>
        </div>
      </div>
    </section>

    <section class="extra">
      <h2>Почему выбирают нас?</h2>
      <p>
        Помимо широкого выбора и удобного интерфейса, мы добавили уникальную фишку — персонализированные рекомендации. 
        Укажите свои предпочтения в профиле, и мы подберем устройства, идеально подходящие именно вам!
      </p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Companies',
};
</script>

<style scoped>
.companies-page {
  max-width: 1200px;
  margin: 30px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
}

h1 {
  font-size: 32px;
  text-align: center;
  margin-bottom: 30px;
  color: #222;
}

section {
  margin-bottom: 40px;
}

h2 {
  font-size: 24px;
  color: #222;
  margin-bottom: 15px;
}

p {
  font-size: 16px;
  line-height: 1.6;
  color: #555;
}

.intro, .about, .extra {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.values-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.value-card {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease;
}

.value-card:hover {
  transform: translateY(-5px);
}

.side-card {
  flex: 1;
  max-width: 250px;
}

.center-card {
  flex: 1.5;
  max-width: 350px;
  background: #ff8a50;
  color: #fff;
}

.center-card h3, .center-card p {
  color: #fff;
}

h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .values-container {
    flex-direction: column;
    align-items: center;
  }

  .value-card {
    max-width: 100%;
  }
}
</style>