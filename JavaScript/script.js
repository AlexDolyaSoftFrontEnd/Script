console.group("=== 1. Локальные и Глобальные переменные ===");

// ==========================================
// 1. Глобальные переменные
// ==========================================
console.log("\n1. Глобальные переменные:");

// Объявление в глобальной области (доступны отовсюду)
var globalVar = "Я глобальная (var)";
let globalLet = "Я глобальная (let)";
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

// 1. Строгое (===) vs Нестрогое (==) равенство
console.log("\n1. Строгое и нестрогое равенство:");
console.log("5 == '5'   :", 5 == '5');
console.log("5 === '5'  :", 5 === '5');

// 2. Сравнение разных типов (Number и String)
console.log("\n2. Числа и Строки:");
console.log("10 == '10' :", 10 == '10');
console.log("10 === '10':", 10 === '10');
console.log("'10' == 10 + '':", '10' == 10 + '');

// 3. Булевы значения (Boolean)
console.log("\n3. Логические значения:");
console.log("true == 1  :", true == 1);
console.log("true === 1 :", true === 1);
console.log("false == 0 :", false == 0);
console.log("'' == false:", '' == false);

// 4. Null и Undefined
console.log("\n4. Null и Undefined:");
console.log("null == undefined :", null == undefined);
console.log("null === undefined:", null === undefined);
console.log("null == 0         :", null == 0);
console.log("undefined == 0    :", undefined == 0);

// 5. Объекты и Массивы (Сравнение по ссылке)
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

// 6. Проверка типа через typeof
console.log("\n6. Проверка типа (typeof):");
console.log("typeof 123      :", typeof 123);
console.log("typeof 'hello'  :", typeof 'hello');
console.log("typeof true     :", typeof true);
console.log("typeof {}       :", typeof {});
console.log("typeof null     :", typeof null);
console.log("typeof undefined:", typeof undefined);

console.groupEnd();

console.group("=== 3. Объекты ES5 и ES6 ===");

/* ==========================================
   1. ES5 (EcmaScript 5)
   ========================================== */

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

/* ==========================================
   2. ES6 (EcmaScript 2015+)
   ========================================== */

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

/* ==========================================
   3. Улучшенные литералы объектов (ES6)
   ========================================== */

const productName = "Product";
const price = 100;

const item = {
    productName,
    price,
    category: "Electronics"
};

const statusKey = "status";
const config = {
    [statusKey]: "active",
    [`type_${statusKey}`]: "premium"
};

/* ==========================================
   4. Методы объектов (Функции внутри объектов)
   ========================================== */

const calculator = {
    add(a, b) {
        return a + b;
    },
    multiply: function(a, b) {
        return a * b;
    },
};

/* ==========================================
   5. Контекст this в объектах
   ========================================== */

const userContext = {
    firstName: "John",
    getFullName() {
        return this.firstName;
    },
    getFullNameArrow: () => {
        return "No access to this";
    }
};

/* ==========================================
   6. Классы (Синтаксический сахар над объектами)
   ========================================== */

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

/* ==========================================
   7. Работа с объектами (Утилиты ES6)
   ========================================== */

const sourceUtils = { a: 1, b: 2 };
const extra = { c: 3 };

const merged = { ...sourceUtils, ...extra };
const copied = { ...sourceUtils };
const assigned = Object.assign({}, sourceUtils, extra);

const { a: alpha, b: beta } = sourceUtils;

function printData({ name: propName, ...restProps }) {
    return restProps;
}

/* ==========================================
   8. Фабричные функции (Альтернатива классам)
   ========================================== */

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

console.group("=== 4. Циклы и Итерации ===");

// ==========================================
// 1. Классический цикл for
// ==========================================
console.log("\n1. Классический цикл for:");

for (let i = 0; i < 5; i++) {
    console.log("for iteration:", i);
}

// ==========================================
// 2. Цикл while
// ==========================================
console.log("\n2. Цикл while:");

let whileCount = 0;
while (whileCount < 3) {
    console.log("while iteration:", whileCount);
    whileCount++;
}

// ==========================================
// 3. Цикл do...while
// ==========================================
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

// ==========================================
// 4. Цикл for...in (для объектов)
// ==========================================
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

// ==========================================
// 5. Цикл for...of (для итерируемых объектов)
// ==========================================
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

// ==========================================
// 6. Метод forEach для массивов
// ==========================================
console.log("\n6. Метод forEach:");

const numbers = [1, 2, 3, 4, 5];
numbers.forEach(function(num, index) {
    console.log("forEach - Индекс:", index, "Значение:", num);
});

numbers.forEach((num) => {
    console.log("forEach arrow:", num * 2);
});

// ==========================================
// 7. break и continue
// ==========================================
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

// ==========================================
// 8. Методы массивов (map, filter, reduce)
// ==========================================
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

// ==========================================
// 9. Вложенные циклы
// ==========================================
console.log("\n9. Вложенные циклы:");

for (let i = 1; i <= 3; i++) {
    let row = "";
    for (let j = 1; j <= 3; j++) {
        row += `[${i},${j}] `;
    }
    console.log(row);
}

// ==========================================
// 10. Метки для циклов (Labels)
// ==========================================
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

console.group("=== 5. Работа с Promise и Async/Await ===");

// 1. Создание простого промиса
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

// 2. Использование .then(), .catch(), .finally()
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

// 3. Цепочка промисов (Chaining)
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

// 4. Параллельное выполнение (Promise.all)
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

// 5. Первый завершившийся (Promise.race)
console.log("\n5. Promise.race (Ждем первого):");
const fastPromise = new Promise((resolve) => setTimeout(() => resolve("Быстрый"), 500));
const slowPromise = new Promise((resolve) => setTimeout(() => resolve("Медленный"), 2000));

Promise.race([fastPromise, slowPromise])
    .then((value) => {
        console.log("Первый завершил:", value);
    });

// 6. Async/Await
console.log("\n6. Async/Await:");
async function fetchData() {
    console.log("Начало загрузки...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    const data = { id: 1, title: "Запись" };
    console.log("Данные получены:", data);
    return data;
}

fetchData();

// 7. Обработка ошибок в Async/Await (try/catch)
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

// 8. Promise.allSettled (Ждем все, независимо от успеха)
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
