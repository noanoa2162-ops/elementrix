// Modern Modal System - Intel/Microsoft/Google Level! 🔥

// Show Upload Modal
function showUploadModal(): void {
    createModal({
        title: '📤 העלאת רכיב חדש',
        content: `
            <div class="upload-modal-content">
                <p class="modal-intro">שתף את הרכיבים המדהימים שלך עם הקהילה!</p>
                
                <form class="upload-form" id="uploadForm">
                    <div class="form-group">
                        <label>שם הרכיב</label>
                        <input type="text" name="name" placeholder="לדוגמה: כפתור מונפש" required>
                    </div>
                    
                    <div class="form-group">
                        <label>קטגוריה</label>
                        <select name="category" required>
                            <option value="">בחר קטגוריה</option>
                            <option value="buttons">🔘 כפתורים</option>
                            <option value="cards">🎴 כרטיסים</option>
                            <option value="forms">📝 טפסים</option>
                            <option value="menus">🍔 תפריטים</option>
                            <option value="animations">✨ אנימציות</option>
                            <option value="other">📦 אחר</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>תיאור</label>
                        <textarea name="description" placeholder="תאר את הרכיב..." rows="3" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>מחיר בנקודות</label>
                        <input type="number" name="price" placeholder="50" min="1" required>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-upload"></i> העלה רכיב
                        </button>
                        <button type="button" class="btn btn-ghost" id="cancelUploadBtn">
                            ביטול
                        </button>
                    </div>
                </form>
            </div>
        `,
        size: 'large'
    });
    
    // Handle cancel button
    const cancelBtn = document.getElementById('cancelUploadBtn') as HTMLButtonElement;
    if (cancelBtn) {
        cancelBtn.onclick = (): void => {
            closeModal();
        };
    }
    
    // Handle form submission
    const form = document.getElementById('uploadForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            
            showSuccessModal({
                title: '✅ הרכיב הועלה בהצלחה!',
                message: `הרכיב "${formData.get('name')}" נשלח לבדיקה.\n\nנודיע לך כאשר הוא יאושר ויפורסם בחנות.`
            });
        });
    }
}

// Create Modal Helper
interface ModalOptions {
    title: string;
    content: string;
    size?: 'small' | 'medium' | 'large';
    buttons?: Array<{text: string, action: () => void, className?: string}>;
}

function createModal(options: ModalOptions): HTMLElement {
    const existingModal = document.querySelector('.dynamic-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal dynamic-modal';
    modal.innerHTML = `
        <div class="modal-content modal-${options.size || 'medium'}">
            <button class="modal-close" id="dynamicModalClose">×</button>
            <div class="modal-header">
                <h2>${options.title}</h2>
            </div>
            <div class="modal-body">
                ${options.content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => modal.classList.add('active'), 10);
    
    // Close button
    const closeBtn = modal.querySelector('#dynamicModalClose') as HTMLButtonElement;
    if (closeBtn) {
        closeBtn.onclick = (): void => {
            closeModal();
        };
    }
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    return modal;
}

// Show Success Modal
interface SuccessModalOptions {
    title: string;
    message: string;
}

function showSuccessModal(options: SuccessModalOptions): void {
    closeModal(); // Close any existing modal
    
    createModal({
        title: options.title,
        content: `
            <div class="success-modal-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <p class="success-message">${options.message.replace(/\n/g, '<br>')}</p>
                <button class="btn btn-primary btn-lg" id="successModalOkBtn">
                    הבנתי
                </button>
            </div>
        `,
        size: 'small'
    });
    
    // Attach event to OK button
    setTimeout(() => {
        const okBtn = document.getElementById('successModalOkBtn') as HTMLButtonElement;
        if (okBtn) {
            okBtn.onclick = (): void => {
                closeModal();
            };
        }
    }, 50);
}

// Close Modal
function closeModal(): void {
    const modals = document.querySelectorAll('.dynamic-modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
}

// Make functions globally available
window.showUploadModal = showUploadModal;
window.closeModal = closeModal;
window.showSuccessModal = showSuccessModal;
window.createModal = createModal;
