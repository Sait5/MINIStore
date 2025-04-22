<template>
  <div>
    <slid />
    <button class="skidka" @click="scrollToProducts2">%</button>
    <div class="main-page">
      <div class="search-and-filters">
        <div class="search-bar">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="Поиск товаров..."
            class="search-input"
          />
          <img src="@/assets/icons8.png" alt="Search Icon" class="search-icon" />
        </div>
        <div class="filters">
          <div class="filter-section">
            <h3>Категории</h3>
            <select v-model="selectedCategory" @change="applyFilters">
              <option value="">Все категории</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div class="filter-section">
            <h3>Бренды</h3>
            <div class="checkbox-group">
              <label v-for="brand in allBrands" :key="brand">
                <input
                  type="checkbox"
                  :value="brand"
                  v-model="selectedBrands"
                  @change="applyFilters"
                />
                {{ brand }}
              </label>
            </div>
          </div>
          <div class="filter-section">
            <h3>Сортировка</h3>
            <select v-model="sortOption" @change="applyFilters">
              <option value="default">По умолчанию</option>
              <option value="priceAsc">Цена: по возрастанию</option>
              <option value="priceDesc">Цена: по убыванию</option>
              <option value="titleAsc">Название: А-Я</option>
              <option value="titleDesc">Название: Я-А</option>
            </select>
          </div>
          <button class="reset-filters" @click="resetFilters">Сбросить фильтры</button>
        </div>
      </div>
      <div class="product-list">
        <ProductCard
          v-for="product in paginatedProducts"
          :key="product.id"
          :product="product"
        />
        <div v-if="paginatedProducts.length === 0" class="no-products">
          Товаров нет
        </div>
      </div>
      <div v-if="isAdmin" class="admin-panel">
        <button @click="toggleAddForm" class="add-product-button">
          <span class="plus-icon">+</span> Добавить товар
        </button>
        <button @click="toggleDeleteForm" class="delete-product-button">Удалить товар</button>
        <transition name="fade">
          <div v-if="showAddForm" class="admin-form">
            <h3>Добавить новый товар</h3>
            <input v-model="newProduct.title" placeholder="Название" required />
            <input v-model="newProduct.description" placeholder="Описание" required />
            <input v-model.number="newProduct.price" type="number" placeholder="Цена" required />
            <input v-model="newProduct.currency" placeholder="Валюта" required />
            <input v-model="newProduct.image" placeholder="URL изображения" required />
            <input v-model="newProduct.brand" placeholder="Бренд" required />
            <input v-model="newProduct.category" placeholder="Категория" required />
            <div class="form-buttons">
              <button @click="addProduct" class="save-button">Сохранить</button>
              <button @click="showAddForm = false" class="cancel-button">Отмена</button>
            </div>
          </div>
        </transition>
        <transition name="fade">
          <div v-if="showDeleteForm" class="admin-form">
            <h3>Удалить товар</h3>
            <select v-model="deleteProductId" required>
              <option value="">Выберите товар</option>
              <option v-for="product in products" :key="product.id" :value="product.id">
                {{ product.title }} (ID: {{ product.id }})
              </option>
            </select>
            <div class="form-buttons">
              <button @click="deleteProduct" class="delete-confirm-button" :disabled="!deleteProductId">Удалить</button>
              <button @click="showDeleteForm = false" class="cancel-button">Отмена</button>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="pagination-container">
      <div class="pagination">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="pagination-arrow"
        >
          ←
        </button>
        <button
          v-for="page in displayedPages"
          :key="page"
          :class="{ active: currentPage === page }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        <button
          :disabled="currentPage === totalPages || totalPages === 0"
          @click="changePage(currentPage + 1)"
          class="pagination-arrow"
        >
          →
        </button>
      </div>
    </div>
    <div class="sale-banner">
      <div class="sale-content">
        <div class="sale-text">
          <span class="sale-discount">-10% скидка</span>
          <h2 class="sale-title">Новогодняя распродажа</h2>
          <button class="sale-button" @click="goToSaleProduct">
            <span>Shop Sale</span>
          </button>
        </div>
        <img src="@/assets/aifon.png" alt="Айфон" class="sale-image" />
      </div>
    </div>
    <div class="latest-posts">
      <h3 class="latest-posts-title">Latest Posts</h3>
      <div class="posts-container">
        <div class="post-card">
          <img src="@/assets/play.png" alt="Post 1" class="post-image" />
          <div class="post-info">
            <span class="post-date">Feb 22, 2023 - Gadgets</span>
            <p class="post-title">Don't miss out new products will be added soon</p>
          </div>
        </div>
        <div class="post-card">
          <img src="@/assets/nau.png" alt="Post 2" class="post-image" />
          <div class="post-info">
            <span class="post-date">Feb 22, 2023 - Gadgets</span>
            <p class="post-title">Technology hack you won’t get</p>
          </div>
        </div>
        <div class="post-card">
          <img src="@/assets/camera.png" alt="Post 3" class="post-image" />
          <div class="post-info">
            <span class="post-date">Feb 22, 2023 - Gadgets</span>
            <p class="post-title">Top 10 small camera in the world</p>
          </div>
        </div>
      </div>
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
import ProductCard from "../ProductCard/ProductCard.vue";
import slid from "../Slider/slid.vue";
import axios from 'axios';

