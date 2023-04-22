import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";

export function renderUserPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);
  

  const postsUserHeaderHtml = posts.map((post) => {
    return `
              <img src="${post.user.imageUrl}" class="posts-user-header__user-image">
              <p class="posts-user-header__user-name">${post.user.name}</p>`;
  }).pop();

  const postsHtml = posts.map((post) => {
    return `
        <li class="post">
          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}">
          </div>
          <div class="post-likes">
            <button data-post-id="${post.likes.id}" class="like-button">
            ${post.isLiked ? `<img src="./assets/images/like-active.svg">` : `<img src="./assets/images/like-not-active.svg">`}
            </button>
            <p class="post-likes-text">
              Нравится: <strong> ${post.likes.length > 1 ? post.likes.map((like)=>{return like.name}).pop() + " и еще " + (post.likes.length - 1) : post.likes.length == 1 ? post.likes.map((like)=>{return like.name}).pop() : "0"}</strong>
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${post.user.name}</span>
            ${post.description}
          </p>
          <p class="post-date">
          ${post.createdAt} минут назад
          </p>
        </li>`;
  })
    .join("");
  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <div class="posts-user-header">
                  ${postsUserHeaderHtml}
                </div>
                <ul class="posts">
                  ${postsHtml}
                </ul>
              <br>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}
