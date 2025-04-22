<template>
  <div class="terms-block">
    <h1>Пользовательское соглашение</h1>
    <div class="terms-content">
      <section>
        <h2>1. Общие положения</h2>
        <p>
          Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между вами (пользователем) и нашим сервисом (далее — «Сервис»). Используя Сервис, вы соглашаетесь с условиями данного Соглашения.
        </p>
        <p>
          Если вы не согласны с условиями, пожалуйста, не используйте наш Сервис.
        </p>
      </section>

      <section>
        <h2>2. Условия использования</h2>
        <p>
          Используя Сервис, вы обязуетесь:
        </p>
        <ul>
          <li>Соблюдать все применимые законы и нормы.</li>
          <li>Не использовать Сервис для незаконных или запрещенных целей.</li>
          <li>Не нарушать права других пользователей или третьих лиц.</li>
          <li>Не пытаться взломать или нарушить работу Сервиса.</li>
        </ul>
      </section>

      <section>
        <h2>3. Интеллектуальная собственность</h2>
        <p>
          Все материалы, размещенные на Сервисе (тексты, изображения, логотипы, программное обеспечение и т.д.), являются собственностью Сервиса или его партнеров и защищены авторским правом.
        </p>
        <p>
          Вы не имеете права копировать, распространять или использовать эти материалы без письменного разрешения.
        </p>
      </section>

      <section>
        <h2>4. Ограничение ответственности</h2>
        <p>
          Сервис предоставляется «как есть». Мы не несем ответственности за:
        </p>
        <ul>
          <li>Любые прямые или косвенные убытки, возникшие в результате использования Сервиса.</li>
          <li>Невозможность использования Сервиса по техническим или иным причинам.</li>
          <li>Действия третьих лиц, включая взлом или несанкционированный доступ к данным.</li>
        </ul>
      </section>

      <section>
        <h2>5. Изменения в Соглашении</h2>
        <p>
          Мы оставляем за собой право вносить изменения в настоящее Соглашение в любое время. Изменения вступают в силу с момента их публикации на Сайте. Рекомендуем периодически проверять Соглашение на наличие обновлений.
        </p>
      </section>

      <section>
        <h2>6. Контакты</h2>
        <p>
          Если у вас возникли вопросы или замечания по поводу настоящего Соглашения, вы можете связаться с нами:
        </p>
        <ul>
          <li>Телефон: <a href="tel:+71234567890">+7 (123) 456-78-90</a></li>
          <li>Email: <a href="mailto:support@techstore.ru">support@techstore.ru</a></li>
          <li>Адрес: г. Москва, ул. Техническая, д. 123, офис 456</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Terms',
};
</script>

<style scoped>
.terms-block {
  background-color: #f9f9f9;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  max-width: 900px;
  margin: 30px auto;
  font-family: Arial, sans-serif;
}

.terms-block h1 {
  text-align: center;
  color: #333;
  margin-bottom: 25px;
  font-size: 28px;
  font-weight: bold;
}

.terms-content {
  line-height: 1.8;
  color: #555;
}

.terms-content section {
  margin-bottom: 25px;
}

.terms-content h2 {
  color: #222;
  font-size: 22px;
  margin-bottom: 15px;
  font-weight: 600;
}

.terms-content p {
  margin-bottom: 15px;
}

.terms-content ul {
  margin-bottom: 15px;
  padding-left: 20px;
}

.terms-content ul li {
  margin-bottom: 10px;
}

.terms-content a {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.terms-content a:hover {
  text-decoration: underline;
}
</style>