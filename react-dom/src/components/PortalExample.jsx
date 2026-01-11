// Добавлен пример использования React Portal

import { createPortal } from "react-dom";

export default function PortalExample() {
  return createPortal(
    <div style={{
      position: "fixed",
      bottom: 10,
      right: 10,
      background: "#000",
      color: "#fff",
      padding: "8px"
    }}>
      Portal element
    </div>,
    document.body
  );
}
