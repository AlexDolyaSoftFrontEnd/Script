// Реализовано управление CSS-классами без classList

import { useState } from "react";

export default function ClassExample() {
  const [active, setActive] = useState(false);

  return (
    <section>
      <h2>Classes</h2>
      <div className={`box ${active ? "active" : ""}`}>Box</div>
      <button onClick={() => setActive(v => !v)}>
        Toggle class
      </button>
    </section>
  );
}
