<template>
  <div class="container">
    <div class="registration-wrapper">
      <div class="registration-container">
        <div class="registration">
          <div v-if="!isRegistered">
            <h2>Вход</h2>
            <div>
              <input 
                v-model="email" 
                type="email" 
                placeholder="Введите вашу почту" 
                @blur="validateEmail"
              />
              <p v-if="emailError" style="color: red;">Почта должна быть в доменах @gmail.com, @mail.com или @email.com</p>
              <div class="password-input">
                <input 
                  :type="passwordVisible ? 'text' : 'password'" 
                  v-model="password" 
                  placeholder="Введите ваш пароль"
                  @blur="validatePassword"
                />
                <span @click="togglePasswordVisibility" class="password-toggle">{{ passwordVisible ? 'Hide' : 'Show' }}</span>
              </div>
              <p v-if="passwordError" style="color: red;">Пароль должен содержать не менее 6 символов, включая хотя бы одну букву и одну цифру</p>
              <button @click="login" class="auth-button">Войти</button>
            </div>
          </div>
          <div v-if="isRegistered">
            <h2>Регистрация</h2>
            <input v-model="firstName" type="text" placeholder="Имя" @blur="validateFirstName" />
            <p v-if="firstNameError" style="color: red;">Поле 'Имя' обязательно для заполнения</p>
            <input v-model="lastName" type="text" placeholder="Фамилия" @blur="validateLastName" />
            <p v-if="lastNameError" style="color: red;">Поле 'Фамилия' обязательно для заполнения</p>
            <input 
              v-model="newEmail" 
              type="email" 
              placeholder="Почта" 
              @blur="validateNewEmail"
            />
            <p v-if="newEmailError" style="color: red;">Почта должна быть в доменах @gmail.com, @mail.com или @email.com</p>
            <div class="password-input">
              <input 
                :type="newPasswordVisible ? 'text' : 'password'" 
                v-model="newPassword" 
                placeholder="Придумайте пароль"
                @blur="validateNewPassword"
              />
              <span @click="toggleNewPasswordVisibility" class="password-toggle">{{ newPasswordVisible ? 'Hide' : 'Show' }}</span>
            </div>
            <p v-if="newPasswordError" style="color: red;">Пароль должен содержать не менее 6 символов, включая хотя бы одну букву и одну цифру</p>
            <div class="password-input">
              <input 
                :type="confirmPasswordVisible ? 'text' : 'password'" 
                v-model="confirmPassword" 
                placeholder="Подтвердите пароль"
                @blur="validateConfirmPassword"
              />
              <span @click="toggleConfirmPasswordVisibility" class="password-toggle">{{ confirmPasswordVisible ? 'Hide' : 'Show' }}</span>
            </div>
            <p v-if="passwordMismatch" style="color: red;">Пароли не совпадают</p>
            <div class="agreement">
              <input v-model="agreement" type="checkbox" id="agreement" />
              <label for="agreement">Я согласен с <a href="/terms" target="_blank">пользовательским соглашением</a></label>
            </div>
            <vue3-recaptcha2
              v-if="isLocalhost()"
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              @verify="onCaptchaVerified"
              @expire="onCaptchaExpired"
            ></vue3-recaptcha2>
            <button @click="register" class="auth-button">Зарегистрироваться</button>
          </div>
          <div class="toggle-mode">
            <p>{{ isRegistered ? 'Уже есть аккаунт?' : 'Нет аккаунта?' }}</p>
            <a href="#" @click.prevent="isRegistered = !isRegistered">{{ isRegistered ? 'Войти' : 'Зарегистрироваться' }}</a>
          </div>
          <div class="contact-links">
            <h3>Связаться с нами</h3>
            <a href="https://t.me/hinomarucllaher" target="_blank">
              <img src="/src/assets/Contacts/icons8-телеграм-50.png" alt="Telegram" width="30" height="30">
            </a>
            <a href="https://instagram.com/hinomarucllaher5956" target="_blank">
              <img src="/src/assets/Contacts/icons8-instagram-50.png" alt="Instagram" width="30" height="30">
            </a>
            <a href="https://youtube.com/@Saitama000001" target="_blank">
              <img src="/src/assets/Contacts/icons8-youtube-50.png" alt="YouTube" width="30" height="30">
            </a>
          </div>
          <div class="legal-links"> 
            <span><a href="/legal-information">Legal information</a></span> 
          </div> 
          <div class="separator"></div>
          <div class="legal-links"> 
            <span><a href="/data-protection">Data protection</a></span> 
          </div>
        </div>
        <div class="advantages">
          <h3>Преимущества нашего сайта</h3>
          <ul>
            <li>Быстрая и простая регистрация</li>
            <li>Широкий выбор товаров</li>
            <li>Удобные фильтры для поиска</li>
            <li>Безопасная оплата и доставка</li>
            <li>Поддержка 24/7</li>
            <li>Индивидуальные скидки для постоянных клиентов</li>
            <li>Гарантия возврата средств</li>
            <li>Мобильная версия сайта</li>
            <li>Регулярные акции и распродажи</li>
            <li>Отзывчивая техническая поддержка</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue3Recaptcha2 from 'vue3-recaptcha2';

