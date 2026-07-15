<!-- ====================== 极简手机界面 ====================== -->
<script>
// ==================== 极简手机界面 - 仅状态栏 + 论坛 + MUV ======================

// ==================== 样式注入（极简版） ====================
const simplePhoneStyles = `
<style id="simple-mobile-phone-styles">
    #mobile-phone-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.6);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }
    #mobile-phone-overlay.active { display: flex; }

    .mobile-phone-frame {
        width: 375px;
        height: 667px; /* 标准手机尺寸 */
        background: #1a1a1a;
        border-radius: 40px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        position: relative;
    }

    .mobile-phone-screen {
        width: 100%;
        height: 100%;
        background: #f8f9fa;
        display: flex;
        flex-direction: column;
    }

    /* 状态栏 */
    .mobile-status-bar {
        height: 44px;
        background: rgba(255,255,255,0.95);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
        font-size: 14px;
        font-weight: 600;
        color: #000;
        flex-shrink: 0;
    }

    .status-time { font-weight: 700; }
    .pin-btn {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        padding: 5px;
    }
    .pin-btn.pinned { color: #007aff; transform: rotate(45deg); }

    /* 主内容 */
    .mobile-content {
        flex: 1;
        padding: 15px;
        overflow-y: auto;
    }

    .app-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        margin-top: 20px;
    }

    .app-icon {
        text-align: center;
        cursor: pointer;
    }

    .app-icon i {
        font-size: 32px;
        margin-bottom: 6px;
        display: block;
    }
</style>
`;

// 注入样式
document.head.insertAdjacentHTML('beforeend', simplePhoneStyles);

// ==================== 全局变量 ====================
let isPinned = false;
let currentPhoneData = null;

// ==================== MUV 接入 ====================
function getMvuData() {
    if (typeof fetchLatestMvuData === 'function') {
        try {
            return fetchLatestMvuData(false);
        } catch(e) {}
    }
    if (typeof Mvu !== 'undefined' && Mvu.getMvuData) {
        try {
            return Mvu.getMvuData({ type: 'message', message_id: 'latest' });
        } catch(e) {}
    }
    return null;
}

// ==================== 创建手机界面 ====================
function createMobilePhone() {
    const overlay = document.createElement('div');
    overlay.id = 'mobile-phone-overlay';
    overlay.innerHTML = `
        <div class="mobile-phone-frame">
            <div class="mobile-phone-screen">
                <!-- 状态栏 -->
                <div class="mobile-status-bar">
                    <div class="status-left">
                        <span class="status-time" id="phone-time"></span>
                    </div>
                    <div class="status-center"></div>
                    <div class="status-right">
                        <button class="pin-btn" id="pin-btn">📌</button>
                    </div>
                </div>

                <!-- 主内容 -->
                <div class="mobile-content">
                    <h2 style="margin: 10px 0 20px; text-align:center; color:#333;">手机</h2>
                    
                    <div class="app-grid">
                        <div class="app-icon" onclick="openForum()">
                            <i class="fas fa-comments" style="color:#007aff;"></i>
                            <div style="font-size:13px;">论坛</div>
                        </div>
                        <div class="app-icon" onclick="refreshMuvData()">
                            <i class="fas fa-sync" style="color:#28a745;"></i>
                            <div style="font-size:13px;">刷新MUV</div>
                        </div>
                    </div>

                    <div id="forum-content" style="margin-top:30px; display:none;">
                        <!-- 论坛内容将动态插入 -->
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // 时间更新
    function updateTime() {
        const timeEl = document.getElementById('phone-time');
        if (timeEl) {
            const now = new Date();
            timeEl.textContent = now.getHours().toString().padStart(2,'0') + ':' + 
                                 now.getMinutes().toString().padStart(2,'0');
        }
    }
    updateTime();
    setInterval(updateTime, 30000);

    // Pin 按钮
    document.getElementById('pin-btn').addEventListener('click', () => {
        isPinned = !isPinned;
        const btn = document.getElementById('pin-btn');
        btn.classList.toggle('pinned', isPinned);
        overlay.style.background = isPinned ? 'transparent' : 'rgba(0,0,0,0.6)';
    });

    return overlay;
}

// ==================== 论坛功能 ====================
function openForum() {
    const content = document.getElementById('forum-content');
    content.style.display = 'block';
    content.innerHTML = `
        <h3 style="margin:10px 0;">论坛</h3>
        <button onclick="refreshForum()" style="padding:8px 16px; background:#007aff; color:white; border:none; border-radius:6px; margin-bottom:15px;">
            🔄 刷新论坛
        </button>
        <div id="forum-posts" style="background:white; padding:15px; border-radius:8px; min-height:200px;">
            正在加载论坛内容...
        </div>
    `;
    refreshForum();
}

function refreshForum() {
    const postsDiv = document.getElementById('forum-posts');
    if (!postsDiv) return;
    
    postsDiv.innerHTML = '论坛刷新中...';
    
    // 这里可以接入你的论坛生成逻辑
    setTimeout(() => {
        postsDiv.innerHTML = `
            <p><strong>最新帖子</strong></p>
            <p style="color:#666; font-size:14px;">当前暂无新帖（可在此处接入真实论坛API）</p>
        `;
    }, 800);
}

// ==================== MUV 刷新 ====================
function refreshMuvData() {
    const data = getMvuData();
    if (data) {
        alert('MUV 数据已刷新！\n\n羁绊数量：' + (data.羁绊列表 ? Object.keys(data.羁绊列表).length : 0));
        console.log('MUV 数据:', data);
    } else {
        alert('未检测到 MUV 数据');
    }
}

// ==================== 触发按钮 ====================
function createTriggerButton() {
    const btn = document.createElement('div');
    btn.id = 'mobile-trigger-btn';
    btn.style.cssText = `
        position:fixed; top:50%; right:30px; transform:translateY(-50%);
        width:55px; height:55px; background:#007aff; color:white;
        border-radius:50%; display:flex; align-items:center; justify-content:center;
        font-size:24px; box-shadow:0 4px 15px rgba(0,122,255,0.4);
        cursor:pointer; z-index:10000; user-select:none;
    `;
    btn.innerHTML = '📱';
    btn.onclick = () => {
        const overlay = document.getElementById('mobile-phone-overlay') || createMobilePhone();
        overlay.classList.toggle('active');
    };
    document.body.appendChild(btn);
}

// ==================== 初始化 ====================
function initSimpleMobilePhone() {
    createTriggerButton();
    console.log('✅ 极简手机界面已加载（仅状态栏 + 论坛 + MUV）');
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimpleMobilePhone);
} else {
    initSimpleMobilePhone();
}
</script>
