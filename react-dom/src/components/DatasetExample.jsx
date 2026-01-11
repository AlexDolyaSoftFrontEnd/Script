// Добавлен пример замены dataset на объектные данные

export default function DatasetExample() {
    const data = { id: 10, status: "active" };
  
    return (
      <section>
        <h2>Dataset</h2>
        <div className="box">
          id: {data.id}, status: {data.status}
        </div>
      </section>
    );
  }
  