<template>
  <div class="delivery">
    <section class="purchase-history">
      <h1>История покупок</h1>
      <div class="orders-container" v-if="orders.length > 0">
        <div class="orders-list">
          <div v-for="order in orders" :key="order.id" class="order-item" @click="selectOrder(order)">
            <div class="order-header">
              <div class="order-date">Дата покупки: {{ formatDate(order.date) }}</div>
              <div class="order-status" :class="orderStatusClass(order.deliveryDate)">
                {{ getOrderStatus(order.deliveryDate) }}
              </div>
            </div>
            <div class="order-delivery">
              Ожидаемая доставка: {{ formatDate(order.deliveryDate) }}
              <span class="timer"> ({{ getRemainingTime(order.deliveryDate) }})</span>
            </div>
            <div class="order-amount">Сумма: {{ order.amount }} $</div>
            <div class="order-payment">Оплачено картой: **** {{ order.cardLastDigits || '1234' }}</div>
          </div>
        </div>
        <div class="order-items-panel" v-if="selectedOrder">
          <h2>Купленные товары</h2>
          <div class="items-container">
            <div v-for="item in selectedOrder.items" :key="item.id" class="item">
              <img :src="item.image" alt="Product" class="item-image" @error="setFallbackImage(item)" />
              <div class="item-details">
                <span class="item-title">{{ item.title }}</span>
                <div class="item-info">
                  <span class="item-quantity">Кол-во: {{ item.quantity }} шт.</span>
                  <span class="item-price">{{ item.price }} $</span>
                </div>
              </div>
            </div>
            <div class="items-total">
              <span>Итого:</span>
              <span>{{ selectedOrder.amount }} $</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-orders">
        <p>У вас пока нет истории покупок</p>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Delivery',
  data() {
    return {
      orders: [],
      products: [],
      selectedOrder: null,
      fallbackImage: 'https://via.placeholder.com/150',
      timerInterval: null,
    };
  },
  async mounted() {
    await this.fetchProducts(); // Ждем загрузки товаров
    this.loadOrders();          // Затем загружаем заказы
    this.startTimer();
  },
  beforeUnmount() {
    clearInterval(this.timerInterval);
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('https://67bc472bed4861e07b39e4ca.mockapi.io/product');
        this.products = response.data.map((product) => ({
          id: product.id,
          title: product.name,
          image: product.phone1?.img || this.fallbackImage,
          price: product.price,
          description: product.description,
          brand: product.brand,
          category: product.category,
        }));
        console.log('Загруженные товары:', this.products); // Для отладки
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
      }
    },
    loadOrders() {
      const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
      const userEmail = localStorage.getItem('userEmail');
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const currentUser = users.find((user) => user.email === userEmail);

      console.log('Заказы из localStorage:', allOrders); // Для отладки
      console.log('Текущий пользователь:', currentUser);

      if (currentUser) {
        this.orders = allOrders
          .filter((order) => order.userId === currentUser.id)
          .map((order) => {
            const purchaseDate = new Date(order.date || Date.now());
            const deliveryDate = new Date(purchaseDate);
            deliveryDate.setDate(purchaseDate.getDate() + 3);

            const itemsWithDetails = order.items.map((item) => {
              const product = this.products.find((p) => p.id === item.id) || {};
              return {
                ...item,
                title: product.title || `Товар ${item.id} (не найден)`,
                image: product.image || this.fallbackImage,
                price: product.price || 0,
              };
            });

            return {
              id: order.id || Date.now(),
              date: purchaseDate,
              deliveryDate,
              amount: order.amount,
              cardLastDigits: currentUser.lastCardDigits || order.cardLastDigits || '1234',
              items: itemsWithDetails,
            };
          });
        if (this.orders.length > 0) {
          this.selectedOrder = this.orders[0];
        }
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    },
    getRemainingTime(deliveryDate) {
      const now = new Date();
      const delivery = new Date(deliveryDate);
      const diffMs = delivery - now;

      if (diffMs <= 0) return 'Доставлено';

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${days} д ${hours} ч ${minutes} мин`;
    },
    getOrderStatus(deliveryDate) {
      const now = new Date();
      return new Date(deliveryDate) > now ? 'В пути' : 'Доставлено';
    },
    orderStatusClass(deliveryDate) {
      return new Date(deliveryDate) > new Date() ? 'status-pending' : 'status-delivered';
    },
    setFallbackImage(item) {
      item.image = this.fallbackImage;
    },
    startTimer() {
      this.timerInterval = setInterval(() => {
        this.$forceUpdate(); // Обновляем отображение таймера
      }, 60000); // Каждую минуту
    },
    selectOrder(order) {
      this.selectedOrder = order;
    },
  },
};
</script>

<style scoped>
.delivery {
  width: 80%;
  margin: 30px auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
  height: 700px;
}

.purchase-history {
  padding: 25px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.purchase-history h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.orders-container {
  display: flex;
  gap: 25px;
}

.orders-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-item {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, background 0.3s ease;
  cursor: pointer;
}

.order-item:hover {
  transform: translateY(-5px);
  background: #f0f0f0;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.order-date,
.order-delivery,
.order-amount,
.order-payment {
  font-size: 16px;
  color: #555;
  margin: 8px 0;
}

.order-status {
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 500;
}

.status-pending {
  background: #ffe082;
  color: #ff8f00;
}

.status-delivered {
  background: #a5d6a7;
  color: #2e7d32;
}

.timer {
  color: #007bff;
  font-weight: 500;
}

.order-items-panel {
  width: 45%;
  padding: 25px;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #007bff;
}

.order-items-panel h2 {
  font-size: 26px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 500;
}

.items-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.item-image {
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #eee;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.item-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-quantity {
  font-size: 15px;
  color: #666;
}

.item-price {
  font-size: 16px;
  font-weight: 500;
  color: #007bff;
}

.items-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #e6f0f5;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-top: 10px;
}

.no-orders {
  text-align: center;
  padding: 20px;
  color: #555;
  font-size: 18px;
}
</style>