export default {
  components: {
    Vue3Recaptcha2,
  },
  data() {
    return {
      email: '',
      password: '',
      emailEntered: false,
      isRegistered: false,
      firstName: '',
      lastName: '',
      newEmail: '',
      newPassword: '',
      confirmPassword: '',
      agreement: false,
      isCaptchaVerified: false,
      passwordVisible: false,
      newPasswordVisible: false,
      confirmPasswordVisible: false,
      emailError: false,
      newEmailError: false,
      passwordError: false,
      newPasswordError: false,
      firstNameError: false,
      lastNameError: false,
      passwordMismatch: false,
    };
  },
  methods: {
    isLocalhost() {
      return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    },
    validateEmail() {
      const validDomains = ['gmail.com', 'mail.com', 'email.com'];
      const emailDomain = this.email.split('@')[1];
      if (!this.email.includes('@') || !validDomains.includes(emailDomain)) {
        this.emailError = true;
      } else {
        this.emailError = false;
      }
    },
    validateNewEmail() {
      const validDomains = ['gmail.com', 'mail.com', 'email.com'];
      const emailDomain = this.newEmail.split('@')[1];
      if (!this.newEmail.includes('@') || !validDomains.includes(emailDomain)) {
        this.newEmailError = true;
      } else {
        this.newEmailError = false;
      }
    },
    validatePassword() {
      const hasLetter = /[a-zA-Z]/.test(this.password);
      const hasNumber = /\d/.test(this.password);
      if (this.password.length < 6 || !hasLetter || !hasNumber) {
        this.passwordError = true;
      } else {
        this.passwordError = false;
      }
    },
    validateNewPassword() {
      const hasLetter = /[a-zA-Z]/.test(this.newPassword);
      const hasNumber = /\d/.test(this.newPassword);
      if (this.newPassword.length < 6 || !hasLetter || !hasNumber) {
        this.newPasswordError = true;
      } else {
        this.newPasswordError = false;
      }
    },
    validateConfirmPassword() {
      if (this.newPassword !== this.confirmPassword) {
        this.passwordMismatch = true;
      } else {
        this.passwordMismatch = false;
      }
    },
    validateFirstName() {
      if (!this.firstName) {
        this.firstNameError = true;
      } else {
        this.firstNameError = false;
      }
    },
    validateLastName() {
      if (!this.lastName) {
        this.lastNameError = true;
      } else {
        this.lastNameError = false;
      }
    },
    login() {
      if (this.emailError || this.passwordError) {
        this.$swal('Ошибка', 'Исправьте ошибки в форме', 'error');
        return;
      }
      const users = JSON.parse(localStorage.getItem('users')) || [];
      if (this.email === 'balaev134@gmail.com' && this.password === '_Sait_9087') {
        const adminIndex = users.findIndex(u => u.email === this.email);
        if (adminIndex === -1) {
          const adminUser = {
            id: Date.now(),
            name: 'Admin',
            surname: 'User',
            email: this.email,
            password: this.password,
            avatar: null,
            balance: 0,
          };
          users.push(adminUser);
          localStorage.setItem('users', JSON.stringify(users));
        }
        localStorage.setItem('userEmail', this.email);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('isAdmin', 'true');
        this.$router.push('/Profile');
        return;
      }
      const user = users.find(u => u.email === this.email && u.password === this.password);
      if (user) {
        localStorage.setItem('userEmail', this.email);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.removeItem('isAdmin');
        this.$router.push('/Profile');
      } else {
        this.$swal('Ошибка', 'Неверный email или пароль', 'error');
      }
    },
    register() {
      if (this.firstNameError || this.lastNameError || this.newEmailError || this.newPasswordError || this.passwordMismatch) {
        this.$swal('Ошибка', 'Исправьте ошибки в форме', 'error');
        return;
      }
      if (!this.agreement) {
        this.$swal('Ошибка', 'Необходимо согласиться с пользовательским соглашением', 'error');
        return;
      }
      const users = JSON.parse(localStorage.getItem('users')) || [];
      if (users.some(user => user.email === this.newEmail)) {
        this.$swal('Ошибка', 'Пользователь с таким email уже зарегистрирован', 'error');
        return;
      }
      const newUser = {
        id: Date.now(),
        name: this.firstName,
        surname: this.lastName,
        email: this.newEmail,
        password: this.newPassword,
        avatar: null,
        balance: 0,
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('userEmail', this.newEmail);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.removeItem('isAdmin');
      this.$swal('Успех', 'Регистрация успешна!', 'success');
      this.$router.push('/Profile');
    },
    onCaptchaVerified(response) {
      if (this.isLocalhost()) {
        this.isCaptchaVerified = true;
      }
    },
    onCaptchaExpired() {
      if (this.isLocalhost()) {
        this.isCaptchaVerified = false;
      }
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    toggleNewPasswordVisibility() {
      this.newPasswordVisible = !this.newPasswordVisible;
    },
    toggleConfirmPasswordVisibility() {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    },
  },
};
</script>

<style scoped>
/* Стили для юридических ссылок */
.legal-links { 
  padding: 15px; 
  color: black; 
}

/* Разделитель между юридическими ссылками */
.separator {
  border-bottom: 1px solid rgb(0, 0, 0); 
  width: 200px;
  margin-left: 100px;
}

/* Основной фон страницы */
body {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  margin: 0;
  padding: 0;
  height: 100vh;
}

/* Главный контейнер для центрирования всего содержимого */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
}

/* Обертка для блока регистрации и преимуществ */
.registration-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -200px;
  min-height: 100vh;
}

