(function () {
    'use strict';

    const body = document.body;
    const html = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    if (html.classList.contains('light-mode')) {
        body.classList.add('light-mode');
    }

    // ── Preloader ──
    const preloader = document.getElementById('preloader');
    function hidePreloader() {
        if (!preloader) return;
        preloader.classList.add('done');
        setTimeout(() => preloader.remove(), 700);
    }
    window.addEventListener('load', () => {
        setTimeout(hidePreloader, reduceMotion ? 0 : 900);
    });
    setTimeout(hidePreloader, 2800);

    // ── Theme ──
    const themeToggle = document.getElementById('themeToggle');
    function toggleTheme() {
        const isLight = html.classList.toggle('light-mode');
        body.classList.toggle('light-mode', isLight);
        try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); } catch (e) {}
    }
    themeToggle?.addEventListener('click', toggleTheme);

    // ── Typing ──
    const phrases = ['From Kochi, India', 'A UI/UX Designer', 'A Web Developer', 'A Problem Solver'];
    const typedEl = document.getElementById('typed-text');
    if (typedEl) {
        if (reduceMotion) {
            typedEl.textContent = phrases[0];
        } else {
            let phraseIndex = 0, charIndex = 0, deleting = false;
            function type() {
                const current = phrases[phraseIndex];
                typedEl.textContent = current.substring(0, deleting ? charIndex-- : charIndex++);
                if (!deleting && charIndex === current.length + 1) {
                    setTimeout(() => { deleting = true; }, 1800);
                    setTimeout(type, 2200);
                    return;
                }
                if (deleting && charIndex === 0) {
                    deleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                }
                setTimeout(type, deleting ? 45 : 85);
            }
            setTimeout(type, 600);
        }
    }

    // ── Counters ──
    function animateCounters() {
        document.querySelectorAll('.stat-number').forEach((el) => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            if (reduceMotion) {
                el.textContent = target + '+';
                return;
            }
            let count = 0;
            const step = Math.max(1, Math.ceil(target / 36));
            const timer = setInterval(() => {
                count = Math.min(count + step, target);
                el.textContent = count + '+';
                if (count === target) clearInterval(timer);
            }, 32);
        });
    }
    const stats = document.getElementById('stats');
    if (stats) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.35 });
        statsObserver.observe(stats);
    }

    // ── Tabs ──
    const tabButtons = document.querySelectorAll('.tab-links');
    tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.tab;
            tabButtons.forEach((b) => {
                b.classList.remove('active-link');
                b.setAttribute('aria-selected', 'false');
            });
            document.querySelectorAll('.tab-contents').forEach((panel) => panel.classList.remove('active-tab'));
            btn.classList.add('active-link');
            btn.setAttribute('aria-selected', 'true');
            document.getElementById(name)?.classList.add('active-tab');
        });
    });

    // ── Mobile menu ──
    const sidemenu = document.getElementById('sidemenu');
    const openBtn = document.getElementById('openMenu');
    const closeBtn = document.getElementById('closeMenu');

    function openmenu() {
        body.classList.add('menu-open');
        openBtn?.setAttribute('aria-expanded', 'true');
    }
    function closemenu() {
        body.classList.remove('menu-open');
        openBtn?.setAttribute('aria-expanded', 'false');
    }
    openBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        openmenu();
    });
    closeBtn?.addEventListener('click', closemenu);
    sidemenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closemenu));
    document.addEventListener('click', (e) => {
        if (!body.classList.contains('menu-open')) return;
        if (sidemenu?.contains(e.target) || openBtn?.contains(e.target)) return;
        closemenu();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closemenu();
            closeLightbox();
        }
    });

    // ── Scroll UI ──
    const nav = document.getElementById('siteNav');
    const backToTop = document.getElementById('backToTop');
    const progressBar = document.getElementById('progressBar');
    const sectionIds = ['header', 'about', 'services', 'portfolio', 'contact'];
    const navLinks = document.querySelectorAll('#sidemenu li a:not(.nav-cta)');

    function onScroll() {
        const y = window.scrollY;
        nav?.classList.toggle('scrolled', y > 40);
        backToTop?.classList.toggle('visible', y > 480);

        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        if (progressBar && max > 0) {
            progressBar.style.width = `${Math.min(100, (y / max) * 100)}%`;
        }

        let current = 'header';
        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el && y >= el.offsetTop - 140) current = id;
        });
        navLinks.forEach((link) => {
            link.classList.toggle('active-nav', link.getAttribute('href') === '#' + current);
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    // ── Reveal ──
    const revealEls = document.querySelectorAll(
        '.service-card, .work, .about-col-1, .about-col-2, .stat-item, .process-list li, .hero-copy, .hero-visual, .section-head'
    );
    if (reduceMotion) {
        revealEls.forEach((el) => el.classList.add('visible'));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${(i % 4) * 80}ms`;
            observer.observe(el);
        });
    }

    // ── Portfolio filter ──
    const filters = document.querySelectorAll('.filter-btn');
    const works = document.querySelectorAll('.work');
    filters.forEach((btn) => {
        btn.addEventListener('click', () => {
            filters.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            works.forEach((work) => {
                const show = filter === 'all' || work.dataset.category === filter;
                work.classList.toggle('is-hidden', !show);
            });
        });
    });

    // ── Lightbox ──
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxTag = document.getElementById('lightboxTag');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxStack = document.getElementById('lightboxStack');
    const lightboxLive = document.getElementById('lightboxLive');

    function openLightbox(work) {
        if (!lightbox) return;
        lightboxImg.src = work.querySelector('img').src;
        lightboxImg.alt = work.dataset.title || '';
        lightboxTitle.textContent = work.dataset.title;
        lightboxTag.textContent = work.dataset.tag;
        lightboxDesc.textContent = work.dataset.desc;

        if (work.dataset.stack && lightboxStack) {
            lightboxStack.hidden = false;
            lightboxStack.textContent = work.dataset.stack;
        } else if (lightboxStack) {
            lightboxStack.hidden = true;
            lightboxStack.textContent = '';
        }

        if (work.dataset.url && lightboxLive) {
            lightboxLive.hidden = false;
            lightboxLive.href = work.dataset.url;
        } else if (lightboxLive) {
            lightboxLive.hidden = true;
            lightboxLive.removeAttribute('href');
        }

        lightbox.hidden = false;
        requestAnimationFrame(() => lightbox.classList.add('open'));
        body.classList.add('lightbox-open');
        lightbox.querySelector('.lightbox-close')?.focus();
    }
    function closeLightbox() {
        if (!lightbox || lightbox.hidden) return;
        lightbox.classList.remove('open');
        body.classList.remove('lightbox-open');
        setTimeout(() => { lightbox.hidden = true; }, 280);
    }
    works.forEach((work) => {
        work.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            openLightbox(work);
        });
        work.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(work);
            }
        });
        work.setAttribute('tabindex', '0');
        work.setAttribute('role', 'button');
    });
    lightbox?.querySelectorAll('[data-close]').forEach((el) => {
        el.addEventListener('click', closeLightbox);
    });

    // ── Form ──
    const scriptURL = 'https://script.google.com/macros/s/AKfycbx7ueURnYo94US3y5euroVBBu-woZNleoXTIEEIboPV2p8cvrsOgUu6xj2Tg6MS9rD7/exec';
    const form = document.forms['submit-to-google-sheet'];
    const msg = document.getElementById('msg');
    const submitMarkup = 'Send message <i class="fa-solid fa-paper-plane"></i>';

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const name = form.Name.value.trim();
        const email = form.Email.value.trim();
        const message = form.Message.value.trim();
        if (!name || !email || !message) {
            msg.textContent = 'Please fill in all fields.';
            msg.classList.remove('success');
            msg.classList.add('error');
            return;
        }
        btn.innerHTML = 'Sending…';
        btn.disabled = true;
        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(() => {
                msg.textContent = 'Message sent. I’ll get back to you soon.';
                msg.classList.add('success');
                msg.classList.remove('error');
                btn.innerHTML = submitMarkup;
                btn.disabled = false;
                form.reset();
                setTimeout(() => {
                    msg.textContent = '';
                    msg.classList.remove('success');
                }, 5000);
            })
            .catch((error) => {
                msg.textContent = 'Something went wrong. Please try email instead.';
                msg.classList.add('error');
                btn.innerHTML = submitMarkup;
                btn.disabled = false;
                console.error('Error!', error.message);
            });
    });

    // ── Custom cursor ──
    const cursor = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursorDot');
    if (finePointer && cursor && cursorDot && !reduceMotion) {
        body.classList.add('has-cursor');
        let x = 0, y = 0, cx = 0, cy = 0;
        window.addEventListener('mousemove', (e) => {
            x = e.clientX;
            y = e.clientY;
            cursorDot.style.transform = `translate(${x}px, ${y}px)`;
        }, { passive: true });
        function loop() {
            cx += (x - cx) * 0.18;
            cy += (y - cy) * 0.18;
            cursor.style.transform = `translate(${cx}px, ${cy}px)`;
            requestAnimationFrame(loop);
        }
        loop();
        document.querySelectorAll('a, button, .work, .tab-links, .filter-btn').forEach((el) => {
            el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
        });
    }

    // ── Magnetic buttons ──
    if (finePointer && !reduceMotion) {
        document.querySelectorAll('.magnetic').forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const r = btn.getBoundingClientRect();
                const mx = e.clientX - r.left - r.width / 2;
                const my = e.clientY - r.top - r.height / 2;
                btn.style.transform = `translate(${mx * 0.18}px, ${my * 0.22}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ── Hero parallax ──
    const visual = document.querySelector('.hero-visual');
    if (visual && finePointer && !reduceMotion) {
        const hero = document.getElementById('header');
        hero?.addEventListener('mousemove', (e) => {
            const r = hero.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            visual.style.transform = `translate(${px * 18}px, ${py * 12}px)`;
        });
        hero?.addEventListener('mouseleave', () => {
            visual.style.transform = '';
        });
    }
})();
