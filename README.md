```markdown
# Intercity-Cargo

Платформа для управления грузоперевозками и участия в транспортных аукционах

---

## О проекте

Intercity-Cargo — это веб-платформа для автоматизации грузоперевозок. Система объединяет заказчиков и перевозчиков, предоставляя инструменты для создания заказов, участия в аукционах, отслеживания грузов и коммуникации.

**Основные возможности:**

- Создание и управление заказами на перевозку
- Система аукционов и транспортных тендеров
- База перевозчиков с рейтингами и отзывами
- Аналитика и отчетность
- Встроенный чат между участниками
- Отслеживание грузов в реальном времени
- Административная панель

---

## Технологии

**Frontend:** Vue 3, Vite, Pinia, Vue Router, Lucide Icons, Sass

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt

---

## Запуск проекта

**Требования:** Node.js 18+ и MongoDB

**Клонирование репозитория:**

```bash
git clone https://github.com/Sait5/Intercity-Cargo.git
cd Intercity-Cargo
```

**Настройка бэкенда:**

```bash
cd Backend
npm install
```

Создайте файл `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/intercity-cargo
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

Запустите сервер:

```bash
npm start
```

**Настройка фронтенда:**

```bash
cd ../frontend/intercity-cargo-delivery
npm install
```

Создайте файл `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

Запустите приложение:

```bash
npm run dev
```

Откройте в браузере: `http://localhost:5173`

---

## API Эндпоинты

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход |
| GET | `/api/users` | Список пользователей |
| GET | `/api/auctions` | Список аукционов |
| POST | `/api/auctions` | Создание аукциона |
| POST | `/api/auctions/:id/bid` | Ставка в аукционе |
| GET | `/api/reviews` | Список отзывов |
| POST | `/api/contacts` | Отправить заявку |

---

## Вклад в проект

1. Форкните репозиторий
2. Создайте ветку: `git checkout -b feature/YourFeature`
3. Закоммитьте изменения: `git commit -m 'Add YourFeature'`
4. Отправьте в ветку: `git push origin feature/YourFeature`
5. Откройте Pull Request

---

## Контакты

**Автор:** Балаев Сейт-Ахмет Алиевич

- GitHub: [Sait5](https://github.com/Sait5)
- Email: seyt-ahmet.balaev@example.com
- Telegram: @sait_balaev

---

## Лицензия

MIT License
```
