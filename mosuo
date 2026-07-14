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
