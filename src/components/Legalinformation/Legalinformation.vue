<template>
    <div class="legal-info-block">
      <h2>Юридическая информация</h2>
      <div class="legal-content">
        <section>
          <h3>Условия использования</h3>
          <p>
            Наш магазин техники предоставляет услуги в соответствии с законодательством Российской Федерации. Используя наш сайт, вы соглашаетесь с нашими условиями, которые включают в себя:
          </p>
          <ul>
            <li>Соблюдение авторских прав и интеллектуальной собственности.</li>
            <li>Запрет на использование сайта для незаконных целей.</li>
            <li>Ответственность за предоставление достоверной информации при оформлении заказов.</li>
            <li>Право магазина отказывать в обслуживании без объяснения причин.</li>
          </ul>
        </section>
  
        <section>
          <h3>Политика конфиденциальности</h3>
          <p>
            Мы заботимся о вашей конфиденциальности и защите персональных данных. Вся информация, предоставленная вами, используется исключительно для:
          </p>
          <ul>
            <li>Обработки заказов и доставки товаров.</li>
            <li>Улучшения качества обслуживания и персонализации предложений.</li>
            <li>Информирования о новых акциях и специальных предложениях.</li>
          </ul>
          <p>
            Мы не передаем ваши данные третьим лицам без вашего согласия, за исключением случаев, предусмотренных законодательством.
          </p>
        </section>
  
        <section>
          <h3>Возврат и обмен</h3>
          <p>
            Вы можете вернуть или обменять товар в течение 14 дней с момента покупки при соблюдении следующих условий:
          </p>
          <ul>
            <li>Товар должен быть в оригинальной упаковке и с полной комплектацией.</li>
            <li>Товар не должен иметь следов использования или повреждений.</li>
            <li>Необходимо предоставить чек или иное подтверждение покупки.</li>
          </ul>
          <p>
            Для оформления возврата или обмена свяжитесь с нашими менеджерами по указанным контактам.
          </p>
        </section>
  
        <section>
          <h3>Контакты</h3>
          <p>
            Если у вас возникли вопросы, вы можете связаться с нами следующими способами:
          </p>
          <ul>
            <li>Телефон: <a href="tel:+71234567890">+7 (123) 456-78-90</a></li>
            <li>Email: <a href="mailto:info@techstore.ru">info@techstore.ru</a></li>
          </ul>
          <p>
            Мы работаем с понедельника по пятницу с 9:00 до 18:00. Суббота и воскресенье — выходные дни.
          </p>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LegalInfoBlock'
  }
  </script>
  
  <style scoped>
  .legal-info-block {
    background-color: #f9f9f9;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    max-width: 900px;
    margin: 30px auto;
    font-family: Arial, sans-serif;
  }
  
  .legal-info-block h2 {
    text-align: center;
    color: #333;
    margin-bottom: 25px;
    font-size: 28px;
    font-weight: bold;
  }
  
  .legal-content {
    line-height: 1.8;
    color: #555;
  }
  
  .legal-content section {
    margin-bottom: 25px;
  }
  
  .legal-content h3 {
    color: #222;
    font-size: 22px;
    margin-bottom: 15px;
    font-weight: 600;
  }
  
  .legal-content p {
    margin-bottom: 15px;
  }
  
  .legal-content ul {
    margin-bottom: 15px;
    padding-left: 20px;
  }
  
  .legal-content ul li {
    margin-bottom: 10px;
  }
  
  .legal-content a {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
  }
  
  .legal-content a:hover {
    text-decoration: underline;
  }
  </style>