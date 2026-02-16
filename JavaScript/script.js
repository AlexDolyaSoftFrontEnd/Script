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