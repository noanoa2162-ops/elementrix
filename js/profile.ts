// ========================================
// Profile Page Logic
// ========================================

document.addEventListener('DOMContentLoaded', (): void => {

    // Check authentication
    const currentUserTemp: User | null = storage.getCurrentUser();
    if (!currentUserTemp) {
        window.location.href = '../index.html';
        throw new Error('Not authenticated');
    }
    const currentUser: User = currentUserTemp;

// Redirect admin to admin panel
if (currentUser.isAdmin) {
    window.location.href = 'admin.html';
    throw new Error('Admin redirected');
}

// Back button
const backBtnProfile = document.querySelector<HTMLButtonElement>('#backBtn')!;
backBtnProfile.onclick = (): void => {
    window.location.href = 'store.html';
};

// Display user info
const profileUsername = document.querySelector<HTMLElement>('#profileUsername')!;
const profileEmail = document.querySelector<HTMLElement>('#profileEmail')!;
const availablePoints = document.querySelector<HTMLElement>('#availablePoints')!;
const pendingPoints = document.querySelector<HTMLElement>('#pendingPoints')!;
const totalPoints = document.querySelector<HTMLElement>('#totalPoints')!;

profileUsername.textContent = currentUser!.username;
profileEmail.textContent = currentUser!.email;
availablePoints.textContent = currentUser!.pointsAvailable.toString();
pendingPoints.textContent = currentUser!.pointsPending.toString();
totalPoints.textContent = (currentUser!.pointsAvailable + currentUser!.pointsPending).toString();

// Buy points button
const buyPointsBtn = document.querySelector<HTMLButtonElement>('#buyPointsBtn')!;
buyPointsBtn.onclick = (): void => {
    const purchaseModal = document.querySelector<HTMLDivElement>('#purchaseModal')!;
    purchaseModal.classList.remove('hidden');
};

// Tabs
const myComponentsTab = document.querySelector<HTMLButtonElement>('#myComponentsTab')!;
const purchasedTab = document.querySelector<HTMLButtonElement>('#purchasedTab')!;
const statsTab = document.querySelector<HTMLButtonElement>('#statsTab')!;

const myComponentsContent = document.querySelector<HTMLDivElement>('#myComponentsContent')!;
const purchasedContent = document.querySelector<HTMLDivElement>('#purchasedContent')!;
const statsContent = document.querySelector<HTMLDivElement>('#statsContent')!;

myComponentsTab.onclick = (): void => {
    activateTab(myComponentsTab, myComponentsContent);
};

purchasedTab.onclick = (): void => {
    activateTab(purchasedTab, purchasedContent);
};

statsTab.onclick = (): void => {
    activateTab(statsTab, statsContent);
    updateStats();
};

const activateTab = (tabBtn: HTMLButtonElement, content: HTMLDivElement): void => {
    // Remove active from all tabs
    document.querySelectorAll<HTMLButtonElement>('.tab-btn').forEach((btn: HTMLButtonElement): void => {
        btn.classList.remove('active');
    });
    
    // Remove active from all contents
    document.querySelectorAll<HTMLDivElement>('.tab-content').forEach((cont: HTMLDivElement): void => {
        cont.classList.add('hidden');
        cont.classList.remove('active');
    });
    
    // Add active to selected
    tabBtn.classList.add('active');
    content.classList.remove('hidden');
    content.classList.add('active');
};

// My Components
const myComponentsList = document.querySelector<HTMLDivElement>('#myComponentsList')!;

// My Components pagination
let myComponentsDisplayCount: number = 0;
const MY_COMPONENTS_PER_LOAD: number = 20;
let allMyComponents: CodeComponent[] = [];

const renderMyComponents = (): void => {
    allMyComponents = storage.getComponentsByAuthor(currentUser.id);
    myComponentsDisplayCount = 0;
    myComponentsList.innerHTML = '';

    if (allMyComponents.length === 0) {
        myComponentsList.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 2rem;">עדיין לא העלת רכיבים</p>';
    } else {
        loadMoreMyComponents();
    }
}

const loadMoreMyComponents = (): void => {
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
        
        let statusBadge: string = '';
        if (component.status === 'approved') {
            statusBadge = '<span class="status-badge status-approved">✅ מאושר</span>';
        } else if (component.status === 'pending') {
            statusBadge = '<span class="status-badge status-pending">⏳ ממתין לאישור</span>';
        } else if (component.status === 'rejected') {
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
            const viewBtn = item.querySelector<HTMLButtonElement>('.btn-view')!;
            viewBtn.onclick = (): void => {
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
        
        const loadMoreBtn = loadMoreContainer.querySelector('.load-more-btn') as HTMLButtonElement;
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                loadMoreMyComponents();
            });
        }
        
        myComponentsList.appendChild(loadMoreContainer);
    }
}