/* Контейнер для размещения регистрации и преимуществ рядом */
.registration-container {
  display: flex;
  gap: 40px; /* Расстояние между блоками */
  align-items: flex-start; /* Выравнивание по верхнему краю */
  max-width: 900px; /* Ограничение ширины для удобства */
  margin-top: 200px;
}

/* Блок регистрации */
.registration {
  width: 400px;
  padding: 40px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid rgba(255, 253, 253, 0.1);
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Эффект при наведении на блок регистрации */
.registration:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* Стили для заголовков */
h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
}

/* Стили для полей ввода */
input {
  display: block;
  width: 100%;
  margin-bottom: 15px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

/* Эффект фокуса для полей ввода */
input:focus {
  border-color: #000000;
  box-shadow: 0 0 8px rgba(3, 4, 5, 0.3);
  outline: none;
}

/* Стили для кнопок "Войти" и "Зарегистрироваться" */
.auth-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 50px;
  gap: 10px;
  width: 108%;
  height: 53px;
  background: #272727;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin: 0 auto 15px;
}

/* Эффект при наведении на кнопки */
.auth-button:hover { 
  background-color: #3a3a3a; /* Более светлый оттенок для hover */
  transform: translateY(-2px); 
}

/* Эффект при нажатии на кнопки */
.auth-button:active { 
  transform: translateY(0); 
}

/* Стили для отключенных кнопок */
.auth-button:disabled { 
  background-color: #a0a0a0; 
  cursor: not-allowed; 
  transform: none; 
}

/* Стили для чекбокса согласия */
.agreement { 
  display: flex; 
  align-items: center; 
  margin-bottom: 15px; 
}

.agreement input { 
  margin-right: 10px; 
  width: auto; 
}

/* Стили для ссылок */
a { 
  color: #000000; 
  text-decoration: none; 
  transition: color 0.3s ease; 
  text-decoration: underline; 
}

/* Контейнер для поля ввода пароля с переключателем видимости */
.password-input { 
  position: relative; 
  margin-bottom: 15px; /* Добавлен отступ для согласованности */
}

/* Переключатель видимости пароля */
.password-toggle {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 14px;
  color: #666666; /* Серый цвет вместо синего */
}

/* Эффект при наведении на переключатель пароля */
.password-toggle:hover { 
  text-decoration: underline; 
  color: #333333; /* Темно-серый при наведении */
}

/* Блок переключения между входом и регистрацией */
.toggle-mode { 
  margin-top: 20px; 
}

.toggle-mode a { 
  color: #666666; /* Серый цвет вместо синего */
  text-decoration: none; 
}

.toggle-mode a:hover { 
  text-decoration: underline; 
  color: #333333; /* Темно-серый при наведении */
}

/* Блок ссылок для связи */
.contact-links { 
  text-align: center; 
  margin-top: 20px; 
}

.contact-links a { 
  margin: 0 10px; 
  color: #666666; /* Серый цвет вместо синего */
}

.contact-links a:hover { 
  color: #333333; /* Темно-серый при наведении */
}

.contact-links img { 
  vertical-align: middle; 
}

/* Блок преимуществ */
.advantages {
  width: 300px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  min-height: 57vh;

}

/* Заголовок блока преимуществ */
.advantages h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  font-size: 40px;
  color: #333;
}

/* Список преимуществ */
.advantages ul {
  list-style-type: none;
  padding: 0;
  text-align: left;
  
  
}

/* Элементы списка преимуществ */
.advantages li {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
  font-size: 19px;
  position: relative;
  padding-left: 20px;
}

/* Псевдоэлемент для маркера списка */
.advantages li:before {
  content: "✔";
  color: #000000; /* Черный цвет галочек */
  position: absolute;
  left: 0;
}
</style>