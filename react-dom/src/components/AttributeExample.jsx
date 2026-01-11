// Добавлен пример изменения HTML-атрибутов через props

import { useState } from "react";

export default function AttributeExample() {
  const [src, setSrc] = useState("https://via.placeholder.com/100");

  return (
    <section>
      <h2>Attributes</h2>
      <img src={src} />
      <button
        onClick={() =>
          setSrc("https://via.placeholder.com/100/0000FF")
        }
      >
        Сменить картинку
      </button>
    </section>
  );
}
