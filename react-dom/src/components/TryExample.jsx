import { useEffect, useRef, useState } from "react";

/*
  ======================================================
  HTTP-УТИЛИТЫ (ТОЛЬКО try / catch)
  ======================================================
*/

// обработка HTTP-ответа
const handleResponse = async (response) => {
  try {
    // fetch не кидает ошибку при 4xx / 5xx
    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${text || response.statusText}`
      );
    }

    // пустой ответ (DELETE)
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    // ошибки парсинга JSON тоже ловим здесь
    throw error;
  }
};

// базовый request
const request = async (url, options = {}, signal) => {
  try {
    const response = await fetch(url, {
      ...options,
      signal,
    });

    return await handleResponse(response);
  } catch (error) {
    if (error.name === "AbortError") {
      console.warn("Запрос отменён");
    }

    console.error("Request error:", error.message);
    throw error;
  }
};

// request с таймаутом
const requestWithTimeout = async (url, options = {}, timeout = 5000) => {
  const controller = new AbortController();

  try {
    const timer = setTimeout(() => {
      controller.abort();
    }, timeout);

    const data = await request(url, options, controller.signal);

    clearTimeout(timer);
    return data;
  } catch (error) {
    throw error;
  }
};

// request с повторными попытками
const requestWithRetry = async (
  url,
  options = {},
  retries = 3,
  delay = 1000
) => {
  try {
    return await request(url, options);
  } catch (error) {
    if (retries <= 1) {
      throw error;
    }

    await new Promise((res) => setTimeout(res, delay));
    return await requestWithRetry(url, options, retries - 1, delay);
  }
};

/*
  ======================================================
  API-МЕТОДЫ (ТОЛЬКО try / catch)
  ======================================================
*/

const api = {
  getUsers: async () => {
    try {
      return await request(
        "https://jsonplaceholder.typicode.com/users"
      );
    } catch (error) {
      throw error;
    }
  },

  getPost: async (id) => {
    try {
      return await request(
        `https://jsonplaceholder.typicode.com/posts/${id}`
      );
    } catch (error) {
      throw error;
    }
  },

  getCommentsByPost: async (postId) => {
    try {
      return await request(
        `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
      );
    } catch (error) {
      throw error;
    }
  },

  createComment: async (payload) => {
    try {
      return await request(
        "https://jsonplaceholder.typicode.com/comments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
    } catch (error) {
      throw error;
    }
  },

  deleteComment: async (id) => {
    try {
      return await request(
        `https://jsonplaceholder.typicode.com/comments/${id}`,
        {
          method: "DELETE",
        }
      );
    } catch (error) {
      throw error;
    }
  },
};

/*
  ======================================================
  КОМПОНЕНТ
  ======================================================
*/

export default function FetchTryOnlyExample() {
  const [users, setUsers] = useState([]);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const abortRef = useRef(null);

  // загрузка пользователей при маунте
  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      try {
        setStatus("loading");
        setError(null);

        const data = await api.getUsers();

        if (active) {
          setUsers(data);
          setStatus("success");
        }
      } catch (e) {
        if (active) {
          setError(e.message);
          setStatus("error");
        }
      }
    };

    loadUsers();

    return () => {
      active = false;
    };
  }, []);

  // загрузка поста
  const loadPost = async () => {
    try {
      setStatus("loading");
      setError(null);

      const data = await api.getPost(1);
      setPost(data);
      setStatus("success");
    } catch (e) {
      setError(e.message);
      setStatus("error");
    }
  };

  // загрузка комментариев с abort
  const loadComments = async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setStatus("loading");

      const data = await request(
        "https://jsonplaceholder.typicode.com/comments?postId=1",
        {},
        controller.signal
      );

      setComments(data.slice(0, 5));
      setStatus("success");
    } catch (e) {
      if (e.name !== "AbortError") {
        setError(e.message);
        setStatus("error");
      }
    }
  };

  // создание комментария
  const createComment = async () => {
    try {
      const data = await api.createComment({
        postId: 1,
        name: "New comment",
        email: "test@mail.com",
        body: "Comment text",
      });

      console.log("Комментарий создан:", data);
    } catch (e) {
      console.error(e.message);
    }
  };

  // удаление комментария
  const deleteComment = async () => {
    try {
      await api.deleteComment(1);
      console.log("Комментарий удалён");
    } catch (e) {
      console.error(e.message);
    }
  };

  // загрузка с таймаутом
  const loadWithTimeout = async () => {
    try {
      const data = await requestWithTimeout(
        "https://jsonplaceholder.typicode.com/comments",
        {},
        2000
      );

      console.log("Timeout success:", data.length);
    } catch (e) {
      console.error("Timeout error:", e.message);
    }
  };

  // загрузка с retry
  const loadWithRetry = async () => {
    try {
      const data = await requestWithRetry(
        "https://jsonplaceholder.typicode.com/comments",
        {},
        3
      );

      console.log("Retry success:", data.length);
    } catch (e) {
      console.error("Retry error:", e.message);
    }
  };

  return (
    <section style={{ padding: 20 }}>
      <h2>Fetch — только try / catch</h2>

      {status === "loading" && <p>Загрузка...</p>}
      {status === "error" && <p>Ошибка: {error}</p>}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={loadPost}>Load post</button>
        <button onClick={loadComments}>Load comments</button>
        <button onClick={createComment}>Create comment</button>
        <button onClick={deleteComment}>Delete comment</button>
        <button onClick={loadWithTimeout}>Timeout</button>
        <button onClick={loadWithRetry}>Retry</button>
      </div>

      {post && <pre>{JSON.stringify(post, null, 2)}</pre>}

      <h4>Users</h4>
      {users.map((u) => (
        <div key={u.id}>{u.name}</div>
      ))}

      <h4>Comments</h4>
      {comments.map((c) => (
        <div key={c.id}>
          <strong>{c.email}</strong>
          <div>{c.body}</div>
        </div>
      ))}
    </section>
  );
}
