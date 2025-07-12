/**
 * 國際化 (i18n) 系統
 * 支援靜態多語言架構，從URL路徑檢測語言
 */

class I18n {
    constructor() {
        this.currentLanguage = 'zh'; // 預設語言改為中文
        this.translations = {}; // 翻譯內容
        this.languageMap = {
            'zh': 'zh',
            'zh-TW': 'zh',
            'zh-HK': 'zh',
            'zh-CN': 'zh',
            'en': 'en',
            'en-US': 'en',
            'en-GB': 'en',
            'ja': 'ja',
            'ja-JP': 'ja'
        };
        
        this.init();
    }

    /**
     * 初始化i18n系統
     */
    async init() {
        try {
            // 從URL路徑檢測語言
            this.detectLanguageFromPath();
            
            // 載入語言檔案
            await this.loadLanguageFile();
            
            // 更新頁面文字
            this.updatePageText();
            
            console.log(`🌍 i18n系統已初始化，當前語言: ${this.currentLanguage}`);
        } catch (error) {
            console.error('❌ i18n系統初始化失敗:', error);
            // 使用預設中文
            this.currentLanguage = 'zh';
            await this.loadLanguageFile();
        }
    }

    /**
     * 從URL路徑檢測語言
     */
    detectLanguageFromPath() {
        const path = window.location.pathname;
        const pathSegments = path.split('/').filter(segment => segment.length > 0);
        
        // 檢查第一個路徑段是否為語言代碼
        if (pathSegments.length > 0) {
            const possibleLang = pathSegments[0];
            if (['zh', 'en', 'ja'].includes(possibleLang)) {
                this.currentLanguage = possibleLang;
                return;
            }
        }
        
        // 如果URL沒有語言路徑，使用預設中文
        this.currentLanguage = 'zh';
    }

    /**
     * 載入語言檔案
     */
    async loadLanguageFile() {
        try {
            // 根據當前路徑調整語言檔案路徑
            const langPath = this.getLanguageFilePath();
            const response = await fetch(langPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.translations = await response.json();
        } catch (error) {
            console.error(`❌ 載入語言檔案失敗 (${this.currentLanguage}):`, error);
            // 如果載入失敗，嘗試載入中文作為備用
            if (this.currentLanguage !== 'zh') {
                this.currentLanguage = 'zh';
                await this.loadLanguageFile();
            } else {
                throw error;
            }
        }
    }

    /**
     * 取得語言檔案路徑
     */
    getLanguageFilePath() {
        const path = window.location.pathname;
        const pathSegments = path.split('/').filter(segment => segment.length > 0);
        
        // 如果在語言子目錄中，使用相對路徑
        if (pathSegments.length > 0 && ['zh', 'en', 'ja'].includes(pathSegments[0])) {
            return `../lang/${this.currentLanguage}.json`;
        }
        
        // 如果在根目錄，使用直接路徑
        return `lang/${this.currentLanguage}.json`;
    }

    /**
     * 取得翻譯文字
     * @param {string} key - 翻譯鍵值 (例如: "meta.title")
     * @param {Object} params - 可選的參數替換
     * @returns {string} 翻譯後的文字
     */
    t(key, params = {}) {
        try {
            // 使用點記法取得巢狀物件值
            const keys = key.split('.');
            let value = this.translations;
            
            for (const k of keys) {
                if (value && typeof value === 'object' && k in value) {
                    value = value[k];
                } else {
                    console.warn(`⚠️ 找不到翻譯鍵值: ${key}`);
                    return key; // 回傳原始鍵值
                }
            }

            if (typeof value !== 'string') {
                console.warn(`⚠️ 翻譯值不是字串: ${key}`);
                return key;
            }

            // 參數替換
            let result = value;
            for (const [param, replacement] of Object.entries(params)) {
                result = result.replace(new RegExp(`\\{${param}\\}`, 'g'), replacement);
            }

            return result;
        } catch (error) {
            console.error(`❌ 翻譯處理失敗 (${key}):`, error);
            return key;
        }
    }

    /**
     * 更新頁面文字
     */
    updatePageText() {
        // 更新 meta 標籤
        this.updateMetaTags();
        
        // 更新頁面標題
        this.updatePageTitle();
        
        // 更新UI按鈕文字
        this.updateUIElements();
        
        // 更新陀螺儀權限對話框
        this.updateGyroDialog();
        
        // 更新提示文字
        this.updateHintText();
    }

    /**
     * 更新 meta 標籤
     */
    updateMetaTags() {
        // 更新 Open Graph 標籤
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        const ogUrl = document.querySelector('meta[property="og:url"]');
        
        if (ogTitle) ogTitle.setAttribute('content', this.t('meta.og_title'));
        if (ogDescription) ogDescription.setAttribute('content', this.t('meta.og_description'));
        if (ogUrl) ogUrl.setAttribute('content', this.t('meta.og_url'));
        
        // 更新 Twitter 標籤
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        
        if (twitterTitle) twitterTitle.setAttribute('content', this.t('meta.og_title'));
        if (twitterDescription) twitterDescription.setAttribute('content', this.t('meta.og_description'));
    }

    /**
     * 更新頁面標題
     */
    updatePageTitle() {
        document.title = this.t('meta.title');
    }



    /**
     * 更新UI元素文字
     */
    updateUIElements() {
        // 更新按鈕的 aria-label
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.setAttribute('aria-label', this.t('ui.back'));
        }

        const fullscreenButton = document.getElementById('fullscreen-button');
        if (fullscreenButton) {
            fullscreenButton.setAttribute('aria-label', this.t('ui.fullscreen'));
        }

        const resetViewButton = document.getElementById('reset-view-button');
        if (resetViewButton) {
            resetViewButton.setAttribute('aria-label', this.t('ui.reset_view'));
        }

        // 更新提示對話框文字
        this.updateTooltipText();
    }