renderMyComponents();

// Purchased Components
const purchasedList = document.querySelector<HTMLDivElement>('#purchasedList')!;

// Purchased pagination
let purchasedDisplayCount: number = 0;
const PURCHASED_PER_LOAD: number = 20;
let allPurchases: Purchase[] = storage.getPurchasesByUser(currentUser.id);

const renderPurchasedComponents = (): void => {
    purchasedDisplayCount = 0;
    purchasedList.innerHTML = '';
    
    if (allPurchases.length === 0) {
        purchasedList.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 2rem;">עדיין לא רכשת רכיבים</p>';
    } else {
        loadMorePurchased();
    }
}

const loadMorePurchased = (): void => {
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
        const component: CodeComponent | undefined = storage.getComponentById(purchase.componentId);
        if (!component) continue;
        
        const item = document.createElement('div');
        item.className = 'component-item';
        
        const date: Date = new Date(purchase.timestamp);
        const dateStr: string = date.toLocaleDateString('he-IL');
        
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
        
        const codeBtn = item.querySelector<HTMLButtonElement>('.btn-code')!;
        codeBtn.onclick = (): void => {
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
        
        const loadMoreBtn = loadMoreContainer.querySelector('.load-more-btn') as HTMLButtonElement;
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                loadMorePurchased();
            });
        }
        
        purchasedList.appendChild(loadMoreContainer);
    }
}

renderPurchasedComponents();

// Code modal
const codeModal = document.querySelector<HTMLDivElement>('#codeModal')!;
const codeModalClose = document.querySelector<HTMLButtonElement>('#codeModalClose')!;
const codeModalTitle = document.querySelector<HTMLElement>('#codeModalTitle')!;
const codeHTML = document.querySelector<HTMLElement>('#codeHTML')!;
const codeCSS = document.querySelector<HTMLElement>('#codeCSS')!;
const codeJS = document.querySelector<HTMLElement>('#codeJS')!;
const copyCodeBtn = document.querySelector<HTMLButtonElement>('#copyCodeBtn')!;

let currentCodeComponent: CodeComponent | null = null;

const showCodeModal = (component: CodeComponent): void => {
    currentCodeComponent = component;
    codeModalTitle.textContent = component.name;
    codeHTML.textContent = component.html;
    codeCSS.textContent = component.css;
    codeJS.textContent = component.js || '// אין קוד JavaScript';
    codeModal.classList.remove('hidden');
};

codeModalClose.onclick = (): void => {
    codeModal.classList.add('hidden');
};

codeModal.onclick = (e: MouseEvent): void => {
    if (e.target === codeModal) {
        codeModal.classList.add('hidden');
    }
};

copyCodeBtn.onclick = (): void => {
    if (!currentCodeComponent) return;
    
    const allCode: string = `<!-- HTML -->\n${currentCodeComponent.html}\n\n/* CSS */\n${currentCodeComponent.css}\n\n// JavaScript\n${currentCodeComponent.js}`;
    
    navigator.clipboard.writeText(allCode).then((): void => {
        showToast('הקוד הועתק ללוח!', 'success');
    }).catch((): void => {
        showToast('שגיאה בהעתקה', 'error');
    });
};

// Statistics
const updateStats = (): void => {
    const totalEarned = document.querySelector<HTMLElement>('#totalEarned')!;
    const totalSpent = document.querySelector<HTMLElement>('#totalSpent')!;
    const componentsUploaded = document.querySelector<HTMLElement>('#componentsUploaded')!;
    const componentsPurchased = document.querySelector<HTMLElement>('#componentsPurchased')!;
    const totalRatings = document.querySelector<HTMLElement>('#totalRatings')!;
    const avgRating = document.querySelector<HTMLElement>('#avgRating')!;
    
    const myComponents: CodeComponent[] = storage.getComponentsByAuthor(currentUser.id);
    
    totalEarned.textContent = currentUser.totalEarned.toString();
    totalSpent.textContent = currentUser.totalSpent.toString();
    componentsUploaded.textContent = myComponents.length.toString();
    componentsPurchased.textContent = allPurchases.length.toString();
    
    // Calculate total ratings received on user's components
    let ratingsSum: number = 0;
    let ratingsCount: number = 0;
    
    myComponents.forEach((comp: CodeComponent): void => {
        ratingsCount += comp.ratingsCount;
        ratingsSum += comp.rating * comp.ratingsCount;
    });
    
    totalRatings.textContent = ratingsCount.toString();
    avgRating.textContent = ratingsCount > 0 ? (ratingsSum / ratingsCount).toFixed(1) : '0';
};

});
