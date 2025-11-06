"use strict";
// Modern Modal System - Intel/Microsoft/Google Level! 🔥
// Show Upload Modal
function showUploadModal() {
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
    const cancelBtn = document.getElementById('cancelUploadBtn');
    if (cancelBtn) {
        cancelBtn.onclick = () => {
            closeModal();
        };
    }
    // Handle form submission
    const form = document.getElementById('uploadForm');
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
function createModal(options) {
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
    const closeBtn = modal.querySelector('#dynamicModalClose');
    if (closeBtn) {
        closeBtn.onclick = () => {
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
function showSuccessModal(options) {
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
        const okBtn = document.getElementById('successModalOkBtn');
        if (okBtn) {
            okBtn.onclick = () => {
                closeModal();
            };
        }
    }, 50);
}
// Close Modal
function closeModal() {
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
