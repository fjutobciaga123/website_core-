// Aura Carousel - Replica of AuraFarm website carousel
class AuraCarousel {
    constructor() {
        this.carouselScroll = document.getElementById('carouselScroll');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentIndex = 0;
        this.cards = [];
        this.visibleCards = []; // Array of currently visible 5 cards
        this.centerIndex = 2; // Always keep index 2 as center/active
        
        // Profile data extracted from original website
        this.profiles = [
            {
                name: "Jays",
                handle: "@JaysWASD",
                image: "https://via.placeholder.com/224x300/333/fff?text=Jays",
                color: "#948D7B",
                url: "https://x.com/JaysWASD"
            },
            {
                name: "Maniac",
                handle: "@maniacdotsol",
                image: "https://via.placeholder.com/224x300/333/fff?text=Maniac",
                color: "#F15407",
                url: "https://x.com/maniacdotsol"
            },
            {
                name: "Exy",
                handle: "@eth_exy",
                image: "https://via.placeholder.com/224x300/333/fff?text=Exy",
                color: "#F9BD3D",
                url: "https://x.com/eth_exy"
            },
            {
                name: "Ved",
                handle: "@notvedgpt",
                image: "https://via.placeholder.com/224x300/333/fff?text=Ved",
                color: "#DE1B6C",
                url: "https://x.com/notvedgpt"
            },
            {
                name: "PARCELS",
                handle: "@Parcels_A",
                image: "https://via.placeholder.com/224x300/333/fff?text=PARCELS",
                color: "#FF3900",
                url: "https://x.com/Parcels_A"
            },
            {
                name: "Wrld",
                handle: "@wrld_sol",
                image: "https://via.placeholder.com/224x300/333/fff?text=Wrld",
                color: "#35c0e0",
                url: "https://x.com/wrld_sol"
            },
            {
                name: "brah",
                handle: "@unnattybrah",
                image: "https://via.placeholder.com/224x300/333/fff?text=brah",
                color: "#8C1AB4",
                url: "https://x.com/unnattybrah"
            },
            {
                name: "Market Watcher",
                handle: "@watchingmarkets",
                image: "https://via.placeholder.com/224x300/333/fff?text=MW",
                color: "#EAA60A",
                url: "https://x.com/watchingmarkets"
            },
            {
                name: "JOJI",
                handle: "@metaversejoji",
                image: "https://via.placeholder.com/224x300/333/fff?text=JOJI",
                color: "#f339f9",
                url: "https://x.com/metaversejoji"
            },
            {
                name: "FOMO",
                handle: "@fomomofosol",
                image: "https://via.placeholder.com/224x300/333/fff?text=FOMO",
                color: "#35c0e0",
                url: "https://x.com/fomomofosol"
            },
            {
                name: "Orangie",
                handle: "@orangie",
                image: "https://via.placeholder.com/224x300/333/fff?text=Orangie",
                color: "#CA4011",
                url: "https://x.com/orangie"
            },
            {
                name: "Pow",
                handle: "@traderpow",
                image: "https://via.placeholder.com/224x300/333/fff?text=Pow",
                color: "#0320c4",
                url: "https://x.com/traderpow"
            },
            {
                name: "Mikey",
                handle: "@MikeyTrading",
                image: "https://via.placeholder.com/224x300/333/fff?text=Mikey",
                color: "#FAE792",
                url: "https://x.com/MikeyTrading"
            },
            {
                name: "Bounty",
                handle: "@solbountyy",
                image: "https://via.placeholder.com/224x300/333/fff?text=Bounty",
                color: "#9536D8",
                url: "https://x.com/solbountyy"
            },
            {
                name: "ricky",
                handle: "@rickymferr",
                image: "https://via.placeholder.com/224x300/333/fff?text=ricky",
                color: "#A12AB4",
                url: "https://x.com/rickymferr"
            },
            {
                name: "ktrades",
                handle: "@kttradesx",
                image: "https://via.placeholder.com/224x300/333/fff?text=ktrades",
                color: "#F03306",
                url: "https://x.com/kttradesx"
            },
            {
                name: "slingoor",
                handle: "@slingdeez",
                image: "https://via.placeholder.com/224x300/333/fff?text=slingoor",
                color: "#1D39AF",
                url: "https://x.com/slingdeez"
            },
            {
                name: "AFFU",
                handle: "@lethal_affu",
                image: "https://via.placeholder.com/224x300/333/fff?text=AFFU",
                color: "#da2f20",
                url: "https://x.com/lethal_affu"
            },
            {
                name: "Moonpie",
                handle: "@mushmoonz",
                image: "https://via.placeholder.com/224x300/333/fff?text=Moonpie",
                color: "#C8079D",
                url: "https://x.com/mushmoonz"
            },
            {
                name: "Ansem",
                handle: "@blknoiz06",
                image: "https://via.placeholder.com/224x300/333/fff?text=Ansem",
                color: "#4D96DB",
                url: "https://x.com/blknoiz06"
            },
            {
                name: "Kikcharts",
                handle: "@kikcharts",
                image: "https://via.placeholder.com/224x300/333/fff?text=Kikcharts",
                color: "#CE8B02",
                url: "https://x.com/kikcharts"
            },
            {
                name: "Pyro",
                handle: "@itspyrored",
                image: "https://via.placeholder.com/224x300/333/fff?text=Pyro",
                color: "#841E01",
                url: "https://x.com/itspyrored"
            }
        ];
        
        this.init();
    }
    
