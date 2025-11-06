"use strict";
// 🔥💎 ELEMENTRIX - Premium Effects 💎🔥
// Psychology-driven UX by the best minds
// ========================================
// 1. Loading Screen עם אנימציה מטורפת
// ========================================
const hideLoader = () => {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }, 200);
    }
};
// Immediate attempt - run as soon as script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLoader);
}
else {
    hideLoader();
}
// Backup: hide on window load
window.addEventListener('load', hideLoader);
// Emergency backup: force hide after 1.5 seconds max
setTimeout(() => {
    const loader = document.getElementById('pageLoader');
    if (loader && loader.style.display !== 'none') {
        loader.style.opacity = '0';
        loader.style.display = 'none';
    }
}, 1500);
// ========================================
// 2. Counter Animation - ספירה מונפשת
// ========================================
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach((counter) => {
        const target = parseFloat(counter.getAttribute('data-target') || '0');
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                if (target < 10) {
                    counter.textContent = current.toFixed(1);
                }
                else {
                    counter.textContent = Math.floor(current).toString();
                }
                requestAnimationFrame(updateCounter);
            }
            else {
                if (target < 10) {
                    counter.textContent = target.toFixed(1);
                }
                else {
                    counter.textContent = Math.floor(target).toString();
                }
            }
        };
        setTimeout(() => updateCounter(), 500);
    });
}
// הפעלה אחרי טעינה
setTimeout(() => {
    if (document.querySelector('.counter')) {
        animateCounters();
    }
}, 1000);
// ========================================
// 3. Pulse Animation על אייקונים
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const pulseIcons = document.querySelectorAll('.pulse-icon');
    pulseIcons.forEach((icon, index) => {
        setInterval(() => {
            icon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
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
function createConfetti() {
    const colors = ['#C8102E', '#D4AF37', '#E8475D', '#CC8B8C'];
    const confettiCount = 50;
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.3 + 's';
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}
// ========================================
// 6. Toast מתקדם עם אייקונים
// ========================================
window.showPremiumToast = function (message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast)
        return;
    const icons = {
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
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
};
// ========================================
// 7. Skeleton Loading לכרטיסים
// ========================================
function createSkeleton() {
    const skeleton = `
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
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);
// צפה באלמנטים שנכנסים לתצוגה
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.component-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.05}s`;
        observer.observe(card);
    });
});
// ========================================
// 9. Typing Effect בכותרת (אם יש)
// ========================================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    function type() {
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
let ticking = false;
function updateParallax() {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.2);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
    ticking = false;
}
window.addEventListener('scroll', () => {
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
document.addEventListener('DOMContentLoaded', () => {
    const allButtons = document.querySelectorAll('.btn, .tab-btn, button');
    allButtons.forEach((button) => {
        button.addEventListener('click', function (e) {
            const mouseEvent = e;
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = mouseEvent.clientX - rect.left - size / 2;
            const y = mouseEvent.clientY - rect.top - size / 2;
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
});
// ========================================
// 13. Achievement Notification
// ========================================
function showAchievement(title, description) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement-popup';
    achievement.innerHTML = `
        <div class="achievement-icon">🏆</div>
        <div class="achievement-content">
            <div class="achievement-title">${title}</div>
            <div class="achievement-desc">${description}</div>
        </div>
    `;
    document.body.appendChild(achievement);
    setTimeout(() => achievement.classList.add('show'), 100);
    setTimeout(() => {
        achievement.classList.remove('show');
        setTimeout(() => achievement.remove(), 300);
    }, 4000);
}
// ========================================
// 14. Progress Indicator
// ========================================
function createProgressBar() {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progress);
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const bar = document.querySelector('.scroll-progress-bar');
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
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow 2s infinite';
        showAchievement('Easter Egg!', 'מצאת את הקוד הסודי! 🎮');
        createConfetti();
        setTimeout(() => {
            document.body.style.animation = '';
        }, 10000);
    }
});
// ========================================
// 16. Dark Mode Toggle (hidden)
// ========================================
let clickCount = 0;
document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            clickCount++;
            if (clickCount === 5) {
                document.body.classList.toggle('dark-mode');
                if (window.showPremiumToast)
                    window.showPremiumToast('Dark Mode ' + (document.body.classList.contains('dark-mode') ? 'מופעל' : 'מכובה'), 'info');
                clickCount = 0;
            }
            setTimeout(() => { clickCount = 0; }, 2000);
        });
    }
});
// ========================================
// 17. Component Card Tilt Effect
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.component-card');
    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const mouseEvent = e;
            const rect = card.getBoundingClientRect();
            const x = mouseEvent.clientX - rect.left;
            const y = mouseEvent.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.03)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
});
