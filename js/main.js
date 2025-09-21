// ===== CORE WEBSITE - OPTIMIZED JAVASCRIPT =====

// Performance optimized variables
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let targetMouseX = mouseX;
let targetMouseY = mouseY;
let animationId;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeCursor();
    initializeNavbar();
    initializeStars();
    initializeNavigation();
});

// Simplified Cursor System
function initializeCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;
    
    cursor.style.left = '50%';
    cursor.style.top = '50%';
    cursor.style.opacity = '0';
    
    // Smooth cursor movement
    function updateCursor() {
        mouseX += (targetMouseX - mouseX) * 0.1;
        mouseY += (targetMouseY - mouseY) * 0.1;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        cursor.style.opacity = '1';
        
        requestAnimationFrame(updateCursor);
    }
    
    updateCursor();
    
    // Mouse move handler
    document.addEventListener('mousemove', (e) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
    }, { passive: true });
    
    // Hover effects
    const logo = document.querySelector('.core-logo');
    if (logo) {
        logo.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        logo.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    }
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
    document.addEventListener('mouseenter', () => {
        document.body.style.cursor = 'none';
        cursor.style.opacity = '1';
    });
}

// Simplified Navbar System
function initializeNavbar() {
    const navbar = document.querySelector('.sci-fi-nav');
    if (!navbar) return;
    
    let lastScrollY = 0;
    let isHidden = false;
    
    // Slide in animation
    setTimeout(() => {
        navbar.style.transform = 'translateX(-50%) translateY(0px)';
    }, 500);
    
    // Scroll hiding
    function handleScroll() {
        const currentY = window.scrollY;
        
        if (currentY > 100 && currentY > lastScrollY && !isHidden) {
            navbar.style.transform = 'translateX(-50%) translateY(-60px)';
            isHidden = true;
        } else if (currentY < lastScrollY && isHidden) {
            navbar.style.transform = 'translateX(-50%) translateY(0px)';
            isHidden = false;
        }
        
        lastScrollY = currentY;
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Ultra Simplified Stars System
function initializeStars() {
    const container = document.getElementById('starsContainer');
    if (!container) return;
    
    const numStars = 100; // Reduced for performance
    const stars = [];
    
    // Create stars
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random size
        const size = Math.random();
        if (size > 0.9) star.classList.add('large');
        else if (size < 0.3) star.classList.add('small');
        
        // Random position
        star.style.left = Math.random() * window.innerWidth + 'px';
        star.style.top = Math.random() * window.innerHeight + 'px';
        
        // Store properties
        star.originalX = parseFloat(star.style.left);
        star.originalY = parseFloat(star.style.top);
        star.offsetX = 0;
        star.offsetY = 0;
        
        container.appendChild(star);
        stars.push(star);
    }
    
    // Simple animation
    function animateStars() {
        stars.forEach(star => {
            const dx = mouseX - star.originalX;
            const dy = mouseY - star.originalY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                const angle = Math.atan2(dy, dx);
                star.offsetX = -Math.cos(angle) * force * 20;
                star.offsetY = -Math.sin(angle) * force * 20;
            } else {
                star.offsetX *= 0.9;
                star.offsetY *= 0.9;
            }
            
            star.style.transform = `translate(${star.offsetX}px, ${star.offsetY}px)`;
        });
        
        requestAnimationFrame(animateStars);
    }
    
    animateStars();
}

// Smooth Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: Math.max(0, offsetTop),
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Live Stats System - Simplified
class LiveStats {
    constructor() {
        this.contractAddress = '4FdojUmXeaFMBG6yUaoufAC5Bz7u9AwnSAMizkx5pump';
        this.updateInterval = 30000;
        this.init();
    }
    
    init() {
        this.updateStats();
        setInterval(() => this.updateStats(), this.updateInterval);
    }
    
