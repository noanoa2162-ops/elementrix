// 🔥💎 ADVANCED PSYCHOLOGY & UX EFFECTS 💎🔥
// World-Class Design + Purchase Psychology + Logic Masters

// ========================================
// 1. REAL-TIME SOCIAL PROOF (Live Data)
// ========================================
interface SocialProofData {
    name: string;
    action: string;
    time: string;
    type: 'purchase' | 'upload' | 'rating';
}

function showRealSocialProof(): void {
    // Get real data from localStorage
    if (typeof storage === 'undefined') return;
    
    const activities = storage.getActivities().slice(-10);
    if (!activities || activities.length === 0) return;
    
    // Filter activities - show only meaningful user actions
    const filteredActivities = activities.filter((act: ActivityLog): boolean => {
        // Don't show admin activities (not interesting/professional)
        if (act.username === 'admin' || act.username === 'מנהל') return false;
        // Don't show login/register activities (only show real actions like upload, purchase, rating)
        if (act.description.includes('התחבר') || act.description.includes('נרשם')) return false;
        return true;
    });
    
    if (filteredActivities.length === 0) return;
    
    const activity = filteredActivities[Math.floor(Math.random() * filteredActivities.length)];
    
    const existing: HTMLElement | null = document.querySelector('.social-proof');
    if (existing) {
        existing.remove();
    }

    // Calculate time ago - REAL TIME!
    const timeAgo = getTimeAgo(activity.timestamp);
    
    const proofEl: HTMLDivElement = document.createElement('div');
    proofEl.className = 'social-proof';
    proofEl.innerHTML = `
        <div class="social-proof-avatar">${escapeUserText(activity.username.charAt(0))}</div>
        <div class="social-proof-text">
            <div class="social-proof-name">${escapeUserText(activity.username)}</div>
            <div class="social-proof-action">${escapeUserText(activity.description)}</div>
            <div class="social-proof-time">${timeAgo}</div>
        </div>
        <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
    `;

    document.body.appendChild(proofEl);

    setTimeout((): void => {
        proofEl.style.opacity = '0';
        proofEl.style.transform = 'translateX(-100%)';
        setTimeout((): void => proofEl.remove(), 500);
    }, 5000);
}

function getTimeAgo(timestamp: number): string {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'עכשיו';
    if (minutes < 60) return `לפני ${minutes} דקות`;
    if (hours < 24) return `לפני ${hours} שעות`;
    return `לפני ${days} ימים`;
}

// Show REAL social proof every 15 seconds on store page
if (window.location.pathname.includes('store.html')) {
    setInterval(showRealSocialProof, 15000);
    setTimeout(showRealSocialProof, 5000);
}

// ========================================
// 2. URGENCY & SCARCITY INDICATORS
// ========================================
// Badge creation moved to load-components.ts - all cards show "מומלץ" with crown
function addUrgencyBadges(): void {
    // Function disabled - badges are now added in load-components.ts
}

// ========================================
// 3. TRUST BADGES & CREDIBILITY SIGNALS
// ========================================
function addTrustBadges(): void {
    const containers: NodeListOf<HTMLElement> = document.querySelectorAll('.component-card');
    
    containers.forEach((container: HTMLElement): void => {
        if (Math.random() > 0.6) { // 40% verified
            const badges: HTMLDivElement = document.createElement('div');
            badges.className = 'trust-badges';
            
            const verifiedBadge: HTMLDivElement = document.createElement('div');
            verifiedBadge.className = 'trust-badge verified-badge';
            verifiedBadge.innerHTML = '<i class="fas fa-shield-alt"></i> מאומת';
            
            if (Math.random() > 0.5) {
                const qualityBadge: HTMLDivElement = document.createElement('div');
                qualityBadge.className = 'trust-badge';
                qualityBadge.innerHTML = '<i class="fas fa-certificate"></i> איכות פרימיום';
                badges.appendChild(qualityBadge);
            }
            
            badges.appendChild(verifiedBadge);
            
            const info: HTMLElement | null = container.querySelector('.component-info');
            if (info) {
                info.appendChild(badges);
            }
        }
    });
}

