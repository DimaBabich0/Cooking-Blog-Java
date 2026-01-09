# 📚 Полное руководство по архитектуре Cooking Blog

## 🎯 Оглавление

1. [Общая архитектура](#общая-архитектура)
2. [Frontend - Детальный разбор](#frontend---детальный-разбор)
3. [Backend - Детальный разбор](#backend---детальный-разбор)
4. [Взаимодействие Frontend ↔ Backend](#взаимодействие-frontend--backend)
5. [Ключевые паттерны и концепции](#ключевые-паттерны-и-концепции)
6. [Как создать похожий проект с нуля](#как-создать-похожий-проект-с-нуля)

---

## 🏗️ Общая архитектура

### Структура проекта

```
Cooking blog/
├── frontend/          # React приложение (публичный сайт)
├── CB_Backend/        # Spring Boot API (сервер)
└── cb_admin/          # React админ-панель (отдельное приложение)
```

### Технологический стек

**Frontend:**

- React 19 + TypeScript
- Vite (быстрый сборщик)
- React Router (навигация)
- SCSS Modules (стили)
- Swiper.js (слайдеры)

**Backend:**

- Spring Boot 3.5.7
- Spring Data JPA (работа с БД)
- Hibernate (ORM)
- Oracle Database
- Gradle (сборщик)

---

## 🌐 Frontend - Детальный разбор

### 1. Точка входа: `main.jsx`

```jsx
// main.jsx - это первая точка входа
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* Включает роутинг */}
      <AuthProvider>
        {" "}
        {/* Глобальное состояние авторизации */}
        <App /> {/* Главный компонент */}
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

**Что происходит:**

1. React монтирует приложение в `#root`
2. `BrowserRouter` включает навигацию по URL
3. `AuthProvider` оборачивает всё приложение и предоставляет данные пользователя
4. `App` рендерит маршруты и компоненты

---

### 2. Маршрутизация: `App.jsx`

```jsx
// App.jsx определяет все маршруты приложения
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/blog" element={<BlogPage />} />
  <Route path="/blog/:id" element={<BlogPostPage />} />
  <Route path="/recipes" element={<RecipesPage />} />
  <Route path="/recipes/:id" element={<RecipesPage />} />

  {/* Защищенные маршруты */}
  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    }
  />
</Routes>
```

**Ключевые концепции:**

- **Маршруты** - определяют, какой компонент показать при определенном URL
- **ProtectedRoute** - проверяет авторизацию перед показом страницы
- **Динамические маршруты** (`:id`) - позволяют передавать параметры в URL

---

### 3. Глобальное состояние: `AuthContext.tsx`

```typescript
// AuthContext предоставляет данные пользователя во всем приложении
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  // При загрузке приложения проверяем, авторизован ли пользователь
  useEffect(() => {
    refreshUser(); // Запрос к /api/auth/me
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Хук для использования в компонентах
export function useAuth() {
  return useContext(AuthContext);
}
```

**Как использовать:**

```tsx
function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return <div>Hello, {user.username}!</div>;
}
```

**Зачем это нужно:**

- Один раз проверяем авторизацию при загрузке
- Все компоненты имеют доступ к данным пользователя
- Не нужно передавать `user` через props в каждый компонент

---

### 4. API клиенты: `api/*.ts`

```typescript
// api/blogApi.ts - пример API клиента
const BLOG_API = "http://localhost:8080/api/blogs";

export async function getBlogs(): Promise<BlogDto[]> {
  const res = await fetch(BLOG_API);
  if (!res.ok) throw new Error("Error loading blogs");
  return res.json();
}

export async function createBlog(blog: Partial<BlogDto>): Promise<BlogDto> {
  const res = await fetch(BLOG_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blog),
  });
  if (!res.ok) throw new Error("Error creating blog");
  return res.json();
}
```

**Паттерн:**

- Один файл на одну сущность (blogApi, recipeApi, etc.)
- Функции для каждого действия (get, create, update, delete)
- Все функции возвращают Promise
- Обработка ошибок через throw

**Использование:**

```tsx
function BlogPage() {
  const [blogs, setBlogs] = useState<BlogDto[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getBlogs();
      setBlogs(data);
    }
    load();
  }, []);

  return <div>{/* отображение блогов */}</div>;
}
```

---

### 5. Компоненты: `components/*`

**Структура компонента:**

```
components/
  Button/
    Button.tsx          # Логика компонента
    Button.module.scss  # Стили (изолированные)
```

**Пример компонента:**

```tsx
// Button.tsx
import styles from "./Button.module.scss";

type ButtonProps = {
  variant?: "primary" | "secondary";
  children: ReactNode;
  onClick?: () => void;
};

export default function Button({
  variant = "primary",
  children,
  onClick,
}: ButtonProps) {
  return (
    <button className={`${styles.btn} ${styles[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
}
```

**SCSS Modules:**

```scss
// Button.module.scss
.btn {
  padding: 1rem 2rem;
  border-radius: 8px;

  &.primary {
    background: black;
    color: white;
  }
}
```

**Преимущества SCSS Modules:**

- Стили изолированы (не конфликтуют с другими)
- Автодополнение в IDE
- Можно использовать переменные из `variables.scss`

---

### 6. Страницы: `pages/*`

**Типичная структура страницы:**

```tsx
// BlogPage.tsx
export default function BlogPage() {
  // 1. Состояние
  const [blogs, setBlogs] = useState<BlogDto[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Загрузка данных
  useEffect(() => {
    async function loadBlogs() {
      try {
        const data = await getBlogs();
        setBlogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  // 3. Рендер
  if (loading) return <div>Loading...</div>;

  return (
    <section>
      <div className="container">
        <h1>Blogs</h1>
        {blogs.map((blog) => (
          <PostCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
}
```

**Паттерн:**

1. Объявляем состояние (useState)
2. Загружаем данные (useEffect + API)
3. Обрабатываем загрузку/ошибки
4. Рендерим UI

---

## 🔧 Backend - Детальный разбор

### 1. Архитектура: MVC + Layered Architecture

```
Controller (API endpoints)
    ↓
Service (бизнес-логика)
    ↓
Repository (работа с БД)
    ↓
Model (сущности БД)
```

---

### 2. Модели: `model/*.java`

```java
// Blog.java - сущность базы данных
@Entity
@Table(name = "CB_BLOGS")
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "CLOB")
    private String text;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters & Setters
}
```

**Аннотации (JPA/Hibernate):**

Эти аннотации — это функционал **JPA (Java Persistence API)** и **Hibernate** (самая популярная реализация JPA).

**Что это такое:**

- **JPA** — стандарт Java для работы с базами данных (ORM - Object-Relational Mapping)
- **Hibernate** — конкретная реализация JPA, которая автоматически преобразует Java объекты в SQL запросы
- **Spring Data JPA** — надстройка над JPA, которая упрощает работу с репозиториями

**Как это работает:**

1. Вы описываете класс с аннотациями → Hibernate понимает структуру таблицы
2. Вы вызываете `repository.save(blog)` → Hibernate автоматически генерирует SQL `INSERT INTO CB_BLOGS ...`
3. Вы вызываете `repository.findById(1)` → Hibernate генерирует SQL `SELECT * FROM CB_BLOGS WHERE id = 1`
4. Hibernate автоматически преобразует результат SQL запроса обратно в Java объект

**Аннотации:**

- `@Entity` - класс представляет таблицу в БД (Hibernate будет работать с этим классом)
- `@Table(name = "...")` - имя таблицы в БД (если не указано, используется имя класса)
- `@Id` - первичный ключ (обязательное поле)
- `@GeneratedValue` - автоинкремент (БД сама генерирует ID при создании)
- `@Column` - колонка в таблице (можно указать имя, nullable, length и т.д.)
- `@ManyToOne` - связь "многие к одному" (много блогов у одного пользователя)

**Пример работы:**

```java
// Вы пишете:
Blog blog = new Blog();
blog.setTitle("My Blog");
blogRepo.save(blog);

// Hibernate автоматически генерирует SQL:
// INSERT INTO CB_BLOGS (title, text, user_id) VALUES ('My Blog', NULL, NULL)
// И автоматически получает сгенерированный ID обратно
```

---

### 3. Репозитории: `repository/*.java`

```java
// BlogRepository.java - интерфейс для работы с БД
@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    // Spring автоматически создаст реализацию!

    // Можно добавить кастомные запросы
    @Query("SELECT b FROM Blog b WHERE b.user.id = :userId")
    List<Blog> findByUserId(@Param("userId") Long userId);
}
```

**Что дает JpaRepository:**

- `findAll()` - получить все
- `findById(id)` - найти по ID
- `save(entity)` - сохранить/обновить
- `deleteById(id)` - удалить
- И многое другое!

**Кастомные запросы:**

```java
// JPQL (Java Persistence Query Language)
@Query("SELECT b FROM Blog b WHERE b.title LIKE %:keyword%")
List<Blog> searchByTitle(@Param("keyword") String keyword);
```

---

### 4. Сервисы: `service/*.java`

```java
// BlogService.java - бизнес-логика
@Service
public class BlogService implements CrudService<BlogDto, Long> {
    private final BlogRepository blogRepo;
    private final UserRepository userRepo;

    // Dependency Injection через конструктор
    public BlogService(BlogRepository blogRepo, UserRepository userRepo) {
        this.blogRepo = blogRepo;
        this.userRepo = userRepo;
    }

    @Override
    public BlogDto create(BlogDto dto) {
        // 1. Валидация
        User user = userRepo.findById(dto.getUserDto().getId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Преобразование DTO → Entity
        Blog blog = new Blog();
        BlogMapper.updateEntity(blog, dto, user);

        // 3. Сохранение
        Blog saved = blogRepo.save(blog);

        // 4. Преобразование Entity → DTO
        return BlogMapper.toDto(saved);
    }
}
```

**Паттерн:**

1. Валидация входных данных
2. Преобразование DTO → Entity (через Mapper)
3. Сохранение в БД (через Repository)
4. Преобразование Entity → DTO (через Mapper)
5. Возврат DTO

---

### 5. Мапперы: `mapper/*.java`

```java
// BlogMapper.java - преобразование Entity ↔ DTO
public class BlogMapper {
    // Entity → DTO
    public static BlogDto toDto(Blog blog) {
        BlogDto dto = new BlogDto();
        dto.setId(blog.getId());
        dto.setTitle(blog.getTitle());
        dto.setText(blog.getText());

        // Преобразуем связанные сущности
        if (blog.getUser() != null) {
            dto.setUserDto(UserMapper.toDto(blog.getUser()));
        }

        return dto;
    }

    // DTO → Entity
    public static void updateEntity(Blog blog, BlogDto dto, User user) {
        blog.setTitle(dto.getTitle());
        blog.setText(dto.getText());
        blog.setUser(user);
    }
}
```

**Зачем нужны мапперы:**

- Entity содержит связи с другими Entity (User, Category)
- DTO содержит только ID или упрощенные объекты (UserDto)
- Мапперы преобразуют между этими форматами

---

### 6. DTO: `dto/*.java`

```java
// BlogDto.java - Data Transfer Object
public class BlogDto {
    private Long id;
    private String title;
    private String text;
    private UserDto userDto;  // Не полный User, а только DTO

    // Getters & Setters
}
```

**Зачем DTO:**

- Не отправляем всю структуру Entity (может быть циклическая зависимость)
- Контролируем, какие данные отправляем клиенту
- Можем добавить вычисляемые поля

---

### 7. Контроллеры: `controller/*.java`

```java
// BlogController.java - REST API endpoints
@RestController
@RequestMapping("/api/blogs")
public class BlogController extends AbstractCrudController<BlogDto, Long> {
    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @Override
    protected CrudService<BlogDto, Long> getService() {
        return blogService;
    }

    // Наследуем стандартные CRUD операции:
    // GET /api/blogs - все блоги
    // GET /api/blogs/{id} - один блог
    // POST /api/blogs - создать
    // PUT /api/blogs/{id} - обновить
    // DELETE /api/blogs/{id} - удалить
}
```

**AbstractCrudController:**

- Предоставляет стандартные CRUD операции
- Не нужно писать одни и те же методы в каждом контроллере
- Можно переопределить методы для кастомной логики

---

## 🔄 Взаимодействие Frontend ↔ Backend

### Полный цикл: Создание блога

**1. Frontend: Пользователь заполняет форму**

```tsx
// CreateBlogPage.tsx
function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 2. Отправляем данные на backend
    const blog = await createBlog({
      title,
      text,
      userDto: { id: user.id },
    });

    // 3. Перенаправляем на страницу блога
    navigate(`/blog/${blog.id}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit">Create</button>
    </form>
  );
}
```

**2. API клиент: Отправка HTTP запроса**

```typescript
// api/blogApi.ts
export async function createBlog(blog: Partial<BlogDto>): Promise<BlogDto> {
  const res = await fetch("http://localhost:8080/api/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blog), // Преобразуем объект в JSON
  });
  return res.json();
}
```

**3. Backend Controller: Прием запроса**

```java
// BlogController.java
@PostMapping
public BlogDto create(@RequestBody BlogDto dto) {
    return blogService.create(dto);
}
```

**4. Backend Service: Обработка**

```java
// BlogService.java
public BlogDto create(BlogDto dto) {
    User user = userRepo.findById(dto.getUserDto().getId())
        .orElseThrow(() -> new RuntimeException("User not found"));

    Blog blog = new Blog();
    BlogMapper.updateEntity(blog, dto, user);

    Blog saved = blogRepo.save(blog);
    return BlogMapper.toDto(saved);
}
```

**5. Repository: Сохранение в БД**

```java
// BlogRepository extends JpaRepository
// Spring автоматически реализует save()
```

**6. Ответ возвращается обратно:**

```
Backend → Frontend → Обновление UI
```

---

## 🎓 Ключевые паттерны и концепции

### 1. Dependency Injection (DI)

```java
// Spring автоматически создает и внедряет зависимости
@Service
public class BlogService {
    private final BlogRepository blogRepo;  // Spring создаст и передаст

    public BlogService(BlogRepository blogRepo) {
        this.blogRepo = blogRepo;  // Внедрение через конструктор
    }
}
```

### 2. Repository Pattern

- Абстракция над работой с БД
- Все запросы к БД через Repository
- Легко тестировать (можно заменить на mock)

### 3. DTO Pattern

- Отдельные объекты для передачи данных
- Не отправляем Entity напрямую
- Контроль над данными, которые отправляем

### 4. Mapper Pattern

- Преобразование Entity ↔ DTO
- Изоляция логики преобразования
- Легко тестировать

### 5. Abstract Controller

- Переиспользование кода
- Стандартные CRUD операции
- Расширяемость через наследование

### 6. React Hooks

- `useState` - локальное состояние
- `useEffect` - побочные эффекты (загрузка данных)
- `useContext` - глобальное состояние
- `useNavigate` - навигация

### 7. SCSS Modules

- Изолированные стили
- Нет конфликтов имен
- Автодополнение

---

## 🚀 Как создать похожий проект с нуля

### Шаг 1: Backend (Spring Boot)

**1. Создать проект:**

- Использовать Spring Initializr (start.spring.io)
- Выбрать: Spring Web, Spring Data JPA, Oracle Driver

**2. Структура:**

```
src/main/java/com/yourapp/
├── model/          # Entity классы
├── repository/     # Repository интерфейсы
├── dto/           # DTO классы
├── mapper/        # Mapper классы
├── service/       # Service классы
└── controller/    # Controller классы
```

**3. Порядок создания:**

1. Model (сущности БД)
2. Repository (интерфейсы)
3. DTO (объекты для передачи)
4. Mapper (преобразование)
5. Service (бизнес-логика)
6. Controller (API endpoints)

**4. Пример для сущности "Post":**

```java
// 1. Model
@Entity
@Table(name = "POSTS")
public class Post {
    @Id
    @GeneratedValue
    private Long id;
    private String title;
    // ...
}

// 2. Repository
@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
}

// 3. DTO
public class PostDto {
    private Long id;
    private String title;
    // ...
}

// 4. Mapper
public class PostMapper {
    public static PostDto toDto(Post post) { /* ... */ }
    public static void updateEntity(Post post, PostDto dto) { /* ... */ }
}

// 5. Service
@Service
public class PostService implements CrudService<PostDto, Long> {
    private final PostRepository postRepo;

    public PostDto create(PostDto dto) {
        Post post = new Post();
        PostMapper.updateEntity(post, dto);
        return PostMapper.toDto(postRepo.save(post));
    }
}

// 6. Controller
@RestController
@RequestMapping("/api/posts")
public class PostController extends AbstractCrudController<PostDto, Long> {
    private final PostService postService;

    protected CrudService<PostDto, Long> getService() {
        return postService;
    }
}
```

---

### Шаг 2: Frontend (React)

**1. Создать проект:**

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

**2. Установить зависимости:**

```bash
npm install react-router-dom sass
```

**3. Структура:**

```
src/
├── api/           # API клиенты
├── components/    # Переиспользуемые компоненты
├── pages/         # Страницы
├── contexts/      # React Context
└── styles/        # Глобальные стили
```

**4. Порядок создания:**

1. API клиенты (функции для запросов)
2. Компоненты (Button, Card, etc.)
3. Context (AuthContext для авторизации)
4. Страницы (HomePage, BlogPage, etc.)
5. Маршрутизация (App.jsx)

**5. Пример для страницы "Posts":**

```tsx
// 1. API клиент
// api/postApi.ts
export async function getPosts(): Promise<PostDto[]> {
  const res = await fetch("http://localhost:8080/api/posts");
  return res.json();
}

// 2. Страница
// pages/PostsPage.tsx
export default function PostsPage() {
  const [posts, setPosts] = useState<PostDto[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getPosts();
      setPosts(data);
    }
    load();
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}

// 3. Маршрут
// App.jsx
<Route path="/posts" element={<PostsPage />} />;
```

---

### Шаг 3: Подключение Frontend к Backend

**1. CORS настройка (Backend):**

```java
// WebConfig.java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173")  // Frontend URL
            .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

**2. API базовый URL (Frontend):**

```typescript
// api/config.ts
export const API_BASE = "http://localhost:8080/api";
```

---

## 📝 Чеклист для создания проекта

### Backend:

- [ ] Создать Spring Boot проект
- [ ] Настроить подключение к БД
- [ ] Создать Model классы
- [ ] Создать Repository интерфейсы
- [ ] Создать DTO классы
- [ ] Создать Mapper классы
- [ ] Создать Service классы
- [ ] Создать Controller классы
- [ ] Настроить CORS
- [ ] Протестировать API через Postman

### Frontend:

- [ ] Создать React проект
- [ ] Настроить React Router
- [ ] Создать API клиенты
- [ ] Создать базовые компоненты
- [ ] Создать Context для авторизации
- [ ] Создать страницы
- [ ] Настроить маршруты
- [ ] Добавить стили
- [ ] Протестировать интеграцию

---

## 🎯 Ключевые принципы

1. **Разделение ответственности:**

   - Frontend = UI и взаимодействие с пользователем
   - Backend = бизнес-логика и работа с БД

2. **DRY (Don't Repeat Yourself):**

   - Переиспользуемые компоненты
   - AbstractCrudController для стандартных операций
   - Общие функции в API клиентах

3. **Single Responsibility:**

   - Один компонент = одна задача
   - Один сервис = одна сущность
   - Один контроллер = один ресурс

4. **Type Safety:**
   - TypeScript на Frontend
   - Строгая типизация в Java
   - DTO для контроля данных

---

## 📚 Полезные ресурсы

- **Spring Boot:** https://spring.io/guides
- **React:** https://react.dev
- **React Router:** https://reactrouter.com
- **SCSS:** https://sass-lang.com
- **TypeScript:** https://www.typescriptlang.org

---

## ❓ Частые вопросы

**Q: Почему DTO, а не Entity напрямую?**
A: Entity может содержать циклические ссылки, лишние данные, связи с БД. DTO контролирует, что отправляем клиенту.

**Q: Зачем мапперы?**
A: Изоляция логики преобразования. Легко тестировать и изменять.

**Q: Почему AbstractCrudController?**
A: Избегаем дублирования кода. Стандартные CRUD операции одинаковы для всех сущностей.

**Q: Как работает авторизация?**
A: Frontend отправляет логин/пароль → Backend создает сессию → Frontend сохраняет в Context → Проверка через ProtectedRoute.

---

**Удачи в создании своего проекта! 🚀**
