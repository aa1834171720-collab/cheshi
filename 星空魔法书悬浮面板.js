/**
* 索托斯的星空魔法书 - 悬浮外挂状态栏 (SillyTavern 适用)
* 融合了悬浮球拖拽、独立 UI 面板、一键发送刷新请求的功能。
*/

(function () {
   // 避免重复加载
   if (document.getElementById('st-magic-book-styles')) {
       return;
   }

   // ==================== 1. 样式注入 ====================
   const styles = `
   <style id="st-magic-book-styles">
     /* --- 悬浮触发球 --- */
     #st-trigger-btn {
       position: fixed;
       top: 50%;
       right: 20px;
       transform: translateY(-50%);
       width: 52px;
       height: 52px;
       border-radius: 50%;
       background: linear-gradient(135deg, #151025 0%, #2a1b4d 100%);
       border: 2px solid rgba(138, 107, 191, 0.6);
       color: #c0a8e6;
       font-size: 24px;
       font-family: serif;
       cursor: move;
       z-index: 10000;
       box-shadow: 0 0 15px rgba(0, 0, 0, 0.8), inset 0 0 10px rgba(138, 107, 191, 0.4);
       display: flex;
       align-items: center;
       justify-content: center;
       user-select: none;
       transition: transform 0.2s, box-shadow 0.2s;
     }
     #st-trigger-btn:hover {
       box-shadow: 0 0 20px rgba(138, 107, 191, 0.8), inset 0 0 15px rgba(192, 168, 230, 0.5);
     }
     #st-trigger-btn.dragging {
       transition: none;
       cursor: grabbing;
     }

     /* --- 覆盖层 / 模态背景 --- */
     #st-magic-overlay {
       position: fixed;
       top: 0; left: 0; width: 100%; height: 100%;
       background: rgba(0, 0, 0, 0.5);
       backdrop-filter: blur(4px);
       z-index: 10001;
       display: none;
       align-items: center;
       justify-content: center;
       font-family: "Microsoft YaHei", "Noto Serif SC", serif;
     }
     #st-magic-overlay.active {
       display: flex;
       animation: wx-fade-in 0.3s ease-out forwards;
     }

     /* --- 主面板 --- */
     .wx-main-panel {
       width: 90%;
       max-width: 800px;
       max-height: 85vh;
       background: 
         radial-gradient(ellipse at top right, rgba(94, 43, 151, 0.15) 0%, transparent 55%),
         radial-gradient(ellipse at bottom left, rgba(17, 34, 104, 0.2) 0%, transparent 55%),
         linear-gradient(180deg, #05060a 0%, #0c0e1a 100%);
       border: 1px solid rgba(103, 86, 140, 0.5);
       border-top: 2px solid rgba(156, 136, 196, 0.7);
       border-radius: 12px;
       display: flex;
       flex-direction: column;
       box-shadow: 0 15px 35px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,0,0,0.9);
       position: relative;
       color: #d1d5db;
     }

     /* 关闭按钮 */
     .wx-close-btn {
       position: absolute;
       top: 10px; right: 15px;
       color: #94a3b8;
       cursor: pointer;
       font-size: 22px;
       line-height: 1;
       z-index: 10;
       transition: color 0.2s;
     }
     .wx-close-btn:hover { color: #e2d4f5; }

     /* --- 导航 --- */
     .wx-nav {
       display: flex;
       background: rgba(8, 10, 18, 0.8);
       border-bottom: 1px solid rgba(103, 86, 140, 0.3);
       border-radius: 12px 12px 0 0;
       padding-right: 40px; /* 避开关闭按钮 */
     }
     .wx-nav-item {
       flex: 1;
       padding: 14px 0;
       text-align: center;
       cursor: pointer;
       font-weight: bold;
       color: #6a7185;
       transition: all 0.3s ease;
       border-right: 1px solid rgba(103, 86, 140, 0.15);
       font-size: 14px;
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

     /* --- 内容区 --- */
     .wx-content {
       padding: 24px;
       overflow-y: auto;
       flex: 1;
     }
     .wx-content::-webkit-scrollbar { width: 6px; }
     .wx-content::-webkit-scrollbar-thumb { background: rgba(103, 86, 140, 0.5); border-radius: 3px; }
     .wx-content::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); }

     .wx-section { display: none; animation: wx-fade-in 0.3s ease-out forwards; }
     .wx-section.active { display: block; }
     @keyframes wx-fade-in {
       from { opacity: 0; transform: translateY(5px); }
       to { opacity: 1; transform: translateY(0); }
     }

     /* --- 通用标题 --- */
     .wx-title {
       font-size: 16px;
       font-weight: bold;
       color: #d1c4e9;
       border-bottom: 1px solid rgba(103, 86, 140, 0.2);
       padding-bottom: 8px;
       margin-bottom: 16px;
       text-shadow: 0 0 8px rgba(209, 196, 233, 0.4);
       display: flex; align-items: center; justify-content: space-between;
     }
     .wx-title-text::before { content: '✧'; color: #8e76ba; margin-right: 8px; font-size: 14px; text-shadow: 0 0 5px #8e76ba; }

     /* --- 按钮 --- */
     .wx-refresh-btn, .wx-buy-btn {
       padding: 6px 12px;
       background: rgba(103, 86, 140, 0.2);
       border: 1px solid rgba(138, 107, 191, 0.5);
       color: #c0a8e6;
       border-radius: 4px; cursor: pointer; font-size: 12px; transition: all 0.2s;
     }
     .wx-refresh-btn:hover, .wx-buy-btn:hover { background: rgba(138, 107, 191, 0.4); color: #fff; }
     .wx-buy-btn { background: rgba(239, 83, 80, 0.15); border-color: rgba(239, 83, 80, 0.4); color: #ef9a9a; }
     .wx-buy-btn:hover { background: rgba(239, 83, 80, 0.3); color: #fff; }

     /* --- 状态栏网格 --- */
     .wx-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 24px; }
     
     .wx-stat-box {
       background: linear-gradient(135deg, rgba(22, 24, 38, 0.7) 0%, rgba(13, 14, 25, 0.9) 100%);
       border: 1px solid rgba(86, 92, 122, 0.3);
       border-top: 1px solid rgba(136, 142, 176, 0.5);
       padding: 12px; border-radius: 8px;
       box-shadow: 0 4px 12px rgba(0,0,0,0.4); transition: transform 0.2s;
     }
     .wx-stat-box:hover { transform: translateY(-2px); border-color: rgba(179, 157, 219, 0.4); }
     .wx-stat-label { font-size: 12px; color: #7b849c; margin-bottom: 4px; text-transform: uppercase; }
     .wx-stat-value { font-size: 16px; font-weight: bold; color: #e2e8f0; }

     /* --- 论坛列表 --- */
     .wx-post {
       background: linear-gradient(135deg, rgba(22, 24, 38, 0.8) 0%, rgba(13, 14, 25, 0.9) 100%);
       border: 1px solid rgba(86, 92, 122, 0.4); border-top: 1px solid rgba(136, 142, 176, 0.6);
       padding: 16px; border-radius: 8px; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);
     }
     .wx-post-header { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; }
     .wx-post-author { color: #90caf9; font-weight: bold; }
     .wx-post-title { font-size: 16px; font-weight: bold; color: #e2e8f0; margin-bottom: 8px; }
     .wx-post-content { font-size: 14px; color: #cbd5e1; line-height: 1.6; margin-bottom: 12px; }
     .wx-comments { margin-top: 10px; padding: 10px; background: rgba(5, 6, 10, 0.6); border-radius: 6px; }
     .wx-comment-item { font-size: 13px; color: #94a3b8; padding: 6px 0; border-bottom: 1px solid rgba(86, 92, 122, 0.2); }
     .wx-comment-item:last-child { border-bottom: none; }

     /* --- 商城列表 --- */
     .wx-shop-item {
       display: flex; flex-direction: column;
       background: linear-gradient(90deg, rgba(38, 22, 24, 0.8) 0%, rgba(25, 13, 14, 0.9) 100%);
       border: 1px solid rgba(122, 86, 86, 0.4); border-left: 4px solid #ef5350;
       padding: 14px 16px; border-radius: 8px; margin-bottom: 12px;
     }
     .wx-shop-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
     .wx-shop-name { font-size: 15px; font-weight: bold; color: #ffcdd2; }
     .wx-shop-price { font-weight: bold; color: #ffd54f; font-size: 13px; padding: 2px 8px; background: rgba(122, 86, 86, 0.6); border-radius: 4px; }
     .wx-shop-desc { font-size: 13px; color: #ef9a9a; line-height: 1.5; margin-bottom: 10px;}

     .wx-empty-msg { text-align: center; color: #64748b; padding: 30px; font-style: italic; font-size: 13px; }
   </style>
   `;
   document.head.insertAdjacentHTML('beforeend', styles);

   // ==================== 2. DOM 结构注入 ====================
   const uiHTML = `
   <!-- 悬浮触发球 -->
   <div id="st-trigger-btn" title="星空魔法书">✦</div>

   <!-- 覆盖层与主面板 -->
   <div id="st-magic-overlay">
     <div class="wx-main-panel">
       <div class="wx-close-btn" id="st-close-btn">✖</div>
       
       <!-- 导航栏 -->
       <div class="wx-nav">
         <div class="wx-nav-item active" data-target="sec-state">核心状态</div>
         <div class="wx-nav-item" data-target="sec-forum">回廊大厅</div>
         <div class="wx-nav-item" data-target="sec-shop">积分商城</div>
       </div>

       <!-- 内容区域 -->
       <div class="wx-content">
         <!-- 状态页 -->
         <div class="wx-section active" id="sec-state">
           <div class="wx-title"><span class="wx-title-text">个人状态 (模拟)</span></div>
           <div class="wx-grid-2">
             <div class="wx-stat-box"><div class="wx-stat-label">HP</div><div class="wx-stat-value" style="color: #ef9a9a;">100 / 100</div></div>
             <div class="wx-stat-box"><div class="wx-stat-label">MP</div><div class="wx-stat-value" style="color: #90caf9;">150 / 150</div></div>
             <div class="wx-stat-box"><div class="wx-stat-label">理智 (SAN)</div><div class="wx-stat-value" style="color: #b39ddb;">75</div></div>
             <div class="wx-stat-box"><div class="wx-stat-label">可用积分</div><div class="wx-stat-value" style="color: #ffd54f;">1200</div></div>
           </div>
           <div style="font-size: 12px; color: #64748b; text-align: center; margin-top: 20px;">* 动态获取变量依赖特定MVU扩展框架，此处提供本地面板占位示范 *</div>
         </div>

         <!-- 论坛页 -->
         <div class="wx-section" id="sec-forum">
           <div class="wx-title">
             <span class="wx-title-text">诸神回廊动态</span>
             <button class="wx-refresh-btn" id="btn-refresh-forum">刷新节点</button>
           </div>
           <div id="st-forum-list"></div>
         </div>

         <!-- 商城页 -->
         <div class="wx-section" id="sec-shop">
           <div class="wx-title">
             <span class="wx-title-text">深渊交易终端</span>
             <button class="wx-refresh-btn" id="btn-refresh-shop">联络商人</button>
           </div>
           <div id="st-shop-list"></div>
         </div>
       </div>
     </div>
   </div>
   `;
   document.body.insertAdjacentHTML('beforeend', uiHTML);

   // ==================== 3. 核心交互逻辑 ====================
   const triggerBtn = document.getElementById('st-trigger-btn');
   const overlay = document.getElementById('st-magic-overlay');
   const closeBtn = document.getElementById('st-close-btn');
   const navItems = document.querySelectorAll('.wx-nav-item');
   const sections = document.querySelectorAll('.wx-section');

   // --- 悬浮球拖拽逻辑 ---
   let isDragging = false;
   let initialX, initialY, startX, startY;

   function handleDragStart(e) {
       initialX = triggerBtn.offsetLeft;
       initialY = triggerBtn.offsetTop;
       startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
       startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
       isDragging = true;
   }

   function handleDragMove(e) {
       if (!isDragging) return;
       const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
       const currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
       const dx = currentX - startX;
       const dy = currentY - startY;

       if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
           triggerBtn.classList.add('dragging');
           e.preventDefault(); // 避免屏幕滚动
       }

       if (triggerBtn.classList.contains('dragging')) {
           triggerBtn.style.left = (initialX + dx) + 'px';
           triggerBtn.style.top = (initialY + dy) + 'px';
           triggerBtn.style.right = 'auto'; // 取消right定位，防止冲突
       }
   }

   function handleDragEnd(e) {
       if (!isDragging) return;
       isDragging = false;

       if (triggerBtn.classList.contains('dragging')) {
           setTimeout(() => triggerBtn.classList.remove('dragging'), 50);
       } else {
           // 没有拖动，认定为点击，打开面板
           openMagicBook();
       }
   }

   // 绑定鼠标和触摸事件
   triggerBtn.addEventListener('mousedown', handleDragStart);
   document.addEventListener('mousemove', handleDragMove);
   document.addEventListener('mouseup', handleDragEnd);

   triggerBtn.addEventListener('touchstart', handleDragStart, { passive: true });
   document.addEventListener('touchmove', handleDragMove, { passive: false });
   document.addEventListener('touchend', handleDragEnd);

   // --- 面板开关控制 ---
   function openMagicBook() {
       overlay.classList.add('active');
       updateBookData(); // 每次打开尝试拉取并渲染聊天记录中的数据
   }

   closeBtn.addEventListener('click', () => {
       overlay.classList.remove('active');
   });

   overlay.addEventListener('click', (e) => {
       // 点击遮罩关闭面板
       if (e.target === overlay) overlay.classList.remove('active');
   });

   // --- 导航栏切换 ---
   navItems.forEach(item => {
       item.addEventListener('click', () => {
           const targetId = item.getAttribute('data-target');
           
           navItems.forEach(n => n.classList.remove('active'));
           sections.forEach(s => s.classList.remove('active'));
           
           item.classList.add('active');
           document.getElementById(targetId).classList.add('active');
       });
   });

   // ==================== 4. 数据解析与渲染 ====================

   // 模拟发送到酒馆的聊天框，无需一问一答，通过隐藏的触发
   function sendToTavernChat(text) {
       try {
           const win = window.parent || window;
           const textarea = win.document.getElementById('send_textarea');
           const sendBtn = win.document.getElementById('send_but');

           if (textarea && sendBtn) {
               textarea.value = text;
               // 触发原生 input 事件，使得酒馆能够捕捉到输入内容
               textarea.dispatchEvent(new Event('input', { bubbles: true }));
               sendBtn.click();
           } else {
               console.warn("未能找到酒馆的聊天输入框和发送按钮。");
           }
       } catch (err) {
           console.error('发送到聊天框失败:', err);
       }
   }

   // 绑定刷新按钮事件
   document.getElementById('btn-refresh-forum').addEventListener('click', () => {
       sendToTavernChat('[系统请求：刷新回廊大厅论坛]');
       overlay.classList.remove('active');
   });

   document.getElementById('btn-refresh-shop').addEventListener('click', () => {
       sendToTavernChat('[系统请求：呼叫深渊商人]');
       overlay.classList.remove('active');
   });

   // 获取当前聊天文本进行解析 (向下兼容提取页面中最后的文本块)
   function getCurrentChatText() {
       try {
           // 尝试通过酒馆暴露的全局对象获取
           const win = window.parent || window;
           if (win.chat && Array.isArray(win.chat) && win.chat.length > 0) {
               // 倒序寻找包含特定标签的消息
               for (let i = win.chat.length - 1; i >= 0; i--) {
                   const mes = win.chat[i].mes;
                   if (mes && (mes.includes('<forum_data>') || mes.includes('<shop_data>'))) {
                       return mes;
                   }
               }
               return win.chat[win.chat.length - 1].mes; // 如果没有找到对应标签，返回最新一条
           }

           // Fallback: 尝试从 DOM 直接抓取 .mes_text
           const chatBlocks = win.document.querySelectorAll('.mes_text');
           if (chatBlocks && chatBlocks.length > 0) {
               for (let i = chatBlocks.length - 1; i >= 0; i--) {
                   const text = chatBlocks[i].innerText || chatBlocks[i].textContent;
                   if (text.includes('<forum_data>') || text.includes('<shop_data>')) {
                       return text;
                   }
               }
               return chatBlocks[chatBlocks.length - 1].innerText || chatBlocks[chatBlocks.length - 1].textContent;
           }
       } catch (e) {
           console.error(e);
       }
       return "";
   }

   // 解析论坛数据 XML 标记
   function parseForumData(text) {
       const posts = [];
       const match = text.match(/<forum_data>([\s\S]*?)<\/forum_data>/);
       if (match && match[1]) {
           const blocks = match[1].split(/\[\/?帖子\]/);
           blocks.forEach(block => {
               if (block.trim()) {
                   const authorMatch = block.match(/发帖人：(.*)/);
                   const titleMatch = block.match(/标题：(.*)/);
                   const contentMatch = block.match(/内容：([\s\S]*?)(?=点赞：|$)/);
                   const likesMatch = block.match(/点赞：(\d+)/);
                   const commentsMatch = block.match(/评论：([\s\S]*?)$/);

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
       }
       return posts;
   }

   // 解析商城数据 XML 标记
   function parseShopData(text) {
       const items = [];
       const match = text.match(/<shop_data>([\s\S]*?)<\/shop_data>/);
       if (match && match[1]) {
           const blocks = match[1].split(/\[\/?商品\]/);
           blocks.forEach(block => {
               if (block.trim()) {
                   const nameMatch = block.match(/名称：(.*)/);
                   const descMatch = block.match(/描述：([\s\S]*?)(?=价格：|$)/);
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
       }
       return items;
   }

   // 渲染论坛列表
   function renderForum(posts) {
       const container = document.getElementById('st-forum-list');
       if (!posts || posts.length === 0) {
           container.innerHTML = '<div class="wx-empty-msg">大厅静悄悄的，暂无新消息。（请触发剧情或点击“刷新节点”）</div>';
           return;
       }

       let html = '';
       posts.forEach((p) => {
           const commentsHtml = p.comments.map(c => `<div class="wx-comment-item">💬 ${c}</div>`).join('');
           html += `
           <div class="wx-post">
               <div class="wx-post-header">
               <span class="wx-post-author">@${p.author}</span>
               <span>👍 ${p.likes}</span>
               </div>
               <div class="wx-post-title">${p.title}</div>
               <div class="wx-post-content">${p.content.replace(/\n/g, '<br>')}</div>
               <div class="wx-comments">
               ${commentsHtml || '<div class="wx-comment-item">暂无评论</div>'}
               </div>
           </div>`;
       });
       container.innerHTML = html;
   }

   // 渲染商城列表
   function renderShop(items) {
       const container = document.getElementById('st-shop-list');
       if (!items || items.length === 0) {
           container.innerHTML = '<div class="wx-empty-msg">终端信号微弱，暂无商品。（请点击“联络商人”）</div>';
           return;
       }

       let html = '';
       items.forEach(item => {
           html += `
           <div class="wx-shop-item">
               <div class="wx-shop-header">
                   <div class="wx-shop-name">🎁 ${item.name}</div>
                   <div class="wx-shop-price">${item.price} 积分</div>
               </div>
               <div class="wx-shop-desc">${item.desc.replace(/\n/g, '<br>')}</div>
               <button class="wx-buy-btn" data-item="${item.name}" style="align-self: flex-end;">🛒 购入物品</button>
           </div>`;
       });
       container.innerHTML = html;

       // 为“购入物品”绑定自动发送聊天请求事件
       const buyBtns = container.querySelectorAll('.wx-buy-btn');
       buyBtns.forEach(btn => {
           btn.addEventListener('click', (e) => {
               const itemName = e.target.getAttribute('data-item');
               sendToTavernChat(`[系统请求：购入 ${itemName}]`);
               overlay.classList.remove('active'); // 发送后关闭面板
           });
       });
   }

   // 更新整个魔法书面板数据
   function updateBookData() {
       const chatText = getCurrentChatText();
       const forumData = parseForumData(chatText);
       const shopData = parseShopData(chatText);
       
       renderForum(forumData);
       renderShop(shopData);

       // 如果想智能跳转，可以加如下逻辑：
       // 如果提取到了商场数据，强制跳转到商场 Tab；提取到论坛则跳转论坛
       if (shopData.length > 0) {
           document.querySelector('.wx-nav-item[data-target="sec-shop"]').click();
       } else if (forumData.length > 0) {
           document.querySelector('.wx-nav-item[data-target="sec-forum"]').click();
       }
   }

})();