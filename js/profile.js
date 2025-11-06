"use strict";
// ========================================
// Profile Page Logic
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const currentUserTemp = storage.getCurrentUser();
    if (!currentUserTemp) {
        window.location.href = '../index.html';
        throw new Error('Not authenticated');
    }
    const currentUser = currentUserTemp;
    // Redirect admin to admin panel
    if (currentUser.isAdmin) {
        window.location.href = 'admin.html';
        throw new Error('Admin redirected');
    }
    // Back button
    const backBtnProfile = document.querySelector('#backBtn');
    backBtnProfile.onclick = () => {
        window.location.href = 'store.html';
    };
    // Display user info
    const profileUsername = document.querySelector('#profileUsername');
    const profileEmail = document.querySelector('#profileEmail');
    const availablePoints = document.querySelector('#availablePoints');
    const pendingPoints = document.querySelector('#pendingPoints');
    const totalPoints = document.querySelector('#totalPoints');
    profileUsername.textContent = currentUser.username;
    profileEmail.textContent = currentUser.email;
    availablePoints.textContent = currentUser.pointsAvailable.toString();
    pendingPoints.textContent = currentUser.pointsPending.toString();
    totalPoints.textContent = (currentUser.pointsAvailable + currentUser.pointsPending).toString();
    // Buy points button
    const buyPointsBtn = document.querySelector('#buyPointsBtn');
    buyPointsBtn.onclick = () => {
        const purchaseModal = document.querySelector('#purchaseModal');
        purchaseModal.classList.remove('hidden');
    };
    // Tabs
    const myComponentsTab = document.querySelector('#myComponentsTab');
    const purchasedTab = document.querySelector('#purchasedTab');
    const statsTab = document.querySelector('#statsTab');
    const myComponentsContent = document.querySelector('#myComponentsContent');
    const purchasedContent = document.querySelector('#purchasedContent');
    const statsContent = document.querySelector('#statsContent');
    myComponentsTab.onclick = () => {
        activateTab(myComponentsTab, myComponentsContent);
    };
    purchasedTab.onclick = () => {
        activateTab(purchasedTab, purchasedContent);
    };
    statsTab.onclick = () => {
        activateTab(statsTab, statsContent);
        updateStats();
    };
    const activateTab = (tabBtn, content) => {
        // Remove active from all tabs
        document.querySelectorAll('.tab-btn').forEach((btn) => {
            btn.classList.remove('active');
        });
        // Remove active from all contents
        document.querySelectorAll('.tab-content').forEach((cont) => {
            cont.classList.add('hidden');
            cont.classList.remove('active');
        });
        // Add active to selected
        tabBtn.classList.add('active');
        content.classList.remove('hidden');
        content.classList.add('active');
    };
    // My Components
    const myComponentsList = document.querySelector('#myComponentsList');
    // My Components pagination
    let myComponentsDisplayCount = 0;
    const MY_COMPONENTS_PER_LOAD = 20;
    let allMyComponents = [];
    const renderMyComponents = () => {
        allMyComponents = storage.getComponentsByAuthor(currentUser.id);
        myComponentsDisplayCount = 0;
        myComponentsList.innerHTML = '';
        if (allMyComponents.length === 0) {
            myComponentsList.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 2rem;">עדיין לא העלת רכיבים</p>';
        }
        else {
            loadMoreMyComponents();
        }
    };
    const loadMoreMyComponents = () => {
        const start = myComponentsDisplayCount;
        const end = Math.min(start + MY_COMPONENTS_PER_LOAD, allMyComponents.length);
        // Remove existing load more button
        const existingLoadMore = myComponentsList.querySelector('.load-more-container');
        if (existingLoadMore) {
            myComponentsList.removeChild(existingLoadMore);
        }
        // Add components
        for (let i = start; i < end; i++) {
            const component = allMyComponents[i];
            const item = document.createElement('div');
            item.className = 'component-item';
            let statusBadge = '';
            if (component.status === 'approved') {
                statusBadge = '<span class="status-badge status-approved">✅ מאושר</span>';
            }
            else if (component.status === 'pending') {
                statusBadge = '<span class="status-badge status-pending">⏳ ממתין לאישור</span>';
            }
            else if (component.status === 'rejected') {
                statusBadge = `<span class="status-badge status-rejected">❌ נדחה</span>`;
            }
            // Build meta info based on status
            let metaInfo = statusBadge;
            // Only show stats for approved or pending components
            if (component.status !== 'rejected') {
                metaInfo += `
                <span>⭐ דירוג: ${component.rating.toFixed(1)} (${component.ratingsCount})</span>
                <span>🛒 נרכש: ${component.purchaseCount} פעמים</span>
            `;
            }
            metaInfo += `<span>💰 ${component.price} נקודות</span>`;
            // Build actions - only show view button for non-rejected components
            let actions = '';
            if (component.status !== 'rejected') {
                actions = '<button class="btn btn-secondary btn-view">צפה</button>';
            }
            item.innerHTML = `
            <div class="component-item-info">
                <div class="component-item-title">${component.name}</div>
                <div class="component-item-meta">
                    ${metaInfo}
                </div>
                ${component.rejectedReason ? `<p style="color: var(--danger-color); margin-top: 0.5rem;">סיבה: ${component.rejectedReason}</p>` : ''}
            </div>
            <div class="component-item-actions">
                ${actions}
            </div>
        `;
            // Only add click event if button exists
            if (component.status !== 'rejected') {
                const viewBtn = item.querySelector('.btn-view');
                viewBtn.onclick = () => {
                    showCodeModal(component);
                };
            }
            myComponentsList.appendChild(item);
        }
        myComponentsDisplayCount = end;
        // Add "Load More" button if there are more items
        if (myComponentsDisplayCount < allMyComponents.length) {
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
                    loadMoreMyComponents();
                });
            }
            myComponentsList.appendChild(loadMoreContainer);
        }
    };
    renderMyComponents();
    // Purchased Components
    const purchasedList = document.querySelector('#purchasedList');
    // Purchased pagination
    let purchasedDisplayCount = 0;
    const PURCHASED_PER_LOAD = 20;
    let allPurchases = storage.getPurchasesByUser(currentUser.id);
    const renderPurchasedComponents = () => {
        purchasedDisplayCount = 0;
        purchasedList.innerHTML = '';
        if (allPurchases.length === 0) {
            purchasedList.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 2rem;">עדיין לא רכשת רכיבים</p>';
        }
        else {
            loadMorePurchased();
        }
    };
    const loadMorePurchased = () => {
        const start = purchasedDisplayCount;
        const end = Math.min(start + PURCHASED_PER_LOAD, allPurchases.length);
        // Remove existing load more button
        const existingLoadMore = purchasedList.querySelector('.load-more-container');
        if (existingLoadMore) {
            purchasedList.removeChild(existingLoadMore);
        }
        // Add purchases
        for (let i = start; i < end; i++) {
            const purchase = allPurchases[i];
            const component = storage.getComponentById(purchase.componentId);
            if (!component)
                continue;
            const item = document.createElement('div');
            item.className = 'component-item';
            const date = new Date(purchase.timestamp);
            const dateStr = date.toLocaleDateString('he-IL');
            item.innerHTML = `
            <div class="component-item-info">
                <div class="component-item-title">${component.name}</div>
                <div class="component-item-meta">
                    <span>מאת: ${component.authorName}</span>
                    <span>תאריך: ${dateStr}</span>
                    <span>💰 ${purchase.price} נקודות</span>
                </div>
            </div>
            <div class="component-item-actions">
                <button class="btn btn-primary btn-code">הורד קוד</button>
            </div>
        `;
            const codeBtn = item.querySelector('.btn-code');
            codeBtn.onclick = () => {
                showCodeModal(component);
            };
            purchasedList.appendChild(item);
        }
        purchasedDisplayCount = end;
        // Add "Load More" button if there are more items
        if (purchasedDisplayCount < allPurchases.length) {
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
                    loadMorePurchased();
                });
            }
            purchasedList.appendChild(loadMoreContainer);
        }
    };
    renderPurchasedComponents();
    // Code modal
    const codeModal = document.querySelector('#codeModal');
    const codeModalClose = document.querySelector('#codeModalClose');
    const codeModalTitle = document.querySelector('#codeModalTitle');
    const codeHTML = document.querySelector('#codeHTML');
    const codeCSS = document.querySelector('#codeCSS');
    const codeJS = document.querySelector('#codeJS');
    const copyCodeBtn = document.querySelector('#copyCodeBtn');
    let currentCodeComponent = null;
    const showCodeModal = (component) => {
        currentCodeComponent = component;
        codeModalTitle.textContent = component.name;
        codeHTML.textContent = component.html;
        codeCSS.textContent = component.css;
        codeJS.textContent = component.js || '// אין קוד JavaScript';
        codeModal.classList.remove('hidden');
    };
    codeModalClose.onclick = () => {
        codeModal.classList.add('hidden');
    };
    codeModal.onclick = (e) => {
        if (e.target === codeModal) {
            codeModal.classList.add('hidden');
        }
    };
    copyCodeBtn.onclick = () => {
        if (!currentCodeComponent)
            return;
        const allCode = `<!-- HTML -->\n${currentCodeComponent.html}\n\n/* CSS */\n${currentCodeComponent.css}\n\n// JavaScript\n${currentCodeComponent.js}`;
        navigator.clipboard.writeText(allCode).then(() => {
            showToast('הקוד הועתק ללוח!', 'success');
        }).catch(() => {
            showToast('שגיאה בהעתקה', 'error');
        });
    };
    // Statistics
    const updateStats = () => {
        const totalEarned = document.querySelector('#totalEarned');
        const totalSpent = document.querySelector('#totalSpent');
        const componentsUploaded = document.querySelector('#componentsUploaded');
        const componentsPurchased = document.querySelector('#componentsPurchased');
        const totalRatings = document.querySelector('#totalRatings');
        const avgRating = document.querySelector('#avgRating');
        const myComponents = storage.getComponentsByAuthor(currentUser.id);
        totalEarned.textContent = currentUser.totalEarned.toString();
        totalSpent.textContent = currentUser.totalSpent.toString();
        componentsUploaded.textContent = myComponents.length.toString();
        componentsPurchased.textContent = allPurchases.length.toString();
        // Calculate total ratings received on user's components
        let ratingsSum = 0;
        let ratingsCount = 0;
        myComponents.forEach((comp) => {
            ratingsCount += comp.ratingsCount;
            ratingsSum += comp.rating * comp.ratingsCount;
        });
        totalRatings.textContent = ratingsCount.toString();
        avgRating.textContent = ratingsCount > 0 ? (ratingsSum / ratingsCount).toFixed(1) : '0';
    };
});
