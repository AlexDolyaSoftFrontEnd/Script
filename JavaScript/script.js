console.group("Сравнение типов данных");

// 1. Строгое (===) vs Нестрогое (==) равенство
console.log("\n1. Строгое и нестрогое равенство:");
console.log("5 == '5'   :", 5 == '5');    // true (строка '5' превращается в число 5)
console.log("5 === '5'  :", 5 === '5');   // false (разные типы: number и string)

// 2. Сравнение разных типов (Number и String)
console.log("\n2. Числа и Строки:");
console.log("10 == '10' :", 10 == '10');  // true
console.log("10 === '10':", 10 === '10'); // false
console.log("'10' == 10 + '':", '10' == 10 + ''); // true (число превращается в строку)

// 3. Булевы значения (Boolean)
console.log("\n3. Логические значения:");
console.log("true == 1  :", true == 1);   // true (true превращается в 1)
console.log("true === 1 :", true === 1);  // false (boolean и number)
console.log("false == 0 :", false == 0);  // true (false превращается в 0)
console.log("'' == false:", '' == false); // true (пустая строка считается ложью и равна 0)

// 4. Null и Undefined
console.log("\n4. Null и Undefined:");
console.log("null == undefined :", null == undefined);   // true 
console.log("null === undefined:", null === undefined);  // false
console.log("null == 0         :", null == 0);           // false
console.log("undefined == 0    :", undefined == 0);      // false

// 5. Объекты и Массивы (Сравнение по ссылке)
console.log("\n5. Объекты и Массивы:");
const obj1 = { a: 1 };
const obj2 = { a: 1 };
const obj3 = obj1; 

const arr1 = [1, 2];
const arr2 = [1, 2];

console.log("Объекты равны по содержанию? {a:1} == {a:1}:", obj1 == obj2); // false
console.log("Объекты равны по ссылке? obj1 == obj3     :", obj1 == obj3);  // true

console.log("Массивы равны по содержанию? [1,2] == [1,2]:", arr1 == arr2); // false
console.log("Массив == Строка? [1,2] == '1,2'          :", arr1 == '1,2'); // true (массив превращается в строку)

// 6. Проверка типа через typeof
console.log("\n6. Проверка типа (typeof):");
console.log("typeof 123      :", typeof 123);       // "number"
console.log("typeof 'hello'  :", typeof 'hello');   // "string"
console.log("typeof true     :", typeof true);      // "boolean"
console.log("typeof {}       :", typeof {});        // "object"
console.log("typeof null     :", typeof null);      // "object" (исторический баг JS!)
console.log("typeof undefined:", typeof undefined); // "undefined"

console.groupEnd();

/* ==========================================
   2. ES5 (EcmaScript 5)
   ========================================== */

// 1. Объявление переменных через var
var userName = "Alex";
var userAge = 25;

// 2. Создание объекта 
var userES5 = {
    name: userName,
    age: userAge,
    // Метод через function
    getInfo: function() {
        return this.name + " is " + this.age;
    }
};

// 3. Динамическое добавление свойства (через скобки)
var dynamicKey = "status";
var objES5 = {};
objES5[dynamicKey] = "active";

// 4. Конструктор объектов (функция-конструктор)
function PersonES5(name) {
    this.name = name;
    this.sayHello = function() {
        return "Hello, " + this.name;
    };
}
var personInstanceES5 = new PersonES5("John");

// 5. Копирование свойств 
var targetES5 = {};
var sourceES5 = { a: 1 };
for (var key in sourceES5) {
    if (sourceES5.hasOwnProperty(key)) {
        targetES5[key] = sourceES5[key];
    }
}


/* ==========================================
   3. ES6 (EcmaScript 2015+)
   ========================================== */

// 1. Объявление переменных через const/let
const userName6 = "Alex";
const userAge6 = 33;

// 2. Создание объекта 
const userES6 = {
    name: userName6,
    age: userAge6,   
    getInfo() {
        return `${this.name} is ${this.age}`; // Шаблонные строки
    }
};

// 3. Вычисляемые имена свойств (Computed Property Names)
const dynamicKey6 = "status";
const objES6 = {
    [dynamicKey6]: "active" // Ключ вычисляется динамически внутри литерала
};

