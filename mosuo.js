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
/* ==================== 响应式适配 - 教科书级实现 ==================== */
/* 大屏手机适配 (≤480px) */
@media (max-width: 480px) {
    /* 框架适配 */
    .mobile-phone-frame,
    #mobile-phone-overlay .mobile-phone-frame {
        width: 90% !important;
        max-width: 100% !important;
        border-radius: 30px !important;
        padding: 6px !important;
    }
    
    #mobile-phone-overlay .mobile-phone-screen {
        border-radius: 24px !important;
    }
    
    /* 触发按钮 */
    #mobile-trigger-btn {
        width: 45px;
        height: 45px;
        bottom: 12px;
        right: 12px;
    }
    
    /* 状态栏 */
    .mobile-status-bar {
        height: 36px;
        padding: 0 10px;
        font-size: 12px;
    }
    
    .status-left .time {
        font-size: 13px;
    }
    
    /* 应用 Header */
    .app-header {
        height: 44px;
        padding: 0 12px;
    }
    
    .app-title {
        font-size: 16px;
    }
    
    .back-button,
    .pin-btn {
        font-size: 18px;
        padding: 4px;
    }
    
    /* 主屏幕 */
    .home-screen {
        padding: 12px;
        gap: 12px;
    }
    
    /* 天气卡片 */
    .weather-card {
        padding: 12px;
        gap: 10px;
        border-radius: 15px;
    }
    
    .weather-time {
        font-size: 22px;
    }
    
    .weather-date {
        font-size: 12px;
    }
    
    .weather-location {
        font-size: 11px;
    }
    
    /* 应用图标 */
    .app-icon {
        gap: 5px;
    }
    
    .app-icon-bg {
        width: 46px;
        height: 46px;
        font-size: 23px;
        border-radius: 12px;
    }
    
    .app-label {
        font-size: 10px;
    }
    
    /* 应用网格 */
    .app-grid {
        gap: 12px;
    }
    
    .app-row {
        gap: 15px;
    }
    
    /* 应用内容 */
    .app-body {
        padding: 12px;
    }
    
    /* 列表项 */
    .list-item {
        padding: 10px;
        border-radius: 10px;
    }
    
    .list-item-name {
        font-size: 13px;
    }
    
    .list-item-value {
        font-size: 14px;
    }
    
    .list-item-desc {
        font-size: 11px;
    }
    
    /* 消息列表 */
    .message-item {
        padding: 10px;
        gap: 10px;
    }
    
    .message-avatar {
        width: 42px;
        height: 42px;
        font-size: 18px;
    }
    
    .message-name {
        font-size: 13px;
    }
    
    .message-preview {
        font-size: 11px;
    }
    
    .message-time {
        font-size: 10px;
    }
    
    /* 聊天界面 */
    .chat-messages {
        gap: 12px;
        padding: 10px;
    }
    
    .chat-bubble {
        font-size: 13px;
        padding: 9px 13px;
        border-radius: 16px;
    }
    
    .chat-time {
        font-size: 10px;
    }
    
    .chat-input-container {
        padding: 10px 12px;
        gap: 8px;
    }
    
    .chat-input {
        font-size: 13px;
        padding: 8px 12px;
        border-radius: 20px;
    }
    
    .send-button {
        width: 36px;
        height: 36px;
        font-size: 15px;
    }
    
    /* 商品卡片 */
    .shop-grid {
        gap: 10px;
    }
    
    .shop-item {
        padding: 10px;
        border-radius: 10px;
    }
    
    .shop-item-name {
        font-size: 13px;
    }
    
    .shop-item-desc {
        font-size: 11px;
    }
    
    .shop-item-price {
        font-size: 14px;
    }
    
    .shop-buy-btn {
        padding: 6px 12px;
        font-size: 12px;
    }
    
    /* 好友卡片 */
    .friends-grid {
        gap: 10px;
    }
    
    .friend-card {
        padding: 10px;
        border-radius: 10px;
    }
    
    .friend-avatar {
        width: 40px;
        height: 40px;
        font-size: 18px;
    }
    
    .friend-name {
        font-size: 14px;
    }
    
    .friend-identity {
        font-size: 11px;
    }
    
    .friend-stats {
        font-size: 10px;
    }
    
    .friend-stat-value {
        font-size: 13px;
    }
    
    /* 已移除资产相关样式 */
    
    .asset-item {
        padding: 10px;
    }
    
    .asset-label {
        font-size: 12px;
    }
    
    .asset-value {
        font-size: 14px;
    }
    
    /* 空状态 */
    .empty-state {
        padding: 40px 20px;
    }
    
    .empty-icon {
        font-size: 40px;
    }
    
    .empty-text {
        font-size: 13px;
    }
}

/* 小屏手机适配 (≤360px) */
@media (max-width: 360px) {
    /* 框架适配 */
    .mobile-phone-frame,
    #mobile-phone-overlay .mobile-phone-frame {
        width: 95% !important;
        border-radius: 25px !important;
        padding: 5px !important;
    }
    
    #mobile-phone-overlay .mobile-phone-screen {
        border-radius: 20px !important;
    }
    
    /* 触发按钮 */
    #mobile-trigger-btn {
        width: 40px;
        height: 40px;
        bottom: 10px;
        right: 10px;
    }
    
    /* 状态栏 */
    .mobile-status-bar {
        height: 34px;
        padding: 0 8px;
        font-size: 11px;
    }
    
    /* 应用 Header */
    .app-header {
        height: 40px;
        padding: 0 10px;
    }
    
    .app-title {
        font-size: 15px;
    }
    
    .back-button,
    .pin-btn {
        font-size: 16px;
        padding: 3px;
    }
    
    /* 主屏幕 */
    .home-screen {
        padding: 10px;
        gap: 10px;
    }
    
    /* 天气卡片 */
    .weather-card {
        padding: 10px;
    }
    
    .weather-time {
        font-size: 20px;
    }
    
    .weather-date {
        font-size: 11px;
    }
    
    /* 应用图标 */
    .app-icon-bg {
        width: 42px;
        height: 42px;
        font-size: 21px;
        border-radius: 10px;
    }
    
    .app-label {
        font-size: 9px;
    }
    
    .app-grid {
        gap: 10px;
    }
    
    .app-row {
        gap: 12px;
    }
    
    /* 应用内容 */
    .app-body {
        padding: 10px;
    }
    
    /* 列表项 */
    .list-item-name {
        font-size: 12px;
    }
    
    .list-item-value {
        font-size: 13px;
    }
    
    /* 聊天 */
    .chat-bubble {
        font-size: 12px;
        padding: 8px 12px;
    }
    
    .chat-input {
        font-size: 12px;
        padding: 7px 10px;
    }
    
    .send-button {
        width: 34px;
        height: 34px;
    }
    
    /* 好友头像 */
    .friend-avatar,
    .message-avatar {
        width: 36px;
        height: 36px;
        font-size: 16px;
    }
}

/* 触控优化 - 所有触摸设备 */
@media (hover: none) and (pointer: coarse) {
    /* 确保最小触控区域 44px (Apple HIG 标准) */
    .app-icon,
    .back-button,
    .send-button,
    .shop-buy-btn,
    button {
        min-width: 44px;
        min-height: 44px;
    }
    
    /* 增加间距防止误触 */
    .app-row {
        gap: 20px;
    }
    
    /* 增强触控反馈 */
    .app-icon:active {
        transform: scale(0.85);
    }
    
    .list-item:active,
    .message-item:active,
    .friend-card:active {
        transform: scale(0.98);
    }
}

