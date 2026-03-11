# TypeScript: Типизация компонентов, Generics, Utility Types

Практическое руководство по типизации в TypeScript для React-разработки.

## Базовые типы

### Для чего нужны

Базовые типы позволяют описывать структуру данных и ловить ошибки на этапе компиляции.

```typescript
// src/types/basic.ts

// Примитивные типы
let name: string = "Алекс";
let age: number = 25;
let isActive: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;

// Массивы
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Алекс", "Мария"];

// Кортежи — массив с фиксированной длиной и типами
let tuple: [string, number] = ["Алекс", 25];

// Enum — перечисление именованных значений
enum Status {
  Pending = "pending",
  Active = "active",
  Inactive = "inactive"
}

let userStatus: Status = Status.Active;

// Any — отключает проверку типов (избегать)
let anything: any = "можно присвоить что угодно";

// Unknown — безопасная версия any, требует проверки типа
let unknownValue: unknown = "нужна проверка перед использованием";
if (typeof unknownValue === "string") {
  console.log(unknownValue.toUpperCase());
}

// Void — отсутствие возвращаемого значения
function logMessage(message: string): void {
  console.log(message);
}

// Never — функция никогда не возвращает (throw или бесконечный цикл)
function throwError(message: string): never {
  throw new Error(message);
}

// Object — любой объект кроме примитивов
let obj: object = { key: "value" };
```

```bash
git add src/types/basic.ts
git commit -m "feat: add basic TypeScript types examples"
```

---

## Интерфейсы и типы

### Для чего нужны

Интерфейсы и типы описывают структуру объектов. Интерфейсы лучше для расширяемости, типы — для union и сложных конструкций.

```typescript
// src/types/interfaces.ts

// Интерфейс — описывает форму объекта
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // Необязательное свойство
  readonly createdAt: Date; // Только для чтения
}

// Расширение интерфейса
interface Employee extends User {
  department: string;
  salary: number;
}

// Реализация интерфейса классом
class Admin implements Employee {
  id: number;
  name: string;
  email: string;
  readonly createdAt: Date;
  department: string;
  salary: number;

  constructor(data: Employee) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.createdAt = new Date();
    this.department = data.department;
    this.salary = data.salary;
  }
}

// Type alias — альтернатива интерфейсу
type Product = {
  id: string;
  name: string;
  price: number;
};

// Union types — значение может быть одного из типов
type Status = "active" | "inactive" | "pending";

// Intersection types — объединение нескольких типов
type DetailedUser = User & {
  avatar?: string;
  bio?: string;
};

// Type guard — проверка типа в рантайме
function isEmployee(user: User | Employee): user is Employee {
  return "department" in user;
}

// Использование:
/*
const user: User = { id: 1, name: "Алекс", email: "alex@example.com", createdAt: new Date() };
const employee: Employee = { ...user, department: "IT", salary: 100000 };

if (isEmployee(user)) {
  console.log(user.department); // TypeScript знает, что это Employee
}
*/
```

```bash
git add src/types/interfaces.ts
git commit -m "feat: add interfaces and type aliases with examples"
```

---

## Generics

### Для чего нужны

Generics позволяют создавать переиспользуемые компоненты и функции, которые работают с разными типами, сохраняя типобезопасность.

```typescript
// src/types/generics.ts

// Generic-функция
function identity<T>(arg: T): T {
  return arg;
}

const result1 = identity<string>("Hello");
const result2 = identity<number>(42);

// Generic с ограничениями
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Алекс", email: "alex@example.com" };
const name = getProperty(user, "name"); // Тип: string

// Generic-интерфейс
interface ApiResponse<T> {
   T | null;
  error: Error | null;
  isLoading: boolean;
}

const userResponse: ApiResponse<User> = {
   null,
  error: null,
  isLoading: false
};

// Generic-класс
class Container<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }
}

const stringContainer = new Container<string>("Hello");
const numberContainer = new Container<number>(42);

// Generic с несколькими параметрами
interface Pair<T, U> {
  first: T;
  second: U;
}

const pair: Pair<string, number> = { first: "age", second: 25 };

// Generic defaults
interface Cache<T = string> {
  get(key: string): T;
  set(key: string, value: T): void;
}

const stringCache: Cache = {
  get: (key) => "",
  set: (key, value) => {}
};
```

