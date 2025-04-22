<template>
  <div class="product-detail" v-if="product">
    <h2>{{ product.name }}</h2>
    <div class="tov">
      <div class="onn">
        <img :src="currentImage" :alt="product.name" @error="imageError" v-if="!imageFailed" />
        <img v-else src="https://s3.amazonaws.com/images.ecwid.com/images/50826040/2645201940.jpg" alt="Запасное изображение" />
        <div class="thumbnail-container" v-if="hasMultipleImages">
          <img
            v-for="(phone, index) in productImages"
            :key="index"
            :src="phone.img"
            :title="phone.color"
            alt="Миниатюра"
            class="thumbnail"
            @click="changeImage(phone.img, phone.color)"
          />
        </div>
      </div>
      <div class="onn2">
        <!-- Краткое описание остаётся статичным, не открывается -->
        <p><strong>{{ (product.info || product.description).slice(0, 100) + '...' }}</strong></p>
        <div class="color-options" v-if="![17, 18, 19].includes(Number(product.id))">
          <button
            v-for="(phone, index) in productImages"
            :key="index"
            :style="{ backgroundColor: phone.color }"
            :title="phone.color"
            class="color-button"
            @click="changeImage(phone.img, phone.color)"
          ></button>
        </div>
        <div class="volume-options" v-if="showVolumeOptions">
          <button
            v-for="(volume, index) in availableVolumes"
            :key="index"
            :class="{ 'volume-button': true, 'active': selectedVolume === volume }"
            @click="selectVolume(volume)"
          >
            {{ volume }} {{ volumeUnit }}
          </button>
        </div>
        <div class="ret">
          <p><strong>{{ product.currency }} {{ currentPrice }}</strong></p>
          <p class="p3"><strong>★</strong> {{ product.rating }} / 5</p>
        </div>
        <div class="cart-controls">
          <button :class="buttonClass" @click="handleCartAction" class="btn-cart">
            {{ buttonText }}
          </button>
          <div v-if="isInCart" class="quantity-controls">
            <button @click="decreaseQuantity" class="quantity-button">-</button>
            <span class="quantity-text">{{ quantity }}</span>
            <button @click="increaseQuantity" class="quantity-button">+</button>
          </div>
        </div>
      </div>
    </div>
    <div class="info-section">
      <div v-if="isAdmin && isEditing">
        <h3>Редактировать товар</h3>
        <input v-model="editProduct.name" placeholder="Название" required />
        <input v-model="editProduct.description" placeholder="Описание" required />
        <input v-model.number="editProduct.price" type="number" placeholder="Цена" required />
        <input v-model="editProduct.currency" placeholder="Валюта" required />
        <input v-model="editProduct.image" placeholder="URL изображения" required />
        <input v-model="editProduct.brand" placeholder="Бренд" required />
        <input v-model="editProduct.category" placeholder="Категория" required />
        <div class="edit-buttons">
          <button @click="saveProduct" class="save-button">Сохранить</button>
          <button @click="isEditing = false" class="cancel-button">Отмена</button>
        </div>
      </div>
      <div v-else>
        <!-- Характеристики -->
        <p><strong>Бренд:</strong> {{ product.brand || 'Не указан' }}</p>
        <p><strong>Категория:</strong> {{ product.category || 'Не указана' }}</p>
        <p v-if="showVolumeOptions"><strong>Объем памяти:</strong> {{ product.volume.gb1 || '0' }} {{ volumeUnit }}, {{ product.volume.gb2 || '0' }} {{ volumeUnit }}, {{ product.volume.gb3 || '0' }} {{ volumeUnit }}</p>
        <!-- Кнопка "Показать полное описание" под характеристиками -->
        <button v-if="isLongDescription" @click="toggleFullDescription" class="description-toggle">
          {{ showFullDescription ? 'Скрыть полное описание' : 'Показать полное описание' }}
        </button>
        <div v-if="showFullDescription" class="full-description">
          <p>{{ product.info || product.description }}</p>
        </div>
        <!-- Кнопки "Назад" и "Редактировать" внизу, не на одном уровне -->
        <div class="button-container">
          <button @click="goBack" class="back-button">Назад</button>
          <button v-if="isAdmin" @click="toggleEditMode" class="edit-button">Редактировать</button>
        </div>
      </div>
    </div>
    <div class="comments-section">
      <h3>Комментарии</h3>
      <div v-if="comments.length === 0" class="no-comments">
        <p>Комментариев пока нет. Будьте первым!</p>
      </div>
      <ul v-else class="comment-list">
        <li v-for="comment in comments" :key="comment.id" class="comment">
          <strong>{{ comment.user }}</strong> {{ comment.text }}
          <span class="comment-date">{{ formatDate(comment.date) }}</span>
        </li>
      </ul>
      <div class="add-comment">
        <textarea v-model="newComment" placeholder="Оставьте ваш комментарий..." rows="3"></textarea>
        <button @click="addComment" class="submit-comment">Отправить</button>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Данные товара не найдены.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      product: null,
      imageFailed: false,
      currentImage: '',
      selectedColor: '',
      selectedVolume: 0,
      quantity: 0,
      comments: [],
      newComment: '',
      cart: [],
      userEmail: localStorage.getItem('userEmail') || null,
      isEditing: false,
      editProduct: {},
      showFullDescription: false,
    };
  },
  computed: {
    hasMultipleImages() {
      return [this.product.phone2, this.product.phone3, this.product.phone4].some(phone => phone && phone.img);
    },
    productImages() {
      const images = [
        this.product.phone1,
        this.product.phone2,
        this.product.phone3,
        this.product.phone4,
      ].filter(phone => phone && phone.img);
      return images.length > 0 ? images : [{ img: 'https://via.placeholder.com/150', color: 'default' }];
    },
    availableVolumes() {
      return [
        this.product.volume.gb1,
        this.product.volume.gb2,
        this.product.volume.gb3,
      ].filter(v => v && v !== 'null');
    },
    currentPrice() {
      if (!this.product || !this.selectedVolume || !this.showVolumeOptions) return this.product.price.toFixed(2);
      const index = this.availableVolumes.indexOf(this.selectedVolume);
      if (index === -1) return this.product.price.toFixed(2);
      const multiplier = 1 + 0.25 * index;
      return (this.product.price * multiplier).toFixed(2);
    },
    isInCart() {
      return !!this.cart.find(item => item.id === this.product.id);
    },
    buttonText() {
      return this.isInCart ? `В корзине (${this.quantity})` : 'Добавить в корзину';
    },
    buttonClass() {
      return this.isInCart ? 'btn-in-cart' : 'btn-add-to-cart';
    },
    isAdmin() {
      return localStorage.getItem('isAdmin') === 'true';
    },
    isAuthenticated() {
      return !!this.userEmail;
    },
    showVolumeOptions() {
      const watchIds = [7, 8, 15, 16];
      const tvId = 17;
      return !watchIds.includes(Number(this.product.id)) && Number(this.product.id) !== tvId;
    },
    volumeUnit() {
      return (Number(this.product.id) === 19) ? 'ГБ (VRAM)' : 'ГБ';
    },
    cartKey() {
      return this.isAuthenticated ? `cart_${this.userEmail}` : 'guest_cart';
    },
    isLongDescription() {
      return (this.product.info || this.product.description).length > 100;
    },
  },
  created() {
    this.loadProduct();
    this.loadComments();
    this.loadCart();
  },
  methods: {
    loadProduct() {
      const productId = this.$route.params.id;
      const storedProduct = localStorage.getItem('currentProduct');
      if (storedProduct) {
        this.product = JSON.parse(storedProduct);
        this.currentImage = this.product.phone1.img || 'https://via.placeholder.com/150';
        this.selectedColor = this.product.phone1.color || 'default';
        this.selectedVolume = this.product.volume.gb1 || 0;
        this.editProduct = { ...this.product };
      } else {
        this.fetchProductFromAPI(productId);
      }
    },
    async fetchProductFromAPI(productId) {
      try {
        const response = await fetch(`https://67bc472bed4861e07b39e4ca.mockapi.io/product/${productId}`);
        if (!response.ok) throw new Error('Продукт не найден');
        const product = await response.json();
        this.product = {
          id: product.id,
          name: product.name,
          description: product.description,
          info: product.info,
          brand: product.brand,
          category: product.category,
          price: product.price,
          currency: product.currency,
          volume: product.volume || { gb1: 0, gb2: 0, gb3: 0 },
          rating: product.rating,
          phone1: product.phone1 || { img: 'https://via.placeholder.com/150', color: 'default' },
          phone2: product.phone2,
          phone3: product.phone3,
          phone4: product.phone4,
          isNew: product.isNew || false,
        };
        this.currentImage = this.product.phone1.img;
        this.selectedColor = this.product.phone1.color;
        this.selectedVolume = this.product.volume.gb1;
        this.editProduct = { ...this.product };
        localStorage.setItem('currentProduct', JSON.stringify(this.product));
      } catch (error) {
        console.error('Ошибка загрузки продукта', error);
        this.product = null;
      }
    },
    imageError() {
      this.imageFailed = true;
    },
    changeImage(img, color) {
      this.currentImage = img;
      this.selectedColor = color;
    },
    selectVolume(volume) {
      this.selectedVolume = volume;
    },
    loadCart() {
      const cartData = JSON.parse(localStorage.getItem(this.cartKey)) || [];
      this.cart = cartData;
      const productInCart = this.cart.find(item => item.id === this.product.id);
      this.quantity = productInCart ? productInCart.quantity : 0;
    },
    handleCartAction() {
      const productInCartIndex = this.cart.findIndex(item => item.id === this.product.id);
      if (productInCartIndex !== -1) {
        this.$router.push('/basket');
      } else {
        const newItem = {
          ...this.product,
          price: this.currentPrice,
          quantity: 1,
          selectedColor: this.selectedColor,
          selectedVolume: this.selectedVolume,
          image: this.currentImage,
        };
        this.cart.push(newItem);
        this.quantity = 1;
        this.saveCart();
        this.$swal({
          title: "Успех!",
          text: "Товар добавлен в корзину!",
          icon: "success",
          confirmButtonText: "ОК",
        });
      }
    },
    increaseQuantity() {
      const productInCart = this.cart.find(item => item.id === this.product.id);
      if (productInCart) {
        productInCart.quantity += 1;
        this.quantity = productInCart.quantity;
        this.saveCart();
      }
    },
    decreaseQuantity() {
      const productInCartIndex = this.cart.findIndex(item => item.id === this.product.id);
      if (productInCartIndex !== -1) {
        const productInCart = this.cart[productInCartIndex];
        if (productInCart.quantity > 1) {
          productInCart.quantity -= 1;
          this.quantity = productInCart.quantity;
        } else {
          this.cart.splice(productInCartIndex, 1);
          this.quantity = 0;
        }
        this.saveCart();
      }
    },
    saveCart() {
      localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
    },
    loadComments() {
      const storedComments = localStorage.getItem(`comments_${this.$route.params.id}`);
      this.comments = storedComments ? JSON.parse(storedComments) : [];
    },
    addComment() {
      if (!this.isAuthenticated) {
        this.$swal({
          title: "Ошибка",
          text: "Пожалуйста, авторизуйтесь, чтобы оставить комментарий.",
          icon: "error",
          confirmButtonText: "ОК",
        });
        return;
      }
      if (!this.newComment.trim()) {
        this.$swal({
          title: "Ошибка",
          text: "Комментарий не может быть пустым.",
          icon: "error",
          confirmButtonText: "ОК",
        });
        return;
      }
      const comment = {
        id: Date.now(),
        user: this.userEmail,
        text: this.newComment,
        date: new Date().toISOString(),
      };
      this.comments.push(comment);
      localStorage.setItem(`comments_${this.$route.params.id}`, JSON.stringify(this.comments));
      this.newComment = '';
      this.$swal({
        title: "Успех!",
        text: "Комментарий успешно добавлен!",
        icon: "success",
        confirmButtonText: "ОК",
      });
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    toggleEditMode() {
      this.isEditing = !this.isEditing;
      if (!this.isEditing) {
        this.editProduct = { ...this.product };
      }
    },
    async saveProduct() {
      try {
        const response = await axios.put(
          `https://67bc472bed4861e07b39e4ca.mockapi.io/product/${this.product.id}`,
          {
            name: this.editProduct.name,
            description: this.editProduct.description,
            info: this.editProduct.info || this.editProduct.description,
            price: this.editProduct.price,
            currency: this.editProduct.currency,
            phone1: { img: this.editProduct.image },
            brand: this.editProduct.brand,
            category: this.editProduct.category,
            isNew: this.editProduct.isNew || false,
          }
        );
        this.product = {
          ...this.product,
          name: response.data.name,
          description: response.data.description,
          info: response.data.info,
          price: response.data.price,
          currency: response.data.currency,
          image: response.data.phone1.img,
          brand: response.data.brand,
          category: response.data.category,
          isNew: response.data.isNew,
        };
        localStorage.setItem('currentProduct', JSON.stringify(this.product));
        const adminProducts = JSON.parse(localStorage.getItem('adminProducts')) || [];
        const index = adminProducts.findIndex(p => p.id === this.product.id);
        if (index !== -1) {
          adminProducts[index] = this.product;
        } else {
          adminProducts.push(this.product);
        }
        localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
        this.isEditing = false;
        this.$swal({
          title: "Успех!",
          text: "Товар успешно отредактирован!",
          icon: "success",
          confirmButtonText: "ОК",
        });
      } catch (error) {
        console.error('Ошибка при сохранении', error);
        this.product = { ...this.editProduct };
        localStorage.setItem('currentProduct', JSON.stringify(this.product));
        const adminProducts = JSON.parse(localStorage.getItem('adminProducts')) || [];
        const index = adminProducts.findIndex(p => p.id === this.product.id);
        if (index !== -1) {
          adminProducts[index] = this.product;
        } else {
          adminProducts.push(this.product);
        }
        localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
        this.isEditing = false;
        this.$swal({
          title: "Внимание",
          text: "Не удалось обновить товар в API. Сохранено локально.",
          icon: "warning",
          confirmButtonText: "ОК",
        });
      }
    },
    toggleFullDescription() {
      this.showFullDescription = !this.showFullDescription;
    },
  },
};
</script>

