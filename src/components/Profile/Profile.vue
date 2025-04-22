<template>
  <div class="profile">
    <div v-if="isAuthenticated">
      <div class="avatar-section">
        <div class="avatar-container">
          <div class="avatar-circle" @click="triggerFileInput">
            <img v-if="userAvatar" :src="userAvatar" alt="Avatar" class="avatar" />
            <span v-else class="plus-icon">+</span>
            <input 
              type="file" 
              ref="fileInput"
              @change="uploadAvatar" 
              accept="image/*" 
              style="display: none;" 
            />
          </div>
        </div>
      </div>

      <transition name="slide-fade">
        <div v-if="!isEditing" class="info-section">
          <div class="info-column">
            <p>Имя: <span class="text-value">{{ currentUser.name }}</span></p>
            <p>Фамилия: <span class="text-value">{{ currentUser.surname }}</span></p>
            <p>Email: <span class="text-value">{{ currentUser.email }}</span></p>
            <p v-if="!isAdmin">Баланс: <span class="number-value">{{ currentUser.balance || 0 }} $</span></p>
          </div>
          <div class="info-column">
            <p>Телефон: <span class="text-value">{{ currentUser.phone || 'Не указан' }}</span></p>
            <p>Дата рождения: <span class="text-value">{{ formatBirthdate(currentUser.birthdate) || 'Не указана' }}</span></p>
            <p>О себе: <span class="text-value">{{ currentUser.about || 'Не указано' }}</span></p>
          </div>
        </div>
      </transition>

      <transition name="slide-fade">
        <div v-if="isEditing" class="edit-section">
          <h2>Редактировать профиль</h2>
          <form @submit.prevent="saveProfile">
            <div class="form-group">
              <label>Имя:</label>
              <input v-model="editData.name" type="text" required />
            </div>
            <div class="form-group">
              <label>Фамилия:</label>
              <input v-model="editData.surname" type="text" required />
            </div>
            <div class="form-group">
              <label>Телефон:</label>
              <input 
                v-model="editData.phone" 
                type="tel" 
                placeholder="+79991234567" 
                maxlength="12" 
                @input="restrictPhoneInput" 
                required 
              />
              <p v-if="phoneError" class="error">{{ phoneError }}</p>
            </div>
            <div class="form-group">
              <label>Дата рождения:</label>
              <input v-model="editData.birthdate" type="date" />
            </div>
            <div class="form-group">
              <label>О себе:</label>
              <textarea v-model="editData.about" rows="3"></textarea>
            </div>
            <button type="submit" :disabled="isValidating">Сохранить</button>
          </form>
        </div>
      </transition>

      <div class="achievements-section">
        <h3>Достижения</h3>
        <div class="achievement">
          <img 
            src="/src/components/Achievement/achievement.jpg" 
            alt="Первая покупка" 
            class="achievement-img" 
            :class="{ 'grayscale': !currentUser.hasFirstPurchase }"
          />
          <span>Первая покупка</span>
        </div>
      </div>

      <div class="buttons">
        <button @click="toggleEditMode" class="cancel-button">
          {{ isEditing ? 'Отменить' : 'Редактировать профиль' }}
        </button>
        <button @click="logout" class="logout-button">Выйти из профиля</button>
        <button @click="removeAvatar" class="remove-button">Удалить аватар</button>
        <button v-if="!isAdmin" @click="goToCardReplenishment">Пополнить через карту</button>
        <span v-if="isAdmin" class="admin-badge">Админ</span>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showNotification" class="notification">
        <span>✅ Баланс успешно пополнен на <span class="number-value">{{ notificationAmount }} $</span></span>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="showAchievementNotification" class="achievement-notification">
        <img src="/src/components/Achievement/achievement.jpg" alt="Достижение" class="achievement-notif-img" />
        <span>Поздравляем с первой покупкой!</span>
      </div>
    </transition>
  </div>
</template>

<script>
import * as Yup from 'yup';
import axios from 'axios';

