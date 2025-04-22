<template>
  <div class="contacts-block">
    <h1>Контакты</h1>
    <div class="contacts-content">
      <section>
        <h2>Свяжитесь с нами</h2>
        <p>
          Если у вас есть вопросы или предложения, вы можете связаться с нами через следующие платформы:
        </p>
        <div class="contact-links">
          <a href="https://t.me/hinomarucllaher" target="_blank">
            <img src="/src/assets/Contacts/icons8-телеграм-50.png" alt="Telegram" width="40" height="40">
            <span>Telegram</span>
          </a>
          <a href="https://instagram.com/hinomarucllaher5956" target="_blank">
            <img src="/src/assets/Contacts/icons8-instagram-50.png" alt="Instagram" width="40" height="40">
            <span>Instagram</span>
          </a>
          <a href="https://youtube.com/@Saitama000001" target="_blank">
            <img src="/src/assets/Contacts/icons8-youtube-50.png" alt="YouTube" width="40" height="40">
            <span>YouTube</span>
          </a>
        </div>
      </section>

      <section>
        <h2>Наши контакты</h2>
        <ul>
          <li>Телефон: <a href="tel:+71234567890">+7 (123) 456-78-90</a></li>
          <li>Email: <a href="mailto:info@techstore.ru">info@techstore.ru</a></li>
          <li>Адрес: г. Москва, ул. Техническая, д. 123, офис 456</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Contacts',
};
</script>

<style scoped>
.contacts-block {
  background-color: #f9f9f9;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  max-width: 900px;
  margin: 30px auto;
  font-family: Arial, sans-serif;
  height: 550px;
}

.contacts-block h1 {
  text-align: center;
  color: #333;
  margin-bottom: 25px;
  font-size: 28px;
  font-weight: bold;
}

.contacts-content {
  line-height: 1.8;
  color: #555;
}

.contacts-content section {
  margin-bottom: 25px;
}

.contacts-content h2 {
  color: #222;
  font-size: 22px;
  margin-bottom: 15px;
  font-weight: 600;
}

.contacts-content p {
  margin-bottom: 15px;
}

.contacts-content ul {
  margin-bottom: 15px;
  padding-left: 20px;
}

.contacts-content ul li {
  margin-bottom: 10px;
}

.contacts-content a {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.contacts-content a:hover {
  text-decoration: underline;
}

.contact-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.contact-links a {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #333;
  transition: transform 0.3s ease;
}

.contact-links a:hover {
  transform: translateY(-5px);
}

.contact-links img {
  margin-bottom: 10px;
}

.contact-links span {
  font-size: 16px;
  font-weight: 500;
}
</style>