// ==================== 简易手机 MUV/MVU 状态栏 ====================
// 按 mobile-phone.js / cheshi.js 的运行方式写：jQuery ready + 等待 Mvu + body.append 注入。
// 功能只保留：悬浮按钮 -> 打开标准手机尺寸状态栏 -> 读取 MUV/MVU -> 读取当前角色卡绑定世界书。

(function () {
    'use strict';

    const SIMPLE_PHONE_IDS = {
        style: 'simple-muv-phone-styles',
        trigger: 'simple-muv-trigger-btn',
        overlay: 'simple-muv-phone-overlay',
        body: 'simple-muv-phone-body'
    };

    let refreshTimer = null;

    function getHostWindow() {
        try {
            if (window.parent && window.parent !== window) return window.parent;
        } catch (e) {
            // srcdoc / 跨域 iframe 下父窗口可能不可访问。
        }
        return window;
    }

    function getJQuery() {
        const host = getHostWindow();
        return window.jQuery || window.$ || host.jQuery || host.$ || null;
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function isObject(value) {
        return Object.prototype.toString.call(value) === '[object Object]';
    }

    function injectSimpleMuvStyles() {
        const $ = getJQuery();
        if ($ && $(`#${SIMPLE_PHONE_IDS.style}`).length) return;
        if (!$ && document.getElementById(SIMPLE_PHONE_IDS.style)) return;

        const css = `
            #${SIMPLE_PHONE_IDS.trigger} {
                position: fixed !important;
                right: 24px !important;
                bottom: 24px !important;
                width: 60px !important;
                height: 60px !important;
                border-radius: 50% !important;
                border: 1px solid #d4d4d4 !important;
                background: linear-gradient(135deg, #e3e3e3 0%, #c4c4c4 100%) !important;
                box-shadow: 0 4px 6px rgba(0,0,0,.05), 0 10px 15px rgba(0,0,0,.08) !important;
                color: #333 !important;
                cursor: pointer !important;
                z-index: 10000 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 26px !important;
                user-select: none !important;
            }
            #${SIMPLE_PHONE_IDS.trigger}:hover {
                transform: translateY(-3px) !important;
                background: linear-gradient(135deg, #f0f0f0 0%, #dcdcdc 100%) !important;
            }
            #${SIMPLE_PHONE_IDS.overlay} {
                position: fixed !important;
                inset: 0 !important;
                width: 100% !important;
                height: 100% !important;
                display: none !important;
                align-items: center !important;
                justify-content: center !important;
                background: rgba(0,0,0,.5) !important;
                backdrop-filter: blur(5px) !important;
                z-index: 9999 !important;
            }
            #${SIMPLE_PHONE_IDS.overlay}.active { display: flex !important; }
            .simple-muv-phone-frame {
                width: 375px !important;
                height: 737px !important;
                max-width: calc(100vw - 24px) !important;
                max-height: calc(100vh - 24px) !important;
                border-radius: 40px !important;
                padding: 8px !important;
                background: #333 !important;
                box-shadow: 0 20px 40px rgba(0,0,0,.5) !important;
                overflow: hidden !important;
                box-sizing: border-box !important;
            }
            .simple-muv-phone-screen {
                width: 100% !important;
                height: 100% !important;
                display: flex !important;
                flex-direction: column !important;
                overflow: hidden !important;
                border-radius: 32px !important;
                background: linear-gradient(180deg, #fff5f7 0%, #eef2ff 100%) !important;
                color: #172033 !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
            }
            .simple-muv-status-bar {
                height: 44px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                flex-shrink: 0 !important;
                padding: 0 14px !important;
                background: rgba(255,255,255,.92) !important;
                border-bottom: 1px solid rgba(0,0,0,.08) !important;
                box-sizing: border-box !important;
                font-size: 13px !important;
                font-weight: 700 !important;
            }
            .simple-muv-island {
                width: 118px !important;
                height: 28px !important;
                border-radius: 15px !important;
                background: #111 !important;
            }
            .simple-muv-close {
                border: none !important;
                background: transparent !important;
                color: #334155 !important;
                font-size: 22px !important;
                font-weight: 900 !important;
                cursor: pointer !important;
                padding: 4px 6px !important;
            }
            #${SIMPLE_PHONE_IDS.body} {
                flex: 1 !important;
                overflow-y: auto !important;
                padding: 14px !important;
                box-sizing: border-box !important;
            }
            .simple-muv-card {
                margin-bottom: 12px !important;
                padding: 13px !important;
                border-radius: 16px !important;
                background: rgba(255,255,255,.92) !important;
                border: 1px solid rgba(148,163,184,.25) !important;
                box-shadow: 0 5px 14px rgba(15,23,42,.08) !important;
            }
            .simple-muv-card h3 {
                margin: 0 0 10px !important;
                color: #312e81 !important;
                font-size: 15px !important;
            }
            .simple-muv-row {
                display: grid !important;
                grid-template-columns: minmax(92px, 38%) 1fr !important;
                gap: 8px !important;
                padding: 8px 0 !important;
                border-top: 1px solid #e2e8f0 !important;
                font-size: 13px !important;
                line-height: 1.45 !important;
            }
            .simple-muv-row:first-of-type { border-top: none !important; }
            .simple-muv-key { color: #64748b !important; font-weight: 800 !important; word-break: break-word !important; }
            .simple-muv-value { color: #0f172a !important; word-break: break-word !important; white-space: pre-wrap !important; }
            .simple-muv-muted { color: #64748b !important; font-size: 12px !important; line-height: 1.55 !important; }
            .simple-muv-refresh {
                width: calc(100% - 28px) !important;
                margin: 0 14px 14px !important;
                border: none !important;
                border-radius: 12px !important;
                padding: 10px 12px !important;
                background: #4f46e5 !important;
                color: #fff !important;
                cursor: pointer !important;
                font-weight: 800 !important;
            }
        `;

        if ($) {
            $('head').append(`<style id="${SIMPLE_PHONE_IDS.style}">${css}</style>`);
        } else {
            const style = document.createElement('style');
            style.id = SIMPLE_PHONE_IDS.style;
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    function extractMvuData(raw) {
        if (!raw || typeof raw !== 'object') return {};
        if (isObject(raw.stat_data)) return raw.stat_data;
        const dataKeys = Object.keys(raw).filter(key => !key.startsWith('$') && key !== 'stat_data');
        return dataKeys.length ? raw : {};
    }

    function getLatestMvuFromChat(host) {
        try {
            const chat = host.SillyTavern?.chat || host.chat || window.SillyTavern?.chat || window.chat;
            if (!Array.isArray(chat)) return {};
            for (let index = chat.length - 1; index >= 0; index--) {
                const message = chat[index];
                const swipeId = message.swipe_id ?? 0;
                const variables = message.variables?.[swipeId] || message.variables;
                const data = extractMvuData(variables);
                if (Object.keys(data).length) return data;
            }
        } catch (e) {
            console.warn('[简易MUV状态栏] 从聊天记录读取失败:', e);
        }
        return {};
    }

    function getLatestMvuData() {
        const host = getHostWindow();
        let data = getLatestMvuFromChat(host);

        try {
            const mvu = host.Mvu || window.Mvu || (typeof Mvu !== 'undefined' ? Mvu : null);
            if (!Object.keys(data).length && mvu && typeof mvu.getMvuData === 'function') {
                data = extractMvuData(mvu.getMvuData({ type: 'message', message_id: 'latest' }));
                if (!Object.keys(data).length) {
                    data = extractMvuData(mvu.getMvuData({ type: 'chat' }));
                }
            }

            const getVariablesFn = host.getVariables || window.getVariables || (typeof getVariables !== 'undefined' ? getVariables : null);
            if (!Object.keys(data).length && typeof getVariablesFn === 'function') {
                data = extractMvuData(getVariablesFn({ type: 'chat' }));
            }
        } catch (e) {
            console.warn('[简易MUV状态栏] 读取MUV/MVU失败:', e);
        }

        return data;
    }

    function flattenData(data, prefix = '', output = []) {
        Object.entries(data || {}).forEach(([key, value]) => {
            const label = prefix ? `${prefix}.${key}` : key;
            if (isObject(value) && output.length < 80) {
                flattenData(value, label, output);
            } else if (Array.isArray(value)) {
                output.push([label, value.map(item => isObject(item) ? JSON.stringify(item) : item).join('、')]);
            } else {
                output.push([label, value]);
            }
        });
        return output;
    }

    function getCurrentCharacterName(host) {
        try {
            return host.name2 || host.SillyTavern?.name2 || host.characters?.[host.this_chid]?.name || window.name2 || '当前角色';
        } catch (e) {
            return '当前角色';
        }
    }

    async function getCurrentCharacterWorldbookInfo() {
        const host = getHostWindow();
        const helper = host.TavernHelper || window.TavernHelper;
        const characterName = getCurrentCharacterName(host);

        if (!helper || typeof helper.getCharWorldbookNames !== 'function') {
            return { characterName, names: [], entries: [], message: 'TavernHelper.getCharWorldbookNames 不可用。' };
        }

        try {
            const charWorldbooks = await helper.getCharWorldbookNames('current');
            const names = [charWorldbooks?.primary, ...(charWorldbooks?.additional || [])].filter(Boolean);
            const entries = [];

            if (typeof helper.getWorldbook === 'function') {
                for (const name of names) {
                    try {
                        const book = await helper.getWorldbook(name);
                        const list = Array.isArray(book) ? book : Object.values(book || {});
                        list.filter(entry => entry && entry.enabled !== false && entry.disable !== true)
                            .slice(0, 12)
                            .forEach(entry => entries.push({
                                book: name,
                                title: entry.comment || entry.name || entry.uid || '未命名条目',
                                keys: [entry.key, entry.keys, entry.primary_keys].flat().filter(Boolean).join('、')
                            }));
                    } catch (e) {
                        entries.push({ book: name, title: '读取失败', keys: e.message || String(e) });
                    }
                }
            }

            return {
                characterName,
                names,
                entries,
                message: names.length ? '已连接当前角色卡绑定世界书。' : '当前角色卡没有绑定世界书。'
            };
        } catch (e) {
            return { characterName, names: [], entries: [], message: `读取当前角色世界书失败：${e.message || String(e)}` };
        }
    }

    function renderMvuCard(data) {
        const rows = flattenData(data).slice(0, 80);
        if (!rows.length) {
            return `
                <div class="simple-muv-card">
                    <h3>MUV/MVU 状态</h3>
                    <div class="simple-muv-muted">暂未读取到 MUV/MVU 数据。请确认当前消息已写入 stat_data，或 Mvu 已初始化。</div>
                </div>
            `;
        }
        return `
            <div class="simple-muv-card">
                <h3>MUV/MVU 状态</h3>
                ${rows.map(([key, value]) => `
                    <div class="simple-muv-row">
                        <div class="simple-muv-key">${escapeHtml(key)}</div>
                        <div class="simple-muv-value">${escapeHtml(isObject(value) ? JSON.stringify(value) : value)}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderWorldbookCard(info) {
        return `
            <div class="simple-muv-card">
                <h3>当前角色世界书</h3>
                <div class="simple-muv-row">
                    <div class="simple-muv-key">角色</div>
                    <div class="simple-muv-value">${escapeHtml(info.characterName)}</div>
                </div>
                <div class="simple-muv-row">
                    <div class="simple-muv-key">绑定</div>
                    <div class="simple-muv-value">${escapeHtml(info.names.length ? info.names.join('、') : '无')}</div>
                </div>
                <div class="simple-muv-muted" style="margin-top:8px;">${escapeHtml(info.message)}</div>
                ${info.entries.length ? info.entries.map(entry => `
                    <div class="simple-muv-row">
                        <div class="simple-muv-key">${escapeHtml(entry.book)}</div>
                        <div class="simple-muv-value"><strong>${escapeHtml(entry.title)}</strong>${entry.keys ? `<br><span class="simple-muv-muted">关键词：${escapeHtml(entry.keys)}</span>` : ''}</div>
                    </div>
                `).join('') : ''}
            </div>
        `;
    }

    async function refreshSimpleMuvPanel() {
        const $ = getJQuery();
        const data = getLatestMvuData();
        const loadingHtml = `${renderMvuCard(data)}<div class="simple-muv-card"><h3>当前角色世界书</h3><div class="simple-muv-muted">正在读取当前角色卡绑定世界书...</div></div>`;

        if ($) $(`#${SIMPLE_PHONE_IDS.body}`).html(loadingHtml);
        else document.getElementById(SIMPLE_PHONE_IDS.body).innerHTML = loadingHtml;

        const worldbookInfo = await getCurrentCharacterWorldbookInfo();
        const finalHtml = `${renderMvuCard(data)}${renderWorldbookCard(worldbookInfo)}`;
        if ($) $(`#${SIMPLE_PHONE_IDS.body}`).html(finalHtml);
        else document.getElementById(SIMPLE_PHONE_IDS.body).innerHTML = finalHtml;
    }

    function openSimpleMuvPanel() {
        const $ = getJQuery();
        if ($) $(`#${SIMPLE_PHONE_IDS.overlay}`).addClass('active');
        else document.getElementById(SIMPLE_PHONE_IDS.overlay)?.classList.add('active');

        refreshSimpleMuvPanel();
        stopRefreshTimer();
        refreshTimer = setInterval(refreshSimpleMuvPanel, 5000);
    }

    function closeSimpleMuvPanel() {
        const $ = getJQuery();
        if ($) $(`#${SIMPLE_PHONE_IDS.overlay}`).removeClass('active');
        else document.getElementById(SIMPLE_PHONE_IDS.overlay)?.classList.remove('active');
        stopRefreshTimer();
    }

    function stopRefreshTimer() {
        if (refreshTimer) clearInterval(refreshTimer);
        refreshTimer = null;
    }

    function cleanupSimpleMuvPhone() {
        const $ = getJQuery();
        stopRefreshTimer();
        if ($) {
            $(`#${SIMPLE_PHONE_IDS.trigger}`).off().remove();
            $(`#${SIMPLE_PHONE_IDS.overlay}`).off().remove();
            $(`#${SIMPLE_PHONE_IDS.style}`).remove();
        } else {
            document.getElementById(SIMPLE_PHONE_IDS.trigger)?.remove();
            document.getElementById(SIMPLE_PHONE_IDS.overlay)?.remove();
            document.getElementById(SIMPLE_PHONE_IDS.style)?.remove();
        }
    }

    function buildSimpleMuvDom() {
        const $ = getJQuery();
        cleanupSimpleMuvPhone();
        injectSimpleMuvStyles();

        const html = `
            <button id="${SIMPLE_PHONE_IDS.trigger}" type="button" title="打开 MUV/MVU 状态栏">✧</button>
            <div id="${SIMPLE_PHONE_IDS.overlay}">
                <div class="simple-muv-phone-frame">
                    <div class="simple-muv-phone-screen">
                        <div class="simple-muv-status-bar">
                            <span>MUV</span>
                            <span class="simple-muv-island"></span>
                            <button class="simple-muv-close" type="button" title="关闭">×</button>
                        </div>
                        <div id="${SIMPLE_PHONE_IDS.body}"></div>
                        <button class="simple-muv-refresh" type="button">刷新状态</button>
                    </div>
                </div>
            </div>
        `;

        if ($) {
            $('body').append(html);
            $(`#${SIMPLE_PHONE_IDS.trigger}`).off('click.simpleMuv').on('click.simpleMuv', openSimpleMuvPanel);
            $(`#${SIMPLE_PHONE_IDS.overlay}`).off('click.simpleMuv').on('click.simpleMuv', function (event) {
                if (event.target.id === SIMPLE_PHONE_IDS.overlay) closeSimpleMuvPanel();
            });
            $('.simple-muv-close').off('click.simpleMuv').on('click.simpleMuv', closeSimpleMuvPanel);
            $('.simple-muv-refresh').off('click.simpleMuv').on('click.simpleMuv', refreshSimpleMuvPanel);
        } else {
            document.body.insertAdjacentHTML('beforeend', html);
            document.getElementById(SIMPLE_PHONE_IDS.trigger).addEventListener('click', openSimpleMuvPanel);
            document.getElementById(SIMPLE_PHONE_IDS.overlay).addEventListener('click', event => {
                if (event.target.id === SIMPLE_PHONE_IDS.overlay) closeSimpleMuvPanel();
            });
            document.querySelector('.simple-muv-close').addEventListener('click', closeSimpleMuvPanel);
            document.querySelector('.simple-muv-refresh').addEventListener('click', refreshSimpleMuvPanel);
        }
    }

    async function initializeSimpleMuvPhone() {
        try {
            if (typeof waitGlobalInitialized === 'function') {
                await waitGlobalInitialized('Mvu');
            } else if (getHostWindow().waitGlobalInitialized) {
                await getHostWindow().waitGlobalInitialized('Mvu');
            }
        } catch (e) {
            console.warn('[简易MUV状态栏] 等待 Mvu 初始化失败，继续注入基础按钮:', e);
        }

        buildSimpleMuvDom();
        refreshSimpleMuvPanel();
    }

    window.initSimpleMuvStatusBar = initializeSimpleMuvPhone;
    window.openSimpleMuvStatusBar = openSimpleMuvPanel;
    window.closeSimpleMuvStatusBar = closeSimpleMuvPanel;
    window.refreshSimpleMuvStatusBar = refreshSimpleMuvPanel;
    window.cleanupSimpleMuvStatusBar = cleanupSimpleMuvPhone;

    // 兼容上一版名字。
    window.initSimpleMobileForum = initializeSimpleMuvPhone;
    window.openSimpleMobileForum = openSimpleMuvPanel;
    window.closeSimpleMobileForum = closeSimpleMuvPanel;
    window.cleanupSimpleMobileForum = cleanupSimpleMuvPhone;

    const $ = getJQuery();
    if ($) {
        $(() => setTimeout(initializeSimpleMuvPhone, 150));
    } else if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initializeSimpleMuvPhone, 150));
    } else {
        setTimeout(initializeSimpleMuvPhone, 150);
    }
})();
