// Добавлено программное управление прокруткой страницы

export default function ScrollExample() {
    return (
      <section style={{ height: 300 }}>
        <h2>Scroll</h2>
        <button
          onClick={() =>
            window.scrollBy({ top: 200, behavior: "smooth" })
          }
        >
          Scroll down
        </button>
      </section>
    );
  }
  