```bash
git add src/types/generics.ts
git commit -m "feat: add generics with constraints and multiple parameters"
```

---

## Utility Types

### Для чего нужны

Utility Types — встроенные типы-утилиты для трансформации других типов без дублирования кода.

```typescript
// src/types/utilityTypes.ts

// Partial<T> — делает все свойства необязательными
// Для чего: обновление объекта, когда передаются не все поля
interface User {
  id: number;
  name: string;
  email: string;
}

type UserUpdate = Partial<User>;
// { id?: number; name?: string; email?: string; }

// Required<T> — делает все свойства обязательными
// Для чего: конфигурация, где все опции должны быть заданы
interface Config {
  apiUrl?: string;
  timeout?: number;
}

type RequiredConfig = Required<Config>;
// { apiUrl: string; timeout: number; }

// Readonly<T> — делает все свойства только для чтения
// Для чего: защита объектов от изменений
type ReadonlyUser = Readonly<User>;
// { readonly id: number; readonly name: string; readonly email: string; }

// Pick<T, K> — выбирает указанные свойства
// Для чего: создание превью-типа с ограниченным набором полей
type UserPreview = Pick<User, "id" | "name">;
// { id: number; name: string; }

// Omit<T, K> — исключает указанные свойства
// Для чего: создание типа без чувствительных полей
type UserWithoutId = Omit<User, "id">;
// { name: string; email: string; }

// Record<K, T> — объект с ключами типа K и значениями типа T
// Для чего: словари, мапы, конфигурации с известными ключами
type UserRoles = Record<"admin" | "editor" | "viewer", boolean>;
// { admin: boolean; editor: boolean; viewer: boolean; }

// Exclude<T, U> — исключает из T типы, которые присваиваются U
// Для чего: фильтрация типов, создание подмножеств
type Status = "active" | "inactive" | "pending";
type ActiveStatus = Exclude<Status, "inactive">;
// "active" | "pending"

// Extract<T, U> — оставляет только типы, которые присваиваются U
// Для чего: извлечение конкретных вариантов из union-типа
type NumericStatus = Extract<Status, "active">;
// "active"

// NonNullable<T> — исключает null и undefined
// Для чего: гарантия, что значение определено после проверки
type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>;
// string

// ReturnType<T> — тип возвращаемого значения функции
// Для чего: типизация результатов функций
type CreateUserFn = (name: string) => User;
type CreateUserResult = ReturnType<CreateUserFn>;
// User

// Parameters<T> — тип параметров функции
// Для чего: создание обёрток, проксирование вызовов
type CreateUserParams = Parameters<CreateUserFn>;
// [name: string]

// InstanceType<T> — тип экземпляра класса
// Для чего: типизация экземпляров классов
class ApiClient {
  fetch(url: string) { return Promise.resolve({}); }
}
type ApiClientInstance = InstanceType<typeof ApiClient>;

// ThisType<T> — тип для this в методах объекта
// Для чего: типизация контекста в методах
interface Calculator {
  value: number;
  add(n: number): this;
  subtract(n: number): this;
}
```

```bash
git add src/types/utilityTypes.ts
git commit -m "feat: add utility types with use case descriptions"
```

---

## Кастомные утилитарные типы

### Для чего нужны

Кастомные типы решают специфические задачи проекта и расширяют возможности встроенных utility types.