export default {
  components: { ProductCard, slid },
  data() {
    return {
      products: [],
      selectedCategory: "",
      selectedBrands: [],
      currentPage: 1,
      itemsPerPage: 12,
      searchQuery: "",
      isLoading: false,
      sortOption: "default",
      email: "",
      showAddForm: false,
      showDeleteForm: false,
      newProduct: {
        title: '',
        description: '',
        price: 0,
        currency: '',
        image: '',
        brand: '',
        category: '',
      },
      deleteProductId: '',
    };
  },
  computed: {
    categories() {
      return [...new Set(this.products.map((product) => product.category))];
    },
    allBrands() {
      return [...new Set(this.products.map((product) => product.brand))];
    },
    filteredProducts() {
      let filtered = [...this.products];
      if (this.selectedCategory) filtered = filtered.filter(product => product.category === this.selectedCategory);
      if (this.selectedBrands.length > 0) filtered = filtered.filter(product => this.selectedBrands.includes(product.brand));
      if (this.searchQuery.trim()) filtered = filtered.filter(product => product.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
      switch (this.sortOption) {
        case "priceAsc": return filtered.sort((a, b) => a.price - b.price);
        case "priceDesc": return filtered.sort((a, b) => b.price - a.price);
        case "titleAsc": return filtered.sort((a, b) => a.title.localeCompare(b.title));
        case "titleDesc": return filtered.sort((a, b) => b.title.localeCompare(a.title));
        default: return filtered;
      }
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage) || 1;
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    },
    displayedPages() {
      const maxPagesToShow = 5;
      let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
      if (endPage - startPage + 1 < maxPagesToShow) startPage = Math.max(1, endPage - maxPagesToShow + 1);
      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    },
    isAdmin() {
      return localStorage.getItem('isAdmin') === 'true';
    },
  },
  methods: {
    scrollToProducts2() {
      const sale = document.querySelector('.sale-banner');
      if (sale) {
        sale.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.error('Секция .sale-banner не найдена');
      }
    },
    async fetchProducts() {
      try {
        const response = await fetch("https://67bc472bed4861e07b39e4ca.mockapi.io/product");
        if (!response.ok) throw new Error("Ошибка при загрузке товаров");
        const rawProducts = await response.json();
        this.products = rawProducts.map(product => ({
          id: product.id,
          title: product.name,
          description: product.description,
          price: product.price,
          currency: product.currency,
          image: product.phone1?.img || 'https://via.placeholder.com/150',
          rating: product.rating,
          brand: product.brand,
          category: product.category,
          volume: product.volume || { gb1: "0", gb2: "0", gb3: "0" },
          phone1: product.phone1 || { img: 'https://via.placeholder.com/150', color: 'default' },
          phone2: product.phone2,
          phone3: product.phone3,
          phone4: product.phone4,
          name: product.name,
          discountPrice: product.id === "20" ? (product.price * 0.9).toFixed(2) : null,
          isNew: product.isNew || false, // Исправление 1: Добавлено свойство isNew для метки "New"
          info: product.info || '' // Исправление 2: Добавлено свойство info для полного описания
        }));
        localStorage.setItem('adminProducts', JSON.stringify(this.products));
      } catch (error) {
        console.error('Ошибка при загрузке продуктов:', error);
        this.loadProductsFromLocalStorage();
      }
    },
    loadProductsFromLocalStorage() {
      const storedProducts = localStorage.getItem('adminProducts');
      if (storedProducts) {
        this.products = JSON.parse(storedProducts);
      }
    },
    handleSearch() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.currentPage = 1;
      }, 200);
    },
    applyFilters() {
      this.currentPage = 1;
    },
    resetFilters() {
      this.selectedCategory = "";
      this.selectedBrands = [];
      this.searchQuery = "";
      this.sortOption = "default";
      this.currentPage = 1;
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    goToSaleProduct() {
      const saleProduct = this.products.find(product => product.id === "20");
      if (saleProduct) {
        const productWithDiscount = { ...saleProduct, price: saleProduct.discountPrice || saleProduct.price };
        localStorage.setItem('currentProduct', JSON.stringify(productWithDiscount));
        this.$router.push({ path: `/product/20` });
      } else {
        alert('Товар со скидкой не найден!');
      }
    },
    subscribe() {
      if (!this.email) {
        alert("Пожалуйста, введите email.");
        return;
      }
      alert(`Вы подписались на рассылку с email: ${this.email}`);
      this.email = "";
    },
    toggleAddForm() {
      this.showAddForm = !this.showAddForm;
      this.newProduct = { title: '', description: '', price: 0, currency: '', image: '', brand: '', category: '' };
    },
    toggleDeleteForm() {
      this.showDeleteForm = !this.showDeleteForm;
      this.deleteProductId = '';
    },
    async addProduct() {
      try {
        const response = await axios.post('https://67bc472bed4861e07b39e4ca.mockapi.io/product', {
          name: this.newProduct.title,
          description: this.newProduct.description,
          price: this.newProduct.price,
          currency: this.newProduct.currency,
          phone1: { img: this.newProduct.image },
          brand: this.newProduct.brand,
          category: this.newProduct.category,
        });
        this.products.push({
          id: response.data.id,
          title: response.data.name,
          description: response.data.description,
          price: response.data.price,
          currency: response.data.currency,
          image: response.data.phone1.img,
          brand: response.data.brand,
          category: response.data.category,
          isNew: false, // Исправление 3: Новые товары по умолчанию не "New", можно добавить опцию в форму
          info: '' // Исправление 4: Поле info пустое для новых товаров
        });
        localStorage.setItem('adminProducts', JSON.stringify(this.products));
        this.showAddForm = false;
        alert('Товар успешно добавлен!');
      } catch (error) {
        console.error('Ошибка при добавлении:', error);
        alert('Не удалось добавить товар в API. Сохранено локально.');
        const newId = Date.now().toString();
        this.products.push({
          id: newId,
          title: this.newProduct.title,
          description: this.newProduct.description,
          price: this.newProduct.price,
          currency: this.newProduct.currency,
          image: this.newProduct.image,
          brand: this.newProduct.brand,
          category: this.newProduct.category,
          isNew: false,
          info: ''
        });
        localStorage.setItem('adminProducts', JSON.stringify(this.products));
        this.showAddForm = false;
      }
    },
    async deleteProduct() {
      if (!this.deleteProductId) return;
      try {
        await axios.delete(`https://67bc472bed4861e07b39e4ca.mockapi.io/product/${this.deleteProductId}`);
        this.products = this.products.filter(product => product.id !== this.deleteProductId);
        localStorage.setItem('adminProducts', JSON.stringify(this.products));
        this.showDeleteForm = false;
        alert('Товар успешно удален!');
      } catch (error) {
        console.error('Ошибка при удалении:', error);
        alert('Не удалось удалить товар из API. Удалено локально.');
        this.products = this.products.filter(product => product.id !== this.deleteProductId);
        localStorage.setItem('adminProducts', JSON.stringify(this.products));
        this.showDeleteForm = false;
      }
    },
  },
  created() {
    this.fetchProducts();
  },
};
</script>


