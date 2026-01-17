import { useRef, useState } from "react";

export default function FocusInputExample() {
  // Ссылка на DOM-элемент input
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Состояние для отображения введённого текста
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleReadValue = () => {
    if (!inputRef.current) return;

    const currentValue = inputRef.current.value.trim();

    if (!currentValue) {
      setError("Поле не должно быть пустым");
      return;
    }

    setError("");
    setValue(currentValue);
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }

    setValue("");
    setError("");
  };

  const handleSelectText = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>useRef: работа с input</h2>

      <input
        ref={inputRef}
        type="text"
        placeholder="Введите текст"
        style={{
          width: "100%",
          padding: "8px",
          border: error ? "1px solid red" : "1px solid #ccc",
        }}
      />

      {error && (
        <p style={{ color: "red", marginTop: "6px" }}>
          {error}
        </p>
      )}

      <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
        <button onClick={handleFocus}>Фокус</button>
        <button onClick={handleReadValue}>Считать</button>
        <button onClick={handleSelectText}>Выделить</button>
        <button onClick={handleClear}>Очистить</button>
      </div>

      {value && (
        <div style={{ marginTop: "16px" }}>
          <strong>Введённое значение:</strong>
          <div>{value}</div>
        </div>
      )}
    </div>
  );
}

