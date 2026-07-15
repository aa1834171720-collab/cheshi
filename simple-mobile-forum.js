// ==================== 简易 MUV/MVU 状态栏 ====================
// 只有一个功能：悬浮按钮；点击后打开当前角色卡的 MUV/MVU 状态栏。
// 世界书只读取“当前角色卡绑定的世界书”，避免误连到其他角色/全局世界书。

(function () {
    'use strict';

    const IDS = {
        style: 'simple-muv-status-style',
        button: 'simple-muv-status-button',
        overlay: 'simple-muv-status-overlay',
        panel: 'simple-muv-status-panel',
        body: 'simple-muv-status-body',
        worldbook: 'simple-muv-worldbook-info'
    };

    let refreshTimer = null;

    function getRootWindow() {
        try {
            if (window.parent && window.parent !== window) return window.parent;
        } catch (error) {
            // 跨域 iframe 不可访问时退回当前窗口。
        }
        return window;
    }

    function getById(id) {
        return document.getElementById(id);
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function isPlainObject(value) {
        return Object.prototype.toString.call(value) === '[object Object]';
    }

    function extractMvuData(raw) {
        if (!raw || typeof raw !== 'object') return {};
        if (isPlainObject(raw.stat_data)) return raw.stat_data;

        const dataKeys = Object.keys(raw).filter(key => !key.startsWith('$') && key !== 'stat_data');
        return dataKeys.length > 0 ? raw : {};
    }

    function getLatestMvuFromChat(rootWindow) {
        try {
            const chat = rootWindow.SillyTavern?.chat || rootWindow.chat;
            if (!Array.isArray(chat)) return {};

            for (let index = chat.length - 1; index >= 0; index--) {
                const message = chat[index];
                const swipeId = message.swipe_id ?? 0;
                const variables = message.variables?.[swipeId] || message.variables;
                const data = extractMvuData(variables);
                if (Object.keys(data).length > 0) return data;
            }
        } catch (error) {
            console.warn('[简易MUV状态栏] 从聊天记录读取变量失败:', error);
        }
        return {};
    }

    function getLatestMvuData() {
        const rootWindow = getRootWindow();
        let data = getLatestMvuFromChat(rootWindow);

        try {
            const mvuApi = rootWindow.Mvu || window.Mvu;
            if (Object.keys(data).length === 0 && mvuApi?.getMvuData) {
                data = extractMvuData(mvuApi.getMvuData({ type: 'message', message_id: 'latest' }));
                if (Object.keys(data).length === 0) {
                    data = extractMvuData(mvuApi.getMvuData({ type: 'chat' }));
                }
            }

            const getVariables = rootWindow.getVariables || window.getVariables;
            if (Object.keys(data).length === 0 && typeof getVariables === 'function') {
                data = extractMvuData(getVariables({ type: 'chat' }));
            }
        } catch (error) {
            console.warn('[简易MUV状态栏] 读取MUV/MVU变量失败:', error);
        }

        return data;
    }

    function getCurrentCharacterName(rootWindow) {
        try {
            return rootWindow.name2
                || rootWindow.SillyTavern?.name2
                || rootWindow.characters?.[rootWindow.this_chid]?.name
                || rootWindow.character?.name
                || '当前角色';
        } catch (error) {
            return '当前角色';
        }
    }

    async function getCurrentCharacterWorldbookInfo() {
        const rootWindow = getRootWindow();
        const helper = rootWindow.TavernHelper || window.TavernHelper;
        const characterName = getCurrentCharacterName(rootWindow);

        if (!helper || typeof helper.getCharWorldbookNames !== 'function') {
            return {
                characterName,
                names: [],
                entries: [],
                message: '未检测到 TavernHelper.getCharWorldbookNames，无法读取当前角色卡绑定世界书。'
            };
        }

        try {
            const charWorldbooks = await helper.getCharWorldbookNames('current');
            const names = [
                charWorldbooks?.primary,
                ...(charWorldbooks?.additional || [])
            ].filter(Boolean);

            const entries = [];
            if (typeof helper.getWorldbook === 'function') {
                for (const name of names) {
                    try {
                        const bookEntries = await helper.getWorldbook(name);
                        const normalizedEntries = Array.isArray(bookEntries)
                            ? bookEntries
                            : Object.values(bookEntries || {});

                        normalizedEntries
                            .filter(entry => entry && entry.enabled !== false && entry.disable !== true)
                            .slice(0, 12)
                            .forEach(entry => entries.push({
                                book: name,
                                title: entry.comment || entry.name || entry.uid || '未命名条目',
                                keys: [entry.key, entry.keys, entry.primary_keys].flat().filter(Boolean).join('、'),
                                content: entry.content || ''
                            }));
                    } catch (error) {
                        entries.push({ book: name, title: '读取失败', keys: '', content: error.message || String(error) });
                    }
                }
            }

            return {
                characterName,
                names,
                entries,
                message: names.length > 0
                    ? '已读取当前角色卡绑定世界书。'
                    : '当前角色卡没有绑定主世界书或附加世界书。'
            };
        } catch (error) {
            return {
                characterName,
                names: [],
                entries: [],
                message: `读取当前角色卡世界书失败：${error.message || String(error)}`
            };
        }
    }

    function flattenStatusData(data, prefix = '', output = []) {
        Object.entries(data || {}).forEach(([key, value]) => {
            const label = prefix ? `${prefix}.${key}` : key;
            if (isPlainObject(value) && output.length < 80) {
                flattenStatusData(value, label, output);
                return;
            }
            if (Array.isArray(value)) {
                output.push([label, value.map(item => typeof item === 'object' ? JSON.stringify(item) : item).join('、')]);
                return;
            }
            output.push([label, value]);
        });
        return output;
    }

    function injectStyles() {
        if (getById(IDS.style)) return;

        const style = document.createElement('style');
        style.id = IDS.style;
        style.textContent = `
            #${IDS.button} {
                position: fixed;
                right: 22px;
                bottom: 22px;
                width: 56px;
                height: 56px;
                border: none;
                border-radius: 50%;
                background: linear-gradient(135deg, #f8fafc, #c7d2fe);
                color: #312e81;
                box-shadow: 0 10px 28px rgba(15, 23, 42, 0.28);
                cursor: pointer;
                z-index: 10000;
                font-size: 25px;
            }

            #${IDS.overlay} {
                position: fixed;
                inset: 0;
                display: none;
                align-items: center;
                justify-content: center;
                background: rgba(15, 23, 42, 0.5);
                backdrop-filter: blur(5px);
                z-index: 9999;
            }

            #${IDS.overlay}.active { display: flex; }

            #${IDS.panel} {
                width: 375px;
                height: 737px;
                max-width: calc(100vw - 24px);
                max-height: calc(100vh - 24px);
                border-radius: 36px;
                padding: 10px;
                background: #111827;
                box-shadow: 0 26px 70px rgba(0, 0, 0, 0.46);
                box-sizing: border-box;
            }

            .simple-muv-screen {
                height: 100%;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                border-radius: 28px;
                background: linear-gradient(180deg, #f8fafc, #eef2ff);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                color: #172033;
            }

            .simple-muv-topbar {
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 15px;
                border-bottom: 1px solid rgba(148, 163, 184, 0.28);
                background: rgba(255, 255, 255, 0.9);
                flex-shrink: 0;
            }

            .simple-muv-title { font-weight: 800; color: #1e1b4b; }

            .simple-muv-close {
                border: none;
                background: transparent;
                color: #334155;
                font-size: 24px;
                font-weight: 900;
                cursor: pointer;
            }

            #${IDS.body} {
                flex: 1;
                overflow: auto;
                padding: 14px;
            }

            .simple-muv-card {
                margin-bottom: 12px;
                padding: 13px;
                border: 1px solid rgba(148, 163, 184, 0.25);
                border-radius: 16px;
                background: rgba(255, 255, 255, 0.92);
                box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
            }

            .simple-muv-card h3 {
                margin: 0 0 9px;
                font-size: 15px;
                color: #312e81;
            }

            .simple-muv-row {
                display: grid;
                grid-template-columns: minmax(92px, 38%) 1fr;
                gap: 8px;
                padding: 8px 0;
                border-top: 1px solid #e2e8f0;
                font-size: 13px;
                line-height: 1.45;
            }

            .simple-muv-row:first-of-type { border-top: none; }
            .simple-muv-key { color: #64748b; font-weight: 700; word-break: break-word; }
            .simple-muv-value { color: #0f172a; word-break: break-word; white-space: pre-wrap; }
            .simple-muv-muted { color: #64748b; font-size: 12px; line-height: 1.55; }
            .simple-muv-refresh {
                width: 100%;
                margin-top: 4px;
                border: none;
                border-radius: 12px;
                padding: 10px 12px;
                background: #4f46e5;
                color: #fff;
                cursor: pointer;
                font-weight: 800;
            }
        `;
        document.head.appendChild(style);
    }

    function renderStatus(data) {
        const rows = flattenStatusData(data).slice(0, 80);
        if (rows.length === 0) {
            return '<div class="simple-muv-card"><h3>MUV/MVU 状态</h3><p class="simple-muv-muted">暂未读取到 MUV/MVU 数据。请确认变量框架已初始化，且最新消息中存在 stat_data 或 MVU 变量。</p></div>';
        }

        return `
            <div class="simple-muv-card">
                <h3>MUV/MVU 状态</h3>
                ${rows.map(([key, value]) => `
                    <div class="simple-muv-row">
                        <div class="simple-muv-key">${escapeHtml(key)}</div>
                        <div class="simple-muv-value">${escapeHtml(typeof value === 'object' ? JSON.stringify(value) : value)}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderWorldbook(info) {
        const names = info.names.length > 0 ? info.names.join('、') : '无';
        const entryHtml = info.entries.length > 0
            ? info.entries.map(entry => `
                <div class="simple-muv-row">
                    <div class="simple-muv-key">${escapeHtml(entry.book)}</div>
                    <div class="simple-muv-value"><strong>${escapeHtml(entry.title)}</strong>${entry.keys ? `<br><span class="simple-muv-muted">关键词：${escapeHtml(entry.keys)}</span>` : ''}</div>
                </div>
            `).join('')
            : '<p class="simple-muv-muted">没有可展示的启用条目，或当前环境不支持读取世界书条目。</p>';

        return `
            <div class="simple-muv-card" id="${IDS.worldbook}">
                <h3>当前角色世界书</h3>
                <div class="simple-muv-row">
                    <div class="simple-muv-key">角色</div>
                    <div class="simple-muv-value">${escapeHtml(info.characterName)}</div>
                </div>
                <div class="simple-muv-row">
                    <div class="simple-muv-key">绑定世界书</div>
                    <div class="simple-muv-value">${escapeHtml(names)}</div>
                </div>
                <p class="simple-muv-muted">${escapeHtml(info.message)}</p>
                ${entryHtml}
            </div>
        `;
    }

    async function refreshPanel() {
        const body = getById(IDS.body);
        if (!body) return;

        const data = getLatestMvuData();
        body.innerHTML = `${renderStatus(data)}<div class="simple-muv-card" id="${IDS.worldbook}"><h3>当前角色世界书</h3><p class="simple-muv-muted">正在读取当前角色卡绑定的世界书...</p></div>`;

        const worldbookInfo = await getCurrentCharacterWorldbookInfo();
        const worldbookNode = getById(IDS.worldbook);
        if (worldbookNode) {
            worldbookNode.outerHTML = renderWorldbook(worldbookInfo);
        } else {
            body.insertAdjacentHTML('beforeend', renderWorldbook(worldbookInfo));
        }
    }

    function openPanel() {
        const overlay = getById(IDS.overlay);
        if (!overlay) return;
        overlay.classList.add('active');
        refreshPanel();
        stopRefreshTimer();
        refreshTimer = setInterval(refreshPanel, 5000);
    }

    function closePanel() {
        const overlay = getById(IDS.overlay);
        if (overlay) overlay.classList.remove('active');
        stopRefreshTimer();
    }

    function stopRefreshTimer() {
        if (refreshTimer) clearInterval(refreshTimer);
        refreshTimer = null;
    }

    function createUi() {
        if (getById(IDS.button)) return;
        injectStyles();

        const button = document.createElement('button');
        button.id = IDS.button;
        button.type = 'button';
        button.title = '打开 MUV/MVU 状态栏';
        button.textContent = '📱';
        button.addEventListener('click', openPanel);

        const overlay = document.createElement('div');
        overlay.id = IDS.overlay;
        overlay.innerHTML = `
            <div id="${IDS.panel}">
                <div class="simple-muv-screen">
                    <div class="simple-muv-topbar">
                        <div class="simple-muv-title">MUV 状态栏</div>
                        <button class="simple-muv-close" type="button" title="关闭">×</button>
                    </div>
                    <div id="${IDS.body}"></div>
                    <div style="padding: 0 14px 14px;"><button class="simple-muv-refresh" type="button">刷新状态</button></div>
                </div>
            </div>
        `;

        overlay.addEventListener('click', event => {
            if (event.target === overlay) closePanel();
        });
        overlay.querySelector('.simple-muv-close').addEventListener('click', closePanel);
        overlay.querySelector('.simple-muv-refresh').addEventListener('click', refreshPanel);

        document.body.appendChild(button);
        document.body.appendChild(overlay);
    }

    function cleanup() {
        stopRefreshTimer();
        getById(IDS.button)?.remove();
        getById(IDS.overlay)?.remove();
        getById(IDS.style)?.remove();
    }

    window.initSimpleMuvStatusBar = createUi;
    window.openSimpleMuvStatusBar = openPanel;
    window.closeSimpleMuvStatusBar = closePanel;
    window.refreshSimpleMuvStatusBar = refreshPanel;
    window.cleanupSimpleMuvStatusBar = cleanup;

    // 兼容上一版暴露名，避免用户已经引用旧函数时报错。
    window.initSimpleMobileForum = createUi;
    window.openSimpleMobileForum = openPanel;
    window.closeSimpleMobileForum = closePanel;
    window.cleanupSimpleMobileForum = cleanup;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUi);
    } else {
        createUi();
    }
})();