<style scoped>
:root {
  --primary-dark: #272727;
  --secondary-dark: #555;
  --light-bg: #f5f5f5;
  --white: #ffffff;
  --shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  --max-width: 1440px;
}

.admin-panel {
  position: relative;
}

.add-product-button {
  position: fixed;
  bottom: 30px;
  left: 30px;
  padding: 14px 25px;
  background: linear-gradient(135deg, #007bff, #00c4ff);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(0, 123, 255, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  z-index: 1000;
}

.add-product-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 123, 255, 0.5);
}

.plus-icon {
  font-size: 20px;
  margin-right: 8px;
}

.delete-product-button {
  position: fixed;
  bottom: 80px;
  left: 30px;
  padding: 14px 25px;
  background: linear-gradient(135deg, #dc3545, #ff6666);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(220, 53, 69, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  z-index: 1000;
}

.delete-product-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(220, 53, 69, 0.5);
}

.admin-form {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--white);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: var(--shadow);
  width: 100%;
  max-width: 400px;
  z-index: 1001;
  background-color: white;
  border: 1px solid #e5e5e5;
  animation: slideIn 0.3s ease-out;
}

.admin-form h3 {
  font-size: 26px;
  color: var(--primary-dark);
  margin-bottom: 25px;
  text-align: center;
  font-weight: 700;
}

