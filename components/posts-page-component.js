import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { goToPage, getToken } from "../index.js";
import { addLike, deleteLike } from "../api.js";
import { user } from "../index.js"

import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function renderPostsPageComponent({ appEl, posts }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  const postsHtml = posts.map((post, index) => {
    console.log(post.likes);
    const likesDescription = () => {
      if (post.likes.length > 1) {
        post.likes.map((like) => { return like.name }).pop() + " и еще " + (post.likes.length - 1);
      } else if (post.likes.length == 1) {
        post.likes.map((like) => { return like.name }).pop();
      } else `0`;
    }
    return `
        <li class="post" data-index=${index}>
          <div class="post-header" data-user-id="${post.user.id}">
              <img src="${post.user.imageUrl}" class="post-header__user-image">
              <p class="post-header__user-name">${post.user.name}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}">
          </div>
          <div class="post-likes">
            <button data-post-id="${post.id}" class="like-button">
            ${post.isLiked ? `<img src="./assets/images/like-active.svg">` : `<img src="./assets/images/like-not-active.svg">`}
            </button>
            <p class="post-likes-text">
              Нравится: <strong> ${likesDescription}}</strong>
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
                <ul class="posts">
                  ${postsHtml}
                </ul>
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
          renderPostsPageComponent({ appEl, posts });
        });
        posts[index].isLiked = true;
        posts[index].likes.push({
          id: user.id,
          name: user.name,
        });
        renderPostsPageComponent({ appEl, posts });
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
        renderPostsPageComponent({ appEl, posts });
      }
    });




  }




}
