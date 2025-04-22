<template>
    <div class="top-buyers">
      <h1>Топ покупателей</h1>
      <div class="discount-section">
        <div v-if="!isEditingDiscount" class="discount-text">
          <div class="discount-heading">
            Для наших <span class="top-numbers">Топ 3</span> покупателей
          </div>
          <p class="discount-description">
            или тех, кто оформил заказы на сумму более <span class="highlight">2000 $</span>, предусмотрена
            <span class="highlight">специальная скидка</span>!
          </p>
          <p v-if="discountText" class="additional-text">{{ discountText }}</p>
        </div>
        <div v-if="isAdmin && isEditingDiscount" class="edit-discount">
          <textarea v-model="newDiscountText" placeholder="Дополнительный текст о скидке (опционально)"></textarea>
          <div class="discount-buttons">
            <button @click="saveDiscount" class="save-button">Сохранить</button>
            <button @click="cancelEditDiscount" class="cancel-button">Отмена</button>
          </div>
        </div>
        <button v-if="isAdmin && !isEditingDiscount" @click="editDiscount" class="edit-button">
          Редактировать доп. текст
        </button>
      </div>
      <div v-if="topBuyers.length === 0" class="no-buyers">
        <p>Пока нет покупателей</p>
      </div>
      <ul v-else class="buyers-list">
        <li v-for="(buyer, index) in topBuyers" :key="buyer.email" class="buyer-item" :class="{ 'top-tier': index < 3 }">
          <span class="rank">{{ index + 1 }}</span>
          <div class="avatar-container">
            <img v-if="buyer.avatar" :src="buyer.avatar" alt="Avatar" class="avatar" />
            <span v-else class="no-avatar">{{ buyer.name ? buyer.name[0] : 'A' }}</span>
          </div>
          <span class="name">{{ buyer.name || 'Аноним' }}</span>
          <span class="total">Сумма: {{ buyer.totalSpent }} $</span>
          <div v-if="isAdmin && isEditingDiscounts" class="discount-input">
            <input
              type="number"
              v-model.number="buyer.discount"
              placeholder="%"
              min="0"
              max="100"
              @input="updateDiscount(buyer.email, $event.target.value)"
            />
          </div>
          <span v-else-if="buyer.discount" class="discount-display">{{ buyer.discount }}%</span>
        </li>
      </ul>
      <div v-if="isAdmin" class="edit-discounts-toggle">
        <button @click="toggleEditDiscounts" class="toggle-button">
          {{ isEditingDiscounts ? 'Сохранить скидки' : 'Назначить скидки' }}
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TopBuyers',
    data() {
      return {
        topBuyers: [],
        discountText: '',
        newDiscountText: '',
        isEditingDiscount: false,
        isEditingDiscounts: false,
      };
    },
    computed: {
      isAdmin() {
        return localStorage.getItem('isAdmin') === 'true';
      },
    },
    created() {
      this.loadTopBuyers();
      this.loadDiscountText();
    },
    methods: {
      loadTopBuyers() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
  
        const buyerTotals = {};
        orders.forEach((order) => {
          const user = users.find((u) => u.id === order.userId);
          if (user) {
            buyerTotals[user.email] = buyerTotals[user.email] || {
              name: user.name,
              email: user.email,
              totalSpent: 0,
              avatar: user.avatar || null,
              discount: user.discount || 0,
            };
            buyerTotals[user.email].totalSpent += order.amount;
          }
        });
  
        this.topBuyers = Object.values(buyerTotals)
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 10);
      },
      loadDiscountText() {
        this.discountText = localStorage.getItem('discountText') || '';
      },
      editDiscount() {
        this.isEditingDiscount = true;
        this.newDiscountText = this.discountText;
      },
      saveDiscount() {
        this.discountText = this.newDiscountText;
        localStorage.setItem('discountText', this.discountText);
        this.isEditingDiscount = false;
      },
      cancelEditDiscount() {
        this.isEditingDiscount = false;
        this.newDiscountText = '';
      },
      toggleEditDiscounts() {
        if (this.isEditingDiscounts) {
          this.saveDiscounts();
        }
        this.isEditingDiscounts = !this.isEditingDiscounts;
      },
      updateDiscount(email, value) {
        const buyer = this.topBuyers.find((b) => b.email === email);
        if (buyer) {
          buyer.discount = Math.max(0, Math.min(100, Number(value) || 0));
        }
      },
      saveDiscounts() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        this.topBuyers.forEach((buyer) => {
          const userIndex = users.findIndex((u) => u.email === buyer.email);
          if (userIndex !== -1) {
            users[userIndex].discount = buyer.discount;
          }
        });
        localStorage.setItem('users', JSON.stringify(users));
      },
    },
  };
  </script>
  
  <style scoped>
  .top-buyers {
    width: 85%;
    margin: 60px auto;
    padding: 40px;
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    font-family: 'Montserrat', 'Roboto', sans-serif;
    position: relative;
    overflow: hidden;
  }
  
  .top-buyers::before {
    content: '';
    position: absolute;
    top: -30px;
    left: -30px;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(0, 0, 0, 0.05), transparent);
    border-radius: 50%;
    z-index: 0;
  }
  
  .top-buyers::after {
    content: '';
    position: absolute;
    bottom: -30px;
    right: -30px;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(0, 0, 0, 0.05), transparent);
    border-radius: 50%;
    z-index: 0;
  }
  
  h1 {
    font-size: 40px;
    color: #333;
    font-weight: 700;
    text-align: center;
    margin-bottom: 40px;
    letter-spacing: 0.8px;
    position: relative;
    z-index: 1;
  }
  
  h1::after {
    content: '';
    display: block;
    width: 100px;
    height: 3px;
    background: #ddd;
    margin: 15px auto 0;
    border-radius: 2px;
  }
  
  .discount-section {
    padding: 30px;
    border-radius: 15px;
    margin-bottom: 50px;
    text-align: center;
    position: relative;
    z-index: 1;
    border: 1px solid #eee;
    background: #fafafa;
  }
  
  .discount-heading {
    font-size: 26px;
    margin-bottom: 15px;
    font-weight: 600;
    color: #333;
  }
  
  .top-numbers {
    font-weight: 700;
    font-size: 28px;
    position: relative;
    display: inline-block;
    padding: 0 5px;
    border-bottom: 2px solid #ccc;
  }
  
  .discount-description {
    font-size: 18px;
    color: #555;
    font-weight: 400;
    line-height: 1.6;
    margin-bottom: 10px;
  }
  
  .highlight {
    font-weight: 600;
    padding: 0 4px;
    border-bottom: 1px dashed #999;
  }
  
  .additional-text {
    display: block;
    margin-top: 15px;
    font-size: 16px;
    color: #777;
    font-style: italic;
    line-height: 1.5;
    padding: 10px 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
  }
  
  .edit-discount {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .edit-discount textarea {
    width: 100%;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 10px;
    font-size: 16px;
    resize: none;
    height: 120px;
    background: #fff;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    font-family: 'Roboto', sans-serif;
  }
  
  .edit-discount textarea:focus {
    border-color: #aaa;
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  }
  
  .discount-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  .edit-button,
  .save-button,
  .cancel-button,
  .toggle-button {
    padding: 12px 25px;
    border: 1px solid #ddd;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #fff;
    color: #333;
  }
  
  .edit-button:hover,
  .save-button:hover,
  .cancel-button:hover,
  .toggle-button:hover {
    background: #f5f5f5;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .no-buyers {
    text-align: center;
    padding: 25px;
  }
  
  .no-buyers p {
    font-size: 20px;
    color: #777;
    font-weight: 400;
  }
  
  .buyers-list {
    list-style: none;
    padding: 0;
  }
  
  .buyer-item {
    display: flex;
    align-items: center;
    padding: 20px 25px;
    margin: 15px 0;
    background: #fff;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    border: 1px solid #eee;
    position: relative;
  }
  
  .buyer-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  }
  
  .buyer-item.top-tier {
    border: 2px solid #ccc;
    position: relative;
  }
  
  .buyer-item.top-tier::before {
    content: '★';
    position: absolute;
    top: -10px;
    left: 10px;
    font-size: 20px;
    color: #999;
    background: #fff;
    padding: 0 5px;
  }
  
  .rank {
    font-size: 26px;
    font-weight: 700;
    color: #333;
    margin-right: 25px;
    min-width: 30px;
    position: relative;
  }
  
  .rank::after {
    content: '.';
    position: absolute;
    right: -5px;
    top: 0;
    font-size: 26px;
  }
  
  .avatar-container {
    width: 50px;
    height: 50px;
    margin-right: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #ddd;
  }
  
  .no-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #eee;
    color: #555;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 600;
  }
  
  .name {
    font-size: 20px;
    color: #333;
    flex: 1;
    font-weight: 500;
  }
  
  .total {
    font-size: 20px;
    font-weight: 600;
    color: #555;
    min-width: 150px;
    text-align: right;
    margin-right: 20px;
  }
  
  .discount-input {
    width: 60px;
    margin-left: 20px;
  }
  
  .discount-input input {
    width: 100%;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    text-align: center;
    background: #fff;
    transition: border-color 0.3s ease;
  }
  
  .discount-input input:focus {
    border-color: #aaa;
    outline: none;
  }
  
  .discount-display {
    font-size: 18px;
    font-weight: 600;
    color: #f39c12; /* Orange */
    margin-left: 20px;
    padding: 5px 10px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .edit-discounts-toggle {
    text-align: center;
    margin-top: 30px;
  }
  </style>