.admin-form input,
.admin-form select {
  width: 90%;
  padding: 14px;
  margin-bottom: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 15px;
  background: #fafafa;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.admin-form input:focus,
.admin-form select:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
  outline: none;
}

.form-buttons {
  display: flex;
  gap: 15px;
  justify-content: space-between;
  margin-top: 25px;
}

.save-button,
.delete-confirm-button,
.cancel-button {
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.save-button {
  background: linear-gradient(135deg, #28a745, #34c759);
}

.save-button:hover {
  background: linear-gradient(135deg, #218838, #2ecc71);
  transform: translateY(-2px);
}

.delete-confirm-button {
  background: linear-gradient(135deg, #dc3545, #ff6666);
}

.delete-confirm-button:hover {
  background: linear-gradient(135deg, #c82333, #ff4d4d);
  transform: translateY(-2px);
}

.delete-confirm-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
  transform: none;
}

.cancel-button {
  background: linear-gradient(135deg, #dc3545, #ff6666);
}

.cancel-button:hover {
  background: linear-gradient(135deg, #c82333, #ff4d4d);
  transform: translateY(-2px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -60%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.main-page {
  padding: 2rem;
  max-width: var(--max-width);
  margin: 5rem auto 0;
  display: grid;
  grid-template-columns: minmax(250px, 1fr) 3fr;
  gap: 2rem;

  color: var(--primary-dark);
}

.search-and-filters {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.search-bar {
  position: relative;
  width: 100%;
}

.search-input {
  width: 90%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-input:focus {
  border-color: var(--secondary-dark);
  box-shadow: var(--shadow);
  outline: none;
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  pointer-events: none;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter-section {
  background: var(--white);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.filter-section h3 {
  font-size: 1.1rem;
  color: var(--primary-dark);
  margin-bottom: 0.75rem;
}

.filter-section select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
  background: var(--light-bg);
}

.checkbox-group {
  max-height: 200px;
  overflow-y: auto;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  accent-color: var(--secondary-dark);
}

.reset-filters {
  background-color:black;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.reset-filters:hover {
  background-color: rgb(87, 87, 87);
}

.product-list {
  display: grid;
    grid-template-columns: repeat(auto-fill, minmax(257px, 1fr));
    gap: 1rem;
    scroll-margin-top: 110px;

}

.no-products {
  grid-column: 1 / -1;
  text-align: center;
  font-size: 1.5rem;
  color: var(--secondary-dark);
  padding: 2rem;
}

.pagination-container {
  padding: 2rem 0;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--white);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.pagination button {
  min-width: 2.5rem;
  height: 2.5rem;
  border-radius: 25px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  color: var(--primary-dark);
  transition: background 0.3s ease, transform 0.3s ease;
}

.pagination button:hover:not(:disabled) {
  background: #f0f0f0;
  transform: scale(1.1);
}

.pagination button.active {
  background-color: #007bff;
  color: white;
  font-weight: 600;
}

.pagination-arrow {
  font-size: 1.2rem;
  font-weight: bold;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sale-banner {
  width: 100%;
  max-width: 1920px;
  height: 694px;
  margin: 0 auto;
  background: var(--light-bg);
  position: relative;
  overflow: hidden;
}

.sale-content {
  max-width: var(--max-width);
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
}

.sale-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  margin-left: 10%;
}

.sale-discount {
  font-size: 1.5rem;
  font-weight: 500;
  color: #777;
  transition: transform 0.3s ease;
}

.skidka {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #181818;
  color: white;
  cursor: pointer;
  font-family: 'Lato', sans-serif;
  font-weight: 400;
  font-size: 20px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 5;
}

@media (max-width: 600px) {
  .skidka {
    width: 50px;
    height: 50px;
    font-size: 18px;
  }
}

.sale-title {
  font-family: 'Jost', sans-serif;
  font-weight: 300;
  font-size: 5.1875rem;
  line-height: 114%;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--primary-dark);
  max-width: 621px;
  transition: transform 0.3s ease;
}

.sale-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 3.125rem;
  width: 185px;
  height: 53px;
  background: #272727;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
}

.sale-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
  background: #3a3a3a;
}

.sale-button span {
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 148%;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ffffff !important;
}

.sale-image {
  max-width: 45%;
  height: auto;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  transition: transform 0.3s ease;
}

.sale-image:hover {
  transform: translateY(-50%) scale(1.02);
}

.latest-posts {
  max-width: var(--max-width);
  margin: 50px auto;
  padding: 0 2rem;
  text-align: left;
}

.latest-posts-title {
  margin: 0 0 30px 0;
  width: 209px;
  height: 34px;
  font-family: 'Jost';
  font-style: normal;
  font-weight: 400;
  font-size: 30px;
  line-height: 114%;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #272727;
  flex: none;
  order: 0;
  flex-grow: 0;
}

.posts-container {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  gap: 20px;
}

.post-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 14px;
  width: 420px;
  height: 450px;
  flex: none;
  order: 0;
  flex-grow: 1;
}

.post-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
}

.post-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.post-date {
  width: 171px;
  height: 19px;
  font-family: 'Jost';
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 19px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #848484;
  flex: none;
  order: 0;
  flex-grow: 0;
}

.post-title {
  width: 420px;
  height: 29px;
  font-family: 'Jost';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 144%;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #272727;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
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

.mini-slider {
  max-width: var(--max-width);
  margin: 40px auto;
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
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-200px * 7 - 30px * 7));
  }
}

@media (max-width: 1440px) {
  .sale-content {
    padding: 0 1.5rem;
  }
  .sale-text {
    margin-left: 5%;
  }
  .sale-title {
    font-size: 4rem;
    max-width: 500px;
  }
  .sale-image {
    max-width: 40%;
  }
  .posts-container {
    flex-direction: column;
    align-items: flex-start;
  }
  .post-card {
    width: 100%;
    max-width: 420px;
  }
  .subscribe-us {
    width: 100%;
    padding: 60px 80px;
    gap: 80px;
  }
  .mini-slider {
    padding: 0 1.5rem;
    height: 220px;
  }
  .slider-card {
    width: 180px;
    height: 180px;
    margin-right: 25px;
  }
  .slider-track {
    width: calc(180px * 14);
  }
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-180px * 7 - 25px * 7));
    }
  }
}

@media (max-width: 1024px) {
  .main-page {
    grid-template-columns: 1fr;
  }
  .product-list {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  .sale-content {
    flex-direction: column;
    justify-content: center;
    gap: 1.5rem;
    text-align: center;
  }
  .sale-text {
    margin-left: 0;
    align-items: center;
  }
  .sale-title {
    font-size: 3.5rem;
    max-width: 100%;
  }
  .sale-image {
    position: static;
    transform: none;
    max-width: 60%;
  }
  .subscribe-us {
    flex-direction: column;
    padding: 40px 50px;
    height: auto;
    gap: 40px;
  }
  .subscribe-title {
    width: 100%;
    text-align: center;
  }
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
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-160px * 7 - 20px * 7));
    }
  }
}

