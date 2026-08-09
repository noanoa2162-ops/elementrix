"use strict";
// Category Icons Map
const categoryIcons = {
    'buttons': '🔘',
    'forms': '📝',
    'cards': '🎴',
    'animations': '✨',
    'menus': '🍔',
    'other': '📦'
};
// Category Names Map
const categoryNames = {
    'buttons': 'כפתורים',
    'forms': 'טפסים',
    'cards': 'כרטיסים',
    'animations': 'אנימציות',
    'menus': 'תפריטים',
    'other': 'אחר'
};
// Helper function to create offline placeholder images
const createPlaceholder = (color, text) => {
    const svg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="${color}"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white">${text}</text>
  </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
};
// Components Data (embedded to avoid CORS issues) - תמונות offline!
const componentsData = [
    { "id": 1, "name": "כפתור גרדיאנט מודרני", "category": "buttons", "description": "כפתור עם אפקט גרדיאנט דינמי", "price": 50, "image": createPlaceholder("#667eea", "🔘 Button"), "rating": 4.8, "downloads": 234 },
    { "id": 2, "name": "כרטיס מוצר עם flip", "category": "cards", "description": "כרטיס שמתהפך ב-3D", "price": 80, "image": createPlaceholder("#764ba2", "🎴 Card"), "rating": 4.9, "downloads": 456 },
    { "id": 3, "name": "טופס התחברות מעוצב", "category": "forms", "description": "טופס עם אנימציות חלקות", "price": 120, "image": createPlaceholder("#10b981", "📝 Form"), "rating": 4.7, "downloads": 789 },
    { "id": 4, "name": "תפריט המבורגר מונפש", "category": "menus", "description": "תפריט responsive", "price": 90, "image": createPlaceholder("#f59e0b", "🍔 Menu"), "rating": 4.6, "downloads": 567 },
    { "id": 5, "name": "סליידר תמונות אוטומטי", "category": "animations", "description": "סליידר עם מעברים חלקים", "price": 150, "image": createPlaceholder("#8b5cf6", "✨ Animation"), "rating": 4.9, "downloads": 892 },
    { "id": 6, "name": "כפתור נאון זוהר", "category": "buttons", "description": "כפתור עם אפקט נאון מרהיב", "price": 60, "image": createPlaceholder("#00ff00", "💡 Neon"), "rating": 4.7, "downloads": 345 },
    { "id": 7, "name": "כרטיס פרופיל מעוצב", "category": "cards", "description": "כרטיס פרופיל עם תמונה", "price": 70, "image": createPlaceholder("#3b82f6", "👤 Profile"), "rating": 4.8, "downloads": 567 },
    { "id": 8, "name": "טופס רישום מודרני", "category": "forms", "description": "טופס רישום עם ולידציה", "price": 130, "image": createPlaceholder("#ec4899", "📋 Register"), "rating": 4.9, "downloads": 678 },
    { "id": 9, "name": "תפריט Dropdown מעוצב", "category": "menus", "description": "תפריט נפתח עם אנימציה", "price": 85, "image": createPlaceholder("#14b8a6", "▼ Dropdown"), "rating": 4.6, "downloads": 432 },
    { "id": 10, "name": "Loading Spinner מעוצב", "category": "animations", "description": "אנימציית טעינה מודרנית", "price": 40, "image": createPlaceholder("#06b6d4", "⏳ Loading"), "rating": 4.5, "downloads": 890 },
    { "id": 11, "name": "Progress Bar מונפש", "category": "animations", "description": "בר התקדמות עם אנימציה", "price": 45, "image": createPlaceholder("#f97316", "📊 Progress"), "rating": 4.6, "downloads": 512 },
    { "id": 12, "name": "כפתור Ripple Effect", "category": "buttons", "description": "כפתור עם אפקט גלים", "price": 55, "image": createPlaceholder("#06b6d4", "🌊 Ripple"), "rating": 4.7, "downloads": 423 },
    { "id": 13, "name": "כרטיס Glassmorphism", "category": "cards", "description": "כרטיס עם אפקט זכוכית", "price": 95, "image": createPlaceholder("#a855f7", "🪟 Glass"), "rating": 4.9, "downloads": 678 },
    { "id": 14, "name": "Modal Popup מודרני", "category": "other", "description": "חלון קופץ עם אנימציה", "price": 110, "image": createPlaceholder("#3b82f6", "📦 Modal"), "rating": 4.8, "downloads": 789 },
    { "id": 15, "name": "Tabs מונפשים", "category": "menus", "description": "טאבים עם מעבר חלק", "price": 75, "image": createPlaceholder("#6366f1", "📑 Tabs"), "rating": 4.5, "downloads": 345 },
    { "id": 16, "name": "Tooltip מונפש", "category": "other", "description": "רכיב tooltip עם אנימציה", "price": 35, "image": createPlaceholder("#84cc16", "💬 Tooltip"), "rating": 4.4, "downloads": 234 },
    { "id": 17, "name": "Badge מעוצב", "category": "other", "description": "תגים צבעוניים", "price": 25, "image": createPlaceholder("#ef4444", "🏷️ Badge"), "rating": 4.3, "downloads": 456 },
    { "id": 18, "name": "Accordion מתקפל", "category": "other", "description": "רכיב שאלות ותשובות", "price": 65, "image": createPlaceholder("#eab308", "📋 Accordion"), "rating": 4.6, "downloads": 543 },
    { "id": 19, "name": "Breadcrumb ניווט", "category": "menus", "description": "ניווט breadcrumb מעוצב", "price": 30, "image": createPlaceholder("#64748b", "🗺️ Breadcrumb"), "rating": 4.2, "downloads": 321 },
    { "id": 20, "name": "Pagination מספור עמודים", "category": "menus", "description": "מספור עמודים אינטראקטיבי", "price": 55, "image": createPlaceholder("#8b5cf6", "🔢 Pagination"), "rating": 4.7, "downloads": 678 },
    { "id": 21, "name": "כפתור Toggle מונפש", "category": "buttons", "description": "כפתור הפעלה וכיבוי", "price": 42, "image": createPlaceholder("#10b981", "🔘 Toggle"), "rating": 4.6, "downloads": 391 },
    { "id": 22, "name": "כרטיס מחיר Premium", "category": "cards", "description": "כרטיס תמחור מעוצב", "price": 88, "image": createPlaceholder("#d97706", "💰 Price"), "rating": 4.8, "downloads": 612 },
    { "id": 23, "name": "טופס חיפוש מתקדם", "category": "forms", "description": "חיפוש עם סינונים", "price": 105, "image": createPlaceholder("#06b6d4", "🔍 Search"), "rating": 4.7, "downloads": 445 },
    { "id": 24, "name": "Sidebar ניווט", "category": "menus", "description": "תפריט צד מתקפל", "price": 95, "image": createPlaceholder("#475569", "📊 Sidebar"), "rating": 4.9, "downloads": 734 },
    { "id": 25, "name": "Count Up אנימציה", "category": "animations", "description": "מונה עולה מ-0", "price": 38, "image": createPlaceholder("#22c55e", "🔢 Count"), "rating": 4.5, "downloads": 523 },
    { "id": 26, "name": "כפתור Social Share", "category": "buttons", "description": "שיתוף ברשתות חברתיות", "price": 48, "image": createPlaceholder("#3b82f6", "👥 Share"), "rating": 4.6, "downloads": 298 },
    { "id": 27, "name": "כרטיס Blog Post", "category": "cards", "description": "כרטיס פוסט מעוצב", "price": 72, "image": createPlaceholder("#f59e0b", "📝 Blog"), "rating": 4.8, "downloads": 567 },
    { "id": 28, "name": "טופס יצירת קשר", "category": "forms", "description": "טופס צור קשר מלא", "price": 115, "image": createPlaceholder("#ec4899", "✉️ Contact"), "rating": 4.9, "downloads": 823 },
    { "id": 29, "name": "Mega Menu תפריט", "category": "menus", "description": "תפריט ענק עם קטגוריות", "price": 125, "image": createPlaceholder("#6366f1", "🍔 Mega"), "rating": 4.7, "downloads": 411 },
    { "id": 30, "name": "Parallax Scroll אפקט", "category": "animations", "description": "גלילה עם עומק", "price": 68, "image": createPlaceholder("#a855f7", "🌊 Parallax"), "rating": 4.8, "downloads": 645 },
    { "id": 31, "name": "כפתור Download מונפש", "category": "buttons", "description": "כפתור הורדה עם אנימציה", "price": 52, "image": createPlaceholder("#10b981", "⬇️ Download"), "rating": 4.7, "downloads": 356 },
    { "id": 32, "name": "כרטיס Team Member", "category": "cards", "description": "כרטיס חבר צוות", "price": 65, "image": createPlaceholder("#6366f1", "👨‍💼 Team"), "rating": 4.6, "downloads": 478 },
    { "id": 33, "name": "טופס Newsletter", "category": "forms", "description": "הרשמה לניוזלטר", "price": 58, "image": createPlaceholder("#f59e0b", "📧 Newsletter"), "rating": 4.5, "downloads": 389 },
    { "id": 34, "name": "Filter Tags תגים", "category": "menus", "description": "תגי סינון אינטראקטיביים", "price": 62, "image": createPlaceholder("#14b8a6", "🏷️ Filter"), "rating": 4.6, "downloads": 501 },
    { "id": 35, "name": "Typing Effect אפקט", "category": "animations", "description": "טקסט מתכתב", "price": 44, "image": createPlaceholder("#06b6d4", "⌨️ Typing"), "rating": 4.7, "downloads": 623 },
    { "id": 36, "name": "כפתור Back to Top", "category": "buttons", "description": "חזרה לראש העמוד", "price": 35, "image": createPlaceholder("#64748b", "⬆️ Top"), "rating": 4.4, "downloads": 412 },
    { "id": 37, "name": "כרטיס Product Grid", "category": "cards", "description": "רשת מוצרים מעוצבת", "price": 98, "image": createPlaceholder("#a855f7", "🛒 Product"), "rating": 4.9, "downloads": 756 },
    { "id": 38, "name": "טופס Review דירוג", "category": "forms", "description": "טופס דירוג עם כוכבים", "price": 78, "image": createPlaceholder("#eab308", "⭐ Review"), "rating": 4.6, "downloads": 534 },
    { "id": 39, "name": "Search Bar מתקדם", "category": "menus", "description": "חיפוש עם autocomplete", "price": 92, "image": createPlaceholder("#3b82f6", "🔎 Search"), "rating": 4.8, "downloads": 667 },
    { "id": 40, "name": "Fade In Scroll אנימציה", "category": "animations", "description": "אלמנטים מופיעים בגלילה", "price": 56, "image": createPlaceholder("#ec4899", "✨ Fade In"), "rating": 4.7, "downloads": 589 },
    { "id": 41, "name": "כפתור Loading State", "category": "buttons", "description": "כפתור עם מצב טעינה", "price": 47, "image": createPlaceholder("#f97316", "🔄 Loading"), "rating": 4.6, "downloads": 423 },
    { "id": 42, "name": "כרטיס Testimonial", "category": "cards", "description": "כרטיס המלצה", "price": 68, "image": createPlaceholder("#8b5cf6", "💬 Testimonial"), "rating": 4.8, "downloads": 512 },
    { "id": 43, "name": "טופס Multi-Step", "category": "forms", "description": "טופס רב שלבי", "price": 135, "image": createPlaceholder("#14b8a6", "🚪 Multi-Step"), "rating": 4.9, "downloads": 701 },
    { "id": 44, "name": "Context Menu תפריט", "category": "menus", "description": "תפריט לחיצה ימנית", "price": 72, "image": createPlaceholder("#64748b", "🗂️ Context"), "rating": 4.5, "downloads": 389 },
    { "id": 45, "name": "Wave Animation גל", "category": "animations", "description": "אפקט גלים מונפש", "price": 51, "image": createPlaceholder("#06b6d4", "🌊 Wave"), "rating": 4.6, "downloads": 478 },
    { "id": 46, "name": "כפתור Icon Only", "category": "buttons", "description": "כפתורי אייקון בלבד", "price": 32, "image": createPlaceholder("#eab308", "🔘 Icon"), "rating": 4.4, "downloads": 367 },
    { "id": 47, "name": "כרטיס Image Gallery", "category": "cards", "description": "גלריית תמונות מעוצבת", "price": 105, "image": createPlaceholder("#ec4899", "🇺️ Gallery"), "rating": 4.9, "downloads": 823 },
    { "id": 48, "name": "טופס File Upload", "category": "forms", "description": "העלאת קבצים בגרירה", "price": 88, "image": createPlaceholder("#10b981", "📁 Upload"), "rating": 4.7, "downloads": 612 },
    { "id": 49, "name": "User Menu פרופיל", "category": "menus", "description": "תפריט משתמש מתקפל", "price": 65, "image": createPlaceholder("#6366f1", "👤 User"), "rating": 4.6, "downloads": 534 },
    { "id": 50, "name": "Hover Zoom אפקט", "category": "animations", "description": "זום בהובר על תמונות", "price": 39, "image": createPlaceholder("#a855f7", "🔍 Zoom"), "rating": 4.5, "downloads": 445 },
    { "id": 51, "name": "כפתור Split מפוצל", "category": "buttons", "description": "כפתור עם תפריט נפתח", "price": 58, "image": createPlaceholder("#f97316", "🔀 Split"), "rating": 4.7, "downloads": 489 },
    { "id": 52, "name": "כרטיס Stats סטטיסטיקה", "category": "cards", "description": "כרטיס נתונים סטטיסטיים", "price": 75, "image": createPlaceholder("#22c55e", "📊 Stats"), "rating": 4.8, "downloads": 678 },
    { "id": 53, "name": "טופס Login Social", "category": "forms", "description": "התחברות עם רשתות חברתיות", "price": 95, "image": createPlaceholder("#3b82f6", "👥 Social"), "rating": 4.8, "downloads": 756 },
    { "id": 54, "name": "Color Picker בחירת צבע", "category": "other", "description": "בחירת צבע אינטראקטיבי", "price": 68, "image": createPlaceholder("#ec4899", "🎨 Color"), "rating": 4.6, "downloads": 423 },
    { "id": 55, "name": "Skeleton Loading שלד", "category": "animations", "description": "אנימציית טעינה skeleton", "price": 52, "image": createPlaceholder("#64748b", "🦴 Skeleton"), "rating": 4.7, "downloads": 567 },
    { "id": 56, "name": "כפתור Group קבוצה", "category": "buttons", "description": "קבוצת כפתורים מחוברת", "price": 45, "image": createPlaceholder("#14b8a6", "🟨 Group"), "rating": 4.5, "downloads": 389 },
    { "id": 57, "name": "כרטיס Timeline ציר זמן", "category": "cards", "description": "ציר זמן אינטראקטיבי", "price": 98, "image": createPlaceholder("#8b5cf6", "⏳ Timeline"), "rating": 4.9, "downloads": 712 },
    { "id": 58, "name": "טופס OTP קוד", "category": "forms", "description": "הזנת קוד אימות", "price": 78, "image": createPlaceholder("#eab308", "🔐 OTP"), "rating": 4.7, "downloads": 534 },
    { "id": 59, "name": "Sticky Header כותרת דביקה", "category": "menus", "description": "כותרת שנשארת למעלה", "price": 55, "image": createPlaceholder("#6366f1", "📌 Sticky"), "rating": 4.6, "downloads": 623 },
    { "id": 60, "name": "Confetti Celebration חגיגה", "category": "animations", "description": "אנימציית קונפטי", "price": 62, "image": createPlaceholder("#f59e0b", "🎉 Confetti"), "rating": 4.8, "downloads": 845 }
];
// Pagination variables
let currentDisplayCount = 0;
const ITEMS_PER_LOAD = 20;
// Load and display components
function loadComponents() {
    const grid = document.getElementById('componentsGrid');
    if (!grid)
        return;
    // Clear existing content
    grid.innerHTML = '';
    currentDisplayCount = 0;
    // Load initial batch
    loadMoreComponents();
    // Force visibility
    grid.style.display = 'grid';
    grid.style.visibility = 'visible';
    grid.style.opacity = '1';
}
// Load more components (pagination)
function loadMoreComponents() {
    const grid = document.getElementById('componentsGrid');
    if (!grid)
        return;
    const start = currentDisplayCount;
    const end = Math.min(start + ITEMS_PER_LOAD, componentsData.length);
    // Add components
    for (let i = start; i < end; i++) {
        const card = createComponentCard(componentsData[i]);
        // Remove load more button if exists
        const existingLoadMore = grid.querySelector('.load-more-container');
        if (existingLoadMore) {
            grid.removeChild(existingLoadMore);
        }
        grid.appendChild(card);
    }
    currentDisplayCount = end;
    // Add "Load More" button if there are more items
    if (currentDisplayCount < componentsData.length) {
        const loadMoreContainer = document.createElement('div');
        loadMoreContainer.className = 'load-more-container';
        loadMoreContainer.innerHTML = `
            <button class="btn btn-primary load-more-btn">
                <i class="fas fa-chevron-down"></i>
                טען עוד
            </button>
        `;
        const loadMoreBtn = loadMoreContainer.querySelector('.load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                loadMoreComponents();
            });
        }
        grid.appendChild(loadMoreContainer);
    }
}
function createComponentCard(component) {
    const card = document.createElement('div');
    card.className = 'component-card';
    card.setAttribute('data-id', component.id.toString());
    card.setAttribute('data-category', component.category);
    // Default values if not provided
    const rating = component.rating || 4.5;
    const downloads = component.downloads || 100;
    const price = component.price || 50;
    card.innerHTML = `
        <div class="component-image">
            <img src="${component.image}" alt="${escapeUserText(component.name)}" loading="lazy">
            ${component.recommended ? '<div class="urgency-badge"><i class="fas fa-crown"></i> מומלץ</div>' : ''}
            <div class="component-overlay">
                <button class="btn btn-sm btn-primary view-component">
                    <i class="fas fa-eye"></i> צפה
                </button>
            </div>
        </div>
        
        <div class="component-content">
            <div class="component-header">
                <h3 class="component-title">${escapeUserText(component.name)}</h3>
                <div class="component-category">
                    ${getCategoryIcon(component.category)} ${getCategoryName(component.category)}
                </div>
            </div>
            
            <p class="component-description">${escapeUserText(component.description)}</p>
            
            <div class="component-stats">
                <div class="stat">
                    <i class="fas fa-star"></i>
                    <span>${rating}</span>
                </div>
                <div class="stat">
                    <i class="fas fa-download"></i>
                    <span>${downloads}</span>
                </div>
            </div>
            
            <div class="component-footer">
                <div class="component-price">
                    <i class="fas fa-coins"></i>
                    <span>${price} נקודות</span>
                </div>
                <button class="btn btn-sm btn-success purchase-component">
                    <i class="fas fa-shopping-cart"></i> קנה
                </button>
            </div>
        </div>
    `;
    // Add click events
    const viewBtn = card.querySelector('.view-component');
    const purchaseBtn = card.querySelector('.purchase-component');
    if (viewBtn) {
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showComponentDetails(component);
        });
    }
    if (purchaseBtn) {
        purchaseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            purchaseComponent(component);
        });
    }
    return card;
}
function getCategoryIcon(category) {
    return categoryIcons[category] || '📦';
}
function getCategoryName(category) {
    return categoryNames[category] || 'אחר';
}
function showComponentDetails(component) {
    const modal = document.getElementById('componentModal');
    const modalBody = document.getElementById('modalBody');
    if (!modal || !modalBody)
        return;
    modalBody.innerHTML = `
        <div class="component-details">
            <div class="details-header">
                <h2>${escapeUserText(component.name)}</h2>
                <div class="details-category">${getCategoryIcon(component.category)} ${getCategoryName(component.category)}</div>
            </div>
            
            <img src="${component.image}" alt="${escapeUserText(component.name)}" class="details-image">
            
            <p class="details-description">${escapeUserText(component.description)}</p>
            
            <div class="details-stats">
                <div class="stat-box">
                    <i class="fas fa-star"></i>
                    <strong>${component.rating}</strong>
                    <span>דירוג</span>
                </div>
                <div class="stat-box">
                    <i class="fas fa-download"></i>
                    <strong>${component.downloads}</strong>
                    <span>הורדות</span>
                </div>
                <div class="stat-box">
                    <i class="fas fa-coins"></i>
                    <strong>${component.price}</strong>
                    <span>נקודות</span>
                </div>
            </div>
            
            ${component.html || component.css || component.js ? `
            <div class="code-preview">
                <div class="code-tabs">
                    ${component.html ? '<button class="code-tab active" data-lang="html">HTML</button>' : ''}
                    ${component.css ? '<button class="code-tab" data-lang="css">CSS</button>' : ''}
                    ${component.js ? '<button class="code-tab" data-lang="js">JavaScript</button>' : ''}
                </div>
                
                <div class="code-content">
                    ${component.html ? `<pre class="code-block active" data-lang="html"><code>${escapeHtml(component.html)}</code></pre>` : ''}
                    ${component.css ? `<pre class="code-block" data-lang="css"><code>${escapeHtml(component.css)}</code></pre>` : ''}
                    ${component.js ? `<pre class="code-block" data-lang="js"><code>${escapeHtml(component.js)}</code></pre>` : ''}
                </div>
            </div>
            ` : ''}
            
            <div class="details-actions">
                <button class="btn btn-success btn-lg purchase-detail">
                    <i class="fas fa-shopping-cart"></i> קנה ב-${component.price} נקודות
                </button>
            </div>
        </div>
    `;
    // Setup code tabs
    setupCodeTabs(modalBody);
    // Setup purchase button
    const purchaseBtn = modalBody.querySelector('.purchase-detail');
    if (purchaseBtn) {
        purchaseBtn.addEventListener('click', () => {
            purchaseComponent(component);
            modal.classList.add('hidden');
        });
    }
    modal.classList.remove('hidden');
}
function setupCodeTabs(container) {
    const tabs = container.querySelectorAll('.code-tab');
    const blocks = container.querySelectorAll('.code-block');
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const lang = tab.getAttribute('data-lang');
            tabs.forEach((t) => t.classList.remove('active'));
            blocks.forEach((b) => b.classList.remove('active'));
            tab.classList.add('active');
            const targetBlock = container.querySelector(`.code-block[data-lang="${lang}"]`);
            if (targetBlock) {
                targetBlock.classList.add('active');
            }
        });
    });
}
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
function purchaseComponent(component) {
    // Show beautiful purchase modal
    const currentUser = storage.getCurrentUser();
    const userPoints = currentUser ? currentUser.pointsAvailable : 0;
    if (window.createModal)
        window.createModal({
            title: '🛒 רכישת רכיב',
            content: `
            <div class="purchase-confirmation">
                <div class="component-preview">
                    <img src="${component.image}" alt="${escapeUserText(component.name)}">
                    <h3>${escapeUserText(component.name)}</h3>
                    <p>${escapeUserText(component.description)}</p>
                </div>
                
                <div class="purchase-details">
                    <div class="detail-row">
                        <span class="label">מחיר:</span>
                        <span class="value"><i class="fas fa-coins"></i> ${component.price} נקודות</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">יתרה נוכחית:</span>
                        <span class="value"><i class="fas fa-wallet"></i> ${userPoints} נקודות</span>
                    </div>
                    <div class="detail-row highlight">
                        <span class="label">יתרה לאחר רכישה:</span>
                        <span class="value ${userPoints >= component.price ? 'success' : 'error'}">
                            ${userPoints >= component.price ? (userPoints - component.price) : '❌ לא מספיק'} נקודות
                        </span>
                    </div>
                </div>
                
                ${userPoints >= component.price ? `
                    <div class="purchase-actions">
                        <button class="btn btn-success btn-lg" id="confirmPurchaseBtn" data-name="${escapeUserText(component.name)}" data-price="${component.price}" data-points="${userPoints}">
                            <i class="fas fa-check"></i> אישור רכישה
                        </button>
                        <button class="btn btn-ghost" id="cancelPurchaseBtn">
                            ביטול
                        </button>
                    </div>
                ` : `
                    <div class="purchase-actions">
                        <button class="btn btn-primary btn-lg" id="buyMorePointsBtn">
                            <i class="fas fa-shopping-cart"></i> רכוש נקודות
                        </button>
                        <button class="btn btn-ghost" id="cancelPurchaseBtn">
                            ביטול
                        </button>
                    </div>
                `}
            </div>
        `,
            size: 'medium'
        });
    // Attach event listeners after modal is created
    setTimeout(() => {
        const confirmBtn = document.getElementById('confirmPurchaseBtn');
        const cancelBtn = document.getElementById('cancelPurchaseBtn');
        const buyMoreBtn = document.getElementById('buyMorePointsBtn');
        if (confirmBtn) {
            confirmBtn.onclick = () => {
                const name = confirmBtn.dataset.name || '';
                const price = Number(confirmBtn.dataset.price || 0);
                const points = Number(confirmBtn.dataset.points || 0);
                completePurchase(name, price, points);
            };
        }
        if (cancelBtn) {
            cancelBtn.onclick = () => {
                if (window.closeModal) {
                    window.closeModal();
                }
            };
        }
        if (buyMoreBtn) {
            buyMoreBtn.onclick = () => {
                openBuyPointsModal();
            };
        }
    }, 50);
}
// Complete purchase function
function completePurchase(name, price, userPoints) {
    if (window.showSuccessModal) {
        window.showSuccessModal({
            title: '✅ רכישה הושלמה!',
            message: `הרכיב "${name}" נוסף לספרייה שלך!\n\nיתרה חדשה: ${userPoints - price} נקודות`
        });
    }
}
// Open buy points modal
function openBuyPointsModal() {
    if (window.closeModal) {
        window.closeModal();
    }
    const modal = document.getElementById('purchaseModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}
// Legacy global functions (for compatibility with old code)
window.completePurchase = function (name, price, userPoints) {
    completePurchase(name, price, userPoints);
};
window.openBuyPointsModal = function () {
    openBuyPointsModal();
};
// Load components when page loads
function initComponents() {
    const grid = document.getElementById('componentsGrid');
    if (grid) {
        loadComponents();
    }
    // If no grid, this page doesn't need components - silently skip
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
}
else {
    initComponents();
}
