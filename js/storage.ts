// ========================================
// LocalStorage Management
// ========================================

const STORAGE_KEY: string = 'codeComponentsStore';
const CURRENT_USER_KEY: string = 'currentUser';
// v3 removes legacy plaintext passwords from the local demo data.
const STORAGE_VERSION: string = 'v3.0';

interface StorageData {
    users: User[];
    components: CodeComponent[];
    purchases: Purchase[];
    pointsPurchases: PointsPurchase[];
    ratings: Rating[];
    logs: ActivityLog[];
}

class AppStorageManager {
    private data: StorageData;

    constructor() {
        this.data = this.loadData();
        this.initializeDefaultData();
    }

    private loadData(): StorageData {
        const storedVersion: string | null = localStorage.getItem('storageVersion');
        
        // Check if we need to reset storage due to version mismatch
        if (storedVersion !== STORAGE_VERSION) {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.setItem('storageVersion', STORAGE_VERSION);
        }
        
        const stored: string | null = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            users: [],
            components: [],
            purchases: [],
            pointsPurchases: [],
            ratings: [],
            logs: []
        };
    }

    private saveData(): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    }

    private initializeDefaultData(): void {
        // Create a local demo administrator profile if one does not exist.
        if (!this.data.users.find((u: User): boolean => u.isAdmin)) {
            const admin: User = {
                id: this.generateId(),
                username: 'demo-admin',
                email: 'admin@elementrix.demo',
                pointsAvailable: 999999,
                pointsPending: 0,
                totalEarned: 0,
                totalSpent: 0,
                isAdmin: true,
                createdAt: Date.now()
            };
            this.data.users.push(admin);
            this.saveData();
        }

        // Add sample components if empty
        if (this.data.components.length === 0) {
            this.addSampleComponents();
        }
    }

    private addSampleComponents(): void {
        const admin: User | undefined = this.data.users.find((u: User): boolean => u.isAdmin);
        if (!admin) return;

        // Helper to create placeholder - תומך ב-emoji!
        const placeholder = (color: string, text: string): string => {
            const svg = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="200" fill="${color}"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="32" fill="white">${text}</text></svg>`;
            return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        };

        const samples: Omit<CodeComponent, 'id' | 'authorId' | 'authorName' | 'status' | 'rating' | 'ratingsCount' | 'purchaseCount' | 'createdAt' | 'approvedAt'>[] = [
            {name: 'כפתור גרדיאנט', description: 'כפתור עם אפקט גרדיאנט', category: 'buttons', image: placeholder('#667eea', '🔘'), price: 50, 
                html: '<button class="gradient-btn">לחץ כאן</button>', 
                css: '.gradient-btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; transition: 0.3s; } .gradient-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4); }', 
                js: 'document.querySelector(".gradient-btn").addEventListener("click", () => alert("כפתור נלחץ!"));'},
            {name: 'כרטיס Flip', description: 'כרטיס שמתהפך ב-3D', category: 'cards', image: placeholder('#764ba2', '🎴'), price: 80, 
                html: '<div class="flip-card"><div class="flip-inner"><div class="flip-front">חזית</div><div class="flip-back">גב</div></div></div>', 
                css: '.flip-card { width: 300px; height: 200px; perspective: 1000px; } .flip-inner { position: relative; width: 100%; height: 100%; transition: transform 0.6s; transform-style: preserve-3d; } .flip-card:hover .flip-inner { transform: rotateY(180deg); } .flip-front, .flip-back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; display: flex; align-items: center; justify-content: center; border-radius: 10px; } .flip-front { background: #667eea; color: white; } .flip-back { background: #764ba2; color: white; transform: rotateY(180deg); }', 
                js: ''},
            {name: 'טופס התחברות', description: 'טופס עם אנימציות', category: 'forms', image: placeholder('#10b981', '📝'), price: 120, 
                html: '<form class="login-form"><input type="email" placeholder="אימייל" required><input type="password" placeholder="סיסמה" required><button type="submit">התחבר</button></form>', 
                css: '.login-form { display: flex; flex-direction: column; gap: 15px; max-width: 300px; } .login-form input { padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; transition: 0.3s; } .login-form input:focus { border-color: #10b981; outline: none; } .login-form button { padding: 12px; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; } .login-form button:hover { background: #059669; }', 
                js: 'document.querySelector(".login-form").addEventListener("submit", (e) => { e.preventDefault(); alert("התחברות בוצעה!"); });'},
            {name: 'תפריט המבורגר', description: 'תפריט responsive', category: 'menus', image: placeholder('#f59e0b', '☰'), price: 90, 
                html: '<button class="hamburger" id="hamburger"><span></span><span></span><span></span></button><nav class="menu" id="menu"><a href="#">בית</a><a href="#">אודות</a><a href="#">צור קשר</a></nav>', 
                css: '.hamburger { display: flex; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 10px; } .hamburger span { width: 30px; height: 3px; background: #333; transition: 0.3s; } .menu { display: none; flex-direction: column; gap: 10px; padding: 20px; background: #f5f5f5; border-radius: 8px; } .menu.active { display: flex; } .hamburger.active span:nth-child(1) { transform: rotate(45deg) translateY(8px); } .hamburger.active span:nth-child(2) { opacity: 0; } .hamburger.active span:nth-child(3) { transform: rotate(-45deg) translateY(-8px); }', 
                js: 'document.getElementById("hamburger").addEventListener("click", function() { this.classList.toggle("active"); document.getElementById("menu").classList.toggle("active"); });'},
            {name: 'סליידר תמונות', description: 'סליידר אוטומטי', category: 'animations', image: placeholder('#8b5cf6', '✨'), price: 150, 
                html: '<div class="slider"><div class="slide active">תמונה 1</div><div class="slide">תמונה 2</div><div class="slide">תמונה 3</div><button class="prev">❮</button><button class="next">❯</button></div>', 
                css: '.slider { position: relative; width: 100%; height: 300px; overflow: hidden; border-radius: 10px; } .slide { position: absolute; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: white; font-size: 32px; opacity: 0; transition: opacity 0.5s; } .slide.active { opacity: 1; } .prev, .next { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; padding: 15px; cursor: pointer; font-size: 20px; } .prev { left: 10px; } .next { right: 10px; }', 
                js: 'let currentSlide = 0; const slides = document.querySelectorAll(".slide"); function showSlide(n) { slides[currentSlide].classList.remove("active"); currentSlide = (n + slides.length) % slides.length; slides[currentSlide].classList.add("active"); } document.querySelector(".prev").addEventListener("click", () => showSlide(currentSlide - 1)); document.querySelector(".next").addEventListener("click", () => showSlide(currentSlide + 1)); setInterval(() => showSlide(currentSlide + 1), 3000);'},
            {name: 'כפתור נאון', description: 'כפתור זוהר', category: 'buttons', image: placeholder('#00ff00', '💡'), price: 60, 
                html: '<button class="neon-btn">לחץ כאן</button>', 
                css: '.neon-btn { background: #000; color: #0f0; padding: 15px 30px; border: 2px solid #0f0; border-radius: 5px; font-size: 18px; cursor: pointer; text-shadow: 0 0 10px #0f0, 0 0 20px #0f0, 0 0 30px #0f0; box-shadow: 0 0 10px #0f0, 0 0 20px #0f0; transition: 0.3s; } .neon-btn:hover { background: #0f0; color: #000; text-shadow: none; box-shadow: 0 0 20px #0f0, 0 0 40px #0f0, 0 0 60px #0f0; }', 
                js: ''},
            {name: 'כרטיס פרופיל', description: 'כרטיס עם תמונה', category: 'cards', image: placeholder('#3b82f6', '👤'), price: 70, 
                html: '<div class="profile-card"><div class="profile-img">👤</div><h3>יוסי כהן</h3><p>מפתח Full Stack</p></div>', 
                css: '.profile-card { text-align: center; padding: 30px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border-radius: 15px; max-width: 300px; box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3); } .profile-img { font-size: 80px; margin-bottom: 15px; } .profile-card h3 { margin: 10px 0; font-size: 24px; } .profile-card p { opacity: 0.9; }', 
                js: ''},
            {name: 'טופס רישום', description: 'טופס עם ולידציה', category: 'forms', image: placeholder('#ec4899', '📋'), price: 130, 
                html: '<form class="register-form" id="registerForm"><input type="text" placeholder="שם מלא" required><input type="email" placeholder="אימייל" required><input type="password" id="password" placeholder="סיסמה" required minlength="6"><input type="password" id="confirm" placeholder="אימות סיסמה" required><button type="submit">הירשם</button></form>', 
                css: '.register-form { display: flex; flex-direction: column; gap: 15px; max-width: 350px; padding: 20px; background: #fef2f2; border-radius: 10px; } .register-form input { padding: 12px; border: 2px solid #ec4899; border-radius: 8px; transition: 0.3s; } .register-form input:focus { border-color: #db2777; outline: none; box-shadow: 0 0 10px rgba(236, 72, 153, 0.3); } .register-form button { padding: 12px; background: #ec4899; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; } .register-form button:hover { background: #db2777; }', 
                js: 'document.getElementById("registerForm").addEventListener("submit", function(e) { e.preventDefault(); const pass = document.getElementById("password").value; const confirm = document.getElementById("confirm").value; if (pass !== confirm) { alert("הסיסמאות לא תואמות!"); } else { alert("הרישום הצליח!"); } });'},
            {name: 'Dropdown תפריט', description: 'תפריט נפתח', category: 'menus', image: placeholder('#14b8a6', '▼'), price: 85, 
                html: '<div class="dropdown"><button class="dropdown-btn" id="dropdownBtn">בחר אפשרות ▼</button><div class="dropdown-menu" id="dropdownMenu"><a href="#">אפשרות 1</a><a href="#">אפשרות 2</a><a href="#">אפשרות 3</a></div></div>', 
                css: '.dropdown { position: relative; display: inline-block; } .dropdown-btn { padding: 12px 20px; background: #14b8a6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; } .dropdown-menu { display: none; position: absolute; top: 100%; left: 0; background: white; min-width: 200px; box-shadow: 0 8px 16px rgba(0,0,0,0.2); border-radius: 8px; margin-top: 5px; z-index: 1; } .dropdown-menu.active { display: block; animation: fadeIn 0.3s; } .dropdown-menu a { display: block; padding: 12px 20px; color: #333; text-decoration: none; transition: 0.2s; } .dropdown-menu a:hover { background: #f0f0f0; } @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }', 
                js: 'document.getElementById("dropdownBtn").addEventListener("click", () => document.getElementById("dropdownMenu").classList.toggle("active"));'},
            {name: 'Loading Spinner', description: 'אנימציית טעינה', category: 'animations', image: placeholder('#06b6d4', '⏳'), price: 40, 
                html: '<div class="spinner"></div>', 
                css: '.spinner { width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #06b6d4; border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }', 
                js: ''},
            {name: 'Progress Bar', description: 'בר התקדמות', category: 'animations', image: placeholder('#f97316', '📊'), price: 45, 
                html: '<div class="progress-container"><div class="progress-bar" id="progressBar">0%</div></div>', 
                css: '.progress-container { width: 100%; height: 30px; background: #e0e0e0; border-radius: 15px; overflow: hidden; } .progress-bar { height: 100%; background: linear-gradient(90deg, #f97316 0%, #fb923c 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; transition: width 0.3s; width: 0; }', 
                js: 'let progress = 0; const bar = document.getElementById("progressBar"); const interval = setInterval(() => { progress += 10; bar.style.width = progress + "%"; bar.textContent = progress + "%"; if (progress >= 100) clearInterval(interval); }, 500);'},
            {name: 'Ripple Effect', description: 'אפקט גלים', category: 'buttons', image: placeholder('#06b6d4', '🌊'), price: 55, 
                html: '<button class="ripple-btn">לחץ כאן</button>', 
                css: '.ripple-btn { position: relative; padding: 15px 30px; background: #06b6d4; color: white; border: none; border-radius: 8px; cursor: pointer; overflow: hidden; font-size: 16px; } .ripple-btn::after { content: ""; position: absolute; width: 100px; height: 100px; background: rgba(255,255,255,0.5); border-radius: 50%; transform: scale(0); animation: ripple 0.6s; } @keyframes ripple { to { transform: scale(4); opacity: 0; } }', 
                js: 'document.querySelector(".ripple-btn").addEventListener("click", function(e) { const ripple = document.createElement("span"); ripple.style.left = e.offsetX + "px"; ripple.style.top = e.offsetY + "px"; this.appendChild(ripple); setTimeout(() => ripple.remove(), 600); });'},
            {name: 'Glassmorphism', description: 'אפקט זכוכית', category: 'cards', image: placeholder('#a855f7', '🪟'), price: 95, 
                html: '<div class="glass-card"><h2>כרטיס זכוכית</h2><p>אפקט Glassmorphism מודרני</p></div>', 
                css: '.glass-card { padding: 30px; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 15px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); color: white; max-width: 300px; } .glass-card h2 { margin: 0 0 10px 0; font-size: 24px; } .glass-card p { margin: 0; opacity: 0.9; }', 
                js: ''},
            {name: 'Modal Popup', description: 'חלון קופץ', category: 'other', image: placeholder('#3b82f6', '📦'), price: 110, 
                html: '<button id="openModal">פתח Modal</button><div class="modal" id="modal"><div class="modal-content"><span class="close" id="closeModal">&times;</span><h2>כותרת</h2><p>תוכן ה-Modal</p></div></div>', 
                css: '.modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); } .modal.active { display: flex; align-items: center; justify-content: center; } .modal-content { background: white; padding: 30px; border-radius: 10px; max-width: 500px; position: relative; animation: slideDown 0.3s; } @keyframes slideDown { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } } .close { position: absolute; top: 10px; right: 15px; font-size: 28px; cursor: pointer; }', 
                js: 'document.getElementById("openModal").addEventListener("click", () => document.getElementById("modal").classList.add("active")); document.getElementById("closeModal").addEventListener("click", () => document.getElementById("modal").classList.remove("active"));'},
            {name: 'Tabs מונפשים', description: 'טאבים חלקים', category: 'menus', image: placeholder('#6366f1', '📑'), price: 75, 
                html: '<div class="tabs"><button class="tab-btn active" data-tab="tab1">Tab 1</button><button class="tab-btn" data-tab="tab2">Tab 2</button><button class="tab-btn" data-tab="tab3">Tab 3</button></div><div class="tab-content"><div class="tab-panel active" id="tab1">תוכן Tab 1</div><div class="tab-panel" id="tab2">תוכן Tab 2</div><div class="tab-panel" id="tab3">תוכן Tab 3</div></div>', 
                css: '.tabs { display: flex; gap: 5px; border-bottom: 2px solid #e0e0e0; } .tab-btn { padding: 12px 24px; background: transparent; border: none; cursor: pointer; color: #666; font-size: 16px; transition: 0.3s; border-bottom: 3px solid transparent; } .tab-btn.active { color: #6366f1; border-bottom-color: #6366f1; } .tab-panel { display: none; padding: 20px; animation: fadeIn 0.4s; } .tab-panel.active { display: block; }', 
                js: 'document.querySelectorAll(".tab-btn").forEach(btn => btn.addEventListener("click", function() { document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active")); document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active")); this.classList.add("active"); document.getElementById(this.dataset.tab).classList.add("active"); }));'},
            {name: 'Tooltip', description: 'רכיב tooltip', category: 'other', image: placeholder('#84cc16', '💬'), price: 35, 
                html: '<div class="tooltip-container">עבור עליי<span class="tooltip">זה Tooltip!</span></div>', 
                css: '.tooltip-container { position: relative; display: inline-block; padding: 10px 20px; background: #84cc16; color: white; border-radius: 5px; cursor: pointer; } .tooltip { visibility: hidden; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); background: #333; color: white; padding: 8px 12px; border-radius: 5px; font-size: 14px; white-space: nowrap; opacity: 0; transition: 0.3s; } .tooltip::after { content: ""; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-top-color: #333; } .tooltip-container:hover .tooltip { visibility: visible; opacity: 1; }', 
                js: ''},
            {name: 'Badge תגים', description: 'תגים צבעוניים', category: 'other', image: placeholder('#ef4444', '🏷️'), price: 25, 
                html: '<span class="badge badge-success">הצלחה</span> <span class="badge badge-warning">אזהרה</span> <span class="badge badge-error">שגיאה</span> <span class="badge badge-info">מידע</span>', 
                css: '.badge { display: inline-block; padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; color: white; margin: 5px; } .badge-success { background: #10b981; } .badge-warning { background: #f59e0b; } .badge-error { background: #ef4444; } .badge-info { background: #3b82f6; }', 
                js: ''},
            {name: 'Accordion', description: 'רכיב שאלות', category: 'other', image: placeholder('#eab308', '📋'), price: 65, 
                html: '<div class="accordion"><div class="accordion-item"><button class="accordion-header">שאלה 1</button><div class="accordion-content"><p>תשובה 1</p></div></div><div class="accordion-item"><button class="accordion-header">שאלה 2</button><div class="accordion-content"><p>תשובה 2</p></div></div></div>', 
                css: '.accordion-item { border: 1px solid #e0e0e0; margin-bottom: 10px; border-radius: 5px; } .accordion-header { width: 100%; padding: 15px; background: #eab308; color: white; border: none; text-align: right; cursor: pointer; font-size: 16px; border-radius: 5px; } .accordion-content { max-height: 0; overflow: hidden; transition: max-height 0.3s; padding: 0 15px; } .accordion-content.active { max-height: 200px; padding: 15px; }', 
                js: 'document.querySelectorAll(".accordion-header").forEach(btn => btn.addEventListener("click", function() { this.nextElementSibling.classList.toggle("active"); }));'},
            {name: 'Breadcrumb', description: 'ניווט מסלול', category: 'menus', image: placeholder('#64748b', '🗺️'), price: 30, 
                html: '<nav class="breadcrumb"><a href="#">בית</a> / <a href="#">מוצרים</a> / <span>מוצר נוכחי</span></nav>', 
                css: '.breadcrumb { padding: 12px 20px; background: #f8f9fa; border-radius: 8px; font-size: 14px; } .breadcrumb a { color: #64748b; text-decoration: none; transition: 0.2s; } .breadcrumb a:hover { color: #334155; text-decoration: underline; } .breadcrumb span { color: #334155; font-weight: 600; }', 
                js: ''},
            {name: 'Pagination', description: 'מספור עמודים', category: 'menus', image: placeholder('#8b5cf6', '🔢'), price: 55, 
                html: '<div class="pagination"><button class="page-btn">❮</button><button class="page-btn active">1</button><button class="page-btn">2</button><button class="page-btn">3</button><button class="page-btn">4</button><button class="page-btn">❯</button></div>', 
                css: '.pagination { display: flex; gap: 8px; justify-content: center; } .page-btn { padding: 10px 15px; background: white; border: 1px solid #e0e0e0; border-radius: 5px; cursor: pointer; transition: 0.3s; font-size: 14px; } .page-btn:hover { background: #f0f0f0; } .page-btn.active { background: #8b5cf6; color: white; border-color: #8b5cf6; }', 
                js: 'document.querySelectorAll(".page-btn").forEach(btn => btn.addEventListener("click", function() { if (this.textContent.match(/[0-9]/)) { document.querySelectorAll(".page-btn").forEach(b => b.classList.remove("active")); this.classList.add("active"); } }));'},
            {name: 'Toggle כפתור', description: 'הפעלה וכיבוי', category: 'buttons', image: placeholder('#10b981', '🔘'), price: 42, 
                html: '<label class="toggle"><input type="checkbox" id="toggleSwitch"><span class="slider"></span></label>', 
                css: '.toggle { position: relative; display: inline-block; width: 60px; height: 30px; } .toggle input { opacity: 0; width: 0; height: 0; } .slider { position: absolute; cursor: pointer; inset: 0; background: #ccc; border-radius: 30px; transition: 0.4s; } .slider:before { position: absolute; content: ""; height: 22px; width: 22px; left: 4px; bottom: 4px; background: white; border-radius: 50%; transition: 0.4s; } input:checked + .slider { background: #10b981; } input:checked + .slider:before { transform: translateX(30px); }', 
                js: 'document.getElementById("toggleSwitch").addEventListener("change", function() { alert(this.checked ? "מופעל!" : "כבוי!"); });'},
            {name: 'כרטיס מחיר', description: 'כרטיס תמחור', category: 'cards', image: placeholder('#d97706', '💰'), price: 88, 
                html: '<div class="pricing-card"><h3>חבילת Pro</h3><div class="price"><span class="currency">₪</span><span class="amount">99</span><span class="period">/חודש</span></div><ul><li>✓ יתרון 1</li><li>✓ יתרון 2</li><li>✓ יתרון 3</li></ul><button class="buy-btn">רכוש עכשיו</button></div>', 
                css: '.pricing-card { text-align: center; padding: 30px; background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); color: white; border-radius: 15px; max-width: 300px; box-shadow: 0 10px 30px rgba(217, 119, 6, 0.3); } .pricing-card h3 { margin: 0 0 20px 0; font-size: 24px; } .price { display: flex; align-items: center; justify-content: center; margin: 20px 0; } .amount { font-size: 48px; font-weight: bold; margin: 0 5px; } .currency, .period { font-size: 18px; opacity: 0.9; } .pricing-card ul { list-style: none; padding: 0; margin: 20px 0; } .pricing-card li { padding: 8px 0; } .buy-btn { width: 100%; padding: 12px; background: white; color: #d97706; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.3s; } .buy-btn:hover { transform: scale(1.05); }', 
                js: ''},
            {name: 'חיפוש מתקדם', description: 'חיפוש עם סינונים', category: 'forms', image: placeholder('#06b6d4', '🔍'), price: 105, 
                html: '<div class="search-advanced"><input type="text" id="searchInput" placeholder="חפש..."><div class="filters"><select><option>כל הקטגוריות</option><option>כפתורים</option><option>כרטיסים</option></select><button>🔍 חפש</button></div></div>', 
                css: '.search-advanced { max-width: 600px; } .search-advanced input { width: 100%; padding: 15px; border: 2px solid #06b6d4; border-radius: 8px; font-size: 16px; margin-bottom: 15px; } .filters { display: flex; gap: 10px; } .filters select { flex: 1; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; } .filters button { padding: 12px 24px; background: #06b6d4; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }', 
                js: 'document.getElementById("searchInput").addEventListener("input", (e) => console.log("חיפוש:", e.target.value));'},
            {name: 'Sidebar', description: 'תפריט צד', category: 'menus', image: placeholder('#475569', '📊'), price: 95, 
                html: '<div class="sidebar" id="sidebar"><button class="close-btn" id="closeSidebar">&times;</button><h3>תפריט</h3><nav><a href="#">בית</a><a href="#">מוצרים</a><a href="#">צור קשר</a></nav></div><button id="openSidebar">☰ תפריט</button><div class="overlay" id="overlay"></div>', 
                css: '.sidebar { position: fixed; top: 0; right: -300px; width: 300px; height: 100%; background: white; box-shadow: -5px 0 15px rgba(0,0,0,0.3); transition: 0.3s; z-index: 1000; padding: 20px; } .sidebar.active { right: 0; } .close-btn { position: absolute; top: 10px; left: 10px; background: none; border: none; font-size: 32px; cursor: pointer; } .sidebar nav { margin-top: 50px; } .sidebar a { display: block; padding: 15px; color: #333; text-decoration: none; border-bottom: 1px solid #e0e0e0; } .overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999; } .overlay.active { display: block; }', 
                js: 'document.getElementById("openSidebar").addEventListener("click", () => { document.getElementById("sidebar").classList.add("active"); document.getElementById("overlay").classList.add("active"); }); document.getElementById("closeSidebar").addEventListener("click", () => { document.getElementById("sidebar").classList.remove("active"); document.getElementById("overlay").classList.remove("active"); }); document.getElementById("overlay").addEventListener("click", () => { document.getElementById("sidebar").classList.remove("active"); document.getElementById("overlay").classList.remove("active"); });'},
            {name: 'Count Up', description: 'מונה עולה', category: 'animations', image: placeholder('#22c55e', '🔢'), price: 38, 
                html: '<div class="counter"><div class="count-number" id="counter">0</div><p>לקוחות מרוצים</p></div>', 
                css: '.counter { text-align: center; padding: 30px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; border-radius: 15px; max-width: 200px; } .count-number { font-size: 48px; font-weight: bold; margin-bottom: 10px; } .counter p { margin: 0; font-size: 16px; opacity: 0.9; }', 
                js: 'let count = 0; const target = 100; const counter = document.getElementById("counter"); const interval = setInterval(() => { count++; counter.textContent = count; if (count >= target) clearInterval(interval); }, 20);'},
            {name: 'Social Share', description: 'שיתוף ברשתות', category: 'buttons', image: placeholder('#3b82f6', '👥'), price: 48, 
                html: '<div class="social-share"><button class="social-btn facebook">👍 Facebook</button><button class="social-btn twitter">🐦 Twitter</button><button class="social-btn whatsapp">💬 WhatsApp</button></div>', 
                css: '.social-share { display: flex; gap: 10px; flex-wrap: wrap; } .social-btn { padding: 10px 20px; border: none; border-radius: 5px; color: white; cursor: pointer; font-size: 14px; transition: 0.3s; } .facebook { background: #3b5998; } .twitter { background: #1da1f2; } .whatsapp { background: #25d366; } .social-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.3); }', 
                js: 'document.querySelectorAll(".social-btn").forEach(btn => btn.addEventListener("click", function() { alert("משתף ב-" + this.textContent); }));'},
            {name: 'Blog Post', description: 'כרטיס פוסט', category: 'cards', image: placeholder('#f59e0b', '📝'), price: 72, 
                html: '<article class="blog-post"><img src="https://via.placeholder.com/400x200" alt="תמונה"><div class="post-content"><h3>כותרת הפוסט</h3><p>תיאור קצר של הפוסט...</p><a href="#" class="read-more">קרא עוד →</a></div></article>', 
                css: '.blog-post { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); max-width: 400px; transition: 0.3s; } .blog-post:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); } .blog-post img { width: 100%; height: 200px; object-fit: cover; } .post-content { padding: 20px; } .post-content h3 { margin: 0 0 10px; font-size: 20px; } .post-content p { color: #666; line-height: 1.6; margin-bottom: 15px; } .read-more { color: #f59e0b; font-weight: bold; text-decoration: none; } .read-more:hover { text-decoration: underline; }', 
                js: ''},
            {name: 'צור קשר', description: 'טופס צור קשר', category: 'forms', image: placeholder('#ec4899', '✉️'), price: 115, 
                html: '<form class="contact-form"><h3>✉️ צור קשר</h3><input type="text" placeholder="שם" required><input type="email" placeholder="אימייל" required><textarea placeholder="הודעה" rows="4" required></textarea><button type="submit">שלח</button></form>', 
                css: '.contact-form { padding: 30px; background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); border-radius: 12px; max-width: 400px; color: white; } .contact-form h3 { margin: 0 0 20px; text-align: center; } .contact-form input, .contact-form textarea { width: 100%; padding: 12px; margin-bottom: 15px; border: none; border-radius: 6px; font-size: 14px; font-family: inherit; } .contact-form button { width: 100%; padding: 12px; background: white; color: #ec4899; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.3s; } .contact-form button:hover { transform: scale(1.02); }', 
                js: ''},
            {name: 'Mega Menu', description: 'תפריט ענק', category: 'menus', image: placeholder('#6366f1', '🍔'), price: 125, 
                html: '<div class="mega-menu"><button class="mega-btn">תפריט ▼</button><div class="mega-content"><div class="mega-col"><h4>קטגוריה 1</h4><a href="#">פריט 1</a><a href="#">פריט 2</a></div><div class="mega-col"><h4>קטגוריה 2</h4><a href="#">פריט 3</a><a href="#">פריט 4</a></div></div></div>', 
                css: '.mega-menu { position: relative; display: inline-block; } .mega-btn { padding: 12px 24px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; } .mega-content { display: none; position: absolute; top: 100%; left: 0; background: white; box-shadow: 0 8px 32px rgba(0,0,0,0.2); border-radius: 8px; padding: 20px; width: 400px; z-index: 10; } .mega-menu:hover .mega-content { display: flex; gap: 30px; } .mega-col h4 { margin: 0 0 10px; color: #6366f1; } .mega-col a { display: block; padding: 8px 0; color: #333; text-decoration: none; } .mega-col a:hover { color: #6366f1; }', 
                js: ''},
            {name: 'Parallax', description: 'גלילה עם עומק', category: 'animations', image: placeholder('#a855f7', '🌊'), price: 68, 
                html: '<div class="parallax-section"><div class="parallax-layer layer1">🌊</div><div class="parallax-layer layer2">⭐</div></div>', 
                css: '.parallax-section { position: relative; height: 400px; overflow: hidden; background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%); } .parallax-layer { position: absolute; font-size: 80px; transition: transform 0.1s; } .layer1 { top: 50%; left: 20%; } .layer2 { top: 30%; right: 20%; }', 
                js: 'document.addEventListener("mousemove", (e) => { const layers = document.querySelectorAll(".parallax-layer"); layers.forEach((layer, i) => { const speed = (i + 1) * 0.05; const x = (window.innerWidth - e.pageX * speed) / 100; const y = (window.innerHeight - e.pageY * speed) / 100; layer.style.transform = `translate(${x}px, ${y}px)`; }); });'},
            {name: 'Download כפתור', description: 'כפתור הורדה', category: 'buttons', image: placeholder('#10b981', '⬇️'), price: 52, 
                html: '<button class="download-btn" id="downloadBtn">⬇️ הורד קובץ</button>', 
                css: '.download-btn { padding: 15px 30px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); } .download-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4); }', 
                js: 'document.getElementById("downloadBtn").addEventListener("click", () => alert("הורד קובץ..."));'},
            {name: 'Team Member', description: 'כרטיס חבר צוות', category: 'cards', image: placeholder('#6366f1', '👨'), price: 65, 
                html: '<div class="team-card"><div class="team-img">👨</div><h3>יוסי לוי</h3><p>מנכ"ל</p><div class="social-links"><a href="#">👍</a><a href="#">🐦</a><a href="#">💼</a></div></div>', 
                css: '.team-card { text-align: center; padding: 25px; background: white; border-radius: 12px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); max-width: 250px; transition: 0.3s; } .team-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2); } .team-img { font-size: 60px; margin-bottom: 15px; } .team-card h3 { margin: 10px 0 5px; font-size: 20px; } .team-card p { color: #666; font-size: 14px; margin-bottom: 15px; } .social-links { display: flex; gap: 10px; justify-content: center; } .social-links a { font-size: 18px; transition: 0.2s; } .social-links a:hover { transform: scale(1.2); }', 
                js: ''},
            {name: 'Newsletter', description: 'הרשמה לניוזלטר', category: 'forms', image: placeholder('#f59e0b', '📧'), price: 58, 
                html: '<form class="newsletter"><h3>📧 הירשם לניוזלטר</h3><div class="input-group"><input type="email" placeholder="הכנס אימייל" required><button type="submit">הירשם</button></div></form>', 
                css: '.newsletter { padding: 30px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px; max-width: 400px; color: white; } .newsletter h3 { margin: 0 0 20px 0; text-align: center; } .input-group { display: flex; gap: 10px; } .input-group input { flex: 1; padding: 12px; border: none; border-radius: 6px; font-size: 14px; } .input-group button { padding: 12px 24px; background: white; color: #f59e0b; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.3s; } .input-group button:hover { transform: scale(1.05); }', 
                js: ''},
            {name: 'Filter Tags', description: 'תגי סינון', category: 'menus', image: placeholder('#14b8a6', '🏷️'), price: 62, 
                html: '<div class="filter-tags"><button class="filter-tag active" data-filter="all">הכל</button><button class="filter-tag" data-filter="new">חדש</button><button class="filter-tag" data-filter="popular">פופולרי</button><button class="filter-tag" data-filter="sale">מבצע</button></div>', 
                css: '.filter-tags { display: flex; gap: 10px; flex-wrap: wrap; } .filter-tag { padding: 8px 16px; background: white; border: 2px solid #14b8a6; color: #14b8a6; border-radius: 20px; cursor: pointer; transition: 0.3s; font-size: 14px; font-weight: 600; } .filter-tag:hover { background: #f0fdfa; } .filter-tag.active { background: #14b8a6; color: white; }', 
                js: 'document.querySelectorAll(".filter-tag").forEach(tag => tag.addEventListener("click", function() { document.querySelectorAll(".filter-tag").forEach(t => t.classList.remove("active")); this.classList.add("active"); console.log("Filtered:", this.dataset.filter); }));'},
            {name: 'Typing Effect', description: 'טקסט מתכתב', category: 'animations', image: placeholder('#06b6d4', '⌨️'), price: 44, 
                html: '<div class="typing-container"><span id="typingText"></span><span class="cursor">|</span></div>', 
                css: '.typing-container { font-size: 24px; font-family: monospace; color: #06b6d4; padding: 20px; } .cursor { animation: blink 1s infinite; } @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }', 
                js: 'const text = "שלום! אני טקסט מתכתב"; let i = 0; const el = document.getElementById("typingText"); function type() { if (i < text.length) { el.textContent += text.charAt(i); i++; setTimeout(type, 100); } } type();'},
            {name: 'Back to Top', description: 'חזרה לראש', category: 'buttons', image: placeholder('#64748b', '⬆️'), price: 35, 
                html: '<button class="back-top" id="backTop">⬆️</button>', 
                css: '.back-top { position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; background: #64748b; color: white; border: none; border-radius: 50%; font-size: 24px; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: 0.3s; display: none; } .back-top.show { display: block; } .back-top:hover { background: #475569; transform: translateY(-5px); }', 
                js: 'const btn = document.getElementById("backTop"); window.addEventListener("scroll", () => { btn.classList.toggle("show", window.scrollY > 300); }); btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));'},
            {name: 'Product Grid', description: 'רשת מוצרים', category: 'cards', image: placeholder('#a855f7', '🛒'), price: 98, 
                html: '<div class="product-grid"><div class="product-item"><img src="https://via.placeholder.com/200" alt="מוצר"><h4>מוצר 1</h4><p>₪99</p></div><div class="product-item"><img src="https://via.placeholder.com/200" alt="מוצר"><h4>מוצר 2</h4><p>₪149</p></div></div>', 
                css: '.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; } .product-item { background: white; border-radius: 10px; padding: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: 0.3s; text-align: center; } .product-item:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); } .product-item img { width: 100%; border-radius: 8px; margin-bottom: 10px; } .product-item h4 { margin: 10px 0; } .product-item p { font-size: 20px; font-weight: bold; color: #a855f7; }', 
                js: ''},
            {name: 'Review דירוג', description: 'טופס דירוג', category: 'forms', image: placeholder('#eab308', '⭐'), price: 78, 
                html: '<form class="review-form"><h3>דרג אותנו</h3><div class="stars" id="stars">☆☆☆☆☆</div><textarea placeholder="התגובה שלך..." rows="4" required></textarea><button type="submit">שלח</button></form>', 
                css: '.review-form { max-width: 400px; padding: 25px; background: #fef9e7; border-radius: 10px; border: 2px solid #eab308; } .review-form h3 { text-align: center; margin-bottom: 15px; } .stars { font-size: 36px; text-align: center; margin: 15px 0; color: #eab308; cursor: pointer; } .review-form textarea { width: 100%; padding: 12px; border: 2px solid #eab308; border-radius: 8px; margin-bottom: 15px; font-family: inherit; } .review-form button { width: 100%; padding: 12px; background: #eab308; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }', 
                js: 'const stars = document.getElementById("stars"); let rating = 0; stars.addEventListener("click", (e) => { const rect = stars.getBoundingClientRect(); const x = e.clientX - rect.left; rating = Math.ceil((x / rect.width) * 5); stars.textContent = "★".repeat(rating) + "☆".repeat(5 - rating); });'},
            {name: 'Search Bar', description: 'חיפוש עם autocomplete', category: 'menus', image: placeholder('#3b82f6', '🔎'), price: 92, 
                html: '<div class="search-bar"><input type="text" id="searchBar" placeholder="חפש..."><div class="suggestions" id="suggestions"></div></div>', 
                css: '.search-bar { position: relative; max-width: 400px; } .search-bar input { width: 100%; padding: 15px; border: 2px solid #3b82f6; border-radius: 25px; font-size: 16px; } .suggestions { position: absolute; top: 100%; left: 0; right: 0; background: white; box-shadow: 0 4px 15px rgba(0,0,0,0.2); border-radius: 10px; margin-top: 5px; max-height: 200px; overflow-y: auto; display: none; } .suggestions.active { display: block; } .suggestion-item { padding: 12px 20px; cursor: pointer; transition: 0.2s; } .suggestion-item:hover { background: #f0f0f0; }', 
                js: 'const input = document.getElementById("searchBar"); const suggestions = document.getElementById("suggestions"); const items = ["כפתור", "כרטיס", "טופס", "תפריט"]; input.addEventListener("input", (e) => { const val = e.target.value; if (val) { const filtered = items.filter(i => i.includes(val)); suggestions.innerHTML = filtered.map(i => `<div class="suggestion-item">${i}</div>`).join(""); suggestions.classList.add("active"); } else { suggestions.classList.remove("active"); } });'},
            {name: 'Fade In Scroll', description: 'אלמנטים מופיעים', category: 'animations', image: placeholder('#ec4899', '✨'), price: 56, 
                html: '<div class="fade-element">אני מופיע בגלילה!</div>', 
                css: '.fade-element { padding: 40px; background: linear-gradient(135deg, #ec4899, #db2777); color: white; text-align: center; font-size: 24px; border-radius: 10px; opacity: 0; transform: translateY(50px); transition: all 0.8s; } .fade-element.visible { opacity: 1; transform: translateY(0); }', 
                js: 'const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); }); }); document.querySelectorAll(".fade-element").forEach(el => observer.observe(el));'},
            {name: 'Loading State', description: 'מצב טעינה', category: 'buttons', image: placeholder('#f97316', '🔄'), price: 47, 
                html: '<button class="loading-btn" id="loadingBtn">לחץ כאן</button>', 
                css: '.loading-btn { padding: 15px 30px; background: #f97316; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; position: relative; transition: 0.3s; } .loading-btn.loading { pointer-events: none; opacity: 0.7; } .loading-btn.loading::after { content: ""; position: absolute; right: 15px; width: 16px; height: 16px; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }', 
                js: 'document.getElementById("loadingBtn").addEventListener("click", function() { this.classList.add("loading"); this.textContent = "טוען..."; setTimeout(() => { this.classList.remove("loading"); this.textContent = "הצליח!"; }, 2000); });'},
            {name: 'Testimonial', description: 'כרטיס המלצה', category: 'cards', image: placeholder('#8b5cf6', '💬'), price: 68, 
                html: '<div class="testimonial"><div class="quote">"שירות מצוין!"</div><div class="author">👤 יוסי כהן</div></div>', 
                css: '.testimonial { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 30px; border-radius: 15px; max-width: 400px; box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3); text-align: center; } .quote { font-size: 20px; font-style: italic; margin-bottom: 20px; line-height: 1.6; } .author { font-size: 16px; opacity: 0.9; }', 
                js: ''},
            {name: 'Multi-Step Form', description: 'טופס רב שלבי', category: 'forms', image: placeholder('#14b8a6', '🚺'), price: 135, 
                html: '<form class="multi-step"><div class="step active"><h3>שלב 1</h3><input type="text" placeholder="שם" required><button type="button" onclick="nextStep()">הבא</button></div><div class="step"><h3>שלב 2</h3><input type="email" placeholder="אימייל" required><button type="submit">סיים</button></div></form>', 
                css: '.multi-step { max-width: 400px; } .step { display: none; padding: 25px; background: #f0fdfa; border-radius: 10px; border: 2px solid #14b8a6; } .step.active { display: block; } .step h3 { text-align: center; margin-bottom: 20px; } .step input { width: 100%; padding: 12px; border: 2px solid #14b8a6; border-radius: 8px; margin-bottom: 15px; } .step button { width: 100%; padding: 12px; background: #14b8a6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }', 
                js: 'let currentStep = 0; function nextStep() { const steps = document.querySelectorAll(".step"); steps[currentStep].classList.remove("active"); currentStep++; if (currentStep < steps.length) steps[currentStep].classList.add("active"); }'},
            {name: 'Context Menu', description: 'תפריט ימני', category: 'menus', image: placeholder('#64748b', '🗂️'), price: 72, 
                html: '<div class="context-area" id="contextArea">לחץ ימני כאן<div class="context-menu" id="contextMenu"><div class="menu-item">העתק</div><div class="menu-item">הדבק</div><div class="menu-item">מחק</div></div></div>', 
                css: '.context-area { padding: 100px; background: #f5f5f5; text-align: center; font-size: 20px; border-radius: 10px; position: relative; } .context-menu { display: none; position: absolute; background: white; box-shadow: 0 4px 15px rgba(0,0,0,0.2); border-radius: 8px; overflow: hidden; z-index: 1000; } .context-menu.active { display: block; } .menu-item { padding: 12px 20px; cursor: pointer; transition: 0.2s; } .menu-item:hover { background: #f0f0f0; }', 
                js: 'const area = document.getElementById("contextArea"); const menu = document.getElementById("contextMenu"); area.addEventListener("contextmenu", (e) => { e.preventDefault(); menu.style.left = e.offsetX + "px"; menu.style.top = e.offsetY + "px"; menu.classList.add("active"); }); document.addEventListener("click", () => menu.classList.remove("active"));'},
            {name: 'Wave Animation', description: 'אפקט גלים', category: 'animations', image: placeholder('#06b6d4', '🌊'), price: 51, 
                html: '<div class="wave-container"><div class="wave"></div><div class="wave"></div></div>', 
                css: '.wave-container { position: relative; width: 100%; height: 200px; background: linear-gradient(135deg, #06b6d4, #0891b2); overflow: hidden; border-radius: 10px; } .wave { position: absolute; bottom: 0; left: 0; width: 200%; height: 100px; background: rgba(255,255,255,0.3); border-radius: 40%; animation: wave 3s infinite linear; } .wave:nth-child(2) { animation-delay: -1.5s; opacity: 0.5; } @keyframes wave { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }', 
                js: ''},
            {name: 'Icon Only', description: 'כפתורי אייקון', category: 'buttons', image: placeholder('#eab308', '🔘'), price: 32, 
                html: '<div class="icon-buttons"><button class="icon-btn">❤️</button><button class="icon-btn">⭐</button><button class="icon-btn">🔔</button><button class="icon-btn">⚙️</button></div>', 
                css: '.icon-buttons { display: flex; gap: 10px; } .icon-btn { width: 50px; height: 50px; background: white; border: 2px solid #eab308; border-radius: 50%; font-size: 24px; cursor: pointer; transition: 0.3s; } .icon-btn:hover { background: #eab308; transform: scale(1.1); }', 
                js: ''},
            {name: 'Image Gallery', description: 'גלריית תמונות', category: 'cards', image: placeholder('#ec4899', '🖼️'), price: 105, 
                html: '<div class="gallery"><img src="https://via.placeholder.com/300" alt="1"><img src="https://via.placeholder.com/300" alt="2"><img src="https://via.placeholder.com/300" alt="3"></div>', 
                css: '.gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; } .gallery img { width: 100%; height: 200px; object-fit: cover; border-radius: 10px; cursor: pointer; transition: 0.3s; } .gallery img:hover { transform: scale(1.05); box-shadow: 0 8px 25px rgba(236, 72, 153, 0.3); }', 
                js: ''},
            {name: 'File Upload', description: 'העלאת קבצים', category: 'forms', image: placeholder('#10b981', '📁'), price: 88, 
                html: '<div class="file-upload"><input type="file" id="fileInput" hidden><label for="fileInput" class="upload-label">📁 בחר קובץ</label><div id="fileName"></div></div>', 
                css: '.file-upload { text-align: center; padding: 30px; background: #f0fdf4; border: 2px dashed #10b981; border-radius: 10px; } .upload-label { display: inline-block; padding: 15px 30px; background: #10b981; color: white; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s; } .upload-label:hover { background: #059669; transform: scale(1.05); } #fileName { margin-top: 15px; color: #666; }', 
                js: 'document.getElementById("fileInput").addEventListener("change", function() { document.getElementById("fileName").textContent = this.files[0] ? "קובץ נבחר: " + this.files[0].name : ""; });'},
            {name: 'User Menu', description: 'תפריט משתמש', category: 'menus', image: placeholder('#6366f1', '👤'), price: 65, 
                html: '<div class="user-menu"><button class="user-btn" id="userBtn">👤 יוסי ▼</button><div class="user-dropdown" id="userDropdown"><a href="#">פרופיל</a><a href="#">הגדרות</a><a href="#">התנתק</a></div></div>', 
                css: '.user-menu { position: relative; display: inline-block; } .user-btn { padding: 12px 20px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; } .user-dropdown { display: none; position: absolute; top: 100%; right: 0; background: white; box-shadow: 0 8px 20px rgba(0,0,0,0.15); border-radius: 8px; margin-top: 8px; min-width: 180px; z-index: 10; } .user-dropdown.active { display: block; } .user-dropdown a { display: block; padding: 12px 20px; color: #333; text-decoration: none; transition: 0.2s; } .user-dropdown a:hover { background: #f5f5ff; color: #6366f1; }', 
                js: 'document.getElementById("userBtn").addEventListener("click", () => document.getElementById("userDropdown").classList.toggle("active"));'},
            {name: 'Hover Zoom', description: 'זום בהובר', category: 'animations', image: placeholder('#a855f7', '🔍'), price: 39, 
                html: '<div class="zoom-box"><img src="https://via.placeholder.com/300" alt="תמונה"></div>', 
                css: '.zoom-box { width: 300px; overflow: hidden; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); } .zoom-box img { width: 100%; transition: transform 0.5s; } .zoom-box:hover img { transform: scale(1.2); }', 
                js: ''},
            {name: 'Split Button', description: 'כפתור מפוצל', category: 'buttons', image: placeholder('#f97316', '🔀'), price: 58, 
                html: '<div class="split-btn"><button class="main-btn">פעולה</button><button class="split-dropdown">▼</button></div>', 
                css: '.split-btn { display: inline-flex; } .main-btn { padding: 12px 24px; background: #f97316; color: white; border: none; border-radius: 8px 0 0 8px; cursor: pointer; } .split-dropdown { padding: 12px 16px; background: #ea580c; color: white; border: none; border-radius: 0 8px 8px 0; cursor: pointer; border-left: 1px solid rgba(255,255,255,0.3); } .main-btn:hover { background: #ea580c; } .split-dropdown:hover { background: #dc2626; }', 
                js: ''},
            {name: 'Stats Card', description: 'כרטיס סטטיסטיקה', category: 'cards', image: placeholder('#22c55e', '📊'), price: 75, 
                html: '<div class="stats-card"><div class="stat-icon">📊</div><div class="stat-number">1,234</div><div class="stat-label">משתמשים</div></div>', 
                css: '.stats-card { text-align: center; padding: 30px; background: linear-gradient(135deg, #22c55e, #16a34a); color: white; border-radius: 15px; max-width: 250px; box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3); } .stat-icon { font-size: 48px; margin-bottom: 15px; } .stat-number { font-size: 36px; font-weight: bold; margin-bottom: 8px; } .stat-label { font-size: 16px; opacity: 0.9; }', 
                js: ''},
            {name: 'Login Social', description: 'התחברות רשתות', category: 'forms', image: placeholder('#3b82f6', '👥'), price: 95, 
                html: '<div class="social-login"><h3>התחברות</h3><button class="social-btn google">👤 Google</button><button class="social-btn facebook">👍 Facebook</button><button class="social-btn twitter">🐦 Twitter</button></div>', 
                css: '.social-login { max-width: 350px; padding: 25px; background: white; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1); } .social-login h3 { text-align: center; margin-bottom: 20px; } .social-btn { width: 100%; padding: 12px; margin-bottom: 10px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; } .google { background: #ea4335; color: white; } .facebook { background: #1877f2; color: white; } .twitter { background: #1da1f2; color: white; } .social-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.2); }', 
                js: ''},
            {name: 'Color Picker', description: 'בחירת צבע', category: 'other', image: placeholder('#ec4899', '🎨'), price: 68, 
                html: '<div class="color-picker"><input type="color" id="colorPicker" value="#ec4899"><div id="colorValue">#ec4899</div></div>', 
                css: '.color-picker { text-align: center; padding: 25px; background: white; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); max-width: 200px; } .color-picker input[type="color"] { width: 100px; height: 100px; border: none; border-radius: 10px; cursor: pointer; } #colorValue { margin-top: 15px; font-size: 18px; font-family: monospace; font-weight: bold; color: #333; }', 
                js: 'document.getElementById("colorPicker").addEventListener("input", (e) => document.getElementById("colorValue").textContent = e.target.value);'},
            {name: 'Rating Stars', description: 'דירוג כוכבים', category: 'other', image: placeholder('#fbbf24', '⭐'), price: 42, 
                html: '<div class="rating" id="rating">⭐⭐⭐⭐⭐</div>', 
                css: '.rating { font-size: 32px; cursor: pointer; letter-spacing: 5px; }', 
                js: 'document.getElementById("rating").addEventListener("click", (e) => { const rect = e.target.getBoundingClientRect(); const x = e.clientX - rect.left; const rating = Math.ceil((x / rect.width) * 5); e.target.textContent = "⭐".repeat(rating) + "☆".repeat(5 - rating); });'},
            {name: 'Timeline', description: 'ציר זמן', category: 'other', image: placeholder('#8b5cf6', '📅'), price: 88, 
                html: '<div class="timeline"><div class="timeline-item"><div class="dot"></div><div class="content"><h4>2023</h4><p>אירוע 1</p></div></div><div class="timeline-item"><div class="dot"></div><div class="content"><h4>2024</h4><p>אירוע 2</p></div></div></div>', 
                css: '.timeline { position: relative; padding: 20px 0; } .timeline::before { content: ""; position: absolute; left: 20px; top: 0; bottom: 0; width: 2px; background: #8b5cf6; } .timeline-item { position: relative; padding: 0 0 30px 50px; } .dot { position: absolute; left: 11px; width: 20px; height: 20px; background: #8b5cf6; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #8b5cf6; } .content h4 { margin: 0 0 5px; color: #8b5cf6; } .content p { margin: 0; color: #666; }', 
                js: ''},
            {name: 'Calendar', description: 'לוח שנה', category: 'other', image: placeholder('#14b8a6', '📆'), price: 125, 
                html: '<div class="calendar"><div class="calendar-header">📆 נובמבר 2024</div><div class="calendar-grid"><div>א</div><div>ב</div><div>ג</div><div>ד</div><div>ה</div><div>ו</div><div>ש</div><div>1</div><div>2</div><div>3</div><div>4</div><div class="today">5</div><div>6</div><div>7</div></div></div>', 
                css: '.calendar { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); max-width: 350px; } .calendar-header { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #14b8a6; } .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; text-align: center; } .calendar-grid > div { padding: 10px; border-radius: 5px; } .today { background: #14b8a6; color: white; font-weight: bold; }', 
                js: ''},
            {name: 'Chat Bubble', description: 'בועת צאט', category: 'other', image: placeholder('#06b6d4', '💭'), price: 55, 
                html: '<div class="chat"><div class="bubble me">שלום!</div><div class="bubble other">היי, מה נשמע?</div><div class="bubble me">הכל טוב! ❤️</div></div>', 
                css: '.chat { max-width: 400px; padding: 20px; background: #f0f9ff; border-radius: 10px; } .bubble { padding: 12px 16px; margin: 10px 0; border-radius: 18px; max-width: 70%; word-wrap: break-word; } .me { background: #06b6d4; color: white; margin-left: auto; border-bottom-right-radius: 4px; } .other { background: white; border-bottom-left-radius: 4px; }', 
                js: ''},
            {name: 'Alert Box', description: 'תיבת התראה', category: 'other', image: placeholder('#ef4444', '⚠️'), price: 38, 
                html: '<div class="alert alert-error">⚠️ שגיאה! משהו השתבש.</div><div class="alert alert-success">✓ הצלחה! הפעולה בוצעה.</div>', 
                css: '.alert { padding: 15px 20px; margin: 10px 0; border-radius: 8px; display: flex; align-items: center; gap: 10px; font-weight: 600; } .alert-error { background: #fee; color: #ef4444; border: 1px solid #fcc; } .alert-success { background: #efe; color: #22c55e; border: 1px solid #cfc; }', 
                js: ''},
            {name: 'Video Player', description: 'נגן וידאו', category: 'other', image: placeholder('#6366f1', '▶️'), price: 145, 
                html: '<div class="video-player"><video id="video" src="video.mp4"></video><div class="controls"><button id="playBtn">▶️</button><input type="range" id="progress" value="0" max="100"></div></div>', 
                css: '.video-player { max-width: 600px; background: #000; border-radius: 10px; overflow: hidden; } video { width: 100%; display: block; } .controls { display: flex; align-items: center; gap: 10px; padding: 10px; background: #333; } .controls button { background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; } .controls input { flex: 1; }', 
                js: 'const video = document.getElementById("video"); const playBtn = document.getElementById("playBtn"); const progress = document.getElementById("progress"); playBtn.addEventListener("click", () => { if (video.paused) { video.play(); playBtn.textContent = "⏸️"; } else { video.pause(); playBtn.textContent = "▶️"; } }); video.addEventListener("timeupdate", () => { progress.value = (video.currentTime / video.duration) * 100; });'},
            {name: 'Audio Player', description: 'נגן אודיו', category: 'other', image: placeholder('#a855f7', '🎵'), price: 95, 
                html: '<div class="audio-player"><div class="track-info">🎵 שם השיר</div><audio id="audio" src="audio.mp3"></audio><div class="controls"><button id="audioPlay">▶️</button><input type="range" id="audioProgress" value="0" max="100"></div></div>', 
                css: '.audio-player { max-width: 400px; background: linear-gradient(135deg, #a855f7, #6366f1); padding: 20px; border-radius: 15px; color: white; box-shadow: 0 10px 30px rgba(168, 85, 247, 0.3); } .track-info { text-align: center; font-size: 18px; margin-bottom: 15px; font-weight: 600; } .controls { display: flex; align-items: center; gap: 10px; } .controls button { background: white; color: #a855f7; border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer; font-size: 18px; } .controls input { flex: 1; }', 
                js: 'const audio = document.getElementById("audio"); const audioPlay = document.getElementById("audioPlay"); const audioProgress = document.getElementById("audioProgress"); audioPlay.addEventListener("click", () => { if (audio.paused) { audio.play(); audioPlay.textContent = "⏸️"; } else { audio.pause(); audioPlay.textContent = "▶️"; } }); audio.addEventListener("timeupdate", () => { audioProgress.value = (audio.currentTime / audio.duration) * 100; });'}
        ];

        samples.forEach((sample): void => {
            const component: CodeComponent = {
                ...sample,
                id: this.generateId(),
                authorId: admin.id,
                authorName: admin.username,
                status: 'approved',
                rating: 4.5,
                ratingsCount: 10,
                purchaseCount: 0,
                createdAt: Date.now(),
                approvedAt: Date.now()
            };
            this.data.components.push(component);
        });

        this.saveData();
    }

    generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // User operations
    getUsers(): User[] {
        return this.data.users;
    }

    getUserById(id: string): User | undefined {
        return this.data.users.find((u: User): boolean => u.id === id);
    }

    getUserByUsername(username: string): User | undefined {
        return this.data.users.find((u: User): boolean => u.username === username);
    }

    getUserByEmail(email: string): User | undefined {
        return this.data.users.find((u: User): boolean => u.email === email);
    }

    addUser(user: User): void {
        this.data.users.push(user);
        this.saveData();
    }

    updateUser(user: User): void {
        const index: number = this.data.users.findIndex((u: User): boolean => u.id === user.id);
        if (index !== -1) {
            this.data.users[index] = user;
            this.saveData();
        }
    }

    // Component operations
    getComponents(): CodeComponent[] {
        return this.data.components;
    }

    getApprovedComponents(): CodeComponent[] {
        return this.data.components.filter((c: CodeComponent): boolean => c.status === 'approved');
    }

    getPendingComponents(): CodeComponent[] {
        return this.data.components.filter((c: CodeComponent): boolean => c.status === 'pending');
    }

    getComponentById(id: string): CodeComponent | undefined {
        return this.data.components.find((c: CodeComponent): boolean => c.id === id);
    }

    getComponentsByAuthor(authorId: string): CodeComponent[] {
        return this.data.components.filter((c: CodeComponent): boolean => c.authorId === authorId);
    }

    addComponent(component: CodeComponent): void {
        this.data.components.push(component);
        this.saveData();
    }

    updateComponent(component: CodeComponent): void {
        const index: number = this.data.components.findIndex((c: CodeComponent): boolean => c.id === component.id);
        if (index !== -1) {
            this.data.components[index] = component;
            this.saveData();
        }
    }

    deleteComponent(id: string): void {
        this.data.components = this.data.components.filter((c: CodeComponent): boolean => c.id !== id);
        this.saveData();
    }

    // Purchase operations
    getPurchases(): Purchase[] {
        return this.data.purchases;
    }

    getPurchasesByUser(userId: string): Purchase[] {
        return this.data.purchases.filter((p: Purchase): boolean => p.userId === userId);
    }

    hasPurchased(userId: string, componentId: string): boolean {
        return this.data.purchases.some((p: Purchase): boolean => 
            p.userId === userId && p.componentId === componentId
        );
    }

    addPurchase(purchase: Purchase): void {
        this.data.purchases.push(purchase);
        this.saveData();
    }

    // Points purchase operations
    getPointsPurchases(): PointsPurchase[] {
        return this.data.pointsPurchases;
    }

    addPointsPurchase(pointsPurchase: PointsPurchase): void {
        this.data.pointsPurchases.push(pointsPurchase);
        this.saveData();
    }

    // Rating operations
    getRatings(): Rating[] {
        return this.data.ratings;
    }

    getRatingsByComponent(componentId: string): Rating[] {
        return this.data.ratings.filter((r: Rating): boolean => r.componentId === componentId);
    }

    addRating(rating: Rating): void {
        this.data.ratings.push(rating);
        this.saveData();
    }

    updateRating(rating: Rating): void {
        const index: number = this.data.ratings.findIndex((r: Rating): boolean => r.id === rating.id);
        if (index !== -1) {
            this.data.ratings[index] = rating;
            this.saveData();
        }
    }

    // Activity operations
    getActivities(): ActivityLog[] {
        return this.data.logs.sort((a: ActivityLog, b: ActivityLog): number => b.timestamp - a.timestamp);
    }

    addActivity(activity: ActivityLog): void {
        this.data.logs.push(activity);
        // Keep only last 100 activities
        if (this.data.logs.length > 100) {
            this.data.logs = this.data.logs.slice(-100);
        }
        this.saveData();
    }

    // Current user management
    setCurrentUser(userId: string): void {
        localStorage.setItem(CURRENT_USER_KEY, userId);
    }

    getCurrentUserId(): string | null {
        return localStorage.getItem(CURRENT_USER_KEY);
    }

    getCurrentUser(): User | null {
        const userId: string | null = this.getCurrentUserId();
        if (userId) {
            return this.getUserById(userId) || null;
        }
        return null;
    }

    logout(): void {
        localStorage.removeItem(CURRENT_USER_KEY);
    }

    // New API - for compatibility with updated code
    loadUsers(): User[] {
        return this.getUsers();
    }

    saveUsers(users: User[]): void {
        this.data.users = users;
        this.saveData();
    }

    loadComponents(): CodeComponent[] {
        return this.getComponents();
    }

    saveComponents(components: CodeComponent[]): void {
        this.data.components = components;
        this.saveData();
    }

    loadPurchases(): Purchase[] {
        return this.getPurchases();
    }

    savePurchases(purchases: Purchase[]): void {
        this.data.purchases = purchases;
        this.saveData();
    }

    loadLogs(): ActivityLog[] {
        return this.getActivities();
    }

    addLog(type: string, userId: string, message: string): void {
        const activity: ActivityLog = {
            id: this.generateId(),
            type: type as ActivityType,
            userId,
            username: this.getUserById(userId)?.username || 'Unknown',
            description: message,
            timestamp: Date.now()
        };
        this.addActivity(activity);
    }

    // Rating methods
    getUserRating(userId: string, componentId: string): number {
        const rating = this.data.ratings.find(
            (r: Rating): boolean => r.userId === userId && r.componentId === componentId
        );
        return rating ? rating.rating : 0;
    }

    rateComponent(userId: string, componentId: string, rating: number): void {
        // Check if user already rated
        const existingRatingIndex = this.data.ratings.findIndex(
            (r: Rating): boolean => r.userId === userId && r.componentId === componentId
        );

        if (existingRatingIndex >= 0) {
            // Update existing rating
            this.data.ratings[existingRatingIndex].rating = rating;
            this.data.ratings[existingRatingIndex].timestamp = Date.now();
        } else {
            // Add new rating
            const newRating: Rating = {
                id: this.generateId(),
                userId,
                componentId,
                rating,
                timestamp: Date.now()
            };
            this.data.ratings.push(newRating);
        }

        // Update component's average rating
        this.updateComponentRating(componentId);
        this.saveData();
    }

    private updateComponentRating(componentId: string): void {
        const component = this.getComponentById(componentId);
        if (!component) return;

        const componentRatings = this.data.ratings.filter(
            (r: Rating): boolean => r.componentId === componentId
        );

        if (componentRatings.length > 0) {
            const sum = componentRatings.reduce((acc: number, r: Rating): number => acc + r.rating, 0);
            component.rating = sum / componentRatings.length;
            component.ratingsCount = componentRatings.length;
        } else {
            component.rating = 0;
            component.ratingsCount = 0;
        }

        this.updateComponent(component);
    }
}

// Global toast notification function
function showToast(message: string, type: string = 'info'): void {
    const toast: HTMLDivElement = document.querySelector<HTMLDivElement>('#toast')!;
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout((): void => {
        toast.classList.remove('show');
    }, 3000);
}

// Create global storage instance
const storage: AppStorageManager = new AppStorageManager();