```typescript
// src/types/customTypes.ts

// Nullable<T> — добавляет null к типу
// Для чего: явное указание, что значение может отсутствовать
export type Nullable<T> = T | null;

// Optional<T, K> — делает указанные свойства необязательными
// Для чего: частичное обновление объекта
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// DeepPartial<T> — рекурсивно делает все свойства необязательными
// Для чего: тестовые данные, моки, частичная конфигурация
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object 
    ? DeepPartial<T[P]> 
    : T[P];
};

// DeepReadonly<T> — рекурсивно делает все свойства только для чтения
// Для чего: защита вложенных объектов от изменений
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P];
};

// ValueOf<T> — тип значения объекта
// Для чего: извлечение возможных значений из объекта-константы
export type ValueOf<T> = T[keyof T];

// AsyncReturnType<T> — тип разрешения для асинхронной функции
// Для чего: типизация данных из async-функций
export type AsyncReturnType<T extends (...args: any[]) => Promise<any>> = 
  T extends (...args: any[]) => Promise<infer R> ? R : never;

// Constructor<T> — тип конструктора класса
// Для чего: фабрики, dependency injection
export type Constructor<T = {}> = new (...args: any[]) => T;

// Mutable<T> — снимает readonly со всех свойств
// Для чего: создание изменяемой версии readonly-объекта
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// KeysOfType<T, V> — ключи объекта с указанным типом значения
// Для чего: фильтрация ключей по типу значения
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

// Пример использования:
/*
type MaybeUser = Nullable<User>;
// User | null

type UserWithOptionalEmail = Optional<User, "email">;
// { id: number; name: string; email?: string; }

type UserRole = ValueOf<{ admin: "admin"; editor: "editor" }>;
// "admin" | "editor"

const fetchUser = async (id: number) => ({ id, name: "John" });
type FetchedUser = AsyncReturnType<typeof fetchUser>;
// { id: number; name: string; }
*/
```

```bash
git add src/types/customTypes.ts
git commit -m "feat: add custom utility types for common patterns"
```

---

## Типизация функций

### Для чего нужна

Типизация функций обеспечивает корректность передачи аргументов и возвращаемых значений.

```typescript
// src/types/functionTypes.ts

// Базовая типизация функции
function add(a: number, b: number): number {
  return a + b;
}

// Стрелочная функция
const multiply = (a: number, b: number): number => a * b;

// Тип функции через type alias
type MathOperation = (a: number, b: number) => number;

const divide: MathOperation = (a, b) => a / b;

// Функция с несколькими сигнатурами (overloads)
// Для чего: разные типы аргументов для одной функции
function format(value: string): string;
function format(value: number): string;
function format(value: string | number): string {
  return String(value);
}

// Опциональные параметры
function greet(name: string, greeting?: string): string {
  return `${greeting || "Hello"}, ${name}`;
}

// Параметры по умолчанию
function welcome(name: string, greeting: string = "Welcome"): string {
  return `${greeting}, ${name}`;
}

// Rest параметры
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

// Функция с generic
function filter<T>(array: T[], predicate: (item: T) => boolean): T[] {
  return array.filter(predicate);
}

// Асинхронная функция
async function fetchData(url: string): Promise<unknown> {
  const response = await fetch(url);
  return response.json();
}

// Callback функции
interface CallbackOptions {
  onSuccess: (data: unknown) => void;
  onError: (error: Error) => void;
  onComplete?: () => void;
}

function fetchDataWithCallback(options: CallbackOptions): void {
  // реализация
}

// Типизация this в методах
interface Calculator {
  value: number;
  add(this: Calculator, n: number): Calculator;
}
```

```bash
git add src/types/functionTypes.ts
git commit -m "feat: add function typing with overloads and generics"
```

---

## Типизация событий

### Для чего нужна

Типизация событий обеспечивает корректную работу с DOM-событиями и обработчиками.

