(function() {
  const audioList = [];
  const isFixed = theme.plugins.aplayer.type === "fixed";
  const isMini = theme.plugins.aplayer.type === "mini";

  for (const audio of theme.plugins.aplayer.audios) {
    const audioObj = {
      name: audio.name,
      artist: audio.artist,
      url: audio.url,
      cover: audio.cover,
      lrc: audio.lrc,
      theme: audio.theme,
    };
    audioList.push(audioObj);
  }

  // 保存播放状态
  function savePlayerState(player) {
    try {
      const audio = player.audio || document.querySelector('#aplayer audio');
      if (audio) {
        const state = {
          currentTime: audio.currentTime,
          isPlaying: !audio.paused,
          currentIndex: player.list ? player.list.index : 0
        };
        localStorage.setItem('aplayer_state', JSON.stringify(state));
      }
    } catch (e) {
      console.error('保存播放状态失败:', e);
    }
  }

  // 恢复播放状态
  function restorePlayerState(player) {
    try {
      const savedState = localStorage.getItem('aplayer_state');
      if (savedState) {
        const state = JSON.parse(savedState);
        const audio = player.audio || document.querySelector('#aplayer audio');
        
        if (audio && state.currentTime !== undefined) {
          // 立即尝试恢复
          if (audio.readyState >= 2) {
            audio.currentTime = state.currentTime;
            if (state.isPlaying && audio.paused) {
              audio.play().catch(e => console.log('自动播放失败:', e));
            }
          } else {
            // 等待音频加载
            const restoreHandler = function() {
              audio.currentTime = state.currentTime;
              if (state.isPlaying && audio.paused) {
                audio.play().catch(e => console.log('自动播放失败:', e));
              }
            };
            audio.addEventListener('loadedmetadata', restoreHandler, { once: true });
            audio.addEventListener('canplay', restoreHandler, { once: true });
          }
        }
      }
    } catch (e) {
      console.error('恢复播放状态失败:', e);
    }
  }

  // 初始化播放器
  function initPlayer() {
    const container = document.getElementById("aplayer");
    if (!container) {
      setTimeout(initPlayer, 50);
      return;
    }

    // 销毁旧实例
    if (window.aplayerInstance) {
      try {
        window.aplayerInstance.destroy();
        window.aplayerInstance = null;
      } catch (e) {
        // 忽略错误
      }
    }

    let player;

    if (isMini) {
      player = new APlayer({
        container: container,
        mini: true,
        audio: audioList,
        preload: 'auto', // 预加载音频，减少延迟
      });
    } else if (isFixed) {
      player = new APlayer({
        container: container,
        fixed: true,
        lrcType: 3,
        audio: audioList,
        preload: 'auto', // 预加载音频，减少延迟
      });
      
      // 立即点击 LRC 按钮
      setTimeout(function() {
        const lrcBtn = container.querySelector(".aplayer-icon-lrc");
        if (lrcBtn) {
          lrcBtn.click();
        }
      }, 50);
    }

    if (player) {
      window.aplayerInstance = player;

      // 定期保存播放状态
      let saveInterval;
      const audio = player.audio || container.querySelector('audio');
      if (audio) {
        // 预加载音频以减少延迟
        audio.preload = 'auto';
        
        audio.addEventListener('timeupdate', function() {
          if (!saveInterval) {
            saveInterval = setInterval(function() {
              savePlayerState(player);
            }, 1000);
          }
        });
      }

      // 监听播放/暂停事件
      if (player.on) {
        player.on('play', function() {
          savePlayerState(player);
        });
        player.on('pause', function() {
          savePlayerState(player);
        });
        player.on('ended', function() {
          localStorage.removeItem('aplayer_state');
        });
      }

      // 页面加载时恢复状态
      setTimeout(function() {
        restorePlayerState(player);
      }, 200);
    }
  }

  // 页面切换处理
  if (typeof swup !== 'undefined') {
    swup.hooks.on('visit:start', function() {
      if (window.aplayerInstance) {
        savePlayerState(window.aplayerInstance);
      }
    });
    
    swup.hooks.on('content:replace', function() {
      // 保存当前状态
      if (window.aplayerInstance) {
        savePlayerState(window.aplayerInstance);
      }
      // 重新初始化播放器
      setTimeout(function() {
        if (document.getElementById('aplayer')) {
          initPlayer();
        }
      }, 100);
    });
    
    // 监听 swupjs 的自定义事件（备选）
    document.addEventListener('swup:contentReplaced', function() {
      if (window.aplayerInstance) {
        savePlayerState(window.aplayerInstance);
      }
      setTimeout(function() {
        if (document.getElementById('aplayer')) {
          initPlayer();
        }
      }, 100);
    });
  }

  // 立即初始化播放器
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlayer);
  } else {
    initPlayer();
  }
})();

