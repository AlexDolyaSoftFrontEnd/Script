console.group("=== 1. Локальные и Глобальные переменные ===");

// ==========================================
// 1. Глобальные переменные
// ==========================================
console.log("\n1. Глобальные переменные:");

var globalVar = "Глобальная (var)";
let globalLet = "Глобальная (let)";
const globalConst = "Я глобальная (const)";

function accessGlobal() {
    console.log("Доступ к globalVar:", globalVar);
    console.log("Доступ к globalLet:", globalLet);
    console.log("Доступ к globalConst:", globalConst);
}

accessGlobal();

// ==========================================
// 2. Локальные переменные (Область функции)
// ==========================================
console.log("\n2. Локальные переменные (Function Scope):");

function localScopeExample() {
    var functionVar = "Видна внутри функции";
    let functionLet = "Тоже видна внутри";
    
    console.log("Внутри функции:", functionVar);
    console.log("Внутри функции:", functionLet);
}

localScopeExample();

// ==========================================
// 3. Блочная область видимости (Block Scope)
// ==========================================
console.log("\n3. Блочная область (Block Scope):");

if (true) {
    var blockVar = "var игнорирует блоки";
    let blockLet = "let видит блоки";
    const blockConst = "const видит блоки";
    
    console.log("Внутри блока:", blockVar);
    console.log("Внутри блока:", blockLet);
}

console.log("Снаружи блока:", blockVar);

// ==========================================
// 4. Подъем переменных (Hoisting)
// ==========================================
console.log("\n4. Подъем переменных (Hoisting):");

console.log("hoistedVar до объявления:", hoistedVar);
var hoistedVar = "Я поднята";
console.log("hoistedVar после объявления:", hoistedVar);

let hoistedLet = "Я тоже поднята, но нельзя использовать до строки объявления";

// ==========================================
// 5. Цепочка областей видимости (Scope Chain)
// ==========================================
console.log("\n5. Цепочка областей видимости:");

const outerVar = "Внешняя";

function outerFunction() {
    const middleVar = "Средняя";
    
    function innerFunction() {
        const innerVar = "Внутренняя";
        
        console.log("Внутренняя видит:", innerVar);
        console.log("Внутренняя видит:", middleVar);
        console.log("Внутренняя видит:", outerVar);
    }
    
    innerFunction();
}

outerFunction();

// ==========================================
// 6. Замыкания (Closures)
// ==========================================
console.log("\n6. Замыкания:");

function createCounter() {
    let count = 0;
    
    return {
        increment() {
            count++;
            console.log("Счетчик:", count);
        },
        getCount() {
            return count;
        }
    };
}

const counter1 = createCounter();
counter1.increment();
counter1.increment();

const counter2 = createCounter();
counter2.increment();

// ==========================================
// 7. Конфликт имен (Shadowing)
// ==========================================
console.log("\n7. Перекрытие имен (Shadowing):");

const shadowVar = "Глобальная";

function shadowExample() {
    const shadowVar = "Локальная";
    console.log("Внутри функции:", shadowVar);
    
    if (true) {
        const shadowVar = "Блочная";
        console.log("Внутри блока:", shadowVar);
    }
    
    console.log("Снова внутри функции:", shadowVar);
}

shadowExample();
console.log("Глобальная:", shadowVar);

// ==========================================
// 8. Глобальный объект (window / global)
// ==========================================
console.log("\n8. Глобальный объект:");

var windowVar = "Свойство window";
console.log("window.windowVar:", window.windowVar);

let windowLet = "Не свойство window";
console.log("window.windowLet:", window.windowLet);

// ==========================================
// 9. Best Practices (Рекомендации)
// ==========================================
console.log("\n9. Лучшие практики:");

const API_URL = "https://api.example.com";
let currentUser = null;

function initApp() {
    const config = { debug: true };
    console.log("Приложение инициализировано");
}

initApp();

console.groupEnd();

console.group("=== 2. Сравнение типов данных ===");

console.log("\n1. Строгое и нестрогое равенство:");
console.log("5 == '5'   :", 5 == '5');
console.log("5 === '5'  :", 5 === '5');

console.log("\n2. Числа и Строки:");
console.log("10 == '10' :", 10 == '10');
console.log("10 === '10':", 10 === '10');
console.log("'10' == 10 + '':", '10' == 10 + '');

