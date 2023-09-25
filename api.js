// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod

const personalKey = "usernameapetri";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token
    }
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    })
    .catch((error) => {
      alert(error.message);
    });
}

export function getUserPosts({ userId, token }) {
  return fetch(postsHost + `/user-posts/${userId}`, {
    method: "GET",
    headers: {
      Authorization: token
    }
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    })
    .catch((error) => {
      alert(error.message);
    });
}
// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl
    })
  })
    .then((response) => {
      if (response.status === 400) {
        throw new Error("Такой пользователь уже существует");
      }
      return response.json();
    })
    .catch((error) => {
      alert(error.message);
    });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password
    })
  })
    .then((response) => {
      if (response.status === 400) {
        throw new Error("Неверный логин или пароль");
      }
      return response.json();
    })
    .catch((error) => {
      alert(error.message);
    });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data
  }).then((response) => {
    return response.json();
  });
}

export function uploadPost({ token, description, imageUrl }) {
  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: token
    },
    body: JSON.stringify({
      description,
      imageUrl
    })
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      } else if (response.status === 400) {
        throw new Error(
          "Что-то пошло не так. Проверьте данные и попробуйте снова."
        );
      } else {
        throw new Error(
          "Произошла ошибка при загрузке поста. Пожалуйста, попробуйте позже."
        );
      }
    })
    .catch((error) => {
      alert("Произошла ошибка:", error);
      throw error;
    });
}

export function postLikesAdd({ token, ID }) {
  return fetch(postsHost + `/${ID}/like`, {
    method: "POST",
    headers: {
      Authorization: token
    }
  })
    .then((response) => {
      if (response.status === 201 || 200) {
        return response.json();
      } else if (response.status === 401) {
        throw new Error("Нет авторизации");
      } else {
        throw new Error("Что то пошло не так попробуйте позже");
      }
    })
    .catch((error) => {
      if (error.message === "Нет авторизации") {
        alert("Необхадима авторизация");
      }
    });
}

export function postLikesRemove({ token, ID }) {
  return fetch(postsHost + `/${ID}/dislike`, {
    method: "POST",
    headers: {
      Authorization: token
    }
  })
    .then((response) => {
      if (response.status === 201 || 200) {
        return response.json();
      } else if (response.status === 401) {
        throw new Error("Нет авторизации");
      } else {
        throw new Error("Что то пошло не так попробуйте позже");
      }
    })
    .catch((error) => {
      if (error.message === "Нет авторизации") {
        alert("Необхадима авторизация");
      }
    });
}
