// ===============================
// Selectors
// ===============================
const title = document.getElementById('title');
const qs = (s) => document.querySelector(s);

// ===============================
// Text / HTML
// ===============================
qs('#textBtn').addEventListener('click', () => {
  qs('#text').textContent = 'Текст изменён через JS';
});

// ===============================
// Classes
// ===============================
qs('#classBtn').addEventListener('click', () => {
  qs('#classBox').classList.toggle('active');
});

// ===============================
// Attributes
// ===============================
qs('#attrBtn').addEventListener('click', () => {
  qs('#img').setAttribute(
    'src',
    'https://via.placeholder.com/100/0000FF'
  );
});

// ===============================
// Dataset
// ===============================
const dataBox = qs('#dataBox');
console.log(dataBox.dataset.id);
console.log(dataBox.dataset.status);

// ===============================
// Create / Remove
// ===============================
const list = qs('#list');
let counter = 1;

qs('#addItem').onclick = () => {
  const li = document.createElement('li');
  li.textContent = `Item ${counter++}`;
  list.append(li);
};

qs('#clearList').onclick = () => {
  list.innerHTML = '';
};

// ===============================
// Event Delegation
// ===============================
qs('#delegation').addEventListener('click', (e) => {
  if (e.target.classList.contains('item')) {
    alert(e.target.textContent);
  }
});

// ===============================
// Form + FormData
// ===============================
qs('#form').addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(e.target);
  console.log(data.get('email'));

  e.target.reset();
});

// ===============================
// Inputs
// ===============================
qs('#inputBtn').onclick = () => {
  console.log('Input:', qs('#input').value);
  console.log('Checked:', qs('#checkbox').checked);
};

// ===============================
// Scroll
// ===============================
qs('#scrollBtn').onclick = () => {
  window.scrollBy({ top: 200, behavior: 'smooth' });
};

// ===============================
// Sizes / position
// ===============================
console.log('Title width:', title.offsetWidth);
console.log(title.getBoundingClientRect());

// ===============================
// Template
// ===============================
qs('#tplBtn').onclick = () => {
  const tpl = qs('#tpl');
  const clone = tpl.content.cloneNode(true);
  qs('#tplContainer').append(clone);
};

// ===============================
// DOM ready
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');
});
