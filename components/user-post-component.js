import { renderHeaderComponent } from "./header-component.js";
import { posts } from "../index.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { displayLikes } from "./posts-page-component.js";

export function renderUserPostsPageComponent({ appEl }) {
  const userPostsHtml = posts
    .map((posts) => {
      const formattedDate = formatDistanceToNow(new Date(posts.createdAt), {
        addSuffix: true,
        locale: ru
      });
      return `
    <ul class="posts">
      <li class="post">
        <div class="post-header" data-user-id="${posts.user.id}">
            <img src="${
              posts.user.imageUrl
            }" class="posts-user-header__user-image">
            <p class="posts-user-header__user-name">${posts.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${posts.imageUrl}">
        </div>
        <div class="post-likes">
          <button data-post-id="${posts.id}" class="like-button">
          ${
            posts.isLiked
              ? `<img src="./assets/images/like-active.svg">`
              : `<img src="./assets/images/like-not-active.svg">`
          }
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${displayLikes(posts.likes)}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${posts.user.name}</span>
          ${posts.description}
        </p>
        <p class="post-date">
          ${formattedDate}
        </p>
      </li>
    </ul>
  `;
    })
    .join("");

  const postPageHtml = `
    <div class="page-container" >
    <div class="header-container"></div>
    ${userPostsHtml}
    </div>
    `;

  appEl.innerHTML = postPageHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container")
  });
}
