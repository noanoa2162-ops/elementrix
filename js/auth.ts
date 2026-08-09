// ========================================
// Local demo profile selection
// ========================================

document.addEventListener('DOMContentLoaded', (): void => {
    const currentUser: User | null = storage.getCurrentUser();
    if (currentUser) {
        window.location.href = 'pages/store.html';
        return;
    }

    const loginTab = document.querySelector<HTMLButtonElement>('#loginTab')!;
    const registerTab = document.querySelector<HTMLButtonElement>('#registerTab')!;
    const loginForm = document.querySelector<HTMLFormElement>('#loginForm')!;
    const registerForm = document.querySelector<HTMLFormElement>('#registerForm')!;

    loginTab.onclick = (event: MouseEvent): void => {
        event.preventDefault();
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    };

    registerTab.onclick = (event: MouseEvent): void => {
        event.preventDefault();
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    };

    const loginUsernameError = document.querySelector<HTMLSpanElement>('#loginUsernameError')!;

    loginForm.onsubmit = (event: SubmitEvent): void => {
        event.preventDefault();
        const formData: FormData = new FormData(loginForm);
        const identifier: string = String(formData.get('username') ?? '').trim();

        loginUsernameError.textContent = '';
        loginUsernameError.classList.remove('active');

        if (!identifier) {
            loginUsernameError.textContent = 'שם פרופיל או אימייל נדרש';
            loginUsernameError.classList.add('active');
            return;
        }

        const user: User | undefined = storage.getUserByUsername(identifier) || storage.getUserByEmail(identifier);
        if (!user) {
            showToast('הפרופיל לא נמצא. אפשר ליצור פרופיל דמו חדש.', 'error');
            return;
        }

        storage.setCurrentUser(user.id);
        storage.addActivity({
            id: storage.generateId(),
            type: 'login',
            userId: user.id,
            username: user.username,
            description: `${user.username} בחר בפרופיל הדמו`,
            timestamp: Date.now()
        });

        showToast('פרופיל הדמו נטען בהצלחה', 'success');
        setTimeout((): void => {
            window.location.href = 'pages/store.html';
        }, 700);
    };

    const registerUsername = document.querySelector<HTMLInputElement>('#registerUsername')!;
    const registerEmail = document.querySelector<HTMLInputElement>('#registerEmail')!;
    const registerUsernameError = document.querySelector<HTMLSpanElement>('#registerUsernameError')!;
    const registerEmailError = document.querySelector<HTMLSpanElement>('#registerEmailError')!;

    registerUsername.oninput = (): void => {
        const value: string = registerUsername.value.trim();
        const message: string = value && !USERNAME_REGEX.test(value)
            ? 'שם חייב להיות 2–20 תווים בעברית או באנגלית'
            : value && storage.getUserByUsername(value)
                ? 'שם הפרופיל כבר קיים'
                : '';
        registerUsernameError.textContent = message;
        registerUsernameError.classList.toggle('active', Boolean(message));
    };

    registerEmail.oninput = (): void => {
        const value: string = registerEmail.value.trim();
        const message: string = value && !EMAIL_REGEX.test(value)
            ? 'כתובת אימייל לא תקינה'
            : value && storage.getUserByEmail(value)
                ? 'האימייל כבר משויך לפרופיל דמו'
                : '';
        registerEmailError.textContent = message;
        registerEmailError.classList.toggle('active', Boolean(message));
    };

    registerForm.onsubmit = (event: SubmitEvent): void => {
        event.preventDefault();
        const formData: FormData = new FormData(registerForm);
        const username: string = String(formData.get('username') ?? '').trim();
        const email: string = String(formData.get('email') ?? '').trim();

        const usernameMessage: string = !USERNAME_REGEX.test(username)
            ? 'שם הפרופיל אינו תקין'
            : storage.getUserByUsername(username)
                ? 'שם הפרופיל כבר קיים'
                : '';
        const emailMessage: string = !EMAIL_REGEX.test(email)
            ? 'כתובת האימייל אינה תקינה'
            : storage.getUserByEmail(email)
                ? 'האימייל כבר משויך לפרופיל דמו'
                : '';

        registerUsernameError.textContent = usernameMessage;
        registerUsernameError.classList.toggle('active', Boolean(usernameMessage));
        registerEmailError.textContent = emailMessage;
        registerEmailError.classList.toggle('active', Boolean(emailMessage));

        if (usernameMessage || emailMessage) {
            showToast('נא לתקן את פרטי פרופיל הדמו', 'error');
            return;
        }

        const newUser: User = {
            id: storage.generateId(),
            username,
            email,
            pointsAvailable: 50,
            pointsPending: 0,
            totalEarned: 50,
            totalSpent: 0,
            isAdmin: false,
            createdAt: Date.now()
        };

        storage.addUser(newUser);
        storage.setCurrentUser(newUser.id);
        storage.addActivity({
            id: storage.generateId(),
            type: 'register',
            userId: newUser.id,
            username: newUser.username,
            description: `${newUser.username} יצר פרופיל דמו`,
            timestamp: Date.now()
        });

        showToast('פרופיל הדמו נוצר וקיבל 50 נקודות', 'success');
        setTimeout((): void => {
            window.location.href = 'pages/store.html';
        }, 900);
    };

    const showToast = (message: string, type: string = 'info'): void => {
        const toast = document.querySelector<HTMLDivElement>('#toast')!;
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        setTimeout((): void => toast.classList.remove('show'), 3000);
    };
});
