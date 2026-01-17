// Показано различие controlled и uncontrolled inputs

import { useRef, useState } from "react";

export default function InputsExample() {
  // Uncontrolled input (значение живёт в DOM)
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Controlled input (значение живёт в React state)
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    if (!inputRef.current) return;

    console.log("Uncontrolled value:", inputRef.current.value);
    console.log("Controlled value:", checked);
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }

    setChecked(false);
  };

  return (
    <section style={{ padding: "20px", maxWidth: "360px" }}>
      <h2>Controlled vs Uncontrolled</h2>

      {/* Uncontrolled input */}
      <div style={{ marginBottom: "12px" }}>
        <label>
          Uncontrolled input
          <input
            ref={inputRef}
            type="text"
            placeholder="Значение в DOM"
            style={{ display: "block", width: "100%", marginTop: "4px" }}
          />
        </label>
      </div>

      {/* Controlled checkbox */}
      <div style={{ marginBottom: "12px" }}>
        <label>
          Controlled checkbox
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            style={{ marginLeft: "8px" }}
          />
        </label>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={handleCheck}>Check</button>
        <button onClick={handleClear}>Reset</button>
      </div>

      <div style={{ marginTop: "16px", fontSize: "14px" }}>
        <div>
          <strong>Uncontrolled:</strong> React не знает значение, пока ты его не спросишь
        </div>
        <div>
          <strong>Controlled:</strong> React всегда знает текущее состояние
        </div>
      </div>
    </section>
  );
}
