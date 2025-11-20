/*
  文件: source/js/tools/runtime.js
  目的: 更新页脚运行时计数器（天/时/分/秒），基于配置的站点起始时间计算。
    这是一个轻量脚本，页面加载时运行并每秒更新一次。
  说明: 主题可能在模板中使用实时时钟替换此功能；若同时存在，两者可并存
    （它们操作不同的 DOM 元素）。除非同时更新模板，否则不要修改 DOM id。
*/
const footerRuntime = () => {
  // Read configured start time (set from theme config during rendering)
  const startTime = theme.footerStart;
  // Schedule next update in 1s
  window.setTimeout(footerRuntime, 1000);

  // Compute elapsed time between now and configured start time
  const X = new Date(startTime);
  const Y = new Date();
  const T = Y.getTime() - X.getTime();
  const M = 24 * 60 * 60 * 1000; // milliseconds in a day
  const a = T / M; // days fraction
  const A = Math.floor(a); // days
  const b = (a - A) * 24; // remaining hours fraction
  const B = Math.floor(b); // hours
  const c = (b - B) * 60; // remaining minutes fraction
  const C = Math.floor((b - B) * 60); // minutes
  const D = Math.floor((c - C) * 60); // seconds

  // Update DOM nodes if present
  const runtime_days = document.getElementById("runtime_days");
  const runtime_hours = document.getElementById("runtime_hours");
  const runtime_minutes = document.getElementById("runtime_minutes");
  const runtime_seconds = document.getElementById("runtime_seconds");

  if (runtime_days) runtime_days.innerHTML = A;
  if (runtime_hours) runtime_hours.innerHTML = B;
  if (runtime_minutes) runtime_minutes.innerHTML = C;
  if (runtime_seconds) runtime_seconds.innerHTML = D;
};

// Initialize after DOM is ready
window.addEventListener("DOMContentLoaded", footerRuntime);
