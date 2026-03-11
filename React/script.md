# 🎣 Полное руководство по хукам React

> Коллекция практических примеров использования встроенных и кастомных хуков React. Все примеры на русском языке с пояснениями.

---

## 📋 Оглавление

1. [Базовые хуки](#-базовые-хуки)
2. [Хуки производительности](#-хуки-производительности)
3. [Кастомные хуки](#-кастомные-хуки)
4. [Тестирование хуков](#-тестирование-хуков)

---

## 🔹 Базовые хуки

> Для управления состоянием, побочными эффектами, контекстом, ссылками на DOM и оптимизации рендеринга в функциональных компонентах.

### `useState` — Управление состоянием

```jsx
// src/components/Sidebar.jsx
import { useState } from "react";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(prev => !prev)}>
        {isOpen ? "Закрыть" : "Открыть"}
      </button>
      
      {isOpen && (
        <aside className="sidebar">
          <nav>
            <a href="/">Главная</a>
            <a href="/about">О нас</a>
            <a href="/contact">Контакты</a>
          </nav>
        </aside>
      )}
    </div>
  );
}
```

```bash
git add src/components/CounterWithHistory.jsx
git commit -m "feat: add CounterWithHistory with undo functionality"
```

```jsx
// src/components/LoginForm.jsx
import { useState } from "react";

export function LoginForm() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!values.email.includes("@")) newErrors.email = "Некорректный email";
    if (values.password.length < 6) newErrors.password = "Минимум 6 символов";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Успешный вход!");
      setValues({ email: "", password: "" });
    } catch (err) {
      setErrors({ form: "Ошибка авторизации" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input
          name="email"
          value={values.email}
          onChange={handleChange}
          className={errors.email ? "error" : ""}
        />
        {errors.email && <span className="error-msg">{errors.email}</span>}
      </div>

      <div>
        <label>Пароль</label>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          className={errors.password ? "error" : ""}
        />
        {errors.password && <span className="error-msg">{errors.password}</span>}
      </div>

      {errors.form && <div className="error-msg">{errors.form}</div>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Вход..." : "Войти"}
      </button>
    </form>
  );
}
```

```bash
git add src/components/LoginForm.jsx
git commit -m "feat: add LoginForm with validation and error handling"
```

---

### `useEffect`

> Для выполнения операций после рендера: подписки, запросы к API, манипуляции с DOM, таймеры, очистка ресурсов.

```jsx
// src/components/ModalWithEscape.jsx
import { useEffect, useState, useRef } from "react";

export function ModalWithEscape({ isOpen, onClose, title, children }) {
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstFocusableRef.current) {
          e.preventDefault();
          lastFocusableRef.current?.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusableRef.current) {
          e.preventDefault();
          firstFocusableRef.current?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    firstFocusableRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} role="dialog">
        <header>
          <h2>{title}</h2>
          <button ref={firstFocusableRef} onClick={onClose}>✕</button>
        </header>
        <main>{children}</main>
        <footer>
          <button ref={lastFocusableRef} onClick={onClose}>Закрыть</button>
        </footer>
      </div>
    </div>
  );
}
```

```bash
git add src/components/ModalWithEscape.jsx
git commit -m "feat: add ModalWithEscape with keyboard navigation and focus trap"
```

```jsx
// src/hooks/useWebSocket.js
# useWebSocket — кастомный хук для работы с WebSocket в React

`useWebSocket` — это кастомный хук React, который нужен для организации двусторонней связи в реальном времени между клиентом (браузером) и сервером.

## Основная задача

Обычный HTTP-запрос работает по схеме **«Запрос → Ответ»**: клиент должен сам спросить сервер, есть ли новые данные.

WebSocket работает по схеме **«Постоянный канал»**: сервер может сам отправить данные клиенту в любой момент, как только они появятся.

## Когда нужно использовать

1. **Чаты и мессенджеры**
   Сообщения должны появляться у собеседника мгновенно, без обновления страницы.

2. **Финансовые дашборды (биржа, криптовалюта)**
   Курсы валют меняются каждую секунду. Опрашивать сервер каждые 100 мс через HTTP — неэффективно и дорого.

3. **Уведомления в реальном времени**
   Например, «Ваш заказ готов» или «Новый лайк», которые всплывают сразу.

4. **Совместная работа (Collaboration)**
   Как в Google Docs: когда один пользователь печатает, другие видят изменения букву за буквой.

5. **Онлайн-игры и мультиплеер**
   Синхронизация позиций игроков и событий в реальном времени.

6. **Мониторинг систем**
   Отслеживание статуса серверов, логов или загрузки процессов в реальном времени.

---

## Что делает хук useWebSocket внутри

Вместо того чтобы писать логику подключения в каждом компоненте, хук инкапсулирует:

1. **Управление жизненным циклом**
   Автоматически открывает соединение при монтировании компонента (`useEffect`) и закрывает при размонтировании (cleanup), чтобы не было утечек памяти.

2. **Обработка состояний**
   Предоставляет готовые переменные: `isConnected` (подключено ли), `lastMessage` (последнее сообщение).

3. **Переподключение (Reconnect)**
   Если связь оборвалась, хук может автоматически попытаться соединиться снова через заданный интервал.

4. **Отправка данных**
   Предоставляет удобную функцию `sendMessage`, которая проверяет, открыто ли соединение перед отправкой.

---

## Пример использования (Чат)

```jsx
// src/hooks/useWebSocket.js
import { useEffect, useRef, useState } from "react";

export function useWebSocket(url, options = {}) {
  const { onMessage, onOpen, onError, reconnectInterval = 5000 } = options;
  const [lastMessage, setLastMessage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);

  useEffect(() => {
    const connect = () => {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = (event) => {
        setIsConnected(true);
        onOpen?.(event);
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setLastMessage(data);
        onMessage?.(data);
      };

      wsRef.current.onerror = (error) => {
        setIsConnected(false);
        onError?.(error);
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        reconnectTimerRef.current = setTimeout(connect, reconnectInterval);
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
    };
  }, [url, reconnectInterval]);

  const sendMessage = (data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  };

  return { lastMessage, isConnected, sendMessage };
}
```

```jsx
// src/components/ChatRoom.jsx
import { useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  
  const { lastMessage, isConnected, sendMessage } = useWebSocket(
    `wss://chat.example.com/ws?room=${roomId}`,
    {
      onMessage: (data) => {
        setMessages(prev => [...prev, data]);
      },
      reconnectInterval: 3000
    }
  );

  const handleSend = () => {
    if (!input.trim() || !isConnected) return;
    
    const message = { 
      text: input, 
      type: "message",
      timestamp: Date.now() 
    };
    
    sendMessage(message);
    setInput("");
  };

  return (
    <div>
      <div status={isConnected ? "online" : "offline"}>
        {isConnected ? "Онлайн" : "Оффлайн"}
      </div>
      
      <div className="messages">
        {messages.map((msg, index) => (
          <p key={index}>{msg.text}</p>
        ))}
      </div>

      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        placeholder="Введите сообщение..."
        disabled={!isConnected}
      />
      <button onClick={handleSend} disabled={!isConnected}>
        Отправить
      </button>
    </div>
  );
}
```

---

## Преимущества перед обычным fetch/axios

| Характеристика | HTTP (fetch/axios) | WebSocket (useWebSocket) |
|----------------|--------------------|--------------------------|
| Направление | Клиент → Сервер | Двустороннее (Клиент ↔ Сервер) |
| Обновления | Нужно опрашивать (polling) | Сервер пушит сам (push) |
| Задержка | Выше (handshake каждый раз) | Минимальная (постоянное соединение) |
| Нагрузка | Высокая при частых запросах | Низкая после установки соединения |
| Протокол | http/https | ws/wss |

---

## Полезные советы

1. **Всегда очищайте соединение**
   Хук должен закрывать WebSocket при размонтировании компонента, чтобы избежать утечек памяти.

2. **Обрабатывайте ошибки подключения**
   Пользователь должен видеть, если соединение потеряно, и иметь возможность переподключиться.

3. **Не храните чувствительные данные в URL**
   Используйте заголовки авторизации или токены в сообщении при подключении.

4. **Тестируйте переподключение**
   Имитируйте обрыв связи, чтобы убедиться, что хук корректно восстанавливает соединение.

5. **Оптимизируйте трафик**
   Отправляйте только необходимые данные, используйте бинарные форматы (ArrayBuffer) для больших объёмов.

---

## Итог

Используйте `useWebSocket`, когда вам нужна мгновенная доставка данных от сервера к клиенту без действия пользователя. Для обычных форм, загрузки страниц или редких запросов лучше подходит стандартный HTTP (`useFetch`/`axios`).
```

```bash
git add src/hooks/useWebSocket.js
git commit -m "feat: add useWebSocket custom hook with auto-reconnect"
```

```jsx
// src/hooks/useDocumentTitle.js
# useDocumentMeta — универсальный хук для управления мета-тегами

Аналог `useDocumentTitle`, но с поддержкой любых мета-тегов, линков и атрибутов документа.

```jsx
// src/hooks/useDocumentMeta.js
import { useEffect, useRef } from "react";

export function useDocumentMeta(metaConfig, options = {}) {
  const { restoreOnUnmount = true } = options;
  
  // Сохраняем исходные значения для восстановления
  const originalValuesRef = useRef({});

  useEffect(() => {
    if (!metaConfig) return;

    // Обработка заголовка страницы
    if (metaConfig.title) {
      originalValuesRef.current.title = originalValuesRef.current.title ?? document.title;
      document.title = metaConfig.title;
    }

    // Обработка мета-тегов
    if (metaConfig.meta) {
      Object.entries(metaConfig.meta).forEach(([name, content]) => {
        const selector = `meta[name="${name}"]`;
        let metaTag = document.querySelector(selector);
        
        if (!metaTag) {
          metaTag = document.createElement("meta");
          metaTag.setAttribute("name", name);
          document.head.appendChild(metaTag);
        }
        
        // Сохраняем оригинальное значение при первом изменении
        if (originalValuesRef.current.meta?.[name] === undefined) {
          originalValuesRef.current.meta = {
            ...originalValuesRef.current.meta,
            [name]: metaTag.getAttribute("content")
          };
        }
        
        metaTag.setAttribute("content", content);
      });
    }

    // Обработка OG-тегов (Open Graph)
    if (metaConfig.og) {
      Object.entries(metaConfig.og).forEach(([property, content]) => {
        const selector = `meta[property="og:${property}"]`;
        let ogTag = document.querySelector(selector);
        
        if (!ogTag) {
          ogTag = document.createElement("meta");
          ogTag.setAttribute("property", `og:${property}`);
          document.head.appendChild(ogTag);
        }
        
        if (originalValuesRef.current.og?.[property] === undefined) {
          originalValuesRef.current.og = {
            ...originalValuesRef.current.og,
            [property]: ogTag.getAttribute("content")
          };
        }
        
        ogTag.setAttribute("content", content);
      });
    }

    // Обработка link-тегов (canonical, icon и др.)
    if (metaConfig.links) {
      Object.entries(metaConfig.links).forEach(([rel, href]) => {
        const selector = `link[rel="${rel}"]`;
        let linkTag = document.querySelector(selector);
        
        if (!linkTag) {
          linkTag = document.createElement("link");
          linkTag.setAttribute("rel", rel);
          document.head.appendChild(linkTag);
        }
        
        if (originalValuesRef.current.links?.[rel] === undefined) {
          originalValuesRef.current.links = {
            ...originalValuesRef.current.links,
            [rel]: linkTag.getAttribute("href")
          };
        }
        
        linkTag.setAttribute("href", href);
      });
    }

    // Функция восстановления
    return () => {
      if (!restoreOnUnmount) return;

      if (metaConfig.title && originalValuesRef.current.title !== undefined) {
        document.title = originalValuesRef.current.title;
      }

      if (metaConfig.meta) {
        Object.keys(metaConfig.meta).forEach(name => {
          const original = originalValuesRef.current.meta?.[name];
          const metaTag = document.querySelector(`meta[name="${name}"]`);
          if (metaTag) {
            if (original !== undefined) {
              metaTag.setAttribute("content", original);
            } else {
              metaTag.remove(); // Удаляем созданный тег
            }
          }
        });
      }

      if (metaConfig.og) {
        Object.keys(metaConfig.og).forEach(property => {
          const original = originalValuesRef.current.og?.[property];
          const ogTag = document.querySelector(`meta[property="og:${property}"]`);
          if (ogTag) {
            if (original !== undefined) {
              ogTag.setAttribute("content", original);
            } else {
              ogTag.remove();
            }
          }
        });
      }

      if (metaConfig.links) {
        Object.keys(metaConfig.links).forEach(rel => {
          const original = originalValuesRef.current.links?.[rel];
          const linkTag = document.querySelector(`link[rel="${rel}"]`);
          if (linkTag) {
            if (original !== undefined) {
              linkTag.setAttribute("href", original);
            } else {
              linkTag.remove();
            }
          }
        });
      }
    };
  }, [metaConfig, restoreOnUnmount]);
}
```

---

## Специализированные хуки на базе useDocumentMeta

### useFavicon — смена иконки вкладки

```jsx
// src/hooks/useFavicon.js
import { useEffect, useRef } from "react";

export function useFavicon(href, options = {}) {
  const { restoreOnUnmount = true } = options;
  const originalHrefRef = useRef(null);

  useEffect(() => {
    if (!href) return;

    let link = document.querySelector("link[rel*='icon']");
    
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    originalHrefRef.current = originalHrefRef.current ?? link.getAttribute("href");
    link.setAttribute("href", href);

    return () => {
      if (restoreOnUnmount && originalHrefRef.current) {
        link.setAttribute("href", originalHrefRef.current);
      }
    };
  }, [href, restoreOnUnmount]);
}
```

### useCanonical — установка canonical URL для SEO

```jsx
// src/hooks/useCanonical.js
import { useEffect, useRef } from "react";

export function useCanonical(href, options = {}) {
  const { restoreOnUnmount = true } = options;
  const originalHrefRef = useRef(null);

  useEffect(() => {
    if (!href) return;

    let canonical = document.querySelector('link[rel="canonical"]');
    
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    originalHrefRef.current = originalHrefRef.current ?? canonical.getAttribute("href");
    canonical.setAttribute("href", href);

    return () => {
      if (restoreOnUnmount && originalHrefRef.current) {
        canonical.setAttribute("href", originalHrefRef.current);
      }
    };
  }, [href, restoreOnUnmount]);
}
```

### useOGTags — управление Open Graph тегами для соцсетей

```jsx
// src/hooks/useOGTags.js
import { useEffect, useRef } from "react";

export function useOGTags(ogData, options = {}) {
  const { restoreOnUnmount = true } = options;
  const originalValuesRef = useRef({});

  useEffect(() => {
    if (!ogData) return;

    Object.entries(ogData).forEach(([property, content]) => {
      const selector = `meta[property="og:${property}"]`;
      let tag = document.querySelector(selector);
      
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", `og:${property}`);
        document.head.appendChild(tag);
      }
      
      if (originalValuesRef.current[property] === undefined) {
        originalValuesRef.current[property] = tag.getAttribute("content");
      }
      
      tag.setAttribute("content", content);
    });

    return () => {
      if (!restoreOnUnmount) return;
      
      Object.keys(ogData).forEach(property => {
        const original = originalValuesRef.current[property];
        const tag = document.querySelector(`meta[property="og:${property}"]`);
        if (tag) {
          if (original !== undefined) {
            tag.setAttribute("content", original);
          } else {
            tag.remove();
          }
        }
      });
    };
  }, [ogData, restoreOnUnmount]);
}
```

### useStructuredData — добавление JSON-LD для SEO

```jsx
// src/hooks/useStructuredData.js
import { useEffect, useRef } from "react";

export function useStructuredData(data, options = {}) {
  const { restoreOnUnmount = true, id = "structured-data" } = options;
  const originalContentRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    let script = document.getElementById(id);
    
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    originalContentRef.current = originalContentRef.current ?? script.textContent;
    script.textContent = JSON.stringify(data);

    return () => {
      if (restoreOnUnmount) {
        if (originalContentRef.current) {
          script.textContent = originalContentRef.current;
        } else {
          script.remove();
        }
      }
    };
  }, [data, id, restoreOnUnmount]);
}
```

---

## Примеры использования

### Базовое использование useDocumentMeta

```jsx
// src/pages/ArticlePage.jsx
import { useDocumentMeta } from "../hooks/useDocumentMeta";

function ArticlePage({ article }) {
  useDocumentMeta({
    title: `${article.title} | Мой блог`,
    description: article.excerpt,
    meta: {
      description: article.excerpt,
      keywords: article.tags.join(", "),
      author: article.author.name
    },
    og: {
      title: article.title,
      description: article.excerpt,
      image: article.coverImage,
      type: "article",
      url: window.location.href
    },
    links: {
      canonical: `https://mysite.com/articles/${article.slug}`
    }
  });

  return (
    <article>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
    </article>
  );
}
```

### Использование специализированных хуков

```jsx
// src/pages/ProductPage.jsx
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useFavicon } from "../hooks/useFavicon";
import { useCanonical } from "../hooks/useCanonical";
import { useOGTags } from "../hooks/useOGTags";
import { useStructuredData } from "../hooks/useStructuredData";

function ProductPage({ product }) {
  // Заголовок страницы
  useDocumentTitle(`${product.name} — купить в магазине`);
  
  // Иконка вкладки
  useFavicon("/favicon-shop.png");
  
  // Canonical URL
  useCanonical(`https://shop.com/products/${product.slug}`);
  
  // Open Graph для соцсетей
  useOGTags({
    title: product.name,
    description: product.description,
    image: product.images[0],
    type: "product",
    price: {
      amount: product.price,
      currency: product.currency
    }
  });
  
  // Structured Data для Google
  useStructuredData({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: product.inStock 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock"
    }
  });

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>{product.price} {product.currency}</span>
    </div>
  );
}
```

### Динамическое обновление при навигации

```jsx
// src/components/SEO.jsx
import { useEffect } from "react";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