    init() {
        this.createCards();
        this.setInitialView();
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        this.setupTouchNavigation();
        this.startAutoPlay(); // Start auto-play automatically
    }
    
    createCards() {
        this.carouselScroll.innerHTML = '';
        this.cards = [];
        
        // Initialize with first 5 profiles (indices 0-4)
        this.visibleCards = [0, 1, 2, 3, 4];
        
        this.visibleCards.forEach((profileIndex, cardPosition) => {
            const profile = this.profiles[profileIndex];
            const card = this.createCard(profile, cardPosition, profileIndex);
            this.carouselScroll.appendChild(card);
            this.cards.push(card);
        });
    }
    
    setInitialView() {
        // Set middle card (index 2) as active
        this.setActiveCard(this.centerIndex);
    }
    
    createCard(profile, cardPosition, profileIndex) {
        const card = document.createElement('div');
        card.className = 'profile-card';
        card.setAttribute('role', 'option');
        card.setAttribute('aria-selected', 'false');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `${profile.name} by ${profile.handle}`);
        card.setAttribute('data-position', cardPosition);
        card.setAttribute('data-profile-index', profileIndex);
        
        card.innerHTML = `
            <div class="image-container">
                <img 
                    alt="${profile.name} profile" 
                    loading="lazy" 
                    decoding="async" 
                    class="profile-image" 
                    src="${profile.image}"
                    onerror="this.src='https://via.placeholder.com/224x300/1a1b23/fff?text=${encodeURIComponent(profile.name)}'"
                />
            </div>
            <div class="profile-info">
                <div class="profile-name">${profile.name}</div>
                <a href="${profile.url}" target="_blank" rel="noopener noreferrer" class="profile-handle" aria-label="Visit ${profile.handle}'s Twitter profile">${profile.handle}</a>
            </div>
        `;
        
        // Add click listener for card selection
        card.addEventListener('click', () => {
            this.moveToCenter(cardPosition);
        });
        
