// ========================================
// Type Definitions
// ========================================

interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    pointsAvailable: number;
    pointsPending: number;
    totalEarned: number;
    totalSpent: number;
    isAdmin: boolean;
    createdAt: number;
}

interface CodeComponent {
    id: string;
    name: string;
    description: string;
    category: string;
    image: string;
    price: number;
    html: string;
    css: string;
    js: string;
    authorId: string;
    authorName: string;
    status: ComponentStatus;
    rating: number;
    ratingsCount: number;
    purchaseCount: number;
    createdAt: number;
    approvedAt?: number;
    rejectedReason?: string;
    recommended?: boolean;  // Admin can mark component as recommended
}

type ComponentStatus = 'pending' | 'approved' | 'rejected';

interface Purchase {
    id: string;
    userId: string;
    componentId: string;
    price: number;
    timestamp: number;
}

interface PointsPurchase {
    id: string;
    userId: string;
    points: number;
    price: number;
    timestamp: number;
}

interface Rating {
    id: string;
    userId: string;
    componentId: string;
    rating: number;
    timestamp: number;
}

interface ActivityLog {
    id: string;
    type: ActivityType;
    userId: string;
    username: string;
    description: string;
    timestamp: number;
}

type ActivityType = 'register' | 'upload' | 'purchase' | 'rate' | 'approve' | 'reject' | 'buy_points';

interface AppData {
    users: User[];
    components: CodeComponent[];
    purchases: Purchase[];
    pointsPurchases: PointsPurchase[];
    ratings: Rating[];
    activities: ActivityLog[];
}

// Regex patterns
const USERNAME_REGEX: RegExp = /^[A-Za-z\u0590-\u05FF0-9 ]{2,20}$/;
const EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

// Global function declarations
declare function showToast(message: string, type?: string): void;

// Window global extensions
interface Window {
    Prism?: {
        highlightAll(): void;
    };
    copyCode?: (type: string) => void;
    showUploadModal?: () => void;
    closeModal?: () => void;
    showSuccessModal?: (options: SuccessModalOptions) => void;
    createModal?: (options: ModalOptions) => void;
    completePurchase?: (name: string, price: number, userPoints: number) => void;
    openBuyPointsModal?: () => void;
    showPremiumToast?: (message: string, type?: string, duration?: number) => void;
    elementrixPerf?: {
        monitor: unknown;
        cache: unknown;
        errors: unknown;
        analytics: unknown;
    };
}

interface ModalOptions {
    title: string;
    content: string;
    type?: string;
}

interface SuccessModalOptions {
    title: string;
    message: string;
}
