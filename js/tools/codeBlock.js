/*
  文件: source/js/tools/codeBlock.js
  目的: 为代码块添加复制与折叠功能。会在每个 `.highlight` 区块外包一层容器，
       并注入复制按钮与折叠按钮，绑定相应的事件处理。
  说明: 不修改页面结构的核心语义，仅增强用户交互体验。下面函数为默认导出。
*/
const initCopyCode = () => {
  HTMLElement.prototype.wrap = function (wrapper) {
    this.parentNode.insertBefore(wrapper, this);
    this.parentNode.removeChild(this);
    wrapper.appendChild(this);
  };

  document.querySelectorAll("figure.highlight").forEach((element) => {
    const container = document.createElement("div");
    element.wrap(container);
    container.classList.add("highlight-container");
    container.insertAdjacentHTML(
      "beforeend",
      '<div class="copy-button"><i class="fa-regular fa-copy"></i></div>',
    );
    container.insertAdjacentHTML(
      "beforeend",
      '<div class="fold-button"><i class="fa-solid fa-chevron-down"></i></div>',
    );
    const copyButton = container.querySelector(".copy-button");
    const foldButton = container.querySelector(".fold-button");
    // 复制按钮处理: 将代码行拼接并写入剪贴板
    copyButton.addEventListener("click", () => {
      const codeLines = [...container.querySelectorAll(".code .line")];
      const code = codeLines.map((line) => line.innerText).join("\n");

      // Copy code to clipboard
      navigator.clipboard.writeText(code);

      // Display 'copied' icon
      copyButton.querySelector("i").className = "fa-regular fa-check";

      // Reset icon after a while
      setTimeout(() => {
        copyButton.querySelector("i").className = "fa-regular fa-copy";
      }, 1000);
    });
    // 折叠按钮处理: 切换容器折叠样式并切换图标
    foldButton.addEventListener("click", () => {
      container.classList.toggle("folded");
      foldButton.querySelector("i").className = container.classList.contains(
        "folded",
      )
        ? "fa-solid fa-chevron-up"
        : "fa-solid fa-chevron-down";
    });
  });
};

export default initCopyCode;
