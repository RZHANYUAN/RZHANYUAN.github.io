/*
  文件: source/js/main.js
  目的: 主题的主入口模块。初始化页面行为并协调各类工具与插件。
       本文件导出 `main` 对象与 `initMain()`，分别在 DOMContentLoaded
       与 swup 页面查看事件中被调用。
  说明: 保持此文件简洁，复杂功能应委托给 `tools/`、`layouts/` 和 `plugins/` 模块。
*/
import initUtils from "./utils.js";
import initTyped from "./plugins/typed.js";
import initModeToggle from "./tools/lightDarkSwitch.js";
import initLazyLoad from "./layouts/lazyload.js";
import initScrollTopBottom from "./tools/scrollTopBottom.js";
import initLocalSearch from "./tools/localSearch.js";
import initCopyCode from "./tools/codeBlock.js";
import initBookmarkNav from "./layouts/bookmarkNav.js";

/*
  `main` 是客户端主题的中央状态持有者。它保存主题信息、持久化的样式状态（存于 localStorage），
  以及用于初始化/刷新页面功能的函数。
*/
export const main = {
  themeInfo: {
    theme: `Redefine v${theme.version}`,
    author: "EvanNotFound",
    repository: "https://github.com/EvanNotFound/hexo-theme-redefine",
  },
  localStorageKey: "REDEFINE-THEME-STATUS",
  styleStatus: {
    isExpandPageWidth: false,
    isDark: theme.colors.default_mode && theme.colors.default_mode === "dark",
    fontSizeLevel: 0,
    isOpenPageAside: true,
  },
  printThemeInfo: () => {
    console.log(
      `      ______ __  __  ______  __    __  ______                       \r\n     \/\\__  _\/\\ \\_\\ \\\/\\  ___\\\/\\ \"-.\/  \\\/\\  ___\\                      \r\n     \\\/_\/\\ \\\\ \\  __ \\ \\  __\\\\ \\ \\-.\/\\ \\ \\  __\\                      \r\n        \\ \\_\\\\ \\_\\ \\_\\ \\_____\\ \\_\\ \\ \\_\\ \\_____\\                    \r\n         \\\/_\/ \\\/_\/\\\/_\/\\\/_____\/\\\/_\/  \\\/_\/\\\/_____\/                    \r\n                                                               \r\n ______  ______  _____   ______  ______ __  __   __  ______    \r\n\/\\  == \\\/\\  ___\\\/\\  __-.\/\\  ___\\\/\\  ___\/\\ \\\/\\ \"-.\\ \\\/\\  ___\\   \r\n\\ \\  __<\\ \\  __\\\\ \\ \\\/\\ \\ \\  __\\\\ \\  __\\ \\ \\ \\ \\-.  \\ \\  __\\   \r\n \\ \\_\\ \\_\\ \\_____\\ \\____-\\ \\_____\\ \\_\\  \\ \\_\\ \\_\\\\\"\\_\\ \\_____\\ \r\n  \\\/_\/ \/_\/\\\/_____\/\\\/____\/ \\\/_____\/\\\/_\/   \\\/_\/\\\/_\/ \\\/_\/\\\/_____\/\r\n                                                               \r\n  Github: https:\/\/github.com\/EvanNotFound\/hexo-theme-redefine`,
    ); // console log message
  },
  setStyleStatus: () => {
    localStorage.setItem(
      main.localStorageKey,
      JSON.stringify(main.styleStatus),
    );
  },
  getStyleStatus: () => {
    let temp = localStorage.getItem(main.localStorageKey);
    if (temp) {
      temp = JSON.parse(temp);
      for (let key in main.styleStatus) {
        main.styleStatus[key] = temp[key];
      }
      return temp;
    } else {
      return null;
    }
  },
  // refresh: 根据页面上下文重新初始化或启动子系统
  refresh: () => {
    initUtils();
    initModeToggle();
    initScrollTopBottom();
    initBookmarkNav();
    
    if (
      theme.home_banner.subtitle.text.length !== 0 &&
      location.pathname === config.root
    ) {
      initTyped("subtitle");
    }
    
     // 音乐播放器不需要在这里重新初始化，因为脚本有 data-swup-reload-script 标记
     // 会在页面切换时自动重新加载并恢复播放状态
     // 下面的代码已删除以避免干扰播放状态恢复
    
    if (theme.navbar.search.enable === true) {
      initLocalSearch();
    }

    if (theme.articles.code_block.copy === true) {
      initCopyCode();
    }
    
    if (theme.articles.lazyload === true) {
      initLazyLoad();
    }
  },
};

export function initMain() {
  // 在 DOMContentLoaded 时调用一次以打印信息并启动功能
  main.printThemeInfo();
  main.refresh();
}

document.addEventListener("DOMContentLoaded", initMain);

try {
  swup.hooks.on("page:view", () => {
    main.refresh();
  });
} catch (e) {}