// 4. Классы (синтаксический сахар над прототипами)
class PersonES6 {
    constructor(name) {
        this.name = name;
    }
    sayHello() {
        return `Hello, ${this.name}`;
    }
}
const personInstanceES6 = new PersonES6("John");

// 5. Копирование объектов (Object.assign или Spread)
const sourceES6 = { a: 1 };

// Вариант А: Object.assign
const targetAssign = Object.assign({}, sourceES6);

// Вариант Б: Spread operator (часто используется вместо Object.assign)
const targetSpread = { ...sourceES6 };

// 6. Деструктуризация объекта
const { name, age } = userES6; // Создаст переменные name и age со значениями из объекта

/* ==========================================
   4. Улучшенные литералы объектов (ES6)
   ========================================== */

   // Исправлено имя переменной для избежания конфликта с деструктуризацией выше
   const productName = "Product";
   const price = 100;
   
   // Шорткаты (сокращения) свойств
   const item = {
       productName,       // Вместо name: name
       price,      // Вместо price: price
       category: "Electronics"
   };
   
   // Вычисляемые имена свойств
   // Исправлено имя переменной для избежания конфликта
   const statusKey = "status";
   const config = {
       [statusKey]: "active",  // Ключ берется из переменной
       [`type_${statusKey}`]: "premium" // Динамическое имя
   };
   
   /* ==========================================
      5. Методы объектов (Функции внутри объектов)
      ========================================== */
   
   const calculator = {
       // Краткая запись метода (без function и двоеточия)
       add(a, b) {
           return a + b;
       },
   
       // Обычная функция (важно для контекста this)
       multiply: function(a, b) {
           return a * b;
       },
   
       // Стрелочная функция (НЕ рекомендуется для методов, если нужен this)
       // divide: (a, b) => a / b 
   };
   
   /* ==========================================
      6. Контекст this в объектах
      ========================================== */
   
   const userContext = {
       firstName: "John",
       
       // Обычный метод: this ссылается на объект
       getFullName() {
           return this.firstName;
       },
   
       // Стрелочная функция: this берется из внешнего контекста (глобального)
       // Поэтому внутри объектов их используют осторожно
       getFullNameArrow: () => {
           // return this.firstName; // Ошибка: this здесь не user
           return "No access to this";
       }
   };
   
   /* ==========================================
      7. Классы (Синтаксический сахар над объектами)
      ========================================== */
   
   class Animal {
       // Конструктор (вызывается при создании обьекта)
       constructor(name) {
           this.name = name;
           this.alive = true;
       }
   
       // Метод экземпляра
       speak() {
           return `${this.name} makes a noise`;
       }
   
       // Геттер (вызывается как свойство)
       get info() {
           return `${this.name} is ${this.alive ? "alive" : "dead"}`;
       }
   
       // Сеттер (присваивание свойству)
       set status(value) {
           this.alive = value;
       }
   
       // Статический метод (вызывается на классе, не на экземпляре)
       static compare(a, b) {
           return a.name === b.name;
       }
   }
   
   
   /* ==========================================
      8. Работа с объектами (Утилиты ES6)
      ========================================== */
   
   const sourceUtils = { a: 1, b: 2 };
   const extra = { c: 3 };
   
   // Spread operator (копирование и объединение)
   const merged = { ...sourceUtils, ...extra }; 
   const copied = { ...sourceUtils };
   
   // Object.assign (альтернатива spread)
   const assigned = Object.assign({}, sourceUtils, extra);
   
   // Деструктуризация с переименованием
   const { a: alpha, b: beta } = sourceUtils;
   
   // Rest operator в параметрах функции
   function printData({ name, ...restProps }) {
       // name = "Product"
       // restProps = { price: 100, category: "Electronics" }
       return restProps;
   }
   
   /* ==========================================
      9. Фабричные функции (Альтернатива классам)
      ========================================== */
   
   function createCircle(radius) {
       return {
           radius,
           // Метод через замыкание (имеет доступ к аргументам функции)
           getArea() {
               return Math.PI * radius ** 2;
           }
       };
   }
   
   const circle1 = createCircle(5);
   const circle2 = createCircle(10);
