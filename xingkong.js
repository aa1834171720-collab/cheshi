function() {
   // ==========================================
   // 防重复加载检测
   // ==========================================
   if (document.getElementById('wx_magic_trigger')) {
       console.log("星空魔法书已加载，跳过初始化。");
       return;
   }

   // ==========================================
   // 1. 加载依赖图标 (Font Awesome)
   // ==========================================
   function loadFontAwesome() {
       if (document.querySelector('link[href*="font-awesome"]') || document.querySelector('link[href*="fontawesome"]')) return;
       const link = document.createElement('link');
       link.rel = 'stylesheet';
       link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
       link.crossOrigin = 'anonymous';
       document.head.appendChild(link);
   }
   loadFontAwesome();

   // ==========================================
   // 2. 注入全局 CSS 样式
   // ==========================================
   const style = document.createElement('style');
   style.id = "wx_magic_styles";
   style.innerHTML = `
       /* --- 悬浮触发球 --- */
       .wx-trigger-btn {
           position: fixed;
           right: 20px;
           top: 50%;
           transform: translateY(-50%);
           width: 50px;
           height: 50px;
           border-radius: 50%;
           background: linear-gradient(135deg, #0a0b14 0%, #151025 100%);
           border: 1px solid rgba(156, 136, 196, 0.6);
           box-shadow: 0 0 15px rgba(0, 0, 0, 0.8), inset 0 0 10px rgba(138, 107, 191, 0.4);
           color: #d1c4e9;
           display: flex;
           align-items: center;
           justify-content: center;
           font-size: 20px;
           cursor: pointer;
           z-index: 10000;
           user-select: none;
           transition: box-shadow 0.3s, background 0.3s;
       }
       .wx-trigger-btn:hover {
           box-shadow: 0 0 20px rgba(156, 136, 196, 0.8);
           background: linear-gradient(135deg, #151025 0%, #21193b 100%);
       }
       .wx-trigger-btn.dragging {
           transition: none;
           cursor: grabbing;
       }

       /* --- 悬浮面板外框 --- */
       .wx-floating-panel {
           position: fixed;
           right: 85px;
           top: 50%;
           transform: translateY(-50%);
           width: 460px;
           max-width: 90vw;
           background:
             radial-gradient(ellipse at top right, rgba(94, 43, 151, 0.15) 0%, transparent 55%),
             radial-gradient(ellipse at bottom left, rgba(17, 34, 104, 0.2) 0%, transparent 55%),
             linear-gradient(180deg, #05060a 0%, #0c0e1a 100%);
           border: 1px solid rgba(103, 86, 140, 0.5);
           border-top: 2px solid rgba(156, 136, 196, 0.7);
           border-radius: 12px;
           z-index: 10001;
           box-shadow: 0 15px 35px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,0,0,0.9);
           display: none; /* 初始隐藏 */
           flex-direction: column;
           font-family: "Microsoft YaHei", "Noto Serif SC", serif;
           color: #d1d5db;
       }

       /* --- 标题拖拽栏 --- */
       .wx-panel-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 10px 16px;
           background: rgba(8, 10, 18, 0.8);
           backdrop-filter: blur(4px);
           border-bottom: 1px solid rgba(103, 86, 140, 0.3);
           border-radius: 12px 12px 0 0;
           cursor: grab;
           user-select: none;
       }
       .wx-panel-header:active {
           cursor: grabbing;
       }
       .wx-panel-title {
           font-size: 15px;
           font-weight: bold;
           color: #c0a8e6;
           text-shadow: 0 0 8px rgba(192, 168, 230, 0.6);
           display: flex;
           align-items: center;
           gap: 8px;
       }
       .wx-panel-close-btn {
           background: transparent;
           border: none;
           color: #94a3b8;
           font-size: 22px;
           line-height: 1;
           cursor: pointer;
           transition: color 0.2s;
           padding: 0;
       }
       .wx-panel-close-btn:hover {
           color: #ef9a9a;
       }

       /* --- 主体导航与内容区 --- */
       .wx-panel-body {
           display: flex;
           flex-direction: column;
       }
       .wx-nav {
           display: flex;
           background: rgba(8, 10, 18, 0.5);
           border-bottom: 1px solid rgba(103, 86, 140, 0.3);
       }
       .wx-nav-item {
           flex: 1;
           padding: 10px 0;
           text-align: center;
           cursor: pointer;
           font-weight: bold;
           color: #6a7185;
           transition: all 0.3s ease;
           border-right: 1px solid rgba(103, 86, 140, 0.15);
           font-size: 12px;
           position: relative;
       }
       .wx-nav-item:last-child { border-right: none; }
       .wx-nav-item:hover { color: #9ba4bc; background: rgba(255, 255, 255, 0.02); }
       .wx-nav-item.active {
           color: #d1c4e9;
           background: linear-gradient(180deg, rgba(103, 86, 140, 0.1) 0%, transparent 100%);
           text-shadow: 0 0 10px rgba(209, 196, 233, 0.6);
       }
       .wx-nav-item.active::after {
           content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px;
           background: linear-gradient(90deg, transparent, #b39ddb, transparent);
           box-shadow: 0 -2px 8px #b39ddb;
       }

       .wx-content {
           padding: 20px;
           max-height: 65vh; /* 适配不同屏幕高度 */
           overflow-y: auto;
       }
       .wx-content::-webkit-scrollbar { width: 4px; }
       .wx-content::-webkit-scrollbar-thumb { background: rgba(103, 86, 140, 0.5); border-radius: 2px; }
       .wx-content::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.3); }

       .wx-section { display: none; animation: wx-fade-in 0.4s ease-out forwards; }
       .wx-section.active { display: block; }
       @keyframes wx-fade-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

       /* 二级导航 */
       .wx-sub-nav { display: flex; gap: 8px; margin-bottom: 16px; justify-content: center; flex-wrap: wrap; }
       .wx-sub-nav-btn {
           padding: 5px 14px; background: rgba(22, 24, 38, 0.6); border: 1px solid rgba(86, 92, 122, 0.4);
           border-radius: 20px; color: #94a3b8; font-size: 11px; cursor: pointer; transition: all 0.2s;
       }
       .wx-sub-nav-btn:hover { background: rgba(86, 92, 122, 0.3); color: #cbd5e1; }
       .wx-sub-nav-btn.active {
           background: rgba(138, 107, 191, 0.2); border-color: rgba(179, 157, 219, 0.6);
           color: #d1c4e9; box-shadow: 0 0 10px rgba(138, 107, 191, 0.3);
       }
       .wx-sub-section { display: none; animation: wx-fade-in 0.3s ease-out forwards; }
       .wx-sub-section.active { display: block; }

       /* 标题与按钮 */
       .wx-title {
           font-size: 14px; font-weight: bold; color: #d1c4e9;
           border-bottom: 1px solid rgba(103, 86, 140, 0.2); padding-bottom: 6px;
           margin-bottom: 16px; margin-top: 5px; text-shadow: 0 0 8px rgba(209, 196, 233, 0.4);
           display: flex; align-items: center; justify-content: space-between;
       }
       .wx-title-text::before { content: '✧'; color: #8e76ba; margin-right: 8px; font-size: 12px; text-shadow: 0 0 5px #8e76ba; }
       
       .wx-refresh-btn, .wx-buy-btn {
           padding: 4px 10px; background: rgba(103, 86, 140, 0.2); border: 1px solid rgba(138, 107, 191, 0.5);
           color: #c0a8e6; border-radius: 4px; cursor: pointer; font-size: 11px; transition: all 0.2s;
       }
       .wx-refresh-btn:hover:not(:disabled) { background: rgba(138, 107, 191, 0.5); color: #fff; }
       .wx-refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; border-color: gray; color: gray; }
       
       .wx-buy-btn { background: rgba(239, 83, 80, 0.15); border-color: rgba(239, 83, 80, 0.4); color: #ef9a9a; margin-left: 10px; }
       .wx-buy-btn:hover { background: rgba(239, 83, 80, 0.3); color: #fff; }

       /* 状态框与列表 */
       .wx-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
       .wx-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 20px; }
       .wx-stat-box {
           background: linear-gradient(135deg, rgba(22, 24, 38, 0.7) 0%, rgba(13, 14, 25, 0.9) 100%);
           border: 1px solid rgba(86, 92, 122, 0.3); border-top: 1px solid rgba(136, 142, 176, 0.5);
           padding: 10px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);
           transition: transform 0.2s;
       }
       .wx-stat-box:hover { transform: translateY(-2px); border-color: rgba(179, 157, 219, 0.4); }
       .wx-stat-label { font-size: 10px; color: #7b849c; margin-bottom: 4px; letter-spacing: 1px; }
       .wx-stat-value { font-size: 13px; font-weight: bold; color: #e2e8f0; }

       .val-hp { color: #ef9a9a; } .val-mp { color: #90caf9; } .val-san { color: #b39ddb; } .val-score { color: #ffd54f; }

       .wx-list-item {
           background: linear-gradient(90deg, rgba(30, 25, 45, 0.6) 0%, rgba(15, 18, 30, 0.4) 100%);
           border: 1px solid rgba(86, 92, 122, 0.2); border-left: 3px solid #8e76ba;
           padding: 10px; margin-bottom: 8px; border-radius: 4px 8px 8px 4px;
       }
       .wx-item-name { font-weight: bold; color: #d1c4e9; margin-bottom: 4px; font-size: 12px; }
       .wx-item-desc { font-size: 11px; color: #94a3b8; line-height: 1.4; }
       .skill-item { border-left-color: #64b5f6; } .skill-item .wx-item-name { color: #bbdefb; }
       .magic-item { border-left-color: #ba68c8; } .magic-item .wx-item-name { color: #e1bee7; }

       /* 论坛与商城样式 */
       .wx-post {
           background: linear-gradient(135deg, rgba(22, 24, 38, 0.8) 0%, rgba(13, 14, 25, 0.9) 100%);
           border: 1px solid rgba(86, 92, 122, 0.4); border-top: 1px solid rgba(136, 142, 176, 0.6);
           padding: 14px; border-radius: 8px; margin-bottom: 12px;
       }
       .wx-post-header { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 11px; }
       .wx-post-author { color: #90caf9; font-weight: bold; }
       .wx-post-title { font-size: 13px; font-weight: bold; color: #e2e8f0; margin-bottom: 6px; }
       .wx-post-content { font-size: 12px; color: #cbd5e1; line-height: 1.5; margin-bottom: 10px; }
       .wx-post-footer { display: flex; gap: 12px; font-size: 11px; color: #64748b; border-top: 1px dashed rgba(86, 92, 122, 0.4); padding-top: 8px; }
       .wx-action { cursor: pointer; transition: color 0.2s; }
       .wx-action:hover { color: #9ba4bc; }
       .wx-comments { display: none; margin-top: 8px; padding: 8px; background: rgba(5, 6, 10, 0.6); border-radius: 6px; }
       .wx-comment-item { font-size: 11px; color: #94a3b8; padding: 4px 0; border-bottom: 1px solid rgba(86, 92, 122, 0.2); }
       .wx-comment-item:last-child { border-bottom: none; }

       .wx-shop-item {
           background: linear-gradient(90deg, rgba(38, 22, 24, 0.8) 0%, rgba(25, 13, 14, 0.9) 100%);
           border: 1px solid rgba(122, 86, 86, 0.4); border-left: 4px solid #ef5350;
           padding: 12px; border-radius: 8px; margin-bottom: 10px; display: flex; flex-direction: column;
       }
       .wx-shop-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
       .wx-shop-name { font-size: 13px; font-weight: bold; color: #ffcdd2; }
       .wx-shop-price-box { display: flex; align-items: center; }
       .wx-shop-price { color: #ffd54f; background: rgba(122, 86, 86, 0.6); padding: 2px 6px; border-radius: 4px; font-size: 10px; border: 1px solid rgba(255, 213, 79, 0.3); }
       .wx-shop-desc { font-size: 11px; color: #ef9a9a; line-height: 1.4; }

       /* 进度条 */
       .wx-kp-bar-container { background: #05060a; border: 1px solid rgba(138, 107, 191, 0.3); border-radius: 4px; height: 12px; margin-top: 8px; overflow: hidden; position: relative; }
       .wx-kp-bar-fill { height: 100%; background: linear-gradient(90deg, #4a148c 0%, #ab47bc 50%, #f06292 100%); width: 0%; transition: width 0.8s; box-shadow: 0 0 10px rgba(171, 71, 188, 0.8); }
       .wx-empty-msg { text-align: center; color: #4b5563; padding: 20px; font-style: italic; font-size: 11px; }
   `;
   document.head.appendChild(style);

   // ==========================================
   // 3. 注入 DOM 结构
   // ==========================================
   const wrapper = document.createElement('div');
   wrapper.innerHTML = `
       <div id="wx_magic_trigger" class="wx-trigger-btn" title="唤醒星空魔法书">
           <i class="fas fa-book-journal-whills"></i>
       </div>

       <div id="wx_magic_panel" class="wx-floating-panel">
           <div class="wx-panel-header" id="wx_panel_header">
               <div class="wx-panel-title"><i class="fas fa-star" style="font-size:12px"></i> 索托斯的星空魔法书</div>
               <button class="wx-panel-close-btn" id="wx_close_btn">×</button>
           </div>
           
           <div class="wx-panel-body">
               <div class="wx-nav">
                   <div class="wx-nav-item active" data-target="sec-state">个人状态</div>
                   <div class="wx-nav-item" data-target="sec-items">能力与奇物</div>
                   <div class="wx-nav-item" data-target="sec-bond">队友羁绊</div>
                   <div class="wx-nav-item" data-target="sec-forum">回廊大厅</div>
                   <div class="wx-nav-item" data-target="sec-shop">积分商城</div>
               </div>

               <div class="wx-content">
                   <div class="wx-section sec-state active">
                       <div class="wx-title"><span class="wx-title-text">核心状态</span></div>
                       <div class="wx-grid-2">
                           <div class="wx-stat-box"><div class="wx-stat-label">HP</div><div class="wx-stat-value val-hp">0</div></div>
                           <div class="wx-stat-box"><div class="wx-stat-label">MP</div><div class="wx-stat-value val-mp">0</div></div>
                           <div class="wx-stat-box"><div class="wx-stat-label">理智</div><div class="wx-stat-value val-san">0</div></div>
                           <div class="wx-stat-box"><div class="wx-stat-label">剩余积分</div><div class="wx-stat-value val-score">0</div></div>
                       </div>

                       <div class="wx-title"><span class="wx-title-text">当前模组</span></div>
                       <div class="wx-grid-2">
                           <div class="wx-stat-box"><div class="wx-stat-label">名称</div><div class="wx-stat-value val-mod-name">-</div></div>
                           <div class="wx-stat-box"><div class="wx-stat-label">进度</div><div class="wx-stat-value val-mod-prog">-</div></div>
                       </div>
                       
                       <div class="wx-title"><span class="wx-title-text">白烛监控</span></div>
                       <div class="wx-stat-box">
                           <div class="wx-stat-label">恶趣味值 (满60可能降下福利)</div>
                           <div class="wx-stat-value val-evil">0 / 100</div>
                           <div class="wx-kp-bar-container"><div class="wx-kp-bar-fill"></div></div>
                       </div>
                   </div>

                   <div class="wx-section sec-items">
                       <div class="wx-sub-nav">
                           <div class="wx-sub-nav-btn active" data-target="sub-attr">基础属性</div>
                           <div class="wx-sub-nav-btn" data-target="sub-skill">跑团技能</div>
                           <div class="wx-sub-nav-btn" data-target="sub-magic">超凡异能</div>
                           <div class="wx-sub-nav-btn" data-target="sub-item">奇物匣</div>
                       </div>
                       <div class="wx-sub-section sub-attr active"><div class="wx-grid-4 attr-grid"></div></div>
                       <div class="wx-sub-section sub-skill"><div class="skills-list"></div></div>
                       <div class="wx-sub-section sub-magic"><div class="magic-list"></div></div>
                       <div class="wx-sub-section sub-item"><div class="items-list"></div></div>
                   </div>

                   <div class="wx-section sec-bond">
                       <div class="wx-title"><span class="wx-title-text">虚拟队友</span></div>
                       <div class="vp-list"></div>
                       <div class="wx-title"><span class="wx-title-text">核心NPC羁绊</span></div>
                       <div class="npc-list"></div>
                   </div>

                   <div class="wx-section sec-forum">
                       <div class="wx-title">
                           <span class="wx-title-text">回廊大厅动态</span>
                           <button class="wx-refresh-btn" id="btn_refresh_forum"><i class="fas fa-sync-alt"></i> 刷新节点</button>
                       </div>
                       <div class="forum-list"></div>
                   </div>

                   <div class="wx-section sec-shop">
                       <div class="wx-title">
                           <span class="wx-title-text">深渊交易终端</span>
                           <button class="wx-refresh-btn" id="btn_refresh_shop"><i class="fas fa-sync-alt"></i> 联络商人</button>
                       </div>
                       <div class="shop-list"></div>
                   </div>
               </div>
           </div>
       </div>
   `;
   document.body.appendChild(wrapper);

   // ==========================================
   // 4. 拖拽与面板控制逻辑
   // ==========================================
   const triggerBtn = document.getElementById('wx_magic_trigger');
   const panel = document.getElementById('wx_magic_panel');
   const panelHeader = document.getElementById('wx_panel_header');
   const closeBtn = document.getElementById('wx_close_btn');

   // 通用拖拽绑定函数
   function makeDraggable(element, handle) {
       let isDragging = false, hasMoved = false;
       let startX, startY, initialX, initialY;

       handle.addEventListener('pointerdown', (e) => {
           if (e.button !== 0 && e.pointerType === 'mouse') return;
           isDragging = true;
           hasMoved = false;
           startX = e.clientX;
           startY = e.clientY;
           
           // 锁定当前样式为 fixed 时的实际定位像素
           const rect = element.getBoundingClientRect();
           initialX = rect.left;
           initialY = rect.top;
           
           element.style.left = initialX + 'px';
           element.style.top = initialY + 'px';
           element.style.right = 'auto'; // 覆盖原有的 right
           element.style.bottom = 'auto';
           element.style.transform = 'none';

           if (element === triggerBtn) triggerBtn.classList.add('dragging');
           handle.setPointerCapture(e.pointerId);
       });

       handle.addEventListener('pointermove', (e) => {
           if (!isDragging) return;
           const dx = e.clientX - startX;
           const dy = e.clientY - startY;
           if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;
           if (hasMoved) {
               element.style.left = (initialX + dx) + 'px';
               element.style.top = (initialY + dy) + 'px';
           }
       });

       handle.addEventListener('pointerup', (e) => {
           isDragging = false;
           handle.releasePointerCapture(e.pointerId);
           if (element === triggerBtn) triggerBtn.classList.remove('dragging');
           
           // 如果是点击而非拖拽，则触发点击事件
           if (!hasMoved) {
               if (element === triggerBtn) {
                   panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
                   if (panel.style.display === 'flex') populateState(); // 展开时刷新数据
               }
           }
       });
   }

   makeDraggable(triggerBtn, triggerBtn); // 球自己作为拖拽把手
   makeDraggable(panel, panelHeader);     // 面板标题栏作为拖拽把手

   closeBtn.addEventListener('click', () => {
       panel.style.display = 'none';
   });

   // 导航栏切换
   const navItems = panel.querySelectorAll('.wx-nav-item');
   const sections = panel.querySelectorAll('.wx-section');
   navItems.forEach(item => {
       item.addEventListener('click', () => {
           navItems.forEach(n => n.classList.remove('active'));
           sections.forEach(s => s.classList.remove('active'));
           item.classList.add('active');
           panel.querySelector(`.${item.dataset.target}`).classList.add('active');
       });
   });

   // 二级导航切换
   const subNavBtns = panel.querySelectorAll('.wx-sub-nav-btn');
   const subSections = panel.querySelectorAll('.wx-sub-section');
   subNavBtns.forEach(btn => {
       btn.addEventListener('click', () => {
           subNavBtns.forEach(n => n.classList.remove('active'));
           subSections.forEach(s => s.classList.remove('active'));
           btn.classList.add('active');
           panel.querySelector(`.${btn.dataset.target}`).classList.add('active');
       });
   });

   // ==========================================
   // 5. 数据解析与状态更新 (Mvu)
   // ==========================================
   const win = window.parent || window;
   const $ = win.jQuery || window.jQuery;

   function populateState() {
       if (!$) return;
       // 获取所有变量
       let all_variables = {};
       if (typeof win.Mvu !== 'undefined' && win.Mvu.getMvuData) {
           all_variables = win.Mvu.getMvuData({ type: 'chat' }) || {};
       } else if (typeof win.getVariables === 'function') {
           all_variables = win.getVariables({ type: 'chat' }) || {};
       }

       const stat = all_variables.stat_data || all_variables; // 兼容不同存储格式
       const cn = stat['陈宁'] || {};
       const mod = stat['当前模组'] || {};
       const vp = stat['虚拟队友'] || {};
       const npc = stat['核心NPC羁绊'] || {};
       const kp = stat['白烛'] || {};

       $('#wx_magic_panel .val-hp').text(cn.HP !== undefined ? cn.HP : 10);
       $('#wx_magic_panel .val-mp').text(cn.MP !== undefined ? cn.MP : 10);
       $('#wx_magic_panel .val-san').text(cn.理智 !== undefined ? cn.理智 : 50);
       $('#wx_magic_panel .val-score').text(cn.剩余积分 || 0);
       $('#wx_magic_panel .val-mod-name').text(mod.模组名称 || '待分配');
       $('#wx_magic_panel .val-mod-prog').text(mod.探索进度 || '未开始');
       
       const evilVal = kp.恶趣味值 !== undefined ? kp.恶趣味值 : 0;
       $('#wx_magic_panel .val-evil').text(`${evilVal} / 100`);
       $('#wx_magic_panel .wx-kp-bar-fill').css('width', `${evilVal}%`);

       // 基础属性
       const attr = cn.属性面板 || {};
       let attrHtml = '';
       ['力量', '敏捷', '体质', '意志', '智力', '外貌', '阅历', '幸运'].forEach(k => {
           attrHtml += `<div class="wx-stat-box"><div class="wx-stat-label">${k}</div><div class="wx-stat-value">${attr[k] || 60}</div></div>`;
       });
       $('#wx_magic_panel .attr-grid').html(attrHtml || '<div class="wx-empty-msg">暂无数据</div>');

       // 跑团技能
       let skillsHtml = '';
       for (const [k, v] of Object.entries(cn.跑团技能 || {})) {
           skillsHtml += `<div class="wx-list-item skill-item"><div class="wx-item-name">⚔️ ${k}</div><div class="wx-item-desc">${v}</div></div>`;
       }
       $('#wx_magic_panel .skills-list').html(skillsHtml || '<div class="wx-empty-msg">尚未掌握技能</div>');

       // 超凡异能
       let magicHtml = '';
       for (const [k, v] of Object.entries(cn.超凡异能 || {})) {
           magicHtml += `<div class="wx-list-item magic-item"><div class="wx-item-name">🔮 ${k}</div><div class="wx-item-desc">${v}</div></div>`;
       }
       $('#wx_magic_panel .magic-list').html(magicHtml || '<div class="wx-empty-msg">尚未觉醒异能</div>');

       // 奇物匣
       let itemsHtml = '';
       for (const [k, v] of Object.entries(cn.奇物匣 || {})) {
           itemsHtml += `<div class="wx-list-item"><div class="wx-item-name">✦ ${k}</div><div class="wx-item-desc">${v.效果描述 || '无描述'}</div></div>`;
       }
       $('#wx_magic_panel .items-list').html(itemsHtml || '<div class="wx-empty-msg">奇物匣为空</div>');

       // 队友与羁绊
       let vpHtml = '';
       for (const [k, v] of Object.entries(vp)) {
           vpHtml += `<div class="wx-list-item"><div class="wx-item-name">⚝ [${v.职业 || '未知'}] ${k}</div><div class="wx-item-desc">HP: ${v.HP} | MP: ${v.MP} | 状态: ${v.状态}</div></div>`;
       }
       $('#wx_magic_panel .vp-list').html(vpHtml || '<div class="wx-empty-msg">无虚拟队友</div>');

       let npcHtml = '';
       for (const [k, v] of Object.entries(npc)) {
           npcHtml += `<div class="wx-list-item" style="border-left-color: #f48fb1;"><div class="wx-item-name" style="color: #f48fb1;">❦ ${k}</div><div class="wx-item-desc">关系阶段: ${v}</div></div>`;
       }
       $('#wx_magic_panel .npc-list').html(npcHtml || '<div class="wx-empty-msg">暂无羁绊</div>');
   }

   // 监听 Mvu 数据变化自动更新
   if (typeof win.eventOn === 'function' && typeof win.Mvu !== 'undefined') {
       win.eventOn(win.Mvu.events.VARIABLE_UPDATE_ENDED, populateState);
   }

   // ==========================================
   // 6. 后台无感生成逻辑 (无需一问一答)
   // ==========================================
   // 核心后台请求函数 (调用 TavernHelper)
   async function requestBackgroundGeneration(promptText) {
       if (win.TavernHelper && typeof win.TavernHelper.generate === 'function') {
           try {
               return await win.TavernHelper.generate({ user_input: promptText, max_chat_history: 10 });
           } catch (e) {
               throw new Error("后台生成请求失败: " + e.message);
           }
       } else {
           throw new Error("未检测到 TavernHelper 插件，无法进行静默生成！");
       }
   }

   // --- 论坛逻辑 ---
   function parseForumData(text) {
       const posts = [];
       const match = text.match(/<forum_data>([\\s\\S]*?)<\\/forum_data>/) || [null, text]; // 兼容不输出标签的情况
       const blocks = match[1].split(/\\[\\/?帖子\\]/);
       blocks.forEach(block => {
           if (block.trim()) {
               const authorMatch = block.match(/发帖人：(.*)/);
               const titleMatch = block.match(/标题：(.*)/);
               const contentMatch = block.match(/内容：([\\s\\S]*?)(?=点赞：|$)/);
               const likesMatch = block.match(/点赞：(\\d+)/);
               const commentsMatch = block.match(/评论：(.*)/);

               if (titleMatch) {
                   posts.push({
                       author: authorMatch ? authorMatch[1].trim() : '匿名',
                       title: titleMatch[1].trim(),
                       content: contentMatch ? contentMatch[1].trim() : '',
                       likes: likesMatch ? likesMatch[1].trim() : '0',
                       comments: commentsMatch ? commentsMatch[1].split('|').map(c => c.trim()).filter(c => c) : []
                   });
               }
           }
       });
       return posts;
   }

   function renderForum(posts) {
       const container = $('#wx_magic_panel .forum-list');
       if (posts.length === 0) {
           container.html('<div class="wx-empty-msg">大厅静悄悄的... 点击上方按钮获取新消息。</div>');
           return;
       }
       let html = '';
       posts.forEach((p, index) => {
           const commentsHtml = p.comments.map(c => `<div class="wx-comment-item">💬 ${c}</div>`).join('');
           html += `
               <div class="wx-post">
                   <div class="wx-post-header"><span class="wx-post-author">@${p.author}</span></div>
                   <div class="wx-post-title">${p.title}</div>
                   <div class="wx-post-content">${p.content.replace(/\\n/g, '<br>')}</div>
                   <div class="wx-post-footer">
                       <span>👍 ${p.likes} 点赞</span>
                       <span class="wx-action toggle-comments" data-idx="${index}">🗨️ ${p.comments.length} 评论</span>
                   </div>
                   <div class="wx-comments" id="wx_comments_${index}">${commentsHtml || '<div class="wx-comment-item">暂无评论</div>'}</div>
               </div>`;
       });
       container.html(html);
       $('#wx_magic_panel .toggle-comments').off('click').on('click', function() {
           $(`#wx_comments_${$(this).data('idx')}`).slideToggle(200);
       });
   }

   document.getElementById('btn_refresh_forum').addEventListener('click', async function() {
       const btn = this;
       const originalText = btn.innerHTML;
       btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 连接星空中...';
       btn.disabled = true;

       const prompt = `（系统高优先级指令：不进行角色扮演，直接输出结果）
请根据最近的剧情动向，生成 3-4 条“回廊大厅”的虚拟论坛帖子。
【要求】必须严格使用以下格式，不要回复任何多余的开头语：
<forum_data>
[帖子]
发帖人：楼主名称
标题：帖子标题
内容：帖子详细内容
点赞：数字
评论：短评1|短评2|短评3
[/帖子]
</forum_data>`;

       try {
           const responseText = await requestBackgroundGeneration(prompt);
           const posts = parseForumData(responseText);
           renderForum(posts);
           if(posts.length === 0) win.toastr?.warning('未能解析出帖子数据，可能是大模型格式错乱。');
       } catch (e) {
           console.error(e);
           win.toastr?.error(e.message);
       } finally {
           btn.innerHTML = originalText;
           btn.disabled = false;
       }
   });

   // --- 商城逻辑 ---
   function parseShopData(text) {
       const items = [];
       const match = text.match(/<shop_data>([\\s\\S]*?)<\\/shop_data>/) || [null, text];
       const blocks = match[1].split(/\\[\\/?商品\\]/);
       blocks.forEach(block => {
           if (block.trim()) {
               const nameMatch = block.match(/名称：(.*)/);
               const descMatch = block.match(/描述：([\\s\\S]*?)(?=价格：|$)/);
               const priceMatch = block.match(/价格：(.*)/);
               if (nameMatch) {
                   items.push({
                       name: nameMatch[1].trim(),
                       desc: descMatch ? descMatch[1].trim() : '',
                       price: priceMatch ? priceMatch[1].trim() : '???'
                   });
               }
           }
       });
       return items;
   }

   function renderShop(items) {
       const container = $('#wx_magic_panel .shop-list');
       if (items.length === 0) {
           container.html('<div class="wx-empty-msg">终端未连接，点击上方按钮联络深渊商人。</div>');
           return;
       }
       let html = '';
       items.forEach(item => {
           html += `
               <div class="wx-shop-item">
                   <div class="wx-shop-header">
                       <div class="wx-shop-name">🎁 ${item.name}</div>
                       <div class="wx-shop-price-box">
                           <span class="wx-shop-price">${item.price} 积分</span>
                           <button class="wx-buy-btn" data-item="${item.name}">🛒 购入</button>
                       </div>
                   </div>
                   <div class="wx-shop-desc">${item.desc.replace(/\\n/g, '<br>')}</div>
               </div>`;
       });
       container.html(html);

       // 购买动作：保留写入聊天框的功能，以触发Mvu等核心剧情判断
       $('#wx_magic_panel .wx-buy-btn').off('click').on('click', function() {
           const itemName = $(this).data('item');
           const $ta = $(win.document).find('#send_textarea');
           if ($ta.length) {
               const text = `[系统请求：购买 ${itemName}]`;
               const cur = $ta.val() || '';
               if (!cur.includes(text)) {
                   $ta.val((cur.trim() ? cur + '\\n' : '') + text).trigger('input');
                   win.toastr?.success(`已将购买请求填入聊天框，发送即可扣除积分`);
               }
           }
       });
   }

   document.getElementById('btn_refresh_shop').addEventListener('click', async function() {
       const btn = this;
       const originalText = btn.innerHTML;
       btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 召唤商人中...';
       btn.disabled = true;

       const prompt = `（系统高优先级指令：不进行角色扮演，直接输出结果）
请根据最近的剧情与角色处境，生成 3 件深渊交易终端新上架的奇特商品。
【要求】必须严格使用以下格式，不要回复任何多余的开头语：
<shop_data>
[商品]
名称：商品名称
描述：效果描述
价格：数字
[/商品]
</shop_data>`;

       try {
           const responseText = await requestBackgroundGeneration(prompt);
           const items = parseShopData(responseText);
           renderShop(items);
           if(items.length === 0) win.toastr?.warning('商人没有带货来，可能是大模型格式错乱。');
       } catch (e) {
           console.error(e);
           win.toastr?.error(e.message);
       } finally {
           btn.innerHTML = originalText;
           btn.disabled = false;
       }
   });

   // 初始展示空状态
   renderForum([]);
   renderShop([]);

   console.log("星空魔法书加载完毕！拖拽悬浮球或点击展开查看。");
})();