console.log("\n3. Логические значения:");
console.log("true == 1  :", true == 1);
console.log("true === 1 :", true === 1);
console.log("false == 0 :", false == 0);
console.log("'' == false:", '' == false);

console.log("\n4. Null и Undefined:");
console.log("null == undefined :", null == undefined);
console.log("null === undefined:", null === undefined);
console.log("null == 0         :", null == 0);
console.log("undefined == 0    :", undefined == 0);

console.log("\n5. Объекты и Массивы:");
const obj1 = { a: 1 };
const obj2 = { a: 1 };
const obj3 = obj1;

const arr1 = [1, 2];
const arr2 = [1, 2];

console.log("Объекты равны по содержанию? {a:1} == {a:1}:", obj1 == obj2);
console.log("Объекты равны по ссылке? obj1 == obj3     :", obj1 == obj3);
console.log("Массивы равны по содержанию? [1,2] == [1,2]:", arr1 == arr2);
console.log("Массив == Строка? [1,2] == '1,2'          :", arr1 == '1,2');

console.log("\n6. Проверка типа (typeof):");
console.log("typeof 123      :", typeof 123);
console.log("typeof 'hello'  :", typeof 'hello');
console.log("typeof true     :", typeof true);
console.log("typeof {}       :", typeof {});
console.log("typeof null     :", typeof null);
console.log("typeof undefined:", typeof undefined);

console.groupEnd();

console.group("=== 3. Объекты ES5 и ES6 ===");

var userName = "Alex";
var userAge = 25;

var userES5 = {
    name: userName,
    age: userAge,
    getInfo: function() {
        return this.name + " is " + this.age;
    }
};

var dynamicKey = "status";
var objES5 = {};
objES5[dynamicKey] = "active";

function PersonES5(name) {
    this.name = name;
    this.sayHello = function() {
        return "Hello, " + this.name;
    };
}
var personInstanceES5 = new PersonES5("John");

var targetES5 = {};
var sourceES5 = { a: 1 };
for (var key in sourceES5) {
    if (sourceES5.hasOwnProperty(key)) {
        targetES5[key] = sourceES5[key];
    }
}

const userName6 = "Alex";
const userAge6 = 33;

const userES6 = {
    name: userName6,
    age: userAge6,
    getInfo() {
        return `${this.name} is ${this.age}`;
    }
};

const dynamicKey6 = "status";
const objES6 = {
    [dynamicKey6]: "active"
};

class PersonES6 {
    constructor(name) {
        this.name = name;
    }
    sayHello() {
        return `Hello, ${this.name}`;
    }
}
const personInstanceES6 = new PersonES6("John");

const sourceES6 = { a: 1 };
const targetAssign = Object.assign({}, sourceES6);
const targetSpread = { ...sourceES6 };

const { name: userNameDestruct, age: userAgeDestruct } = userES6;

const productName = "Product";
const productPrice = 100;

const item = {
    productName,
    price: productPrice,
    category: "Electronics"
};

const statusKey = "status";
const config = {
    [statusKey]: "active",
    [`type_${statusKey}`]: "premium"
};

const calculator = {
    add(a, b) {
        return a + b;
    },
    multiply: function(a, b) {
        return a * b;
    },
};

const userContext = {
    firstName: "John",
    getFullName() {
        return this.firstName;
    },
    getFullNameArrow: () => {
        return "No access to this";
    }
};

class Animal {
    constructor(name) {
        this.name = name;
        this.alive = true;
    }
    speak() {
        return `${this.name} makes a noise`;
    }
    get info() {
        return `${this.name} is ${this.alive ? "alive" : "dead"}`;
    }
    set status(value) {
        this.alive = value;
    }
    static compare(a, b) {
        return a.name === b.name;
    }
}

const sourceUtils = { a: 1, b: 2 };
const extra = { c: 3 };

const merged = { ...sourceUtils, ...extra };
const copied = { ...sourceUtils };
const assigned = Object.assign({}, sourceUtils, extra);

const { a: alpha, b: beta } = sourceUtils;

function printData({ name: propName, ...restProps }) {
    return restProps;
}

function createCircle(radius) {
    return {
        radius,
        getArea() {
            return Math.PI * radius ** 2;
        }
    };
}

const circle1 = createCircle(5);
const circle2 = createCircle(10);

console.groupEnd();

console.group("=== 4. Функции в JavaScript ===");

console.log("\n1. Function Declaration:");

function greetDeclaration(name) {
    return "Hello, " + name;
}

