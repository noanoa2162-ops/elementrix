// 🔥💎 ELEMENTRIX - Premium Effects 💎🔥
// Psychology-driven UX by the best minds

// ========================================
// 1. Loading Screen עם אנימציה מטורפת
// ========================================

const hideLoader = (): void => {
    const loader: HTMLElement | null = document.getElementById('pageLoader');
    if (loader) {
        setTimeout((): void => {
            loader.style.opacity = '0';
            setTimeout((): void => {
                loader.style.display = 'none';
            }, 300);
        }, 200);
    }
};

// Immediate attempt - run as soon as script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLoader);
} else {
    hideLoader();
}

// Backup: hide on window load
window.addEventListener('load', hideLoader);

// Emergency backup: force hide after 1.5 seconds max
setTimeout((): void => {
    const loader: HTMLElement | null = document.getElementById('pageLoader');
    if (loader && loader.style.display !== 'none') {
        loader.style.opacity = '0';
        loader.style.display = 'none';
    }
}, 1500);

// ========================================
// 2. Counter Animation - ספירה מונפשת
// ========================================
function animateCounters(): void {
    const counters: NodeListOf<Element> = document.querySelectorAll('.counter');
    
    counters.forEach((counter: Element): void => {
        const target: number = parseFloat(counter.getAttribute('data-target') || '0');
        const duration: number = 2000;
        const increment: number = target / (duration / 16);
        let current: number = 0;
        
        const updateCounter = (): void => {
            current += increment;
            if (current < target) {
                if (target < 10) {
                    counter.textContent = current.toFixed(1);
                } else {
                    counter.textContent = Math.floor(current).toString();
                }
                requestAnimationFrame(updateCounter);
            } else {
                if (target < 10) {
                    counter.textContent = target.toFixed(1);
                } else {
                    counter.textContent = Math.floor(target).toString();
                }
            }
        };
        
        setTimeout((): void => updateCounter(), 500);
    });
}

// הפעלה אחרי טעינה
setTimeout((): void => {
    if (document.querySelector('.counter')) {
        animateCounters();
    }
}, 1000);

// ========================================
// 3. Pulse Animation על אייקונים
// ========================================
document.addEventListener('DOMContentLoaded', (): void => {
    const pulseIcons: NodeListOf<Element> = document.querySelectorAll('.pulse-icon');
    
    pulseIcons.forEach((icon: Element, index: number): void => {
        setInterval((): void => {
            (icon as HTMLElement).style.transform = 'scale(1.2)';
            setTimeout((): void => {
                (icon as HTMLElement).style.transform = 'scale(1)';
            }, 200);
        }, 3000 + (index * 1000));
    });
});

// ========================================
// 4. Hover Effects מתקדמים - DISABLED
// ========================================
// Disabled to avoid conflicts

// ========================================
// 5. Success Celebration - Confetti!
// ========================================
function createConfetti(): void {
    const colors: string[] = ['#C8102E', '#D4AF37', '#E8475D', '#CC8B8C'];
    const confettiCount: number = 50;
    
    for (let i: number = 0; i < confettiCount; i++) {
        setTimeout((): void => {
            const confetti: HTMLDivElement = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.3 + 's';
            document.body.appendChild(confetti);
            
            setTimeout((): void => confetti.remove(), 3000);
        }, i * 30);
    }
}

