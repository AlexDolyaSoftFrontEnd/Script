import React from "react";

/*
----------------------------------------
Функциональный компонент как функция UI
Чистая функция: props -> JSX
----------------------------------------
*/

function UserCard({ user }) {
  return (
    <article className="card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </article>
  );
}

/*
----------------------------------------
Arrow-компонент с деструктуризацией
Самый популярный стиль в React
----------------------------------------
*/

const UserCardShort = ({ name, email }) => (
  <article className="card">
    <h3>{name}</h3>
    <p>{email}</p>
  </article>
);

/*
----------------------------------------
Обработчик события как отдельная функция
----------------------------------------
*/

function Counter() {
  const [count, setCount] = React.useState(0);

  const handleIncrement = () => {
    setCount(prev => prev + 1);
  };

  return (
    <button onClick={handleIncrement}>
      Count: {count}
    </button>
  );
}

/*
----------------------------------------
Inline-функция в JSX
Допустима для простой логики
----------------------------------------
*/

function InlineExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <button onClick={() => setOpen(true)}>
      {open ? "Opened" : "Open modal"}
    </button>
  );
}

/*
----------------------------------------
Callback из родителя в дочерний компонент
----------------------------------------
*/

function Parent() {
  const handleSelect = id => {
    console.log("Selected:", id);
  };

  return <ItemList onSelect={handleSelect} />;
}

function ItemList({ onSelect }) {
  const items = [
    { id: 1, title: "Item A" },
    { id: 2, title: "Item B" }
  ];

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <button onClick={() => onSelect(item.id)}>
            {item.title}
          </button>
        </li>
      ))}
    </ul>
  );
}

/*
----------------------------------------
Функциональное обновление состояния
----------------------------------------
*/

function FunctionalUpdate() {
  const [value, setValue] = React.useState(0);

  return (
    <button onClick={() => setValue(v => v + 1)}>
      {value}
    </button>
  );
}

/*
----------------------------------------
useCallback — стабильная ссылка на функцию
----------------------------------------
*/

function CallbackExample() {
  const [items, setItems] = React.useState([1, 2, 3]);

  const handleRemove = React.useCallback((id) => {
    setItems(list => list.filter(i => i !== id));
  }, []);

  return items.map(i => (
    <button key={i} onClick={() => handleRemove(i)}>
      Remove {i}
    </button>
  ));
}

/*
----------------------------------------
useEffect с асинхронной функцией
----------------------------------------
*/

function Users() {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    let active = true;

    async function loadUsers() {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (active) setUsers(data);
    }

    loadUsers();

    return () => {
      active = false;
    };
  }, []);

  return users.map(u => <div key={u.id}>{u.name}</div>);
}

/*
----------------------------------------
Cleanup-функция в useEffect
----------------------------------------
*/

function ResizeWatcher() {
  React.useEffect(() => {
    const onResize = () => console.log(window.innerWidth);

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return null;
}

/*
----------------------------------------
Пользовательский хук как функция логики
----------------------------------------
*/

function useToggle(initial = false) {
  const [value, setValue] = React.useState(initial);
  const toggle = () => setValue(v => !v);

  return { value, toggle };
}

function Toggle() {
  const { value, toggle } = useToggle();

  return (
    <button onClick={toggle}>
      {value ? "ON" : "OFF"}
    </button>
  );
}

/*
----------------------------------------
useReducer с чистой reducer-функцией
----------------------------------------
*/

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return [...state, action.payload];
    default:
      return state;
  }
}

function TodoApp() {
  const [todos, dispatch] = React.useReducer(reducer, []);

  return (
    <>
      <button onClick={() => dispatch({ type: "add", payload: "Task" })}>
        Add
      </button>
      {todos.map((t, i) => <p key={i}>{t}</p>)}
    </>
  );
}

/*
----------------------------------------
Render props — функция как children
----------------------------------------
*/

function DataProvider({ children }) {
  const [data] = React.useState(["A", "B", "C"]);
  return children(data);
}

/*
----------------------------------------
Callback ref — функция доступа к DOM
----------------------------------------
*/

function InputFocus() {
  let inputRef = null;

  return (
    <>
      <input ref={el => (inputRef = el)} />
      <button onClick={() => inputRef?.focus()}>
        Focus
      </button>
    </>
  );
}

/*
----------------------------------------
React.memo + функция пропса
----------------------------------------
*/

const MemoItem = React.memo(({ onClick, title }) => {
  console.log("render", title);
  return <button onClick={onClick}>{title}</button>;
});

/*
----------------------------------------
Асинхронная функция в обработчике события
----------------------------------------
*/

function SaveButton({ api, data }) {
  const [saved, setSaved] = React.useState(false);

  const handleSave = async () => {
    await api.save(data);
    setSaved(true);
  };

  return (
    <button onClick={handleSave}>
      {saved ? "Saved" : "Save"}
    </button>
  );
}

