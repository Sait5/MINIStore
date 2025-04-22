<template>
    <div class="warranty-block">
      <h1>Гарантии</h1>
      <div class="warranty-content">
        <section>
          <h2>1. Гарантийные обязательства</h2>
          <p>
            Мы предоставляем гарантию на все товары, приобретенные в нашем магазине. Гарантийный срок зависит от категории товара и указывается в документации к продукту.
          </p>
          <p>
            Гарантия распространяется на дефекты, возникшие по вине производителя, при условии соблюдения правил эксплуатации.
          </p>
        </section>
  
        <section>
          <h2>2. Условия гарантии</h2>
          <p>
            Для получения гарантийного обслуживания необходимо:
          </p>
          <ul>
            <li>Сохранить товарный вид и упаковку товара.</li>
            <li>Предоставить оригинал чека или иного подтверждения покупки.</li>
            <li>Соблюдать правила эксплуатации, указанные в инструкции.</li>
          </ul>
          <p>
            Гарантия не распространяется на повреждения, вызванные неправильным использованием, механическими повреждениями или естественным износом.
          </p>
        </section>
  
        <section>
          <h2>3. Гарантийный ремонт</h2>
          <p>
            В случае обнаружения дефекта в течение гарантийного срока вы можете обратиться в наш сервисный центр для бесплатного ремонта или замены товара.
          </p>
          <p>
            Срок ремонта зависит от сложности неисправности и наличия запчастей, но не превышает 30 календарных дней.
          </p>
        </section>
  
        <section>
          <h2>4. Возврат товара</h2>
          <p>
            Если товар не подошел вам по каким-либо причинам, вы можете вернуть его в течение 14 дней с момента покупки при соблюдении следующих условий:
          </p>
          <ul>
            <li>Товар должен быть в оригинальной упаковке и без следов использования.</li>
            <li>Необходимо предоставить чек или иное подтверждение покупки.</li>
          </ul>
        </section>
  
        <section>
          <h2>5. Контакты</h2>
          <p>
            Если у вас возникли вопросы по гарантии или возврату товара, вы можете связаться с нами:
          </p>
          <ul>
            <li>Телефон: <a href="tel:+71234567890">+7 (123) 456-78-90</a></li>
            <li>Email: <a href="mailto:warranty@techstore.ru">warranty@techstore.ru</a></li>
            <li>Адрес: г. Москва, ул. Техническая, д. 123, офис 456</li>
          </ul>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Warranty',
  };
  </script>
  
  <style scoped>
  .warranty-block {
    background-color: #f9f9f9;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    max-width: 900px;
    margin: 30px auto;
    font-family: Arial, sans-serif;
  }
  
  .warranty-block h1 {
    text-align: center;
    color: #333;
    margin-bottom: 25px;
    font-size: 28px;
    font-weight: bold;
  }
  
  .warranty-content {
    line-height: 1.8;
    color: #555;
  }
  
  .warranty-content section {
    margin-bottom: 25px;
  }
  
  .warranty-content h2 {
    color: #222;
    font-size: 22px;
    margin-bottom: 15px;
    font-weight: 600;
  }
  
  .warranty-content p {
    margin-bottom: 15px;
  }
  
  .warranty-content ul {
    margin-bottom: 15px;
    padding-left: 20px;
  }
  
  .warranty-content ul li {
    margin-bottom: 10px;
  }
  
  .warranty-content a {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
  }
  
  .warranty-content a:hover {
    text-decoration: underline;
  }
  </style>