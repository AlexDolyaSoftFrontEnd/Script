function processArray(items, options = {}) {
    const { filterBy = 'all', filterValue, sortBy = 'special-last' } = options;
    
    let result = [...items];
  
    // ФИЛЬТРАЦИЯ
    if (filterBy === 'length') {
      result = result.filter(item => item.length >= filterValue);
    } else if (filterBy === 'contains') {
      result = result.filter(item => item.toLowerCase().includes(filterValue.toLowerCase()));
    } else if (filterBy === 'starts') {
      result = result.filter(item => item.toLowerCase().startsWith(filterValue.toLowerCase()));
    } else if (filterBy === 'ends') {
      result = result.filter(item => item.toLowerCase().endsWith(filterValue.toLowerCase()));
    }
    // если 'all' или ничего не указано — пропускаем фильтрацию
  
    // СОРТИРОВКА
    if (sortBy === 'asc') {
      result.sort((a, b) => a.localeCompare(b));
    } else if (sortBy === 'desc') {
      result.sort((a, b) => b.localeCompare(a));
    } else if (sortBy === 'length-asc') {
      result.sort((a, b) => a.length - b.length);
    } else if (sortBy === 'length-desc') {
      result.sort((a, b) => b.length - a.length);
    } else if (sortBy === 'special-last') {
      result.sort((a, b) => {
        const isSpecialA = a === "Грузинский лимонад";
        const isSpecialB = b === "Грузинский лимонад";
        if (isSpecialA && !isSpecialB) return 1;
        if (!isSpecialA && isSpecialB) return -1;
        return 0;
      });
    }
    // если 'default' или ничего не указано — пропускаем сортировку
  
    return result;
  }
  
  // Пример 1: Массив названий блюд
  const menuItems = [
    "Аджапсандалі",
    "Грузинский лимонад",
    "Горячий Чахохбили",
    "Суп Харчо",
    "Хинкали",
    "Бадриджани"
  ];
  
  const filteredMenu = processArray(menuItems, {
    filterBy: 'contains',
    filterValue: 'и',
    sortBy: 'asc'
  });
  console.log("С буквой 'и':", filteredMenu);
  
  // Пример 2: Массив чисел (цены)
  const prices = [165, 295, 130, 150, 320, 175];
  
  const filteredPrices = processArray(prices, {
    filterBy: 'all',
    sortBy: 'asc'
  });
  console.log("Цены по возрастанию:", filteredPrices);
  
  // Пример 3: Массив названий с лимонадом в конце
  const allItems = processArray(menuItems, {
    filterBy: 'all',
    sortBy: 'special-last'
  });
  console.log("Всё (лимонад в конце):", allItems);
  
  // Пример 4: Названия от 10 символов
  const longNames = processArray(menuItems, {
    filterBy: 'length',
    filterValue: 10,
    sortBy: 'length-desc'
  });
  console.log("Длинные названия:", longNames);
  
  // Пример 5: Названия начинающиеся на "Г"
  const startsWithG = processArray(menuItems, {
    filterBy: 'starts',
    filterValue: 'Г',
    sortBy: 'asc'
  });
  console.log("На 'Г':", startsWithG);
  