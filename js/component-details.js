"use strict";
/// <reference path="types.ts" />
/// <reference path="storage.ts" />
const componentDetailsContainer = document.getElementById('componentDetails');
const userPointsDisplay = document.getElementById('userPointsDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const backToStoreBtn = document.getElementById('backToStoreBtn');
// Get component ID from URL
const urlParams = new URLSearchParams(window.location.search);
const componentId = urlParams.get('id');
if (!componentId) {
    window.location.href = 'store.html';
}
const currentUser = storage.getCurrentUser();
if (!currentUser) {
    window.location.href = '../index.html';
}
// Update user points display - hide for admin
if (currentUser.isAdmin) {
    const pointsDisplay = document.getElementById('pointsDisplay');
    if (pointsDisplay) {
        pointsDisplay.style.display = 'none';
    }
}
else {
    userPointsDisplay.textContent = `${currentUser.pointsAvailable}`;
}
// Back to store
if (backToStoreBtn) {
    backToStoreBtn.onclick = () => {
        window.location.href = 'store.html';
    };
}
// Logout
logoutBtn.onclick = () => {
    storage.logout();
    window.location.href = '../index.html';
};
// Format code with proper line breaks
function formatCode(code, type) {
    if (type === 'css') {
        // Add line breaks for CSS
        return code
            .replace(/\s*\{\s*/g, ' {\n  ')
            .replace(/\s*;\s*/g, ';\n  ')
            .replace(/\s*\}\s*/g, '\n}\n\n')
            .replace(/\n  \n/g, '\n');
    }
    else if (type === 'html') {
        // Add line breaks for HTML
        return code.replace(/>\s*</g, '>\n<');
    }
    return code;
}
const component = storage.getApprovedComponents().find(c => c.id === componentId);
if (!component) {
    componentDetailsContainer.innerHTML = '<div class="error-state"><h2>הרכיב לא נמצא</h2><a href="store.html" class="material-btn primary">חזרה לחנות</a></div>';
}
else {
    const hasPurchased = storage.hasPurchased(currentUser.id, component.id);
    const isOwner = component.authorId === currentUser.id;
    const isAdmin = currentUser.isAdmin;
    const canViewCode = hasPurchased || isOwner || isAdmin;
    componentDetailsContainer.innerHTML = `
        <!-- 🎨 HERO SECTION - MATERIAL DESIGN -->
        <div class="hero-section">
            <div class="container hero-content">
                <h1 class="component-title">${escapeUserText(component.name)}</h1>
                <p class="component-description">${escapeUserText(component.description)}</p>
                
                <div class="stats-grid">
                    <div class="stat-card" style="--delay: 0s;">
                        <div class="stat-icon">💰</div>
                        <div class="stat-value">${component.price}</div>
                        <div class="stat-label">מחיר</div>
                    </div>
                    <div class="stat-card" style="--delay: 0.1s;">
                        <div class="stat-icon">📁</div>
                        <div class="stat-value category-value">${getCategoryName(component.category)}</div>
                        <div class="stat-label">קטגוריה</div>
                    </div>
                    <div class="stat-card" style="--delay: 0.2s;">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-value">${component.rating.toFixed(1)}</div>
                        <div class="stat-label">${component.ratingsCount} דירוגים</div>
                    </div>
                    <div class="stat-card" style="--delay: 0.3s;">
                        <div class="stat-icon">📦</div>
                        <div class="stat-value">${component.purchaseCount}</div>
                        <div class="stat-label">נרכש</div>
                    </div>
                </div>
                
                <div class="action-buttons">
                    ${canViewCode ? `
                        <button class="material-btn success" onclick="document.getElementById('codeSection').scrollIntoView({behavior: 'smooth'})">
                            <i class="fas fa-code"></i>
                            <span>צפה בקוד</span>
                        </button>
                    ` : `
                        <button class="material-btn success" id="purchaseBtn">
                            <i class="fas fa-shopping-cart"></i>
                            <span>רכוש עכשיו - ${component.price} נקודות</span>
                        </button>
                    `}
                </div>
            </div>
        </div>
        
        <!-- 📸 PREVIEW SECTION -->
        <div class="container section-padding">
            <div class="material-card">
                <h2 class="section-title">
                    <i class="fas fa-eye"></i>
                    תצוגה מקדימה
                </h2>
                <div class="preview-wrapper">
                    <img src="${component.image}" alt="${escapeUserText(component.name)}" class="preview-image">
                </div>
            </div>
        </div>
        
        ${!canViewCode ? `
            <!-- 🔒 LOCKED SECTION -->
            <div class="container section-padding-bottom">
                <div class="material-card">
                    <div class="locked-content">
                        <div class="locked-icon">
                            <i class="fas fa-lock"></i>
                        </div>
                        <h3 class="locked-title">הקוד נעול</h3>
                        <p class="locked-text">רכוש את הרכיב כדי לצפות בקוד המלא<br>ולהשתמש בו בפרויקטים שלך</p>
                        ${currentUser.pointsAvailable < component.price ? `
                            <div class="insufficient-points-box">
                                <p class="insufficient-points-text">
                                    ⚠️ חסרות לך ${component.price - currentUser.pointsAvailable} נקודות
                                </p>
                                <button class="material-btn primary" id="buyMoreBtn">
                                    <i class="fas fa-coins"></i>
                                    <span>רכוש נקודות נוספות</span>
                                </button>
                            </div>
                        ` : `
                            <button class="material-btn success" id="purchaseBtnBottom">
                                <i class="fas fa-shopping-cart"></i>
                                <span>רכוש עכשיו - ${component.price} נקודות</span>
                            </button>
                        `}
                    </div>
                </div>
            </div>
        ` : `
            <!-- 💻 CODE SECTION -->
            <div class="container section-padding-bottom" id="codeSection">
                ${isAdmin ? `
                    <div class="material-card admin-access-card">
                        <div class="admin-icon">🛡️</div>
                        <h3 class="admin-title">גישת מנהל</h3>
                        <p class="admin-description">יש לך גישה מלאה לכל הקוד ללא רכישה</p>
                    </div>
                ` : ''}
                
                <div class="material-card">
                    <h2 class="section-title">
                        <i class="fas fa-code"></i>
                        קוד מקור
                    </h2>
                    
                    <!-- TABS & COPY BUTTON -->
                    <div class="code-header">
                        <div class="code-tabs">
                            <button class="code-tab active" data-tab="html">
                                <i class="fab fa-html5"></i> HTML
                            </button>
                            <button class="code-tab" data-tab="css">
                                <i class="fab fa-css3-alt"></i> CSS
                            </button>
                            <button class="code-tab" data-tab="js">
                                <i class="fab fa-js"></i> JavaScript
                            </button>
                        </div>
                        <button id="floatingCopyBtn" class="copy-code-btn">
                            <i class="fas fa-copy copy-code-icon"></i>
                            <span>העתק קוד</span>
                        </button>
                    </div>
                    
                    <!-- CODE CONTENTS -->
                    
                    <div class="code-content active" id="code-html">
                        <div class="code-container-wrapper">
                            <pre class="language-markup"><code class="language-markup">${escapeHtml(component.html)}</code></pre>
                        </div>
                    </div>
                    
                    <div class="code-content" id="code-css">
                        <div class="code-container-wrapper">
                            <pre class="language-css"><code class="language-css">${escapeHtml(component.css)}</code></pre>
                        </div>
                    </div>
                    
                    <div class="code-content" id="code-js">
                        ${component.js ? `
                            <div class="code-container-wrapper">
                                <pre class="language-javascript"><code class="language-javascript">${escapeHtml(component.js)}</code></pre>
                            </div>
                        ` : `
                            <div class="no-js-container">
                                <i class="fab fa-js no-js-icon"></i>
                                <p class="no-js-title">אין קוד JavaScript לרכיב זה</p>
                                <p class="no-js-text">רכיב זה פועל עם HTML ו-CSS בלבד</p>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `}
        
        <!-- ⭐ RATING SECTION - Only for users who purchased -->
        ${canViewCode && !isOwner ? `
            <div class="container section-padding">
                <div class="material-card">
                    <h2 class="section-title">
                        <i class="fas fa-star"></i>
                        דרג את הרכיב
                    </h2>
                    <div class="rating-container">
                        <p class="rating-description">
                            איך היה הרכיב? שתף את החוויה שלך!
                        </p>
                        <div class="rating-stars" id="ratingStars">
                            ${[1, 2, 3, 4, 5].map(star => `
                                <i class="fas fa-star rating-star" data-rating="${star}"></i>
                            `).join('')}
                        </div>
                        <p id="ratingMessage" class="rating-message"></p>
                    </div>
                </div>
            </div>
        ` : ''}
    `;
    // Buy more button - must be here for locked content
    const buyMoreBtn = document.getElementById('buyMoreBtn');
    if (buyMoreBtn) {
        buyMoreBtn.onclick = () => {
            openBuyMorePointsModal();
        };
    }
    // Apply Prism syntax highlighting
    setTimeout(() => {
        if (window.Prism) {
            window.Prism.highlightAll();
        }
    }, 100);
    // Floating copy button
    const floatingCopyBtn = document.getElementById('floatingCopyBtn');
    if (floatingCopyBtn) {
        floatingCopyBtn.addEventListener('mouseenter', () => {
            floatingCopyBtn.style.background = 'linear-gradient(135deg, #D4AF37 0%, #C8102E 100%)';
            floatingCopyBtn.style.color = 'white';
            floatingCopyBtn.style.borderColor = 'transparent';
            floatingCopyBtn.style.transform = 'translateY(-2px)';
            floatingCopyBtn.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.4)';
        });
        floatingCopyBtn.addEventListener('mouseleave', () => {
            floatingCopyBtn.style.background = 'white';
            floatingCopyBtn.style.color = '#374151';
            floatingCopyBtn.style.borderColor = '#e5e7eb';
            floatingCopyBtn.style.transform = 'translateY(0)';
            floatingCopyBtn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
        });
        floatingCopyBtn.addEventListener('click', () => {
            const activeContent = document.querySelector('.code-content.active');
            if (activeContent) {
                const type = activeContent.id.replace('code-', '');
                if (window.copyCode)
                    window.copyCode(type);
            }
        });
    }
    // Tab switching
    const tabs = document.querySelectorAll('.code-tab');
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            if (!tabName)
                return;
            // Remove active from all
            document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.code-content').forEach(c => c.classList.remove('active'));
            // Add active to clicked
            tab.classList.add('active');
            const content = document.getElementById(`code-${tabName}`);
            if (content) {
                content.classList.add('active');
                // Re-highlight the newly visible code
                setTimeout(() => {
                    if (window.Prism) {
                        window.Prism.highlightAll();
                    }
                }, 50);
            }
        });
    });
    // Purchase button
    const purchaseBtn = document.getElementById('purchaseBtn');
    const purchaseBtnBottom = document.getElementById('purchaseBtnBottom');
    const handlePurchase = () => {
        if (currentUser.pointsAvailable < component.price) {
            // Scroll to buy more button
            const buyMoreSection = document.getElementById('buyMoreBtn');
            if (buyMoreSection) {
                buyMoreSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => {
                    buyMoreSection.style.animation = 'pulse 0.5s ease-in-out 3';
                }, 500);
            }
            else {
                showToast('אין מספיק נקודות', 'error');
            }
            return;
        }
        currentUser.pointsAvailable -= component.price;
        currentUser.totalSpent += component.price;
        storage.updateUser(currentUser);
        const purchase = {
            id: storage.generateId(),
            userId: currentUser.id,
            componentId: component.id,
            timestamp: Date.now(),
            price: component.price
        };
        storage.addPurchase(purchase);
        component.purchaseCount++;
        storage.updateComponent(component);
        showToast('הרכיב נרכש בהצלחה! 🎉', 'success');
        setTimeout(() => {
            location.reload();
        }, 1500);
    };
    if (purchaseBtn) {
        purchaseBtn.onclick = handlePurchase;
    }
    if (purchaseBtnBottom) {
        purchaseBtnBottom.onclick = handlePurchase;
    }
}
// Buy More Points Modal - Helper Functions
function createModalHeader() {
    return `
        <div style="background: linear-gradient(135deg, #C8102E 0%, #D4AF37 100%); padding: 28px 24px; text-align: center; color: white;">
            <div style="font-size: 48px; margin-bottom: 8px;">💰</div>
            <h2 style="font-size: 26px; font-weight: 900; margin: 0 0 6px 0;">זקוק לעוד נקודות?</h2>
            <p style="font-size: 15px; margin: 0; opacity: 0.95;">בחר את הדרך המועדפת עליך להשיג נקודות!</p>
        </div>
    `;
}
function createUploadOption() {
    return `
        <div onclick="sessionStorage.setItem('returnToComponent', window.location.href); window.location.href='upload.html';" style="cursor: pointer; background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(200, 16, 46, 0.05) 100%); border: 2px solid rgba(212, 175, 55, 0.3); border-radius: 10px; padding: 24px; transition: all 0.3s; text-align: center;">
            <div style="font-size: 38px; margin-bottom: 10px;">🚀</div>
            <h3 style="font-size: 20px; font-weight: 700; margin: 0 0 8px 0; color: #C8102E;">העלה רכיב חדש</h3>
            <p style="font-size: 14px; color: #6b7280; margin: 0 0 10px 0; line-height: 1.4;">שתף את הקוד שלך עם הקהילה וקבל נקודות!</p>
            <div style="background: linear-gradient(135deg, #D4AF37 0%, #C8102E 100%); color: white; padding: 10px 24px; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 14px;">
                להעלאת רכיב →
            </div>
        </div>
    `;
}
function createBuyOption() {
    return `
        <div onclick="sessionStorage.setItem('openPurchaseModal', 'true'); sessionStorage.setItem('returnToComponent', window.location.href); window.location.href='profile.html';" style="cursor: pointer; background: linear-gradient(135deg, rgba(200, 16, 46, 0.05) 0%, rgba(212, 175, 55, 0.05) 100%); border: 2px solid rgba(200, 16, 46, 0.3); border-radius: 10px; padding: 24px; transition: all 0.3s; text-align: center;">
            <div style="font-size: 38px; margin-bottom: 10px;">💳</div>
            <h3 style="font-size: 20px; font-weight: 700; margin: 0 0 8px 0; color: #C8102E;">קנה נקודות בכסף</h3>
            <p style="font-size: 14px; color: #6b7280; margin: 0 0 10px 0; line-height: 1.4;">רכוש חבילת נקודות במחיר משתלם וקבל גישה מיידית!</p>
            <div style="background: linear-gradient(135deg, #C8102E 0%, #D4AF37 100%); color: white; padding: 10px 24px; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 14px;">
                לרכישת נקודות →
            </div>
        </div>
    `;
}
function createCloseButton() {
    return `
        <button onclick="document.getElementById('buyPointsModalOverlay').remove()" style="margin-top: 16px; width: 100%; padding: 10px; background: #f3f4f6; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; color: #6b7280; cursor: pointer; transition: all 0.2s;">
            סגור
        </button>
    `;
}
function addModalHoverEffects() {
    const options = document.querySelectorAll('#buyPointsModalOverlay > div > div:nth-child(2) > div > div');
    options.forEach(option => {
        option.addEventListener('mouseenter', () => {
            option.style.transform = 'translateY(-4px)';
            option.style.boxShadow = '0 12px 32px rgba(212, 175, 55, 0.2)';
        });
        option.addEventListener('mouseleave', () => {
            option.style.transform = 'translateY(0)';
            option.style.boxShadow = 'none';
        });
    });
}
// Buy More Points Modal (Component Details Page)
function openBuyMorePointsModal() {
    // Remove existing modal if any
    const existingModal = document.getElementById('buyPointsModalOverlay');
    if (existingModal) {
        existingModal.remove();
        return;
    }
    const modalHTML = `
        <div class="modal-overlay" id="buyPointsModalOverlay" style="display: flex; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 999998; align-items: center; justify-content: center;">
            <div class="modal-content" style="width: 94%; max-width: 900px; background: white; border-radius: 16px; padding: 0; box-shadow: 0 24px 60px rgba(0,0,0,0.2); position: relative; z-index: 999998;">
                ${createModalHeader()}
                <div style="padding: 28px 36px;">
                    <div style="display: grid; gap: 14px;">
                        ${createUploadOption()}
                        ${createBuyOption()}
                    </div>
                    ${createCloseButton()}
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    // Close on overlay click
    document.getElementById('buyPointsModalOverlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            e.currentTarget.remove();
        }
    });
    // Add hover effects
    addModalHoverEffects();
}
// Copy code function
window.copyCode = function (type) {
    const codeBlock = document.querySelector(`#code-${type} pre`);
    if (codeBlock) {
        const text = codeBlock.textContent || '';
        navigator.clipboard.writeText(text).then(() => {
            showToast(`קוד ה-${type.toUpperCase()} הועתק! ✨`, 'success');
        });
    }
};
// Rating system
const ratingStars = document.querySelectorAll('.rating-star');
const ratingMessage = document.getElementById('ratingMessage');
if (ratingStars.length > 0 && component && currentUser) {
    // Check if user already rated
    const userRating = storage.getUserRating(currentUser.id, component.id);
    // Highlight stars if already rated
    if (userRating > 0) {
        ratingStars.forEach((star, index) => {
            if (index < userRating) {
                star.classList.add('rated');
                star.style.color = '#FFD700';
            }
        });
        if (ratingMessage) {
            ratingMessage.textContent = `דירגת ${userRating} כוכבים ⭐`;
            ratingMessage.style.color = '#D4AF37';
            ratingMessage.style.fontWeight = '700';
        }
    }
    // Add hover effect
    ratingStars.forEach((star, index) => {
        star.addEventListener('mouseenter', () => {
            ratingStars.forEach((s, i) => {
                if (i <= index) {
                    s.style.color = '#FFD700';
                    s.style.transform = 'scale(1.2)';
                }
                else {
                    s.style.color = '#d1d5db';
                    s.style.transform = 'scale(1)';
                }
            });
        });
        star.addEventListener('mouseleave', () => {
            const currentRating = userRating;
            ratingStars.forEach((s, i) => {
                if (i < currentRating) {
                    s.style.color = '#FFD700';
                }
                else {
                    s.style.color = '#d1d5db';
                }
                s.style.transform = 'scale(1)';
            });
        });
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating || '0');
            // Save rating
            storage.rateComponent(currentUser.id, component.id, rating);
            // Update display with animation
            ratingStars.forEach((s, i) => {
                s.classList.remove('rated');
                if (i < rating) {
                    s.style.color = '#FFD700';
                    s.classList.add('rated');
                    // Trigger bounce animation
                    setTimeout(() => {
                        s.style.transform = 'scale(1.5) rotate(360deg)';
                        setTimeout(() => {
                            s.style.transform = '';
                        }, 500);
                    }, i * 100);
                }
                else {
                    s.style.color = '#d1d5db';
                }
            });
            if (ratingMessage) {
                ratingMessage.textContent = `תודה! דירגת ${rating} כוכבים ⭐`;
                ratingMessage.style.color = '#D4AF37';
                ratingMessage.style.fontWeight = '700';
            }
            showToast('הדירוג נשמר בהצלחה! ⭐', 'success');
            // Refresh rating display
            setTimeout(() => {
                const updatedComponent = storage.getComponentById(component.id);
                if (updatedComponent) {
                    const ratingValue = document.querySelector('.stat-card:nth-child(3) .stat-value');
                    const ratingLabel = document.querySelector('.stat-card:nth-child(3) .stat-label');
                    if (ratingValue)
                        ratingValue.textContent = updatedComponent.rating.toFixed(1);
                    if (ratingLabel)
                        ratingLabel.textContent = `${updatedComponent.ratingsCount} דירוגים`;
                }
            }, 500);
        });
    });
}