export function SEO({ pageData, location }) {
  useDocumentMeta({
    title: pageData.title,
    meta: {
      description: pageData.description,
      keywords: pageData.keywords
    },
    og: {
      title: pageData.title,
      description: pageData.description,
      image: pageData.image,
      url: location.href
    }
  }, { restoreOnUnmount: false }); // Не восстанавливаем при навигации в SPA

  return null;
}

// Использование в роутере
function App() {
  const location = useLocation();
  
  return (
    <>
      <SEO 
        pageData={getPageData(location.pathname)} 
        location={location} 
      />
      <Routes>
        {/* ваши маршруты */}
      </Routes>
    </>
  );
}
```

---

## Коммиты для Git

```bash
git add src/hooks/useDocumentMeta.js
git commit -m "feat: add useDocumentMeta hook for managing meta tags, OG and links"

git add src/hooks/useFavicon.js
git commit -m "feat: add useFavicon hook for dynamic favicon management"

git add src/hooks/useCanonical.js
git commit -m "feat: add useCanonical hook for SEO canonical URLs"

git add src/hooks/useOGTags.js
git commit -m "feat: add useOGTags hook for Open Graph social media tags"

git add src/hooks/useStructuredData.js
git commit -m "feat: add useStructuredData hook for JSON-LD schema markup"

