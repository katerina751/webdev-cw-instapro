import { renderHeaderComponent } from "./header-component.js";
import { posts, getToken } from "../index.js";
import { addLike, deleteLike } from "../api.js";
import { user } from "../index.js"

import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function renderUserPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);


  const postsUserHeaderHtml = posts.map((post) => {
    return `
              <img src="${post.user.imageUrl}" class="posts-user-header__user-image">
              <p class="posts-user-header__user-name">${post.user.name}</p>`;
  }).pop();

  const postsHtml = posts.map((post, index) => {
    return `
        <li class="post" data-index=${index}>
          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}">
          </div>
          <div class="post-likes">
            <button data-post-id="${post.id}" class="like-button">
            ${post.isLiked ? `<img src="./assets/images/like-active.svg">` : `<img src="./assets/images/like-not-active.svg">`}
            </button>
            <p class="post-likes-text">
              Нравится: <strong> ${post.likes.length > 1 ? post.likes.map((like) => { return like.name }).pop() + " и еще " + (post.likes.length - 1) : post.likes.length == 1 ? post.likes.map((like) => { return like.name }).pop() : "0"}</strong>
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${post.user.name}</span>
            ${post.description}
          </p>
          <p class="post-date">
            ${formatDistanceToNow(new Date(post.createdAt), {
              locale: ru,
              addSuffix: true,
            })}
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


  // оживляем лайки

  //Likes
  const buttonLikeElements = document.querySelectorAll(".like-button");
  for (let buttonLikeElement of buttonLikeElements) {
    buttonLikeElement.addEventListener("click", () => {
      const postId = buttonLikeElement.dataset.postId;
      const index = buttonLikeElement.closest(".post").dataset.index;

      if (user && posts[index].isLiked === false) {
        addLike({
          token: getToken(),
          postId: postId,
        }).catch(() => {
          posts[index].isLiked = false;
          posts[index].likes.pop();
          renderUserPostsPageComponent({ appEl, posts });
        });
        posts[index].isLiked = true;
        posts[index].likes.push({
          id: user.id,
          name: user.name,
        });
        renderUserPostsPageComponent({ appEl, posts });
      } else if (user && posts[index].isLiked === true) {
        deleteLike({
          token: getToken(),
          postId: postId,
        }).catch(() => {
          posts[index].isLiked = true;
          posts[index].likes.push({
            id: user.id,
            name: user.name,
          });
        });
        posts[index].isLiked = false;
        posts[index].likes.pop();
        renderUserPostsPageComponent({ appEl, posts });
      }
    });

  }

}