// ========================================
// 6. Toast מתקדם עם אייקונים
// ========================================
window.showPremiumToast = function(message: string, type: string = 'success', duration: number = 3000): void {
    const toast: HTMLElement | null = document.getElementById('toast');
    if (!toast) return;
    
    const icons: { [key: string]: string } = {
        success: '🎉',
        error: '⚠️',
        info: 'ℹ️',
        warning: '⚡'
    };
    
    toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.success}</span> ${message}`;
    toast.className = `toast ${type} show premium-toast`;
    
    // Confetti עבור הצלחה
    if (type === 'success') {
        createConfetti();
    }
    
    setTimeout((): void => {
        toast.classList.remove('show');
    }, duration);
};

// ========================================
// 7. Skeleton Loading לכרטיסים
// ========================================
function createSkeleton(): string {
    const skeleton: string = `
        <div class="skeleton-card">
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
                <div class="skeleton-line"></div>
                <div class="skeleton-line short"></div>
            </div>
        </div>
    `;
    return skeleton;
}

// ========================================
// 8. Smooth Scroll Reveal
// ========================================
const observerOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer: IntersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]): void => {
    entries.forEach((entry: IntersectionObserverEntry): void => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// צפה באלמנטים שנכנסים לתצוגה
document.addEventListener('DOMContentLoaded', (): void => {
    const cards: NodeListOf<Element> = document.querySelectorAll('.component-card');
    cards.forEach((card: Element, index: number): void => {
        (card as HTMLElement).style.animationDelay = `${index * 0.05}s`;
        observer.observe(card);
    });
});

// ========================================
// 9. Typing Effect בכותרת (אם יש)
// ========================================
function typeWriter(element: HTMLElement, text: string, speed: number = 100): void {
    let i: number = 0;
    element.textContent = '';
    
    function type(): void {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ========================================
// 10. Parallax Effect בגלילה
// ========================================
let ticking: boolean = false;

function updateParallax(): void {
    const scrolled: number = window.pageYOffset;
    const shapes: NodeListOf<Element> = document.querySelectorAll('.shape');
    
    shapes.forEach((shape: Element, index: number): void => {
        const speed: number = 0.5 + (index * 0.2);
        (shape as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    ticking = false;
}

window.addEventListener('scroll', (): void => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// ========================================
// 11. Form Input Animation - DISABLED (גרם לבעיות)
// ========================================
// Commented out - was blocking inputs

// ========================================
// 12. Button Ripple Effect 💥
// ========================================
document.addEventListener('DOMContentLoaded', (): void => {
    const allButtons: NodeListOf<Element> = document.querySelectorAll('.btn, .tab-btn, button');
    
    allButtons.forEach((button: Element): void => {
        button.addEventListener('click', function(this: HTMLElement, e: Event): void {
            const mouseEvent = e as MouseEvent;
            const ripple: HTMLSpanElement = document.createElement('span');
            ripple.className = 'ripple-effect';
            
            const rect: DOMRect = this.getBoundingClientRect();
            const size: number = Math.max(rect.width, rect.height);
            const x: number = mouseEvent.clientX - rect.left - size / 2;
            const y: number = mouseEvent.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout((): void => ripple.remove(), 600);
        });
    });
});

// ========================================
// 13. Achievement Notification
// ========================================
function showAchievement(title: string, description: string): void {
    const achievement: HTMLDivElement = document.createElement('div');
    achievement.className = 'achievement-popup';
    achievement.innerHTML = `
        <div class="achievement-icon">🏆</div>
        <div class="achievement-content">
            <div class="achievement-title">${title}</div>
            <div class="achievement-desc">${description}</div>
        </div>
    `;
    
    document.body.appendChild(achievement);
    
    setTimeout((): void => achievement.classList.add('show'), 100);
    setTimeout((): void => {
        achievement.classList.remove('show');
        setTimeout((): void => achievement.remove(), 300);
    }, 4000);
}

// ========================================
// 14. Progress Indicator
// ========================================
function createProgressBar(): void {
    const progress: HTMLDivElement = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progress);
    
    window.addEventListener('scroll', (): void => {
        const winScroll: number = document.body.scrollTop || document.documentElement.scrollTop;
        const height: number = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled: number = (winScroll / height) * 100;
        
        const bar: HTMLElement | null = document.querySelector('.scroll-progress-bar');
        if (bar) {
            bar.style.width = scrolled + '%';
        }
    });
}

// הפעלה
if (document.body.classList.contains('auth-page') === false) {
    createProgressBar();
}

// ========================================
// 15. Easter Egg - Konami Code 🎮
// ========================================
let konamiCode: string[] = [];
const konamiSequence: string[] = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e: KeyboardEvent): void => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow 2s infinite';
        showAchievement('Easter Egg!', 'מצאת את הקוד הסודי! 🎮');
        createConfetti();
        
        setTimeout((): void => {
            document.body.style.animation = '';
        }, 10000);
    }
});

// ========================================
// 16. Dark Mode Toggle (hidden)
// ========================================
let clickCount: number = 0;
document.addEventListener('DOMContentLoaded', (): void => {
    const logo: Element | null = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', (): void => {
            clickCount++;
            if (clickCount === 5) {
                document.body.classList.toggle('dark-mode');
                if (window.showPremiumToast) window.showPremiumToast('Dark Mode ' + (document.body.classList.contains('dark-mode') ? 'מופעל' : 'מכובה'), 'info');
                clickCount = 0;
            }
            setTimeout((): void => { clickCount = 0; }, 2000);
        });
    }
});

// ========================================
// 17. Component Card Tilt Effect
// ========================================
document.addEventListener('DOMContentLoaded', (): void => {
    const cards: NodeListOf<HTMLElement> = document.querySelectorAll('.component-card');
    
    cards.forEach((card: HTMLElement): void => {
        card.addEventListener('mousemove', (e: Event): void => {
            const mouseEvent = e as MouseEvent;
            const rect: DOMRect = card.getBoundingClientRect();
            const x: number = mouseEvent.clientX - rect.left;
            const y: number = mouseEvent.clientY - rect.top;
            
            const centerX: number = rect.width / 2;
            const centerY: number = rect.height / 2;
            
            const rotateX: number = (y - centerY) / 10;
            const rotateY: number = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.03)`;
        });
        
        card.addEventListener('mouseleave', (): void => {
            card.style.transform = '';
        });
    });
});