/* 横屏优化 */
@media (max-width: 768px) and (orientation: landscape) {
    .mobile-phone-frame,
    #mobile-phone-overlay .mobile-phone-frame {
        width: 50% !important;
        max-width: 500px !important;
    }
    
    .home-screen,
    .app-body {
        padding: 10px;
    }
    
    .app-grid {
        gap: 10px;
    }
}

/* ==================== 滚动条 ==================== */
.home-screen::-webkit-scrollbar,
.app-body::-webkit-scrollbar {
    width: 4px;
}

.home-screen::-webkit-scrollbar-track,
.app-body::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
}

.home-screen::-webkit-scrollbar-thumb,
.app-body::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
}

.home-screen::-webkit-scrollbar-thumb:hover,
.app-body::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
}
// 导航栈，用于处理多级页面
let navigationStack = [];

//  好友列表导航记忆
let friendsListScrollPosition = 0; // 好友列表滚动位置
let lastViewedFriend = null; // 最后查看的好友名称
let friendDetailScrollPosition = 0; //  好友详情页的滚动位置

/**
 * 判断对象中是否存在有效的联系人项
 */
function hasContactEntries(obj) {
    if (!obj || typeof obj !== 'object') return false;
    return Object.keys(obj).length > 0;
}

/**
 * 获取当前可用的联系人数据源（使用变量脚本的羁绊列表）
 */
function getRelationshipDataSource(source = currentPhoneData) {
    /* 优先从传入的source获取羁绊列表 */
    if (source && hasContactEntries(source.羁绊列表)) {
        return source.羁绊列表;
    }

    /* 优先复用统一的最新MVU取数逻辑，兼容 chat / message / 旧版变量接口 */
    if (typeof fetchLatestMvuData === 'function') {
        try {
            const latestGameData = fetchLatestMvuData(false);
            if (latestGameData && hasContactEntries(latestGameData.羁绊列表)) {
                return latestGameData.羁绊列表;
            }
        } catch (e) {
            console.warn('[手机状态栏] 统一MVU取数获取羁绊列表失败:', e);
        }
    }

    /* 降级：尝试从MVU变量框架获取羁绊列表数据 */
    if (typeof Mvu !== 'undefined' && Mvu.getMvuData) {
        try {
            /* 尝试从最新消息获取，使用extractMvuGameData提取数据 */
            const mvuData = Mvu.getMvuData({ type: 'message', message_id: 'latest' });
            const gameData = extractMvuGameData(mvuData);
            if (gameData && hasContactEntries(gameData.羁绊列表)) {
                return gameData.羁绊列表;
            }
            /* 尝试从chat级别获取 */
            const chatData = Mvu.getMvuData({ type: 'chat' });
            const chatGameData = extractMvuGameData(chatData);
            if (chatGameData && hasContactEntries(chatGameData.羁绊列表)) {
                return chatGameData.羁绊列表;
            }
        } catch (e) {
            console.error('[手机状态栏] MVU获取羁绊列表失败:', e);
        }
    }
    return null;
}

/**
 * 获取联系人的有效键列表
 */
function getRelationshipKeys(collection) {
    if (!collection) return [];
    return Object.keys(collection);
}



//  实时刷新相关变量
let messageEventListener = null;
let lastMessageCount = 0;
let isEventListening = false;
let refreshPollingInterval = null;

// ==================== 边界限制工具函数 ====================
// clamp 函数：将值限制在 min 和 max 之间
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// 获取可靠的视口尺寸（支持 iframe 和各种环境）
function getViewportSize() {
    // 优先使用 visualViewport（更准确，支持缩放）
    if (window.visualViewport) {
        const vv = window.visualViewport;
        if (vv.width > 0 && vv.height > 0) {
            return { width: vv.width, height: vv.height };
        }
    }

    // 回退到 innerWidth/innerHeight
    let w = window.innerWidth || document.documentElement.clientWidth || 0;
    let h = window.innerHeight || document.documentElement.clientHeight || 0;

    // iframe 中尝试父窗口
    if ((w === 0 || h === 0) && window.parent !== window) {
        try {
            const pw = window.parent.innerWidth || window.parent.document.documentElement.clientWidth;
            const ph = window.parent.innerHeight || window.parent.document.documentElement.clientHeight;
            if (pw > 0) w = pw;
            if (ph > 0) h = ph;
        } catch (e) {
            // 跨域无法访问父窗口
        }
    }

    // 最终回退到默认值（避免返回 0）
    return {
        width: w > 0 ? w : 800,
        height: h > 0 ? h : 600
    };
}

// 完全限制在视口内（不允许任何部分超出）
function constrainFullyInViewport(x, y, elementWidth, elementHeight) {
    const viewport = getViewportSize();

    const boundedX = clamp(x, 0, viewport.width - elementWidth);
    const boundedY = clamp(y, 0, viewport.height - elementHeight);

    return { x: boundedX, y: boundedY };
}

// 拖动相关变量
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let btnStartX = 0;
let btnStartY = 0;
let hasMoved = false;

// 手机界面拖动变量
let isPhoneDragging = false;
let phoneDragStartX = 0;
let phoneDragStartY = 0;
let phoneStartX = 0;
let phoneStartY = 0;

// 置顶状态
let isPinned = false;


// 论坛生成状态标记
let isForumGenerating = false;

//  论坛相关函数将在文件末尾"全局函数暴露"区域统一定义