export default {
  data() {
    return {
      userAvatar: null,
      isEditing: false,
      editData: {
        name: '',
        surname: '',
        phone: '',
        birthdate: '',
        about: ''
      },
      showNotification: false,
      notificationAmount: 0,
      phoneError: '',
      isValidating: false,
      showAchievementNotification: false
    };
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('isAuthenticated');
    },
    currentUser() {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userEmail = localStorage.getItem('userEmail');
      return users.find(user => user.email === userEmail) || {};
    },
    isAdmin() {
      return localStorage.getItem('isAdmin') === 'true';
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('isAdmin');
      this.$router.push('/reg');
    },
    uploadAvatar(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.userAvatar = e.target.result;
          this.saveAvatarToLocalStorage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },
    saveAvatarToLocalStorage(imageUrl) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userEmail = localStorage.getItem('userEmail');
      const userIndex = users.findIndex(user => user.email === userEmail);
      if (userIndex !== -1) {
        users[userIndex].avatar = imageUrl;
        localStorage.setItem('users', JSON.stringify(users));
      }
    },
    removeAvatar() {
      this.userAvatar = null;
      this.saveAvatarToLocalStorage(null);
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    goToCardReplenishment() {
      this.$router.push('/card-replenishment');
    },
    toggleEditMode() {
      this.isEditing = !this.isEditing;
      if (this.isEditing) {
        this.editData = {
          name: this.currentUser.name || '',
          surname: this.currentUser.surname || '',
          phone: this.currentUser.phone || '+7',
          birthdate: this.currentUser.birthdate || '',
          about: this.currentUser.about || ''
        };
        this.validatePhone(this.editData.phone);
      }
    },
    restrictPhoneInput(event) {
      let value = event.target.value;
      if (!value.startsWith('+')) {
        value = '+' + value.replace(/[^\d]/g, '');
      }
      value = '+' + value.replace(/[^\d]/g, '').slice(0, 11);
      this.editData.phone = value;
      this.validatePhone(value);
    },
    validatePhone(value) {
      const phoneSchema = Yup.string()
        .matches(/^\+\d{11}$/, 'Телефон должен начинаться с "+" и содержать 11 цифр (например, +79991234567)')
        .required('Телефон обязателен');
      try {
        phoneSchema.validateSync(value);
        this.phoneError = '';
      } catch (error) {
        this.phoneError = error.message;
      }
    },
    async validateRealPhoneNumber(phone) {
      const apiKey = '2a3617ff5ce3a9a36f48d13a633b48b0';
      try {
        this.isValidating = true;
        const response = await axios.get(`http://apilayer.net/api/validate?access_key=${apiKey}&number=${phone}`);
        if (response.data.valid) {
          return true;
        } else {
          this.phoneError = 'Этот номер телефона не существует';
          return false;
        }
      } catch (error) {
        this.phoneError = 'Ошибка при проверке номера телефона';
        console.error('Ошибка API:', error);
        return false;
      } finally {
        this.isValidating = false;
      }
    },
    async saveProfile() {
      this.validatePhone(this.editData.phone);
      if (this.phoneError) {
        this.$swal('Ошибка', this.phoneError, 'error');
        return;
      }

      const isReal = await this.validateRealPhoneNumber(this.editData.phone);
      if (!isReal) {
        this.$swal('Ошибка', this.phoneError, 'error');
        return;
      }

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userEmail = localStorage.getItem('userEmail');
      const userIndex = users.findIndex(user => user.email === userEmail);
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          name: this.editData.name,
          surname: this.editData.surname,
          phone: this.editData.phone,
          birthdate: this.editData.birthdate,
          about: this.editData.about,
          avatar: this.userAvatar
        };
        localStorage.setItem('users', JSON.stringify(users));
        this.isEditing = false;
        this.$swal('Успех', 'Профиль успешно сохранен!', 'success');
      }
    },
    formatBirthdate(date) {
      if (!date) return '';
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`;
    },
    showBalanceNotification(amount) {
      this.notificationAmount = amount;
      this.showNotification = true;
      setTimeout(() => {
        this.showNotification = false;
      }, 3000);
    },
    checkFirstPurchase() {
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      const userEmail = localStorage.getItem('userEmail');
      const userOrders = orders.filter(order => order.userId === this.currentUser.id);
      
      if (userOrders.length === 1 && !this.currentUser.hasFirstPurchase) {
        this.showAchievementNotification = true;
        setTimeout(() => {
          this.showAchievementNotification = false;
        }, 5000);

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.email === userEmail);
        if (userIndex !== -1) {
          users[userIndex].hasFirstPurchase = true;
          localStorage.setItem('users', JSON.stringify(users));
        }
      }
    }
  },
  mounted() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userEmail = localStorage.getItem('userEmail');
    const user = users.find(user => user.email === userEmail);
    if (user) {
      this.userAvatar = user.avatar || null;
      this.checkFirstPurchase();
    }
  },
  watch: {
    currentUser: {
      handler() {
        this.checkFirstPurchase();
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.profile {
  font-family: 'Roboto', sans-serif;
  color: #333;
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile h2, .profile h3 {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  color: #333;
}

.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.avatar-container {
  position: relative;
}

.avatar-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #555;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #e0e0e0;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.avatar-circle:hover {
  transform: scale(1.05);
  border-color: #333;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plus-icon {
  font-size: 48px;
  color: #555;
  font-weight: bold;
}

.info-section {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
}

.info-column {
  flex: 1;
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-column p {
  margin: 15px 0;
  font-size: 16px;
  color: #555;
}

.text-value {
  color: #333;
  font-weight: 500;
}

.number-value {
  color: #72AEC8;
  font-weight: 600;
}

.edit-section {
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.edit-section h2 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #72AEC8;
  outline: none;
}

.error {
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
}

.achievements-section {
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.achievements-section h3 {
  font-size: 20px;
  margin-bottom: 15px;
  text-align: center;
}

.achievement {
  display: flex;
  align-items: center;
  gap: 15px;
}

.achievement-img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  transition: filter 0.3s ease;
}

.achievement-img.grayscale {
  filter: grayscale(100%);
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 30px;
}

button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.logout-button,
.cancel-button {
  background-color: #dc3545;
  color: white;
}

.logout-button:hover,
.cancel-button:hover {
  background-color: #c82333;
}

.remove-button {
  background-color: #dc3545;
  color: white;
}

.remove-button:hover {
  background-color: #c82333;
}

.admin-badge {
  padding: 12px 24px;
  border-radius: 8px;
  background-color: #555;
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.notification,
.achievement-notification {
  position: fixed;
  bottom: 40px;
  right: 30px;
  background-color: #4caf50;
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.5s ease-out;
  display: flex;
  align-items: center;
  gap: 10px;
}

.achievement-notif-img {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  object-fit: cover;
}

.notification .number-value {
  color: #ffffff;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter, .fade-leave-to { opacity: 0; }
.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.7s ease-in; }
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>