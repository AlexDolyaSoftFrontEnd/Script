// Добавлен пример чтения размеров DOM-элемента

import { useEffect, useRef } from "react";

export default function SizeExample() {
  const ref = useRef(null);

  useEffect(() => {
    console.log(ref.current.offsetWidth);
    console.log(ref.current.getBoundingClientRect());
  }, []);

  return (
    <section>
      <h2>Sizes</h2>
      <div ref={ref} className="box">
        Measure me
      </div>
    </section>
  );
}
