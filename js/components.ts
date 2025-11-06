// ========================================
// 🔥💎 STORE PAGE - COMPLETE LOGIC 💎🔥
// Intel/Microsoft/Google Level Code
// ========================================

document.addEventListener('DOMContentLoaded', (): void => {

    // Check authentication
    const currentUserTemp: User | null = storage.getCurrentUser();
    if (!currentUserTemp) {
        window.location.href = '../index.html';
        throw new Error('Not authenticated');
    }
    const currentUser: User = currentUserTemp;
    
    // ========================================
    // HERO SECTION - Explore Button
    // ========================================
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', (): void => {
            const grid = document.getElementById('componentsGrid');
            if (grid) {
                grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Hide points display for admin
    const pointsDisplay = document.querySelector<HTMLDivElement>('.points-display')!;
    const uploadBtn = document.querySelector<HTMLButtonElement>('#uploadBtn')!;
    const adminBtn = document.querySelector<HTMLButtonElement>('#adminBtn')!;
    const profileBtn = document.querySelector<HTMLButtonElement>('#profileBtn')!;
    const logoutBtn = document.querySelector<HTMLButtonElement>('#logoutBtn')!;

    if (currentUser.isAdmin) {
        if (pointsDisplay) pointsDisplay.style.display = 'none';
        if (adminBtn) {
            adminBtn.classList.remove('hidden');
            adminBtn.style.display = 'inline-block';
        }
    } else {
        if (pointsDisplay) {
            pointsDisplay.classList.remove('hidden');
            const pointsAvailable: HTMLElement | null = document.querySelector('#pointsAvailable');
            if (pointsAvailable) {
                pointsAvailable.textContent = currentUser.pointsAvailable.toString();
            }
        }
    }

    uploadBtn.onclick = (): void => {
        window.location.href = 'upload.html';
    };

    adminBtn.onclick = (): void => {
        window.location.href = 'admin.html';
    };

    if (currentUser.isAdmin) {
        profileBtn.style.display = 'none';
    } else {
        if (profileBtn) {
            profileBtn.classList.remove('hidden');
            profileBtn.onclick = (): void => {
                window.location.href = 'profile.html';
            };
        }
    }

    logoutBtn.onclick = (): void => {
        storage.logout();
        showToast('התנתקת בהצלחה', 'success');
        setTimeout((): void => {
            window.location.href = '../index.html';
        }, 1000);
    };

    // Search and filters
    const searchInput = document.querySelector<HTMLInputElement>('#searchInput')!;
    const categoryFilter = document.querySelector<HTMLSelectElement>('#categoryFilter')!;
    const sortFilter = document.querySelector<HTMLSelectElement>('#sortFilter')!;
    const priceFilter = document.querySelector<HTMLInputElement>('#priceFilter');
    const componentsGrid = document.querySelector<HTMLDivElement>('#componentsGrid')!;
    const emptyState = document.querySelector<HTMLDivElement>('#emptyState')!;

    let allComponents: CodeComponent[] = storage.getApprovedComponents();
    let filteredComponents: CodeComponent[] = [...allComponents];

    // Component modal elements
    const componentModal = document.querySelector<HTMLDivElement>('#componentModal')!;
    const modalBody = document.querySelector<HTMLDivElement>('#modalBody')!;
    const modalClose = document.querySelector<HTMLButtonElement>('#modalClose')!;

    // Pagination variables
    let currentDisplayCount: number = 0;
    const ITEMS_PER_LOAD: number = 20;
    let currentComponents: CodeComponent[] = [];

    const renderComponents = (components: CodeComponent[]): void => {
        currentComponents = components;
        currentDisplayCount = 0;
        componentsGrid.innerHTML = '';
        
        if (components.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }
        
        emptyState.classList.add('hidden');
        
        // Load initial batch
        loadMoreComponents();
    };

    const loadMoreComponents = (): void => {
        const start = currentDisplayCount;
        const end = Math.min(start + ITEMS_PER_LOAD, currentComponents.length);
        
        // Remove existing load more button
        const existingLoadMore = componentsGrid.querySelector('.load-more-container');
        if (existingLoadMore) {
            componentsGrid.removeChild(existingLoadMore);
        }
        
        // Add components
        for (let i = start; i < end; i++) {
            const component = currentComponents[i];
            const card = document.createElement('div');
            card.className = 'component-card';
            
            card.innerHTML = `
                <div class="component-image">
                    <img src="${component.image}" alt="${component.name}">
                    ${component.recommended ? '<div class="urgency-badge"><i class="fas fa-crown"></i> מומלץ</div>' : ''}
                </div>
                <div class="component-content">
                    <div class="component-header">
                        <h3 class="component-title">${component.name}</h3>
                        <div class="component-category">${getCategoryName(component.category)}</div>
                    </div>
                    <p class="component-description">${component.description}</p>
                    <div class="component-footer">
                        <div class="component-stats">
                            <span class="stat">⭐ ${component.rating.toFixed(1)}</span>
                            <span class="stat">📦 ${component.purchaseCount}</span>
                        </div>
                        <div class="component-price">${component.price} נקודות</div>
                    </div>
                </div>
            `;
            
            card.onclick = (): void => {
                window.location.href = `component-details.html?id=${component.id}`;
            };
            
            componentsGrid.appendChild(card);
        }
        
        currentDisplayCount = end;
        
        // Add "Load More" button if there are more items
        if (currentDisplayCount < currentComponents.length) {
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
                    loadMoreComponents();
                });
            }
            
            componentsGrid.appendChild(loadMoreContainer);
        }
    };

    const getCategoryName = (category: string): string => {
        const names: Record<string, string> = {
            'buttons': 'כפתורים',
            'forms': 'טפסים',
            'cards': 'כרטיסים',
            'animations': 'אנימציות',
            'menus': 'תפריטים',
            'other': 'אחר'
        };
        return names[category] || category;
    };

    const escapeHtml = (text: string): string => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    // Define openComponentModal BEFORE renderComponents
    const openComponentModal = (component: CodeComponent): void => {
        const hasPurchased: boolean = storage.hasPurchased(currentUser!.id, component.id);
        const isOwner: boolean = component.authorId === currentUser!.id;
        const isAdmin: boolean = currentUser!.isAdmin;
        
        modalBody.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%; background: #1e1e1e;">
                <!-- Header -->
                <div style="background: #2d2d30; padding: 20px 32px; border-bottom: 1px solid #3e3e42; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h2 style="font-size: 24px; font-weight: 600; color: #ffffff; margin: 0 0 8px 0;">${component.name}</h2>
                        <p style="font-size: 14px; color: #cccccc; margin: 0;">${component.description}</p>
                    </div>
                    <div style="display: flex; gap: 16px; align-items: center;">
                        <div style="text-align: center;">
                            <div style="font-size: 12px; color: #999999; margin-bottom: 4px;">מחיר</div>
                            <div style="font-size: 20px; font-weight: 700; color: #4fc3f7;">${component.price} נקודות</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 12px; color: #999999; margin-bottom: 4px;">דירוג</div>
                            <div style="font-size: 18px; font-weight: 600; color: #ffd700;">⭐ ${component.rating.toFixed(1)}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Preview -->
                <div style="background: #252526; padding: 24px; border-bottom: 1px solid #3e3e42;">
                    <img src="${component.image}" alt="${component.name}" style="width: 100%; max-height: 280px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.4);">
                </div>
            
            ${!hasPurchased && !isOwner && !isAdmin ? `
                <!-- Locked Code -->
                <div style="background: #1e1e1e; padding: 32px; text-align: center; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <div style="background: rgba(255, 193, 7, 0.1); border: 2px dashed #ffc107; border-radius: 12px; padding: 48px; max-width: 500px;">
                        <div style="font-size: 64px; margin-bottom: 16px;">🔒</div>
                        <h3 style="font-size: 24px; font-weight: 600; color: #ffffff; margin: 0 0 12px 0;">הקוד נעול</h3>
                        <p style="font-size: 16px; color: #cccccc; margin: 0 0 32px 0;">רכוש את הרכיב כדי לצפות בקוד המלא ולהשתמש בו בפרויקטים שלך</p>
                        <button class="btn btn-primary" id="purchaseComponentBtn" style="padding: 16px 48px; font-size: 18px; font-weight: 600; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(102, 126, 234, 0.6)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 16px rgba(102, 126, 234, 0.4)';">
                            🛒 רכוש עכשיו ב-${component.price} נקודות
                        </button>
                    </div>
                </div>
                ${currentUser!.pointsAvailable < component.price ? `
                    <div style="margin-top: 1.5rem; padding: 1.5rem; background: #fee2e2; border-radius: 12px; border: 2px solid #ef4444;">
                        <p style="color: #b91c1c; font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem;">⚠️ חסרות לך ${component.price - currentUser!.pointsAvailable} נקודות</p>
                        <button class="btn btn-secondary" id="buyMorePointsBtn" style="width: 100%; padding: 1rem; font-size: 1.1rem; font-weight: bold; background: #ef4444; color: white; border: none; border-radius: 10px; cursor: pointer;">
                            💳 רכוש נקודות נוספות
                        </button>
                    </div>
                ` : ''}
            ` : isAdmin ? `
                <div style="margin: 2rem 0; padding: 2.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; color: white; text-align: center; box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🛡️</div>
                    <h3 style="margin: 0.5rem 0; font-size: 1.5rem; font-weight: bold;">גישת מנהל</h3>
                    <p style="margin: 0.5rem 0; font-size: 1.1rem; opacity: 0.95;">כמנהל, יש לך גישה מלאה לכל הקוד</p>
                </div>
                <div style="margin: 2rem 0;">
                <!-- Tabs -->
                <div style="background: #2d2d30; border-bottom: 1px solid #3e3e42; display: flex; gap: 0;">
                    <div class="code-tab active" data-lang="html" style="padding: 12px 24px; color: #ffffff; background: #1e1e1e; border-bottom: 2px solid #4fc3f7; cursor: pointer; font-size: 14px; font-weight: 500;">HTML</div>
                    <div class="code-tab" data-lang="css" style="padding: 12px 24px; color: #999999; background: transparent; border-bottom: 2px solid transparent; cursor: pointer; font-size: 14px; font-weight: 500;">CSS</div>
                    ${component.js ? `<div class="code-tab" data-lang="js" style="padding: 12px 24px; color: #999999; background: transparent; border-bottom: 2px solid transparent; cursor: pointer; font-size: 14px; font-weight: 500;">JavaScript</div>` : ''}
                </div>
                
                <!-- Code Display -->
                <div style="background: #1e1e1e; padding: 24px; flex: 1; overflow-y: auto;">
                    <div id="code-html" class="code-content" style="display: block;">
                        <pre style="background: #1e1e1e; color: #d4d4d4; padding: 0; margin: 0; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.6; overflow-x: auto;">${escapeHtml(component.html)}</pre>
                    </div>
                    <div id="code-css" class="code-content" style="display: none;">
                        <pre style="background: #1e1e1e; color: #d4d4d4; padding: 0; margin: 0; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.6; overflow-x: auto;">${escapeHtml(component.css)}</pre>
                    </div>
                    ${component.js ? `
                        <div id="code-js" class="code-content" style="display: none;">
                            <pre style="background: #1e1e1e; color: #d4d4d4; padding: 0; margin: 0; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.6; overflow-x: auto;">${escapeHtml(component.js)}</pre>
                        </div>
                    ` : ''}
                </div>
            ` : `
                <div style="margin: 2rem 0;">
                <!-- Tabs -->
                <div style="background: #2d2d30; border-bottom: 1px solid #3e3e42; display: flex; gap: 0;">
                    <div class="code-tab active" data-lang="html" style="padding: 12px 24px; color: #ffffff; background: #1e1e1e; border-bottom: 2px solid #4fc3f7; cursor: pointer; font-size: 14px; font-weight: 500;">HTML</div>
                    <div class="code-tab" data-lang="css" style="padding: 12px 24px; color: #999999; background: transparent; border-bottom: 2px solid transparent; cursor: pointer; font-size: 14px; font-weight: 500;">CSS</div>
                    ${component.js ? `<div class="code-tab" data-lang="js" style="padding: 12px 24px; color: #999999; background: transparent; border-bottom: 2px solid transparent; cursor: pointer; font-size: 14px; font-weight: 500;">JavaScript</div>` : ''}
                </div>
                
                <!-- Code Display -->
                <div style="background: #1e1e1e; padding: 24px; flex: 1; overflow-y: auto;">
                    <div id="code-html" class="code-content" style="display: block;">
                        <pre style="background: #1e1e1e; color: #d4d4d4; padding: 0; margin: 0; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.6; overflow-x: auto;">${escapeHtml(component.html)}</pre>
                    </div>
                    <div id="code-css" class="code-content" style="display: none;">
                        <pre style="background: #1e1e1e; color: #d4d4d4; padding: 0; margin: 0; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.6; overflow-x: auto;">${escapeHtml(component.css)}</pre>
                    </div>
                    ${component.js ? `
                        <div id="code-js" class="code-content" style="display: none;">
                            <pre style="background: #1e1e1e; color: #d4d4d4; padding: 0; margin: 0; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.6; overflow-x: auto;">${escapeHtml(component.js)}</pre>
                        </div>
                    ` : ''}
                </div>
            `}
            </div>
        `;
        
        // הסר hidden והצג את המודל - בכוח!
        componentModal.classList.remove('hidden');
        componentModal.style.display = 'flex !important';
        componentModal.style.visibility = 'visible';
        componentModal.style.opacity = '1';
        componentModal.style.zIndex = '99999';
        componentModal.style.position = 'fixed';
        componentModal.style.top = '0';
        componentModal.style.left = '0';
        componentModal.style.right = '0';
        componentModal.style.bottom = '0';
        componentModal.style.background = 'rgba(0, 0, 0, 0.8)';
        
        // Purchase button
        const purchaseBtn = modalBody.querySelector<HTMLButtonElement>('#purchaseComponentBtn');
        if (purchaseBtn) {
            purchaseBtn.onclick = (): void => {
                purchaseComponent(component);
            };
        }
        
        // Buy more points button
        const buyMoreBtn = modalBody.querySelector<HTMLButtonElement>('#buyMorePointsBtn');
        if (buyMoreBtn) {
            buyMoreBtn.onclick = (): void => {
                componentModal.classList.add('hidden');
                openPurchaseModal();
            };
        }
        
        // Tab functionality
        const tabs = modalBody.querySelectorAll<HTMLDivElement>('.code-tab');
        tabs.forEach((tab: HTMLDivElement): void => {
            tab.onclick = (): void => {
                const lang: string | undefined = tab.dataset.lang;
                if (!lang) return;
                
                // Remove active from all tabs
                tabs.forEach((t: HTMLDivElement): void => {
                    t.style.color = '#999999';
                    t.style.background = 'transparent';
                    t.style.borderBottom = '2px solid transparent';
                });
                
                // Add active to clicked tab
                tab.style.color = '#ffffff';
                tab.style.background = '#1e1e1e';
                tab.style.borderBottom = '2px solid #4fc3f7';
                
                // Hide all code sections
                const codeContents = modalBody.querySelectorAll<HTMLDivElement>('.code-content');
                codeContents.forEach((content: HTMLDivElement): void => {
                    content.style.display = 'none';
                });
                
                // Show selected code section
                const targetContent = modalBody.querySelector<HTMLDivElement>(`#code-${lang}`);
                if (targetContent) {
                    targetContent.style.display = 'block';
                }
            };
        });
    };

    const filterComponents = (): void => {
        const searchTerm: string = searchInput.value.toLowerCase().trim();
        const category: string = categoryFilter.value;
        const sort: string = sortFilter.value;
        const maxPrice: number = priceFilter ? parseInt(priceFilter.value) : 500;
        
        filteredComponents = allComponents.filter((component: CodeComponent): boolean => {
            const matchesSearch: boolean = component.name.toLowerCase().includes(searchTerm) || 
                                           component.description.toLowerCase().includes(searchTerm);
            const matchesCategory: boolean = !category || component.category === category;
            const matchesPrice: boolean = component.price <= maxPrice;
            return matchesSearch && matchesCategory && matchesPrice;
        });
        
        // Sort
        const sortByRating = (a: CodeComponent, b: CodeComponent): number => b.rating - a.rating;
        const sortByPrice = (a: CodeComponent, b: CodeComponent): number => a.price - b.price;
        const sortByPopularity = (a: CodeComponent, b: CodeComponent): number => b.purchaseCount - a.purchaseCount;
        const sortByDate = (a: CodeComponent, b: CodeComponent): number => (b.approvedAt || 0) - (a.approvedAt || 0);
        
        if (sort === 'newest') {
            filteredComponents.sort(sortByDate);
        } else if (sort === 'popular') {
            filteredComponents.sort(sortByPopularity);
        } else if (sort === 'rated') {
            filteredComponents.sort(sortByRating);
        } else if (sort === 'cheapest') {
            filteredComponents.sort(sortByPrice);
        }
        
        renderComponents(filteredComponents);
    };

    searchInput.oninput = filterComponents;
    categoryFilter.onchange = filterComponents;
    sortFilter.onchange = filterComponents;
    if (priceFilter) {
        priceFilter.oninput = filterComponents;
    }

    const purchaseComponent = (component: CodeComponent): void => {
        if (currentUser!.pointsAvailable < component.price) {
            showToast('אין מספיק נקודות', 'error');
            return;
        }
        
        // Deduct points
        currentUser!.pointsAvailable -= component.price;
        currentUser!.totalSpent += component.price;
        storage.updateUser(currentUser!);
        
        // Add purchase
        const purchase: Purchase = {
            id: storage.generateId(),
            userId: currentUser!.id,
            componentId: component.id,
            price: component.price,
            timestamp: Date.now()
        };
        storage.addPurchase(purchase);
        
        // Update component
        component.purchaseCount++;
        storage.updateComponent(component);
        
        // Add activity
        const activity: ActivityLog = {
            id: storage.generateId(),
            type: 'purchase',
            userId: currentUser!.id,
            username: currentUser!.username,
            description: `${currentUser!.username} רכש את "${component.name}"`,
            timestamp: Date.now()
        };
        storage.addActivity(activity);
        
        // Update display
        if (!currentUser.isAdmin) {
            const pointsAvailable = document.querySelector<HTMLSpanElement>('#pointsAvailable')!;
            pointsAvailable.textContent = currentUser.pointsAvailable.toString();
        }
        
        showToast('הרכיב נרכש בהצלחה! 🎉', 'success');
        
        setTimeout((): void => {
            componentModal.classList.add('hidden');
            openComponentModal(component);
        }, 1500);
    };


    modalClose.onclick = (): void => {
        componentModal.classList.add('hidden');
    };

    componentModal.onclick = (e: MouseEvent): void => {
        if (e.target === componentModal) {
            componentModal.classList.add('hidden');
        }
    };

    // Purchase modal (handled in purchase.ts)
    const openPurchaseModal = (): void => {
        const purchaseModal = document.querySelector<HTMLDivElement>('#purchaseModal')!;
        purchaseModal.classList.remove('hidden');
    };

    // Auto-refresh popular components every 10 seconds (setInterval requirement)
    let refreshInterval: number = setInterval((): void => {
        if (sortFilter.value === 'popular') {
            allComponents = storage.getApprovedComponents();
            filterComponents();
        }
    }, 10000);

    // Clean up interval when leaving page
    window.addEventListener('beforeunload', (): void => {
        clearInterval(refreshInterval);
    });

    // Initial render
    renderComponents(filteredComponents);
});