git add src/components/SEO.jsx
git commit -m "feat: add reusable SEO component with dynamic meta updates"
```

---

## Преимущества подхода

1. **Инкапсуляция логики** — не нужно дублировать код работы с DOM в каждом компоненте
2. **Автоматическая очистка** — хук сам восстанавливает исходные значения при размонтировании
3. **Гибкость** — один хук покрывает все мета-теги, можно создавать специализированные обёртки
4. **Безопасность** — проверка существования элементов перед модификацией
5. **Производительность** — изменения применяются только при изменении зависимостей

---

## Итог

Используйте `useDocumentMeta` и его специализированные версии, когда нужно динамически управлять SEO-параметрами, заголовком, иконкой или мета-тегами в зависимости от контента страницы. Это особенно полезно в SPA, где навигация не перезагружает документ и мета-информация не обновляется автоматически.
```

```bash
git add src/hooks/useDocumentTitle.js
git commit -m "feat: add useDocumentTitle hook for SEO meta management"
```

---

### `useContext` — Глобальное состояние

> Для доступа к данным из любого компонента без пропс-драйлинга: темы, авторизация, настройки, локализация.

```jsx
// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || 
           (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
```

```bash
git add src/context/ThemeContext.jsx
git commit -m "feat: add ThemeContext with localStorage persistence"
```

```jsx
// src/components/ThemeToggle.jsx
import { useTheme } from "../context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} aria-label="Переключить тему">
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
```

```bash
git add src/components/ThemeToggle.jsx
git commit -m "feat: add ThemeToggle button component"
```

```jsx
// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("/api/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) throw new Error("Неверные данные");
    
    const { token, user: userData } = await response.json();
    localStorage.setItem("token", token);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

```bash
git add src/context/AuthContext.jsx
git commit -m "feat: add AuthContext with login/logout and token persistence"
```

---

### `useRef` — DOM и сохранение значений

> Для получения прямого доступа к элементам DOM и хранения изменяемых значений без триггера перерендера.

```jsx
// src/components/AutoFocusInput.jsx
import { useRef, useEffect } from "react";

export function AutoFocusInput({ shouldFocus = true }) {
  const inputRef = useRef(null);
  const renderCountRef = useRef(0);

  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [shouldFocus]);

  useEffect(() => {
    renderCountRef.current += 1;
  });

  const scrollToBottom = () => {
    inputRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <input ref={inputRef} placeholder="Авто-фокус..." />
      <button onClick={scrollToBottom}>📍 Прокрутить к полю</button>
      <small>Рендеров: {renderCountRef.current}</small>
    </div>
  );
}
```

```bash
git add src/components/AutoFocusInput.jsx
git commit -m "feat: add AutoFocusInput with scrollIntoView functionality"
```

```jsx
// src/hooks/usePrevious.js
import { useRef, useEffect } from "react";

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}

export function useFirstRender() {
  const isFirstRender = useRef(true);
  useEffect(() => {
    isFirstRender.current = false;
  }, []);
  return isFirstRender.current;
}
```

```bash
git add src/hooks/usePrevious.js
git commit -m "feat: add usePrevious and useFirstRender utility hooks"
```

---

### `useMemo` / `useCallback` — Оптимизация

> Для кэширования вычислений и функций, чтобы избежать лишних перерендеров дочерних компонентов и тяжёлых операций.

```jsx
// src/components/SmartList.jsx
import { useMemo, useState, useCallback } from "react";

export function SmartList({ items }) {
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const processedItems = useMemo(() => {
    let result = items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );

    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      
      if (typeof aVal === "string") {
        return sortOrder === "asc" 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [items, filter, sortKey, sortOrder]);

  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);

  const toggleSort = useCallback((key) => {
    setSortKey(key);
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  }, []);

  return (
    <div>
      <input 
        value={filter} 
        onChange={handleFilterChange} 
        placeholder="Фильтр..." 
      />
      
      <div>
        <button onClick={() => toggleSort("name")}>
          Сортировать по имени {sortKey === "name" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button onClick={() => toggleSort("price")}>
          По цене {sortKey === "price" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
      </div>

      <ul>
        {processedItems.map(item => (
          <li key={item.id}>{item.name} — ${item.price}</li>
        ))}
      </ul>
    </div>
  );
}
```

```bash
git add src/components/SmartList.jsx
git commit -m "feat: add SmartList with useMemo filtering and sorting"
```

```jsx
// src/components/ExpensiveChild.jsx
import { memo, useMemo, useCallback } from "react";

const ExpensiveChild = memo(({ data, onAction }) => {
  const heavyValue = useMemo(() => {
    return data.items.reduce((sum, item) => sum + item.value, 0);
  }, [data.items]);

  return (
    <div>
      <h3>{data.title}</h3>
      <p>Сумма: {heavyValue}</p>
      <button onClick={() => onAction(data.id)}>Действие</button>
    </div>
  );
});

export function ParentList({ items }) {
  const [search, setSearch] = useState("");

  const handleAction = useCallback((id) => {
    console.log("Action for:", id);
  }, []);

  const filtered = useMemo(() => 
    items.filter(item => item.title.includes(search)), 
    [items, search]
  );

  return (
    <>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      {filtered.map(item => (
        <ExpensiveChild 
          key={item.id} 
          data={item} 
          onAction={handleAction}
        />
      ))}
    </>
  );
}
```

```bash
git add src/components/ExpensiveChild.jsx src/components/ParentList.jsx
git commit -m "feat: add ExpensiveChild with React.memo and useCallback optimization"
```

---

### `useReducer` 

> Для управления сложным состоянием с множеством подзначений, когда useState становится неудобным: формы, корзины, машины состояний.

```jsx
// src/reducers/cartReducer.js
export const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i => 
            i.id === action.payload.id 
              ? { ...i, quantity: i.quantity + 1 } 
              : i
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    }
    
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload)
      };
    
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id 
            ? { ...i, quantity: Math.max(0, action.payload.quantity) } 
            : i
        ).filter(i => i.quantity > 0)
      };
    
    case "CLEAR_CART":
      return { ...state, items: [] };
    
    case "APPLY_DISCOUNT":
      return { ...state, discount: action.payload };
    
    default:
      return state;
  }
};

export const calculateTotal = (items, discount = 0) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return subtotal * (1 - discount / 100);
};
```

```bash
git add src/reducers/cartReducer.js
git commit -m "feat: add cartReducer with add/remove/update/clear actions"
```

```jsx
// src/components/Cart.jsx
import { useReducer, useMemo } from "react";
import { cartReducer, calculateTotal } from "../reducers/cartReducer";

export function Cart() {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    discount: 0
  });

  const total = useMemo(() => 
    calculateTotal(state.items, state.discount), 
    [state.items, state.discount]
  );

  return (
    <div>
      <h2>Корзина ({state.items.length})</h2>
      
      {state.items.map(item => (
        <div key={item.id}>
          <span>{item.name}</span>
          <button onClick={() => dispatch({ 
            type: "UPDATE_QUANTITY", 
            payload: { id: item.id, quantity: item.quantity - 1 } 
          })}>−</button>
          <span>{item.quantity}</span>
          <button onClick={() => dispatch({ 
            type: "UPDATE_QUANTITY", 
            payload: { id: item.id, quantity: item.quantity + 1 } 
          })}>+</button>
          <button onClick={() => dispatch({ 
            type: "REMOVE_ITEM", 
            payload: item.id 
          })}>🗑</button>
        </div>
      ))}
      
      {state.discount > 0 && <p>Скидка: {state.discount}%</p>}
      <p><strong>Итого: ${total.toFixed(2)}</strong></p>
      
      <button onClick={() => dispatch({ type: "CLEAR_CART" })}>
        Очистить корзину
      </button>
    </div>
  );
}
```

```bash
git add src/components/Cart.jsx
git commit -m "feat: add Cart component with useReducer state management"
```

---

## Хуки производительности

> Для оптимизации рендеринга, отложенных обновлений и работы с тяжёлыми вычислениями без блокировки интерфейса.

### `useTransition` — Неблокирующий интерфейс

```jsx
// src/components/LargeListSearch.jsx
import { useState, useTransition, useMemo } from "react";

export function LargeListSearch({ allItems }) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showDetails, setShowDetails] = useState(false);

  const filteredItems = useMemo(() => {
    if (!query) return allItems.slice(0, 50);
    
    return allItems
      .filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 50);
  }, [allItems, query]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    startTransition(() => {
      console.log("🔄 Обновляем список...");
    });
  };

  return (
    <div>
      <input 
        value={query} 
        onChange={handleSearch} 
        placeholder="Поиск..." 
      />
      
      {isPending && <span className="spinner">⏳ Загрузка...</span>}
      
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? "▲" : "▼"}
            </button>
            {showDetails && <p>{item.description}</p>}
          </li>
        ))}
      </ul>
      
      <p>Найдено: {filteredItems.length} из {allItems.length}</p>
    </div>
  );
}
```

```bash
git add src/components/LargeListSearch.jsx
git commit -m "feat: add LargeListSearch with useTransition for non-blocking UI"
```

### `useDeferredValue` — Отложенное обновление контента

```jsx
// src/components/DeferredSearch.jsx
import { useState, useDeferredValue, useMemo } from "react";

