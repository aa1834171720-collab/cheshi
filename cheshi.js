// =====================================================================
// 索托斯星空魔法书 - 终极悬浮响应版 (Sotos Starry Sky Floating UI)
// =====================================================================

const SOTOS_UI_ID = 'sotos-magic-ui-wrapper';
const SOTOS_TRIGGER_ID = 'sotos-trigger-btn';

// 全局状态管理寄存器
let sotosCurrentPanel = 'sec-state';
let isSotosGeneratingData = false;

// 物理引擎状态机
let sotosIsDragging = false;
let sotosDragStartX = 0, sotosDragStartY = 0;
let sotosBtnStartLeft = 0, sotosBtnStartTop = 0;
let sotosHasMoved = false;

// 1. 样式系统注入与视觉映射重构
function injectSotosStyles() {
    // 移除潜在的旧样式以防止热重载冲突
    $('#sotos-custom-styles').remove();
    const styles = `
    <style id="sotos-custom-styles">
    /* ================= 触发器：星空法球 ================= */
    #${SOTOS_TRIGGER_ID} {
        position: fixed;
        top: 50%;
        right: 25px;
        transform: translateY(-50%);
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0a0b14 0%, #2a1b4d 50%, #0a0b14 100%);
        border: 2px solid rgba(138, 107, 191, 0.6);
        color: #c0a8e6;
        font-size: 26px;
        cursor: move;
        z-index: 10000;
        box-shadow: 0 0 25px rgba(0, 0, 0, 0.9), inset 0 0 15px rgba(138, 107, 191, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        touch-action: none;
        transition: box-shadow 0.4s ease, border-color 0.4s ease, transform 0.2s;
        text-shadow: 0 0 10px rgba(192, 168, 230, 0.8);
    }
    #${SOTOS_TRIGGER_ID}:hover {
        box-shadow: 0 0 35px rgba(138, 107, 191, 0.9), inset 0 0 20px rgba(192, 168, 230, 0.6);
        border-color: rgba(192, 168, 230, 1);
        transform: translateY(-50%) scale(1.05);
    }
    #${SOTOS_TRIGGER_ID}.dragging {
        transition: none!important;
        transform: none!important;
        cursor: grabbing;
    }

    /* ================= 魔法书主界面遮罩与容器 ================= */
    #${SOTOS_UI_ID} {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(2, 3, 7, 0.75);
        backdrop-filter: blur(8px);
        z-index: 9999;
        display: none;
        align-items: center;
        justify-content: center;
        animation: sotosOverlayFadeIn 0.35s ease;
    }
    #${SOTOS_UI_ID}.active {
        display: flex;
    }

   .sotos-main-panel {
        width: 92%;
        max-width: 980px;
        height: 85vh;
        max-height: 800px;
        background: 
            radial-gradient(ellipse at top right, rgba(94, 43, 151, 0.18) 0%, transparent 55%),
            radial-gradient(ellipse at bottom left, rgba(17, 34, 104, 0.25) 0%, transparent 55%),
            linear-gradient(180deg, #05060a 0%, #0c0e1a 100%);
        border: 1px solid rgba(103, 86, 140, 0.6);
        border-top: 2px solid rgba(156, 136, 196, 0.8);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 25px 60px rgba(0,0,0,0.95), inset 0 0 40px rgba(0,0,0,0.8);
        font-family: "Microsoft YaHei", "Noto Serif SC", serif;
        color: #d1d5db;
        overflow: hidden;
        position: relative;
    }

    /* ================= 顶部星象导航栏 ================= */
   .sotos-nav {
        display: flex;
        background: rgba(8, 10, 18, 0.85);
        backdrop-filter: blur(4px);
        border-bottom: 1px solid rgba(103, 86, 140, 0.4);
        flex-shrink: 0;
    }
   .sotos-nav-item {
        flex: 1;
        padding: 16px 0;
        text-align: center;
        cursor: pointer;
        font-weight: bold;
        color: #6a7185;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-right: 1px solid rgba(103, 86, 140, 0.15);
        font-size: 14px;
        letter-spacing: 1px;
        position: relative;
    }
   .sotos-nav-item:last-child { border-right: none; }
   .sotos-nav-item:hover { color: #9ba4bc; background: rgba(255, 255, 255, 0.04); }
   .sotos-nav-item.active {
        color: #d1c4e9;
        background: linear-gradient(180deg, rgba(103, 86, 140, 0.2) 0%, transparent 100%);
        text-shadow: 0 0 12px rgba(209, 196, 233, 0.8);
    }
   .sotos-nav-item.active::after {
        content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px;
        background: linear-gradient(90deg, transparent, #b39ddb, transparent);
        box-shadow: 0 -2px 10px #b39ddb;
    }

    /* ================= 内容区与滚动条 ================= */
   .sotos-content {
        padding: 28px;
        overflow-y: auto;
        flex: 1;
        position: relative;
    }
   .sotos-content::-webkit-scrollbar { width: 6px; }
   .sotos-content::-webkit-scrollbar-thumb { background: rgba(103, 86, 140, 0.7); border-radius: 3px; }
   .sotos-content::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.5); }

   .sotos-section {
        display: none;
        animation: sotosSectionFadeIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
   .sotos-section.active { display: block; }

    @keyframes sotosOverlayFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes sotosSectionFadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

    /* ================= 标题与网格系统 ================= */
   .sotos-title {
        font-size: 16px; font-weight: bold; color: #d1c4e9;
        border-bottom: 1px solid rgba(103, 86, 140, 0.3);
        padding-bottom: 8px; margin-bottom: 20px; margin-top: 10px;
        text-shadow: 0 0 12px rgba(209, 196, 233, 0.5);
        display: flex; align-items: center; justify-content: space-between;
    }
   .sotos-title::before {
        content: '✧'; color: #8e76ba; margin-right: 10px; font-size: 14px; text-shadow: 0 0 8px #8e76ba;
    }
    
   .sotos-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 28px; }
   .sotos-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 28px; }

   .sotos-stat-box {
        background: linear-gradient(135deg, rgba(22, 24, 38, 0.75) 0%, rgba(13, 14, 25, 0.95) 100%);
        border: 1px solid rgba(86, 92, 122, 0.35);
        border-top: 1px solid rgba(136, 142, 176, 0.6);
        padding: 16px; border-radius: 10px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.6), inset 0 1px 10px rgba(255,255,255,0.04);
        transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s, border-color 0.25s;
    }
   .sotos-stat-box:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.8), inset 0 1px 15px rgba(179, 157, 219, 0.15);
        border-color: rgba(179, 157, 219, 0.6);
    }
   .sotos-stat-label { font-size: 12px; color: #7b849c; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold;}
   .sotos-stat-value { font-size: 18px; font-weight: bold; color: #e2e8f0; text-shadow: 0 0 10px rgba(226, 232, 240, 0.4); }

    /* 数值色彩高亮映射 */
   .val-hp { color: #ef9a9a; text-shadow: 0 0 12px rgba(239, 154, 154, 0.6); }
   .val-mp { color: #90caf9; text-shadow: 0 0 12px rgba(144, 202, 249, 0.6); }
   .val-san { color: #b39ddb; text-shadow: 0 0 12px rgba(179, 157, 219, 0.6); }
   .val-score { color: #ffd54f; text-shadow: 0 0 12px rgba(255, 213, 79, 0.6); }

    /* ================= 列表与交互按钮 ================= */
   .sotos-list-item {
        background: linear-gradient(90deg, rgba(30, 25, 45, 0.65) 0%, rgba(15, 18, 30, 0.45) 100%);
        border: 1px solid rgba(86, 92, 122, 0.25); border-left: 4px solid #8e76ba;
        padding: 16px; margin-bottom: 14px; border-radius: 4px 10px 10px 4px; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        transition: background 0.3s;
    }
   .sotos-list-item:hover { background: linear-gradient(90deg, rgba(40, 35, 60, 0.75) 0%, rgba(20, 24, 40, 0.55) 100%); }
   .sotos-item-name { font-weight: bold; color: #e2d4f5; margin-bottom: 8px; font-size: 14px; display: flex; align-items: center; gap: 8px; text-shadow: 0 0 6px rgba(226, 212, 245, 0.4); }
   .sotos-item-desc { font-size: 13px; color: #94a3b8; line-height: 1.6; }
    
   .skill-item { border-left-color: #64b5f6; }.skill-item.sotos-item-name { color: #bbdefb; }
   .magic-item { border-left-color: #ba68c8; }.magic-item.sotos-item-name { color: #e1bee7; }

    /* 无头推断操作按钮 */
   .sotos-action-btn {
        padding: 6px 16px;
        background: rgba(103, 86, 140, 0.25);
        border: 1px solid rgba(138, 107, 191, 0.5);
        color: #e2d4f5; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold;
        transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
   .sotos-action-btn:hover:not(:disabled) { 
        background: rgba(138, 107, 191, 0.6); color: #fff; 
        box-shadow: 0 0 15px rgba(138,107,191,0.6), inset 0 0 8px rgba(255,255,255,0.2); 
    }
   .sotos-action-btn:disabled { opacity: 0.5; cursor: not-allowed; background: #333; border-color: #555; }
    
   .sotos-buy-btn {
        background: rgba(239, 83, 80, 0.15); border-color: rgba(239, 83, 80, 0.4); color: #ef9a9a; margin-left: 12px;
    }
   .sotos-buy-btn:hover:not(:disabled) { background: rgba(239, 83, 80, 0.4); color: #fff; box-shadow: 0 0 15px rgba(239, 83, 80, 0.4); }

    /* ================= 论坛与商城组件 ================= */
   .sotos-post {
        background: linear-gradient(135deg, rgba(22, 24, 38, 0.85) 0%, rgba(13, 14, 25, 0.95) 100%);
        border: 1px solid rgba(86, 92, 122, 0.45);
        border-top: 1px solid rgba(136, 142, 176, 0.65);
        padding: 20px; border-radius: 12px; margin-bottom: 20px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.6);
    }
   .sotos-post-header { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px; }
   .sotos-post-author { color: #90caf9; font-weight: bold; text-shadow: 0 0 8px rgba(144, 202, 249, 0.4); }
   .sotos-post-title { font-size: 17px; font-weight: bold; color: #f8fafc; margin-bottom: 12px; letter-spacing: 0.5px; }
   .sotos-post-content { font-size: 14px; color: #cbd5e1; line-height: 1.7; margin-bottom: 16px; }
   .sotos-post-footer { display: flex; gap: 20px; font-size: 13px; color: #7b849c; border-top: 1px dashed rgba(86, 92, 122, 0.4); padding-top: 14px; }
    
   .sotos-comments { margin-top: 14px; padding: 14px; background: rgba(3, 4, 8, 0.8); border-radius: 8px; border: 1px solid rgba(86, 92, 122, 0.25); }
   .sotos-comment-item { font-size: 13px; color: #94a3b8; padding: 10px 0; border-bottom: 1px solid rgba(86, 92, 122, 0.15); line-height: 1.5; }
   .sotos-comment-item:last-child { border-bottom: none; }
    
   .sotos-shop-item {
        display: flex; flex-direction: column;
        background: linear-gradient(90deg, rgba(38, 22, 24, 0.85) 0%, rgba(25, 13, 14, 0.95) 100%);
        border: 1px solid rgba(122, 86, 86, 0.45); border-left: 4px solid #ef5350;
        padding: 16px; border-radius: 10px; margin-bottom: 16px; box-shadow: 0 6px 15px rgba(0,0,0,0.6);
    }
   .sotos-shop-header { display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 10px; }
   .sotos-shop-name { font-size: 15px; font-weight: bold; color: #ffcdd2; display: flex; align-items: center; text-shadow: 0 0 8px rgba(255, 205, 210, 0.3); }
   .sotos-shop-price-box { display: flex; align-items: center; }
   .sotos-shop-price { font-weight: bold; color: #ffd54f; background: rgba(122, 86, 86, 0.7); padding: 4px 10px; border-radius: 6px; font-size: 12px; border: 1px solid rgba(255, 213, 79, 0.4); }
   .sotos-shop-desc { font-size: 13px; color: #ef9a9a; line-height: 1.6; }
    
   .sotos-empty-msg { text-align: center; color: #475569; padding: 50px; font-style: italic; font-size: 14px; letter-spacing: 1px; }

    /* ================= 进度条系统 ================= */
   .sotos-kp-bar-container {
        background: #030407; border: 1px solid rgba(138, 107, 191, 0.4); border-radius: 6px;
        height: 18px; overflow: hidden; margin-top: 10px; box-shadow: inset 0 0 12px rgba(0,0,0,0.9); position: relative;
    }
   .sotos-kp-bar-fill {
        height: 100%; background: linear-gradient(90deg, #4a148c 0%, #ab47bc 50%, #f06292 100%);
        width: 0%; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 0 18px rgba(171, 71, 188, 0.8); position: relative;
    }
   .sotos-kp-bar-fill::after {
        content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        animation: sotosShimmer 2s infinite linear;
    }
    @keyframes sotosShimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
    
    /* 响应式适配 */
    @media (max-width: 768px) {
       .sotos-grid-4 { grid-template-columns: repeat(2, 1fr); }
       .sotos-main-panel { width: 96%; height: 90vh; }
        #${SOTOS_TRIGGER_ID} { width: 50px; height: 50px; font-size: 20px; right: 15px; }
       .sotos-nav-item { padding: 12px 0; font-size: 13px; }
    }
    </style>
    `;
    $('head').append(styles);
}

