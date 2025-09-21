// ===== ART GALLERY - SIMPLIFIED VERSION =====

class ArtGallery {
    constructor() {
        this.activeCategory = 'all';
        this.items = [];
        this.init();
    }
    
    init() {
        this.loadGalleryItems();
        this.setupEventListeners();
        this.setupFilters();
    }
    
    loadGalleryItems() {
        // Media files from images directory
        this.items = [
            { 
                type: 'video', 
                src: 'images/MAIN VIDEO OF BORN CORE.mp4', 
                category: 'cinematic',
                title: 'Birth of CORE'
            },
            { 
                type: 'video', 
                src: 'images/core_monolith2.mp4', 
                category: 'cinematic',
                title: 'CORE Monolith'
            },
            { 
                type: 'video', 
                src: 'images/background_video.mp4', 
                category: 'cinematic',
                title: 'CORE Background'
            },
            { 
                type: 'video', 
                src: 'images/corecatwalk.mp4', 
                category: 'memes',
                title: 'CORE Cat Walk'
            },
            { 
                type: 'video', 
                src: 'images/Cat_going_toward_202508102140_ozqty.mp4', 
                category: 'memes',
                title: 'Cat Going Toward'
            },
            { 
                type: 'video', 
                src: 'images/Cat_puts_the_202508102117_2fk2e.mp4', 
                category: 'memes',
                title: 'Cat Puts The'
            },
            { 
                type: 'video', 
                src: 'images/Cat_wallking_away_202508102142_s3ju7.mp4', 
                category: 'memes',
                title: 'Cat Walking Away'
            },
            { 
                type: 'video', 
                src: 'images/Cinematic_cat_rising_202508102109_rzbt2.mp4', 
                category: 'cinematic',
                title: 'Cinematic Cat Rising'
            },
            { 
                type: 'image', 
                src: 'images/core background.jpg', 
                category: 'digital-art',
                title: 'CORE Background Art'
            },
            { 
                type: 'image', 
                src: 'images/photo_2025-08-09_05-08-27.jpg', 
                category: 'photos',
                title: 'CORE Photo 1'
            },
            { 
                type: 'image', 
                src: 'images/photo_2025-08-09_05-16-20.jpg', 
                category: 'photos',
                title: 'CORE Photo 2'
            },
            { 
                type: 'image', 
                src: 'images/photo_2025-08-10_00-45-08.jpg', 
                category: 'community',
                title: 'Community Snapshot'
            },
            { 
                type: 'image', 
                src: 'images/photo_2025-08-18_19-22-30.jpg', 
                category: 'community',
                title: 'Community Event'
            }
        ];
        
        this.renderGallery();
    }
    
    setupEventListeners() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.filterGallery(e.target.dataset.category));
        });
    }
    
    setupFilters() {
        // Add active class to "all" button by default
        const allBtn = document.querySelector('.filter-btn[data-category="all"]');
        if (allBtn) allBtn.classList.add('active');
    }
    
    filterGallery(category) {
        this.activeCategory = category;
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-category="${category}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        
        // Filter items
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;
        
        const items = galleryGrid.querySelectorAll('.gallery-item');
        items.forEach(item => {
            const itemCategory = item.dataset.category;
            
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.opacity = '1';
                }, Math.random() * 300);
            } else {
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
    
    renderGallery() {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;
        
        galleryGrid.innerHTML = '';
        
        this.items.forEach((item, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.dataset.category = item.category;
            
            if (item.type === 'video') {
                galleryItem.innerHTML = `
                    <div class="media-container">
                        <video 
                            src="${item.src}" 
                            muted 
                            loop 
                            playsinline
                            onmouseenter="this.play()"
                            onmouseleave="this.pause(); this.currentTime = 0"
                            onerror="this.style.display='none'"
                        ></video>
                        <div class="media-overlay">
                            <span class="media-title">${item.title}</span>
                            <span class="media-type">VIDEO</span>
                        </div>
                    </div>
                `;
            } else {
                galleryItem.innerHTML = `
                    <div class="media-container">
                        <img 
                            src="${item.src}" 
                            alt="${item.title}"
                            loading="lazy"
                            onerror="this.style.display='none'"
                        />
                        <div class="media-overlay">
                            <span class="media-title">${item.title}</span>
                            <span class="media-type">IMAGE</span>
                        </div>
                    </div>
                `;
            }
            
            galleryGrid.appendChild(galleryItem);
        });
    }
}

// Movement Carousel - Simplified
class CoreCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.autoplayInterval = null;
        this.init();
    }
    
    init() {
        this.loadSlides();
        this.createNavigation();
        this.startAutoplay();
    }
    
    loadSlides() {
        const carousel = document.querySelector('.movement-carousel');
        if (!carousel) return;
        
        this.slides = [
            {
                image: 'images/photo_2025-08-10_01-14-56.jpg',
                title: 'The Beginning',
                description: 'CORE emerges from the digital void, a new force awakening.'
            },
            {
                image: 'images/photo_2025-08-10_04-09-16.jpg',
                title: 'Growing Stronger',
                description: 'The community rallies, building the foundation of tomorrow.'
            },
            {
                image: 'images/photo_2025-08-18_19-22-30.jpg',
                title: 'Rising Higher',
                description: 'Together we ascend beyond the limits of possibility.'
            }
        ];
        
        this.renderSlides();
    }
    
    renderSlides() {
        const carousel = document.querySelector('.movement-carousel');
        if (!carousel) return;
        
        carousel.innerHTML = this.slides.map((slide, index) => `
            <div class="carousel-slide ${index === 0 ? 'active' : ''}">
                <img src="${slide.image}" alt="${slide.title}" loading="lazy" />
                <div class="slide-content">
                    <h3>${slide.title}</h3>
                    <p>${slide.description}</p>
                </div>
            </div>
        `).join('');
    }
    
    createNavigation() {
        const container = document.querySelector('.movement-content');
        if (!container) return;
        
        const nav = document.createElement('div');
        nav.className = 'carousel-nav';
        nav.innerHTML = `
            <button class="nav-btn prev" onclick="coreCarousel.previousSlide()">‹</button>
            <div class="slide-indicators">
                ${this.slides.map((_, index) => 
                    `<button class="indicator ${index === 0 ? 'active' : ''}" onclick="coreCarousel.goToSlide(${index})"></button>`
                ).join('')}
            </div>
            <button class="nav-btn next" onclick="coreCarousel.nextSlide()">›</button>
        `;
        
        container.appendChild(nav);
    }
    
    goToSlide(index) {
        if (index < 0 || index >= this.slides.length) return;
        
        // Update slides
        const slides = document.querySelectorAll('.carousel-slide');
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        // Update indicators
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        this.currentSlide = index;
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.goToSlide(prevIndex);
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
        
        // Pause on hover
        const carousel = document.querySelector('.movement-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.pauseAutoplay());
            carousel.addEventListener('mouseleave', () => this.startAutoplay());
        }
    }
    
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// Global variables for access
window.CoreCarousel = CoreCarousel;
window.ArtGallery = ArtGallery;
