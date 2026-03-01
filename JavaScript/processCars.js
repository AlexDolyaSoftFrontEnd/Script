function processCars(cars, options = {}) {
    const { filterBy = 'all', filterValue, sortBy = 'tesla-last' } = options;
    
    let result = [...cars];
  
    // ФИЛЬТРАЦИЯ
    if (filterBy === 'type') {
      result = result.filter(item => item.type === filterValue);
    } else if (filterBy === 'price') {
      result = result.filter(item => item.price <= filterValue);
    } else if (filterBy === 'brand') {
      result = result.filter(item => item.brand === filterValue);
    } else if (filterBy === 'electric') {
      result = result.filter(item => item.isElectric === true);
    }
    // если 'all' или ничего не указано — пропускаем фильтрацию
  
    // СОРТИРОВКА
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'year') {
      result.sort((a, b) => b.year - a.year); // Сначала новые
    } else if (sortBy === 'tesla-last') {
      result.sort((a, b) => {
        const isTeslaA = a.brand === "Tesla";
        const isTeslaB = b.brand === "Tesla";
        if (isTeslaA && !isTeslaB) return 1;
        if (!isTeslaA && isTeslaB) return -1;
        return 0;
      });
    }
    // если 'default' или ничего не указано — пропускаем сортировку
  
    return result;
  }
  
  // Данные об автомобилях
  const carsData = [
    { id: 1, brand: "BMW", model: "X5", price: 55000, year: 2020, type: "suv", isElectric: false },
    { id: 2, brand: "Tesla", model: "Model 3", price: 45000, year: 2021, type: "sedan", isElectric: true },
    { id: 3, brand: "Mercedes", model: "E-Class", price: 60000, year: 2019, type: "sedan", isElectric: false },
    { id: 4, brand: "Audi", model: "e-tron", price: 70000, year: 2022, type: "suv", isElectric: true },
    { id: 5, brand: "Tesla", model: "Model Y", price: 52000, year: 2023, type: "suv", isElectric: true }
  ];
  
  // Вызов 1: Только внедорожники (SUV), Tesla в конце
  const suvCars = processCars(carsData, {
    filterBy: 'type',
    filterValue: 'suv',
    sortBy: 'tesla-last'
  });
  console.log("Внедорожники (Tesla в конце):", suvCars.map(c => c.brand + ' ' + c.model));
  
  // Вызов 2: Автомобили до 50000 грн, сортировка по цене (возрастание)
  const cheapCars = processCars(carsData, {
    filterBy: 'price',
    filterValue: 50000,
    sortBy: 'price-asc'
  });
  console.log("До 50000 (по цене):", cheapCars.map(c => c.brand + ' ' + c.price));
  
  // Вызов 3: Только электрокары, сначала новые
  const electricCars = processCars(carsData, {
    filterBy: 'electric',
    sortBy: 'year'
  });
  console.log("Электрокары (по году):", electricCars.map(c => c.brand + ' ' + c.year));
  
  // Вызов 4: Всё меню, Tesla строго последние
  const allCars = processCars(carsData, {
    filterBy: 'all',
    sortBy: 'tesla-last'
  });
  console.log("Все авто (Tesla в конце):", allCars.map(c => c.brand));
  