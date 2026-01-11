// Показано различие controlled и uncontrolled inputs

import { useRef, useState } from "react";

export default function InputsExample() {
  const inputRef = useRef(null);
  const [checked, setChecked] = useState(false);

  return (
    <section>
      <h2>Inputs</h2>

      <input ref={inputRef} />
      <input
        type="checkbox"
        checked={checked}
        onChange={e => setChecked(e.target.checked)}
      />

      <button onClick={() =>
        console.log(inputRef.current.value, checked)
      }>
        Check
      </button>
    </section>
  );
}