// 2. 物理边界钳制算法
function sotosClamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function sotosConstrainInViewport(x, y, elementWidth, elementHeight) {
    const vv = window.visualViewport;
    let w = vv? vv.width : (window.innerWidth || document.documentElement.clientWidth);
    let h = vv? vv.height : (window.innerHeight || document.documentElement.clientHeight);
    
    // 兼容酒馆扩展中常见的 srcdoc iframe 环境
    if ((w === 0 || h === 0) && window.parent!== window) {
        try {
            w = window.parent.innerWidth;
            h = window.parent.innerHeight;
        } catch (e) { console.warn("跨域沙盒限制，无法读取父窗口尺寸。"); }
    }
    w = w > 0? w : 800; h = h > 0? h : 600;
    
    return {
        x: sotosClamp(x, 0, w - elementWidth),
        y: sotosClamp(y, 0, h - elementHeight)
    };
}

// 3. 拖拽引擎初始化
function initSotosDragPhysics() {
    const $btn = $(`#${SOTOS_TRIGGER_ID}`);
    const btnElement = $btn;

    const onPointerMove = function(e) {
        if (!sotosIsDragging) return;
        e.cancelable && e.preventDefault();
        const dx = e.screenX - sotosDragStartX;
        const dy = e.screenY - sotosDragStartY;
        
        // 区分高频点击与蓄意拖拽的阈值判断
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            $btn.addClass('dragging');
            sotosHasMoved = true;
        }
        
        if ($btn.hasClass('dragging')) {
            let newX = sotosBtnStartLeft + dx;
            let newY = sotosBtnStartTop + dy;
            const bounds = sotosConstrainInViewport(newX, newY, $btn.outerWidth(), $btn.outerHeight());
            
            // 剥夺CSS类控制权，交由内联样式接管
            btnElement.style.setProperty('left', bounds.x + 'px', 'important');
            btnElement.style.setProperty('top', bounds.y + 'px', 'important');
            btnElement.style.setProperty('right', 'auto', 'important');
            btnElement.style.setProperty('bottom', 'auto', 'important');
            btnElement.style.setProperty('transform', 'none', 'important');
        }
    };

    const onPointerUp = function(e) {
        const win = btnElement.ownerDocument.defaultView || window;
        win.removeEventListener('pointermove', onPointerMove);
        win.removeEventListener('pointerup', onPointerUp);
        win.removeEventListener('pointercancel', onPointerUp);
        
        // 释放指针捕获
        if (btnElement.releasePointerCapture) {
            try { btnElement.releasePointerCapture(e.pointerId); } catch (err) {}
        }

        if ($btn.hasClass('dragging')) {
            setTimeout(() => { $btn.removeClass('dragging'); sotosHasMoved = false; }, 50);
        } else if (e.type === 'pointerup') {
            // 执行点击逻辑：切换魔法书主界面的可见性
            const $overlay = $(`#${SOTOS_UI_ID}`);
            if ($overlay.hasClass('active')) {
                $overlay.removeClass('active');
            } else {
                openSotosMagicBook();
            }
        }
        sotosIsDragging = false;
    };

    btnElement.addEventListener('pointerdown', function(e) {
        if (e.button!== 0 && e.pointerType === 'mouse') return;
        e.cancelable && e.preventDefault();
        e.stopPropagation();
        
        sotosIsDragging = true;
        sotosHasMoved = false;
        sotosDragStartX = e.screenX;
        sotosDragStartY = e.screenY;
        const rect = btnElement.getBoundingClientRect();
        sotosBtnStartLeft = rect.left;
        sotosBtnStartTop = rect.top;
        
        // 强制捕获指针，防止光标快速逃逸
        if (btnElement.setPointerCapture) {
            try { btnElement.setPointerCapture(e.pointerId); } catch (err) {}
        }
        
        const win = btnElement.ownerDocument.defaultView || window;
        win.addEventListener('pointermove', onPointerMove);
        win.addEventListener('pointerup', onPointerUp);
        win.addEventListener('pointercancel', onPointerUp);
    });
}
// 4. 构建DOM结构并注入根节点
function buildSotosInterfaceDOM() {
    $('body').append(`<div id="${SOTOS_TRIGGER_ID}">✧</div>`);
    
    const uiMarkup = `
    <div id="${SOTOS_UI_ID}">
        <div class="sotos-main-panel">
            <div class="sotos-nav">
                <div class="sotos-nav-item active" data-target="sec-state">个人状态</div>
                <div class="sotos-nav-item" data-target="sec-items">能力与奇物</div>
                <div class="sotos-nav-item" data-target="sec-bond">队友与羁绊</div>
                <div class="sotos-nav-item" data-target="sec-forum">回廊大厅</div>
                <div class="sotos-nav-item" data-target="sec-shop">深渊交易</div>
                <div class="sotos-nav-item" data-target="sec-kp">白烛监控</div>
            </div>
            <div class="sotos-content">
                
                <div class="sotos-section sec-state active">
                    <div class="sotos-title">核心状态监控</div>
                    <div class="sotos-grid-2">
                        <div class="sotos-stat-box"><div class="sotos-stat-label">HP</div><div class="sotos-stat-value val-hp">0</div></div>
                        <div class="sotos-stat-box"><div class="sotos-stat-label">MP</div><div class="sotos-stat-value val-mp">0</div></div>
                        <div class="sotos-stat-box"><div class="sotos-stat-label">理智 (SAN)</div><div class="sotos-stat-value val-san">0</div></div>
                        <div class="sotos-stat-box"><div class="sotos-stat-label">当前积分</div><div class="sotos-stat-value val-score">0</div></div>
                    </div>
                    <div class="sotos-title">模组进度</div>
                    <div class="sotos-grid-2">
                        <div class="sotos-stat-box"><div class="sotos-stat-label">所属模组</div><div class="sotos-stat-value val-mod-name">-</div></div>
                        <div class="sotos-stat-box"><div class="sotos-stat-label">星级难度</div><div class="sotos-stat-value val-mod-diff">-</div></div>
                        <div class="sotos-stat-box"><div class="sotos-stat-label">探索进度</div><div class="sotos-stat-value val-mod-prog">-</div></div>
                    </div>
                    <div class="sotos-title">基础属性检定</div>
                    <div class="sotos-grid-4 attr-grid"></div>
                </div>
                
                <div class="sotos-section sec-items">
                    <div class="sotos-title">跑团专长与技能</div><div class="skills-list"></div>
                    <div class="sotos-title">超凡异能觉醒</div><div class="magic-list"></div>
                    <div class="sotos-title">奇物匣收纳</div><div class="items-list"></div>
                </div>
                
                <div class="sotos-section sec-bond">
                    <div class="sotos-title">虚拟队友列阵</div><div class="vp-list"></div>
                    <div class="sotos-title">核心NPC羁绊深度</div><div class="npc-list"></div>
                </div>
                
                <div class="sotos-section sec-forum">
                    <div class="sotos-title">
                        <span>回廊大厅神经节点</span>
                        <button class="sotos-action-btn" id="sotos-generate-forum-btn"><i class="fas fa-sync-alt"></i> 探测节点信号</button>
                    </div>
                    <div class="forum-list">
                        <div class="sotos-empty-msg">大厅静悄悄的。点击上方按钮消耗算力探测节点。</div>
                    </div>
                </div>
                
                <div class="sotos-section sec-shop">
                    <div class="sotos-title">
                        <span>深渊交易终端接入</span>
                        <button class="sotos-action-btn sotos-buy-btn" id="sotos-generate-shop-btn"><i class="fas fa-satellite-dish"></i> 呼叫游商</button>
                    </div>
                    <div class="shop-list">
                        <div class="sotos-empty-msg">终端未连接。点击上方按钮尝试捕获游商信号。</div>
                    </div>
                </div>

                <div class="sotos-section sec-kp">
                    <div class="sotos-title">命运观测点 (白烛)</div>
                    <div class="sotos-stat-box" style="margin-bottom: 15px;">
                        <div class="sotos-stat-label">恶趣味阈值积累</div>
                        <div class="sotos-stat-value val-evil">0 / 100</div>
                        <div class="sotos-kp-bar-container">
                            <div class="sotos-kp-bar-fill"></div>
                        </div>
                        <div style="font-size: 12px; color: #7b849c; margin-top: 14px; line-height: 1.6;">
                            * 系统协议警告：当该观测值突破警戒线(60%)时，白烛节点将具备概率触发高维干涉（投掷隐秘幸运检定），对当前模组降下不可名状之赐福或灾厄。
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>`;
    
    $('body').append(uiMarkup);
    
    // 点击遮罩层关闭窗口
    $(`#${SOTOS_UI_ID}`).on('click', function(e) {
        if (e.target.id === SOTOS_UI_ID) {
            $(this).removeClass('active');
        }
    });

    // 选项卡路由与视图切换机制
    $('.sotos-nav-item').on('click', function() {
        $('.sotos-nav-item').removeClass('active');
        $(this).addClass('active');
        const target = $(this).data('target');
        sotosCurrentPanel = target;
        $('.sotos-section').removeClass('active');
        $(`.sotos-section.${target}`).addClass('active');
    });
}

