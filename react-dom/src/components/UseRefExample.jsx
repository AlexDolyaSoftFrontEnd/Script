import { useRef } from "react";

export default function FocusInputExample() {
  // useRef создаёт ссылку на DOM-элемент input
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFocus = () => {
    // Проверяем, что элемент существует
    if (inputRef.current) {
      // Программно устанавливаем фокус
      inputRef.current.focus();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>useRef: работа с DOM</h2>

      {/* Привязываем ref к input */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Нажми кнопку для фокуса"
      />

      <br />
      <br />

      <button onClick={handleFocus}>
        Установить фокус
      </button>
    </div>
  );
}