```typescript
// src/types/eventTypes.ts

import { 
  ChangeEvent, 
  FocusEvent, 
  KeyboardEvent, 
  MouseEvent,
  FormEvent,
  DragEvent 
} from "react";

// Типизированные обработчики событий
// Для чего: переиспользование в разных компонентах

export type ChangeHandler<T = HTMLInputElement> = (
  event: ChangeEvent<T>
) => void;

export type FocusHandler<T = HTMLInputElement> = (
  event: FocusEvent<T>
) => void;

export type KeyHandler<T = HTMLInputElement> = (
  event: KeyboardEvent<T>
) => void;

export type ClickHandler<T = HTMLButtonElement> = (
  event: MouseEvent<T>
) => void;

export type SubmitHandler = (
  event: FormEvent<HTMLFormElement>
) => void;

export type DragHandler<T = HTMLElement> = (
  event: DragEvent<T>
) => void;

// Обработчик с дополнительными параметрами
export type Handler<T = unknown, E = unknown> = (
  value: T,
  event?: E
) => void | Promise<void>;

// Асинхронный обработчик
export type AsyncHandler<T = unknown, E = unknown> = (
  value: T,
  event?: E
) => Promise<void>;

// Пример использования в компоненте
interface InputProps {
  value: string;
  onChange: ChangeHandler<HTMLInputElement>;
  onFocus?: FocusHandler<HTMLInputElement>;
  onBlur?: FocusHandler<HTMLInputElement>;
  onKeyDown?: KeyHandler<HTMLInputElement>;
}

function TypedInput({ value, onChange, onFocus, onBlur, onKeyDown }: InputProps) {
  return (
    <input 
      value={value} 
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    />
  );
}

// Нативные DOM события (без React)
interface NativeEventHandlers {
  onClick: (event: MouseEvent) => void;
  onChange: (event: Event) => void;
  onSubmit: (event: SubmitEvent) => void;
  onScroll: (event: UIEvent) => void;
}
```

```bash
git add src/types/eventTypes.ts
git commit -m "feat: add typed event handlers for React and native DOM"
```

---

## Модули и экспорт типов

### Для чего нужны

Правильная организация типов упрощает их переиспользование и поддержку.

```typescript
// src/types/index.ts

// Централизованный экспорт всех типов
export * from "./basic";
export * from "./interfaces";
export * from "./generics";
export * from "./utilityTypes";
export * from "./customTypes";
export * from "./functionTypes";
export * from "./eventTypes";

// Ре-экспорт с алиасами
export { User, Employee } from "./interfaces";
export { ApiResponse } from "./generics";
export { Nullable, DeepPartial } from "./customTypes";
```

```typescript
// src/types/user.ts

// Выделение типов по доменам
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
}

export type UserResponse = ApiResponse<User>;
```

```bash
git add src/types/index.ts src/types/user.ts
git commit -m "feat: add centralized type exports and domain-specific types"
```

---

## Конфигурация TypeScript

### Для чего нужна

Правильная настройка tsconfig.json обеспечивает строгую типизацию и оптимальную компиляцию.

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

```bash
git add tsconfig.json
git commit -m "feat: add strict TypeScript configuration with path aliases"
```

---

## Коммиты для Git

```bash
git add src/types/basic.ts
git commit -m "feat: add basic TypeScript types examples"

git add src/types/interfaces.ts
git commit -m "feat: add interfaces and type aliases with examples"

git add src/types/generics.ts
git commit -m "feat: add generics with constraints and multiple parameters"

git add src/types/utilityTypes.ts
git commit -m "feat: add utility types with use case descriptions"

git add src/types/customTypes.ts
git commit -m "feat: add custom utility types for common patterns"

git add src/types/functionTypes.ts
git commit -m "feat: add function typing with overloads and generics"

git add src/types/eventTypes.ts
git commit -m "feat: add typed event handlers for React and native DOM"

git add src/types/index.ts src/types/user.ts
git commit -m "feat: add centralized type exports and domain-specific types"

git add tsconfig.json
git commit -m "feat: add strict TypeScript configuration with path aliases"

git add .
git commit -m "feat: add comprehensive TypeScript typing guide"
```

---

## Полезные ссылки

- TypeScript Handbook: https://www.typescriptlang.org/docs/
- TypeScript Playground: https://www.typescriptlang.org/play
- Utility Types Documentation: https://www.typescriptlang.org/docs/handbook/utility-types.html
- TypeScript ESLint: https://typescript-eslint.io/
- React + TypeScript Cheatsheet: https://react-typescript-cheatsheet.netlify.app/

---

Совет: Включите строгий режим (strict: true) в tsconfig.json для максимальной типобезопасности. Явно типизируйте возвращаемые значения функций и используйте utility types для избежания дублирования.
