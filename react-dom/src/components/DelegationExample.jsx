// Реализовано делегирование событий через один обработчик

export default function DelegationExample() {
    const onClick = (e) => {
      if (e.target.dataset.item) {
        alert(e.target.dataset.item);
      }
    };
  
    return (
      <section>
        <h2>Delegation</h2>
        <ul onClick={onClick}>
          <li data-item="Item 1">Item 1</li>
          <li data-item="Item 2">Item 2</li>
        </ul>
      </section>
    );
  }
  