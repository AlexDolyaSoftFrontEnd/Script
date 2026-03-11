# TypeScript в React: Типизация компонентов, Generics, Utility Types

Практическое руководство по типизации React-компонентов и хуков с использованием TypeScript.

## Типизация компонентов

### Для чего нужно

Типизация пропсов компонентов позволяет:
- Ловить ошибки передачи неверных данных на этапе компиляции, а не в рантайме
- Получать автодополнение полей в редакторе кода
- Документировать API компонента через типы
- Упрощать рефакторинг — при изменении интерфейса все места использования подсветятся ошибками

### Функциональные компоненты с пропсами

```tsx
// src/components/Button/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "medium",
  isLoading,
  children,
  ...props
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`btn btn--${variant} btn--${size}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? "Загрузка..." : children}
    </button>
  );
}
```

### Компоненты с детьми (children)

```tsx
// src/components/Card/Card.tsx
import { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: ReactNode;
  footer?: ReactNode;
  hoverable?: boolean;
}

export function Card({ 
  children, 
  title, 
  footer, 
  hoverable = false, 
  ...props 
}: CardProps) {
  return (
    <div className={`card ${hoverable ? "card--hoverable" : ""}`} {...props}>
      {title && <div className="card__header">{title}</div>}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
}
```

### Компоненты с условными пропсами (Discriminated Unions)

```tsx
// src/components/Alert/Alert.tsx
import { ReactNode } from "react";

type AlertVariant = "info" | "success" | "warning" | "error";

interface BaseAlertProps {
  children: ReactNode;
  closable?: boolean;
  onClose?: () => void;
}

type InfoAlertProps = BaseAlertProps & {
  variant: "info";
  icon?: ReactNode;
};

type SuccessAlertProps = BaseAlertProps & {
  variant: "success";
  showCheckmark?: boolean;
};

type WarningAlertProps = BaseAlertProps & {
  variant: "warning";
  dismissTimeout?: number;
};

type ErrorAlertProps = BaseAlertProps & {
  variant: "error";
  errorCode?: string;
  onRetry?: () => void;
};

export type AlertProps = 
  | InfoAlertProps 
  | SuccessAlertProps 
  | WarningAlertProps 
  | ErrorAlertProps;

export function Alert(props: AlertProps) {
  const { children, variant, closable, onClose } = props;

  return (
    <div className={`alert alert--${variant}`} role="alert">
      {variant === "success" && props.showCheckmark && <span>✓</span>}
      {variant === "error" && props.errorCode && (
        <span className="error-code">{props.errorCode}</span>
      )}
      <span className="alert__content">{children}</span>
      {closable && (
        <button className="alert__close" onClick={onClose}>✕</button>
      )}
    </div>
  );
}
```

### Типизация компонентов с forwardRef

```tsx
// src/components/Input/Input.tsx
import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="input-wrapper">
        {label && <label className="input__label">{label}</label>}
        <input 
          ref={ref} 
          className={`input ${error ? "input--error" : ""} ${className || ""}`} 
          {...props} 
        />
        {error && <span className="input__error">{error}</span>}
        {hint && <span className="input__hint">{hint}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
```

---

## Generics в React

### Для чего нужны

Generics (обобщения) позволяют создавать компоненты и хуки, которые работают с разными типами данных, сохраняя при этом типобезопасность. Это устраняет дублирование кода и делает библиотеки компонентов более гибкими.

### Generic-компоненты для списков

```tsx
// src/components/GenericList/GenericList.tsx
import { ReactNode, Key } from "react";

interface GenericListProps<T> {
  items: T[];
  keyExtractor: (item: T, index: number) => Key;
  renderItem: (item: T, index: number) => ReactNode;
  emptyComponent?: ReactNode;
  className?: string;
}

export function GenericList<T>({
  items,
  keyExtractor,
  renderItem,
  emptyComponent = <p>Список пуст</p>,
  className
}: GenericListProps<T>) {
  if (items.length === 0) {
    return <>{emptyComponent}</>;
  }

  return (
    <ul className={className}>
      {items.map((item, index) => (
        <li key={keyExtractor(item, index)}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}
```

### Generic-хуки для API-запросов

```tsx
// src/hooks/useApi.ts
import { useState, useCallback, useEffect } from "react";

interface ApiState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isReady: boolean;
}

interface UseApiOptions {
  immediate?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: unknown) => void;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const { immediate = true, onError, onSuccess } = options;
  
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isReady: false
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await fetcher();
      setState({ data: result, error: null, isLoading: false, isReady: true });
      onSuccess?.(result);
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, error: err, isLoading: false, isReady: false });
      onError?.(err);
      throw err;
    }
  }, [fetcher, onError, onSuccess]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { ...state, execute, refetch: execute };
}
```

### Generic-компоненты для форм

```tsx
// src/components/GenericForm/GenericForm.tsx
import { FormEvent, ReactNode, useState, useCallback } from "react";