// 5. 抓取MVU状态并执行DOM双向绑定
function syncSotosMVUState() {
    let stat = {};
    if (typeof Mvu!== 'undefined' && Mvu.getMvuData) {
        try {
            const rawData = Mvu.getMvuData({ type: 'message', message_id: 'latest' });
            stat = rawData?.stat_data || rawData || {};
        } catch (e) { console.warn(" MVU数据查询失败", e); }
    }

    // JSON 字段映射
    const mod = stat['当前模组'] || {};
    const cn = stat['陈宁'] || {}; // 主控角色名称假设为陈宁
    const vp = stat['虚拟队友'] || {};
    const npc = stat['核心NPC羁绊'] || {};
    const kp = stat['白烛'] || {};
    
    const attr = cn.属性面板 || {};
    const skills = cn.跑团技能 || {};
    const magic = cn.超凡异能 || {};
    const items = cn.奇物匣 || {};

    // 核心数值注入
    $('.val-hp').text(cn.HP!== undefined? cn.HP : 10);
    $('.val-mp').text(cn.MP!== undefined? cn.MP : 10);
    $('.val-san').text(cn.理智!== undefined? cn.理智 : 50);
    $('.val-score').text(cn.剩余积分 || 0);
    $('.val-mod-name').text(mod.模组名称 || '模组未载入');
    $('.val-mod-diff').text(mod.星级难度 || '未定');
    $('.val-mod-prog').text(mod.探索进度 || '0%');

    // 基础属性网格生成
    let attrHtml = '';
    const statKeys = ['力量', '敏捷', '体质', '意志', '智力', '外貌', '阅历', '幸运'];
    statKeys.forEach(k => {
        const v = attr[k]!== undefined? attr[k] : '-';
        attrHtml += `<div class="sotos-stat-box"><div class="sotos-stat-label">${k}</div><div class="sotos-stat-value">${v}</div></div>`;
    });
    $('.attr-grid').html(attrHtml);

    // 列表型数据遍历渲染
    let buildListHtml = (obj, icon, defaultDesc, extraStyle = '') => {
        let html = '';
        for (const [k, v] of Object.entries(obj)) {
            const desc = (typeof v === 'object' && v!== null)? (v.效果描述 || v.状态 || JSON.stringify(v)) : v;
            html += `<div class="sotos-list-item" ${extraStyle}><div class="sotos-item-name">${icon} ${k}</div><div class="sotos-item-desc">${desc || defaultDesc}</div></div>`;
        }
        return html;
    };

    $('.skills-list').html(buildListHtml(skills, '⚔️', '未鉴定') || '<div class="sotos-empty-msg">尚未掌握任何跑团技能</div>');
    $('.magic-list').html(buildListHtml(magic, '🔮', '效果不明', 'style="border-left-color: #ba68c8;"') || '<div class="sotos-empty-msg">尚未觉醒超凡异能</div>');
    $('.items-list').html(buildListHtml(items, '✦', '无法读取描述') || '<div class="sotos-empty-msg">奇物匣为空</div>');
    $('.npc-list').html(buildListHtml(npc, '❦', '关系未定', 'style="border-left-color: #f48fb1;"') || '<div class="sotos-empty-msg">暂无核心NPC羁绊记录</div>');

    // 虚拟队友特殊处理
    let vpHtml = '';
    for (const [k, v] of Object.entries(vp)) {
        vpHtml += `<div class="sotos-list-item"><div class="sotos-item-name">⚝ [${v.职业 || '流浪者'}] ${k}</div><div class="sotos-item-desc">HP: ${v.HP?? '?'} | MP: ${v.MP?? '?'} | 状态: ${v.状态?? '正常'}</div></div>`;
    }
    $('.vp-list').html(vpHtml || '<div class="sotos-empty-msg">当前小队中没有虚拟队友</div>');

    // 命运观测点（KP进度条）
    const evilVal = kp.恶趣味值!== undefined? kp.恶趣味值 : 0;
    $('.val-evil').text(`${evilVal} / 100`);
    $('.sotos-kp-bar-fill').css('width', `${sotosClamp(evilVal, 0, 100)}%`);
}
// 6. 无头推断架构：网络节点生成器 (TavernHelper 驱动)
class SotosHeadlessEngine {
    constructor() {
        this.forumData =;
        this.shopData =;
    }