export function DeferredSearch({ items }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    if (!deferredQuery) return items.slice(0, 20);
    
    return items
      .filter(item => {
        return item.name.toLowerCase().includes(deferredQuery.toLowerCase()) ||
               item.tags?.some(tag => tag.includes(deferredQuery));
      })
      .slice(0, 100);
  }, [items, deferredQuery]);

  const isStale = query !== deferredQuery;

  return (
    <div>
      <input 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
        placeholder="Поиск..." 
      />
      
      {isStale && <div className="loading-bar">Обновление...</div>}
      
      <div className={isStale ? "faded" : ""}>
        {results.map(item => (
          <div key={item.id} className="result-item">
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

```bash
git add src/components/DeferredSearch.jsx
git commit -m "feat: add DeferredSearch with useDeferredValue for smooth updates"
```

### `useLayoutEffect` — Синхронные измерения DOM

```jsx
// src/hooks/useMeasure.js
# useMeasure — хук для измерения размеров элементов

## Для чего используется

`useMeasure` — это хук React, который позволяет получать точные размеры и координаты любого DOM-элемента в реальном времени. Он возвращает `ref` для привязки к элементу и объект `bounds` с геометрическими данными.

## Основные сценарии использования

1. **Позиционирование всплывающих элементов**
   Тултипы, дропдауны, контекстные меню, которые должны отображаться рядом с целевым элементом.

2. **Анимации и переходы**
   Вычисление начальных и конечных координат для плавных анимаций перемещения или изменения размера.

3. **Адаптивная вёрстка**
   Отслеживание изменения размеров контейнера для перестроения сетки или переключения режимов отображения.

4. **Виртуализация списков**
   Измерение высоты элементов для корректного расчёта области прокрутки и ленивой подгрузки контента.

5. **Drag-and-drop интерфейсы**
   Определение границ области для валидации перетаскивания и расчёта зоны сброса.

6. **Графики и визуализация данных**
   Получение размеров контейнера для корректного масштабирования канваса или SVG.

---

## Что возвращает хук

```jsx
const [ref, bounds] = useMeasure();

// bounds содержит:
{
  left: number,    // отступ слева относительно окна
  top: number,     // отступ сверху относительно окна
  width: number,   // ширина элемента
  height: number,  // высота элемента
  x: number,       // alias для left
  y: number        // alias для top
}
```

---

## Почему useLayoutEffect, а не useEffect

- `useLayoutEffect` выполняется синхронно после изменений DOM, но до отрисовки на экране
- Это позволяет измерить элемент и обновить стили до того, как пользователь увидит промежуточное состояние
- Избегает визуальных скачков и мерцаний при позиционировании

---

## Пример: Tooltip — всплывающая подсказка

```jsx
// src/hooks/useMeasure.js
import { useRef, useLayoutEffect, useState } from "react";

export function useMeasure() {
  const ref = useRef(null);
  const [bounds, setBounds] = useState({
    left: 0, top: 0, width: 0, height: 0
  });

  useLayoutEffect(() => {
    const updateBounds = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setBounds({
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          x: rect.x,
          y: rect.y
        });
      }
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  return [ref, bounds];
}
```

```jsx
// src/components/Tooltip.jsx
import { useState, useLayoutEffect } from "react";

export function Tooltip({ targetRef, children }) {
  const [tooltipRef, bounds] = useMeasure();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (targetRef?.current && tooltipRef?.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      setPosition({
        top: targetRect.bottom + window.scrollY + 8,
        left: targetRect.left + (targetRect.width - tooltipRect.width) / 2
      });
    }
  }, [bounds, targetRef]);

  return (
    <div 
      ref={tooltipRef}
      style={{ 
        position: "absolute", 
        top: position.top, 
        left: position.left,
        visibility: targetRef?.current ? "visible" : "hidden"
      }}
      className="tooltip"
    >
      {children}
    </div>
  );
}
```

```jsx
// src/components/ButtonWithTooltip.jsx
import { useRef, useState } from "react";
import { Tooltip } from "./Tooltip";

export function ButtonWithTooltip() {
  const buttonRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={buttonRef}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        Наведи на меня
      </button>
      
      {showTooltip && (
        <Tooltip targetRef={buttonRef}>
          Это всплывающая подсказка
        </Tooltip>
      )}
    </div>
  );
}
```

---

## Коммиты для Git

```bash
git add src/hooks/useMeasure.js
git commit -m "feat: add useMeasure hook for element dimensions tracking"

git add src/components/Tooltip.jsx
git commit -m "feat: add Tooltip component with dynamic positioning using useMeasure"

git add src/components/ButtonWithTooltip.jsx
git commit -m "feat: add ButtonWithTooltip example demonstrating useMeasure usage"
```

---

## Преимущества подхода

1. **Точность измерений**
   Использует `getBoundingClientRect()`, который учитывает трансформации, масштабирование и прокрутку.

2. **Реактивность**
   Автоматически пересчитывает размеры при изменении окна или содержимого элемента.

3. **Изоляция логики**
   Хук можно переиспользовать в любых компонентах, где нужно измерять элементы.

4. **Производительность**
   Измерения выполняются только при необходимости, подписка на `resize` корректно очищается.

5. **Безопасность**
   Проверка `ref.current` предотвращает ошибки при работе с не примонтированными элементами.

---

## Ограничения и улучшения

### Текущие ограничения

- Не отслеживает изменение размера самого элемента (только окна)
- Не учитывает прокрутку внутри контейнеров с `overflow`
- Может вызывать лишние ререндеры при частых изменениях

### Улучшенная версия с ResizeObserver

```jsx
// src/hooks/useMeasure.js (улучшенная)
import { useRef, useState, useLayoutEffect } from "react";

export function useMeasure() {
  const ref = useRef(null);
  const [bounds, setBounds] = useState({
    left: 0, top: 0, width: 0, height: 0, x: 0, y: 0
  });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateBounds = () => {
      const rect = element.getBoundingClientRect();
      setBounds({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y
      });
    };

    updateBounds();

    // ResizeObserver отслеживает изменение размера самого элемента
    const resizeObserver = new ResizeObserver(updateBounds);
    resizeObserver.observe(element);

    // Слушатели для прокрутки и изменения окна
    window.addEventListener("resize", updateBounds);
    window.addEventListener("scroll", updateBounds, true);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("scroll", updateBounds, true);
    };
  }, []);

  return [ref, bounds];
}
```

---

## Практические примеры

### Пример 1: Выпадающее меню с авто-позиционированием

```jsx
function Dropdown({ trigger, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [triggerBounds] = useMeasure();

  // Позиционирование меню относительно триггера
  const menuStyle = {
    position: "absolute",
    top: triggerBounds.top + triggerBounds.height,
    left: triggerBounds.left,
    minWidth: triggerBounds.width
  };

  return (
    <div style={{ position: "relative" }}>
      <button ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </button>
      
      {isOpen && (
        <div ref={menuRef} style={menuStyle} className="dropdown-menu">
          {items.map(item => (
            <div key={item.id} className="dropdown-item">{item.label}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Пример 2: Анимация перехода между элементами

```jsx
function MorphingCard({ activeId, items }) {
  const refs = useRef({});
  const [activeBounds, setActiveBounds] = useState(null);

  useLayoutEffect(() => {
    if (activeId && refs.current[activeId]) {
      const rect = refs.current[activeId].getBoundingClientRect();
      setActiveBounds(rect);
    }
  }, [activeId]);

  return (
    <div>
      {items.map(item => (
        <div
          key={item.id}
          ref={el => refs.current[item.id] = el}
          className={item.id === activeId ? "card active" : "card"}
        >
          {item.content}
        </div>
      ))}
      
      {activeBounds && (
        <div 
          className="card-morph-overlay"
          style={{
            position: "fixed",
            top: activeBounds.top,
            left: activeBounds.left,
            width: activeBounds.width,
            height: activeBounds.height
          }}
        />
      )}
    </div>
  );
}
```

### Пример 3: Виртуализированный список

```jsx
function VirtualList({ items, itemHeight, containerHeight }) {
  const containerRef = useRef(null);
  const [containerBounds] = useMeasure();
  
  // Вычисляем видимый диапазон
  const startIndex = Math.floor(containerBounds.top / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2;
  const visibleItems = items.slice(startIndex, startIndex + visibleCount);

  return (
    <div 
      ref={containerRef}
      style={{ height: containerHeight, overflow: "auto", position: "relative" }}
    >
      <div style={{ height: items.length * itemHeight, position: "relative" }}>
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            style={{
              position: "absolute",
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
              width: "100%"
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Итог

`useMeasure`, когда компоненту нужно знать точные размеры или позицию элемента для:

- динамического позиционирования всплывающих окон
- расчёта анимаций и переходов
- адаптации интерфейса под доступное пространство
- реализации сложных интерактивных паттернов

Хук особенно полезен в сочетании с `useLayoutEffect`, так как позволяет применять вычисления до отрисовки, избегая визуальных артефактов.
```

```bash
git add src/hooks/useMeasure.js
git commit -m "feat: add useMeasure hook with useLayoutEffect for DOM measurements"
```

---

# useLocalStorage / useSessionStorage

> Для сохранения данных в хранилище браузера с автоматической синхронизацией между вкладками и реактивным обновлением состояния в компоненте.

```jsx
// src/hooks/useStorage.js
import { useState, useEffect } from "react";

function useStorage(key, initialValue, storage = localStorage) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.storageArea === storage) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          // Игнорируем ошибки парсинга
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, storage]);

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;
      
      setStoredValue(valueToStore);
      storage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  };

  const remove = () => {
    try {
      storage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  };

  return [storedValue, setValue, remove];
}

export function useLocalStorage(key, initialValue) {
  return useStorage(key, initialValue, localStorage);
}

export function useSessionStorage(key, initialValue) {
  return useStorage(key, initialValue, sessionStorage);
}
```

```jsx
// Пример использования: сохранение темы и корзины
import { useLocalStorage } from "../hooks/useStorage";

function ShoppingCart() {
  const [cart, setCart, clearCart] = useLocalStorage("cart", []);
  const [theme, setTheme] = useLocalStorage("theme", "light");

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  return (
    <div data-theme={theme}>
      <button onClick={() => setTheme(t => t === "light" ? "dark" : "light")}>
        Переключить тему
      </button>
      
      <ul>
        {cart.map(item => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => removeFromCart(item.id)}>Удалить</button>
          </li>
        ))}
      </ul>
      
      <button onClick={clearCart}>Очистить корзину</button>
    </div>
  );
}
```

```bash
git add src/hooks/useStorage.js
git commit -m "feat: add useLocalStorage and useSessionStorage hooks with cross-tab sync"
```

---

# useFetch / useAsync

> Для выполнения асинхронных запросов с автоматической обработкой состояний загрузки, ошибок и отмены запросов при размонтировании компонента.

```jsx
// src/hooks/useAsync.js
import { useState, useEffect, useCallback, useRef } from "react";

export function useAsync(asyncFn, options = {}) {
  const { immediate = false, dependencies = [] } = options;
  
  const [state, setState] = useState({
    data: null,
    error: null,
    isLoading: false,
    isReady: false
  });
  
  const mountedRef = useRef(true);
  const abortControllerRef = useRef(null);

  const execute = useCallback(async (...args) => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await asyncFn(...args, { 
        signal: abortControllerRef.current.signal 
      });
      
      if (mountedRef.current) {
        setState({ data: result, error: null, isLoading: false, isReady: true });
        return result;
      }
    } catch (error) {
      if (error.name !== "AbortError" && mountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          error: error.message || error, 
          isLoading: false 
        }));
      }
      throw error;
    }
  }, [asyncFn]);

  useEffect(() => {
    mountedRef.current = true;
    
    if (immediate) {
      execute();
    }

    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, [immediate, execute, ...dependencies]);

  const refresh = useCallback(() => execute(), [execute]);
  const cancel = useCallback(() => abortControllerRef.current?.abort(), []);

  return { ...state, execute, refresh, cancel };
}

export function useFetch(url, options = {}) {
  return useAsync(
    async (init) => {
      const response = await fetch(url, { ...options, ...init });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
    { dependencies: [url] }
  );
}
```

```jsx
// Пример использования: загрузка пользователя
import { useFetch } from "../hooks/useAsync";

function UserProfile({ userId }) {
  const { data, isLoading, error, refresh } = useFetch(`/api/users/${userId}`);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!data) return null;

  return (
    <div>
      <h2>{data.name}</h2>
      <p>{data.email}</p>
      <button onClick={refresh}>Обновить</button>
    </div>
  );
}
```

```bash
git add src/hooks/useAsync.js
git commit -m "feat: add useAsync and useFetch hooks with AbortController support"
```

---

# useInterval / useTimeout

> Для выполнения кода по расписанию или с задержкой с возможностью паузы, возобновления и очистки таймеров при размонтировании.

```jsx
// src/hooks/useInterval.js
import { useEffect, useRef } from "react";

export function useInterval(callback, delay, options = {}) {
  const { immediate = false } = options;
  const savedCallback = useRef(callback);
  const timerRef = useRef(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay == null) return;

    const tick = () => savedCallback.current();
    
    if (immediate) tick();
    
    timerRef.current = setInterval(tick, delay);
    
    return () => clearInterval(timerRef.current);
  }, [delay, immediate]);

  const pause = () => clearInterval(timerRef.current);
  const resume = () => {
    if (delay != null) {
      timerRef.current = setInterval(() => savedCallback.current(), delay);
    }
  };

  return { pause, resume };
}

export function useTimeout(callback, delay) {
  const savedCallback = useRef(callback);
  const timerRef = useRef(null);

  useEffect(() => { savedCallback.current = callback; }, [callback]);

  useEffect(() => {
    if (delay == null) return;
    timerRef.current = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(timerRef.current);
  }, [delay]);

  const clear = () => clearTimeout(timerRef.current);
  const reset = (newDelay) => {
    clear();
    timerRef.current = setTimeout(() => savedCallback.current(), newDelay ?? delay);
  };

  return { clear, reset };
}
```

```jsx
// Пример использования: таймер обратного отсчёта
import { useState } from "react";
import { useInterval } from "../hooks/useInterval";

function Countdown({ seconds, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  
  useInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        onComplete?.();
        return 0;
      }
      return prev - 1;
    });
  }, timeLeft > 0 ? 1000 : null);

  return <div>Осталось: {timeLeft}с</div>;
}

// Пример: авто-обновление данных
function LiveDashboard() {
  const [data, setData] = useState(null);
  
  const fetchData = () => {
    fetch("/api/stats").then(res => res.json()).then(setData);
  };
  
  useInterval(fetchData, 30000, { immediate: true });
  
  return <div>{data ? <pre>{JSON.stringify(data)}</pre> : "Загрузка..."}</div>;
}
```

```bash
git add src/hooks/useInterval.js src/hooks/useTimeout.js
git commit -m "feat: add useInterval and useTimeout hooks with pause/resume controls"
```

---

# useOnClickOutside / useKeyPress

> Для обработки взаимодействий с пользователем: закрытия элементов при клике вне области и реакции на нажатия клавиш клавиатуры.

```jsx
// src/hooks/useOnClickOutside.js
import { useEffect } from "react";

export function useOnClickOutside(refs, handler, options = {}) {
  const { events = ["mousedown", "touchstart"], exclude = [] } = options;
  
  useEffect(() => {
    const listener = (event) => {
      const refsArray = Array.isArray(refs) ? refs : [refs];
      
      const isInside = refsArray.some(ref => 
        ref?.current?.contains(event.target)
      );
      
      const isExcluded = exclude.some(selector => 
        event.target?.closest?.(selector)
      );
      
      if (!isInside && !isExcluded) {
        handler(event);
      }
    };

    events.forEach(event => 
      document.addEventListener(event, listener, { passive: true })
    );
    
    return () => {
      events.forEach(event => 
        document.removeEventListener(event, listener)
      );
    };
  }, [refs, handler, events, exclude]);
}

export function useKeyPress(targetKeys, callback, options = {}) {
  const { event = "keydown", preventDefault = true } = options;
  
  useEffect(() => {
    const handler = (e) => {
      if (targetKeys.includes(e.key)) {
        if (preventDefault) e.preventDefault();
        callback(e);
      }
    };
    
    window.addEventListener(event, handler);
    return () => window.removeEventListener(event, handler);
  }, [targetKeys, callback, event, preventDefault]);
}
```

```jsx
// Пример использования: выпадающее меню
import { useState, useRef } from "react";
import { useOnClickOutside, useKeyPress } from "../hooks/useOnClickOutside";

function Dropdown({ trigger, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  
  useOnClickOutside(ref, () => setOpen(false));
  useKeyPress(["Escape"], () => setOpen(false));

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(prev => !prev)}>{trigger}</button>
      {open && <div className="dropdown-menu">{children}</div>}
    </div>
  );
}

// Пример: глобальные хоткеи
function App() {
  useKeyPress(["/"], (e) => {
    e.preventDefault();
    document.querySelector("#search-input")?.focus();
  });
  
  useKeyPress(["?", "Shift+?"], () => {
    // Показать справку
  });
  
  return <input id="search-input" placeholder="Поиск..." />;
}
```

```bash
git add src/hooks/useOnClickOutside.js src/hooks/useKeyPress.js
git commit -m "feat: add useOnClickOutside and useKeyPress hooks for user interactions"
```

---

# useForm

> Для управления состоянием формы с валидацией, обработкой отправки и сбросом, без привязки к конкретной библиотеке форм.

```jsx
// src/hooks/useForm.js
import { useState, useCallback } from "react";

export function useForm(initialValues, options = {}) {
  const { 
    validate, 
    onSubmit, 
    validateOnChange = false,
    resetOnSubmit = true 
  } = options;
  
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setValues(prev => ({ ...prev, [name]: newValue }));
    
    if (validateOnChange && errors[name]) {
      const fieldErrors = validate?.({ ...values, [name]: newValue }) || {};
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }
  }, [validateOnChange, errors, values]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (validate) {
      const fieldErrors = validate(values) || {};
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }
  }, [validate, values]);

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();
    
    if (validate) {
      const newErrors = validate(values);
      setErrors(newErrors || {});
      setTouched(
        Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
      
      if (newErrors && Object.keys(newErrors).length > 0) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.(values);
      if (resetOnSubmit) {
        setValues(initialValues);
        setErrors({});
        setTouched({});
      }
    } catch (error) {
      setErrors({ submit: error.message || "Ошибка отправки" });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit, resetOnSubmit, initialValues]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] ?? "",
    onChange: handleChange,
    onBlur: handleBlur,
    error: touched[name] && errors[name] ? errors[name] : null
  }), [values, errors, touched, handleChange, handleBlur]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    getFieldProps,
    setValues,
    setErrors
  };
}
```

```jsx
// Пример использования: форма регистрации
import { useForm } from "../hooks/useForm";

function RegistrationForm() {
  const form = useForm(
    { email: "", password: "", agree: false },
    {
      validate: (values) => {
        const errors = {};
        if (!values.email?.includes("@")) errors.email = "Некорректный email";
        if (values.password?.length < 8) errors.password = "Минимум 8 символов";
        if (!values.agree) errors.agree = "Требуется согласие";
        return errors;
      },
      onSubmit: async (values) => {
        await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values)
        });
      }
    }
  );

  return (
    <form onSubmit={form.handleSubmit}>
      <input {...form.getFieldProps("email")} placeholder="Email" />
      {form.errors.email && <span>{form.errors.email}</span>}
      
      <input type="password" {...form.getFieldProps("password")} placeholder="Пароль" />
      {form.errors.password && <span>{form.errors.password}</span>}
      
      <label>
        <input type="checkbox" {...form.getFieldProps("agree")} />
        Согласен с условиями
      </label>
      {form.errors.agree && <span>{form.errors.agree}</span>}
      
      {form.errors.submit && <div>{form.errors.submit}</div>}
      
      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? "Отправка..." : "Зарегистрироваться"}
      </button>
    </form>
  );
}
```

```bash
git add src/hooks/useForm.js
git commit -m "feat: add useForm hook with validation and submit handling"
```

---

# usePrevious / useToggle / useBoolean

> Для отслеживания предыдущего значения и удобного управления булевым состоянием с готовыми методами переключения.

```jsx
// src/hooks/usePrevious.js
import { useRef, useEffect } from "react";

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}

export function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return [value, { toggle, setTrue, setFalse, set: setValue }];
}

export const useBoolean = useToggle;
```

```jsx
// Пример использования: модальное окно с отслеживанием состояния
import { useToggle, usePrevious } from "../hooks/useToggle";

function ModalExample() {
  const [isOpen, modal] = useToggle(false);
  const prevOpen = usePrevious(isOpen);

  useEffect(() => {
    if (isOpen && !prevOpen) {
      console.log("Модалка открыта");
      document.body.style.overflow = "hidden";
    }
    if (!isOpen && prevOpen) {
      console.log("Модалка закрыта");
      document.body.style.overflow = "";
    }
  }, [isOpen, prevOpen]);

  return (
    <>
      <button onClick={modal.toggle}>
        {isOpen ? "Закрыть" : "Открыть"} модалку
      </button>
      
      {isOpen && (
        <div className="modal">
          <p>Контент модалки</p>
          <button onClick={modal.setFalse}>Закрыть</button>
        </div>
      )}
    </>
  );
}

// Пример: переключатель настроек
function SettingsToggle() {
  const [notifications, toggle] = useToggle(true);
  
  return (
    <label>
      <input type="checkbox" checked={notifications} onChange={toggle} />
      Уведомления {notifications ? "включены" : "отключены"}
    </label>
  );
}
```

```bash
git add src/hooks/usePrevious.js src/hooks/useToggle.js
git commit -m "feat: add usePrevious and useToggle utility hooks"
```
```

### `useLocalStorage` / `useSessionStorage`

```jsx
// src/hooks/useStorage.js
import { useState, useEffect } from "react";

function useStorage(key, initialValue, storage = localStorage) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.storageArea === storage) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          // Игнорируем ошибки парсинга
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, storage]);

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;
      
      setStoredValue(valueToStore);
      storage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  };

  const remove = () => {
    try {
      storage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  };

  return [storedValue, setValue, remove];
}

export function useLocalStorage(key, initialValue) {
  return useStorage(key, initialValue, localStorage);
}

export function useSessionStorage(key, initialValue) {
  return useStorage(key, initialValue, sessionStorage);
}
```

```bash
git add src/hooks/useStorage.js
git commit -m "feat: add useLocalStorage and useSessionStorage with cross-tab sync"
```

### `useFetch` / `useAsync`

```jsx
// src/hooks/useAsync.js
import { useState, useEffect, useCallback, useRef } from "react";

export function useAsync(asyncFn, options = {}) {
  const { immediate = false, dependencies = [] } = options;
  
  const [state, setState] = useState({
     null,
    error: null,
    isLoading: false,
    isReady: false
  });
  
  const mountedRef = useRef(true);
  const abortControllerRef = useRef(null);

  const execute = useCallback(async (...args) => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await asyncFn(...args, { 
        signal: abortControllerRef.current.signal 
      });
      
      if (mountedRef.current) {
        setState({  result, error: null, isLoading: false, isReady: true });
        return result;
      }
    } catch (error) {
      if (error.name !== "AbortError" && mountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          error: error.message || error, 
          isLoading: false 
        }));
      }
      throw error;
    }
  }, [asyncFn]);

  useEffect(() => {
    mountedRef.current = true;
    
    if (immediate) {
      execute();
    }

    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, [immediate, execute, ...dependencies]);

  const refresh = useCallback(() => execute(), [execute]);
  const cancel = useCallback(() => abortControllerRef.current?.abort(), []);

  return { ...state, execute, refresh, cancel };
}

