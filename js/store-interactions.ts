// ========================================
// 🎨 STORE PAGE - UI INTERACTIONS
// All interactive JavaScript extracted from store.html
// ========================================

document.addEventListener('DOMContentLoaded', (): void => {
    // ========================================
    // 💰 Price Filter Range Slider
    // ========================================
    const priceFilter = document.getElementById('priceFilter') as HTMLInputElement | null;
    const priceValue = document.getElementById('priceValue') as HTMLSpanElement | null;
    
    if (priceFilter && priceValue) {
        priceFilter.addEventListener('input', (e: Event): void => {
            const target = e.target as HTMLInputElement;
            priceValue.textContent = target.value;
        });
    }

    // ========================================
    // 🔄 Reset Filters Button
    // ========================================
    const resetBtn = document.getElementById('resetFilters') as HTMLButtonElement | null;
    if (resetBtn) {
        resetBtn.addEventListener('click', (): void => {
            const categoryFilter = document.getElementById('categoryFilter') as HTMLSelectElement | null;
            const sortFilter = document.getElementById('sortFilter') as HTMLSelectElement | null;
            
            if (categoryFilter) categoryFilter.value = '';
            if (sortFilter) sortFilter.value = 'newest';
            if (priceFilter && priceValue) {
                priceFilter.value = '500';
                priceValue.textContent = '500';
            }
            // Trigger filter update
            if (categoryFilter) {
                categoryFilter.dispatchEvent(new Event('change'));
            }
        });
    }

    // ========================================
    // ✨ Hero Particles Generation
    // ========================================
    const particlesContainer = document.getElementById('heroParticles') as HTMLDivElement | null;
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: ${Math.random() > 0.5 ? '#C8102E' : '#D4AF37'};
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.3 + 0.1};
                animation: particleFloat ${Math.random() * 10 + 15}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // ========================================
    // 🔥 Typing Effect Animation
    // ========================================
    const typingText = document.getElementById('typingText') as HTMLSpanElement | null;
    const texts: string[] = ['רכיבי קוד מוכנים', 'עיצובים מטורפים', 'קוד איכותי', 'חסוך זמן'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect(): void {
        if (!typingText) return;
        
        const currentText: string = texts[textIndex];
        
        if (!isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(typeEffect, 2000);
                return;
            }
        } else {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
        }
        
        setTimeout(typeEffect, isDeleting ? 50 : 150);
    }
    
    if (typingText) {
        setTimeout(typeEffect, 500);
    }

    // ========================================
    // 🎨 Interactive Canvas with Particles
    // ========================================
    const canvas = document.getElementById('heroCanvas') as HTMLCanvasElement | null;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: Particle[] = [];
        const particleCount = 50;

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            color: string;

            constructor() {
                this.x = 0;
                this.y = 0;
                this.size = 0;
                this.speedX = 0;
                this.speedY = 0;
                this.color = '';
                this.reset();
            }
            
            reset(): void {
                if (!canvas) return;
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
                this.color = Math.random() > 0.5 ? '#C8102E' : '#D4AF37';
            }
            
            update(mouseX: number, mouseY: number): void {
                if (!canvas) return;
                // Move towards mouse
                const dx: number = mouseX - this.x;
                const dy: number = mouseY - this.y;
                const distance: number = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.x -= dx / 50;
                    this.y -= dy / 50;
                } else {
                    this.x += this.speedX;
                    this.y += this.speedY;
                }
                
                if (this.x < 0 || this.x > canvas!.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas!.height) this.speedY *= -1;
            }
            
            draw(): void {
                if (!ctx) return;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        let mouseX: number = canvas.width / 2;
        let mouseY: number = canvas.height / 2;

        canvas.addEventListener('mousemove', (e: MouseEvent): void => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        function animate(): void {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((particle: Particle): void => {
                particle.update(mouseX, mouseY);
                particle.draw();
            });
            
            // Draw connections
            particles.forEach((p1: Particle, i: number): void => {
                particles.slice(i + 1).forEach((p2: Particle): void => {
                    const dx: number = p1.x - p2.x;
                    const dy: number = p1.y - p2.y;
                    const distance: number = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100 && ctx) {
                        ctx.strokeStyle = `rgba(200, 16, 46, ${1 - distance / 100})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();

        window.addEventListener('resize', (): void => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // ========================================
    // 💫 3D Tilt Effect on Cards
    // ========================================
    const cards3d = document.querySelectorAll('[data-tilt]');
    cards3d.forEach((card: Element): void => {
        const cardElement = card as HTMLElement;
        
        cardElement.addEventListener('mousemove', (e: MouseEvent): void => {
            const rect = cardElement.getBoundingClientRect();
            const x: number = e.clientX - rect.left;
            const y: number = e.clientY - rect.top;
            
            const centerX: number = rect.width / 2;
            const centerY: number = rect.height / 2;
            
            const rotateX: number = (y - centerY) / 10;
            const rotateY: number = (centerX - x) / 10;
            
            cardElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            
            const shine = cardElement.querySelector('.card-3d-shine') as HTMLElement | null;
            if (shine) {
                shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.3), transparent)`;
            }
        });
        
        cardElement.addEventListener('mouseleave', (): void => {
            cardElement.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // ========================================
    // 🎯 Hero Explore Button - Smooth Scroll
    // ========================================
    const exploreBtn = document.getElementById('exploreBtn') as HTMLButtonElement | null;
    if (exploreBtn) {
        exploreBtn.addEventListener('click', (): void => {
            const grid = document.getElementById('componentsGrid');
            if (grid) {
                grid.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ========================================
    // 💰 Coins Particles Effect on Hover
    // ========================================
    const premiumPoints = document.querySelector('.premium-points') as HTMLElement | null;
    if (premiumPoints) {
        premiumPoints.addEventListener('mouseenter', (): void => {
            const coinsParticles = premiumPoints.querySelector('.coins-particles') as HTMLElement | null;
            if (coinsParticles) {
                // Clear previous particles
                coinsParticles.innerHTML = '';
                
                // Create 8 coin particles
                for (let i = 0; i < 8; i++) {
                    const coin = document.createElement('div');
                    const angle: number = (i / 8) * Math.PI * 2;
                    const distance = 30;
                    const x: number = Math.cos(angle) * distance;
                    const y: number = Math.sin(angle) * distance;
                    
                    coin.style.cssText = `
                        position: absolute;
                        width: 10px;
                        height: 10px;
                        background: linear-gradient(135deg, #D4AF37, #FFD700);
                        border-radius: 50%;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        animation: coinExplode 0.6s ease-out forwards;
                        animation-delay: ${i * 0.05}s;
                        --tx: ${x}px;
                        --ty: ${y}px;
                    `;
                    coinsParticles.appendChild(coin);
                    
                    setTimeout((): void => coin.remove(), 800);
                }
            }
        });
    }
});
