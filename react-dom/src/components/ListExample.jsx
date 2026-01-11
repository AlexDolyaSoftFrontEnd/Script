// Реализовано создание и удаление элементов через state

import { useState } from "react";

export default function ListExample() {
  const [items, setItems] = useState([]);

  return (
    <section>
      <h2>Create / Remove</h2>

      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <button onClick={() => setItems(p => [...p, `Item ${p.length + 1}`])}>
        Добавить
      </button>
      <button onClick={() => setItems([])}>
        Очистить
      </button>
    </section>
  );
}