    /**
     * 更新提示對話框文字
     */
    updateTooltipText() {
        const fullscreenTooltip = document.getElementById('fullscreen-tooltip');
        const resetViewTooltip = document.getElementById('reset-view-tooltip');

        if (fullscreenTooltip) {
            const title = fullscreenTooltip.querySelector('.tooltip-title');
            const subtitle = fullscreenTooltip.querySelector('.tooltip-subtitle');
            
            if (title) {
                title.textContent = this.t('ui.fullscreen');
                title.setAttribute('lang', this.currentLanguage);
            }
            if (subtitle) {
                subtitle.textContent = this.t('ui.click_to_close');
                subtitle.setAttribute('lang', this.currentLanguage);
            }
        }

        if (resetViewTooltip) {
            const title = resetViewTooltip.querySelector('.tooltip-title');
            const subtitle = resetViewTooltip.querySelector('.tooltip-subtitle');
            
            if (title) {
                title.textContent = this.t('ui.reset_view');
                title.setAttribute('lang', this.currentLanguage);
            }
            if (subtitle) {
                subtitle.textContent = this.t('ui.click_to_close');
                subtitle.setAttribute('lang', this.currentLanguage);
            }
        }
        
        // 🌍 語言切換後重新計算對話框位置
        this.repositionTooltips();
    }
    
    /**
     * 重新計算對話框位置
     */
    repositionTooltips() {
        // 檢查是否有全域的 ParallaxViewer 實例
        if (window.parallaxViewerInstance && window.parallaxViewerInstance.updateTooltipPositions) {
            // 延遲執行，確保DOM更新完成
            setTimeout(() => {
                window.parallaxViewerInstance.updateTooltipPositions();
            }, 50);
        }
    }

    /**
     * 更新陀螺儀權限對話框
     */
    updateGyroDialog() {
        const gyroTitle = document.querySelector('.gyro-permission-title');
        const gyroDesc = document.querySelector('.gyro-permission-desc');
        const allowBtn = document.querySelector('.gyro-permission-btn.primary');
        const denyBtn = document.querySelector('.gyro-permission-btn:not(.primary)');

        if (gyroTitle) gyroTitle.textContent = this.t('gyro.title');
        if (gyroDesc) gyroDesc.textContent = this.t('gyro.description');
        if (allowBtn) allowBtn.textContent = this.t('gyro.allow');
        if (denyBtn) denyBtn.textContent = this.t('gyro.deny');
    }