// ==================== 初始化函数 ====================
function initializeMobilePhone() {

    //  论坛设置相关函数（在initializeMobilePhone中重新定义，确保作用域一致）
    window.phoneOpenForumSettings = function () {

        //  注意：返回时会重新生成论坛面板，所以不需要保存导航栈
        // 清空导航栈，确保不会有旧的导航历史干扰
        navigationStack.length = 0;

        const manager = window.phoneForumManager;
        const settings = manager.settings;
        const apiConfig = manager.apiConfig.settings;

        const html = `
            <div style="padding: 12px;">
                <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #2d3748;"> 论坛设置</h3>
                
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 6px; font-size: 12px; color: #4a5568; font-weight: 500;"> 论坛风格</label>
                    <select id="forum-style" style="width: 100%; padding: 8px; background: white; border: 1px solid #cbd5e0; border-radius: 4px; color: #2d3748;">
                        <option value="特图的众神剧场" ${settings.forumStyle === '特图的众神剧场' ? 'selected' : ''}>特图的众神剧场</option>
                        ${settings.customStyles && settings.customStyles.length > 0 ? settings.customStyles.map(style =>
            `<option value="custom:${style.name}" ${settings.forumStyle === `custom:${style.name}` ? 'selected' : ''}>${style.name}</option>`
        ).join('') : ''}
                    </select>
                </div>
                
                <!-- 使用预设和世界书选项 -->
                <div style="margin-bottom: 16px;">
                    <label style="display: flex; align-items: center; cursor: pointer; padding: 10px; background: #f7fafc; border: 1px solid #cbd5e0; border-radius: 4px;">
                        <input type="checkbox" id="use-preset-worldbook" ${settings.usePresetAndWorldBook ? 'checked' : ''} style="margin-right: 8px; width: 16px; height: 16px; cursor: pointer;">
                        <span style="font-size: 12px; color: #2d3748; font-weight: 500;">📚 使用预设和世界书</span>
                    </label>
                    <small style="display: block; margin-top: 4px; padding-left: 24px; font-size: 10px; color: #718096;">
                        启用后将使用酒馆当前预设及世界书；关闭后仅使用聊天历史和自定义提示词
                    </small>
                </div>
                
                <!-- API类型选择 -->
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 6px; font-size: 12px; color: #4a5568; font-weight: 500;"> API类型</label>
                    <select id="forum-api-type" style="width: 100%; padding: 8px; background: white; border: 1px solid #cbd5e0; border-radius: 4px; color: #2d3748;">
                        <option value="sillytavern" ${!apiConfig.enabled && settings.apiType === 'sillytavern' ? 'selected' : ''}>SillyTavern 默认</option>
                        <option value="custom" ${apiConfig.enabled || settings.apiType === 'custom' ? 'selected' : ''}>自定义 API（独立配置）</option>
                    </select>
                </div>
                
                <!-- 自定义 API 配置面板（独立配置） -->
                <div id="custom-api-settings" style="display: ${apiConfig.enabled || settings.apiType === 'custom' ? 'block' : 'none'}; margin-bottom: 16px; padding: 12px; background: #f0f9ff; border: 2px solid #3b82f6; border-radius: 6px;">
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 4px; font-size: 11px; color: #4a5568; font-weight: 500;">API URL (需兼容OpenAI)</label>
                        <input type="text" id="api-url" value="${escapeHtml(apiConfig.apiUrl)}" placeholder="例如: https://api.openai.com/v1" style="width: 100%; padding: 6px; background: white; border: 1px solid #cbd5e0; border-radius: 4px; color: #2d3748; box-sizing: border-box; font-size: 12px;">
                    </div>
                    
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 4px; font-size: 11px; color: #4a5568; font-weight: 500;">API Key</label>
                        <input type="password" id="api-key" value="${escapeHtml(apiConfig.apiKey)}" placeholder="sk-..." style="width: 100%; padding: 6px; background: white; border: 1px solid #cbd5e0; border-radius: 4px; color: #2d3748; box-sizing: border-box; font-size: 12px;">
                    </div>
                    
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 4px; font-size: 11px; color: #4a5568; font-weight: 500;">模型 (Model)</label>
                        <select id="api-model" style="width: 100%; padding: 6px; background: white; border: 1px solid #cbd5e0; border-radius: 4px; color: #2d3748; font-size: 12px;">
                            <option value="">请先获取模型列表...</option>
                        </select>
                        <div style="display: flex; gap: 6px; margin-top: 6px;">
                            <button id="fetch-models-btn" style="flex: 1; padding: 8px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500;">
                                <i class="fas fa-sync-alt"></i> 获取模型
                            </button>
                            <button id="test-connection-btn" style="flex: 1; padding: 8px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500;">
                                <i class="fas fa-check-circle"></i> 测试连接
                            </button>
                        </div>
                    </div>
                    
                    <div id="api-status" style="display: none; margin-top: 8px; padding: 8px; border-radius: 4px; font-size: 11px;"></div>
                    
                    <div style="margin-top: 8px; padding: 8px; background: #e0f2fe; border-radius: 4px; font-size: 10px; color: #0c4a6e;">
                        <strong>💡 提示：</strong>使用自定义 API 将独立调用 LLM
                    </div>
                    
                    <!-- 自动生成论坛配置（仅自定义API可用） -->
                    <div style="margin-top: 12px; padding: 10px; background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px;">
                        <div style="font-size: 12px; font-weight: 600; color: #92400e; margin-bottom: 8px;">
                            <i class="fas fa-magic"></i> 自动生成论坛
                        </div>
                        
                        <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 8px;">
                            <input type="checkbox" id="auto-generate-enabled" ${apiConfig.autoGenerate?.enabled ? 'checked' : ''} style="margin-right: 8px; width: 14px; height: 14px; cursor: pointer;">
                            <span style="font-size: 11px; color: #78350f;">启用自动生成</span>
                        </label>
                        
                        <div style="margin-bottom: 8px;">
                            <label style="display: block; margin-bottom: 4px; font-size: 10px; color: #78350f;">触发阈值（每隔多少楼自动生成）</label>
                            <input type="number" id="auto-generate-threshold" value="${apiConfig.autoGenerate?.threshold || 10}" min="1" max="100" style="width: 100%; padding: 5px; background: white; border: 1px solid #d97706; border-radius: 4px; color: #78350f; box-sizing: border-box; font-size: 11px;">
                        </div>
                        
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="checkbox" id="auto-generate-notification" ${apiConfig.autoGenerate?.showNotification !== false ? 'checked' : ''} style="margin-right: 8px; width: 14px; height: 14px; cursor: pointer;">
                            <span style="font-size: 11px; color: #78350f;">生成时显示弹窗通知</span>
                        </label>
                        
                        <div style="margin-top: 6px; font-size: 9px; color: #a16207;">
                            💡 当聊天消息达到设定楼层数时，将自动生成论坛内容
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button id="manage-custom-styles-btn" style="width: 100%; padding: 10px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; font-size: 14px;">
                         自定义论坛
                    </button>
                    <div style="display: flex; gap: 8px;">
                        <button class="phone-forum-save-settings-btn" style="flex: 1; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">
                            <i class="fas fa-save"></i> 保存
                        </button>
                        <button class="phone-forum-close-settings-btn" style="flex: 1; padding: 10px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">
                            <i class="fas fa-times"></i> 取消
                        </button>
                    </div>
                </div>
            </div>
        `;

        $('#phone-app-title').text(' 论坛设置');
        $('#phone-app-body').html(html);
//  关键！绑定所有按钮事件（在HTML插入后立即绑定）
        setTimeout(() => {
            // 恢复已保存的模型到下拉框
            const savedModel = apiConfig.model;
            if (savedModel) {
                const $modelSelect = $('#api-model');
                // 如果已保存模型，添加到下拉框并选中
                $modelSelect.append($('<option>', {
                    value: savedModel,
                    text: savedModel,
                    selected: true
                }));
            }

            // 绑定API类型切换事件
            $('#forum-api-type').off('change').on('change', function () {
                const isCustom = $(this).val() === 'custom';
                $('#custom-api-settings').toggle(isCustom);
            });

            // 绑定获取模型按钮
            $('#fetch-models-btn').off('click').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                window.phoneFetchModels && window.phoneFetchModels();
            });

            // 绑定测试连接按钮
            $('#test-connection-btn').off('click').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                window.phoneTestConnection && window.phoneTestConnection();
            });

            // 绑定管理自定义风格按钮
            $('#manage-custom-styles-btn').off('click').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                window.phoneManageCustomStyles && window.phoneManageCustomStyles();
            });

            // 绑定保存按钮
            $('.phone-forum-save-settings-btn').off('click').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                window.phoneSaveForumSettings && window.phoneSaveForumSettings();
            });

            // 绑定关闭按钮
            $('.phone-forum-close-settings-btn').off('click').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                window.phoneCloseForumSettings && window.phoneCloseForumSettings();
            });

        }, 0);
    };

    window.phoneSaveForumSettings = function () {

        try {
            const manager = window.phoneForumManager;

            if (!manager) {
                if (typeof toastr !== 'undefined') {
                    toastr.error('管理器未初始化！', '论坛');
                }
                return;
            }

            // 读取所有设置值
            const forumStyle = $('#forum-style').val();
            const apiType = $('#forum-api-type').val();
            const usePresetAndWorldBook = $('#use-preset-worldbook').is(':checked');

            // 保存论坛设置
            manager.settings.forumStyle = forumStyle;
            manager.settings.apiType = apiType;
            manager.settings.usePresetAndWorldBook = usePresetAndWorldBook;
            manager.saveSettings();

            // 保存独立 API 配置（只有选择"自定义API"时才启用）
            manager.apiConfig.settings.enabled = (apiType === 'custom');

            if (apiType === 'custom') {
                //  读取独立API配置（限定在当前显示的phone-app-body内）
                const $currentBody = $('#phone-app-body');
                const selectedModel = $currentBody.find('#api-model').val() || '';

                manager.apiConfig.settings.apiUrl = $currentBody.find('#api-url').val();
                manager.apiConfig.settings.apiKey = $currentBody.find('#api-key').val();
                manager.apiConfig.settings.model = selectedModel;

                // 保存自动生成论坛配置
                manager.apiConfig.settings.autoGenerate = {
                    enabled: $currentBody.find('#auto-generate-enabled').is(':checked'),
                    threshold: parseInt($currentBody.find('#auto-generate-threshold').val()) || 10,
                    showNotification: $currentBody.find('#auto-generate-notification').is(':checked')
                };

                // 如果启用了自动生成，重置计数器
                if (manager.apiConfig.settings.autoGenerate.enabled) {
                    manager.apiConfig.resetAutoGenerateCounter();
                }
            }

            manager.apiConfig.saveSettings();


            if (typeof toastr !== 'undefined') {
                toastr.success('设置已保存！', '论坛');
            }

            //  返回论坛界面 - 重新生成而不是恢复旧HTML，确保事件绑定正确
            setTimeout(() => {

                // 清空导航栈（因为我们要重新生成，不需要旧内容）
                navigationStack.length = 0;

                // 重新生成论坛面板，确保所有事件都正确绑定
                $('#phone-app-title').text(' 论坛');
                $('#phone-app-body').html(generateForumPanel());

            }, 100);
        } catch (error) {
            if (typeof toastr !== 'undefined') {
                toastr.error('保存设置失败: ' + error.message, '论坛');
            }
        }
    };

    window.phoneCloseForumSettings = function () {

        //  重新生成论坛面板而不是恢复旧HTML，确保事件绑定正确
        // 清空导航栈
        navigationStack.length = 0;

        // 重新生成论坛面板
        $('#phone-app-title').text(' 论坛');
        $('#phone-app-body').html(generateForumPanel());

    };

    //  自定义风格管理函数
    window.phoneManageCustomStyles = function () {

        const manager = window.phoneForumManager;
        const customStyles = manager.settings.customStyles || [];

        const html = `
            <div style="padding: 12px;">
                <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #2d3748;"> 自定义风格管理</h3>
                
                <button id="add-custom-style-btn" style="width: 100%; padding: 10px; margin-bottom: 16px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">
                     新建自定义风格
                </button>
                
                <div id="custom-styles-list" style="margin-bottom: 16px;">
                    ${customStyles.length === 0 ?
                '<div style="text-align: center; padding: 20px; color: #718096; font-size: 12px;">暂无自定义风格</div>' :
                customStyles.map((style, index) => `
                            <div class="custom-style-item" data-index="${index}" style="background: white; border: 1px solid #cbd5e0; border-radius: 4px; padding: 10px; margin-bottom: 8px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div style="flex: 1; min-width: 0;">
                                        <div style="font-weight: 500; color: #2d3748; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(style.name)}</div>
                                        <div style="font-size: 11px; color: #718096; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(style.prompt.substring(0, 50))}...</div>
                                    </div>
                                    <div style="display: flex; gap: 6px; margin-left: 10px;">
                                        <button class="edit-custom-style-btn" data-index="${index}" style="padding: 6px 10px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">
                                             编辑
                                        </button>
                                        <button class="delete-custom-style-btn" data-index="${index}" style="padding: 6px 10px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">
                                             删除
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')
            }
                </div>
                
                <button class="phone-back-to-settings-btn" style="width: 100%; padding: 10px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">
                    ← 返回设置
                </button>
            </div>
        `;

        $('#phone-app-title').text(' 自定义风格管理');
        $('#phone-app-body').html(html);

        // 绑定事件
        setTimeout(() => {
            // 新建按钮
            $('#add-custom-style-btn').off('click').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                window.phoneShowCustomStyleEditor && window.phoneShowCustomStyleEditor();
            });

            // 编辑按钮
            $('.edit-custom-style-btn').off('click').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const index = $(this).data('index');
                window.phoneShowCustomStyleEditor && window.phoneShowCustomStyleEditor(index);
            });

            // 删除按钮
            $('.delete-custom-style-btn').off('click').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const index = $(this).data('index');
                if (confirm('确定要删除这个自定义风格吗？')) {
                    window.phoneDeleteCustomStyle && window.phoneDeleteCustomStyle(index);
                }
            });

            // 返回按钮
            $('.phone-back-to-settings-btn').off('click').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                window.phoneOpenForumSettings && window.phoneOpenForumSettings();
            });
        }, 0);
    };

    window.phoneShowCustomStyleEditor = function (editIndex) {

        const manager = window.phoneForumManager;
        const isEdit = editIndex !== undefined;
        const style = isEdit ? manager.settings.customStyles[editIndex] : { name: '', prompt: '' };

        const html = `
            <div style="padding: 12px;">
                <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #2d3748;">${isEdit ? ' 编辑' : ' 新建'}自定义风格</h3>
                
                <div style="margin-bottom: 12px;">
                    <label style="display: block; margin-bottom: 6px; font-size: 12px; color: #4a5568; font-weight: 500;">风格名称</label>
                    <input type="text" id="custom-style-name" value="${escapeHtml(style.name)}" placeholder="例如：小红书" style="width: 100%; padding: 8px; background: white; border: 1px solid #cbd5e0; border-radius: 4px; color: #2d3748; box-sizing: border-box;">
                </div>
                
                <div style="margin-bottom: 12px;">
                    <label style="display: block; margin-bottom: 6px; font-size: 12px; color: #4a5568; font-weight: 500;">风格提示词</label>
                    <textarea id="custom-style-prompt" placeholder="输入论坛风格的详细描述，类似于预设风格的 stylePrompts..." style="width: 100%; min-height: 300px; padding: 8px; background: white; border: 1px solid #cbd5e0; border-radius: 4px; color: #2d3748; box-sizing: border-box; font-family: monospace; font-size: 11px; resize: vertical;">${escapeHtml(style.prompt)}</textarea>
                    <div style="margin-top: 6px; display: flex; justify-content: space-between; align-items: center;">
                        <small style="font-size: 10px; color: #718096;">
                             提示：可以参考预设风格的格式，包括论坛核心设定、角色要求、论坛风格、常见内容类型等
                        </small>
                        <button id="import-example-btn" style="padding: 6px 12px; background: #8b5cf6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 500; white-space: nowrap;">
                             导入示例
                        </button>
                    </div>
                </div>
                
                <div style="display: flex; gap: 8px;">
                    <button id="save-custom-style-btn" data-index="${editIndex !== undefined ? editIndex : ''}" style="flex: 1; padding: 10px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">
                         保存
                    </button>
                    <button class="phone-back-to-manage-btn" style="flex: 1; padding: 10px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">
                        ← 取消
                    </button>
                </div>
            </div>
        `;

        $('#phone-app-title').text(isEdit ? ' 编辑自定义风格' : ' 新建自定义风格');
        $('#phone-app-body').html(html);

        // 绑定事件
        setTimeout(() => {
            // 导入示例按钮
            $('#import-example-btn').off('click').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                window.phoneImportExamplePrompt && window.phoneImportExamplePrompt();
            });
            / 保存按钮
            $('#save-custom-style-btn').off('click').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const index = $(this).data('index');
                window.phoneSaveCustomStyle && window.phoneSaveCustomStyle(index !== '' ? index : undefined);
            });

            // 取消按钮
            $('.phone-back-to-manage-btn').off('click').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                window.phoneManageCustomStyles && window.phoneManageCustomStyles();
            });
        }, 0);
    };

    window.phoneSaveCustomStyle = function (editIndex) {

        const manager = window.phoneForumManager;
        const name = $('#custom-style-name').val().trim();
        const prompt = $('#custom-style-prompt').val().trim();

        // 验证
        if (!name) {
            if (typeof toastr !== 'undefined') {
                toastr.error('请输入风格名称', '论坛');
            }
            return;
        }

        if (!prompt) {
            if (typeof toastr !== 'undefined') {
                toastr.error('请输入风格提示词', '论坛');
            }
            return;
        }

        // 检查名称是否重复（编辑时排除自身）
        const isDuplicate = manager.settings.customStyles.some((style, index) =>
            style.name === name && index !== editIndex
        );

        if (isDuplicate) {
            if (typeof toastr !== 'undefined') {
                toastr.error('风格名称已存在', '论坛');
            }
            return;
        }

        // 保存或更新
        if (editIndex !== undefined) {
            // 编辑现有风格
            manager.settings.customStyles[editIndex] = { name, prompt };
        } else {
            // 新建风格
            if (!manager.settings.customStyles) {
                manager.settings.customStyles = [];
            }
            manager.settings.customStyles.push({ name, prompt });
        }

        manager.saveSettings();

        if (typeof toastr !== 'undefined') {
            toastr.success(editIndex !== undefined ? '风格已更新' : '风格已创建', '论坛');
        }

        // 返回管理页面
        window.phoneManageCustomStyles && window.phoneManageCustomStyles();
    };

    window.phoneImportExamplePrompt = function () {

        const examplePrompt = `## 论坛风格：特图的众神剧场