        return card;
    }
    
    setActiveCard(cardPosition) {
        // Remove active class from all cards
        this.cards.forEach((card, i) => {
            card.classList.remove('active');
            card.setAttribute('aria-selected', 'false');
        });
        
        // Add active class to selected card
        if (this.cards[cardPosition]) {
            this.cards[cardPosition].classList.add('active');
            this.cards[cardPosition].setAttribute('aria-selected', 'true');
        }
    }
    
    moveToCenter(targetPosition) {
        if (targetPosition === this.centerIndex) return; // Already centered
        
        // Calculate the shortest rotation path
        let steps = targetPosition - this.centerIndex;
        
        // Handle wrapping
        if (Math.abs(steps) > this.profiles.length / 2) {
            steps = steps > 0 ? steps - this.profiles.length : steps + this.profiles.length;
        }
        
        // Directly update to target position
        for (let i = 0; i < Math.abs(steps); i++) {
            if (steps > 0) {
                this.nextCard();
            } else {
                this.prevCard();
            }
        }
    }
    
    updateCardsDisplay() {
        // Add slide animation - temporarily slide all cards out
        this.cards.forEach((card, cardPosition) => {
            // Determine slide direction based on card position relative to center
            if (cardPosition < 2) {
                card.classList.add('slide-left');
            } else if (cardPosition > 2) {
                card.classList.add('slide-right');
            } else {
                card.classList.add('slide-left'); // Center card slides left temporarily
            }
        });
        
        // After slide-out animation, update content and slide back in
        setTimeout(() => {
            // Update each card with new profile data
            this.cards.forEach((card, cardPosition) => {
                const profileIndex = this.visibleCards[cardPosition];
                const profile = this.profiles[profileIndex];
                
                // Update card content
                const img = card.querySelector('.profile-image');
                const name = card.querySelector('.profile-name');
                const handle = card.querySelector('.profile-handle');
                
                img.src = profile.image;
                img.alt = `${profile.name} profile`;
                img.onerror = () => {
                    img.src = `https://via.placeholder.com/224x300/1a1b23/fff?text=${encodeURIComponent(profile.name)}`;
                };
                
                name.textContent = profile.name;
                name.style.color = profile.color;
                handle.textContent = profile.handle;
                handle.href = profile.url;
                handle.setAttribute('aria-label', `Visit ${profile.handle}'s Twitter profile`);
                
                card.setAttribute('aria-label', `${profile.name} by ${profile.handle}`);
                card.setAttribute('data-profile-index', profileIndex);
                
                // Update active state
                if (cardPosition === this.centerIndex) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
            
            // Slide cards back to center
            setTimeout(() => {
                this.cards.forEach(card => {
                    card.classList.remove('slide-left', 'slide-right');
                    card.classList.add('slide-center');
                });
            }, 50);
        }, 400); // Half of the transition duration
    }

    nextCard() {
        // Shift all visible cards to the left (remove first, add new at end)
        const firstCard = this.visibleCards.shift();
        const nextProfileIndex = (this.visibleCards[this.visibleCards.length - 1] + 1) % this.profiles.length;
        this.visibleCards.push(nextProfileIndex);
        
        this.updateCardsDisplay();
    }
    
    prevCard() {
        // Shift all visible cards to the right (remove last, add new at beginning)
        const lastCard = this.visibleCards.pop();
        const prevProfileIndex = (this.visibleCards[0] - 1 + this.profiles.length) % this.profiles.length;
        this.visibleCards.unshift(prevProfileIndex);
        
        this.updateCardsDisplay();
    }
    
    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => {
            this.prevCard();
            this.pauseAutoPlay();
        });
        
        this.nextBtn.addEventListener('click', () => {
            this.nextCard();
            this.pauseAutoPlay();
        });
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevCard();
                this.pauseAutoPlay();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextCard();
                this.pauseAutoPlay();
            }
        });
        
        // Card focus navigation
        this.cards.forEach((card, cardPosition) => {
            card.addEventListener('keydown', (e) => {
                if ((e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    this.moveToCenter(cardPosition);
                    this.pauseAutoPlay();
                }
            });
        });
    }
    
    setupTouchNavigation() {
        let startX = 0;
        let isDragging = false;
        
        this.carouselScroll.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });
        
        this.carouselScroll.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.nextCard(); // Swipe left - next card
                } else {
                    this.prevCard(); // Swipe right - prev card
                }
                this.pauseAutoPlay();
            }
        }, { passive: true });
    }
    
    // Public API methods
    goToCard(profileIndex) {
        // Find which position this profile is currently in
        const currentPosition = this.visibleCards.indexOf(profileIndex);
        
        if (currentPosition !== -1) {
            // Profile is currently visible, move it to center
            this.moveToCenter(currentPosition);
        } else {
            // Profile is not visible, rotate carousel to show it in center
            this.rotateToProfile(profileIndex);
        }
    }
    
    rotateToProfile(targetProfileIndex) {
        // Calculate shortest path to target profile
        const currentCenterProfile = this.visibleCards[this.centerIndex];
        const totalProfiles = this.profiles.length;
        
        let forwardSteps = (targetProfileIndex - currentCenterProfile + totalProfiles) % totalProfiles;
        let backwardSteps = (currentCenterProfile - targetProfileIndex + totalProfiles) % totalProfiles;
        
        if (forwardSteps <= backwardSteps) {
            // Go forward
            for (let i = 0; i < forwardSteps; i++) {
                this.nextCard();
            }
        } else {
            // Go backward
            for (let i = 0; i < backwardSteps; i++) {
                this.prevCard();
            }
        }
    }
    
    getCurrentCard() {
        const centerProfileIndex = this.visibleCards[this.centerIndex];
        return this.profiles[centerProfileIndex];
    }
    
    getAllProfiles() {
        return this.profiles; // Return all profiles
    }
    
    getVisibleProfiles() {
        return this.visibleCards.map(index => this.profiles[index]);
    }
    
    // Auto-play functionality
    startAutoPlay(interval = 5000) {
        this.autoPlayInterval = setInterval(() => {
            this.nextCard();
        }, interval);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    // Pause auto-play on user interaction
    pauseAutoPlay() {
        this.stopAutoPlay();
        // Restart after 10 seconds of inactivity
        setTimeout(() => {
            this.startAutoPlay();
        }, 10000);
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carousel = new AuraCarousel();
    
    // Pause auto-play on user interactions
    const carouselElement = document.querySelector('.carousel-scroll');
    carousel.prevBtn.addEventListener('click', () => carousel.pauseAutoPlay());
    carousel.nextBtn.addEventListener('click', () => carousel.pauseAutoPlay());
    carouselElement.addEventListener('touchstart', () => carousel.pauseAutoPlay());
    
    // Make carousel available globally for debugging
    window.auraCarousel = carousel;
});
