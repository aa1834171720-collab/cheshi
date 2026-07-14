/ ==================== 手机界面状态栏 ====================
// ==================== 加载 Font Awesome（安全方式）====================
function loadFontAwesome() {
    // 检查是否已经加载
    if ($('link[href*="font-awesome"]').length > 0 || $('link[href*="fontawesome"]').length > 0) {
        return;
    }

    // 通过 link 标签加载（异步，不会阻塞渲染）
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
}

// ==================== 样式注入 ====================
const phoneStyles = `
<style id="mobile-phone-styles">
html, body {
    height: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0;
}

/* ==================== 触发按钮 - Brushed Metal风格（复刻状态栏悬浮球） ==================== */
#mobile-trigger-btn {
    position: fixed;
    /*  桌面端默认：离右边三分之一距离的垂直中央 */
    top: 50%;
    right: 33.33%;
    transform: translateY(-50%);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e3e3e3 0%, #c4c4c4 100%);
    border: 1px solid #d4d4d4;
    font-size: 28px;
    cursor: move;
    z-index: 10000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.03);
    transition: all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
    padding: 0;
    overflow: visible;
}
#mobile-trigger-btn .star-container {
    width: 85%;
    height: 85%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
#mobile-trigger-btn .icon-svg {
    width: 100%;
    height: 100%;
    overflow: visible;
    display: block;
}
#mobile-trigger-btn .star-layer {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: all 0.4s ease;
    transform-box: view-box;
    transform-origin: 50px 50px;
}
#mobile-trigger-btn .base-layer {
    stroke: #666;
    stroke-width: 2;
    opacity: 0.7;
}
#mobile-trigger-btn .layer-1 {
    stroke: #555;
    stroke-width: 2;
    stroke-dasharray: 100 400;
    stroke-dashoffset: 0;
    opacity: 0.8;
    animation: mobileBtnMetalDraw 6s linear infinite;
}
#mobile-trigger-btn .layer-2 {
    stroke: #999;
    stroke-width: 1.5;
    stroke-dashoffset: 0;
    animation: mobileBtnMetalDraw 6s linear infinite reverse;
}
@keyframes mobileBtnMetalDraw {
    from { stroke-dashoffset: 500; }
    to { stroke-dashoffset: 0; }
}
#mobile-trigger-btn .center-circle {
    fill: none;
    stroke: #777;
    stroke-width: 1.5;
}

/*  CSS类控制：移动端右边垂直居中（srcdoc iframe兼容） */
/* 使用多层ID选择器提高优先级 */
#mobile-trigger-btn#mobile-trigger-btn#mobile-trigger-btn.mobile-mode,
body #mobile-trigger-btn.mobile-mode {
    /* 移动端模式：右边垂直居中定位，覆盖所有内联样式 */
    left: auto !important;
    top: 50% !important;
    right: 12px !important;
    bottom: auto !important;
    width: 45px !important;
    height: 45px !important;
    font-size: 22px !important;
    position: fixed !important;
    display: flex !important;
    z-index: 10000 !important;
    transform: translateY(-50%) !important;
    margin: 0 !important;
    background: linear-gradient(135deg, #e3e3e3 0%, #c4c4c4 100%) !important;
    border: 1px solid #d4d4d4 !important;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.03) !important;
}

#mobile-trigger-btn#mobile-trigger-btn#mobile-trigger-btn.tablet-mode,
body #mobile-trigger-btn.tablet-mode {
    /* 平板端模式 */
    left: auto !important;
    top: auto !important;
    right: 15px !important;
    bottom: 15px !important;
    width: 50px !important;
    height: 50px !important;
    font-size: 24px !important;
    position: fixed !important;
    display: flex !important;
    z-index: 10000 !important;
    transform: none !important;
    margin: 0 !important;
    background: linear-gradient(135deg, #e3e3e3 0%, #c4c4c4 100%) !important;
    border: 1px solid #d4d4d4 !important;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.03) !important;
}

/*  CSS媒体查询：作为备用方案（在非iframe环境中生效） */
@media (max-width: 480px) {
    #mobile-trigger-btn:not(.desktop-mode) {
        left: auto !important;
        top: 50% !important;
        right: 12px !important;
        bottom: auto !important;
        width: 45px !important;
        height: 45px !important;
        font-size: 22px !important;
        transform: translateY(-50%) !important;
        background: linear-gradient(135deg, #e3e3e3 0%, #c4c4c4 100%) !important;
        border: 1px solid #d4d4d4 !important;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.03) !important;
    }
}

@media (min-width: 481px) and (max-width: 768px) {
    #mobile-trigger-btn:not(.desktop-mode) {
        left: auto !important;
        top: auto !important;
        right: 15px !important;
        bottom: 15px !important;
        width: 50px !important;
        height: 50px !important;
        font-size: 24px !important;
        background: linear-gradient(135deg, #e3e3e3 0%, #c4c4c4 100%) !important;
        border: 1px solid #d4d4d4 !important;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.03) !important;
    }
}

#mobile-trigger-btn:hover {
    transform: translateY(-5px);
    background: linear-gradient(135deg, #f0f0f0 0%, #dcdcdc 100%);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08), 0 20px 30px rgba(0, 0, 0, 0.06);
}

#mobile-trigger-btn.dragging {
    transition: none !important;
    transform: none !important;
    cursor: grabbing;
}

#mobile-trigger-btn:active:not(.dragging) {
    transform: scale(0.96);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition-duration: 0.1s;
}

/* ==================== 手机容器 ==================== */
#mobile-phone-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    z-index: 9999;
    display: none;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s;
    transition: background 0.3s ease, backdrop-filter 0.3s ease;
}

#mobile-phone-overlay.active {
    display: flex;
}

/* 置顶时：遮罩透明且不阻挡点击 */
#mobile-phone-overlay.pinned {
    background: transparent;
    backdrop-filter: none;
    pointer-events: none;
}

/* 置顶时：手机框架仍然可以响应点击 */
#mobile-phone-overlay.pinned .mobile-phone-frame {
    pointer-events: auto;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* ==================== 手机框架 ==================== */
#mobile-phone-overlay .mobile-phone-frame {
    position: relative !important;
    width: 90% !important;
    max-width: 375px !important;
    aspect-ratio: 375/737 !important;
    background: #333 !important;
    border-radius: 40px !important;
    padding: 8px !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5) !important;
    overflow: hidden !important;
    animation: slideUp 0.3s !important;
}

/* 清除手机框架的伪元素 */
#mobile-phone-overlay .mobile-phone-frame::before,
#mobile-phone-overlay .mobile-phone-frame::after {
    content: none !important;
    display: none !important;
}

@keyframes slideUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

#mobile-phone-overlay .mobile-phone-screen {
    width: 100% !important;
    height: 100% !important;
    border-radius: 32px !important;
    overflow: hidden !important;
    display: flex !important;
    flex-direction: column !important;
    position: relative !important;
    background: #fff5f7 !important;
    background-image: url('https://rpg.bolt.qzz.io/%E5%B0%81%E9%9D%A2/%E6%B3%95%E9%9C%B2%E7%89%B9.webp') !important;
    background-size: cover !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
}

/* ==================== 状态栏 ==================== */
.mobile-status-bar {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    font-size: 14px;
    font-weight: 600;
    flex-shrink: 0;
}

.status-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.status-left .time {
    color: #1a1a1a;
    font-weight: 700;
}

.pin-btn {
    background: transparent;
    border: none;
    color: #666;
    font-size: 16px;
    cursor: pointer;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    border-radius: 6px;
}

.pin-btn:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #333;
}

.pin-btn.pinned {
    color: #3B82F6;
    transform: rotate(45deg);
}

.pin-btn.pinned:hover {
    background: rgba(59, 130, 246, 0.1);
}

.status-center {
    flex: 1;
    display: flex;
    justify-content: center;
    user-select: none;
}

.dynamic-island {
    width: 126px;
    height: 30px;
    background: #1a1a1a;
    border-radius: 15px;
    position: relative;
    overflow: hidden;
}

.dynamic-island::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    background: #00ff00;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.status-right {
    display: flex;
    align-items: center;
    gap: 5px;
}

.battery {
    display: flex;
    align-items: center;
    gap: 2px;
    color: #1a1a1a;
    font-size: 12px;
}
/* ==================== 主内容区域 ==================== */
.mobile-content {
    flex: 1;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

#mobile-phone-overlay .home-screen {
    flex: 1 !important;
    padding: 20px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 20px !important;
    overflow-y: auto !important;
    background: transparent !important;
}

/* ==================== 时间天气卡片 ==================== */
.weather-card {
    /* 完全透明，但保留占位空间 */
    background: transparent;
    backdrop-filter: none;
    box-shadow: none;
    border-radius: 24px;
    padding: 20px;
    margin: 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    flex-shrink: 0;
    pointer-events: none;
}

/* 隐藏卡片内容但保留占位 */
.weather-card * {
    visibility: hidden;
}

.weather-time {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.current-date {
    font-size: 20px;
    color: #2d3748;
    font-weight: 400;
    /* 多层阴影：白色+黑色，适应任何背景 */
    text-shadow: 
        0 0 10px rgba(255, 255, 255, 0.9),
        0 0 20px rgba(255, 255, 255, 0.7),
        0 2px 4px rgba(0, 0, 0, 0.3),
        0 4px 8px rgba(0, 0, 0, 0.2);
}

.current-time {
    color: #1a1a1a;
    font-size: 48px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.05em;
    /* 强阴影确保在任何背景上都清晰 */
    text-shadow: 
        0 0 15px rgba(255, 255, 255, 1),
        0 0 30px rgba(255, 255, 255, 0.8),
        0 3px 6px rgba(0, 0, 0, 0.4),
        0 6px 12px rgba(0, 0, 0, 0.3);
}

.weather-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    /* 增强半透明背景，添加模糊效果 */
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 10px 15px;
    gap: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.weather-desc {
    font-size: 14px;
    color: #2d3748;
    font-weight: 400;
    text-shadow: 
        0 0 8px rgba(255, 255, 255, 0.8),
        0 1px 3px rgba(0, 0, 0, 0.2);
}

/* ==================== 应用图标网格 ==================== */
#mobile-phone-overlay .app-pages-container {
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    position: relative !important;
    overflow: hidden !important;
    background: transparent !important;
    touch-action: pan-x !important;
}

/* 页面滑动容器 */
#mobile-phone-overlay .app-pages-wrapper {
    flex: 1 !important;
    display: flex !important;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    touch-action: pan-x !important;
    overflow: visible !important;
    user-select: none !important;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
}

#mobile-phone-overlay .app-pages-wrapper.no-transition {
    transition: none !important;
}

#mobile-phone-overlay .app-page {
    flex: 0 0 100% !important;
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    overflow-y: auto !important;
}

#mobile-phone-overlay .app-grid {
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 25px !important;
    padding: 0 20px !important;
}

/* 页面指示器 */
#mobile-phone-overlay .page-indicators {
    display: none !important; /* 只有一页时隐藏指示器 */
    justify-content: center !important;
    align-items: center !important;
    gap: 8px !important;
    padding: 15px 0 !important;
    position: relative !important;
    z-index: 10 !important;
}

#mobile-phone-overlay .indicator {
    width: 8px !important;
    height: 8px !important;
    border-radius: 50% !important;
    background: rgba(0, 0, 0, 0.2) !important;
    transition: all 0.3s ease !important;
    cursor: pointer !important;
}

#mobile-phone-overlay .indicator.active {
    width: 24px !important;
    border-radius: 4px !important;
    background: rgba(0, 0, 0, 0.5) !important;
}

#mobile-phone-overlay .app-row {
    display: flex !important;
    justify-content: space-around !important;
    align-items: center !important;
    gap: 15px !important;
}

#mobile-phone-overlay .app-icon {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 8px !important;
    cursor: pointer !important;
    transition: transform 0.2s ease !important;
    flex: 1 !important;
    max-width: 70px !important;
    user-select: none !important;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
}

#mobile-phone-overlay .app-icon:hover {
    transform: scale(1.1) !important;
}

#mobile-phone-overlay .app-icon-bg {
    width: 56px !important;
    height: 56px !important;
    border-radius: 16px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 26px !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
    position: relative !important;
    overflow: hidden !important;
    transition: transform 0.2s, box-shadow 0.2s !important;
}

/* 清除所有可能的伪元素覆盖 */
#mobile-phone-overlay .app-icon-bg::before,
#mobile-phone-overlay .app-icon-bg::after {
    content: none !important;
    display: none !important;
}

#mobile-phone-overlay .app-icon::before,
#mobile-phone-overlay .app-icon::after {
    content: none !important;
    display: none !important;
}

#mobile-phone-overlay .app-icon-bg i {
    z-index: 1 !important;
    font-size: 26px !important;
    position: relative !important;
}

/* Material Design 风格纯色渐变背景 - 使用!important提高优先级 */
#mobile-phone-overlay .app-icon-bg.md-blue {
    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%) !important;
    border: none !important;
}

#mobile-phone-overlay .app-icon-bg.md-blue i {
    color: #ffffff !important;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
}

#mobile-phone-overlay .app-icon-bg.md-orange {
    background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%) !important;
    border: none !important;
}

#mobile-phone-overlay .app-icon-bg.md-orange i {
    color: #ffffff !important;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
}

#mobile-phone-overlay .app-icon-bg.md-green {
    background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%) !important;
    border: none !important;
}

#mobile-phone-overlay .app-icon-bg.md-green i {
    color: #ffffff !important;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
}
#mobile-phone-overlay .app-icon-bg.md-purple {
    background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%) !important;
    border: none !important;
}

#mobile-phone-overlay .app-icon-bg.md-purple i {
    color: #ffffff !important;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
}

#mobile-phone-overlay .app-icon-bg.md-pink {
    background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%) !important;
    border: none !important;
}

#mobile-phone-overlay .app-icon-bg.md-pink i {
    color: #ffffff !important;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
}

#mobile-phone-overlay .app-icon-bg.md-red {
    background: linear-gradient(135deg, #F44336 0%, #D32F2F 100%) !important;
    border: none !important;
}

#mobile-phone-overlay .app-icon-bg.md-red i {
    color: #ffffff !important;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
}

#mobile-phone-overlay .app-icon-bg.md-yellow {
    background: linear-gradient(135deg, #FFC107 0%, #FFA000 100%) !important;
    border: none !important;
}

#mobile-phone-overlay .app-icon-bg.md-yellow i {
    color: rgba(0, 0, 0, 0.75) !important;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3) !important;
}

#mobile-phone-overlay .app-icon-bg.md-cyan {
    background: linear-gradient(135deg, #00BCD4 0%, #0097A7 100%) !important;
    border: none !important;
}

#mobile-phone-overlay .app-icon-bg.md-cyan i {
    color: #ffffff !important;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
}

#mobile-phone-overlay .app-icon-bg.md-teal {
    background: linear-gradient(135deg, #009688 0%, #00796B 100%) !important;
    border: none !important;
}

#mobile-phone-overlay .app-icon-bg.md-teal i {
    color: #ffffff !important;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
}

#mobile-phone-overlay .app-label {
    font-size: 11px !important;
    color: #1a1a1a !important;
    font-weight: 500 !important;
    text-align: center !important;
    line-height: 1.2 !important;
    /* 多层文字阴影，确保在任何背景上都清晰可见 */
    text-shadow: 
        0 0 8px rgba(255, 255, 255, 1),
        0 0 12px rgba(255, 255, 255, 0.9),
        0 1px 3px rgba(0, 0, 0, 0.4),
        0 2px 6px rgba(0, 0, 0, 0.3) !important;
    /* 添加半透明背景增强可读性 */
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(4px);
    padding: 2px 6px !important;
    border-radius: 6px !important;
}

/* 图标悬停动画 */
#mobile-phone-overlay .app-icon:hover .app-icon-bg {
    transform: scale(1.08) !important;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35) !important;
}

#mobile-phone-overlay .app-icon:active .app-icon-bg {
    transform: scale(0.92) !important;
}

/* ==================== 应用详情面板 ==================== */
.app-detail-panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #ffffff !important;
    z-index: 100 !important;
    display: none;
    flex-direction: column;
    animation: slideIn 0.3s;
}

.app-detail-panel.active {
    display: flex;
}

@keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}

.app-header {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
}

.back-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: background 0.2s ease;
    font-size: 20px;
    color: #2d3748;
}

.back-button:hover {
    background: rgba(0, 0, 0, 0.1);
}

.app-title {
    font-size: 16px;
    font-weight: 600;
    color: #2d3748;
}

.app-body {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
    background: #f8f9fa;
    transition: opacity 0.2s ease-in-out;
}

/* ==================== 列表项样式 ==================== */
.list-item {
    background: #fff;
    border-radius: 12px;
    padding: 15px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.list-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.list-item-name {
    font-size: 14px;
    font-weight: 600;
    color: #2d3748;
}

.list-item-value {
    font-size: 14px;
    font-weight: 600;
    color: #10b981;
}

.list-item-desc {
    font-size: 12px;
    color: #6b7280;
    line-height: 1.5;
}

/* 好友列表项 hover 效果 */
.friend-item:hover {
    background: #fef3f2 !important;
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.15) !important;
    transform: translateY(-1px);
}

/* 论坛帖子项 hover 效果 */
.forum-post-item:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12) !important;
}

.forum-post-item:active {
    transform: translateY(0) !important;
}

.friend-item:active {
    transform: translateY(0);
}

.empty-message {
    text-align: center;
    padding: 40px 20px;
    color: #9ca3af;
    font-size: 14px;
}

/*

/* ==================== 设置页面样式 ==================== */
.settings-section {
    margin-bottom: 20px;
}

.settings-section-title {
    font-size: 14px;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 12px;
    padding-left: 5px;
}

.wallpaper-categories {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.wallpaper-category {
    background: #fff;
    border-radius: 12px;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: all 0.2s ease;
}

.wallpaper-category:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.wallpaper-category-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.wallpaper-category-name {
    font-size: 15px;
    font-weight: 600;
    color: #2d3748;
}

.wallpaper-category-count {
    font-size: 12px;
    color: #9ca3af;
}

.wallpaper-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 15px;
    display: none;
}

.wallpaper-grid.active {
    display: grid;
}

.wallpaper-item {
    aspect-ratio: 9/16;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    background: #f3f4f6;
    transition: all 0.2s ease;
}

.wallpaper-item:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.wallpaper-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.wallpaper-item.selected::after {
    content: '✓';
    position: absolute;
    top: 5px;
    right: 5px;
    width: 24px;
    height: 24px;
    background: #10b981;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
}

.wallpaper-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.wallpaper-loading::after {
    content: '';
    width: 24px;
    height: 24px;
    border: 3px solid #f3f4f6;
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    z-index: 10;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* ==================== 图片加载loading效果 ==================== */
.loading::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50px;
    height: 50px;
    margin: -25px 0 0 -25px;
    border: 4px solid rgba(91, 164, 229, 0.2);
    border-top-color: #5BA4E5;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    z-index: 10;
}