export function useFetch(url, options = {}) {
  return useAsync(
    async (init) => {
      const response = await fetch(url, { ...options, ...init });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
    { dependencies: [url] }
  );
}
```

```bash
git add src/hooks/useAsync.js
git commit -m "feat: add useAsync and useFetch hooks with AbortController support"
```

### `useInterval` / `useTimeout`

```jsx
// src/hooks/useInterval.js
import { useEffect, useRef } from "react";

export function useInterval(callback, delay, options = {}) {
  const { immediate = false } = options;
  const savedCallback = useRef(callback);
  const timerRef = useRef(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay == null) return;

    const tick = () => savedCallback.current();
    
    if (immediate) tick();
    
    timerRef.current = setInterval(tick, delay);
    
    return () => clearInterval(timerRef.current);
  }, [delay, immediate]);

  const pause = () => clearInterval(timerRef.current);
  const resume = () => {
    if (delay != null) {
      timerRef.current = setInterval(() => savedCallback.current(), delay);
    }
  };

  return { pause, resume };
}

export function useTimeout(callback, delay) {
  const savedCallback = useRef(callback);
  const timerRef = useRef(null);

  useEffect(() => { savedCallback.current = callback; }, [callback]);

  useEffect(() => {
    if (delay == null) return;
    timerRef.current = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(timerRef.current);
  }, [delay]);

  const clear = () => clearTimeout(timerRef.current);
  const reset = (newDelay) => {
    clear();
    timerRef.current = setTimeout(() => savedCallback.current(), newDelay ?? delay);
  };

  return { clear, reset };
}

