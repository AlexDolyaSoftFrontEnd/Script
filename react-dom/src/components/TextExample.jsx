// Добавлен пример управления текстом через состояние

import { useState } from "react";

export default function TextExample() {
  const [text, setText] = useState("Исходный текст");

  return (
    <section>
      <h2>Text</h2>
      <div className="box">{text}</div>
      <button onClick={() => setText("Текст изменён через React")}>
        Изменить текст
      </button>
    </section>
  );
}
