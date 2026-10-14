/* ══════════════════════════════════════════════════════════════
   MAIN.JS — Global JavaScript for All Pages
   Najmus Sakib Sizan · Portfolio
   Production build — de-duplicated, crash-safe, strict mode
   ══════════════════════════════════════════════════════════════ */

(() => {
    'use strict';

    /* ── Utility: safe query helpers ── */
    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    /* ══════════════════════════════════════════════════════════
       LOADER
       ══════════════════════════════════════════════════════════ */
    window.addEventListener('load', () => {
        const loader = $('#loader');
        if (loader) {
            setTimeout(() => loader.classList.add('hidden'), 1200);
        }
    });

    /* ══════════════════════════════════════════════════════════
       SCROLL PROGRESS BAR & NAVBAR  (single listener)
       ══════════════════════════════════════════════════════════ */
    const progressBar = $('#progress-bar');
    const navbar      = $('#navbar');

    const onScroll = () => {
        const h = document.documentElement;
        const scrollable = h.scrollHeight - h.clientHeight;
        const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

        if (progressBar) progressBar.style.width = pct + '%';
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 30);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // set initial state

    /* ══════════════════════════════════════════════════════════
       FADE-UP ANIMATIONS  (single observer · class: 'visible')
       ══════════════════════════════════════════════════════════ */
    const fadeEls = $$('.fade-up');
    if (fadeEls.length) {
        const fadeObserver = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target); // animate once
                    }
                });
            },
            { threshold: 0.1 }
        );
        fadeEls.forEach(el => fadeObserver.observe(el));
    }

    /* ══════════════════════════════════════════════════════════
       MOBILE MENU  (exposed to window for inline onclick)
       ══════════════════════════════════════════════════════════ */
    const mobileMenu = $('#mobile-menu');

    window.openMenu  = () => mobileMenu && mobileMenu.classList.add('open');
    window.closeMenu = () => mobileMenu && mobileMenu.classList.remove('open');

    // Close mobile menu on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
        }
    });

    /* ══════════════════════════════════════════════════════════
       COUNTER ANIMATION  ([data-count])
       ══════════════════════════════════════════════════════════ */
    const countElements = $$('[data-count]');
    if (countElements.length) {
        const countObserver = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    const el       = entry.target;
                    const target   = Number(el.dataset.count) || 0;
                    const suffix   = el.dataset.suffix || '';
                    const duration = 1200;
                    const steps    = 60;
                    const stepTime = duration / steps;
                    let current    = 0;

                    const timer = setInterval(() => {
                        current += target / steps;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = Math.round(current) + suffix;
                    }, stepTime);

                    obs.unobserve(el);
                });
            },
            { threshold: 0.5 }
        );
        countElements.forEach(el => countObserver.observe(el));
    }

    /* ══════════════════════════════════════════════════════════
       GENERIC FILTER SYSTEM
       Works for: Skills, Publications, Projects, Blog
       ══════════════════════════════════════════════════════════ */
    function initFilter(btnSelector, itemSelector, btnAttr, itemAttr, countElId = null) {
        const buttons = $$(btnSelector);
        const items   = $$(itemSelector);
        if (!buttons.length || !items.length) return;

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.dataset[btnAttr];
                let count = 0;

                items.forEach(item => {
                    const show = filterValue === 'all' || item.dataset[itemAttr] === filterValue;

                    if (item.classList.contains('skill-tag')) {
                        // Tags use inline display
                        item.style.display = show ? 'inline-flex' : 'none';
                    } else {
                        // Cards use the 'visible' class
                        item.classList.toggle('visible', show);
                    }
                    if (show) count++;
                });

                if (countElId) {
                    const countEl = document.getElementById(countElId);
                    if (countEl) {
                        countEl.textContent =
                            `Showing ${count} paper${count !== 1 ? 's' : ''}`;
                    }
                }
            });
        });
    }

    // Index: Skills
    initFilter('#skillFilter button', '.skill-tag', 'filter', 'cat');
    // Index & Research: Publications
    initFilter('.pub-filter', '.pub-card', 'type', 'type', 'pubCount');
    // Projects
    initFilter('.proj-filter', '.project-card', 'cat', 'cat');
    // Blog
    initFilter('.blog-filter', '.blog-card', 'cat', 'cat');

    /* ══════════════════════════════════════════════════════════
       TYPING ANIMATION  (#typed — Index hero)
       ══════════════════════════════════════════════════════════ */
    const typedEl = $('#typed');
    if (typedEl) {
        const roles = [
            'PDM Data Migration Engineer',
            'AI & Machine Learning Researcher',
            'Blockchain & PQC Researcher'
        ];
        let roleIndex = 0, charIndex = 0, isDeleting = false;

        const typeRole = () => {
            const current = roles[roleIndex];
            charIndex += isDeleting ? -1 : 1;
            typedEl.textContent = current.substring(0, charIndex);

            let speed = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === current.length) {
                speed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                speed = 400;
            }
            setTimeout(typeRole, speed);
        };
        typeRole();
    }

    /* ══════════════════════════════════════════════════════════
       PARTICLE CANVAS  (#particleCanvas — Index hero)
       ══════════════════════════════════════════════════════════ */
    const particleCanvas = $('#particleCanvas');
    if (particleCanvas) {
        const ctx = particleCanvas.getContext('2d');
        let particles = [];

        const resizeCanvas = () => {
            particleCanvas.width  = window.innerWidth;
            particleCanvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * particleCanvas.width;
                this.y = Math.random() * particleCanvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > particleCanvas.width)  this.speedX *= -1;
                if (this.y < 0 || this.y > particleCanvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,201,167,${this.opacity})`;
                ctx.fill();
            }
        }

        const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
        for (let i = 0; i < particleCount; i++) particles.push(new Particle());

        const animateParticles = () => {
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            particles.forEach(p => { p.update(); p.draw(); });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0,201,167,${0.08 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }

    /* ══════════════════════════════════════════════════════════
       GALLERY  (only runs on gallery.html — fully guarded)
       ══════════════════════════════════════════════════════════ */
    const lightbox = $('#lightbox');
    const photoItems = $$('.photo-item');

    if (photoItems.length) {
        const filterBtns = $$('.gal-filter-btn');
        const yearGroups = $$('.year-group');
        const emptyState = $('#galleryEmpty');

        // Filter
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const f = btn.dataset.filter;
                let visibleCount = 0;

                photoItems.forEach(item => {
                    const show = f === 'all' || item.dataset.cat === f;
                    item.style.display = show ? '' : 'none';
                    if (show) visibleCount++;
                });
                yearGroups.forEach(group => {
                    const cats = group.dataset.categories
                        ? group.dataset.categories.split(',') : [];
                    group.classList.toggle('hidden', !(f === 'all' || cats.includes(f)));
                });
                if (emptyState) emptyState.classList.toggle('visible', visibleCount === 0);
            });
        });

        // Lightbox (only if the lightbox markup exists)
        if (lightbox) {
            const lightboxImg   = $('#lightboxImg');
            const lightboxTitle = $('#lightboxTitle');
            const lightboxTag   = $('#lightboxTag');
            const btnClose      = $('#lightboxClose');
            const btnPrev       = $('#lightboxPrev');
            const btnNext       = $('#lightboxNext');

            let currentIdx = 0;
            let visibleItems = [];

            const showSlide = (idx) => {
                const item = visibleItems[idx];
                if (!item) return;
                const svg = item.querySelector('svg');
                if (svg) {
                    const svgData = new XMLSerializer().serializeToString(svg);
                    lightboxImg.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                } else {
                    const img = item.querySelector('img');
                    if (img) lightboxImg.src = img.src;
                }
                if (lightboxTitle) lightboxTitle.textContent = item.dataset.title || '';
                if (lightboxTag && item.dataset.cat) {
                    lightboxTag.textContent =
                        item.dataset.cat.charAt(0).toUpperCase() + item.dataset.cat.slice(1);
                }
            };

            const openLightbox = (item) => {
                visibleItems = photoItems.filter(i => i.style.display !== 'none');
                currentIdx = visibleItems.indexOf(item);
                showSlide(currentIdx);
                lightbox.classList.add('open');
                document.body.style.overflow = 'hidden';
            };

            const closeLightbox = () => {
                lightbox.classList.remove('open');
                document.body.style.overflow = '';
            };

            const prev = () => {
                currentIdx = (currentIdx - 1 + visibleItems.length) % visibleItems.length;
                showSlide(currentIdx);
            };
            const next = () => {
                currentIdx = (currentIdx + 1) % visibleItems.length;
                showSlide(currentIdx);
            };

            photoItems.forEach(item =>
                item.addEventListener('click', () => openLightbox(item)));

            if (btnClose) btnClose.addEventListener('click', closeLightbox);
            if (btnPrev)  btnPrev.addEventListener('click', e => { e.stopPropagation(); prev(); });
            if (btnNext)  btnNext.addEventListener('click', e => { e.stopPropagation(); next(); });

            lightbox.addEventListener('click', e => {
                if (e.target === lightbox) closeLightbox();
            });

            document.addEventListener('keydown', (e) => {
                if (!lightbox.classList.contains('open')) return;
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft')  prev();
                if (e.key === 'ArrowRight') next();
            });
        }
    }

})();