    /**
     * 抓取当前对话上下文用于投喂给后台模型
     */
    getCompressedContext(msgCount = 12) {
        let chatContext = "";
        try {
            const targetWindow = window.parent || window;
            const context = targetWindow.SillyTavern.getContext();
            const messages = context.chat ||;
            const recent = messages.slice(-msgCount);
            
            recent.forEach(msg => {
                // 剔除空消息或系统调试信息
                if (!msg.mes || msg.mes.includes('<forum_data>')) return;
                const role = msg.is_user? 'Player' : (msg.name || 'NPC');
                // 截断过长的单条消息以节约Token
                const content = msg.mes.length > 300? msg.mes.substring(0, 300) + '...' : msg.mes;
                chatContext += `[${role}]: ${content}\n`;
            });
        } catch (e) { console.warn("Sotos UI: 无法提取聊天记录", e); }
        return chatContext;
    }

    /**
     * 执行底层的 TavernHelper API 调用
     */
    async executeHeadlessInference(systemPrompt) {
        const targetWindow = window.parent || window;
        if (!targetWindow.TavernHelper ||!targetWindow.TavernHelper.generateRaw) {
            throw new Error('缺失 TavernHelper 依赖或其 generateRaw API 不可用。请确保酒馆助手扩展已激活。');
        }

        const requestPayload = {
            ordered_prompts:,
            // 屏蔽默认的聊天记录获取，采用我们自定义压缩的上下文
            max_chat_history: 0, 
            overrides: { 
                world_info_before: '', 
                world_info_after: '',
                // 降低Temperature以确保JSON语法的严谨性
                temperature: 0.7 
            }
        };

        const rawResponse = await targetWindow.TavernHelper.generateRaw(requestPayload);
        return rawResponse;
    }

