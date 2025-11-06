"use strict";
// 🚀 PERFORMANCE MONITORING - Intel/Microsoft Level
// Real-time performance tracking & optimization
class PerformanceMonitor {
    constructor() {
        this.startTime = performance.now();
        this.metrics = {
            loadTime: 0,
            firstPaint: 0,
            domContentLoaded: 0,
            resourcesLoaded: 0
        };
        this.init();
    }
    init() {
        // Monitor page load
        window.addEventListener('load', () => {
            this.captureMetrics();
            this.logMetrics();
            this.optimizeIfNeeded();
        });
        // Monitor DOM ready
        document.addEventListener('DOMContentLoaded', () => {
            this.metrics.domContentLoaded = performance.now() - this.startTime;
        });
    }
    captureMetrics() {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            this.metrics.loadTime = perfData.loadEventEnd - perfData.fetchStart;
            this.metrics.firstPaint = perfData.responseStart - perfData.fetchStart;
            this.metrics.domContentLoaded = perfData.domContentLoadedEventEnd - perfData.fetchStart;
            this.metrics.resourcesLoaded = performance.getEntriesByType('resource').length;
        }
        // Memory usage (if available)
        const perfWithMemory = performance;
        if (perfWithMemory.memory) {
            this.metrics.memoryUsage = perfWithMemory.memory.usedJSHeapSize / 1048576; // MB
        }
    }
    logMetrics() {
        // Performance logging disabled
    }
    optimizeIfNeeded() {
        // Performance check disabled
    }
    getMetrics() {
        return Object.assign({}, this.metrics);
    }
}
class SmartCache {
    constructor(maxSize = 50, ttl = 300000) {
        this.cache = new Map();
        this.maxSize = maxSize;
        this.ttl = ttl;
    }
    set(key, data) {
        // Remove oldest if cache is full
        if (this.cache.size >= this.maxSize) {
            const oldestKey = Array.from(this.cache.entries())
                .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
            this.cache.delete(oldestKey);
        }
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            hits: 0
        });
    }
    get(key) {
        const item = this.cache.get(key);
        if (!item)
            return null;
        // Check if expired
        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }
        // Increment hit counter
        item.hits++;
        return item.data;
    }
    clear() {
        this.cache.clear();
    }
    getStats() {
        let totalHits = 0;
        this.cache.forEach(item => totalHits += item.hits);
        return {
            size: this.cache.size,
            totalHits
        };
    }
}
// ========================================
// ERROR TRACKING & LOGGING
// ========================================
class ErrorTracker {
    constructor(maxErrors = 20) {
        this.errors = [];
        this.maxErrors = maxErrors;
        this.init();
    }
    init() {
        window.addEventListener('error', (e) => {
            var _a;
            this.logError(e.message, (_a = e.error) === null || _a === void 0 ? void 0 : _a.stack);
        });
        window.addEventListener('unhandledrejection', (e) => {
            this.logError(`Unhandled Promise: ${e.reason}`);
        });
    }
    logError(message, stack) {
        const error = {
            message,
            stack,
            timestamp: Date.now()
        };
        this.errors.push(error);
        // Keep only recent errors
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }
        // Error tracked silently
    }
    getErrors() {
        return [...this.errors];
    }
    clearErrors() {
        this.errors = [];
    }
}
// ========================================
// REAL-TIME ANALYTICS
// ========================================
class Analytics {
    constructor() {
        this.pageViews = 0;
        this.clicks = new Map();
        this.timeOnPage = 0;
        this.startTime = Date.now();
        this.init();
    }
    init() {
        this.pageViews++;
        // Track clicks
        document.addEventListener('click', (e) => {
            const target = e.target;
            const key = target.tagName + (target.className ? `.${target.className.split(' ')[0]}` : '');
            this.clicks.set(key, (this.clicks.get(key) || 0) + 1);
        });
        // Track time on page
        window.addEventListener('beforeunload', () => {
            this.timeOnPage = Date.now() - this.startTime;
            this.saveAnalytics();
        });
        // Auto-save every 30 seconds
        setInterval(() => this.saveAnalytics(), 30000);
    }
    saveAnalytics() {
        const data = {
            pageViews: this.pageViews,
            clicks: Array.from(this.clicks.entries()),
            timeOnPage: this.timeOnPage,
            lastUpdate: Date.now()
        };
        localStorage.setItem('elementrix_analytics', JSON.stringify(data));
    }
    getStats() {
        return {
            pageViews: this.pageViews,
            clicks: new Map(this.clicks),
            timeOnPage: Date.now() - this.startTime
        };
    }
    static getTopClicks(limit = 5) {
        const data = localStorage.getItem('elementrix_analytics');
        if (!data)
            return [];
        const analytics = JSON.parse(data);
        return analytics.clicks
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit);
    }
}
// ========================================
// INIT ALL SYSTEMS
// ========================================
const perfMonitor = new PerformanceMonitor();
const smartCache = new SmartCache();
const errorTracker = new ErrorTracker();
const analytics = new Analytics();
// Expose to window for debugging
window.elementrixPerf = {
    monitor: perfMonitor,
    cache: smartCache,
    errors: errorTracker,
    analytics: analytics
};
// Performance systems initialized
