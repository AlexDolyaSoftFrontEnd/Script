### useState — Toggle Sidebar

```bash
cat > src/components/Sidebar.jsx << 'EOF'
import { useState } from "react";

export function Sidebar() {
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
EOF
git add . && git commit -m "feat: add Sidebar with useState toggle"
```

---

### useEffect — Modal + Escape key

```bash
cat > src/components/ModalWithEscape.jsx << 'EOF'
import { useEffect, useState } from "react";

export function ModalWithEscape() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <>
      <button onClick={() => setOpen(true)}>Открыть</button>
      {open && <div className="modal">Модалка</div>}
    </>
  );
}
EOF
git add . && git commit -m "feat: add Modal with useEffect for Escape key"
```

---

### useRef — Input Example

```bash
cat > src/components/InputExample.jsx << 'EOF'
import { useRef } from "react";

export function InputExample() {
  const inputRef = useRef(null);

  const handleClick = () => {
    alert(`Вы ввели: ${inputRef.current.value}`);
  };

  const handleClear = () => {
    inputRef.current.value = "";
    inputRef.current.focus();
  };

  return (
    <div style={{ padding: "20px" }}>
      <input ref={inputRef} placeholder="Введите что-нибудь" />
      <button onClick={handleClick}>Показать значение</button>
      <button onClick={handleClear}>Очистить</button>
    </div>
  );
}
EOF
git add . && git commit -m "feat: add InputExample with useRef for DOM access"
```

---

### useMemo — Фильтрация списка

```bash
cat > src/components/FilteredList.jsx << 'EOF'
import { useMemo, useState } from "react";

export function FilteredList() {
  const [query, setQuery] = useState("");
  const users = ["Alice", "Bob", "Charlie", "David"];

  const filtered = useMemo(() => {
    return users.filter(user =>
      user.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск" />
      <ul>
        {filtered.map(user => <li key={user}>{user}</li>)}
      </ul>
    </>
  );
}
EOF
git add . && git commit -m "feat: add FilteredList with useMemo for search optimization"
```

---

### useCallback — Кнопка в списке

```bash
cat > src/components/TodoList.jsx << 'EOF'
import { useCallback, useState, memo } from "react";

const Item = memo(({ name, onDelete }) => (
  <li>
    {name}
    <button onClick={onDelete}>Удалить</button>
  </li>
));

export function TodoList() {
  const [todos, setTodos] = useState(["Task 1", "Task 2"]);

  const handleDelete = useCallback((index) => {
    setTodos(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <ul>
      {todos.map((todo, index) => (
        <Item key={todo} name={todo} onDelete={() => handleDelete(index)} />
      ))}
    </ul>
  );
}
EOF
git add . && git commit -m "feat: add TodoList with useCallback + React.memo"
```

---

### useReducer — Форма с несколькими полями

```bash
cat > src/components/FormReducer.jsx << 'EOF'
import { useReducer } from "react";

const initialState = { name: "", email: "" };

function reducer(state, action) {
  switch (action.type) {
    case "change":
      return { ...state, [action.field]: action.value };
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
        onChange={e => dispatch({ type: "change", field: "name", value: e.target.value })}
        placeholder="Имя"
      />
      <input
        value={state.email}
        onChange={e => dispatch({ type: "change", field: "email", value: e.target.value })}
        placeholder="Email"
      />
      <button type="button" onClick={() => dispatch({ type: "reset" })}>Сброс</button>
    </form>
  );
}
EOF
git add . && git commit -m "feat: add FormReducer with useReducer for form state"
```

---

### useDebounce — Поиск с задержкой (кастомный хук)

```bash
cat > src/hooks/useDebounce.js << 'EOF'
import { useEffect, useState } from "react";

export function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
EOF

cat > src/components/SearchInput.jsx << 'EOF'
import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";

export function SearchInput() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск..." />
      <p>Ищем: {debouncedQuery}</p>
    </>
  );
}
EOF
git add . && git commit -m "feat: add useDebounce custom hook + SearchInput component"
```

