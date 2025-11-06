// ========================================
// Authentication Logic
// ========================================

document.addEventListener('DOMContentLoaded', (): void => {
// Check if user is already logged in
const checkAuth = (): void => {
    try {
        // Make sure storage is loaded
        if (typeof storage === 'undefined') {
            return;
        }
        
        const currentUser: User | null = storage.getCurrentUser();
        if (currentUser) {
            window.location.href = 'pages/store.html';
        }
    } catch (error) {
        // Silent error handling
    }
};

checkAuth();

// Tab switching
const loginTab = document.querySelector<HTMLButtonElement>('#loginTab')!;
const registerTab = document.querySelector<HTMLButtonElement>('#registerTab')!;
const loginForm = document.querySelector<HTMLFormElement>('#loginForm')!;
const registerForm = document.querySelector<HTMLFormElement>('#registerForm')!;

loginTab.onclick = (e: MouseEvent): void => {
    e.preventDefault();
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
};

registerTab.onclick = (e: MouseEvent): void => {
    e.preventDefault();
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
};

// Login form validation
const loginUsernameError = document.querySelector<HTMLSpanElement>('#loginUsernameError')!;
const loginPasswordError = document.querySelector<HTMLSpanElement>('#loginPasswordError')!;

loginForm.onsubmit = (e: SubmitEvent): void => {
    e.preventDefault();
    
    const formData: FormData = new FormData(loginForm);
    const username: string = String(formData.get('username') ?? '').trim();
    const password: string = String(formData.get('password') ?? '');
    
    // Clear previous errors
    loginUsernameError.textContent = '';
    loginPasswordError.textContent = '';
    loginUsernameError.classList.remove('active');
    loginPasswordError.classList.remove('active');
    
    let hasError: boolean = false;
    
    if (!username) {
        loginUsernameError.textContent = 'שם משתמש או אימייל נדרש';
        loginUsernameError.classList.add('active');
        hasError = true;
    }
    
    if (!password) {
        loginPasswordError.textContent = 'סיסמה נדרשת';
        loginPasswordError.classList.add('active');
        hasError = true;
    }
    
    if (hasError) return;
    
    // Find user
    const user: User | undefined = storage.getUserByUsername(username) || storage.getUserByEmail(username);
    
    if (!user || user.password !== password) {
        showToast('שם משתמש או סיסמה שגויים', 'error');
        return;
    }
    
    // Login successful
    storage.setCurrentUser(user.id);
    
    const activity: ActivityLog = {
        id: storage.generateId(),
        type: 'register',
        userId: user.id,
        username: user.username,
        description: `${user.username} נכנס למערכת`,
        timestamp: Date.now()
    };
    storage.addActivity(activity);
    
    showToast('התחברת בהצלחה!', 'success');
    
    setTimeout((): void => {
        window.location.href = 'pages/store.html';
    }, 1000);
};

// Register form validation
const registerUsername = document.querySelector<HTMLInputElement>('#registerUsername')!;
const registerEmail = document.querySelector<HTMLInputElement>('#registerEmail')!;
const registerPassword = document.querySelector<HTMLInputElement>('#registerPassword')!;
const registerPasswordConfirm = document.querySelector<HTMLInputElement>('#registerPasswordConfirm')!;

const registerUsernameError = document.querySelector<HTMLSpanElement>('#registerUsernameError')!;
const registerEmailError = document.querySelector<HTMLSpanElement>('#registerEmailError')!;
const registerPasswordError = document.querySelector<HTMLSpanElement>('#registerPasswordError')!;
const registerPasswordConfirmError = document.querySelector<HTMLSpanElement>('#registerPasswordConfirmError')!;

// Real-time validation
registerUsername.oninput = (): void => {
    const value: string = registerUsername.value.trim();
    if (value && !USERNAME_REGEX.test(value)) {
        registerUsernameError.textContent = 'שם חייב להיות 2-20 תווים, עברית/אנגלית, מספרים ורווחים';
        registerUsernameError.classList.add('active');
    } else if (value && storage.getUserByUsername(value)) {
        registerUsernameError.textContent = 'שם משתמש כבר קיים';
        registerUsernameError.classList.add('active');
    } else {
        registerUsernameError.textContent = '';
        registerUsernameError.classList.remove('active');
    }
};

registerEmail.oninput = (): void => {
    const value: string = registerEmail.value.trim();
    if (value && !EMAIL_REGEX.test(value)) {
        registerEmailError.textContent = 'כתובת אימייל לא תקינה';
        registerEmailError.classList.add('active');
    } else if (value && storage.getUserByEmail(value)) {
        registerEmailError.textContent = 'אימייל כבר רשום';
        registerEmailError.classList.add('active');
    } else {
        registerEmailError.textContent = '';
        registerEmailError.classList.remove('active');
    }
};

registerPassword.oninput = (): void => {
    const value: string = registerPassword.value;
    if (value && !PASSWORD_REGEX.test(value)) {
        registerPasswordError.textContent = 'סיסמה חייבת לכלול לפחות 8 תווים, אות גדולה, אות קטנה, מספר ותו מיוחד';
        registerPasswordError.classList.add('active');
    } else {
        registerPasswordError.textContent = '';
        registerPasswordError.classList.remove('active');
    }
};

registerPasswordConfirm.oninput = (): void => {
    const password: string = registerPassword.value;
    const confirm: string = registerPasswordConfirm.value;
    if (confirm && password !== confirm) {
        registerPasswordConfirmError.textContent = 'הסיסמאות לא תואמות';
        registerPasswordConfirmError.classList.add('active');
    } else {
        registerPasswordConfirmError.textContent = '';
        registerPasswordConfirmError.classList.remove('active');
    }
};

registerForm.onsubmit = (e: SubmitEvent): void => {
    e.preventDefault();
    
    const formData: FormData = new FormData(registerForm);
    const username: string = String(formData.get('username') ?? '').trim();
    const email: string = String(formData.get('email') ?? '').trim();
    const password: string = String(formData.get('password') ?? '');
    const passwordConfirm: string = String(formData.get('passwordConfirm') ?? '');
    
    // Clear previous errors
    registerUsernameError.textContent = '';
    registerEmailError.textContent = '';
    registerPasswordError.textContent = '';
    registerPasswordConfirmError.textContent = '';
    registerUsernameError.classList.remove('active');
    registerEmailError.classList.remove('active');
    registerPasswordError.classList.remove('active');
    registerPasswordConfirmError.classList.remove('active');
    
    let hasError: boolean = false;
    
    // בדיקה שכל השדות מלאים
    if (!username) {
        registerUsernameError.textContent = 'שם משתמש נדרש';
        registerUsernameError.classList.add('active');
        hasError = true;
    } else if (!USERNAME_REGEX.test(username)) {
        registerUsernameError.textContent = 'שם לא תקין';
        registerUsernameError.classList.add('active');
        hasError = true;
    } else if (storage.getUserByUsername(username)) {
        registerUsernameError.textContent = 'שם משתמש כבר קיים';
        registerUsernameError.classList.add('active');
        hasError = true;
    }
    
    if (!email) {
        registerEmailError.textContent = 'אימייל נדרש';
        registerEmailError.classList.add('active');
        hasError = true;
    } else if (!EMAIL_REGEX.test(email)) {
        registerEmailError.textContent = 'אימייל לא תקין';
        registerEmailError.classList.add('active');
        hasError = true;
    } else if (storage.getUserByEmail(email)) {
        registerEmailError.textContent = 'אימייל כבר רשום';
        registerEmailError.classList.add('active');
        hasError = true;
    }
    
    if (!password) {
        registerPasswordError.textContent = 'סיסמה נדרשת';
        registerPasswordError.classList.add('active');
        hasError = true;
    } else if (!PASSWORD_REGEX.test(password)) {
        registerPasswordError.textContent = 'סיסמה לא תקינה';
        registerPasswordError.classList.add('active');
        hasError = true;
    }
    
    if (!passwordConfirm) {
        registerPasswordConfirmError.textContent = 'אישור סיסמה נדרש';
        registerPasswordConfirmError.classList.add('active');
        hasError = true;
    } else if (password !== passwordConfirm) {
        registerPasswordConfirmError.textContent = 'הסיסמאות לא תואמות';
        registerPasswordConfirmError.classList.add('active');
        hasError = true;
    }
    
    if (hasError) {
        showToast('נא למלא את כל השדות בצורה תקינה', 'error');
        return;
    }
    
    // Create new user
    const newUser: User = {
        id: storage.generateId(),
        username,
        email,
        password,
        pointsAvailable: 50, // Bonus points
        pointsPending: 0,
        totalEarned: 50,
        totalSpent: 0,
        isAdmin: false,
        createdAt: Date.now()
    };
    
    storage.addUser(newUser);
    storage.setCurrentUser(newUser.id);
    
    const activity: ActivityLog = {
        id: storage.generateId(),
        type: 'register',
        userId: newUser.id,
        username: newUser.username,
        description: `${newUser.username} הצטרף למערכת`,
        timestamp: Date.now()
    };
    storage.addActivity(activity);
    
    showToast('נרשמת בהצלחה! קיבלת 50 נקודות בונוס 🎉', 'success');
    
    setTimeout((): void => {
        window.location.href = 'pages/store.html';
    }, 1500);
};

// Toast notification
const showToast = (message: string, type: string = 'info'): void => {
    const toast = document.querySelector<HTMLDivElement>('#toast')!;
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout((): void => {
        toast.classList.remove('show');
    }, 3000);
};

});
