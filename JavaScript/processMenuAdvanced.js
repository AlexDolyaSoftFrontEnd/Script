/**
 * Функция для обработки меню с использованием switch-case.
 * @param {Array} menuItems - Массив объектов меню.
 * @param {Object} options - Объект с настройками обработки.
 * @param {string} options.filterBy - Тип фильтрации: 'category', 'price', 'popular', 'all'.
 * @param {string|number} options.filterValue - Значение для фильтрации (название категории, цена и т.д.).
 * @param {string} options.sortBy - Тип сортировки: 'default', 'price-asc', 'price-desc', 'lemonade-last'.
 * @returns {Array} - Обработанный массив меню.
 */
function processMenuAdvanced(menuItems, options = {}) {
    const { filterBy = 'all', filterValue, sortBy = 'lemonade-last' } = options;
    
    let result = [...menuItems]; // Создаем копию массива, чтобы не мутировать оригинал
  
    // ==========================================
    // БЛОК 1: ФИЛЬТРАЦИЯ (switch-case)
    // ==========================================
    switch (filterBy) {
      case 'category':
        // Фильтруем по точному совпадению категории
        result = result.filter(item => item.category === filterValue);
        break;
        
      case 'price':
        // Фильтруем по максимальной цене (filterValue выступает как лимит)
        result = result.filter(item => item.price <= filterValue);
        break;
        
      case 'popular':
        // Показываем только популярные позиции (isPopular === true)
        // filterValue в этом случае игнорируется
        result = result.filter(item => item.isPopular === true);
        break;
        
      case 'weight':
        // Фильтр по минимальному весу порции (например, сытные блюда)
        result = result.filter(item => item.weight >= filterValue);
        break;
        
      case 'all':
      default:
        // Если фильтр не указан или 'all', возвращаем все элементы
        // Явно ничего не делаем, result уже содержит все элементы
        break;
    }
  
    // ==========================================
    // БЛОК 2: СОРТИРОВКА (switch-case)
    // ==========================================
    switch (sortBy) {
      case 'price-asc':
        // Сортировка по возрастанию цены (от дешевых к дорогим)
        result.sort((a, b) => a.price - b.price);
        break;
        
      case 'price-desc':
        // Сортировка по убыванию цены (от дорогих к дешевым)
        result.sort((a, b) => b.price - a.price);
        break;
        
      case 'name':
        // Сортировка по алфавиту
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
        
      case 'lemonade-last':
        // Специальная сортировка: Грузинский лимонад всегда в конце
        result.sort((a, b) => {
          const isLemonadeA = a.name === "Грузинский лимонад";
          const isLemonadeB = b.name === "Грузинский лимонад";
          
          if (isLemonadeA && !isLemonadeB) return 1;
          if (!isLemonadeA && isLemonadeB) return -1;
          return 0;
        });
        break;
        
      case 'default':
      default:
        // Сохраняем исходный порядок элементов
        break;
    }
  
    return result;
  }
  
  // --- ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ ---
  
  const menuData = [
    {
      "id": 1,
      "name": "Аджапсандалі",
      "price": 165,
      "category": "vegetable",
      "isPopular": true,
      "weight": 550
    },
    {
      "id": 9,
      "name": "Грузинский лимонад",
      "price": 295,
      "category": "drink",
      "isPopular": false,
      "weight": 400
    },
    {
      "id": 4,
      "name": "Горячий Чахохбили",
      "price": 130,
      "category": "meat",
      "isPopular": false,
      "weight": 450
    },
    {
      "id": 7,
      "name": "Суп «Харчо»",
      "price": 150,
      "category": "soup",
      "isPopular": true,
      "weight": 350
    }
  ];
  
  // Пример 1: Фильтрация по категории + специальная сортировка (лимонад в конце)
  console.log("=== Овощные блюда (лимонад в конце, если бы попал в выборку) ===");
  const vegetableDishes = processMenuAdvanced(menuData, {
    filterBy: 'category',
    filterValue: 'vegetable',
    sortBy: 'lemonade-last'
  });
  console.log(vegetableDishes.map(item => item.name)); 
  // Вывод: ['Аджапсандалі'] (лимонад не попал, т.к. это drink)
  
  // Пример 2: Фильтрация по цене до 200 грн + сортировка по возрастанию цены
  console.log("\n=== Блюда до 200 грн (сначала дешевые) ===");
  const cheapDishes = processMenuAdvanced(menuData, {
    filterBy: 'price',
    filterValue: 200,
    sortBy: 'price-asc'
  });
  console.log(cheapDishes.map(item => `${item.name} - ${item.price} грн`));
  // Вывод: ['Горячий Чахохбили - 130 грн', 'Суп «Харчо» - 150 грн', 'Аджапсандалі - 165 грн']
  
  // Пример 3: Только популярные блюда + сортировка по имени
  console.log("\n=== Популярные блюда (по алфавиту) ===");
  const popularDishes = processMenuAdvanced(menuData, {
    filterBy: 'popular',
    sortBy: 'name'
  });
  console.log(popularDishes.map(item => item.name));
  // Вывод: ['Аджапсандалі', 'Суп «Харчо»']
  
  // Пример 4: Фильтр по весу порции (большие порции от 400г) + сортировка по убыванию цены
  console.log("\n=== Сытные порции (от 400г), сначала дорогие ===");
  const largePortions = processMenuAdvanced(menuData, {
    filterBy: 'weight',
    filterValue: 400,
    sortBy: 'price-desc'
  });
  console.log(largePortions.map(item => `${item.name} - ${item.weight}г, ${item.price} грн`));
  // Вывод: ['Грузинский лимонад - 400г, 295 грн', 'Горячий Чахохбили - 450г, 130 грн', 'Аджапсандалі - 550г, 165 грн']
  // Примечание: Лимонад здесь первый по цене, но если бы мы использовали 'lemonade-last', он ушел бы в конец
  
  // Пример 5: Без фильтров, но с принудительным перемещением лимонада в конец
  console.log("\n=== Всё меню (лимонад строго последний) ===");
  const fullMenuSorted = processMenuAdvanced(menuData, {
    filterBy: 'all',
    sortBy: 'lemonade-last'
  });
  console.log(fullMenuSorted.map(item => item.name));
  // Вывод: ['Аджапсандалі', 'Горячий Чахохбили', 'Суп «Харчо»', 'Грузинский лимонад']