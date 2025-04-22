<template>
  <div>
    <transition name="fade">
      <div v-if="showAchievementNotification" class="achievement-notification">
        <img src="/src/components/Achievement/achievement.jpg" alt="Достижение" class="achievement-notif-img" />
        <span>Поздравляем с первой покупкой!</span>
      </div>
    </transition>
    <div class="basket">
      <div class="header">
        <h1>Корзина</h1>
        <div class="checkout-container">
          <span v-if="selectedTotal > 0" class="total-amount">
            {{ discountedTotal ? `${discountedTotal} $ (со скидкой ${currentUser.discount}%)` : `${selectedTotal} $` }}
          </span>
          <button @click="checkout" :disabled="!hasSelectedItems" class="checkout-button">
            Оформить
          </button>
        </div>
      </div>
      <div v-if="cartItems.length === 0" class="empty-cart">
        <p>Ваша корзина пуста.</p>
      </div>
      <div v-else class="cart-content">
        <ul>
          <li v-for="item in cartItems" :key="item.id" class="cart-item">
            <input
              type="checkbox"
              v-model="item.selected"
              @change="updateSelectedItems"
              class="cart-checkbox"
            />
            <img
              :src="item.image"
              alt="Product Image"
              class="cart-item-image"
              @error="setFallbackImage(item)"
            />
            <div class="cart-item-details">
              <span class="item-title">{{ item.title }}</span>
              <div class="quantity-controls">
                <button
                  @click="decreaseItemQuantity(item)"
                  :disabled="item.quantity <= 1"
                  class="quantity-button decrease"
                >
                  −
                </button>
                <span>{{ item.quantity }} шт.</span>
                <button @click="increaseItemQuantity(item)" class="quantity-button increase">+</button>
              </div>
              <span class="item-price">{{ item.price * item.quantity }} $</span>
            </div>
          </li>
        </ul>
      </div>
      <button v-if="hasSelectedItems" @click="removeSelectedItems" class="remove-selected-button">
        Удалить выбранные
      </button>
    </div>
    <div class="subscribe-us">
      <div class="subscribe-text">
        <h3 class="subscribe-title">Subscribe Us now</h3>
        <p class="subscribe-subtitle">Get latest news, updates and deals directly mailed to your inbox.</p>
      </div>
      <div class="subscribe-form">
        <input type="email" v-model="email" placeholder="Your email" class="subscribe-input" />
        <button class="subscribe-button" @click="subscribe">Subscribe</button>
      </div>
    </div>
    <div class="mini-slider">
      <div class="slider-track">
        <div class="slider-card"><img src="@/assets/play.png" alt="Slide 1" class="slider-image" /></div>
        <div class="slider-card"><img src="@/assets/nau4.png" alt="Slide 2" class="slider-image" /></div>
        <div class="slider-card"><img src="@/assets/nau3.png" alt="Slide 3" class="slider-image" /></div>
        <div class="slider-card"><img src="@/assets/nau2.png" alt="Slide 4" class="slider-image" /></div>
        <div class="slider-card"><img src="@/assets/nau.png" alt="Slide 5" class="slider-image" /></div>
        <div class="slider-card"><img src="@/assets/camera.png" alt="Slide 6" class="slider-image" /></div>
        <div class="slider-card"><img src="@/assets/nau5.png" alt="Slide 7" class="slider-image" /></div>
        <div class="slider-card"><img src="@/assets/play.png" alt="Slide 1" class="slider-image" /></div>
        <div class="slider-card"><img src="@/assets/nau4.png" alt="Slide 2" class="slider-image" /></div>
        <div class="slider-card"><img src="@/assets/nau3.png" alt="Slide 3" class="slider-image" /></div>
        <div class="slider-card"><img src="@/assets/nau2.png" alt="Slide 4" class="slider-image" /></div>
        <div class="slider-card"><img src="@/assets/nau.png" alt="Slide 5" class="slider-image" /></div>
        <div class="slider-card"><img src="@/assets/camera.png" alt="Slide 6" class="slider-image" /></div>
        <div class="slider-card"><img src="@/assets/nau5.png" alt="Slide 7" class="slider-image" /></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartItems: [],
      fallbackImageUrl: "https://via.placeholder.com/150",
      selectedTotal: 0,
      hasSelectedItems: false,
      email: "",
      showAchievementNotification: false,
    };
  },
  computed: {
    userEmail() {
      return localStorage.getItem('userEmail');
    },
    currentUser() {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userEmail = localStorage.getItem('userEmail');
      return users.find((user) => user.email === userEmail) || null;
    },
    discountedTotal() {
      if (!this.currentUser || !this.currentUser.discount || this.currentUser.discount <= 0) {
        return null;
      }
      const discount = this.currentUser.discount / 100;
      return Math.round(this.selectedTotal * (1 - discount));
    },
  },
  watch: {
    userEmail: {
      immediate: true,
      handler(newEmail, oldEmail) {
        this.loadCart();
        if (newEmail && !oldEmail) {
          this.mergeGuestCart();
        }
      },
    },
  },
  methods: {
    loadCart() {
      const cartKey = this.userEmail ? `cart_${this.userEmail}` : 'guest_cart';
      this.cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
      this.cartItems = this.cartItems.map((item) => ({
        ...item,
        selected: item.selected || false,
      }));
      this.updateSelectedItems();
    },
    mergeGuestCart() {
      const guestCart = JSON.parse(localStorage.getItem('guest_cart')) || [];
      if (guestCart.length > 0) {
        const userCart = JSON.parse(localStorage.getItem(`cart_${this.userEmail}`)) || [];
        const mergedCart = [...userCart];
        guestCart.forEach((guestItem) => {
          const existingItemIndex = mergedCart.findIndex(
            (item) => item.id === guestItem.id &&
                      item.selectedColor === guestItem.selectedColor &&
                      item.selectedVolume === guestItem.selectedVolume
          );
          if (existingItemIndex !== -1) {
            mergedCart[existingItemIndex].quantity += guestItem.quantity;
          } else {
            mergedCart.push(guestItem);
          }
        });
        localStorage.setItem(`cart_${this.userEmail}`, JSON.stringify(mergedCart));
        localStorage.removeItem('guest_cart');
        this.loadCart();
        this.$swal({
          title: "Корзина обновлена",
          text: "Товары из гостевой корзины добавлены в ваш аккаунт.",
          icon: "info",
          confirmButtonText: "ОК",
        });
      }
    },
    updateSelectedItems() {
      this.selectedTotal = this.cartItems
        .filter((item) => item.selected)
        .reduce((sum, item) => sum + item.price * item.quantity, 0);
      this.hasSelectedItems = this.cartItems.some((item) => item.selected);
    },
    async checkout() {
      if (!this.userEmail) {
        this.$swal({
          title: "Требуется регистрация",
          text: "Пожалуйста, зарегистрируйтесь или войдите в аккаунт, чтобы оформить заказ.",
          icon: "warning",
          confirmButtonText: "ОК",
        });
        return;
      }
      const finalTotal = this.discountedTotal || this.selectedTotal;
      if (!this.currentUser || this.currentUser.balance < finalTotal) {
        this.$swal({
          title: "Недостаточно средств",
          text: "Пожалуйста, пополните баланс в профиле для завершения покупки.",
          icon: "error",
          confirmButtonText: "ОК",
        });
        return;
      }
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      const selectedItems = this.cartItems.filter((item) => item.selected);
      const savedPaymentData = JSON.parse(localStorage.getItem('savedPaymentData')) || {};
      const newOrder = {
        userId: this.currentUser.id,
        items: selectedItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        date: new Date().toISOString(),
        amount: finalTotal, // Use discounted total if applicable
        paymentMethod: savedPaymentData.selectedMethod || 'Баланс аккаунта',
      };
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userIndex = users.findIndex((user) => user.email === this.userEmail);
      if (userIndex !== -1) {
        users[userIndex].balance -= finalTotal;

        // Check for first purchase
        const userOrders = orders.filter((order) => order.userId === this.currentUser.id);
        if (userOrders.length === 1 && !users[userIndex].hasFirstPurchase) {
          users[userIndex].hasFirstPurchase = true;
          this.showAchievementNotification = true;
          setTimeout(() => {
            this.showAchievementNotification = false;
          }, 5000);
        }
        localStorage.setItem('users', JSON.stringify(users));
      }

      const cartKey = `cart_${this.userEmail}`;
      this.cartItems = this.cartItems.filter((item) => !item.selected);
      localStorage.setItem(cartKey, JSON.stringify(this.cartItems));
      this.updateSelectedItems();

      this.$swal({
        title: "Успех!",
        text: `Заказ успешно оформлен на сумму ${finalTotal} $! Подробности доступны в разделе 'Оплата и доставка'`,
        icon: "success",
        confirmButtonText: "ОК",
      }).then(() => {
        this.$router.push('/delivery');
      });
    },
    increaseItemQuantity(item) {
      const cartKey = this.userEmail ? `cart_${this.userEmail}` : 'guest_cart';
      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
      const productInCart = cart.find((cartItem) => cartItem.id === item.id);
      if (productInCart) {
        productInCart.quantity += 1;
        localStorage.setItem(cartKey, JSON.stringify(cart));
        item.quantity = productInCart.quantity;
        this.updateSelectedItems();
      }
    },
    decreaseItemQuantity(item) {
      const cartKey = this.userEmail ? `cart_${this.userEmail}` : 'guest_cart';
      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
      const productIndex = cart.findIndex((cartItem) => cartItem.id === item.id);
      if (productIndex !== -1) {
        if (cart[productIndex].quantity > 1) {
          cart[productIndex].quantity -= 1;
          localStorage.setItem(cartKey, JSON.stringify(cart));
          item.quantity = cart[productIndex].quantity;
          this.updateSelectedItems();
        }
      }
    },
    removeSelectedItems() {
      this.$swal({
        title: "Вы уверены?",
        text: "Вы действительно хотите удалить выбранные товары из корзины?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Да, удалить",
        cancelButtonText: "Отмена",
      }).then((result) => {
        if (result.isConfirmed) {
          const cartKey = this.userEmail ? `cart_${this.userEmail}` : 'guest_cart';
          this.cartItems = this.cartItems.filter((item) => !item.selected);
          localStorage.setItem(cartKey, JSON.stringify(this.cartItems));
          this.updateSelectedItems();
          this.$swal({
            title: "Удалено!",
            text: "Выбранные товары удалены из корзины.",
            icon: "success",
            confirmButtonText: "ОК",
          });
        }
      });
    },
    setFallbackImage(item) {
      item.image = this.fallbackImageUrl;
    },
    subscribe() {
      if (!this.email) {
        this.$swal({
          title: "Ошибка",
          text: "Пожалуйста, введите ваш email.",
          icon: "error",
          confirmButtonText: "ОК",
        });
        return;
      }
      this.$swal({
        title: "Успех!",
        text: `Вы подписались с email: ${this.email}`,
        icon: "success",
        confirmButtonText: "ОК",
      });
      this.email = "";
    },
  },
};
</script>