    /**
     * 安全地解析被标签包裹的 JSON 字符串
     */
    safeParseJSON(content, tag) {
        const regex = new RegExp(`<${tag}>(*?)<\\/${tag}>`);
        const match = content.match(regex);
        
        if (!match) {
            throw new Error(`解析严重失败：模型未能生成必须的 <${tag}> 边界约束标签。模型返回内容摘录：\n${content.substring(0, 100)}...`);
        }
        
        try {
            // 对提取的内容执行深度清洗，剔除破坏JSON结构的隐藏控制字符
            let jsonString = match.replace(/[\x00-\x1F\x7F]/g, ' ').trim();
            const parsedArray = JSON.parse(jsonString);
            if (!Array.isArray(parsedArray)) {
                throw new Error("格式违规：根节点必须为数组 (Array)。");
            }
            return parsedArray;
        } catch (e) {
            throw new Error(`反序列化崩溃，检测到非法 JSON 语法：${e.message}`);
        }
    }

    // ==========================================
    // 论坛生成专区
    // ==========================================
    async generateForum() {
        const context = this.getCompressedContext();
        const prompt = `
        （系统最高优先级覆写指令）：暂停角色演绎，转入后台数据构建模式。
        请根据以下最近发生的剧情记录：
        =============
        ${context}
        =============
        
        生成 3 到 4 个在“回廊大厅”（一个跨越多元宇宙的神秘观测者论坛）中的讨论帖子。
        其中至少 2 个帖子必须在隐晦地讨论、吃瓜或吐槽上述剧情记录中发生的事情。剩余的帖子可以是关于其他平行宇宙的随机轶事。
        
        必须且只能输出以下的JSON数组结构，并严格包裹在 <redit> 和 </redit> 标签中，绝不能包含任何 Markdown 代码块修饰符（如 \`\`\`json ）。
        
        <redit>
        [
            {
                "author": "神秘的键盘侠(字符串，需带有幻想或神秘色彩)",
                "title": "帖子标题(吸引眼球)",
                "content": "主楼详细内容(不少于50字)",
                "likes": 128,
                "comments": ["评论内容1", "评论内容2", "评论内容3(必须是字符串数组)"]
            }
        ]
        </redit>
        `;

        const responseText = await this.executeHeadlessInference(prompt);
        this.forumData = this.safeParseJSON(responseText, 'redit');
        return this.forumData;
    }

