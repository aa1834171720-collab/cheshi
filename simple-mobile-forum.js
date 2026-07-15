// ==================== 简易手机状态栏 + 论坛（MVU / 世界书兼容版） ====================
// 目标：保留标准手机界面、MVU状态栏、世界书兼容、论坛生成；移除壁纸/好友/聊天/CG/尺寸设置等复杂功能。

(function () {
    'use strict';

    const APP_ID = 'simple-mobile-forum';
    const STYLE_ID = `${APP_ID}-styles`;
    const STORAGE_KEY = `${APP_ID}-forum-data`;
    const SETTINGS_KEY = `${APP_ID}-settings`;

    const defaultSettings = {
        forumStyle: '特图的众神剧场',
        usePresetAndWorldBook: true,
        maxPosts: 8,
        maxRepliesPerPost: 4,
        apiUrl: '',
        apiKey: '',
        model: '',
        useCustomApi: false
    };

    let currentMvuData = {};
    let currentPanel = 'status';
    let refreshTimer = null;

    function $(selector, root = document) {
        return root.querySelector(selector);
    }

    function $all(selector, root = document) {
        return Array.from(root.querySelectorAll(selector));
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function safeJsonParse(raw, fallback) {
        try {
            return raw ? JSON.parse(raw) : fallback;
        } catch (error) {
            console.warn('[简易手机论坛] JSON解析失败:', error);
            return fallback;
        }
    }

    function loadSettings() {
        return { ...defaultSettings, ...safeJsonParse(localStorage.getItem(SETTINGS_KEY), {}) };
    }

    function saveSettings(settings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...loadSettings(), ...settings }));
    }

    function notify(message, type = 'info') {
        if (typeof toastr !== 'undefined' && toastr[type]) {
            toastr[type](message, '简易手机论坛');
            return;
        }
        console[type === 'error' ? 'error' : 'log'](`[简易手机论坛] ${message}`);
    }

    // ==================== 样式 ====================
    function injectStyles() {
        if ($(STYLE_ID.startsWith('#') ? STYLE_ID : `#${STYLE_ID}`)) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            #smf-trigger {
                position: fixed;
                right: 24px;
                bottom: 24px;
                width: 56px;
                height: 56px;
                border: none;
                border-radius: 50%;
                background: linear-gradient(135deg, #eef2ff, #c7d2fe);
                color: #312e81;
                box-shadow: 0 12px 30px rgba(49, 46, 129, 0.25);
                z-index: 10000;
                cursor: pointer;
                font-size: 24px;
            }

            #smf-overlay {
                position: fixed;
                inset: 0;
                display: none;
                align-items: center;
                justify-content: center;
                background: rgba(15, 23, 42, 0.45);
                backdrop-filter: blur(6px);
                z-index: 9999;
            }

            #smf-overlay.active { display: flex; }

            #smf-phone {
                width: 375px;
                height: 737px;
                border-radius: 40px;
                padding: 10px;
                background: #111827;
                box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
                box-sizing: border-box;
            }

            #smf-screen {
                height: 100%;
                border-radius: 30px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                background: linear-gradient(180deg, #f8fafc, #eef2ff);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                color: #172033;
            }

            .smf-status-bar {
                height: 48px;
                padding: 0 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: rgba(255, 255, 255, 0.9);
                border-bottom: 1px solid rgba(148, 163, 184, 0.25);
                flex-shrink: 0;
                font-size: 13px;
                font-weight: 650;
            }

            .smf-island {
                width: 118px;
                height: 28px;
                border-radius: 999px;
                background: #0f172a;
                position: relative;
            }

            .smf-island::after {
                content: '';
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: #22c55e;
                position: absolute;
                top: 50%;
                left: 20px;
                transform: translateY(-50%);
            }

            .smf-tabs {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                padding: 12px;
                background: rgba(255, 255, 255, 0.55);
            }

            .smf-tab {
                border: none;
                border-radius: 14px;
                padding: 10px 8px;
                background: rgba(255, 255, 255, 0.75);
                color: #475569;
                cursor: pointer;
                font-weight: 700;
            }

            .smf-tab.active {
                color: #fff;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                box-shadow: 0 8px 18px rgba(99, 102, 241, 0.3);
            }

            #smf-body {
                flex: 1;
                overflow: auto;
                padding: 14px;
            }

            .smf-card {
                background: rgba(255, 255, 255, 0.9);
                border: 1px solid rgba(148, 163, 184, 0.22);
                border-radius: 18px;
                padding: 14px;
                margin-bottom: 12px;
                box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
            }

            .smf-card h3 {
                margin: 0 0 10px;
                font-size: 16px;
                color: #1e1b4b;
            }

            .smf-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 10px;
            }

            .smf-stat {
                border-radius: 14px;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                padding: 10px;
            }

            .smf-stat-label {
                font-size: 11px;
                color: #64748b;
                margin-bottom: 4px;
            }

            .smf-stat-value {
                font-size: 14px;
                font-weight: 800;
                color: #334155;
                word-break: break-word;
            }

            .smf-actions {
                display: flex;
                gap: 8px;
                margin-bottom: 12px;
            }

            .smf-btn {
                border: none;
                border-radius: 12px;
                padding: 10px 12px;
                background: #4f46e5;
                color: #fff;
                cursor: pointer;
                font-weight: 750;
            }

            .smf-btn.secondary { background: #64748b; }
            .smf-btn.danger { background: #ef4444; }
            .smf-btn:disabled { opacity: 0.6; cursor: wait; }

            .smf-post-title {
                margin: 0 0 8px;
                font-size: 15px;
                color: #312e81;
            }

            .smf-meta {
                font-size: 11px;
                color: #64748b;
                margin-bottom: 8px;
            }

            .smf-reply {
                margin-top: 8px;
                padding: 8px 10px;
                border-left: 3px solid #a5b4fc;
                background: #f8fafc;
                border-radius: 8px;
                font-size: 12px;
                line-height: 1.55;
            }

            .smf-field {
                margin-bottom: 10px;
            }

            .smf-field label {
                display: block;
                margin-bottom: 5px;
                font-size: 12px;
                color: #475569;
                font-weight: 700;
            }

            .smf-field input,
            .smf-field textarea,
            .smf-field select {
                width: 100%;
                box-sizing: border-box;
                border: 1px solid #cbd5e1;
                border-radius: 10px;
                padding: 9px;
                background: #fff;
                color: #0f172a;
            }
        `;
        document.head.appendChild(style);
    }

    // ==================== MVU / MUV 数据兼容 ====================
    function extractMvuGameData(raw) {
        if (!raw || typeof raw !== 'object') return {};
        if (raw.stat_data && typeof raw.stat_data === 'object') return raw.stat_data;
        const keys = Object.keys(raw).filter(key => !key.startsWith('$') && key !== 'stat_data');
        return keys.length ? raw : {};
    }

    function getLatestMvuDataFromChat() {
        try {
            const chat = window.SillyTavern?.chat;
            if (!Array.isArray(chat)) return {};
            for (let i = chat.length - 1; i >= 0; i--) {
                const message = chat[i];
                const swipeId = message.swipe_id ?? 0;
                const variables = message.variables?.[swipeId] || message.variables;
                const data = extractMvuGameData(variables);
                if (Object.keys(data).length > 0) return data;
            }
        } catch (error) {
            console.warn('[简易手机论坛] 从SillyTavern.chat读取MVU失败:', error);
        }
        return {};
    }

    function fetchLatestMvuData(updateGlobal = true) {
        let data = getLatestMvuDataFromChat();

        try {
            if (Object.keys(data).length === 0 && typeof window.Mvu !== 'undefined' && window.Mvu.getMvuData) {
                data = extractMvuGameData(window.Mvu.getMvuData({ type: 'message', message_id: 'latest' }));
                if (Object.keys(data).length === 0) {
                    data = extractMvuGameData(window.Mvu.getMvuData({ type: 'chat' }));
                }
            }

            if (Object.keys(data).length === 0 && typeof window.getVariables === 'function') {
                data = extractMvuGameData(window.getVariables({ type: 'chat' }));
            }
        } catch (error) {
            console.warn('[简易手机论坛] 读取MVU失败:', error);
        }

        if (updateGlobal && Object.keys(data).length > 0) currentMvuData = data;
        return data;
    }

    function pickStatusFields(data) {
        const preferred = ['日期', '时间', '地点', '位置', '金币', '金钱', '等级', '生命', '体力', '魔力', '状态', '目标', '当前事件'];
        const result = [];

        preferred.forEach(key => {
            if (data && Object.prototype.hasOwnProperty.call(data, key)) {
                result.push([key, data[key]]);
            }
        });

        if (result.length === 0 && data && typeof data === 'object') {
            Object.entries(data).slice(0, 10).forEach(([key, value]) => {
                if (typeof value !== 'object') result.push([key, value]);
            });
        }

        return result;
    }

    // ==================== 世界书 / 预设兼容 ====================
    function getTavernHelper() {
        return window.TavernHelper || window.tavernHelper || null;
    }

    function collectWorldbookMessages(chatText = '') {
        const helper = getTavernHelper();
        const messages = [];

        try {
            if (helper && typeof helper.getWorldbookNames === 'function' && typeof helper.getWorldbook === 'function') {
                const names = helper.getWorldbookNames() || [];
                names.forEach(name => {
                    const book = helper.getWorldbook(name);
                    const entries = book?.entries || book || [];
                    Object.values(entries).forEach(entry => {
                        if (!entry || entry.disable || entry.enabled === false) return;
                        const keys = [entry.key, entry.keys, entry.primary_keys].flat().filter(Boolean);
                        const shouldInclude = keys.length === 0 || keys.some(key => chatText.includes(String(key)));
                        if (shouldInclude && entry.content) {
                            messages.push({ role: entry.position?.role || 'system', content: String(entry.content) });
                        }
                    });
                });
            }
        } catch (error) {
            console.warn('[简易手机论坛] 读取世界书失败:', error);
        }

        return messages;
    }

    function collectPresetMessages() {
        const helper = getTavernHelper();
        const messages = [];

        try {
            if (helper && typeof helper.getPreset === 'function') {
                const preset = helper.getPreset('in_use');
                (preset?.prompts || [])
                    .filter(prompt => prompt && prompt.enabled && prompt.content)
                    .forEach(prompt => messages.push({ role: prompt.role || 'system', content: String(prompt.content) }));
            }
        } catch (error) {
            console.warn('[简易手机论坛] 读取预设失败:', error);
        }

        return messages;
    }

    function getRecentChatText(limit = 20) {
        try {
            const chat = window.SillyTavern?.chat;
            if (!Array.isArray(chat)) return '';
            return chat.slice(-limit).map(message => message.mes || message.message || '').join('\n');
        } catch (error) {
            return '';
        }
    }

    // ==================== 论坛 ====================
    function loadForumData() {
        return safeJsonParse(localStorage.getItem(STORAGE_KEY), []);
    }

    function saveForumData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function buildForumPrompt(settings) {
        const mvuData = fetchLatestMvuData(true);
        const chatText = getRecentChatText();
        const contextMessages = settings.usePresetAndWorldBook
            ? [...collectPresetMessages(), ...collectWorldbookMessages(chatText)]
            : [];

        const userPrompt = `请基于当前剧情、MVU变量和世界书设定，生成一个角色世界内论坛。
要求：
1. 风格：${settings.forumStyle}。
2. 生成 ${settings.maxPosts} 个帖子，每帖最多 ${settings.maxRepliesPerPost} 条回复。
3. 内容要像世界内角色/旁观者正在论坛讨论，不要解释你在生成文本。
4. 必须只输出JSON数组，不要Markdown代码块。
5. JSON格式：[{"title":"帖子标题","author":"发帖人","content":"正文","replies":[{"author":"回复人","content":"回复内容"}]}]。

当前MVU变量：
${JSON.stringify(mvuData, null, 2)}

最近聊天摘要：
${chatText}`;

        return [...contextMessages, { role: 'user', content: userPrompt }];
    }

    async function callCustomApi(messages, settings) {
        const requestUrl = settings.apiUrl.replace(/\/$/, '').endsWith('/v1')
            ? `${settings.apiUrl.replace(/\/$/, '')}/chat/completions`
            : `${settings.apiUrl.replace(/\/$/, '')}/v1/chat/completions`;

        const response = await fetch(requestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${settings.apiKey}`
            },
            body: JSON.stringify({
                model: settings.model,
                messages,
                temperature: 0.85,
                max_tokens: 4000
            })
        });

        if (!response.ok) {
            throw new Error(`自定义API调用失败：HTTP ${response.status} ${await response.text()}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
    }

    async function callSillyTavernGeneration(messages) {
        if (typeof window.generateRaw === 'function') {
            return window.generateRaw(messages.map(message => `${message.role}: ${message.content}`).join('\n\n'));
        }

        if (typeof window.TavernHelper?.generate === 'function') {
            return window.TavernHelper.generate({ messages });
        }

        throw new Error('没有找到可用的SillyTavern生成接口；请在设置中启用自定义API。');
    }

    function parseForumJson(text) {
        const cleaned = String(text || '').replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
        const start = cleaned.indexOf('[');
        const end = cleaned.lastIndexOf(']');
        if (start === -1 || end === -1 || end <= start) throw new Error('模型输出中未找到JSON数组');
        const data = JSON.parse(cleaned.slice(start, end + 1));
        if (!Array.isArray(data)) throw new Error('论坛数据不是数组');
        return data;
    }

    async function generateForum() {
        const settings = loadSettings();
        const button = $('#smf-generate');
        if (button) {
            button.disabled = true;
            button.textContent = '生成中...';
        }

        try {
            const messages = buildForumPrompt(settings);
            const raw = settings.useCustomApi
                ? await callCustomApi(messages, settings)
                : await callSillyTavernGeneration(messages);
            const forum = parseForumJson(raw);
            saveForumData(forum);
            notify('论坛已生成', 'success');
            renderForumPanel();
        } catch (error) {
            notify(error.message || String(error), 'error');
        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = '刷新论坛';
            }
        }
    }

    // ==================== 渲染 ====================
    function renderStatusPanel() {
        currentPanel = 'status';
        fetchLatestMvuData(true);
        const fields = pickStatusFields(currentMvuData);
        const body = $('#smf-body');
        body.innerHTML = `
            <div class="smf-card">
                <h3>MVU 状态栏</h3>
                ${fields.length ? `<div class="smf-grid">${fields.map(([key, value]) => `
                    <div class="smf-stat">
                        <div class="smf-stat-label">${escapeHtml(key)}</div>
                        <div class="smf-stat-value">${escapeHtml(typeof value === 'object' ? JSON.stringify(value) : value)}</div>
                    </div>
                `).join('')}</div>` : '<p>暂未读取到 MVU/MUV 数据。</p>'}
            </div>
            <div class="smf-card">
                <h3>数据源</h3>
                <p>优先读取 SillyTavern.chat 最新变量，其次读取 Mvu.getMvuData，最后降级到 getVariables。</p>
            </div>
        `;
    }

    function renderForumPanel() {
        currentPanel = 'forum';
        const forum = loadForumData();
        const body = $('#smf-body');
        body.innerHTML = `
            <div class="smf-actions">
                <button class="smf-btn" id="smf-generate">刷新论坛</button>
                <button class="smf-btn danger" id="smf-clear-forum">清空</button>
            </div>
            ${forum.length ? forum.map(post => `
                <article class="smf-card">
                    <h3 class="smf-post-title">${escapeHtml(post.title || '无标题')}</h3>
                    <div class="smf-meta">${escapeHtml(post.author || '匿名')}</div>
                    <div>${escapeHtml(post.content || '')}</div>
                    ${(post.replies || []).map(reply => `
                        <div class="smf-reply"><strong>${escapeHtml(reply.author || '匿名')}：</strong>${escapeHtml(reply.content || '')}</div>
                    `).join('')}
                </article>
            `).join('') : '<div class="smf-card"><h3>暂无论坛内容</h3><p>点击“刷新论坛”生成。</p></div>'}
        `;
        $('#smf-generate')?.addEventListener('click', generateForum);
        $('#smf-clear-forum')?.addEventListener('click', () => {
            saveForumData([]);
            renderForumPanel();
        });
    }

    function renderSettingsPanel() {
        currentPanel = 'settings';
        const settings = loadSettings();
        const body = $('#smf-body');
        body.innerHTML = `
            <div class="smf-card">
                <h3>论坛设置</h3>
                <div class="smf-field">
                    <label>论坛风格</label>
                    <input id="smf-forum-style" value="${escapeHtml(settings.forumStyle)}">
                </div>
                <div class="smf-field">
                    <label>帖子数量</label>
                    <input id="smf-max-posts" type="number" min="1" max="20" value="${escapeHtml(settings.maxPosts)}">
                </div>
                <div class="smf-field">
                    <label>每帖最大回复数</label>
                    <input id="smf-max-replies" type="number" min="0" max="10" value="${escapeHtml(settings.maxRepliesPerPost)}">
                </div>
                <div class="smf-field">
                    <label><input id="smf-use-worldbook" type="checkbox" ${settings.usePresetAndWorldBook ? 'checked' : ''}> 使用预设和世界书</label>
                </div>
                <div class="smf-field">
                    <label><input id="smf-use-custom-api" type="checkbox" ${settings.useCustomApi ? 'checked' : ''}> 使用自定义 OpenAI 兼容 API</label>
                </div>
                <div class="smf-field">
                    <label>API URL</label>
                    <input id="smf-api-url" placeholder="https://api.example.com" value="${escapeHtml(settings.apiUrl)}">
                </div>
                <div class="smf-field">
                    <label>API Key</label>
                    <input id="smf-api-key" type="password" value="${escapeHtml(settings.apiKey)}">
                </div>
                <div class="smf-field">
                    <label>模型</label>
                    <input id="smf-model" placeholder="model-name" value="${escapeHtml(settings.model)}">
                </div>
                <button class="smf-btn" id="smf-save-settings">保存设置</button>
            </div>
        `;

        $('#smf-save-settings')?.addEventListener('click', () => {
            saveSettings({
                forumStyle: $('#smf-forum-style').value.trim() || defaultSettings.forumStyle,
                maxPosts: Math.max(1, parseInt($('#smf-max-posts').value, 10) || defaultSettings.maxPosts),
                maxRepliesPerPost: Math.max(0, parseInt($('#smf-max-replies').value, 10) || defaultSettings.maxRepliesPerPost),
                usePresetAndWorldBook: $('#smf-use-worldbook').checked,
                useCustomApi: $('#smf-use-custom-api').checked,
                apiUrl: $('#smf-api-url').value.trim(),
                apiKey: $('#smf-api-key').value.trim(),
                model: $('#smf-model').value.trim()
            });
            notify('设置已保存', 'success');
        });
    }

    function setActiveTab(panel) {
        $all('.smf-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.panel === panel));
    }

    function renderPanel(panel) {
        setActiveTab(panel);
        if (panel === 'forum') return renderForumPanel();
        if (panel === 'settings') return renderSettingsPanel();
        return renderStatusPanel();
    }

    function renderShell() {
        if ($('#smf-trigger')) return;

        injectStyles();

        const trigger = document.createElement('button');
        trigger.id = 'smf-trigger';
        trigger.type = 'button';
        trigger.title = '打开简易手机论坛';
        trigger.textContent = '📱';

        const overlay = document.createElement('div');
        overlay.id = 'smf-overlay';
        overlay.innerHTML = `
            <div id="smf-phone">
                <div id="smf-screen">
                    <div class="smf-status-bar">
                        <span id="smf-time">--:--</span>
                        <span class="smf-island"></span>
                        <button id="smf-close" title="关闭" style="border:none;background:transparent;font-weight:900;cursor:pointer;">×</button>
                    </div>
                    <div class="smf-tabs">
                        <button class="smf-tab active" data-panel="status">状态</button>
                        <button class="smf-tab" data-panel="forum">论坛</button>
                        <button class="smf-tab" data-panel="settings">设置</button>
                    </div>
                    <main id="smf-body"></main>
                </div>
            </div>
        `;

        document.body.appendChild(trigger);
        document.body.appendChild(overlay);

        trigger.addEventListener('click', openSimpleMobileForum);
        $('#smf-close')?.addEventListener('click', closeSimpleMobileForum);
        overlay.addEventListener('click', event => {
            if (event.target === overlay) closeSimpleMobileForum();
        });
        $all('.smf-tab').forEach(tab => {
            tab.addEventListener('click', () => renderPanel(tab.dataset.panel));
        });

        renderStatusPanel();
        updateClock();
    }

    function updateClock() {
        const time = $('#smf-time');
        if (time) {
            time.textContent = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        }
    }

    function openSimpleMobileForum() {
        renderShell();
        $('#smf-overlay')?.classList.add('active');
        renderPanel(currentPanel || 'status');
        startRefresh();
    }

    function closeSimpleMobileForum() {
        $('#smf-overlay')?.classList.remove('active');
        stopRefresh();
    }

    function startRefresh() {
        stopRefresh();
        refreshTimer = setInterval(() => {
            updateClock();
            if (currentPanel === 'status') renderStatusPanel();
        }, 5000);
    }

    function stopRefresh() {
        if (refreshTimer) clearInterval(refreshTimer);
        refreshTimer = null;
    }

    function initSimpleMobileForum() {
        renderShell();
        fetchLatestMvuData(true);
    }

    function cleanupSimpleMobileForum() {
        stopRefresh();
        $('#smf-trigger')?.remove();
        $('#smf-overlay')?.remove();
        $(`#${STYLE_ID}`)?.remove();
    }

    window.initSimpleMobileForum = initSimpleMobileForum;
    window.openSimpleMobileForum = openSimpleMobileForum;
    window.closeSimpleMobileForum = closeSimpleMobileForum;
    window.cleanupSimpleMobileForum = cleanupSimpleMobileForum;
    window.simpleMobileForumFetchMvu = fetchLatestMvuData;
    window.simpleMobileForumGenerate = generateForum;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSimpleMobileForum);
    } else {
        initSimpleMobileForum();
    }
})();
