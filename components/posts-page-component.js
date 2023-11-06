import { USER_POSTS_PAGE, POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken } from "../index.js";
import { formatDistanceToNow } from "date-fns";
import { el, id, ru } from "date-fns/locale";
import { postLikesAdd, postLikesRemove } from "../api.js";
export const displayLikes = (likes) => {
  const numberOfLikes = likes.length;

  if (numberOfLikes === 0) {
    return 0;
  }

  if (numberOfLikes === 1) {
    return `${likes[0].name}`;
  }

  return `${likes[numberOfLikes - 1].name} и еще ${numberOfLikes - 1}`;
};

export function renderPostsPageComponent({ appEl }) {
  const postsHtml = posts
    .map((posts) => {
      const formattedDate = formatDistanceToNow(new Date(posts.createdAt), {
        addSuffix: true,
        locale: ru
      });
      return `
      <ul class="posts">
        <li class="post">
          <div class="post-header" data-user-id="${posts.user.id}">
              <img src="${posts.user.imageUrl}" class="post-header__user-image">
              <p class="post-header__user-name">${posts.user.name}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${posts.imageUrl}">
          </div>
          <div class="post-likes">
          <button data-post-id="${posts.id}" data-post-like=${
            posts.isLiked
          } class="like-button">      
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

  const postPagehtml = `
    <div class="page-container" >
    <div class="header-container"></div>
    ${postsHtml}
    </div>
    `;

  appEl.innerHTML = postPagehtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container")
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId
      });
    });
  }

  for (let likeBtn of document.querySelectorAll(".like-button")) {
    likeBtn.addEventListener("click", () => {
      const id = likeBtn.dataset.postId;
      const isLiked = likeBtn.dataset.postLike === "true";
      const token = getToken();
      if (!isLiked) {
        postLikesAdd({ token, ID: id }).then((response) => {
          console.log("лайк" + response);
          return goToPage(POSTS_PAGE);
        });
      } else {
        postLikesRemove({ token, ID: id }).then((response) => {
          console.log("дизлайк" + response);
          return goToPage(POSTS_PAGE);
        });
      }
    });
  }
}
