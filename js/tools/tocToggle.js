/*
  文件: source/js/tools/tocToggle.js
  目的: 文章目录折叠/展开控制模块。管理侧边栏目录展示状态并保存到主题状态。
  说明: 导出 `initTocToggle()` 以便在 DOMContentLoaded 与 swup 页面切换时初始化。
*/
import { main } from "../main.js";

export function initTocToggle() {
  const TocToggle = {
    toggleBar: document.querySelector(".page-aside-toggle"),
    postPageContainerDom: document.querySelector(".post-page-container"),
    toggleBarIcon: document.querySelector(".page-aside-toggle i"),
    articleContentContainerDom: document.querySelector(
      ".article-content-container",
    ),
    mainContentDom: document.querySelector(".main-content"),

    isOpenPageAside: false,

    // 初始化目录折叠按钮的点击事件
    initToggleBarButton() {
      this.toggleBar &&
        this.toggleBar.addEventListener("click", () => {
          this.isOpenPageAside = !this.isOpenPageAside;
          main.styleStatus.isOpenPageAside = this.isOpenPageAside;
          main.setStyleStatus();
          this.changePageLayoutWhenOpenToggle(this.isOpenPageAside);
        });
    },

    // 安全切换元素的 class（仅当元素存在时）
    toggleClassName(element, className, condition) {
      if (element) {
        element.classList.toggle(className, condition);
      }
    },
    changePageLayoutWhenOpenToggle(isOpen) {
      this.toggleClassName(this.toggleBarIcon, "fas", isOpen);
      this.toggleClassName(this.toggleBarIcon, "fa-indent", isOpen);
      this.toggleClassName(this.toggleBarIcon, "fa-outdent", !isOpen);
      this.toggleClassName(this.postPageContainerDom, "show-toc", isOpen);
      this.toggleClassName(this.mainContentDom, "has-toc", isOpen);
    },

    pageAsideHandleOfTOC(isOpen) {
      this.toggleBar.style.display = "flex";
      this.isOpenPageAside = isOpen;
      this.changePageLayoutWhenOpenToggle(isOpen);
    },
  };

  TocToggle.initToggleBarButton();
  return TocToggle;
}

// Event listeners
try {
  swup.hooks.on("page:view", () => {
    initTocToggle();
  });
} catch (e) {}

document.addEventListener("DOMContentLoaded", initTocToggle);