@media (max-width: 768px) {
  .main-page {
    padding: 1rem;
  }
  .pagination {
    padding: 0.25rem 0.75rem;
  }
  .pagination button {
    min-width: 2rem;
    height: 2rem;
    font-size: 0.9rem;
  }
  .sale-banner {
    height: auto;
    padding: 2rem 0;
  }
  .sale-discount {
    font-size: 1.125rem;
  }
  .sale-title {
    font-size: 2.5rem;
  }
  .sale-button {
    padding: 0.75rem 2.5rem;
    width: 150px;
    height: 45px;
  }
  .sale-image {
    max-width: 70%;
  }
  .latest-posts-title {
    font-size: 24px;
  }
  .post-card {
    height: auto;
  }
  .post-title {
    font-size: 18px;
  }
  .subscribe-us {
    padding: 30px 20px;
  }
  .subscribe-title {
    font-size: 24px;
  }
  .subscribe-subtitle {
    font-size: 14px;
  }
  .mini-slider {
    height: 180px;
  }
  .slider-card {
    width: 140px;
    height: 140px;
    margin-right: 15px;
  }
  .slider-track {
    width: calc(140px * 14);
  }
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-140px * 7 - 15px * 7));
    }
  }
}

@media (max-width: 480px) {
  .sale-title {
    font-size: 1.875rem;
  }
  .sale-button {
    padding: 0.5rem 2rem;
    width: 130px;
    height: 40px;
  }
  .sale-button span {
    font-size: 0.75rem;
  }
  .post-title {
    width: 100%;
    font-size: 16px;
  }
  .post-date {
    font-size: 12px;
  }
  .subscribe-input {
    padding: 8px 0px 8px 20px;
    height: 45px;
  }
  .subscribe-button {
    padding: 12px 30px;
    width: 140px;
    height: 45px;
  }
  .mini-slider {
    height: 160px;
  }
  .slider-card {
    width: 120px;
    height: 120px;
    margin-right: 10px;
  }
  .slider-track {
    width: calc(120px * 14);
  }
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-120px * 7 - 10px * 7));
    }
  }
}
</style>