interface FieldConfig<T extends Record<string, unknown>> {
  name: keyof T;
  label: string;
  type?: "text" | "email" | "password" | "number";
  validate?: (value: T[keyof T]) => string | undefined;
}

interface GenericFormProps<T extends Record<string, unknown>> {
  initialValues: T;
  fields: FieldConfig<T>[];
  onSubmit: (values: T) => Promise<void> | void;
  children?: ReactNode;
  submitLabel?: string;
}

export function GenericForm<T extends Record<string, unknown>>({
  initialValues,
  fields,
  onSubmit,
  children,
  submitLabel = "Отправить"
}: GenericFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((
    field: keyof T, 
    value: T[keyof T]
  ) => {
    setValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<Record<keyof T, string>> = {};
    for (const field of fields) {
      if (field.validate) {
        const error = field.validate(values[field.name]);
        if (error) {
          newErrors[field.name] = error;
        }
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map(field => (
        <div key={String(field.name)} className="form-field">
          <label htmlFor={String(field.name)}>{field.label}</label>
          <input
            id={String(field.name)}
            type={field.type || "text"}
            value={String(values[field.name] || "")}
            onChange={(e) => handleChange(
              field.name, 
              field.type === "number" 
                ? (Number(e.target.value) as T[keyof T])
                : (e.target.value as T[keyof T])
            )}
          />
          {errors[field.name] && (
            <span className="error">{errors[field.name]}</span>
          )}
        </div>
      ))}
      
      {children}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Отправка..." : submitLabel}
      </button>
    </form>
  );
}
```

---

## Utility Types

### Для чего нужны

Utility Types — это встроенные в TypeScript типы-утилиты для трансформации других типов. Они позволяют:
- Делать свойства необязательными или обязательными
- Выбирать или исключать определённые поля из типа
- Создавать типы для объектов, массивов, функций
- Избегать дублирования описаний типов

### Встроенные утилитарные типы

```tsx
// src/utils/types.ts

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

// Pick<T, K> — выбирает указанные свойства
// Для чего: создание превью-типа с ограниченным набором полей
type UserPreview = Pick<User, "id" | "name">;
// { id: number; name: string; }

// Omit<T, K> — исключает указанные свойства
// Для чего: создание типа без чувствительных полей (например, без пароля)
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
// Для чего: типизация результатов асинхронных операций
type CreateUserFn = (name: string) => Promise<User>;
type CreateUserResult = ReturnType<CreateUserFn>;
// Promise<User>

// Parameters<T> — тип параметров функции
// Для чего: создание обёрток, проксирование вызовов
type CreateUserParams = Parameters<CreateUserFn>;
// [name: string]
```

### Кастомные утилитарные типы

```tsx
// src/utils/customTypes.ts

// Nullable<T> — добавляет null к типу
// Для чего: явное указание, что значение может отсутствовать
export type Nullable<T> = T | null;

// Optional<T, K> — делает указанные свойства необязательными
// Для чего: частичное обновление объекта без изменения остальных полей
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// DeepPartial<T> — рекурсивно делает все свойства необязательными
// Для чего: тестовые данные, моки, частичная конфигурация
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object 
    ? DeepPartial<T[P]> 
    : T[P];
};

// ValueOf<T> — тип значения объекта
// Для чего: извлечение возможных значений из объекта-константы
export type ValueOf<T> = T[keyof T];

// AsyncReturnType<T> — тип разрешения для асинхронной функции
// Для чего: типизация данных, возвращаемых из async-функций
export type AsyncReturnType<T extends (...args: any[]) => Promise<any>> = 
  T extends (...args: any[]) => Promise<infer R> ? R : never;
```

### Типизация событий и обработчиков

```tsx
// src/utils/eventTypes.ts
import { 
  ChangeEvent, 
  FocusEvent, 
  KeyboardEvent, 
  MouseEvent,
  FormEvent 
} from "react";

// Для чего: переиспользование типов обработчиков в разных компонентах
// Избегает дублирования сложных типов событий

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
```

---

## Типизация хуков

### Для чего нужно

Типизация хуков позволяет:
- Явно описывать структуру возвращаемого значения
- Использовать generics для работы с разными типами данных
- Получать автодополнение при использовании хука
- Избегать ошибок при передаче неверных аргументов

### Базовая типизация хуков

```tsx
// src/hooks/useCounter.ts
export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initial);
  
  return {
    count,
    increment,
    decrement,
    reset,
    setCount
  };
}

