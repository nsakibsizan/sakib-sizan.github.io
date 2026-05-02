/* ══════════════════════════════════════════════════════════════
   MAIN.JS — Global JavaScript for All Pages
   Najmus Sakib Sizan · Portfolio
   ══════════════════════════════════════════════════════════════ */

/* ── LOADER ── */
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1200);
});


/* ══════════════════════════════════════════════════════════════
   CUSTOM CURSOR
   ══════════════════════════════════════════════════════════════ */
const cur = document.getElementById('cursor');
const curRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
});

function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    curRing.style.left = rx + 'px';
    curRing.style.top = ry + 'px';
    requestAnimationFrame(animRing);
}
animRing();

// Hover effect on interactive elements
const hoverSelectors = [
    'a',
    'button',
    '.skill-tag',
    '.about-card',
    '.timeline-card',
    '.cert-card',
    '.achieve-card',
    '.what-card',
    '.pub-card',
    '.lab-card',
    '.interest-tag',
    '.project-card',
    '.featured-project',
    '.blog-card',
    '.featured-article',
    '.collab-card',
    '.contact-link-card',
    '.social-btn',
    '.chip'
];

document.querySelectorAll(hoverSelectors.join(',')).forEach(el => {
    el.addEventListener('mouseenter', () => {
        cur.style.transform = 'translate(-50%,-50%) scale(2.5)';
        cur.style.background = 'rgba(0,201,167,0.4)';
        curRing.style.opacity = '0.4';
    });
    el.addEventListener('mouseleave', () => {
        cur.style.transform = 'translate(-50%,-50%) scale(1)';
        cur.style.background = 'var(--teal)';
        curRing.style.opacity = '1';
    });
});


/* ══════════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR & NAVBAR
   ══════════════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (window.scrollY / (h.scrollHeight - h.clientHeight)) * 100;
    document.getElementById('progress-bar').style.width = pct + '%';
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 30);
});


/* ══════════════════════════════════════════════════════════════
   INTERSECTION OBSERVER — FADE-UP ANIMATIONS
   ══════════════════════════════════════════════════════════════ */
const fadeObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    { threshold: 0.1 }
);

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));


/* ══════════════════════════════════════════════════════════════
   MOBILE MENU
   ══════════════════════════════════════════════════════════════ */
function openMenu() {
    document.getElementById('mobile-menu').classList.add('open');
}

function closeMenu() {
    document.getElementById('mobile-menu').classList.remove('open');
}


/* ══════════════════════════════════════════════════════════════
   COUNTER ANIMATION (Research Page — Stats)
   Only runs if elements with [data-count] exist
   ══════════════════════════════════════════════════════════════ */
const countElements = document.querySelectorAll('[data-count]');

if (countElements.length > 0) {
    const countObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = +el.dataset.count;
                    const suffix = el.dataset.suffix || '';
                    const duration = 1200;
                    const totalSteps = 60;
                    const stepTime = duration / totalSteps;
                    let current = 0;

                    const timer = setInterval(() => {
                        current += target / totalSteps;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = Math.round(current) + suffix;
                    }, stepTime);

                    countObserver.unobserve(el);
                }
            });
        },
        { threshold: 0.5 }
    );

    countElements.forEach(el => countObserver.observe(el));
}


/* ══════════════════════════════════════════════════════════════
   FILTER SYSTEM — Generic Reusable
   Works for: Skills, Publications, Projects, Blog
   ══════════════════════════════════════════════════════════════ */

/**
 * initFilter()
 * @param {string} btnSelector   — CSS selector for filter buttons
 * @param {string} itemSelector  — CSS selector for filterable items
 * @param {string} btnAttr       — data attribute on button (e.g. 'filter', 'type', 'cat')
 * @param {string} itemAttr      — data attribute on item to match against
 * @param {string|null} countElId — optional: ID of element to show count
 */
function initFilter(btnSelector, itemSelector, btnAttr, itemAttr, countElId = null) {
    const buttons = document.querySelectorAll(btnSelector);
    const items = document.querySelectorAll(itemSelector);

    if (buttons.length === 0 || items.length === 0) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.dataset[btnAttr];
            let count = 0;

            items.forEach(item => {
                const show = filterValue === 'all' || item.dataset[itemAttr] === filterValue;

                // Use 'visible' class for cards, 'display' for tags
                if (item.classList.contains('skill-tag')) {
                    item.style.display = show ? 'inline-flex' : 'none';
                } else {
                    item.classList.toggle('visible', show);
                }

                if (show) count++;
            });

            // Update count display if provided
            if (countElId) {
                const countEl = document.getElementById(countElId);
                if (countEl) {
                    countEl.textContent = `Showing ${count} paper${count !== 1 ? 's' : ''}`;
                }
            }
        });
    });
}


/* ── INDEX PAGE: Skills Filter ── */
initFilter(
    '#skillFilter button',
    '.skill-tag',
    'filter',
    'cat'
);

/* ── INDEX PAGE: Publication Filter ── */
initFilter(
    '.pub-filter',
    '.pub-card',
    'type',
    'type'
);

/* ── RESEARCH PAGE: Publication Filter ── */
initFilter(
    '.pub-filter',
    '.pub-card',
    'type',
    'type',
    'pubCount'
);

/* ── PROJECTS PAGE: Project Filter ── */
initFilter(
    '.proj-filter',
    '.project-card',
    'cat',
    'cat'
);

/* ── BLOG PAGE: Blog Filter ── */
initFilter(
    '.blog-filter',
    '.blog-card',
    'cat',
    'cat'
);


/* ══════════════════════════════════════════════════════════════
   TYPING ANIMATION (Index Page Hero)
   Only runs if #typed element exists
   ══════════════════════════════════════════════════════════════ */
const typedEl = document.getElementById('typed');

if (typedEl) {
    const roles = [
        'PDM Data Migration Engineer',
        'AI & Machine Learning Engineer',
        'Blockchain & PQC Researcher'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeRole() {
        const current = roles[roleIndex];

        if (isDeleting) {
            typedEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === current.length) {
            speed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 400; // Pause before next word
        }

        setTimeout(typeRole, speed);
    }

    typeRole();
}


/* ══════════════════════════════════════════════════════════════
   INDEX PAGE: PARTICLE CANVAS
   Only runs if #particleCanvas exists
   ══════════════════════════════════════════════════════════════ */
const particleCanvas = document.getElementById('particleCanvas');

if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

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

            if (this.x < 0 || this.x > particleCanvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > particleCanvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,201,167,${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

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
    }

    animateParticles();
}