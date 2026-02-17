# useState — Toggle Sidebar

```jsx
import { useState } from "react";

export function Sidebar() {
  // Локальное состояние открытия сайдбара
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(prev => !prev)}>
        {isOpen ? "Закрыть меню" : "Открыть меню"}
      </button>

      {isOpen && (
        <aside className="sidebar">
          <p>Навигация</p>
        </aside>
      )}
    </div>
  );
}
```

---

# useEffect — Modal + Escape key

```jsx
import { useEffect, useState } from "react";

export function ModalWithEscape() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <>
      <button onClick={() => setOpen(true)}>Открыть</button>
      {open && <div className="modal">Модалка</div>}
    </>
  );
}
```

---

# useRef — Автофокус инпута

```jsx
import { useEffect, useRef } from "react";

export function AutoFocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} placeholder="Введите текст" />;
}
```

---

# useMemo — Фильтрация списка

```jsx
import { useMemo, useState } from "react";

export function FilteredList() {
  const [query, setQuery] = useState("");

  const users = ["Alice", "Bob", "Charlie", "David"];

  // Мемоизация фильтрации
  const filtered = useMemo(() => {
    return users.filter(user =>
      user.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Поиск"
      />

      <ul>
        {filtered.map(user => (
          <li key={user}>{user}</li>
        ))}
      </ul>
    </>
  );
}
```

---

# useCallback — Кнопка в списке

```jsx
import { useCallback, useState } from "react";

const Item = React.memo(({ name, onDelete }) => {
  return (
    <li>
      {name}
      <button onClick={onDelete}>Удалить</button>
    </li>
  );
});

export function TodoList() {
  const [todos, setTodos] = useState(["Task 1", "Task 2"]);

  const handleDelete = useCallback((index) => {
    setTodos(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <ul>
      {todos.map((todo, index) => (
        <Item
          key={todo}
          name={todo}
          onDelete={() => handleDelete(index)}
        />
      ))}
    </ul>
  );
}
```

---

# useReducer — Форма с несколькими полями

```jsx
import { useReducer } from "react";

const initialState = {
  name: "",
  email: ""
};

function reducer(state, action) {
  switch (action.type) {
    case "change":
      return {
        ...state,
        [action.field]: action.value
      };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

export function FormReducer() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <form>
      <input
        value={state.name}
        onChange={e =>
          dispatch({
            type: "change",
            field: "name",
            value: e.target.value
          })
        }
        placeholder="Имя"
      />

      <input
        value={state.email}
        onChange={e =>
          dispatch({
            type: "change",
            field: "email",
            value: e.target.value
          })
        }
        placeholder="Email"
      />

      <button
        type="button"
        onClick={() => dispatch({ type: "reset" })}
      >
        Сброс
      </button>
    </form>
  );
}
```

---

# useDebounce — Поиск с задержкой

```jsx
import { useEffect, useState } from "react";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function SearchInput() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  return (
    <>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Поиск..."
      />
      <p>Ищем: {debouncedQuery}</p>
    </>
  );
}
```

---

# useOnClickOutside — Dropdown

```jsx
import { useEffect, useRef, useState } from "react";

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler();
    };

    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler]);
}

export function Dropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref}>
      <button onClick={() => setOpen(prev => !prev)}>
        Меню
      </button>

      {open && <div className="dropdown">Контент</div>}
    </div>
  );
}
```

---

# useLockBodyScroll — Блокировка при модалке

```jsx
import { useEffect, useState } from "react";

function useLockBodyScroll(active) {
  useEffect(() => {
    if (!active) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}

export function ModalScrollLock() {
  const [open, setOpen] = useState(false);

  useLockBodyScroll(open);

  return (
    <>
      <button onClick={() => setOpen(true)}>Открыть</button>
      {open && <div className="modal">Модалка</div>}
    </>
  );
}
```

---

# useMediaQuery — Responsive UI

```jsx
import { useEffect, useState } from "react";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}

export function ResponsiveLayout() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div>
      {isMobile ? <p>Mobile Layout</p> : <p>Desktop Layout</p>}
    </div>
  );
}
```

---

# usePrevious — Анимация изменения

```jsx
import { useEffect, useRef, useState } from "react";

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export function CounterWithPrevious() {
  const [count, setCount] = useState(0);
  const prev = usePrevious(count);

  return (
    <div>
      <p>Сейчас: {count}</p>
      <p>Было: {prev}</p>
      <button onClick={() => setCount(c => c + 1)}>
        +
      </button>
    </div>
  );
}
```

---

# useTransition — Поиск с большим списком

```jsx
import { useState, useTransition } from "react";

export function LargeListSearch() {
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    startTransition(() => {
      const generated = Array.from(
        { length: 3000 },
        (_, i) => value + i
      );
      setList(generated);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />

      {isPending && <p>Обновление...</p>}

      <ul>
        {list.slice(0, 10).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```