    /**
     * 更新提示文字
     */
    updateHintText() {
        const mainHint = document.querySelector('.main-hint');
        const detailHint = document.querySelector('.detail-hint');
        const landscapeHint = document.querySelector('#landscape-hint .hint-content');
        
        if (mainHint) {
            const mainKey = mainHint.getAttribute('data-i18n');
            if (mainKey) {
                mainHint.textContent = this.t(mainKey);
                mainHint.setAttribute('lang', this.currentLanguage);
            }
        }
        
        if (detailHint) {
            const detailKey = detailHint.getAttribute('data-i18n');
            if (detailKey) {
                detailHint.textContent = this.t(detailKey);
                detailHint.setAttribute('lang', this.currentLanguage);
            }
        }
        
        if (landscapeHint) {
            const landscapeKey = landscapeHint.getAttribute('data-i18n');
            if (landscapeKey) {
                landscapeHint.textContent = this.t(landscapeKey);
                landscapeHint.setAttribute('lang', this.currentLanguage);
            }
        }
    }

    /**
     * 切換語言
     * @param {string} language - 語言代碼 ('en' 或 'zh')
     */
    async switchLanguage(language) {
        if (!this.languageMap[language]) {
            console.error(`❌ 不支援的語言: ${language}`);
            return;
        }

        this.currentLanguage = this.languageMap[language];
        localStorage.setItem('preferred_language', language);
        
        await this.loadLanguageFile();
        this.updatePageText();
        
        console.log(`🌍 語言已切換為: ${this.currentLanguage}`);
    }

    /**
     * 取得當前語言
     * @returns {string} 當前語言代碼
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * 取得支援的語言列表
     * @returns {Array} 支援的語言列表
     */
    getSupportedLanguages() {
        return Object.keys(this.languageMap);
    }
}

// 全域 i18n 實例
let i18nInstance = null;

// 初始化函數
async function initI18n() {
    if (!i18nInstance) {
        i18nInstance = new I18n();
    }
    return i18nInstance;
}

// 簡化的翻譯函數
function t(key, params = {}) {
    if (i18nInstance) {
        return i18nInstance.t(key, params);
    }
    return key;
}

// 語言切換函數
async function switchLanguage(language) {
    if (i18nInstance) {
        await i18nInstance.switchLanguage(language);
    }
}

// 🌍 全域 i18nTest 物件 - 用於瀏覽器控制台測試
window.i18nTest = {
    /**
     * 切換到英文
     */
    en: async function() {
        console.log('🌍 切換到英文...');
        await switchLanguage('en');
        console.log('✅ 已切換到英文');
    },
    
    /**
     * 切換到繁體中文
     */
    zh: async function() {
        console.log('🌍 切換到繁體中文...');
        await switchLanguage('zh-TW');
        console.log('✅ 已切換到繁體中文');
    },
    
    /**
     * 取得當前語言
     */
    getCurrentLanguage: function() {
        if (i18nInstance) {
            return i18nInstance.getCurrentLanguage();
        }
        return 'unknown';
    },
    
    /**
     * 取得支援的語言列表
     */
    getSupportedLanguages: function() {
        if (i18nInstance) {
            return i18nInstance.getSupportedLanguages();
        }
        return [];
    },
    
    /**
     * 翻譯文字
     */
    t: function(key, params = {}) {
        return t(key, params);
    }
};

// 在控制台顯示使用說明
console.log('🌍 i18nTest 已載入！使用方式：');
console.log('  i18nTest.en()           // 切換到英文');
console.log('  i18nTest.zh()           // 切換到繁體中文');
console.log('  i18nTest.getCurrentLanguage()  // 取得當前語言');
console.log('  i18nTest.t("key")       // 翻譯文字'); 