<style scoped>
.product-detail {
  margin: 50px auto;
  padding: 50px;
  max-width: 75%;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.06), 0 5px 15px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(236, 240, 241, 0.5);
}
.product-detail h2 {
  font-size: 40px;
  margin-bottom: 35px;
  color: #1a2a44;
  font-weight: 800;
  text-align: center;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}
.tov {
  display: flex;
  gap: 50px;
  padding-bottom: 40px;
  justify-content: space-evenly;
}
.onn {
  max-width: 40%;
}
.onn2 {
  width: 50%;
}
.onn {
  background: #fdfdfd;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.04);
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  flex-direction: column;
  margin-left: 5%;
}
.product-detail img {
  max-width: 100%;
  height: auto;
  border-radius: 14px;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  object-fit: contain;
}
.color-options {
  display: flex;
  gap: 14px;
  margin-top: 25px;
}
.color-button {
  width: 38px;
  height: 38px;
  border: 2px solid rgba(200, 200, 200, 0.8);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.color-button:hover,
.color-button:focus {
  transform: scale(1.2);
  border-color: #444;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2), 0 0 0 4px rgba(100, 100, 100, 0.1);
  outline: none;
}
.color-button:hover:after {
  content: '';
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  animation: pulse 1.5s infinite ease-in-out;
}
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.2;
  }
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
}
.thumbnail-container {
  display: flex;
  margin-top: 25px;
  gap: 10px;
  justify-content: center;
}
.thumbnail {
  width: 80px;
  height: auto;
  cursor: pointer;
  border: 2px solid rgba(200, 200, 200, 0.8);
  border-radius: 12px;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.thumbnail:hover,
.thumbnail:focus {
  transform: scale(1.12);
  border-color: #444;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
  outline: none;
}
.onn2 p {
  font-size: 18px;
  color: #5c6b80;
  line-height: 1.8;
  margin-bottom: 20px;
  font-weight: 400;
}
.description-toggle {
  background: transparent;
  border: none;
  color: #007bff;
  font-size: 18px; /* Исправление 1: Увеличен размер текста с 16px до 18px */
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  transition: color 0.3s ease;
}
.description-toggle:hover {
  color: #0056b3;
}
.full-description {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 5px;
  text-align: left;
  margin-bottom: 20px;
}
.ret {
  margin: 30px 0;
}
.ret p {
  font-size: 20px;
  color: #1a2a44;
  font-weight: 600;
}
.p3 {
  margin: 14px 0;
}
.btn-cart,
.back-button,
.submit-comment {
  background-color: #95a5a6;
  color: #fff;
  border: none;
  border-radius: 35px;
  padding: 16px 40px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.5s ease-in-out, transform 0.5s ease-in-out, box-shadow 0.5s ease-in-out;
}
.btn-cart:hover,
.back-button:hover,
.submit-comment:hover {
  background-color: #7f8c8d;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}
.btn-in-cart {
  background: linear-gradient(135deg, #7f8c8d 0%, #636e72 100%);
}
.quantity-controls {
  display: flex;
  align-items: center;
  margin-top: 10px;
  gap: 28px;
}
.quantity-button {
  width: 48px;
  height: 48px;
  color: #000000;
  border: 1px solid all;
  border-radius: 50%;
  font-size: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
}
.quantity-button:hover {
  background: #ffffff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}
.quantity-text {
  margin: 0 20px;
  font-size: 24px;
  font-weight: 700;
  color: #1a2a44;
}
.info-section {
  margin-top: 50px;
  padding: 35px;
  background: linear-gradient(135deg, #fdfdfd 0%, #f5f6f8 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.info-section:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.07);
}
.info-section p {
  margin-bottom: 20px;
  font-size: 18px;
  color: #5c6b80;
  font-weight: 400;
}
.comments-section {
  margin-top: 60px;
  padding: 35px;
  background: linear-gradient(135deg, #fdfdfd 0%, #f5f6f8 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}
.comments-section h3 {
  font-size: 28px;
  margin-bottom: 30px;
  color: #1a2a44;
  font-weight: 700;
}
.no-comments p {
  font-size: 18px;
  color: #95a5a6;
  text-align: center;
  font-weight: 400;
}
.comment-list {
  list-style: none;
  padding: 0;
}
.comment {
  padding: 20px;
  margin-bottom: 20px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.comment:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
}
.comment strong {
  color: #1a2a44;
  font-weight: 700;
}
.comment-date {
  display: block;
  font-size: 14px;
  color: #bdc3c7;
  margin-top: 8px;
  font-weight: 300;
}
.add-comment {
  margin-top: 30px;
}
.add-comment textarea {
  width: 100%;
  padding: 20px;
  border: 2px solid rgba(200, 200, 200, 0.8);
  border-radius: 14px;
  font-size: 17px;
  resize: vertical;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.add-comment textarea:focus {
  border-color: #636e72;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
  outline: none;
}
.submit-comment {
  display: block;
  margin: 25px auto 0;
  padding: 16px 45px;
}
.info-section input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 2px solid rgba(200, 200, 200, 0.8);
  border-radius: 12px;
  font-size: 17px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.info-section input:focus {
  border-color: #636e72;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
  outline: none;
}
.edit-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}
.save-button,
.cancel-button,
.edit-button {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 35px;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
}
.save-button {
  background: linear-gradient(135deg, #72aec8 0%, #5a96b0 100%);
}
.save-button:hover {
  background: linear-gradient(135deg, #5a96b0 0%, #4682b4 100%);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}
.cancel-button {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}
.cancel-button:hover {
  background: linear-gradient(135deg, #c0392b 0%, #a93226 100%);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}
.edit-button {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  display: block;
  margin-top: 1rem;
}
.edit-button:hover {
  background: linear-gradient(135deg, #e67e22 0%, #d35400 100%);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}
.volume-options {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.volume-button {
  padding: 10px 20px;
  border: 2px solid #ccc;
  border-radius: 20px;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}
.volume-button.active,
.volume-button:hover {
  background: #72aec8;
  color: #fff;
  border-color: #72aec8;
}
.button-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}
.back-button {
  align-self: flex-start;
}
</style>