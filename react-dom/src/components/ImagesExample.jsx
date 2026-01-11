
// Базовый импорт изображения
// Используется, когда изображение — часть компонента


import logo from "../assets/logo.png";

export default function ImageBasic() {
  return (
    <div>
      <h2>Базовый импорт изображения</h2>
      <img src={logo} alt="Logo" width={120} />
    </div>
  );
}

// Несколько изображений + массив данных

import img1 from "../assets/1.jpg";
import img2 from "../assets/2.jpg";
import img3 from "../assets/3.jpg";

export default function ImageGallery() {
  var images = [img1, img2, img3];

  return (
    <div>
      <h2>Галерея изображений</h2>

      {images.map(function (src, index) {
        return (
          <img
            key={index}
            src={src}
            alt={"Image " + (index + 1)}
            width={150}
            style={{ marginRight: "10px" }}
          />
        );
      })}
    </div>
  );
}

// Изображение как background (inline style)

import banner from "../assets/banner.jpg";

export default function BackgroundImage() {
  return (
    <section
      style={{
        height: "200px",
        backgroundImage: "url(" + banner + ")",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 style={{ color: "#fff", padding: "20px" }}>
        Background image
      </h2>
    </section>
  );
}

// Условный рендер изображения

import { useState } from "react";
import preview from "../assets/preview.png";

export default function ToggleImage() {
  var [visible, setVisible] = useState(false);

  return (
    <div>
      <h2>Показать / скрыть изображение</h2>

      <button onClick={function () {
        setVisible(!visible);
      }}>
        Toggle
      </button>

      {visible && (
        <img
          src={preview}
          alt="Preview"
          width={200}
          style={{ display: "block", marginTop: "10px" }}
        />
      )}
    </div>
  );
}

// Lazy-loading + onLoad

import photo from "../assets/photo.jpg";

export default function LazyImage() {
  return (
    <img
      src={photo}
      alt="Lazy"
      loading="lazy"
      onLoad={function () {
        console.log("Изображение загружено");
      }}
      style={{ maxWidth: "100%" }}
    />
  );
}

// Изображение в объекте данных (паттерн для карточек)

import userAvatar from "../assets/avatar.png";

var user = {
  name: "Alex",
  avatar: userAvatar,
};

export default function UserCard() {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px" }}>
      <img src={user.avatar} alt="Avatar" width={80} />
      <p>{user.name}</p>
    </div>
  );
}

/*
// import image — правильно
import img from "./img.png";

// public/ — только если путь должен быть динамический
<img src="/images/img.png" />

// для сборщиков (Vite, CRA, Webpack)
import всегда безопаснее
*/