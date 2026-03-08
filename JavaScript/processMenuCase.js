function processMenuAdvanced(menuItems, options = {}) {
    const { filterBy = 'all', filterValue, sortBy = 'lemonade-last' } = options;
    
    let result = [...menuItems];
  
    // ФИЛЬТРАЦИЯ
    switch (filterBy) {
      case 'category':
        result = result.filter(item => item.category === filterValue);
        break;
      case 'price':
        result = result.filter(item => item.price <= filterValue);
        break;
      case 'popular':
        result = result.filter(item => item.isPopular === true);
        break;
      case 'weight':
        result = result.filter(item => item.weight >= filterValue);
        break;
      case 'all':
      default:
        break;
    }
  
    // СОРТИРОВКА
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'lemonade-last':
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
        break;
    }
  
    return result;
  }
  
  // Данные меню
  const menuData = [
    { id: 1, name: "Аджапсандалі", price: 165, category: "vegetable", isPopular: true, weight: 550 },
    { id: 9, name: "Грузинский лимонад", price: 295, category: "drink", isPopular: false, weight: 400 },
    { id: 4, name: "Горячий Чахохбили", price: 130, category: "meat", isPopular: false, weight: 450 },
    { id: 7, name: "Суп «Харчо»", price: 150, category: "soup", isPopular: true, weight: 350 }
  ];
  
  // Вызов: показать только мясные блюда, отсортированные по цене (от дорогих к дешевым)
  const meatMenu = processMenuAdvanced(menuData, {
    filterBy: 'category',
    filterValue: 'meat',
    sortBy: 'price-desc'
  });
  
  console.log(meatMenu);
  