export function Countdown({ seconds, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  
  useInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        onComplete?.();
        return 0;
      }
      return prev - 1;
    });
  }, timeLeft > 0 ? 1000 : null);

  return <div>Осталось: {timeLeft}с</div>;
}
```

```bash
git add src/hooks/useInterval.js src/hooks/useTimeout.js
git commit -m "feat: add useInterval and useTimeout hooks with pause/resume controls"
```

### `useMediaQuery` / `useWindowSize`

```jsx
// src/hooks/useMediaQuery.js
import { useEffect, useState } from "react";

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => 
    window.matchMedia ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    if (!window.matchMedia) return;
    
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    
    const handler = (e) => setMatches(e.matches);
    mediaQuery.addEventListener("change", handler);
    
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export function useWindowSize(options = {}) {
  const { debounce = 100 } = options;
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    let timeout;
    
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, debounce);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [debounce]);

  return size;
}

export const useIsMobile = () => useMediaQuery("(max-width: 768px)");
export const useIsTablet = () => useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1025px)");
export const usePrefersDark = () => useMediaQuery("(prefers-color-scheme: dark)");
export const usePrefersReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
```

```bash
git add src/hooks/useMediaQuery.js
git commit -m "feat: add useMediaQuery and useWindowSize hooks for responsive design"
```

### `useOnClickOutside` / `useKeyPress`

```jsx
// src/hooks/useOnClickOutside.js
import { useEffect } from "react";

export function useOnClickOutside(refs, handler, options = {}) {
  const { events = ["mousedown", "touchstart"], exclude = [] } = options;
  
  useEffect(() => {
    const listener = (event) => {
      const refsArray = Array.isArray(refs) ? refs : [refs];
      
      const isInside = refsArray.some(ref => 
        ref?.current?.contains(event.target)
      );
      
      const isExcluded = exclude.some(selector => 
        event.target?.closest?.(selector)
      );
      
      if (!isInside && !isExcluded) {
        handler(event);
      }
    };

    events.forEach(event => 
      document.addEventListener(event, listener, { passive: true })
    );
    
    return () => {
      events.forEach(event => 
        document.removeEventListener(event, listener)
      );
    };
  }, [refs, handler, events, exclude]);
}

export function useKeyPress(targetKeys, callback, options = {}) {
  const { event = "keydown", preventDefault = true } = options;
  
  useEffect(() => {
    const handler = (e) => {
      if (targetKeys.includes(e.key)) {
        if (preventDefault) e.preventDefault();
        callback(e);
      }
    };
    
    window.addEventListener(event, handler);
    return () => window.removeEventListener(event, handler);
  }, [targetKeys, callback, event, preventDefault]);
}

export function Dropdown({ children, trigger }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  
  useOnClickOutside(ref, () => setOpen(false));
  useKeyPress(["Escape"], () => setOpen(false), { event: "keydown" });

  return (
    <div ref={ref} className="dropdown">
      <div onClick={() => setOpen(prev => !prev)}>{trigger}</div>
      {open && <div className="dropdown-menu">{children}</div>}
    </div>
  );
}
```

```bash
git add src/hooks/useOnClickOutside.js src/hooks/useKeyPress.js
git commit -m "feat: add useOnClickOutside and useKeyPress hooks for interactions"
```

### `useForm` — Универсальный хук для форм

```jsx
// src/hooks/useForm.js
import { useState, useCallback } from "react";

export function useForm(initialValues, options = {}) {
  const { 
    validate, 
    onSubmit, 
    validateOnChange = false,
    resetOnSubmit = true 
  } = options;
  
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setValues(prev => ({ ...prev, [name]: newValue }));
    
    if (validateOnChange && errors[name]) {
      const fieldErrors = validate?.({ ...values, [name]: newValue }) || {};
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }
  }, [validateOnChange, errors, values]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (validate) {
      const fieldErrors = validate(values) || {};
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }
  }, [validate, values]);

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();
    
    if (validate) {
      const newErrors = validate(values);
      setErrors(newErrors || {});
      setTouched(
        Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
      
      if (newErrors && Object.keys(newErrors).length > 0) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.(values);
      if (resetOnSubmit) {
        setValues(initialValues);
        setErrors({});
        setTouched({});
      }
    } catch (error) {
      setErrors({ submit: error.message || "Ошибка отправки" });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit, resetOnSubmit, initialValues]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] ?? "",
    onChange: handleChange,
    onBlur: handleBlur,
    error: touched[name] && errors[name] ? errors[name] : null
  }), [values, errors, touched, handleChange, handleBlur]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    getFieldProps,
    setValues,
    setErrors
  };
}
```

```bash
git add src/hooks/useForm.js
git commit -m "feat: add useForm hook with validation and submit handling"
```

# usePrevious / useToggle / useBoolean

> Для отслеживания предыдущего значения состояния и удобного управления булевыми флагами с готовыми методами переключения.

---

## usePrevious — отслеживание предыдущего значения

```jsx
// src/hooks/usePrevious.js
import { useRef, useEffect } from "react";