    async updateStats() {
        try {
            // Simplified API call
            const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${this.contractAddress}`);
            const data = await response.json();
            
            if (data.pairs && data.pairs.length > 0) {
                const pair = data.pairs[0];
                this.updateDisplay({
                    price: parseFloat(pair.priceUsd || 0),
                    marketCap: parseFloat(pair.fdv || 0),
                    volume24h: parseFloat(pair.volume?.h24 || 0)
                });
            }
        } catch (error) {
            console.warn('Stats update failed:', error);
        }
    }
    
    updateDisplay(data) {
        const priceElement = document.getElementById('price-value');
        const mcapElement = document.getElementById('mcap-value');
        const volumeElement = document.getElementById('volume-value');
        
        if (priceElement && data.price > 0) {
            priceElement.textContent = '$' + this.formatPrice(data.price);
        }
        
        if (mcapElement && data.marketCap > 0) {
            mcapElement.textContent = '$' + this.formatNumber(data.marketCap);
        }
        
        if (volumeElement && data.volume24h > 0) {
            volumeElement.textContent = '$' + this.formatNumber(data.volume24h);
        }
    }
    
    formatNumber(num) {
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toLocaleString();
    }
    
    formatPrice(price) {
        if (price < 0.001) return price.toFixed(8);
        if (price < 1) return price.toFixed(6);
        return price.toFixed(4);
    }
}

// Initialize components when page loads
window.addEventListener('load', () => {
    // Ensure page starts at top
    window.scrollTo(0, 0);
    
    // Initialize stats
    new LiveStats();
    
    // Initialize other components with delay for performance
    setTimeout(() => {
        if (window.CoreCarousel) new CoreCarousel();
        if (window.ArtGallery) window.artGallery = new ArtGallery();
    }, 1000);
});

// Copy contract function
function copyContract() {
    const contractAddress = '4FdojUmXeaFMBG6yUaoufAC5Bz7u9AwnSAMizkx5pump';
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(contractAddress).then(() => {
            showCopyFeedback();
        }).catch(() => {
            fallbackCopy(contractAddress);
        });
    } else {
        fallbackCopy(contractAddress);
    }
}

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyFeedback();
    } catch (err) {
        console.error('Copy failed:', err);
    }
    
    document.body.removeChild(textArea);
}

function showCopyFeedback() {
    const buttons = document.querySelectorAll('.copy-button, .copy-button-footer');
    buttons.forEach(button => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = 'rgba(34, 197, 94, 0.2)';
        button.style.borderColor = 'rgba(34, 197, 94, 0.4)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.style.borderColor = '';
        }, 2000);
    });
}

// Loader System - Enhanced with Date Counter
function initLoader() {
    const loaderOverlay = document.getElementById('loaderOverlay');
    const loaderEnterButton = document.getElementById('loaderEnterButton');
    const muteToggle = document.getElementById('muteToggle');
    const video = document.querySelector('.video-frame video');
    
    if (!loaderOverlay || !loaderEnterButton) return;
    
    // Initialize date counter
    initDateCounter();
    
    // Show enter button after 2 seconds
    setTimeout(() => {
        loaderEnterButton.classList.add('show');
    }, 2000);
    
    // Handle mute toggle
    if (muteToggle && video) {
        muteToggle.addEventListener('click', () => {
            if (video.muted) {
                video.muted = false;
                muteToggle.textContent = '🔊';
            } else {
                video.muted = true;
                muteToggle.textContent = '🔇';
            }
        });
    }
    
    // Handle enter button click
    loaderEnterButton.addEventListener('click', () => {
        document.body.classList.remove('loading');
        loaderOverlay.style.display = 'none';
        
        // Unmute video for main site if it was unmuted in loader
        if (video && !video.muted) {
            document.querySelectorAll('video').forEach(v => {
                v.muted = false;
            });
        }
    });
}

// Date Counter with Infinity Animation
function initDateCounter() {
    const dayElement = document.getElementById('dateDay');
    const monthElement = document.getElementById('dateMonth');
    const yearElement = document.getElementById('dateYear');
    
    if (!dayElement || !monthElement || !yearElement) return;
    
    // Start with infinity symbols
    dayElement.textContent = '∞';
    monthElement.textContent = '∞';
    yearElement.textContent = '∞';
    
    // After 1 second, start counting to current date
    setTimeout(() => {
        const now = new Date();
        const targetDay = String(now.getDate()).padStart(2, '0');
        const targetMonth = String(now.getMonth() + 1).padStart(2, '0');
        const targetYear = String(now.getFullYear());
        
        // Animate day
        animateToNumber(dayElement, targetDay, 500);
        
        // Animate month (delayed)
        setTimeout(() => {
            animateToNumber(monthElement, targetMonth, 500);
        }, 300);
        
        // Animate year (delayed)
        setTimeout(() => {
            animateToNumber(yearElement, targetYear, 800);
        }, 600);
        
    }, 1000);
}

// Animate number counting
function animateToNumber(element, targetValue, duration) {
    const steps = 10;
    const stepDuration = duration / steps;
    let currentStep = 0;
    
    const interval = setInterval(() => {
        currentStep++;
        
        if (currentStep === steps) {
            element.textContent = targetValue;
            clearInterval(interval);
        } else {
            // Show random numbers during animation
            const randomNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
            element.textContent = randomNum;
        }
    }, stepDuration);
}

// Initialize loader
window.addEventListener('load', initLoader);