<style scoped>
.basket {
  width: 80%;
  margin: 30px auto;
  padding: 30px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}
.basket:hover {
  transform: translateY(-5px);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}
h1 {
  font-size: 32px;
  color: #333;
  font-weight: 700;
}
.checkout-container {
  display: flex;
  align-items: center;
  gap: 15px;
}
.total-amount {
  font-size: 24px;
  font-weight: 600;
  color: #72AEC8;
}
.checkout-button {
  padding: 12px 30px;
  background: linear-gradient(135deg, #72AEC8, #5a96b0);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
}
.checkout-button:hover {
  background: linear-gradient(135deg, #5a96b0, #4a7c8f);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(114, 174, 200, 0.4);
}
.checkout-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
.empty-cart {
  text-align: center;
  padding: 20px;
}
.empty-cart p {
  font-size: 18px;
  color: #555;
}
.cart-content ul {
  list-style: none;
  padding: 0;
}
.cart-item {
  display: flex;
  align-items: center;
  padding: 20px;
  margin: 15px 0;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 15px #0000000d;
  transition: transform .3s ease, box-shadow .3s ease;
  justify-content: space-around;
}
.cart-checkbox {
  width: 20px;
  height: 20px;
  margin-right: 20px;
  accent-color: #4f5455;
  cursor: pointer;
}
.cart-item-image {
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 20px;
  transition: transform 0.3s ease;
}
.cart-item:hover .cart-item-image {
  transform: scale(1.05);
}
.cart-item-details {
  display: flex;
  align-items: center;
  width: 86%;
  justify-content: space-around;
}
.item-title {
  font-size: 22px;
  color: #333;
  font-weight: 600;
  width: 50%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
.quantity-button {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 10px;
  width: 44px;
  height: 44px;
  background: #FFFFFF;
  border: 1px solid #EEEEEE;
  box-shadow: 0px 0px 44px rgba(0, 0, 0, 0.08);
  flex: none;
  order: 0;
  flex-grow: 0;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}
.quantity-button:hover {
  background: #f0f0f0;
  transform: scale(1.1);
}
.quantity-button:disabled {
  background: #e0e0e0;
  cursor: not-allowed;
  transform: none;
}
.quantity-controls span {
  font-size: 18px;
  color: #555;
  min-width: 60px;
  text-align: center;
}
.item-price {
  font-size: 20px;
  font-weight: 600;
  color: #72AEC8;
  width: 150px;
  text-align: right;
  white-space: nowrap;
}
.remove-selected-button {
  display: block;
  margin: 25px auto 0;
  padding: 12px 30px;
  background: linear-gradient(135deg, #dc3545, #ff6666);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
}
.remove-selected-button:hover {
  background: linear-gradient(135deg, #c82333, #ff4d4d);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(220, 53, 69, 0.4);
}
.mini-slider {
  max-width: 100%;
  margin: 40px auto 20px;
  padding: 0 2rem;
  overflow: hidden;
  height: 240px;
}
.slider-track {
  display: flex;
  width: calc(200px * 14);
  animation: scroll 20s linear infinite;
}
.slider-card {
  flex: 0 0 auto;
  width: 200px;
  height: 200px;
  margin-right: 30px;
}
.slider-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}
@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-200px * 7 - 30px * 7)); }
}
.subscribe-us {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 124px;
  width: 100%;
  height: 226px;
  background: #272727;
  flex: none;
  order: 7;
  flex-grow: 0;
  margin: 0 auto;
}
.subscribe-text {
  display: flex;
  margin-left: 135px;
  flex-direction: column;
  gap: 10px;
}
.subscribe-title {
  width: 303px;
  height: 34px;
  font-family: 'Jost';
  font-style: normal;
  font-weight: 400;
  font-size: 30px;
  line-height: 114%;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #ffffff;
  flex: none;
  order: 0;
  flex-grow: 0;
}
.subscribe-subtitle {
  width: 462px;
  height: 22px;
  font-family: 'Lato';
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 138%;
  letter-spacing: 0.03em;
  color: #ffffff;
  flex: none;
  order: 1;
  flex-grow: 0;
}
.subscribe-form {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
.subscribe-input {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0px 10px 30px;
  gap: 10px;
  width: 494px;
  height: 53px;
  background: #ffffff;
  border: 1px solid #eeeeee;
  box-shadow: 0px 0px 44px rgba(0, 0, 0, 0.08);
  flex: none;
  order: 1;
  flex-grow: 0;
}
.subscribe-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 40px;
  gap: 10px;
  width: 166px;
  height: 53px;
  background: #72aec8;
  border: none;
  color: #ffffff;
  font-family: 'Lato';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 138%;
  text-transform: uppercase;
  cursor: pointer;
  flex: none;
  order: 1;
  flex-grow: 0;
}
.subscribe-button:hover {
  background: #5a96b0;
}
.achievement-notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #2ecc71;
  color: white;
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  animation: slideDown 0.5s ease-out;
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 1000;
}
.achievement-notif-img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}
@keyframes slideDown {
  from { transform: translate(-50%, -100%); }
  to { transform: translate(-50%, 0); }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter, .fade-leave-to { opacity: 0; }
@media (max-width: 1024px) {
  .subscribe-us {
    flex-direction: column;
    padding: 40px 50px;
    height: auto;
    gap: 40px;
  }
  .subscribe-text {
    margin-left: 0;
    align-items: center;
  }
  .subscribe-title,
  .subscribe-subtitle {
    width: 100%;
    text-align: center;
  }
  .subscribe-form {
    flex-direction: column;
    width: 100%;
  }
  .subscribe-input {
    width: 100%;
  }
  .mini-slider {
    height: 200px;
  }
  .slider-card {
    width: 160px;
    height: 160px;
    margin-right: 20px;
  }
  .slider-track {
    width: calc(160px * 14);
  }
  @keyframes scroll {
    100% { transform: translateX(calc(-160px * 7 - 20px * 7)); }
  }
}
@media (max-width: 768px) {
  .basket { padding: 20px; }
  .cart-item-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .item-title,
  .item-price {
    width: 100%;
    text-align: left;
  }
  .mini-slider { height: 180px; }
  .slider-card {
    width: 140px;
    height: 140px;
    margin-right: 15px;
  }
  .slider-track { width: calc(140px * 14); }
  @keyframes scroll {
    100% { transform: translateX(calc(-140px * 7 - 15px * 7)); }
  }
}
</style>