---

### useOnClickOutside — Dropdown (кастомный хук)

```bash
cat > src/hooks/useOnClickOutside.js << 'EOF'
import { useEffect } from "react";

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}
EOF

cat > src/components/Dropdown.jsx << 'EOF'
import { useState, useRef } from "react";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

export function Dropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref}>
      <button onClick={() => setOpen(prev => !prev)}>Меню</button>
      {open && <div className="dropdown">Контент</div>}
    </div>
  );
}
EOF
git add . && git commit -m "feat: add useOnClickOutside hook + Dropdown component"
```

---

### useLockBodyScroll — Блокировка прокрутки (кастомный хук)

```bash
cat > src/hooks/useLockBodyScroll.js << 'EOF'
import { useEffect } from "react";

export function useLockBodyScroll(active) {
  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [active]);
}
EOF

cat > src/components/ModalScrollLock.jsx << 'EOF'
import { useState } from "react";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";

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
EOF
git add . && git commit -m "feat: add useLockBodyScroll hook + Modal with scroll lock"
```

---

### useMediaQuery — Responsive UI (кастомный хук)

```bash
cat > src/hooks/useMediaQuery.js << 'EOF'
import { useEffect, useState } from "react";

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
EOF

cat > src/components/ResponsiveLayout.jsx << 'EOF'
import { useMediaQuery } from "../hooks/useMediaQuery";

export function ResponsiveLayout() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return <div>{isMobile ? <p>Mobile Layout</p> : <p>Desktop Layout</p>}</div>;
}
EOF
git add . && git commit -m "feat: add useMediaQuery hook + ResponsiveLayout component"
```

---

### usePrevious — Анимация изменения (кастомный хук)

```bash
cat > src/hooks/usePrevious.js << 'EOF'
import { useEffect, useRef } from "react";

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}
EOF

cat > src/components/CounterWithPrevious.jsx << 'EOF'
import { useState } from "react";
import { usePrevious } from "../hooks/usePrevious";

export function CounterWithPrevious() {
  const [count, setCount] = useState(0);
  const prev = usePrevious(count);

  return (
    <div>
      <p>Сейчас: {count}</p>
      <p>Было: {prev}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}
EOF
git add . && git commit -m "feat: add usePrevious hook + CounterWithPrevious component"
```

---

### useTransition — Поиск с большим списком

```bash
cat > src/components/LargeListSearch.jsx << 'EOF'
import { useState, useTransition } from "react";

export function LargeListSearch() {
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    startTransition(() => {
      const generated = Array.from({ length: 3000 }, (_, i) => value + i);
      setList(generated);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} placeholder="Поиск..." />
      {isPending && <p>Обновление...</p>}
      <ul>
        {list.slice(0, 10).map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}
EOF
git add . && git commit -m "feat: add LargeListSearch with useTransition for non-blocking UI"
```

---

### Просмотр истории коммитов

```bash
# Посмотреть все коммиты
git log --oneline

# Посмотреть изменения в конкретном коммите
git show <commit-hash>

# Посмотреть список всех файлов в истории
git log --name-only --oneline
```

---

### Итоговая структура проекта

```
src/
├── components/
│   ├── Sidebar.jsx
│   ├── ModalWithEscape.jsx
│   ├── InputExample.jsx
│   ├── FilteredList.jsx
│   ├── TodoList.jsx
│   ├── FormReducer.jsx
│   ├── SearchInput.jsx
│   ├── Dropdown.jsx
│   ├── ModalScrollLock.jsx
│   ├── ResponsiveLayout.jsx
│   ├── CounterWithPrevious.jsx
│   └── LargeListSearch.jsx
└── hooks/
    ├── useDebounce.js
    ├── useOnClickOutside.js
    ├── useLockBodyScroll.js
    ├── useMediaQuery.js
    └── usePrevious.js
```