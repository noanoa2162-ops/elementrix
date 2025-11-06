// 🚀 PERFORMANCE MONITORING - Intel/Microsoft Level
// Real-time performance tracking & optimization

interface PerformanceMetrics {
    loadTime: number;
    firstPaint: number;
    domContentLoaded: number;
    resourcesLoaded: number;
    memoryUsage?: number;
}

class PerformanceMonitor {
    private metrics: PerformanceMetrics;
    private startTime: number;

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

    private init(): void {
        // Monitor page load
        window.addEventListener('load', (): void => {
            this.captureMetrics();
            this.logMetrics();
            this.optimizeIfNeeded();
        });

        // Monitor DOM ready
        document.addEventListener('DOMContentLoaded', (): void => {
            this.metrics.domContentLoaded = performance.now() - this.startTime;
        });
    }

    private captureMetrics(): void {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (perfData) {
            this.metrics.loadTime = perfData.loadEventEnd - perfData.fetchStart;
            this.metrics.firstPaint = perfData.responseStart - perfData.fetchStart;
            this.metrics.domContentLoaded = perfData.domContentLoadedEventEnd - perfData.fetchStart;
            this.metrics.resourcesLoaded = performance.getEntriesByType('resource').length;
        }

        // Memory usage (if available)
        const perfWithMemory = performance as Performance & { memory?: { usedJSHeapSize: number } };
        if (perfWithMemory.memory) {
            this.metrics.memoryUsage = perfWithMemory.memory.usedJSHeapSize / 1048576; // MB
        }
    }

    private logMetrics(): void {
        // Performance logging disabled
    }

    private optimizeIfNeeded(): void {
        // Performance check disabled
    }

    public getMetrics(): PerformanceMetrics {
        return { ...this.metrics };
    }
}

// ========================================
// SMART CACHING SYSTEM
// ========================================
interface CacheItem<T = unknown> {
    data: T;
    timestamp: number;
    hits: number;
}

class SmartCache {
    private cache: Map<string, CacheItem>;
    private maxSize: number;
    private ttl: number; // Time to live in ms

    constructor(maxSize: number = 50, ttl: number = 300000) { // 5 min default
        this.cache = new Map();
        this.maxSize = maxSize;
        this.ttl = ttl;
    }

    set(key: string, data: unknown): void {
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

    get(key: string): unknown | null {
        const item = this.cache.get(key);
        
        if (!item) return null;

        // Check if expired
        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }

        // Increment hit counter
        item.hits++;
        return item.data;
    }

    clear(): void {
        this.cache.clear();
    }

    getStats(): { size: number; totalHits: number } {
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
    private errors: Array<{ message: string; stack?: string; timestamp: number }>;
    private maxErrors: number;

    constructor(maxErrors: number = 20) {
        this.errors = [];
        this.maxErrors = maxErrors;
        this.init();
    }

    private init(): void {
        window.addEventListener('error', (e: ErrorEvent): void => {
            this.logError(e.message, e.error?.stack);
        });

        window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent): void => {
            this.logError(`Unhandled Promise: ${e.reason}`);
        });
    }

    private logError(message: string, stack?: string): void {
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

    getErrors(): Array<{ message: string; stack?: string; timestamp: number }> {
        return [...this.errors];
    }

    clearErrors(): void {
        this.errors = [];
    }
}

// ========================================
// REAL-TIME ANALYTICS
// ========================================
class Analytics {
    private pageViews: number;
    private clicks: Map<string, number>;
    private timeOnPage: number;
    private startTime: number;

    constructor() {
        this.pageViews = 0;
        this.clicks = new Map();
        this.timeOnPage = 0;
        this.startTime = Date.now();
        this.init();
    }

    private init(): void {
        this.pageViews++;

        // Track clicks
        document.addEventListener('click', (e: MouseEvent): void => {
            const target = e.target as HTMLElement;
            const key = target.tagName + (target.className ? `.${target.className.split(' ')[0]}` : '');
            this.clicks.set(key, (this.clicks.get(key) || 0) + 1);
        });

        // Track time on page
        window.addEventListener('beforeunload', (): void => {
            this.timeOnPage = Date.now() - this.startTime;
            this.saveAnalytics();
        });

        // Auto-save every 30 seconds
        setInterval((): void => this.saveAnalytics(), 30000);
    }

    private saveAnalytics(): void {
        const data = {
            pageViews: this.pageViews,
            clicks: Array.from(this.clicks.entries()),
            timeOnPage: this.timeOnPage,
            lastUpdate: Date.now()
        };

        localStorage.setItem('elementrix_analytics', JSON.stringify(data));
    }

    getStats(): { pageViews: number; clicks: Map<string, number>; timeOnPage: number } {
        return {
            pageViews: this.pageViews,
            clicks: new Map(this.clicks),
            timeOnPage: Date.now() - this.startTime
        };
    }

    static getTopClicks(limit: number = 5): Array<[string, number]> {
        const data = localStorage.getItem('elementrix_analytics');
        if (!data) return [];

        const analytics = JSON.parse(data);
        return analytics.clicks
            .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
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