**核心设定——四方世界的诸神：**
很久很久以前，《秩序》诸神与《混沌》诸神争斗不休，双方筋疲力竭。《宿命》与《偶然》的骰子胜负由此展开——诸神以骰子创造了四方世界与棋子，以冒险决定胜负。当第一位人类战士集结同伴、踏上旅途、讨伐巨龙时，诸神为之狂热。他们立下黄金誓约：不对棋盘进行必要以上的干涉，只在冒险时掷下骰子，尊重棋子的自由意志。

现在这些四方的神明被特图邀请来观看属于迪斯博德和阿拉德世界融合后发生的故事。

**发帖者身份与命名：**
- 特图就叫"特图"，其余神明称号格式要多样化混用：
  - "XX神"：战争神、酒神 / "XX之神"：欺诈之神、风暴之神 / "XX女神"：丰收女神、月之女神
  - 尊称：大地母神、太阳主 / 抽象概念：宿命、偶然、真实 / 其他：织梦者、裁决者、猎手
- 同一位神明可以反复出现，特图不需要每帖都在

**神明说话的质感（极其重要）：**
- 参考原文语感："冒险！冒险！还是冒险！没有什么语言能形容这种美好的感觉！"——有激情有史诗感，但不装腔作势
- 禁止古风中二腔："吾见证了……""力量即是正义""吾等领域的权柄"——比口语化更糟糕
- 也不要网络口语："哇好帅啊！""馋死我了"
- 正确方向：自然、有力、带着真实情感。回复之间要有对话感，有反驳有补充有跑题