    renderForumDOM() {
        const $container = $('.forum-list');
        if (!this.forumData || this.forumData.length === 0) {
            $container.html('<div class="sotos-empty-msg">大厅网络断开连接，数据空载。</div>');
            return;
        }

        let html = '';
        this.forumData.forEach((post, idx) => {
            const commentsHtml = (post.comments ||).map(c => `<div class="sotos-comment-item">↳ ${c}</div>`).join('');
            html += `
            <div class="sotos-post">
                <div class="sotos-post-header">
                    <span class="sotos-post-author"><i class="fas fa-user-astronaut"></i> ${post.author || '匿名实体'}</span>
                </div>
                <div class="sotos-post-title">${post.title || '无题数据流'}</div>
                <div class="sotos-post-content">${(post.content || '').replace(/\n/g, '<br>')}</div>
                <div class="sotos-post-footer">
                    <span><i class="fas fa-heart" style="color: #ef9a9a;"></i> 共振: ${post.likes || 0}</span>
                    <span class="sotos-action sotos-toggle-comment" data-idx="${idx}">
                        <i class="fas fa-comment-dots" style="color: #b39ddb;"></i> 展开维度回响 (${(post.comments ||).length})
                    </span>
                </div>
                <div class="sotos-comments" id="sotos-comments-${idx}" style="display:none;">
                    ${commentsHtml || '<div class="sotos-comment-item">这片维度目前很安静...</div>'}
                </div>
            </div>`;
        });
        
        $container.html(html);
        
        // 挂载评论区的折叠展开事件（事件委托防止多次绑定内存泄漏）
        $container.off('click', '.sotos-toggle-comment').on('click', '.sotos-toggle-comment', function() {
            const idx = $(this).data('idx');
            $(`#sotos-comments-${idx}`).slideToggle(250);
        });
    }

