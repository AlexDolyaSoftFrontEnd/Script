// Добавлен controlled form без прямого FormData

import { useState } from "react";

export default function FormExample() {
  const [email, setEmail] = useState("");

  const submit = (e) => {
    e.preventDefault();
    console.log(email);
    setEmail("");
  };

  return (
    <section>
      <h2>Form</h2>
      <form onSubmit={submit}>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button>Send</button>
      </form>
    </section>
  );
}