// Выносим тип возвращаемого значения для документации и переиспользования
export type UseCounterReturn = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: React.Dispatch<React.SetStateAction<number>>;
};
```

### Generic-хуки

```tsx
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from "react";

// Для чего: хранение и синхронизация данных любого типа в localStorage
export function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key && e.storageArea === localStorage) {
        try {
          setStoredValue(JSON.parse(e.newValue || "null"));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key]);

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  const remove = () => {
    localStorage.removeItem(key);
    setStoredValue(initialValue);
  };

  return [storedValue, setValue, remove];
}
```

### Типизация хуков с колбэками

```tsx
// src/hooks/useEventListener.ts
import { useEffect, useRef } from "react";

// Для чего: безопасная подписка на события DOM с автоматической очисткой
// и типизированным доступом к target элемента

type EventHandler<E extends Event, T = EventTarget> = (
  event: E & { target: EventTarget & T }
) => void;

interface UseEventListenerOptions {
  capture?: boolean;
  passive?: boolean;
  once?: boolean;
}

export function useEventListener<
  E extends Event,
  T extends EventTarget = HTMLElement
>(
  eventName: string,
  handler: EventHandler<E, T>,
  element: T | null,
  options?: UseEventListenerOptions
): void {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!element) return;

    const listener = (event: Event) => {
      savedHandler.current(event as E & { target: EventTarget & T });
    };

    element.addEventListener(eventName, listener, options);
    return () => {
      element.removeEventListener(eventName, listener, options);
    };
  }, [eventName, element, options]);
}
```

---

## Продвинутые паттерны

### Для чего нужны

Продвинутые паттерны типизации позволяют:
- Создавать типобезопасные контексты с проверкой на undefined
- Строить HOC с автоматической инъекцией пропсов
- Реализовывать Compound Components с общим контекстом
- Избегать дублирования типов в связанных компонентах

### Типизация контекста с типобезопасным провайдером

```tsx
// src/context/TypedContext.tsx
import { 
  createContext, 
  useContext, 
  ReactNode, 
  Dispatch, 
  SetStateAction 
} from "react";

// Для чего: централизованное управление состоянием с типобезопасным доступом
// из любого компонента приложения

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