console.log("Declaration:", greetDeclaration("Alice"));

console.log("\n2. Function Expression:");

const greetExpression = function(name) {
    return "Hello, " + name;
};

console.log("Expression:", greetExpression("Bob"));

console.log("\n3. Arrow Function:");

const greetArrow = (name) => {
    return "Hello, " + name;
};

console.log("Arrow:", greetArrow("Charlie"));

const greetShort = (name) => "Hello, " + name;
console.log("Arrow Short:", greetShort("David"));

console.log("\n4. Параметры по умолчанию:");

function greetDefault(name = "Guest") {
    return "Hello, " + name;
}

console.log("С параметром:", greetDefault("Eve"));
console.log("Без параметра:", greetDefault());

console.log("\n5. Rest Parameters:");

function sumAll(...numbers) {
    return numbers.reduce((acc, num) => acc + num, 0);
}

console.log("sumAll(1, 2, 3):", sumAll(1, 2, 3));
console.log("sumAll(1, 2, 3, 4, 5):", sumAll(1, 2, 3, 4, 5));

console.log("\n6. IIFE:");

(function() {
    console.log("IIFE выполнена немедленно");
})();

((name) => {
    console.log("IIFE с параметром:", name);
})("Test");

console.log("\n7. Callback Functions:");

function processUser(name, callback) {
    console.log("Обработка пользователя:", name);
    callback(name);
}

processUser("Frank", function(userName) {
    console.log("Callback: Пользователь", userName, "обработан");
});

console.log("\n8. Higher-Order Functions:");

function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log("double(5):", double(5));
console.log("triple(5):", triple(5));

console.log("\n9. Функции с замыканием:");

function createPrivateCounter() {
    let privateCount = 0;
    
    return {
        increment: function() {
            privateCount++;
            return privateCount;
        },
        decrement: function() {
            privateCount--;
            return privateCount;
        },
        getCount: function() {
            return privateCount;
        }
    };
}

const privateCounter = createPrivateCounter();
console.log("increment:", privateCounter.increment());
console.log("increment:", privateCounter.increment());
console.log("decrement:", privateCounter.decrement());
console.log("getCount:", privateCounter.getCount());

console.log("\n10. Рекурсивные функции:");

function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

console.log("factorial(5):", factorial(5));

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("fibonacci(10):", fibonacci(10));

console.log("\n11. Генераторы:");

function* numberGenerator() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
}

const gen = numberGenerator();
console.log("gen.next():", gen.next().value);
console.log("gen.next():", gen.next().value);
console.log("gen.next():", gen.next().value);

function* idGenerator() {
    let id = 1;
    while (true) {
        yield id++;
    }
}

const idGen = idGenerator();
console.log("idGen.next():", idGen.next().value);
console.log("idGen.next():", idGen.next().value);
console.log("idGen.next():", idGen.next().value);

console.log("\n12. Методы функций (call, apply, bind):");

const person1 = { firstName: "John", lastName: "Doe" };
const person2 = { firstName: "Jane", lastName: "Smith" };

function greet(greeting, punctuation) {
    return greeting + ", " + this.firstName + " " + this.lastName + punctuation;
}

console.log("call:", greet.call(person1, "Hello", "!"));
console.log("apply:", greet.apply(person2, ["Hi", "."]));

const boundGreet = greet.bind(person1, "Good morning");
console.log("bind:", boundGreet("!"));

console.log("\n13. Сравнение типов функций:");

console.log("typeof function(){}:", typeof function(){});
console.log("typeof () => {}:", typeof (() => {}));
console.log("typeof Function:", typeof Function);

console.log("\n14. Асинхронные функции:");

async function asyncGreet(name) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return "Hello, " + name;
}

asyncGreet("AsyncUser").then(result => {
    console.log("asyncGreet result:", result);
});

console.groupEnd();

console.group("=== 5. Циклы и Итерации ===");

console.log("\n1. Классический цикл for:");

for (let i = 0; i < 5; i++) {
    console.log("for iteration:", i);
}

console.log("\n2. Цикл while:");

let whileCount = 0;
while (whileCount < 3) {
    console.log("while iteration:", whileCount);
    whileCount++;
}

console.log("\n3. Цикл do...while:");

let doCount = 0;
do {
    console.log("do...while iteration:", doCount);
    doCount++;
} while (doCount < 3);