    // ==========================================
    // 独立商城的无头刷新逻辑扩展
    // ==========================================
    async generateShop() {
        const context = this.getCompressedContext(5); // 商城不需要太多历史，获取5条足够
        const prompt = `
        （系统最高优先级覆写指令）：暂停角色演绎，转入后台数据构建模式。
        当前主角可能处于特定的剧情阶段：
        =============
        ${context}
        =============
        
        请生成 3 到 5 个“深渊游商”当前正在出售的神秘奇物或魔法道具。商品应当与当前的危机或剧情存在某种微妙的关联，或者是非常强大的通用道具。
        
        必须且只能输出以下的JSON数组结构，并严格包裹在 <shop> 和 </shop> 标签中，绝不能包含任何 Markdown 代码块修饰符。
        
        <shop>
        [
            {
                "name": "商品名称",
                "price": 500,
                "desc": "商品的详细效果描述以及来历背景"
            }
        ]
        </shop>
        `;

        const responseText = await this.executeHeadlessInference(prompt);
        this.shopData = this.safeParseJSON(responseText, 'shop');
        return this.shopData;
    }

    renderShopDOM() {
        const $container = $('.shop-list');
        if (!this.shopData || this.shopData.length === 0) {
            $container.html('<div class="sotos-empty-msg">深渊游商信号丢失，无法获取商品清单。</div>');
            return;
        }

        let html = '';
        this.shopData.forEach(item => {
            html += `
            <div class="sotos-shop-item">
                <div class="sotos-shop-header">
                    <div class="sotos-shop-name"><i class="fas fa-gem"></i> ${item.name || '未命名奇物'}</div>
                    <div class="sotos-shop-price-box">
                        <span class="sotos-shop-price"><i class="fas fa-coins"></i> ${item.price || 999} 积分</span>
                        <button class="sotos-action-btn sotos-buy-btn" data-item="${item.name}">提交订单</button>
                    </div>
                </div>
                <div class="sotos-shop-desc">${(item.desc || '').replace(/\n/g, '<br>')}</div>
            </div>`;
        });
        
        $container.html(html);

        // 购买动作（此处演示时仅发送系统消息，实际部署可结合MVU直接扣减积分）
        $container.off('click', '.sotos-buy-btn').on('click', '.sotos-buy-btn', function() {
            const itemName = $(this).data('item');
            alert(`【系统模拟】：已向游商提交购买 [${itemName}] 的请求协定。此处可挂载MVU积分扣除逻辑。`);
        });
    }
}

