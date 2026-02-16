// ===============================
// Selectors
// ===============================
// Коммит: добавлены универсальные селекторы для ES5

var title = document.getElementById('title');

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}

// ===============================
// Text / HTML
// ===============================
// Коммит: управление textContent и innerHTML

qs('#textBtn').addEventListener('click', function () {
  qs('#text').textContent = 'Текст изменён через JavaScript (ES5)';
});

qs('#htmlBtn').addEventListener('click', function () {
  qs('#text').innerHTML = '<strong>HTML</strong> изменён';
});

// ===============================
// Classes
// ===============================
// Коммит: переключение классов через classList

qs('#classBtn').addEventListener('click', function () {
  qs('#classBox').classList.toggle('active');
});

// ===============================
// Attributes
// ===============================
// Коммит: работа с HTML-атрибутами

qs('#attrBtn').addEventListener('click', function () {
  qs('#img').setAttribute(
    'src',
    'https://via.placeholder.com/100/ff0000'
  );
});

// ===============================
// Dataset
// ===============================
// Коммит: чтение data-атрибутов

var dataBox = qs('#dataBox');

console.log('ID:', dataBox.dataset.id);
console.log('Status:', dataBox.dataset.status);

// ===============================
// Create / Remove
// ===============================
// Коммит: динамическое создание и удаление DOM-узлов

var list = qs('#list');
var counter = 1;

qs('#addItem').onclick = function () {
  var li = document.createElement('li');
  li.className = 'item';
  li.appendChild(document.createTextNode('Item ' + counter));
  counter += 1;

  list.appendChild(li);
};

qs('#clearList').onclick = function () {
  list.innerHTML = '';
  counter = 1;
};

// ===============================
// Event Delegation
// ===============================
// Коммит: делегирование событий

qs('#delegation').addEventListener('click', function (e) {
  var target = e.target;

  if (target && target.classList.contains('item')) {
    alert('Clicked: ' + target.textContent);
  }
});

// ===============================
// Form + FormData
// ===============================
// Коммит: обработка формы без перезагрузки страницы

qs('#form').addEventListener('submit', function (e) {
  e.preventDefault();

  var formData = new FormData(e.target);
  console.log('Email:', formData.get('email'));

  e.target.reset();
});

// ===============================
// Inputs
// ===============================
// Коммит: чтение значений input и checkbox

qs('#inputBtn').onclick = function () {
  console.log('Input value:', qs('#input').value);
  console.log('Checkbox checked:', qs('#checkbox').checked);
};

// ===============================
// Scroll
// ===============================
// Коммит: программный скролл страницы

qs('#scrollBtn').onclick = function () {
  window.scrollBy({
    top: 200,
    behavior: 'smooth'
  });
};

// ===============================
// Sizes / Position
// ===============================
// Коммит: измерение размеров и позиции элемента

console.log('Title width:', title.offsetWidth);
console.log('Title rect:', title.getBoundingClientRect());

// ===============================
// Style manipulation
// ===============================
// Коммит: управление inline-стилями

qs('#styleBtn').onclick = function () {
  var box = qs('#styleBox');
  box.style.backgroundColor = '#ffeeba';
  box.style.borderColor = '#f0ad4e';
};

// ===============================
// Show / Hide
// ===============================
// Коммит: управление видимостью элементов

qs('#toggleBtn').onclick = function () {
  qs('#toggleBox').classList.toggle('hidden');
};

// ===============================
// DOM ready
// ===============================
// Коммит: безопасная инициализация после загрузки DOM

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM полностью загружен');
});
