# ✨ Course Visual Editor

🧱 Визуальный **drag-and-drop редактор курсов** на базе **React + Craft.js**  
📚 Подходит для LMS-платформ, образовательных админок, встроенных конструкторов.

---

## 🔗 Демо

> 🖼️ _Coming soon_ — добавьте скриншот, GIF или ссылку на видео

---

## 🚀 Возможности

- 🎨 **Редактор**: визуальное добавление и настройка компонентов (текст, изображение, видео и др.)
- 📄 **Мультистраничность**: добавление, переключение и редактирование страниц курса
- 👀 **Preview Mode**: полноэкранный режим просмотра с курсом и таймлайном
- 🖼️ **Viewport**: предпросмотр под Desktop 🖥️ / Tablet 📱 / Mobile 📲
- 📦 **Импорт / Экспорт JSON**: сериализация и восстановление страниц
- 🔁 **Автосохранение**: без потери данных при случайных изменениях
- 🧩 **Кастомные блоки**: легко добавляются и масштабируются
- ⌨️ **Горячие клавиши**: поддержка Undo/Redo, Delete и других
- 📐 **Resize + Move**: изменение размеров и позиционирование компонентов
- ⚙️ **Настройки компонентов**: кастомизация блоков через боковую панель
- 🪄 **Craft.js**: сериализация DOM-структуры в виде дерева компонентов

---

## 🧪 Стек технологий

| 🧩 Категория     | 💻 Используется                   |
|------------------|-----------------------------------|
| Язык             | JavaScript / TypeScript (CRA)     |
| UI               | React + TailwindCSS               |
| Canvas Engine    | Craft.js                          |
| Иконки           | Lucide React                      |
| Стили            | Tailwind + CSS-модули             |
| Хранение         | Context API + Local Storage       |

---

## 📁 Структура проекта

```bash
src/
├── components/          # 🧱 UI-компоненты: Canvas, Toolbox, Preview, Toolbar и т.д.
│   └── user/            # 🔧 Элементы редактора: Container, Image, Video и др.
├── contexts/            # 🧠 Контексты: PagesContext, HotkeyContext и т.д.
├── hooks/               # 🪝 Кастомные React-хуки
├── utils/               # 🛠️ Утилиты (serialize, debounce и прочее)
├── styles/              # 🎨 Tailwind конфиг и глобальные стили
├── pages/               # 📄 Страницы приложения (например, Editor)
└── App.jsx              # 🏁 Точка входа
# 🔽 Клонируем репозиторий
git clone https://github.com/your-username/course-visual-editor.git
cd course-visual-editor

# 📦 Устанавливаем зависимости
npm install

# ▶️ Запускаем в dev-режиме
npm start

# 🌐 Открываем в браузере
http://localhost:3000
MyComponent.craft = {
  displayName: 'My Block',
  props: { ... },
  related: {
    settings: MyComponentSettings
  }
};
{
  "id": "page-1",
  "title": "Lesson 1",
  "type": "lesson",
  "duration": "10 min",
  "content": "{...serialized JSON...}"
}