let doOnce = 5;
do {
    console.log("do...while выполнится один раз");
} while (doOnce < 3);

console.log("\n4. Цикл for...in (объекты):");

const userForIn = {
    name: "Alice",
    age: 30,
    city: "Moscow"
};

for (let key in userForIn) {
    console.log("Ключ:", key, "Значение:", userForIn[key]);
}

const arrForIn = ["a", "b", "c"];
for (let index in arrForIn) {
    console.log("Индекс:", index, "Значение:", arrForIn[index]);
}

console.log("\n5. Цикл for...of (массивы, строки):");

const arrForOf = [10, 20, 30];
for (let value of arrForOf) {
    console.log("Значение:", value);
}

const strForOf = "Hello";
for (let char of strForOf) {
    console.log("Символ:", char);
}

const userForOf = { name: "Bob", age: 25 };
for (let [key, value] of Object.entries(userForOf)) {
    console.log("Ключ:", key, "Значение:", value);
}

console.log("\n6. Метод forEach:");

const numbers = [1, 2, 3, 4, 5];
numbers.forEach(function(num, index) {
    console.log("forEach - Индекс:", index, "Значение:", num);
});

numbers.forEach((num) => {
    console.log("forEach arrow:", num * 2);
});

console.log("\n7. break и continue:");

for (let i = 0; i < 10; i++) {
    if (i === 5) {
        console.log("break при i =", i);
        break;
    }
    console.log("break test:", i);
}

for (let i = 0; i < 5; i++) {
    if (i === 2) {
        console.log("continue при i =", i);
        continue;
    }
    console.log("continue test:", i);
}

console.log("\n8. Методы массивов (map, filter, reduce):");

const doubled = numbers.map(num => num * 2);
console.log("map (x2):", doubled);

const even = numbers.filter(num => num % 2 === 0);
console.log("filter (четные):", even);

const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log("reduce (сумма):", sum);

const result = numbers
    .filter(num => num > 2)
    .map(num => num * 10)
    .reduce((acc, num) => acc + num, 0);
console.log("Цепочка (filter > 2, map *10, reduce sum):", result);

console.log("\n9. Вложенные циклы:");

for (let i = 1; i <= 3; i++) {
    let row = "";
    for (let j = 1; j <= 3; j++) {
        row += `[${i},${j}] `;
    }
    console.log(row);
}

console.log("\n10. Метки для циклов:");

outerLoop: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (i === 1 && j === 1) {
            console.log("break outerLoop при i=1, j=1");
            break outerLoop;
        }
        console.log("Метки - i:", i, "j:", j);
    }
}

console.groupEnd();

console.group("=== 6. Работа с Promise и Async/Await ===");

console.log("\n1. Создание Promise:");
const promiseSuccess = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Успешно выполнено!");
    }, 1000);
});

const promiseError = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject("Произошла ошибка!");
    }, 1000);
});

console.log("\n2. Обработка состояний (then/catch/finally):");
promiseSuccess
    .then((result) => {
        console.log("Результат success:", result);
    })
    .catch((error) => {
        console.log("Ошибка success:", error);
    })
    .finally(() => {
        console.log("Завершено (finally)");
    });

promiseError
    .then((result) => {
        console.log("Результат error:", result);
    })
    .catch((error) => {
        console.log("Ошибка error:", error);
    })
    .finally(() => {
        console.log("Завершено (finally) для ошибки");
    });

console.log("\n3. Цепочка промисов (Chaining):");
const chainPromise = new Promise((resolve) => {
    setTimeout(() => resolve(1), 500);
});

chainPromise
    .then((value) => {
        console.log("Шаг 1:", value);
        return value * 2;
    })
    .then((value) => {
        console.log("Шаг 2:", value);
        return value * 2;
    })
    .then((value) => {
        console.log("Шаг 3:", value);
    });

console.log("\n4. Promise.all:");

const p1 = Promise.resolve(10);
const p2 = Promise.resolve(20);
const p3 = Promise.resolve(30);

Promise.all([p1, p2, p3])
    .then((values) => {
        console.log("Все завершены:", values);
    })
    .catch((err) => {
        console.log("Один из промисов упал:", err);
    });

console.log("\n5. Promise.race (Ждем первого):");
const fastPromise = new Promise((resolve) => setTimeout(() => resolve("Быстрый"), 500));
const slowPromise = new Promise((resolve) => setTimeout(() => resolve("Медленный"), 2000));