**内容格调（极其重要）：**
- 关注冒险、战斗、命运转折、英雄崛起陨落、势力博弈——宏大叙事，不要日常琐事
- "宏大"不等于"严肃"，讨论应该热烈、有趣、充满激情，不是老学究写论文

**帖子内容来源：**
- 最多一半与玩家当前剧情有关
- 至少一半是棋盘上其他地方的故事（羁绊角色、DNF原作人物、游戏人生原作人物等）

**论坛氛围：**
- 要有娱乐性和可读性，不要写成设定集
- 帖子之间可以有关联，有的热闹有的冷清
- 不要每个帖子都在强调骰子、棋盘等设定元素`;

        // 将示例提示词填充到编辑框
        $('#custom-style-prompt').val(examplePrompt);

        if (typeof toastr !== 'undefined') {
            toastr.success('已导入特图的众神剧场示例', '论坛');
        }
    };

    window.phoneDeleteCustomStyle = function (index) {

        const manager = window.phoneForumManager;
        const deletedStyle = manager.settings.customStyles[index];

        // 如果当前选择的就是要删除的风格，则切换到默认风格
        if (manager.settings.forumStyle === `custom:${deletedStyle.name}`) {
            manager.settings.forumStyle = '特图的众神剧场';
        }

        // 删除风格
        manager.settings.customStyles.splice(index, 1);
        manager.saveSettings();

        if (typeof toastr !== 'undefined') {
            toastr.success('风格已删除', '论坛');
        }

        // 刷新管理页面
        window.phoneManageCustomStyles && window.phoneManageCustomStyles();
    };

    // 🔧 API 配置辅助函数已移除，使用phoneFetchModels替代

    window.phoneShowAPIStatus = function (message, type = 'info') {
        const statusDiv = $('#api-status');
        if (!statusDiv.length) return;

        const colors = {
            info: '#3b82f6',
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b'
        };

        const bgColors = {
            info: '#eff6ff',
            success: '#f0fdf4',
            error: '#fef2f2',
            warning: '#fffbeb'
        };

        statusDiv.css({
            'display': 'block',
            'color': colors[type] || colors.info,
            'background': bgColors[type] || bgColors.info,
            'border': `1px solid ${colors[type] || colors.info}`
        });
        statusDiv.text(message);

        // 自动隐藏成功消息
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.fadeOut();
            }, 3000);
        }
    };

    // 获取可用模型列表
    window.phoneFetchModels = async function () {
        const $currentBody = $('#phone-app-body');
        const apiUrl = $currentBody.find('#api-url').val().trim();
        const apiKey = $currentBody.find('#api-key').val().trim();
        const modelSelect = $currentBody.find('#api-model')[0];
        const buttonElement = $currentBody.find('#fetch-models-btn')[0];

        if (!apiUrl) {
            window.phoneShowAPIStatus('⚠️ 请先填写 API URL！', 'warning');
            return;
        }

        const originalBtnHTML = buttonElement.innerHTML;
        buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在获取...';
        buttonElement.disabled = true;

        try {
            let cleanedApiUrl = apiUrl.replace(/\/$/, '');
            if (!cleanedApiUrl.endsWith('/v1')) {
                cleanedApiUrl += '/v1';
            }

            let fetchUrl = cleanedApiUrl.endsWith('/models') ? cleanedApiUrl : `${cleanedApiUrl}/models`;

            const headers = {};
            if (apiKey) {
                headers['Authorization'] = `Bearer ${apiKey}`;
            }

            const fetchOptions = {
                method: 'GET',
                headers: headers
            };

            const response = await fetch(fetchUrl, fetchOptions);
            if (!response.ok) {
                const errorText = await response.text();
                let errorDetail = '请求失败';
                try {
                    const errorJson = JSON.parse(errorText);
                    errorDetail = errorJson.error?.message || errorText;
                } catch (e) {
                    errorDetail = errorText;
                }
                throw new Error(`HTTP ${response.status}: ${errorDetail}`);
            }

            const responseText = await response.text();
            let data;
            try {
                data = responseText ? JSON.parse(responseText) : [];
            } catch (e) {
                throw new Error('API响应不是有效的JSON格式。');
            }

            let models = [];
            if (data && data.models && Array.isArray(data.models)) {
                models = data.models.map(model => model.name).filter(Boolean);
            } else if (data && data.data && Array.isArray(data.data)) {
                models = data.data.map(model => model.id).filter(Boolean);
            } else if (Array.isArray(data)) {
                models = data.map(model => (typeof model === 'string' ? model : model.id)).filter(Boolean);
            }

            modelSelect.innerHTML = '';
            if (models.length > 0) {
                models.sort();
                models.forEach(modelId => {
                    const option = document.createElement('option');
                    option.value = modelId;
                    option.textContent = modelId;
                    modelSelect.appendChild(option);
                });
                modelSelect.selectedIndex = 0;

                window.phoneShowAPIStatus(`✅ 成功获取 ${models.length} 个模型！`, 'success');
            } else {
                modelSelect.innerHTML = '<option disabled>未获取到模型</option>';
                window.phoneShowAPIStatus('⚠️ API返回成功，但模型列表为空或格式无法识别。', 'warning');
            }

        } catch (error) {
            console.error('获取模型失败:', error);
            modelSelect.innerHTML = '<option>获取失败</option>';
            window.phoneShowAPIStatus(`❌ 获取模型失败: ${error.message}`, 'error');
        } finally {
            buttonElement.innerHTML = originalBtnHTML;
            buttonElement.disabled = false;
        }
    };

    window.phoneTestConnection = async function () {
        const manager = window.phoneForumManager;
        const $currentBody = $('#phone-app-body');

        const apiUrl = $currentBody.find('#api-url').val();
        const apiKey = $currentBody.find('#api-key').val();
        const model = $currentBody.find('#api-model').val() || '';

        if (!apiUrl) {
            window.phoneShowAPIStatus('⚠️ 请先填写 API 地址', 'warning');
            return;
        }

        if (!apiKey) {
            window.phoneShowAPIStatus('⚠️ 请先填写 API 密钥', 'warning');
            return;
        }

        if (!model) {
            window.phoneShowAPIStatus('⚠️ 请先选择模型', 'warning');
            return;
        }

        window.phoneShowAPIStatus('🔄 正在测试连接...', 'info');

        try {
            const result = await manager.apiConfig.testConnection(apiUrl, apiKey, model);

            if (result.success) {
                window.phoneShowAPIStatus('✅ 连接测试成功！', 'success');
            } else {
                window.phoneShowAPIStatus(`❌ 连接测试失败: ${result.error}`, 'error');
            }
        } catch (error) {
            window.phoneShowAPIStatus(`❌ 连接测试失败: ${error.message}`, 'error');
        }
    };

    // 创建事件处理函数（可被多个地方复用）
    window.handlePhoneLiveButtonClick = function (e) {
        const target = e.target;

        // 安全检查
        if (!target || !target.classList) {
            return;
        }

        const classList = target.classList;
        const classArray = Array.from(classList);

        // 检查论坛按钮
        if (classArray.includes('phone-forum-generate-btn')) {
            e.preventDefault();
            e.stopPropagation();
            window.phoneGenerateForum && window.phoneGenerateForum();
            return;
        }

        if (classArray.includes('phone-forum-settings-btn')) {
            e.preventDefault();
            e.stopPropagation();
            window.phoneOpenForumSettings && window.phoneOpenForumSettings();
            return;
        }

        if (classArray.includes('phone-forum-save-settings-btn')) {
            e.preventDefault();
            e.stopPropagation();
            window.phoneSaveForumSettings && window.phoneSaveForumSettings();
            return;
        }

        if (classArray.includes('phone-forum-close-settings-btn')) {
            e.preventDefault();
            e.stopPropagation();
            window.phoneCloseForumSettings && window.phoneCloseForumSettings();
            return;
        }

        // 如果点击的是按钮内的图标、文字或 DIV，向上查找按钮
        if ((target.tagName === 'I' || target.tagName === 'SPAN' || target.tagName === 'DIV') && target.parentElement) {
            const parentClasses = Array.from(target.parentElement.classList || []);

            if (parentClasses.includes('phone-forum-generate-btn')) {
                e.preventDefault();
                e.stopPropagation();
                window.phoneGenerateForum && window.phoneGenerateForum();
                return;
            }

            if (parentClasses.includes('phone-forum-settings-btn')) {
                e.preventDefault();
                e.stopPropagation();
                window.phoneOpenForumSettings && window.phoneOpenForumSettings();
                return;
            }

            if (parentClasses.includes('phone-forum-save-settings-btn')) {
                e.preventDefault();
                e.stopPropagation();
                window.phoneSaveForumSettings && window.phoneSaveForumSettings();
                return;
            }

            if (parentClasses.includes('phone-forum-close-settings-btn')) {
                e.preventDefault();
                e.stopPropagation();
                window.phoneCloseForumSettings && window.phoneCloseForumSettings();
                return;
            }

        }
    };

    try {
        // 在主文档上监听（用于论坛按钮的捕获阶段处理）
        document.addEventListener('click', window.handlePhoneLiveButtonClick, true);

        // 清理旧元素
        $('#mobile-trigger-btn').remove();
        $('#mobile-phone-overlay').remove();
        $('#mobile-phone-styles').remove();

        // 加载 Font Awesome（安全方式，不会触发SillyTavern的检测）
        loadFontAwesome();

        // 注入样式
        $('head').append(phoneStyles);

        // 创建触发按钮 - Brushed Metal风格（复刻状态栏悬浮球）
        // 生成八角星路径 - 复用状态栏.js的AppleStyle-Star算法
        function getOctagramPath(R, rotationOffsetDeg) {
            rotationOffsetDeg = rotationOffsetDeg || 0;
            var d = "M ";
            var N = 8;
            var K = 3;
            var offsetRad = rotationOffsetDeg * Math.PI / 180;
            var cx = 50;
            var cy = 50;
            for (var i = 0; i <= N; i++) {
                var idx = (i * K) % N;
                var angle = (idx * 2 * Math.PI / N) - Math.PI / 2 + offsetRad;
                var x = cx + Math.cos(angle) * R;
                var y = cy + Math.sin(angle) * R;
                if (i === 0) d += x.toFixed(2) + "," + y.toFixed(2) + " ";
                else d += "L " + x.toFixed(2) + "," + y.toFixed(2) + " ";
            }
            d += "Z";
            return d;
        }
        const pathData1 = getOctagramPath(35, 0);
        const pathData2 = getOctagramPath(35, 22.5);

        const triggerBtn = $('<button>', {
            id: 'mobile-trigger-btn',
            title: '打开手机'
        });
        triggerBtn.html(`
            <div class="star-container">
                <svg class="icon-svg" viewBox="0 0 100 100" style="overflow:visible !important;display:block !important;visibility:visible !important;">
                    <path d="${pathData1}" style="fill:none !important;stroke:#666 !important;stroke-width:2 !important;opacity:0.7 !important;stroke-linecap:round !important;stroke-linejoin:round !important;visibility:visible !important;"></path>
                    <path d="${pathData2}" style="fill:none !important;stroke:#666 !important;stroke-width:2 !important;opacity:0.7 !important;stroke-linecap:round !important;stroke-linejoin:round !important;visibility:visible !important;"></path>
                    <path class="layer-2" d="${pathData2}" style="fill:none !important;stroke:#999 !important;stroke-width:1.5 !important;opacity:1 !important;stroke-linecap:round !important;stroke-linejoin:round !important;visibility:visible !important;stroke-dasharray:100 400;"></path>
                    <path class="layer-1" d="${pathData1}" style="fill:none !important;stroke:#555 !important;stroke-width:2 !important;opacity:0.8 !important;stroke-linecap:round !important;stroke-linejoin:round !important;visibility:visible !important;stroke-dasharray:100 400;"></path>
                    <circle cx="50" cy="50" r="12" style="fill:none !important;stroke:#777 !important;stroke-width:1.5 !important;visibility:visible !important;"></circle>
                </svg>
            </div>
        `);
         // 创建手机界面
        const phoneOverlay = $('<div>', {
            id: 'mobile-phone-overlay',
            html: `
                <div class="mobile-phone-frame">
                    <div class="mobile-phone-screen">
                        <!-- 状态栏 -->
                        <div class="mobile-status-bar">
                            <div class="status-left">
                                <span style="display: flex; align-items: center; gap: 4px; color: #666; font-size: 12px; font-weight: 500;">
                                    <i class="fas fa-cloud" id="phone-status-weather-icon" style="font-size: 12px;"></i>
                                    <span id="phone-status-weather">多云</span>
                                </span>
                            </div>
                            <div class="status-center" id="phone-drag-handle" style="cursor: move; flex: 1; display: flex; justify-content: center; align-items: center; position: absolute; left: 50%; transform: translateX(-50%);" title="拖动手机界面">
                                <span class="time" style="color: #666; font-size: 12px; font-weight: 500;" id="phone-status-time">14:30</span>
                            </div>
                            <div class="status-right">
                                <span class="battery">
                                    <i class="fas fa-battery-full"></i>
                                    <span class="battery-text">100%</span>
                                </span>
                                <button id="phone-pin-btn" class="pin-btn" title="置顶/取消置顶">
                                    <i class="fas fa-thumbtack"></i>
                                </button>
                            </div>
                        </div>

                        <!-- 主内容区域 -->
                        <div class="mobile-content">
                            <!-- 主界面 -->
                            <div class="home-screen" id="phone-home-screen">
                                <!-- 时间天气卡片 -->
                                <div class="weather-card">
                                    <div class="weather-time">
                                        <span class="current-time" id="phone-big-time">14:30</span>
                                        <span class="current-date" id="phone-date">11/09</span>
                                    </div>
                                    <div class="weather-info">
                                        <i class="fas fa-cloud" style="font-size: 16px; color: #585858;"></i>
                                        <span class="weather-desc" id="phone-weather">多云</span>
                                    </div>
                                </div>

                                <!-- 应用页面容器 -->
                                <div class="app-pages-container">
                                    <!-- 滑动包装器 -->
                                    <div class="app-pages-wrapper" id="app-pages-wrapper">
                                        <!-- 第一页 -->
                                        <div class="app-page">
                                            <div class="app-grid">
                                                <!-- 第一行：信息，CG收集，论坛 -->
                                                <div class="app-row">
                                                    <div class="app-icon" data-app="messages">
                                                        <div class="app-icon-bg md-blue">
                                                            <i class="fas fa-comments"></i>
                                                        </div>
                                                        <span class="app-label">信息</span>
                                                    </div>
                                                    <div class="app-icon" data-app="gallery">
                                                        <div class="app-icon-bg md-green">
                                                            <i class="fas fa-images"></i>
                                                        </div>
                                                        <span class="app-label">CG收集</span>
                                                    </div>
                                                    <div class="app-icon" data-app="forum">
                                                        <div class="app-icon-bg md-purple">
                                                            <i class="fas fa-comments"></i>
                                                        </div>
                                                        <span class="app-label">论坛</span>
                                                    </div>
                                                </div>
                                                <!-- 第二行：羁绊，壁纸，设置 -->
                                                <div class="app-row">
                                                    <div class="app-icon" data-app="friends">
                                                        <div class="app-icon-bg md-pink">
                                                            <i class="fas fa-user-friends"></i>
                                                        </div>
                                                        <span class="app-label">羁绊</span>
                                                    </div>
                                                    <div class="app-icon" data-app="wallpaper">
                                                        <div class="app-icon-bg md-pink">
                                                            <i class="fas fa-image"></i>
                                                        </div>
                                                        <span class="app-label">壁纸</span>
                                                    </div>
                                                    <div class="app-icon" data-app="settings">
                                                        <div class="app-icon-bg md-blue">
                                                            <i class="fas fa-cog"></i>
                                                        </div>
                                                        <span class="app-label">设置</span>
                                                    </div>
                                                </div>
                                                <!-- 第三行：世界书管理（左对齐，占位补满整行） -->
                                                <div class="app-row">
                                                    <div class="app-icon" data-app="worldbook">
                                                        <div class="app-icon-bg md-teal">
                                                            <i class="fas fa-book-open"></i>
                                                        </div>
                                                        <span class="app-label">世界书</span>
                                                    </div>
                                                    <div class="app-icon" style="visibility:hidden;pointer-events:none;" aria-hidden="true"></div>
                                                    <div class="app-icon" style="visibility:hidden;pointer-events:none;" aria-hidden="true"></div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- 第二页（已去除重复入口） -->
                                    </div>
                                    
                                    <!-- 页面指示器 -->
                                    <div class="page-indicators" id="page-indicators">
                                        <div class="indicator active"></div>
                                    </div>
                                </div>
                                
                                <!-- 全屏按钮 -->
                                <button id="wallpaper-fullscreen-btn" class="wallpaper-fullscreen-btn" title="查看壁纸大图">
                                    <i class="fas fa-expand"></i>
                                </button>
                            </div>

                            <!-- 应用详情面板 -->
                            <div class="app-detail-panel" id="phone-detail-panel">
                                <div class="app-header">
                                    <button class="back-button" id="phone-back-btn">
                                        <i class="fas fa-chevron-left"></i>
                                    </button>
                                    <span class="app-title" id="phone-app-title">应用</span>
                                    <div style="width: 36px;"></div>
                                </div>
                                <div class="app-body" id="phone-app-body">
                                    <!-- 应用内容将在这里动态加载 -->
                                </div>
                            </div>

                            <!-- 聊天面板 -->
                            <div class="chat-panel" id="phone-chat-panel">
                                <div class="chat-header">
                                    <button class="back-button" id="chat-back-btn">
                                        <i class="fas fa-chevron-left"></i>
                                    </button>
                                    <span class="app-title" id="chat-title" style="flex: 1;">聊天</span>
                                    <div id="chat-right-actions" style="width: 36px; flex-shrink: 0;"></div>
                                </div>
                                <div class="chat-messages" id="chat-messages">
                                </div>
                                <div class="chat-input-area">
                                    <input type="text" class="chat-input" id="chat-input" placeholder="输入消息...">
                                    <button class="chat-send-btn" id="chat-send-btn">
                                        <i class="fas fa-paper-plane"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <
            `
        });

        $('body').append(triggerBtn);
        $('body').append(phoneOverlay);

        // 延迟绑定事件，确保 DOM 完全就绪
        setTimeout(() => {
            bindPhoneEvents();
        }, 0);

        // 注册MVU事件监听
        registerMvuEventListeners();



        // 更新时间
        updatePhoneTime();
        setInterval(updatePhoneTime, 60000);

        //  每次初始化时重置悬浮球位置到初始位置
        localStorage.removeItem('mobile-trigger-btn-position');
        localStorage.removeItem('mobile-trigger-btn-user-dragged');

        //  主动调用位置重置，确保在正确的初始位置
        // 桌面端：离右边三分之一距离的垂直中央
        // 移动端：右边垂直居中
        setTimeout(() => {
            window.resetMobileButtonPosition && window.resetMobileButtonPosition();
        }, 100);

        // 恢复保存的壁纸和手机尺寸
        setTimeout(() => {
            restoreWallpaper();
            restorePhoneSize();
        }, 200);

        // 标记全局变量供依赖检测（挂到父窗口，跨iframe可见）
        try { (window.parent || window).__小手机脚本_loaded__ = true; } catch(e) { window.__小手机脚本_loaded__ = true; }

    } catch (error) {
        if (typeof toastr !== 'undefined') {
            toastr.error('手机界面初始化失败：' + error.message);
        }
    }
}

// ==================== 事件绑定 ====================
function bindPhoneEvents() {

    // 触发按钮点击和拖动
    const $triggerBtn = $('#mobile-trigger-btn');

    // 使用 Pointer Events 统一处理拖拽和点击（参考状态栏.js）
    const btnElement = $triggerBtn[0];
    let isDrag = false;
    let pStartX = 0, pStartY = 0, pStartLeft = 0, pStartTop = 0;

    const onPointerMove = function (e) {
        if (!isDrag) return;
        e.cancelable && e.preventDefault();
        const dx = e.screenX - pStartX;
        const dy = e.screenY - pStartY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            $triggerBtn.addClass('dragging');
        }
        if ($triggerBtn.hasClass('dragging')) {
            hasMoved = true;
            // 移除响应式定位类，切换到绝对定位
            $triggerBtn.removeClass('mobile-mode tablet-mode desktop-mode');

            let newX = pStartLeft + dx;
            let newY = pStartTop + dy;
            const btnWidth = $triggerBtn.outerWidth() || 60;
            const btnHeight = $triggerBtn.outerHeight() || 60;
            const bounded = constrainFullyInViewport(newX, newY, btnWidth, btnHeight);

            btnElement.style.setProperty('left', bounded.x + 'px', 'important');
            btnElement.style.setProperty('top', bounded.y + 'px', 'important');
            btnElement.style.setProperty('right', 'auto', 'important');
            btnElement.style.setProperty('bottom', 'auto', 'important');
            btnElement.style.setProperty('transform', 'none', 'important');
        }
    };

    const onPointerUp = function (e) {
        const win = btnElement.ownerDocument.defaultView || window;
        win.removeEventListener('pointermove', onPointerMove);
        win.removeEventListener('pointerup', onPointerUp);
        win.removeEventListener('pointercancel', onPointerUp);
        if (btnElement.releasePointerCapture) {
            try { btnElement.releasePointerCapture(e.pointerId); } catch (err) { }
        }

        if ($triggerBtn.hasClass('dragging')) {
            // 拖拽结束，保存位置
            const rect = btnElement.getBoundingClientRect();
            try {
                const position = { left: rect.left, top: rect.top };
                localStorage.setItem('mobile-trigger-btn-position', JSON.stringify(position));
                localStorage.setItem('mobile-trigger-btn-user-dragged', 'true');
            } catch (err) { }
            setTimeout(() => {
                $triggerBtn.removeClass('dragging');
                hasMoved = false;
            }, 50);
        } else if (e.type === 'pointerup') {
            // 没有拖拽，视为点击
            const $overlay = $('#mobile-phone-overlay');
            if ($overlay.hasClass('active')) {
                closeMobilePhone();
            } else {
                openMobilePhone();
            }
        }
        isDrag = false;
    };

    btnElement.addEventListener('pointerdown', function (e) {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        e.cancelable && e.preventDefault();
        e.stopPropagation();
        isDrag = true;
        hasMoved = false;
        pStartX = e.screenX;
        pStartY = e.screenY;
        const rect = btnElement.getBoundingClientRect();
        pStartLeft = rect.left;
        pStartTop = rect.top;
        if (btnElement.setPointerCapture) {
            try { btnElement.setPointerCapture(e.pointerId); } catch (err) { }
        }
        const win = btnElement.ownerDocument.defaultView || window;
        win.addEventListener('pointermove', onPointerMove);
        win.addEventListener('pointerup', onPointerUp);
        win.addEventListener('pointercancel', onPointerUp);
    });

    btnElement.addEventListener('touchstart', function (e) { e.preventDefault(); }, { passive: false });

    // 点击遮罩关闭（仅在未置顶时）
    $('#mobile-phone-overlay').on('click', function (e) {
        // 如果正在拖动页面或刚完成拖动，不关闭手机
        if (pageSwipe && (pageSwipe.isDragging || pageSwipe.justFinishedDragging)) {
            return;
        }
        if ($(e.target).attr('id') === 'mobile-phone-overlay' && !isPinned) {
            closeMobilePhone();
        }
    });

    // 置顶按钮点击
    $('#phone-pin-btn').on('click', function (e) {
        e.stopPropagation();
        togglePin();
    });

    // 全屏壁纸按钮点击
    $('#wallpaper-fullscreen-btn').on('click', function (e) {
        e.stopPropagation();
        openWallpaperFullscreen();
    });

   

    // 手机界面拖动功能
    initPhoneDrag();

    //  修复：应用图标点击改为事件委托，避免DOM更新后事件失效
    // 使用事件委托到 body，这样即使DOM更新也不会丢失事件
    $('body').off('click.appIcon').on('click.appIcon', '.app-icon[data-app], .app-icon[data-app] *', function (e) {
        e.stopPropagation();

        //  关键修复：使用closest查找最近的.app-icon元素（处理点击子元素的情况）
        const $appIcon = $(this).closest('.app-icon[data-app]');

        if ($appIcon.length === 0) {
            return; // 不是应用图标或其子元素
        }

        const appName = $appIcon.attr('data-app');

        if (appName) {
            openAppPanel(appName);
        } else {
        }
    });

    // 返回按钮
    $('#phone-back-btn').on('click', function () {
        closeAppPanel();
    });

  

    // 论坛按钮点击（使用jQuery事件委托，和好友一样的方式）
    $(document).on('click', '.phone-forum-generate-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        window.phoneGenerateForum && window.phoneGenerateForum();
    });

    $(document).on('click', '.phone-forum-settings-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        window.phoneOpenForumSettings && window.phoneOpenForumSettings();
    });

    $(document).on('click', '.phone-forum-save-settings-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        window.phoneSaveForumSettings && window.phoneSaveForumSettings();
    });

    $(document).on('click', '.phone-forum-close-settings-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        window.phoneCloseForumSettings && window.phoneCloseForumSettings();
    });