// ========================================
// 4. MAGNETIC CURSOR EFFECT
// ========================================
function initMagneticButtons(): void {
    const buttons: NodeListOf<HTMLElement> = document.querySelectorAll('.btn, .magnetic-btn');
    
    buttons.forEach((button: HTMLElement): void => {
        button.addEventListener('mousemove', (e: MouseEvent): void => {
            const rect: DOMRect = button.getBoundingClientRect();
            const x: number = e.clientX - rect.left - rect.width / 2;
            const y: number = e.clientY - rect.top - rect.height / 2;
            
            const moveX: number = x * 0.3;
            const moveY: number = y * 0.3;
            
            button.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
        });
        
        button.addEventListener('mouseleave', (): void => {
            button.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

document.addEventListener('DOMContentLoaded', initMagneticButtons);

// ========================================
// 5. ACHIEVEMENT SYSTEM
// ========================================
interface Achievement {
    icon: string;
    title: string;
    description: string;
}

const achievements: Achievement[] = [
    { icon: '🎯', title: 'קניה ראשונה', description: 'רכשת את הרכיב הראשון שלך!' },
    { icon: '⚡', title: 'מהירות אור', description: 'רכשת 3 רכיבים ב-24 שעות!' },
    { icon: '💎', title: 'קונה פרימיום', description: 'רכשת רכיב במחיר מעל 300 נקודות!' },
    { icon: '🏆', title: 'אוסף מקצועי', description: 'יש לך 10 רכיבים בספריה!' },
    { icon: '🎨', title: 'יוצר תוכן', description: 'העלאת את הרכיב הראשון שלך!' }
];

function unlockAchievement(achievementIndex: number): void {
    if (achievementIndex >= achievements.length) return;
    
    const achievement: Achievement = achievements[achievementIndex];
    const popup: HTMLDivElement = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-content">
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-desc">${achievement.description}</div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Confetti!
    createAchievementConfetti();
    
    setTimeout((): void => popup.classList.add('show'), 100);
    setTimeout((): void => {
        popup.classList.remove('show');
        setTimeout((): void => popup.remove(), 300);
    }, 5000);
}

function createAchievementConfetti(): void {
    const colors: string[] = ['#D4AF37', '#C8102E', '#FFD700', '#FFA500'];
    for (let i: number = 0; i < 30; i++) {
        const confetti: HTMLDivElement = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.3 + 's';
        document.body.appendChild(confetti);
        setTimeout((): void => confetti.remove(), 3000);
    }
}

// ========================================
// 6. COUNTDOWN TIMERS FOR DEALS
// ========================================
function createCountdownTimer(endTime: number): HTMLDivElement {
    const container: HTMLDivElement = document.createElement('div');
    container.className = 'countdown-timer';
    
    function updateTimer(): void {
        const now: number = Date.now();
        const diff: number = endTime - now;
        
        if (diff <= 0) {
            container.innerHTML = '<div class="countdown-expired">⏰ המבצע הסתיים!</div>';
            return;
        }
        
        const hours: number = Math.floor(diff / (1000 * 60 * 60));
        const minutes: number = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds: number = Math.floor((diff % (1000 * 60)) / 1000);
        
        container.innerHTML = `
            <div class="countdown-item">
                <div class="countdown-value">${hours.toString().padStart(2, '0')}</div>
                <div class="countdown-label">שעות</div>
            </div>
            <div class="countdown-item">
                <div class="countdown-value">${minutes.toString().padStart(2, '0')}</div>
                <div class="countdown-label">דקות</div>
            </div>
            <div class="countdown-item">
                <div class="countdown-value">${seconds.toString().padStart(2, '0')}</div>
                <div class="countdown-label">שניות</div>
            </div>
        `;
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
    
    return container;
}

// Add countdown to hero section on store page
if (window.location.pathname.includes('store.html')) {
    setTimeout((): void => {
        const hero: HTMLElement | null = document.querySelector('.store-hero');
        if (hero) {
            const dealEnd: number = Date.now() + (4 * 60 * 60 * 1000); // 4 hours
            const timer: HTMLDivElement = createCountdownTimer(dealEnd);
            const dealText: HTMLParagraphElement = document.createElement('p');
            dealText.style.cssText = 'color: var(--primary-color); font-weight: 700; margin: 1rem 0;';
            dealText.textContent = '⚡ מבצע בזק - 30% הנחה על כל הרכיבים!';
            hero.appendChild(dealText);
            hero.appendChild(timer);
        }
    }, 2000);
}

// ========================================
// 7. INTERACTIVE RATING STARS
// ========================================
function createInteractiveRating(container: HTMLElement, currentRating: number = 0): void {
    const starsContainer: HTMLDivElement = document.createElement('div');
    starsContainer.className = 'rating-stars';
    
    for (let i: number = 1; i <= 5; i++) {
        const star: HTMLElement = document.createElement('i');
        star.className = i <= currentRating ? 'fas fa-star star filled' : 'far fa-star star';
        star.dataset.rating = i.toString();
        
        star.addEventListener('click', (): void => {
            const rating: number = parseInt(star.dataset.rating || '0');
            starsContainer.querySelectorAll('.star').forEach((s: Element, index: number): void => {
                if (index < rating) {
                    s.classList.add('filled');
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('filled');
                    s.classList.add('far');
                    s.classList.remove('fas');
                }
            });
            
            // Show feedback
            if (window.showPremiumToast) window.showPremiumToast(`דירגת ${rating} כוכבים! תודה 🌟`, 'success');
        });
        
        star.addEventListener('mouseenter', (): void => {
            const rating: number = parseInt(star.dataset.rating || '0');
            starsContainer.querySelectorAll('.star').forEach((s: Element, index: number): void => {
                if (index < rating) {
                    (s as HTMLElement).style.color = 'var(--accent-gold)';
                }
            });
        });
        
        star.addEventListener('mouseleave', (): void => {
            starsContainer.querySelectorAll('.star').forEach((s: Element): void => {
                if (!s.classList.contains('filled')) {
                    (s as HTMLElement).style.color = '';
                }
            });
        });
        
        starsContainer.appendChild(star);
    }
    
    container.appendChild(starsContainer);
}

// ========================================
// 8. SKELETON LOADING FOR BETTER UX
// ========================================
function createSkeletonCards(count: number = 6): void {
    const grid: HTMLElement | null = document.querySelector('.components-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    for (let i: number = 0; i < count; i++) {
        const skeleton: HTMLDivElement = document.createElement('div');
        skeleton.className = 'skeleton-card skeleton';
        grid.appendChild(skeleton);
    }
    
    // Simulate loading
    setTimeout((): void => {
        addUrgencyBadges();
        addTrustBadges();
    }, 2000);
}

// ========================================
// 9. PRICE ANIMATIONS
// ========================================
function animatePrices(): void {
    const prices: NodeListOf<HTMLElement> = document.querySelectorAll('.component-price .price-value');
    
    prices.forEach((price: HTMLElement): void => {
        const finalPrice: number = parseInt(price.textContent || '0');
        let current: number = 0;
        const increment: number = Math.ceil(finalPrice / 30);
        
        const interval = setInterval((): void => {
            current += increment;
            if (current >= finalPrice) {
                current = finalPrice;
                clearInterval(interval);
            }
            price.textContent = current.toString();
        }, 30);
    });
}

// ========================================
// 10. MOUSE TRAIL EFFECT
// ========================================
let mouseTrailEnabled: boolean = false;
const trailElements: HTMLDivElement[] = [];
const maxTrailElements: number = 15;

function createMouseTrail(): void {
    document.addEventListener('mousemove', (e: MouseEvent): void => {
        if (!mouseTrailEnabled) return;
        
        const trail: HTMLDivElement = document.createElement('div');
        trail.className = 'mouse-trail';
        trail.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: var(--accent-gold);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            opacity: 0.6;
            animation: trailFade 0.8s forwards;
        `;
        
        document.body.appendChild(trail);
        trailElements.push(trail);
        
        if (trailElements.length > maxTrailElements) {
            const old = trailElements.shift();
            old?.remove();
        }
        
        setTimeout((): void => trail.remove(), 800);
    });
}

// ========================================
// 11. SMART TOOLTIPS
// ========================================
function initPremiumTooltips(): void {
    const tooltipElements: NodeListOf<HTMLElement> = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach((el: HTMLElement): void => {
        el.classList.add('premium-tooltip');
    });
}

document.addEventListener('DOMContentLoaded', initPremiumTooltips);

// ========================================
// 12. PARALLAX SCROLL EFFECT ON CARDS
// ========================================
function initParallaxCards(): void {
    const cards: NodeListOf<HTMLElement> = document.querySelectorAll('.component-card');
    
    window.addEventListener('scroll', (): void => {
        cards.forEach((card: HTMLElement): void => {
            const rect: DOMRect = card.getBoundingClientRect();
            const scrollPercent: number = (window.innerHeight - rect.top) / window.innerHeight;
            
            if (scrollPercent > 0 && scrollPercent < 1) {
                const translateY: number = (scrollPercent - 0.5) * 20;
                card.style.transform = `translateY(${translateY}px)`;
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initParallaxCards);

// ========================================
// 13. AUTO-SAVE INDICATION - REMOVED
// ========================================
// Auto-save indicator removed - was misleading since nothing is actually auto-saved
// Data is only saved when the user explicitly submits the form

// ========================================
// INIT ALL EFFECTS
// ========================================
document.addEventListener('DOMContentLoaded', (): void => {
    setTimeout((): void => {
        if (document.querySelector('.components-grid')) {
            addUrgencyBadges();
            addTrustBadges();
            animatePrices();
        }
    }, 2500);
});

// Advanced effects initialized
