function processMenuSimple(menuItems, options = {}) {
    const { filterBy = 'all', filterValue, sortBy = 'lemonade-last' } = options;
    
    let result = [...menuItems];
  
    // ФИЛЬТРАЦИЯ (if-else)
    if (filterBy === 'category') {
      result = result.filter(item => item.category === filterValue);
    } else if (filterBy === 'price') {
      result = result.filter(item => item.price <= filterValue);
    } else if (filterBy === 'popular') {
      result = result.filter(item => item.isPopular === true);
    } else if (filterBy === 'weight') {
      result = result.filter(item => item.weight >= filterValue);
    }
    // если 'all' или ничего не указано — пропускаем фильтрацию
  
    // СОРТИРОВКА (if-else)
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'lemonade-last') {
      result.sort((a, b) => {
        const isLemonadeA = a.name === "Грузинский лимонад";
        const isLemonadeB = b.name === "Грузинский лимонад";
        if (isLemonadeA && !isLemonadeB) return 1;
        if (!isLemonadeA && isLemonadeB) return -1;
        return 0;
      });
    }
    // если 'default' или ничего не указано — пропускаем сортировку
  
    return result;
  }
  
  // Данные меню
  const menuData = [
    { id: 1, name: "Аджапсандалі", price: 165, category: "vegetable", isPopular: true, weight: 550 },
    { id: 9, name: "Грузинский лимонад", price: 295, category: "drink", isPopular: false, weight: 400 },
    { id: 4, name: "Горячий Чахохбили", price: 130, category: "meat", isPopular: false, weight: 450 },
    { id: 7, name: "Суп «Харчо»", price: 150, category: "soup", isPopular: true, weight: 350 }
  ];
  
  // Вызов 1: мясные блюда по убыванию цены
  const meatMenu = processMenuSimple(menuData, {
    filterBy: 'category',
    filterValue: 'meat',
    sortBy: 'price-desc'
  });
  console.log("Мясные блюда:", meatMenu);
  
  // Вызов 2: популярные блюда по алфавиту
  const popularMenu = processMenuSimple(menuData, {
    filterBy: 'popular',
    sortBy: 'name'
  });
  console.log("Популярные:", popularMenu);
  
  // Вызов 3: всё меню, лимонад в конце
  const fullMenu = processMenuSimple(menuData, {
    filterBy: 'all',
    sortBy: 'lemonade-last'
  });
  console.log("Всё меню:", fullMenu);
  
  // Вызов 4: блюда до 200 грн
  const cheapMenu = processMenuSimple(menuData, {
    filterBy: 'price',
    filterValue: 200,
    sortBy: 'price-asc'
  });
  console.log("До 200 грн:", cheapMenu);