// Реализована интеграция IntersectionObserver в React

import { useEffect, useRef, useState } from "react";

export default function IntersectionExample() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref}>
      <h2>Intersection</h2>
      {visible && <p>Элемент в зоне видимости</p>}
    </section>
  );
}