Promise.race([fastPromise, slowPromise])
    .then((value) => {
        console.log("Первый завершил:", value);
    });

console.log("\n6. Async/Await:");
async function fetchData() {
    console.log("Начало загрузки...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    const data = { id: 1, title: "Запись" };
    console.log("Данные получены:", data);
    return data;
}

fetchData();

console.log("\n7. Обработка ошибок в Async/Await:");
async function fetchWithError() {
    try {
        console.log("Попытка загрузки...");
        await new Promise((resolve, reject) => setTimeout(() => reject("Ошибка сети"), 1000));
    } catch (error) {
        console.log("Перехват ошибки:", error);
    } finally {
        console.log("Завершение функции с ошибкой");
    }
}

fetchWithError();

console.log("\n8. Promise.allSettled (Игнорируем ошибки):");
const mixedPromises = [
    Promise.resolve("Успех"),
    Promise.reject("Ошибка"),
    Promise.resolve("Успех 2")
];

Promise.allSettled(mixedPromises)
    .then((results) => {
        console.log("Результаты allSettled:", results);
    });

console.groupEnd();

console.group("=== 7. Switch Statement (Оператор выбора) ===");

console.log("\n1. Базовый switch:");

const day = 3;
let dayName;

switch (day) {
    case 1:
        dayName = "Понедельник";
        break;
    case 2:
        dayName = "Вторник";
        break;
    case 3:
        dayName = "Среда";
        break;
    case 4:
        dayName = "Четверг";
        break;
    case 5:
        dayName = "Пятница";
        break;
    case 6:
        dayName = "Суббота";
        break;
    case 7:
        dayName = "Воскресенье";
        break;
    default:
        dayName = "Неверный день";
}

console.log("День:", dayName);

console.log("\n2. Switch без break (fallthrough):");

const fruit = "apple";
let fruitPrice = 0;

switch (fruit) {
    case "apple":
    case "pear":
        fruitPrice = 100;
        console.log("Цена для", fruit, ":", fruitPrice);
        break;
    case "orange":
    case "banana":
        fruitPrice = 80;
        console.log("Цена для", fruit, ":", fruitPrice);
        break;
    default:
        fruitPrice = 50;
        console.log("Цена для", fruit, ":", fruitPrice);
}

console.log("\n3. Switch с выражениями:");

const score = 85;
let grade;

switch (true) {
    case (score >= 90):
        grade = "A";
        break;
    case (score >= 80):
        grade = "B";
        break;
    case (score >= 70):
        grade = "C";
        break;
    case (score >= 60):
        grade = "D";
        break;
    default:
        grade = "F";
}

console.log("Оценка:", score, "Балл:", grade);

console.log("\n4. Switch со строками:");

const command = "start";

switch (command) {
    case "start":
        console.log("Запуск системы...");
        break;
    case "stop":
        console.log("Остановка системы...");
        break;
    case "restart":
        console.log("Перезагрузка системы...");
        break;
    default:
        console.log("Неизвестная команда");
}

console.log("\n5. Switch с числами:");

const month = 6;
let season;

switch (month) {
    case 12:
    case 1:
    case 2:
        season = "Зима";
        break;
    case 3:
    case 4:
    case 5:
        season = "Весна";
        break;
    case 6:
    case 7:
    case 8:
        season = "Лето";
        break;
    case 9:
    case 10:
    case 11:
        season = "Осень";
        break;
    default:
        season = "Неизвестно";
}

console.log("Месяц:", month, "Сезон:", season);

console.log("\n6. Switch vs if-else:");

const status = "active";

switch (status) {
    case "active":
        console.log("Switch: Активен");
        break;
    case "inactive":
        console.log("Switch: Неактивен");
        break;
    case "pending":
        console.log("Switch: Ожидание");
        break;
    default:
        console.log("Switch: Неизвестный статус");
}

console.log("\n7. Switch с возвращением значения:");

function getLanguageCode(lang) {
    switch (lang) {
        case "Russian":
            return "ru";
        case "English":
            return "en";
        case "Spanish":
            return "es";
        case "French":
            return "fr";
        default:
            return "unknown";
    }
}

console.log("English:", getLanguageCode("English"));

console.log("\n8. Switch с объектами (альтернатива):");

const actions = {
    create: () => "Создание",
    read: () => "Чтение",
    update: () => "Обновление",
    delete: () => "Удаление"
};

const action = "update";
const switchResult = actions[action] ? actions[action]() : "Неизвестное действие";
console.log("Действие:", action, "Результат:", switchResult);

console.groupEnd();

console.group("=== 8. Работа с DOM (Document Object Model) ===");

const elementById = document.getElementById("myId");
const elementsByClass = document.getElementsByClassName("myClass");
const elementsByTag = document.getElementsByTagName("div");
const elementByQuery = document.querySelector(".myClass");
const elementsByQueryAll = document.querySelectorAll("div.item");

const newDiv = document.createElement("div");
const newText = document.createTextNode("Hello World");
newDiv.appendChild(newText);
document.body.appendChild(newDiv);

const contentElement = document.querySelector(".content");
contentElement.textContent = "Текстовое содержимое";
contentElement.innerHTML = "<strong>HTML содержимое</strong>";
contentElement.innerText = "Видимый текст";

const linkElement = document.querySelector("a");
linkElement.setAttribute("href", "https://example.com");
linkElement.setAttribute("target", "_blank");
const hrefValue = linkElement.getAttribute("href");
linkElement.removeAttribute("target");
const hasHref = linkElement.hasAttribute("href");

const classElement = document.querySelector(".element");
classElement.classList.add("active");
classElement.classList.remove("inactive");
classElement.classList.toggle("hidden");
const hasActive = classElement.classList.contains("active");

const styleElement = document.querySelector(".styled");
styleElement.style.color = "red";
styleElement.style.backgroundColor = "blue";
styleElement.style.fontSize = "16px";
styleElement.style.display = "none";
styleElement.style.cssText = "color: red; font-size: 16px; padding: 10px;";

const navElement = document.querySelector(".nav");
const parent = navElement.parentNode;
const children = navElement.children;
const firstChild = navElement.firstChild;
const lastChild = navElement.lastChild;
const nextSibling = navElement.nextSibling;
const previousSibling = navElement.previousSibling;

const removeElement = document.querySelector(".toRemove");
removeElement.remove();

const parentElement = document.querySelector(".parent");
const childElement = document.querySelector(".child");
parentElement.removeChild(childElement);

const buttonElement = document.querySelector("#myButton");
buttonElement.addEventListener("click", function(event) {
    // Обработка клика
});

function handleClick(event) {
    // Обработка
}
buttonElement.addEventListener("click", handleClick);
buttonElement.removeEventListener("click", handleClick);
buttonElement.onclick = function() {
    // Обработка
};

const eventButton = document.querySelector("#eventButton");
eventButton.addEventListener("click", function(event) {
    const target = event.target;
    event.preventDefault();
    event.stopPropagation();
});

const listElement = document.querySelector("#list");
listElement.addEventListener("click", function(event) {
    if (event.target.tagName === "LI") {
        const listItemText = event.target.textContent;
    }
});

const formElement = document.querySelector("#myForm");
formElement.addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = new FormData(formElement);
    const username = formData.get("username");
    const email = formData.get("email");
    const inputElement = document.querySelector("#inputField");
    const inputValue = inputElement.value;
    const checkboxElement = document.querySelector("#checkbox");
    const isChecked = checkboxElement.checked;
});

const measureElement = document.querySelector(".measure");
const offsetWidth = measureElement.offsetWidth;
const offsetHeight = measureElement.offsetHeight;
const clientWidth = measureElement.clientWidth;
const clientHeight = measureElement.clientHeight;
const rect = measureElement.getBoundingClientRect();
const top = rect.top;
const left = rect.left;
const width = rect.width;
const height = rect.height;

const animateElement = document.querySelector(".animate");
let position = 0;

function animate() {
    position += 1;
    animateElement.style.transform = "translateX(" + position + "px)";
    if (position < 100) {
        requestAnimationFrame(animate);
    }
}

requestAnimationFrame(animate);

localStorage.setItem("key", "value");
localStorage.setItem("user", JSON.stringify({ name: "John", age: 25 }));
const storedValue = localStorage.getItem("key");
const storedUser = JSON.parse(localStorage.getItem("user"));
localStorage.removeItem("key");
localStorage.clear();

const toggleElement = document.querySelector(".toggle");
toggleElement.classList.add("class1", "class2", "class3");
toggleElement.classList.remove("class1", "class2");
toggleElement.classList.toggle("active", true);
toggleElement.classList.toggle("active", false);

console.groupEnd();