type AuthAction = 
  | { type: "LOGIN"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

interface AuthContextType {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  const login = async (credentials: Credentials) => {
    // реализация
  };
  
  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Хук с проверкой — выбрасывает ошибку, если используется вне провайдера
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

### Типизация HOC (Higher-Order Components)

```tsx
// src/hoc/withAuth.tsx
import { ComponentType, FC } from "react";
import { useAuth } from "../context/TypedContext";

// Для чего: добавление функциональности (авторизация, логирование, 
// обработка ошибок) к существующим компонентам с сохранением типизации

export interface WithAuthProps {
  user: User | null;
  isLoading: boolean;
}

export function withAuth<P extends WithAuthProps>(
  Component: ComponentType<P>,
  options: {
    redirectTo?: string;
    redirectIfAuthenticated?: boolean;
  } = {}
): FC<Omit<P, keyof WithAuthProps>> {
  return function ProtectedComponent(props: Omit<P, keyof WithAuthProps>) {
    const { user, isLoading } = useAuth();
    
    if (isLoading) return <Spinner />;
    
    return (
      <Component 
        {...(props as P)} 
        user={user} 
        isLoading={isLoading} 
      />
    );
  };
}
```

### Типизация Compound Components

```tsx
// src/components/Tabs/Tabs.tsx
import { 
  createContext, 
  useContext, 
  ReactNode, 
  useState,
  FC,
  PropsWithChildren
} from "react";

// Для чего: создание гибких композируемых компонентов с общим состоянием,
// где дочерние компоненты автоматически получают доступ к контексту родителя

interface TabsContextType {
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  children: ReactNode;
  defaultIndex?: number;
  onChange?: (index: number) => void;
}

export const Tabs: FC<TabsProps> = ({ 
  children, 
  defaultIndex = 0, 
  onChange 
}) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    onChange?.(index);
  };

  return (
    <TabsContext.Provider value={{ selectedIndex, onSelect: handleSelect }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: FC<PropsWithChildren> = ({ children }) => {
  return <div className="tabs__list" role="tablist">{children}</div>;
};

interface TabsTriggerProps {
  index: number;
  disabled?: boolean;
  children: ReactNode;
}

export const TabsTrigger: FC<TabsTriggerProps> = ({ 
  index, 
  disabled, 
  children 
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");
  
  const { selectedIndex, onSelect } = context;
  const isActive = selectedIndex === index;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => !disabled && onSelect(index)}
      className={`tabs__trigger ${isActive ? "active" : ""}`}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  index: number;
  children: ReactNode;
}

export const TabsContent: FC<TabsContentProps> = ({ index, children }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");
  
  if (context.selectedIndex !== index) return null;
  
  return (
    <div role="tabpanel" className="tabs__content">
      {children}
    </div>
  );
}
```

---

## Коммиты для Git

```bash
git add src/components/Button/Button.tsx
git commit -m "feat: add typed Button component with HTML attributes inheritance"

git add src/components/Card/Card.tsx
git commit -m "feat: add Card component with ReactNode children typing"

git add src/components/Alert/Alert.tsx
git commit -m "feat: add Alert with discriminated union props typing"

git add src/components/Input/Input.tsx
git commit -m "feat: add forwardRef Input with proper TypeScript typing"

git add src/components/GenericList/GenericList.tsx
git commit -m "feat: add GenericList component with TypeScript generics"

git add src/hooks/useApi.ts
git commit -m "feat: add generic useApi hook with typed responses"

git add src/utils/types.ts src/utils/customTypes.ts
git commit -m "feat: add utility types and custom type helpers"

git add src/utils/eventTypes.ts
git commit -m "feat: add typed event handlers utilities"

git add src/hooks/useLocalStorage.ts src/hooks/useEventListener.ts
git commit -m "feat: add typed generic hooks with proper return types"

git add src/context/TypedContext.tsx
git commit -m "feat: add type-safe context pattern with useAuth hook"

git add src/hoc/withAuth.tsx
git commit -m "feat: add typed HOC pattern with prop injection"

git add src/components/Tabs/Tabs.tsx
git commit -m "feat: add typed Compound Components pattern for Tabs"

git add .
git commit -m "feat: add comprehensive TypeScript typing guide for React"
```

---

## Полезные ссылки

- TypeScript Handbook: https://www.typescriptlang.org/docs/
- React + TypeScript Cheatsheet: https://react-typescript-cheatsheet.netlify.app/
- Utility Types Documentation: https://www.typescriptlang.org/docs/handbook/utility-types.html
- TypeScript ESLint: https://typescript-eslint.io/

---

Совет: Всегда явно типизируйте возвращаемые значения хуков и пропсы компонентов — это улучшает автодополнение, упрощает рефакторинг и помогает находить ошибки на этапе компиляции.
