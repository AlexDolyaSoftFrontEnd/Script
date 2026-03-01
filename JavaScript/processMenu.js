/**
 * Функция для обработки меню с условиями.
 * @param {Array} menuItems - Массив объектов меню.
 * @param {Object} filters - Объект с условиями фильтрации.
 * @param {string} filters.category - Фильтр по категории (например, 'meat', 'vegetable').
 * @param {number} filters.maxPrice - Максимальная цена.
 * @returns {Array} - Отфильтрованный и отсортированный массив.
 */

function processMenu(menuItems, filters = {}) {
    const { category, maxPrice } = filters;
  
    // 1. Фильтрация по условиям
    let filteredItems = menuItems.filter(item => {
      // Условие 1: Проверка категории (если она указана)
      if (category && item.category !== category) {
        return false;
      }
  
      // Условие 2: Проверка максимальной цены (если она указана)
      if (maxPrice && item.price > maxPrice) {
        return false;
      }
  
      return true;
    });
  
    // 2. Сортировка: Грузинский лимонад всегда последний
    filteredItems.sort((a, b) => {
      const isLemonadeA = a.name === "Грузинский лимонад";
      const isLemonadeB = b.name === "Грузинский лимонад";
  
      if (isLemonadeA && !isLemonadeB) return 1; // A (лимонад) идет после B
      if (!isLemonadeA && isLemonadeB) return -1; // B (лимонад) идет после A
      return 0; // Остальные элементы остаются в своем порядке
    });
  
    return filteredItems;
  }
  
  // --- ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ ---
  
  // Предположим, у вас есть переменная menuData с вашим JSON
  const menuData = [
      // ... (ваши данные из предыдущего запроса)
      {
        "id": 9,
        "name": "Грузинский лимонад",
        "description": "Освежающий напиток...",
        "price": 295,
        "category": "drink"
      },
      {
        "id": 4,
        "name": "Горячий Чахохбили",
        "price": 130,
        "category": "meat"
      }
      // ... остальные элементы
  ];
  
  // Пример 1: Получить всё меню (Лимонад будет в конце)
  const fullMenu = processMenu(menuData);
  console.log("Всё меню:", fullMenu);
  
  // Пример 2: Получить только мясные блюда до 200 грн
  // (Лимонад всё равно будет в конце, если он попал в выборку, или его не будет, если фильтр строгий)
  // Примечание: Поскольку лимонад стоит 295 и это не 'meat', он не попадёт в этот список.
  const meatUnder200 = processMenu(menuData, { category: 'meat', maxPrice: 200 });
  console.log("Мясо до 200 грн:", meatUnder200);
  
  // Пример 3: Получить только напитки (Лимонад будет единственным или последним среди напитков)
  const drinks = processMenu(menuData, { category: 'drink' });
  console.log("Напитки:", drinks);