/*
  文件: source/js/tools/scrollTopBottom.js
  目的: 页面滚动快捷按钮（回到顶部 / 回到底部）的初始化模块。
  说明: 绑定点击事件以平滑滚动到目标位置。
*/
const initScrollTopBottom = () => {
  const backToTopButton_dom = document.querySelector(".tool-scroll-to-top");
  const backToBottomButton_dom = document.querySelector(
    ".tool-scroll-to-bottom",
  );

  // 平滑滚动到页面顶部
  const backToTop = () => {
    window.scrollTo({
      top: 0, // 滚动到页面顶部
      behavior: "smooth",
    });
  };

  // 平滑滚动到页面底部
  const backToBottom = () => {
    const docHeight = document.body.scrollHeight;
    window.scrollTo({
      top: docHeight, // 滚动到页面底部
      behavior: "smooth",
    });
  };

  const initBackToTop = () => {
    if (!backToTopButton_dom) return;
    backToTopButton_dom.addEventListener("click", backToTop);
  };

  const initBackToBottom = () => {
    if (!backToBottomButton_dom) return;
    backToBottomButton_dom.addEventListener("click", backToBottom);
  };

  initBackToTop();
  initBackToBottom();
};

export default initScrollTopBottom;
