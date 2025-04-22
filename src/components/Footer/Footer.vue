<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h2>Свяжитесь с нами</h2>
        <p>Если у вас есть вопросы или предложения, вы можете связаться с нами:</p>
        <div class="social-links">
          <a href="https://t.me/hinonarucllaher" target="_blank" title="Telegram">
            <img src="/src/assets/Contacts/icons8-телеграм-50.png" alt="Telegram" width="30" height="30">
          </a>
          <a href="https://instagram.com/hinonarucllaher5956" target="_blank" title="Instagram">
            <img src="/src/assets/Contacts/icons8-instagram-50.png" alt="Instagram" width="30" height="30">
          </a>
          <a href="https://youtube.com/@Saitama000001" target="_blank" title="YouTube">
            <img src="/src/assets/Contacts/icons8-youtube-50.png" alt="YouTube" width="30" height="30">
          </a>
        </div>
      </div>
      <div class="footer-section">
        <h2>Наши контакты</h2>
        <ul>
          <li>Телефон: <a href="tel:+71234567890">+7 (123) 456-78-90</a></li>
          <li>Email: <a href="mailto:info@techstore.ru">info@techstore.ru</a></li>
          <li>Адрес: г. Москва, ул. Техническая, д. 123, офис 456</li>
        </ul>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 TechStore. Все права защищены.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

<style scoped>
.footer {
  background-color: #1a1a1a;
    color: #ffffff;
    padding: 20px 0;
    width: 100%;
    z-index: 1000;
    font-family: 'Arial', sans-serif;
    position: relative;
    bottom: 0;
    left: 0;
    margin-bottom: -20px;
    margin-top: 130px;
  

}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 20px; /* Убедитесь, что у футера нет отступов */
}

.footer-section {
  flex: 1;
  min-width: 250px;
  margin: 10px 20px; /* Убедитесь, что отступы минимальны или удалите их */
}

.footer-section h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #ffffff;
}

.footer-section p {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 15px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  font-size: 14px;
  margin-bottom: 10px;
}

.footer-section ul li a {
  color: #00c4ff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: #ff8a50;
  text-decoration: underline;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-links a {
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.social-links a:hover {
  transform: scale(1.1);
}

.social-links img {
  filter: brightness(0) invert(1);
}

.footer-bottom {
  width: 100%;
  text-align: center;
  margin-top: 20px; /* Убедитесь, что отступ минимален или удалите его */
  padding-top: 10px;
  border-top: 1px solid #333;
}

.footer-bottom p {
  font-size: 12px;
  color: #999;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .footer-section {
    margin: 20px 0;
  }
  .social-links {
    justify-content: center;
  }
}
</style>