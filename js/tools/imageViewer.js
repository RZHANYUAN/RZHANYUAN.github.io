/*
  文件: source/js/tools/imageViewer.js
  目的: 图片查看器。处理图片点击放大、缩放、拖拽与键盘导航等交互。
  说明: 该模块会在页面图片元素上绑定事件，使用前需确保页面包含
        对应的 `.image-viewer-container` 容器与样式。
*/
export default function imageViewer() {
  let isBigImage = false;
  let scale = 1;
  let isMouseDown = false;
  let dragged = false;
  let currentImgIndex = 0;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let translateX = 0;
  let translateY = 0;

  // 查找图像查看器容器，若不存在则退出（安全降级）
  const maskDom = document.querySelector(".image-viewer-container");
  if (!maskDom) {
    console.warn(
      "Image viewer container not found. Exiting imageViewer function.",
    );
    return;
  }

  const targetImg = maskDom.querySelector("img");
  if (!targetImg) {
    console.warn(
      "Target image not found in image viewer container. Exiting imageViewer function.",
    );
    return;
  }

  // 显示/隐藏查看器，并在显示时禁止页面滚动
  const showHandle = (isShow) => {
    document.body.style.overflow = isShow ? "hidden" : "auto";
    isShow
      ? maskDom.classList.add("active")
      : maskDom.classList.remove("active");
  };

  // 鼠标滚轮缩放处理
  const zoomHandle = (event) => {
    event.preventDefault();
    const rect = targetImg.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const dx = offsetX - rect.width / 2;
    const dy = offsetY - rect.height / 2;
    const oldScale = scale;
    scale += event.deltaY * -0.001;
    scale = Math.min(Math.max(0.8, scale), 4);

    if (oldScale < scale) {
      // Zooming in
      translateX -= dx * (scale - oldScale);
      translateY -= dy * (scale - oldScale);
    } else {
      // Zooming out
      translateX = 0;
      translateY = 0;
    }

    targetImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  };

  // 开始拖拽
  const dragStartHandle = (event) => {
    event.preventDefault();
    isMouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    targetImg.style.cursor = "grabbing";
  };

  let lastTime = 0;
  const throttle = 100;

  // 拖拽中（节流）
  const dragHandle = (event) => {
    if (isMouseDown) {
      const currentTime = new Date().getTime();
      if (currentTime - lastTime < throttle) {
        return;
      }
      lastTime = currentTime;
      const deltaX = event.clientX - lastMouseX;
      const deltaY = event.clientY - lastMouseY;
      translateX += deltaX;
      translateY += deltaY;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      targetImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      dragged = true;
    }
  };

  // 结束拖拽
  const dragEndHandle = (event) => {
    if (isMouseDown) {
      event.stopPropagation();
    }
    isMouseDown = false;
    targetImg.style.cursor = "grab";
  };

  targetImg.addEventListener("wheel", zoomHandle, { passive: false });
  targetImg.addEventListener("mousedown", dragStartHandle, { passive: false });
  targetImg.addEventListener("mousemove", dragHandle, { passive: false });
  targetImg.addEventListener("mouseup", dragEndHandle, { passive: false });
  targetImg.addEventListener("mouseleave", dragEndHandle, { passive: false });

  // 点击遮罩关闭查看器（若不是拖拽造成的点击）
  maskDom.addEventListener("click", (event) => {
    if (!dragged) {
      isBigImage = false;
      showHandle(isBigImage);
      scale = 1;
      translateX = 0;
      translateY = 0;
      targetImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }
    dragged = false;
  });

  const imgDoms = document.querySelectorAll(
    ".markdown-body img, .masonry-item img, #shuoshuo-content img",
  );

  const escapeKeyListener = (event) => {
    if (event.key === "Escape" && isBigImage) {
      isBigImage = false;
      showHandle(isBigImage);
      scale = 1;
      translateX = 0;
      translateY = 0;
      targetImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      // Remove the event listener when the image viewer is closed
      document.removeEventListener("keydown", escapeKeyListener);
    }
  };

  if (imgDoms.length > 0) {
    imgDoms.forEach((img, index) => {
      img.addEventListener("click", () => {
        currentImgIndex = index;
        isBigImage = true;
        showHandle(isBigImage);
        targetImg.src = img.src;
        document.addEventListener("keydown", escapeKeyListener);
      });
    });

    const handleArrowKeys = (event) => {
      if (!isBigImage) return;

      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        currentImgIndex =
          (currentImgIndex - 1 + imgDoms.length) % imgDoms.length;
      } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        currentImgIndex = (currentImgIndex + 1) % imgDoms.length;
      } else {
        return;
      }

      const currentImg = imgDoms[currentImgIndex];
      let newSrc = currentImg.src;

      if (currentImg.hasAttribute("lazyload")) {
        newSrc = currentImg.getAttribute("data-src");
        currentImg.src = newSrc;
        currentImg.removeAttribute("lazyload");
      }

      targetImg.src = newSrc;
    };

    document.addEventListener("keydown", handleArrowKeys);
  } else {
    // console.warn("No images found to attach image viewer functionality.");
  }
}