export function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}
```

```jsx
// Пример: анимация изменения счётчика
import { useState } from "react";
import { usePrevious } from "../hooks/usePrevious";

function AnimatedCounter({ value }) {
  const prevValue = usePrevious(value);
  const direction = prevValue !== undefined 
    ? value > prevValue ? "up" : "down" 
    : null;

  return (
    <div className={`counter ${direction}`}>
      {value}
      {direction && <span className="indicator">{direction === "up" ? "↑" : "↓"}</span>}
    </div>
  );
}

// Пример: сравнение пропсов для оптимизации
import { useEffect } from "react";
import { usePrevious } from "../hooks/usePrevious";

function DataFetcher({ userId }) {
  const prevUserId = usePrevious(userId);

  useEffect(() => {
    if (prevUserId !== undefined && prevUserId !== userId) {
      console.log(`Пользователь сменился: ${prevUserId} → ${userId}`);
      // Можно вызвать перезагрузку данных
    }
  }, [userId, prevUserId]);

  return <div>Профиль пользователя {userId}</div>;
}
```

```bash
git add src/hooks/usePrevious.js
git commit -m "feat: add usePrevious hook for tracking previous values"
```

---

## useToggle / useBoolean — управление булевым состоянием

```jsx
// src/hooks/useToggle.js
import { useState, useCallback } from "react";

export function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const set = useCallback((v) => setValue(v), []);
  
  return [value, { toggle, setTrue, setFalse, set }];
}

export const useBoolean = useToggle;
```

```jsx
// Пример: модальное окно с удобным управлением
import { useToggle } from "../hooks/useToggle";

function ModalManager() {
  const [isOpen, modal] = useToggle(false);

  return (
    <>
      <button onClick={modal.toggle}>
        {isOpen ? "Закрыть" : "Открыть"}
      </button>
      
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={modal.setFalse} className="close-btn">✕</button>
            <p>Содержимое модального окна</p>
            <button onClick={modal.setFalse}>Закрыть</button>
          </div>
        </div>
      )}
    </>
  );
}

// Пример: переключатель настроек с несколькими опциями
import { useToggle } from "../hooks/useToggle";

function SettingsPanel() {
  const [notifications, notificationsCtrl] = useToggle(true);
  const [darkMode, darkModeCtrl] = useToggle(false);
  const [autoSave, autoSaveCtrl] = useToggle(true);

  return (
    <div className="settings">
      <label>
        <input 
          type="checkbox" 
          checked={notifications} 
          onChange={notificationsCtrl.toggle} 
        />
        Уведомления
      </label>
      
      <label>
        <input 
          type="checkbox" 
          checked={darkMode} 
          onChange={darkModeCtrl.toggle} 
        />
        Тёмная тема
      </label>
      
      <label>
        <input 
          type="checkbox" 
          checked={autoSave} 
          onChange={autoSaveCtrl.toggle} 
        />
        Автосохранение
      </label>
      
      <button onClick={() => {
        notificationsCtrl.setFalse();
        darkModeCtrl.setFalse();
        autoSaveCtrl.setTrue();
      }}>
        Сбросить к умолчанию
      </button>
    </div>
  );
}

