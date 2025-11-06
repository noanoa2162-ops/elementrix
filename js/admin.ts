// ========================================
// Admin Panel Logic
// ========================================

document.addEventListener('DOMContentLoaded', (): void => {

    // Check authentication and admin rights
    const currentUserTemp: User | null = storage.getCurrentUser();
    if (!currentUserTemp || !currentUserTemp.isAdmin) {
        window.location.href = '../index.html';
        throw new Error('Not admin');
    }
    const currentUser: User = currentUserTemp;

    // Back button
    const backBtnAdmin = document.querySelector<HTMLButtonElement>('#backBtn')!;
    backBtnAdmin.onclick = (): void => {
        window.location.href = 'store.html';
    };

    // Update overview stats
    const totalUsers = document.querySelector<HTMLElement>('#totalUsers')!;
    const totalComponents = document.querySelector<HTMLElement>('#totalComponents')!;
    const pendingComponents = document.querySelector<HTMLElement>('#pendingComponents')!;
    const totalTransactions = document.querySelector<HTMLElement>('#totalTransactions')!;

    const updateOverviewStats = (): void => {
        const users: User[] = storage.loadUsers();
        const components: CodeComponent[] = storage.loadComponents();
        // Filter out admin's own components from pending count
        const pending: CodeComponent[] = components.filter((c: CodeComponent): boolean => c.status === 'pending' && c.authorId !== currentUser.id);
        const purchases: Purchase[] = storage.loadPurchases();
        
        totalUsers.textContent = users.length.toString();
        totalComponents.textContent = components.length.toString();
        pendingComponents.textContent = pending.length.toString();
        totalTransactions.textContent = purchases.length.toString();
    };

    updateOverviewStats();

    // Tabs
    const pendingTab = document.querySelector<HTMLButtonElement>('#pendingTab')!;
    const allComponentsTab = document.querySelector<HTMLButtonElement>('#allComponentsTab')!;
    const usersTab = document.querySelector<HTMLButtonElement>('#usersTab')!;
    const activityTab = document.querySelector<HTMLButtonElement>('#activityTab')!;

    const pendingContent = document.querySelector<HTMLDivElement>('#pendingContent')!;
    const allComponentsContent = document.querySelector<HTMLDivElement>('#allComponentsContent')!;
    const usersContent = document.querySelector<HTMLDivElement>('#usersContent')!;
    const activityContent = document.querySelector<HTMLDivElement>('#activityContent')!;

    pendingTab.onclick = (): void => {
        activateTab(pendingTab, pendingContent);
        renderPendingComponents();
    };

    allComponentsTab.onclick = (): void => {
        activateTab(allComponentsTab, allComponentsContent);
        renderAllComponents();
    };

    usersTab.onclick = (): void => {
        activateTab(usersTab, usersContent);
        renderUsers();
    };

    activityTab.onclick = (): void => {
        activateTab(activityTab, activityContent);
        renderActivity();
    };

    const activateTab = (tabBtn: HTMLButtonElement, content: HTMLDivElement): void => {
        document.querySelectorAll<HTMLButtonElement>('.tab-btn').forEach((btn: HTMLButtonElement): void => {
            btn.classList.remove('active');
        });
        
        document.querySelectorAll<HTMLDivElement>('.tab-content').forEach((cont: HTMLDivElement): void => {
            cont.classList.add('hidden');
            cont.classList.remove('active');
        });
        
        tabBtn.classList.add('active');
        content.classList.remove('hidden');
        content.classList.add('active');
    };

    // Pending Components
    const pendingList = document.querySelector<HTMLDivElement>('#pendingList')!;

    // Pending pagination
    let pendingDisplayCount: number = 0;
    const PENDING_PER_LOAD: number = 20;
    let allPending: CodeComponent[] = [];

    const renderPendingComponents = (): void => {
        const components: CodeComponent[] = storage.loadComponents();
        // Filter out admin's own components from pending list
        allPending = components.filter((c: CodeComponent): boolean => c.status === 'pending' && c.authorId !== currentUser.id);
        pendingDisplayCount = 0;
        pendingList.innerHTML = '';
        
        if (allPending.length === 0) {
            pendingList.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 2rem;">אין רכיבים ממתינים לאישור</p>';
            return;
        }
        
        loadMorePending();
    };

    const loadMorePending = (): void => {
        const start = pendingDisplayCount;
        const end = Math.min(start + PENDING_PER_LOAD, allPending.length);
        
        // Remove existing load more button
        const existingLoadMore = pendingList.querySelector('.load-more-container');
        if (existingLoadMore) {
            pendingList.removeChild(existingLoadMore);
        }
        
        // Add pending components
        for (let i = start; i < end; i++) {
            const component = allPending[i];
            const item = document.createElement('div');
            item.className = 'pending-item';
            
            const date: Date = new Date(component.createdAt);
            const dateStr: string = date.toLocaleDateString('he-IL') + ' ' + date.toLocaleTimeString('he-IL');
            
            item.innerHTML = `
                <div class="pending-header">
                    <div class="pending-title">${component.name}</div>
                    <button class="btn btn-primary btn-review" data-id="${component.id}">בדוק</button>
                </div>
                <div class="pending-meta">
                    מאת: ${component.authorName} | קטגוריה: ${getCategoryName(component.category)} | מחיר: ${component.price} נקודות | תאריך: ${dateStr}
                </div>
                <p>${component.description}</p>
            `;
            
            const reviewBtn = item.querySelector<HTMLButtonElement>('.btn-review')!;
            reviewBtn.onclick = (): void => {
                openReviewModal(component);
            };
            
            pendingList.appendChild(item);
        }
        
        pendingDisplayCount = end;
        
        // Add "Load More" button if there are more items
        if (pendingDisplayCount < allPending.length) {
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
                    loadMorePending();
                });
            }
            
            pendingList.appendChild(loadMoreContainer);
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

    // Review Modal
    const reviewModal = document.querySelector<HTMLDivElement>('#reviewModal')!;
    const reviewModalClose = document.querySelector<HTMLButtonElement>('#reviewModalClose')!;
    const reviewContent = document.querySelector<HTMLDivElement>('#reviewContent')!;
    const approveBtn = document.querySelector<HTMLButtonElement>('#approveBtn')!;
    const rejectBtn = document.querySelector<HTMLButtonElement>('#rejectBtn')!;
    const rejectReasonGroup = document.querySelector<HTMLDivElement>('#rejectReasonGroup')!;
    const rejectReason = document.querySelector<HTMLTextAreaElement>('#rejectReason')!;

    let currentReviewComponent: CodeComponent | null = null;

    const openReviewModal = (component: CodeComponent): void => {
        currentReviewComponent = component;
        rejectReasonGroup.style.display = 'none';
        rejectReason.value = '';
        
        reviewContent.innerHTML = `
            <img src="${component.image}" style="width: 100%; border-radius: 8px; margin-bottom: 1rem;">
            <h3>${component.name}</h3>
            <p><strong>תיאור:</strong> ${component.description}</p>
            <p><strong>קטגוריה:</strong> ${getCategoryName(component.category)}</p>
            <p><strong>מחיר:</strong> ${component.price} נקודות</p>
            <p><strong>מאת:</strong> ${component.authorName}</p>
            
            <div class="code-sections">
                <div class="code-section">
                    <h3>HTML</h3>
                    <pre>${escapeHtml(component.html)}</pre>
                </div>
                <div class="code-section">
                    <h3>CSS</h3>
                    <pre>${escapeHtml(component.css)}</pre>
                </div>
                ${component.js ? `
                    <div class="code-section">
                        <h3>JavaScript</h3>
                        <pre>${escapeHtml(component.js)}</pre>
                    </div>
                ` : ''}
            </div>
        `;
        
        reviewModal.classList.remove('hidden');
    };

    const escapeHtml = (text: string): string => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    reviewModalClose.onclick = (): void => {
        reviewModal.classList.add('hidden');
    };

    reviewModal.onclick = (e: MouseEvent): void => {
        if (e.target === reviewModal) {
            reviewModal.classList.add('hidden');
        }
    };

    approveBtn.onclick = (): void => {
        if (!currentReviewComponent) return;
        
        // Update component status
        currentReviewComponent.status = 'approved';
        currentReviewComponent.approvedAt = Date.now();
        storage.updateComponent(currentReviewComponent);
        
        // Convert pending points to available points
        const author: User | undefined = storage.getUserById(currentReviewComponent.authorId);
        if (author) {
            author.pointsPending -= 100;
            author.pointsAvailable += 100;
            storage.updateUser(author);
        }
        
        // Add activity
        const activity: ActivityLog = {
            id: storage.generateId(),
            type: 'approve',
            userId: currentUser.id,
            username: currentUser.username,
            description: `המנהל אישר את "${currentReviewComponent.name}" של ${currentReviewComponent.authorName}`,
            timestamp: Date.now()
        };
        storage.addActivity(activity);
        
        showToast('הרכיב אושר בהצלחה! ✅', 'success');
        reviewModal.classList.add('hidden');
        
        setTimeout((): void => {
            renderPendingComponents();
            updateOverviewStats();
        }, 1000);
    };

    rejectBtn.onclick = (): void => {
        rejectReasonGroup.style.display = 'block';
        
        // Create confirm button if doesn't exist
        let confirmRejectBtn = document.querySelector<HTMLButtonElement>('#confirmRejectBtn');
        if (!confirmRejectBtn) {
            confirmRejectBtn = document.createElement('button');
            confirmRejectBtn.id = 'confirmRejectBtn';
            confirmRejectBtn.className = 'btn btn-danger';
            confirmRejectBtn.style.marginTop = '1rem';
            confirmRejectBtn.textContent = 'אשר דחייה';
            rejectReasonGroup.appendChild(confirmRejectBtn);
            
            confirmRejectBtn.onclick = (): void => {
                if (!currentReviewComponent) return;
                
                const reason: string = rejectReason.value.trim();
                if (!reason) {
                    showToast('נא להזין סיבת דחייה', 'error');
                    return;
                }
                
                // Update component status
                currentReviewComponent.status = 'rejected';
                currentReviewComponent.rejectedReason = reason;
                storage.updateComponent(currentReviewComponent);
                
                // Remove pending points
                const author: User | undefined = storage.getUserById(currentReviewComponent.authorId);
                if (author) {
                    author.pointsPending -= 100;
                    storage.updateUser(author);
                }
                
                // Add activity
                const activity: ActivityLog = {
                    id: storage.generateId(),
                    type: 'reject',
                    userId: currentUser.id,
                    username: currentUser.username,
                    description: `המנהל דחה את "${currentReviewComponent.name}" של ${currentReviewComponent.authorName}`,
                    timestamp: Date.now()
                };
                storage.addActivity(activity);
                
                showToast('הרכיב נדחה', 'info');
                reviewModal.classList.add('hidden');
                
                setTimeout((): void => {
                    renderPendingComponents();
                    updateOverviewStats();
                }, 1000);
            };
        }
    };

    // All Components Table
    const allComponentsTable = document.querySelector<HTMLDivElement>('#allComponentsTable')!;

    // All Components pagination
    let allComponentsDisplayCount: number = 0;
    const ALL_COMPONENTS_PER_LOAD: number = 20;
    let allComponentsData: CodeComponent[] = [];
    let allComponentsTableBody: HTMLTableSectionElement | null = null;

    const renderAllComponents = (): void => {
        allComponentsData = storage.loadComponents();
        allComponentsDisplayCount = 0;
        
        allComponentsTable.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>שם</th>
                        <th>מחבר</th>
                        <th>קטגוריה</th>
                        <th>מחיר</th>
                        <th>דירוג</th>
                        <th>נרכש</th>
                        <th>סטטוס</th>
                        <th>מומלץ</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;
        
        allComponentsTableBody = allComponentsTable.querySelector('tbody');
        loadMoreAllComponents();
    };

    const loadMoreAllComponents = (): void => {
        if (!allComponentsTableBody) return;
        
        const start = allComponentsDisplayCount;
        const end = Math.min(start + ALL_COMPONENTS_PER_LOAD, allComponentsData.length);
        
        // Remove existing load more button
        const existingLoadMore = allComponentsTable.querySelector('.load-more-container');
        if (existingLoadMore) {
            allComponentsTable.removeChild(existingLoadMore);
        }
        
        // Add rows
        for (let i = start; i < end; i++) {
            const comp = allComponentsData[i];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${comp.name}</td>
                <td>${comp.authorName}</td>
                <td>${getCategoryName(comp.category)}</td>
                <td>${comp.price}</td>
                <td>⭐ ${comp.rating.toFixed(1)} (${comp.ratingsCount})</td>
                <td>${comp.purchaseCount}</td>
                <td>
                    ${comp.status === 'approved' ? '<span class="status-badge status-approved">מאושר</span>' : ''}
                    ${comp.status === 'pending' ? '<span class="status-badge status-pending">ממתין</span>' : ''}
                    ${comp.status === 'rejected' ? '<span class="status-badge status-rejected">נדחה</span>' : ''}
                </td>
                <td>
                    <button class="btn btn-sm ${comp.recommended ? 'btn-success' : 'btn-secondary'}" data-id="${comp.id}">
                        ${comp.recommended ? '👑 מומלץ' : 'סמן מומלץ'}
                    </button>
                </td>
            `;
            
            // Add click event for recommend toggle
            const recommendBtn = row.querySelector('button[data-id]') as HTMLButtonElement;
            if (recommendBtn) {
                recommendBtn.addEventListener('click', (): void => {
                    toggleRecommended(comp.id);
                });
            }
            allComponentsTableBody.appendChild(row);
        }
        
        allComponentsDisplayCount = end;
        
        // Add "Load More" button if there are more items
        if (allComponentsDisplayCount < allComponentsData.length) {
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
                    loadMoreAllComponents();
                });
            }
            
            allComponentsTable.appendChild(loadMoreContainer);
        }
    };

    // Toggle recommended status
    const toggleRecommended = (componentId: string): void => {
        const component = storage.getComponentById(componentId);
        if (!component) return;
        
        // Toggle recommended status
        component.recommended = !component.recommended;
        storage.updateComponent(component);
        
        // Show toast
        const message = component.recommended ? '👑 הרכיב סומן כמומלץ!' : 'הרכיב הוסר מהמומלצים';
        showToast(message, 'success');
        
        // Refresh the table
        renderAllComponents();
    };

    // Users Table
    const usersTable = document.querySelector<HTMLDivElement>('#usersTable')!;

    // Users pagination
    let usersDisplayCount: number = 0;
    const USERS_PER_LOAD: number = 20;
    let allUsersData: User[] = [];
    let usersTableBody: HTMLTableSectionElement | null = null;

    const renderUsers = (): void => {
        allUsersData = storage.getUsers();
        usersDisplayCount = 0;
        
        usersTable.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>שם משתמש</th>
                        <th>אימייל</th>
                        <th>נקודות זמינות</th>
                        <th>נקודות ממתינות</th>
                        <th>סה"כ צבר</th>
                        <th>סה"כ הוציא</th>
                        <th>תפקיד</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;
        
        usersTableBody = usersTable.querySelector('tbody');
        loadMoreUsers();
    };

    const loadMoreUsers = (): void => {
        if (!usersTableBody) return;
        
        const start = usersDisplayCount;
        const end = Math.min(start + USERS_PER_LOAD, allUsersData.length);
        
        // Remove existing load more button
        const existingLoadMore = usersTable.querySelector('.load-more-container');
        if (existingLoadMore) {
            usersTable.removeChild(existingLoadMore);
        }
        
        // Add rows
        for (let i = start; i < end; i++) {
            const user = allUsersData[i];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.pointsAvailable}</td>
                <td>${user.pointsPending}</td>
                <td>${user.totalEarned}</td>
                <td>${user.totalSpent}</td>
                <td>${user.isAdmin ? '🔐 מנהל' : '👤 משתמש'}</td>
            `;
            usersTableBody.appendChild(row);
        }
        
        usersDisplayCount = end;
        
        // Add "Load More" button if there are more items
        if (usersDisplayCount < allUsersData.length) {
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
                    loadMoreUsers();
                });
            }
            
            usersTable.appendChild(loadMoreContainer);
        }
    };

    // Activity Log
    const activityLog = document.querySelector<HTMLDivElement>('#activityLog')!;

    // Activity pagination
    let activityDisplayCount: number = 0;
    const ACTIVITY_PER_LOAD: number = 20;
    let allActivities: ActivityLog[] = [];

    const renderActivity = (): void => {
        allActivities = storage.loadLogs();
        activityDisplayCount = 0;
        activityLog.innerHTML = '';
        loadMoreActivity();
    };

    const loadMoreActivity = (): void => {
        const start = activityDisplayCount;
        const end = Math.min(start + ACTIVITY_PER_LOAD, allActivities.length);
        
        // Remove existing load more button
        const existingLoadMore = activityLog.querySelector('.load-more-container');
        if (existingLoadMore) {
            activityLog.removeChild(existingLoadMore);
        }
        
        // Add activities
        for (let i = start; i < end; i++) {
            const activity = allActivities[i];
            const item = document.createElement('div');
            item.className = 'activity-item';
            
            const date: Date = new Date(activity.timestamp);
            const dateStr: string = date.toLocaleDateString('he-IL') + ' ' + date.toLocaleTimeString('he-IL');
            
            item.innerHTML = `
                <div class="activity-time">${dateStr}</div>
                <div class="activity-desc">${activity.description}</div>
            `;
            
            activityLog.appendChild(item);
        }
        
        activityDisplayCount = end;
        
        // Add "Load More" button if there are more items
        if (activityDisplayCount < allActivities.length) {
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
                    loadMoreActivity();
                });
            }
            
            activityLog.appendChild(loadMoreContainer);
        }
    };

    // Auto-refresh stats every 5 seconds (setInterval requirement)
    let refreshInterval: number = setInterval((): void => {
        updateOverviewStats();
        // Don't auto-refresh tabs to preserve pagination state
    }, 5000);

    // Clean up interval when leaving page
    window.addEventListener('beforeunload', (): void => {
        clearInterval(refreshInterval);
    });

    // Initial render
    renderPendingComponents();
});