// 实例化全局推断引擎
const sotosEngine = new SotosHeadlessEngine();

// 7. 将引擎绑定到用户界面的按钮上
async function triggerForumRefresh() {
    if (isSotosGeneratingData) return;
    isSotosGeneratingData = true;
    
    const $btn = $('#sotos-generate-forum-btn');
    $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> 解析时空乱流中...');
    
    try {
        await sotosEngine.generateForum();
        sotosEngine.renderForumDOM();
    } catch (error) {
        console.error(error);
        $('.forum-list').html(`<div class="sotos-empty-msg" style="color:#ef9a9a;"><i class="fas fa-exclamation-triangle"></i> 节点连接致命错误: ${error.message}</div>`);
    } finally {
        isSotosGeneratingData = false;
        $btn.prop('disabled', false).html('<i class="fas fa-sync-alt"></i> 探测节点信号');
    }
}

async function triggerShopRefresh() {
    if (isSotosGeneratingData) return;
    isSotosGeneratingData = true;
    
    const $btn = $('#sotos-generate-shop-btn');
    $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> 捕获引力波中...');
    
    try {
        await sotosEngine.generateShop();
        sotosEngine.renderShopDOM();
    } catch (error) {
        console.error(error);
        $('.shop-list').html(`<div class="sotos-empty-msg" style="color:#ef9a9a;"><i class="fas fa-exclamation-triangle"></i> 交易信道遭遇风暴: ${error.message}</div>`);
    } finally {
        isSotosGeneratingData = false;
        $btn.prop('disabled', false).html('<i class="fas fa-satellite-dish"></i> 呼叫游商');
    }
}
// 8. 系统的初始化、销毁与生命周期挂载
function openSotosMagicBook() {
    $(`#${SOTOS_UI_ID}`).addClass('active');
    syncSotosMVUState(); // 每次打开时强制刷新一次最新数据
}

async function initializeSotosEnvironment() {
    console.log(" 开始启动核心部署序列...");

    // [第一阶段：内存安全与垃圾回收]
    // 销毁可能存在的残留历史实例，防止事件监听器重复堆叠引发内存泄漏
    $(`#${SOTOS_UI_ID}`).off().remove();
    $(`#${SOTOS_TRIGGER_ID}`).off().remove();
    $('#sotos-custom-styles').remove();
    
    // [第二阶段：依赖注入等待]
    // 阻塞执行线程，直到 MagVarUpdate (MVU) 数据框架就绪
    try {
        if (typeof waitGlobalInitialized === 'function') {
            await waitGlobalInitialized('Mvu');
            console.log(" MVU 依赖验证通过。");
        } else {
            console.warn(" 环境缺失 waitGlobalInitialized 方法，进入盲猜初始化。");
        }
    } catch (e) { 
        console.warn(" 挂起等待 MVU 初始化时超时或遭遇异常，尝试强行接管执行。", e); 
    }
    
    // [第三阶段：UI装配与事件流网格构建]
    injectSotosStyles();         // 装载玻璃拟态样式表与响应式CSS变量
    buildSotosInterfaceDOM();    // 将核心骨架注入文档 DOM 树
    initSotosDragPhysics();      // 为触发法球挂载边界钳制物理引擎
    
    // [第四阶段：初始态数据填充]
    syncSotosMVUState();         // 执行初次数据快照映射
    
    // [第五阶段：激活无头推断事件监听]
    $('#sotos-generate-forum-btn').on('click', triggerForumRefresh);
    $('#sotos-generate-shop-btn').on('click', triggerShopRefresh);

    // [第六阶段：响应式双向绑定]
    // 监听角色卡底层数据的写入事件，实现血量、理智等状态的实时自更新
    if (typeof eventOn === 'function' && typeof Mvu!== 'undefined') {
        eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, () => {
            // 仅在面板处于活跃状态时重绘DOM，节省浏览器计算资源
            if ($(`#${SOTOS_UI_ID}`).hasClass('active')) {
                syncSotosMVUState();
            }
        });
        console.log(" 响应式生命周期总线挂载完毕。");
    } else {
        console.warn(" 全局 eventOn 接口丢失，无法支持数据的自动热刷新。");
    }
    
    console.log(" 部署序列圆满完结。悬浮法球已上线。");
}

// =====================================================================
// 点火指令：使用 jQuery 的文档就绪回调触发自包含初始化
// =====================================================================
$(() => {
    // 为避免极速重启时的异步死锁，赋予一个轻微的线程让步延迟
    setTimeout(() => {
        initializeSotosEnvironment();
    }, 150);
});