// Пример: аккордеон с несколькими секциями
function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(prev => prev === index ? null : index);
  };

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div key={index} className="accordion-item">
          <button onClick={() => toggleSection(index)}>
            {item.title}
            <span>{openIndex === index ? "−" : "+"}</span>
          </button>
          {openIndex === index && (
            <div className="accordion-content">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

```bash
git add src/hooks/useToggle.js
git commit -m "feat: add useToggle/useBoolean hooks for boolean state management"
```

---

## useCounter — управление числовым состоянием

```jsx
// src/hooks/useCounter.js
import { useState, useCallback } from "react";

export function useCounter(initial = 0, options = {}) {
  const { min = -Infinity, max = Infinity, step = 1 } = options;
  const [value, setValue] = useState(initial);

  const increment = useCallback(() => {
    setValue(prev => Math.min(prev + step, max));
  }, [step, max]);

  const decrement = useCallback(() => {
    setValue(prev => Math.max(prev - step, min));
  }, [step, min]);

  const set = useCallback((newValue) => {
    const clamped = Math.min(Math.max(newValue, min), max);
    setValue(clamped);
  }, [min, max]);

  const reset = useCallback(() => {
    setValue(initial);
  }, [initial]);

  return {
    value,
    increment,
    decrement,
    set,
    reset,
    setValue
  };
}
```

```jsx
// Пример: счётчик с ограничениями
import { useCounter } from "../hooks/useCounter";

function QuantitySelector({ min = 1, max = 10, initial = 1 }) {
  const { value, increment, decrement, reset } = useCounter(initial, { min, max });

  return (
    <div className="quantity-selector">
      <button onClick={decrement} disabled={value <= min}>−</button>
      <span>{value}</span>
      <button onClick={increment} disabled={value >= max}>+</button>
      <button onClick={reset} className="reset-btn">↺</button>
    </div>
  );
}

// Пример: рейтинг с кликами
function StarRating({ max = 5 }) {
  const { value, set } = useCounter(0, { min: 0, max });

  return (
    <div className="star-rating">
      {Array.from({ length: max }, (_, i) => i + 1).map(star => (
        <button
          key={star}
          onClick={() => set(star)}
          className={star <= value ? "filled" : "empty"}
        >
          ★
        </button>
      ))}
      <span>{value} из {max}</span>
    </div>
  );
}
```

```bash
git add src/hooks/useCounter.js
git commit -m "feat: add useCounter hook with min/max bounds and step control"
```

---

## useMap — управление объектом как Map

```jsx
// src/hooks/useMap.js
import { useState, useCallback } from "react";

export function useMap(initial = {}) {
  const [map, setMap] = useState(initial);

  const set = useCallback((key, value) => {
    setMap(prev => ({ ...prev, [key]: value }));
  }, []);

  const setMany = useCallback((entries) => {
    setMap(prev => ({ ...prev, ...entries }));
  }, []);

  const remove = useCallback((key) => {
    setMap(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const removeMany = useCallback((keys) => {
    setMap(prev => {
      const rest = { ...prev };
      keys.forEach(key => delete rest[key]);
      return rest;
    });
  }, []);

  const reset = useCallback((newMap = {}) => {
    setMap(newMap);
  }, []);

  const has = useCallback((key) => {
    return key in map;
  }, [map]);

  const get = useCallback((key) => {
    return map[key];
  }, [map]);

  return {
    map,
    set,
    setMany,
    remove,
    removeMany,
    reset,
    has,
    get
  };
}
```

```jsx
// Пример: форма с динамическими полями
import { useMap } from "../hooks/useMap";

function DynamicForm() {
  const { map: fields, set, remove, reset } = useMap({
    name: "",
    email: ""
  });

  const addField = (key) => {
    set(key, "");
  };

  const handleChange = (key, value) => {
    set(key, value);
  };

  return (
    <form>
      {Object.entries(fields).map(([key, value]) => (
        <div key={key} className="form-field">
          <input
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder={key}
          />
          <button type="button" onClick={() => remove(key)}>✕</button>
        </div>
      ))}
      
      <button type="button" onClick={() => addField(`field_${Date.now()}`)}>
        + Добавить поле
      </button>
      
      <button type="button" onClick={() => reset({ name: "", email: "" })}>
        Сбросить
      </button>
    </form>
  );
}

// Пример: кэш данных с инвалидацией
function DataCache() {
  const { map: cache, set, remove, reset } = useMap({});

  const fetchWithCache = async (key, fetcher, ttl = 60000) => {
    const cached = cache[key];
    const now = Date.now();
    
    if (cached && now - cached.timestamp < ttl) {
      return cached.data;
    }
    
    const data = await fetcher();
    set(key, { data, timestamp: now });
    return data;
  };

  const invalidate = (key) => remove(key);
  const clearAll = () => reset({});

  return { fetchWithCache, invalidate, clearAll, cache };
}
```

```bash
git add src/hooks/useMap.js
git commit -m "feat: add useMap hook for object state management with utility methods"
```

---

## useList — управление массивом с полезными методами

```jsx
// src/hooks/useList.js
import { useState, useCallback } from "react";

export function useList(initial = []) {
  const [list, setList] = useState(initial);

  const push = useCallback((...items) => {
    setList(prev => [...prev, ...items]);
  }, []);

  const unshift = useCallback((...items) => {
    setList(prev => [...items, ...prev]);
  }, []);

  const pop = useCallback(() => {
    let removed;
    setList(prev => {
      removed = prev[prev.length - 1];
      return prev.slice(0, -1);
    });
    return removed;
  }, []);

  const shift = useCallback(() => {
    let removed;
    setList(prev => {
      removed = prev[0];
      return prev.slice(1);
    });
    return removed;
  }, []);

  const removeAt = useCallback((index) => {
    setList(prev => prev.filter((_, i) => i !== index));
  }, []);

  const remove = useCallback((predicate) => {
    setList(prev => prev.filter(item => !predicate(item)));
  }, []);

  const updateAt = useCallback((index, updater) => {
    setList(prev => prev.map((item, i) => 
      i === index 
        ? (typeof updater === "function" ? updater(item) : updater) 
        : item
    ));
  }, []);

  const clear = useCallback(() => {
    setList([]);
  }, []);

  const reset = useCallback((newList = []) => {
    setList(newList);
  }, []);

  const sort = useCallback((compareFn) => {
    setList(prev => [...prev].sort(compareFn));
  }, []);

  return {
    list,
    push,
    unshift,
    pop,
    shift,
    removeAt,
    remove,
    updateAt,
    clear,
    reset,
    sort,
    setList
  };
}
```

```jsx
// Пример: список задач с операциями
import { useList } from "../hooks/useList";

function TodoList() {
  const { 
    list: todos, 
    push, 
    removeAt, 
    updateAt, 
    clear 
  } = useList([
    { id: 1, text: "Изучить React", done: false }
  ]);

  const addTodo = (text) => {
    push({ id: Date.now(), text, done: false });
  };

  const toggleTodo = (index) => {
    updateAt(index, todo => ({ ...todo, done: !todo.done }));
  };

  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        const input = e.target.elements.todo;
        if (input.value.trim()) {
          addTodo(input.value.trim());
          input.value = "";
        }
      }}>
        <input name="todo" placeholder="Новая задача..." />
        <button type="submit">Добавить</button>
      </form>
      
      <ul>
        {todos.map((todo, index) => (
          <li key={todo.id} className={todo.done ? "done" : ""}>
            <input 
              type="checkbox" 
              checked={todo.done} 
              onChange={() => toggleTodo(index)} 
            />
            <span>{todo.text}</span>
            <button onClick={() => removeAt(index)}>Удалить</button>
          </li>
        ))}
      </ul>
      
      <button onClick={clear}>Очистить все</button>
      <p>Всего: {todos.length}</p>
    </div>
  );
}

// Пример: очередь уведомлений
function NotificationQueue() {
  const { list: notifications, push, shift, remove } = useList([]);

  const addNotification = (message, type = "info", duration = 5000) => {
    const id = Date.now();
    push({ id, message, type });
    
    setTimeout(() => {
      remove(n => n.id === id);
    }, duration);
  };

  return (
    <div className="notifications">
      {notifications.map(note => (
        <div key={note.id} className={`notification ${note.type}`}>
          {note.message}
        </div>
      ))}
    </div>
  );
}
```

```bash
git add src/hooks/useList.js
git commit -m "feat: add useList hook for array state management with utility methods"
```

---

## useSet — управление множеством (Set)

```jsx
// src/hooks/useSet.js
import { useState, useCallback } from "react";

export function useSet(initial = []) {
  const [set, setSet] = useState(new Set(initial));

  const add = useCallback((value) => {
    setSet(prev => new Set(prev).add(value));
  }, []);

  const addMany = useCallback((values) => {
    setSet(prev => {
      const newSet = new Set(prev);
      values.forEach(v => newSet.add(v));
      return newSet;
    });
  }, []);

  const remove = useCallback((value) => {
    setSet(prev => {
      const newSet = new Set(prev);
      newSet.delete(value);
      return newSet;
    });
  }, []);

  const removeMany = useCallback((values) => {
    setSet(prev => {
      const newSet = new Set(prev);
      values.forEach(v => newSet.delete(v));
      return newSet;
    });
  }, []);

  const clear = useCallback(() => {
    setSet(new Set());
  }, []);

  const reset = useCallback((values = []) => {
    setSet(new Set(values));
  }, []);

  const has = useCallback((value) => {
    return set.has(value);
  }, [set]);

  const toggle = useCallback((value) => {
    setSet(prev => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  }, []);

  return {
    set,
    add,
    addMany,
    remove,
    removeMany,
    clear,
    reset,
    has,
    toggle,
    setSet
  };
}
```

```jsx
// Пример: выбор нескольких элементов
import { useSet } from "../hooks/useSet";

function MultiSelect({ options, onChange }) {
  const { set: selected, toggle, clear } = useSet([]);

  const handleChange = (value) => {
    toggle(value);
    onChange?.(Array.from(selected.has(value) 
      ? new Set([...selected].filter(v => v !== value)) 
      : new Set([...selected, value])
    ));
  };

  return (
    <div>
      {options.map(option => (
        <label key={option.value}>
          <input
            type="checkbox"
            checked={selected.has(option.value)}
            onChange={() => handleChange(option.value)}
          />
          {option.label}
        </label>
      ))}
      
      <button onClick={clear}>Очистить выбор</button>
      <p>Выбрано: {Array.from(selected).join(", ")}</p>
    </div>
  );
}

// Пример: избранное с быстрым переключением
function FavoritesList({ items }) {
  const { set: favorites, toggle, has } = useSet([]);

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name}
          <button 
            onClick={() => toggle(item.id)}
            className={has(item.id) ? "active" : ""}
          >
            {has(item.id) ? "★" : "☆"}
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```bash
git add src/hooks/useSet.js
git commit -m "feat: add useSet hook for Set-based state management with toggle support"
```

---

## Коммит всех утилит

```bash
git add src/hooks/usePrevious.js src/hooks/useToggle.js src/hooks/useCounter.js src/hooks/useMap.js src/hooks/useList.js src/hooks/useSet.js
git commit -m "feat: add utility hooks collection (usePrevious, useToggle, useCounter, useMap, useList, useSet)"
```

---

## Итог

Эти утилитарные хуки решают частые задачи управления состоянием:

| Хук | Назначение | Возвращает |
|-----|-----------|-----------|
| `usePrevious` | Доступ к предыдущему значению | предыдущее значение |
| `useToggle` / `useBoolean` | Управление boolean-флагом | [value, { toggle, setTrue, setFalse, set }] |
| `useCounter` | Числовой счётчик с границами | { value, increment, decrement, set, reset } |
| `useMap` | Объект как словарь с методами | { map, set, remove, reset, has, get } |
| `useList` | Массив с методами модификации | { list, push, pop, removeAt, updateAt, clear } |
| `useSet` | Множество с операциями добавления/удаления | { set, add, remove, toggle, has, clear } |

Используйте их, когда стандартный `useState` становится избыточным для повторяющихся паттернов работы с состоянием.

```bash
git add src/hooks/usePrevious.js src/hooks/useToggle.js
git commit -m "feat: add usePrevious and useToggle utility hooks"
```

---

## Тестирование хуков

> Для автоматической проверки корректности работы хуков, изоляции логики от UI и предотвращения регрессий при рефакторинге.

```jsx
// __tests__/useCounter.test.js
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "../hooks/useCounter";

describe("useCounter", () => {
  test("должен использовать начальное значение", () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  test("должен инкрементировать", () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  test("должен декрементировать", () => {
    const { result } = renderHook(() => useCounter(10));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(9);
  });

  test("должен сбрасывать к начальному значению", () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.reset();
    });
    
    expect(result.current.count).toBe(5);
  });
});
```

```bash
git add __tests__/useCounter.test.js
git commit -m "test: add useCounter hook unit tests"
```

```jsx
// __tests__/useLocalStorage.test.js
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../hooks/useStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("должен читать из localStorage", () => {
    localStorage.setItem("test", JSON.stringify("value"));
    
    const { result } = renderHook(() => useLocalStorage("test", "default"));
    
    expect(result.current[0]).toBe("value");
  });

  test("должен записывать в localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test", "default"));
    
    act(() => {
      result.current[1]("new value");
    });
    
    expect(result.current[0]).toBe("new value");
    expect(localStorage.getItem("test")).toBe(JSON.stringify("new value"));
  });

  test("должен синхронизироваться между экземплярами", () => {
    const { result: result1 } = renderHook(() => useLocalStorage("sync", 0));
    const { result: result2 } = renderHook(() => useLocalStorage("sync", 0));
    
    act(() => {
      result1.current[1](42);
    });
    
    expect(result2.current[0]).toBe(42);
  });
});
```

```bash
git add __tests__/useLocalStorage.test.js
git commit -m "test: add useLocalStorage hook unit tests"
```

```jsx
// __tests__/useFetch.test.js
import { renderHook, waitFor } from "@testing-library/react";
import { useFetch } from "../hooks/useAsync";

global.fetch = jest.fn();

describe("useFetch", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("должен загружать данные", async () => {
    const mockData = { id: 1, name: "Test" };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const { result } = renderHook(() => useFetch("/api/test"));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith("/api/test", expect.any(Object));
  });

  test("должен обрабатывать ошибки", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found"
    });

    const { result } = renderHook(() => useFetch("/api/not-found"));

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });
});
```

```bash
git add __tests__/useFetch.test.js
git commit -m "test: add useFetch hook unit tests with mocked fetch"
```

---

## Утилиты

```jsx
// src/utils/hooks.js

export function useUpdateEffect(effect, deps) {
  const isFirstMount = useRef(true);
  
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    return effect();
  }, deps);
}

export function useWhyDidYouUpdate(name, props) {
  const prevProps = useRef({});
  
  useEffect(() => {
    if (prevProps.current) {
      const allKeys = [...new Set([...Object.keys(prevProps.current), ...Object.keys(props)])];
      const changes = {};
      
      allKeys.forEach(key => {
        if (prevProps.current[key] !== props[key]) {
          changes[key] = {
            from: prevProps.current[key],
            to: props[key]
          };
        }
      });
      
      if (Object.keys(changes).length) {
        console.log(`[why-did-you-update] ${name}:`, changes);
      }
    }
    prevProps.current = props;
  });
}

export function useForceUpdate() {
  const [, forceUpdate] = useState(0);
  return useCallback(() => forceUpdate(n => n + 1), []);
}

export const useRerender = useForceUpdate;
```

```bash
git add src/utils/hooks.js
git commit -m "feat: add utility hooks (useUpdateEffect, useWhyDidYouUpdate, useForceUpdate)"
```

---

## Финальный коммит

```bash
git add .
git commit -m "feat: add comprehensive React hooks library with examples and tests"
git tag -a v1.0.0 -m "Release version 1.0.0 - React Hooks Collection"
git push origin main --tags
```

---
