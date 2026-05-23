document.addEventListener("DOMContentLoaded", () => {
    document.body.style.opacity = '0';
    document.fonts.ready.then(() => {
        document.body.style.transition = 'opacity 0.4s ease';
        document.body.style.opacity = '1';
    });

    const glitchLetter = document.getElementById('glitch-letter');
    if (glitchLetter) {
        setInterval(() => {
            glitchLetter.innerText = glitchLetter.innerText === 'Е' ? 'О' : 'Е';
        }, 800);
    }

    const hints = ["як зробити місто краще", "а давайте…", "можна ж було б…", "як покращити…"];
    const hintEl = document.getElementById('idea-hint-text');
    if (hintEl) {
        let hintIdx = 0;
        setInterval(() => {
            hintIdx = (hintIdx + 1) % hints.length;
            hintEl.innerText = hints[hintIdx];
        }, 2000);
    }

    const words = ["щось..", "про.."];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const storyEl = document.getElementById('story-text');

    function typeWriter() {
        if (!storyEl) return;
        const currentWord = words[wordIdx];
        if (isDeleting) {
            storyEl.innerText = currentWord.substring(0, charIdx - 1);
            charIdx--;
        } else {
            storyEl.innerText = currentWord.substring(0, charIdx + 1);
            charIdx++;
        }
        let speed = isDeleting ? 40 : 120;
        if (!isDeleting && charIdx === currentWord.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            speed = 500;
        }
        setTimeout(typeWriter, speed);
    }
    typeWriter();

    const silenceBtn = document.getElementById('btn-silence');
    const overlay = document.getElementById('silence-overlay');
    const closeBtn = document.getElementById('close-silence');
    const timerEl = document.getElementById('silence-timer');
    const breatheContainer = document.getElementById('breathe-container');
    const breatheMsg = document.getElementById('breathe-msg');
    const silenceMainMsg = document.getElementById('silence-main-msg');
    let silenceInterval;
    let silenceTimeout;
    let breatheInterval;
    let initialTimeout;

    function closeSilence() {
        if (overlay) overlay.style.display = 'none';
        clearInterval(silenceInterval);
        clearInterval(breatheInterval);
        clearTimeout(initialTimeout);
        clearTimeout(silenceTimeout);
    }

    if (silenceBtn && overlay) {
        const noseIcon = document.getElementById('nose-icon');

        silenceBtn.addEventListener('click', () => {
            overlay.style.display = 'flex';
            breatheContainer.style.display = 'none';
            timerEl.style.display = 'none';
            silenceMainMsg.style.display = 'block';
            silenceMainMsg.innerText = 'ну мовчіть...';

            initialTimeout = setTimeout(() => {
                silenceMainMsg.innerText = 'давайте подихаємо або шо..';

                silenceTimeout = setTimeout(() => {
                    silenceMainMsg.style.display = 'none';
                    breatheContainer.style.display = 'flex';
                    timerEl.style.display = 'block';
                    timerEl.innerText = '30';
                    let timeLeft = 30;

                    silenceInterval = setInterval(() => {
                        timeLeft--;
                        timerEl.innerText = timeLeft;
                        if (timeLeft <= 0) closeSilence();
                    }, 1000);

                    breatheMsg.innerText = 'Вдих';
                    noseIcon.className = 'nose-emoji nose-exhale';
                    noseIcon.innerText = '👃🏻';

                    setTimeout(() => {
                        noseIcon.className = 'nose-emoji nose-inhale';
                    }, 50);

                    breatheInterval = setInterval(() => {
                        if (breatheMsg.innerText === 'Вдих') {
                            breatheMsg.innerText = 'Виииидих';
                            noseIcon.className = 'nose-emoji nose-exhale';
                            noseIcon.innerText = '😮‍💨';
                        } else {
                            breatheMsg.innerText = 'Вдих';
                            noseIcon.className = 'nose-emoji nose-inhale';
                            noseIcon.innerText = '👃🏻';
                        }
                    }, 4000);

                }, 2000);
            }, 1500);
        });

        closeBtn.addEventListener('click', closeSilence);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeSilence();
        });
    }

    const fab = document.getElementById('scroll-fab');
    const fabIcon = document.getElementById('fab-icon');

    function checkScrollPosition() {
        const scrolledToBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10;
        if (fab) {
            if (window.scrollY > 100) {
                fab.classList.add('show');
            } else {
                fab.classList.remove('show');
            }
        }
        if (fabIcon) {
            fabIcon.innerHTML = scrolledToBottom ? 'arrow_upward' : 'arrow_downward';
        }
    }

    window.addEventListener('scroll', checkScrollPosition);

    if (fab) {
        fab.addEventListener('click', () => {
            if (fabIcon.innerHTML === 'arrow_upward') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const shopopaloBtn = document.querySelector('.b-shopopalo');
                if (shopopaloBtn) {
                    shopopaloBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
            }
        });
    }

    setTimeout(() => {
        const peekY = Math.min(400, document.body.scrollHeight / 2.5);

        function bounceScroll(targetY, duration, easing, callback) {
            const startY = window.scrollY;
            const diff = targetY - startY;
            let start = null;

            function step(timestamp) {
                if (!start) start = timestamp;
                const time = timestamp - start;
                const percent = Math.min(time / duration, 1);
                window.scrollTo(0, startY + diff * easing(percent));
                if (time < duration) {
                    window.requestAnimationFrame(step);
                } else if (callback) {
                    callback();
                }
            }
            window.requestAnimationFrame(step);
        }

        const easeOutExpo = x => x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
        const easeInOutCubic = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

        bounceScroll(peekY, 800, easeOutExpo, () => {
            setTimeout(() => {
                bounceScroll(0, 550, easeInOutCubic);
            }, 150);
        });
    }, 600);

    let isInitialLoad = true;
    setTimeout(() => { isInitialLoad = false; }, 800);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.pressing && !isInitialLoad) {
                entry.target.dataset.pressing = 'true';
                entry.target.classList.add('simulate-press');
                setTimeout(() => {
                    entry.target.classList.remove('simulate-press');
                    delete entry.target.dataset.pressing;
                }, 400);
            }
        });
    }, {
        rootMargin: '-30% 0px -30% 0px'
    });

    document.querySelectorAll('.btn').forEach(btn => {
        observer.observe(btn);
    });

    document.querySelectorAll('.react').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('clicked')) return;
            this.classList.add('clicked');
            let parts = this.innerText.split(' ');
            let count = parseInt(parts[1]) + 1;
            this.innerText = parts[0] + ' ' + count;
            this.style.background = '#e7f3ff';
            this.style.color = '#1877f2';
        });
    });



    const complainPhrases = ["🚰на відсутність води", "на сусідів 🏘️", "🐟 на вонючу рибу в магазині", "на 🕳️ яму", "на життя 😫", "на ще щось", "🔥 на паліїв 🔥", "💸🏷️на ціни"];
    let complainIdx = 0;
    const popEl = document.getElementById('complain-pop');

    if (popEl) {
        setInterval(() => {
            popEl.classList.remove('pop-up');
            setTimeout(() => {
                complainIdx = (complainIdx + 1) % complainPhrases.length;
                popEl.innerText = complainPhrases[complainIdx];
                popEl.classList.add('pop-up');
            }, 500);
        }, 2000);
    }

    const rumorsWrap = document.getElementById('rumors-btn-wrap');
    const rumorsDesc = document.getElementById('rumors-dynamic-text');
    const rumorsTitle = document.getElementById('rumors-title');

    if (rumorsWrap && rumorsDesc && rumorsTitle) {
        const rumorPhrases = ["А ви чули, шо...", "А ви бачили….?", "А ЦЕ ПРАВДА, ШО..", "Кажуть, шо..."];
        const actionPhrases = ["НАПИСАТИ", "ЗАПИТАТИ"];
        const emojis = ["😮", "👀", "🫢", "🤔", "👂"];
        let rIdx = 0;
        let aIdx = 0;

        function runRumorsCycle() {
            rumorsWrap.classList.add('is-button-mode');
            aIdx = (aIdx + 1) % actionPhrases.length;
            rumorsDesc.innerText = actionPhrases[aIdx];

            let scrambleCount = 0;
            const scrambleInt = setInterval(() => {
                scrambleCount++;
                let str = "";
                for (let i = 0; i < 3; i++) str += emojis[Math.floor(Math.random() * emojis.length)];
                rumorsTitle.innerText = str;
                if (scrambleCount > 8) {
                    clearInterval(scrambleInt);
                    rumorsTitle.innerText = "ЧУТКИ";
                }
            }, 250);

            setTimeout(() => {
                rumorsWrap.classList.remove('is-button-mode');
                rIdx = (rIdx + 1) % rumorPhrases.length;
                rumorsDesc.innerText = rumorPhrases[rIdx];
                rumorsTitle.innerText = "ЧУТКИ";
                setTimeout(runRumorsCycle, 4000);
            }, 6000);
        }

        setTimeout(runRumorsCycle, 4000);
    }
    
// === СИСТЕМА САБМІТУ (MAILBOX & HOLE) ===

    const submitOverlay = document.getElementById('submit-overlay');
    const closeSubmitBtn = document.getElementById('close-submit');
    const submitActionBtn = document.getElementById('submit-action-btn');
    const submitEditor = document.getElementById('submit-editor');
    const submitContent = document.getElementById('submit-content');
    const submitSentScreen = document.getElementById('submit-sent-screen');
    const closeSentBtn = document.getElementById('close-sent');
    const submitVideo = document.getElementById('submit-video');
    const attachBtn = document.getElementById('attach-btn');
    const attachInput = document.getElementById('attach-input');
    const fontSelect = document.getElementById('font-select');
    const submitPreviewScreen = document.getElementById('submit-preview-screen');
    const previewPostCard = document.getElementById('preview-post-card');
    const previewMetaLine = document.getElementById('preview-meta-line');
    const previewEditBtn = document.getElementById('preview-edit-btn');
    const previewSendBtn = document.getElementById('preview-send-btn');
    const inlineDoneBtn = document.getElementById('inline-done-btn');
    const attachPreviewInline = document.getElementById('attach-preview-inline');

    let lastScrollY = 0;
    let finishSendTimeout;
    let currentBgColor = '#FAF8F4';
    let currentTextColor = '#222221';
    let currentAlign = 'auto';

    const buttonTitles = {
        '.b-write-main': 'НАПИСАТИ', '.b-story': 'РОЗКАЗАТИ', '.b-serious': 'НАПИСАТИ СЕРЙОЗНЕ',
        '.b-petition': 'ЗВЕРНЕННЯ', '.b-complain': 'ПОСКАРЖИТИСЬ', '.b-zbir': 'ЗБІР',
        '.b-idea': 'Є ІДЕЯ', '.b-thank': 'ПОДЯКУВАТИ', '.b-unpopular': 'НЕПОПУЛЯРНА ДУМКА',
        '.b-shopopalo': 'ШОПОПАЛО', '.b-admins': 'НАПИСАТИ АДМІНАМ', '.rumors-container': 'ЧУТКИ',
        '.b-problem': 'ОТАКА ПРОБЛЕМА', '.b-advice': 'ПОТРІБНА ПОРАДА', '.b-birthday': 'ПРИВІТАТИ'
    };

    const buttonPlaceholders = {
        '.b-write-main': 'Ну пишіть', '.b-story': 'Розказуйте', '.b-serious': 'Тільки серйозно(о)',
        '.b-petition': 'Це неофіційно, але ВОНИ побачать 👀', '.b-complain': 'Шо там сталося? Розказуйте.',
        '.b-zbir': 'Додайте всю інформацію про збір', '.b-idea': 'Розказуйте вашу ідею',
        '.b-thank': 'Кому і за шо дякувати будете?', '.b-unpopular': 'Хочете срач розпочати?',
        '.b-shopopalo': 'Пишіть своє шопопало', '.b-admins': 'Ну пишіть адмінам...',
        '.rumors-container': 'Ну розказуйте, шо чули, шо бачили', '.b-problem': 'Де, шо і коли?',
        '.b-advice': 'Можливо вам підкажуть щось', '.b-birthday': 'Напишіть своє привітання'
    };

    const buttonFonts = {
        '.b-write-main': 'Fira Sans Extra Condensed', '.b-story': 'Vollkorn', '.b-serious': 'Philosopher',
        '.b-petition': 'Vollkorn', '.rumors-container': 'Balsamiq Sans', '.b-thank': 'Fira Sans Extra Condensed',
        '.b-complain': 'Oswald', '.b-unpopular': 'Dela Gothic One', '.b-zbir': 'Space Grotesk',
        '.b-idea': 'Oswald', '.b-shopopalo': 'Balsamiq Sans', '.b-birthday': 'Bad Script'
    };

    let toastTimeout;
    function showValkyToast(text) {
        if (!text) return;
        let toast = document.getElementById('valky-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'valky-toast';
            toast.className = 'valky-toast';
            document.body.appendChild(toast);
        }
        toast.innerText = text;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => toast.classList.remove('show'), 5000); 
    }

    function applyEditorColors() {
        if (!submitEditor) return;
        submitEditor.style.background = currentBgColor;
        submitEditor.style.color = currentTextColor;
        if (submitPreviewScreen.style.display === 'flex') updatePreviewCard();
    }

    function openSubmitOverlay(mode, placeholderText, defaultFont, titleText) {
        lastScrollY = window.scrollY;
        submitOverlay.className = `submit-overlay ${mode}-mode`;
        submitOverlay.style.display = 'flex';
        submitContent.style.display = 'flex';
        submitPreviewScreen.style.display = 'none';  
        submitSentScreen.style.display = 'none';
        document.body.classList.add('submit-open');

        submitEditor.innerHTML = '';
        const fontName = defaultFont || 'Inter';
        submitEditor.style.setProperty('font-family', `'${fontName}', sans-serif`, 'important');
        submitEditor.dataset.activeFont = `'${fontName}', sans-serif`;

        if (fontSelect) fontSelect.value = fontName;
        if (attachPreviewInline) attachPreviewInline.innerHTML = '';
        if (placeholderText) showValkyToast(placeholderText);

        currentAlign = 'auto';
        currentBgColor = (mode === 'hole') ? '#1a1a1a' : '#FAF8F4';
        currentTextColor = (mode === 'hole') ? '#FAF8F4' : '#222221';
        
        applyEditorColors();

        if (submitVideo) {
            submitVideo.style.display = 'block';
            submitVideo.src = (mode === 'mailbox') ? 'skrynka.mp4' : 'blackhole.mp4';
            submitVideo.load();
        }

        let innerTitle = submitContent.querySelector('.caps-label.dynamic-title');
        if (innerTitle) innerTitle.innerText = titleText || 'НАПИСАТИ';
    }

    function closeSubmitOverlay() {
        submitOverlay.style.display = 'none';
        document.body.classList.remove('submit-open');
        if (submitVideo) { submitVideo.pause(); submitVideo.src = ''; }
        window.scrollTo({ top: lastScrollY, behavior: 'instant' });
    }

    // Слухачі кнопок
    const mailboxButtons = ['.b-story', '.b-serious', '.b-petition', '.b-complain', '.b-birthday', '.b-zbir', '.b-idea', '.b-write-main', '.b-thank', '.b-advice'];
    const holeButtons = ['.b-unpopular', '.b-shopopalo', '.b-admins', '.rumors-container', '.b-problem'];

    mailboxButtons.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) el.addEventListener('click', () => openSubmitOverlay('mailbox', buttonPlaceholders[sel], buttonFonts[sel], buttonTitles[sel]));
    });

    holeButtons.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) el.addEventListener('click', () => openSubmitOverlay('hole', buttonPlaceholders[sel], buttonFonts[sel], buttonTitles[sel]));
    });

    if (closeSubmitBtn) closeSubmitBtn.addEventListener('click', closeSubmitOverlay);
    if (closeSentBtn) closeSentBtn.addEventListener('click', closeSubmitOverlay);
    submitOverlay.addEventListener('click', (e) => { if (e.target === submitOverlay) closeSubmitOverlay(); });

    // Теми та Текст
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentBgColor = btn.dataset.bg;
            currentTextColor = btn.dataset.color;
            applyEditorColors();
        });
    });

    if (fontSelect) {
        fontSelect.addEventListener('change', () => {
            const fontString = `'${fontSelect.value}', sans-serif`;
            submitEditor.style.setProperty('font-family', fontString, 'important');
            submitEditor.dataset.activeFont = fontString;
        });
    }

    submitEditor.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        document.execCommand('insertText', false, text);
        submitEditor.style.setProperty('font-family', submitEditor.dataset.activeFont || "'Inter', sans-serif", 'important');
    });

    submitEditor.addEventListener('input', () => {
        const len = submitEditor.innerText.replace(/\n$/, '').length;
        if (document.getElementById('char-counter')) document.getElementById('char-counter').innerText = len;
        const cardHint = document.getElementById('card-count-hint');
        if (cardHint) cardHint.innerHTML = len > 350 ? `Розділено на ${Math.ceil(len / 350)} картки` : '';
    });

    // Фото
    if (attachBtn && attachInput) {
        attachBtn.addEventListener('click', () => attachInput.click());
        attachInput.addEventListener('change', () => {
            const file = attachInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                if (attachPreviewInline) {
                    attachPreviewInline.innerHTML = `<img src="${e.target.result}" class="attach-thumb-full">`;
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // Вирівнювання
    if (document.getElementById('align-toggle-btn')) {
        document.getElementById('align-toggle-btn').addEventListener('click', () => {
            currentAlign = (currentAlign === 'center' || currentAlign === 'auto') ? 'left' : 'center';
            document.querySelector('#align-toggle-btn .material-symbols-outlined').innerText = currentAlign === 'center' ? 'format_align_center' : 'format_align_left';
            if (submitPreviewScreen.style.display === 'flex') updatePreviewCard();
        });
    }

    function generateValkyCardsHTML(rawHTML, photosArr, bgColor, textColor, font, authorName) {
        let html = '';
        const headerHTML = `<div class="valky-card-header-pill" style="transform:scale(0.85);margin-bottom:14px;"><img src="anonface.PNG"> <span class="pill-yellow">ВАЛКІВСЬКА</span> <span class="pill-white">ПРИЙМАЛЬНЯ</span></div>`;
        const authorHTML = `<div class="valky-card-author">${authorName}</div>`;
        
        let cleanText = rawHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<\/?[^>]+(>|$)/g, "");
        let chunks = cleanText.match(/.{1,350}(\s|$)/g) || [cleanText];

        chunks.forEach((chunk, idx) => {
            const align = currentAlign === 'auto' ? (chunk.length > 190 ? 'left' : 'center') : currentAlign;
            html += `<div class="valky-card" style="background:${bgColor}; color:${textColor}; font-family:${font} !important;">
                ${idx === 0 ? headerHTML : ''}
                <div class="valky-card-body" style="text-align:${align};">${chunk.replace(/\n/g, '<br>')}</div>
                ${idx < chunks.length - 1 || photosArr.length > 0 ? '<div class="valky-card-arrow">→</div>' : ''}
                ${authorHTML}
            </div>`;
        });

        photosArr.forEach(src => {
            html += `<div class="valky-card" style="background:${bgColor};">
                ${headerHTML}
                <div class="valky-card-photo-wrap"><img src="${src}" class="valky-card-photo"></div>
                ${authorHTML}
            </div>`;
        });
        return html;
    }

    function getActiveNickname(containerId) {
        const container = document.getElementById(containerId);
        const input = container ? container.querySelector('.anon-name-field') : null;
        return (input && input.value.trim() !== '') ? `від: ${input.value.trim()}` : '👤 Анонімно';
    }

    function updatePreviewCard() {
        const rawText = submitEditor.innerHTML || '';
        const nameVal = getActiveNickname('submit-content');
        let photosArr = [];
        if (attachPreviewInline) attachPreviewInline.querySelectorAll('img').forEach(img => photosArr.push(img.src));
        previewPostCard.innerHTML = generateValkyCardsHTML(rawText, photosArr, currentBgColor, currentTextColor, submitEditor.style.fontFamily);
    }

    if (submitActionBtn) {
        submitActionBtn.addEventListener('click', () => {
            submitContent.style.display = 'none';
            submitPreviewScreen.style.display = 'flex';
            updatePreviewCard();
            if (document.querySelector('.submit-header')) document.querySelector('.submit-header').style.display = 'none';
        });
    }

    if (previewEditBtn) {
        previewEditBtn.addEventListener('click', () => {
            submitPreviewScreen.style.display = 'none';
            submitContent.style.display = 'flex';
            if (document.querySelector('.submit-header')) document.querySelector('.submit-header').style.display = 'flex';
        });
    }

    if (previewSendBtn) {
        previewSendBtn.addEventListener('click', () => {
            const mode = submitOverlay.classList.contains('mailbox-mode') ? 'mailbox' : 'hole';
            submitPreviewScreen.style.background = 'transparent';
            [previewMetaLine, previewEditBtn, previewSendBtn, document.querySelector('.preview-label'), document.getElementById('style-config-panel')].forEach(el => { if(el) el.style.opacity = '0'; });

            if (submitVideo) {
                submitVideo.currentTime = 0;
                submitVideo.style.display = 'block';
                submitVideo.play();
            }
            previewPostCard.classList.add(`fly-to-${mode}`);
            setTimeout(() => {
                submitVideo.style.display = 'none';
                submitSentScreen.style.display = 'flex';
            }, mode === 'hole' ? 4600 : 1000);
        });
    }

    // === КІНЕЦЬ БЛОКУ САБМІТУ ===

// Атмосфера //
const atmoOverlay = document.getElementById('atmo-overlay');
const closeAtmoBtn = document.getElementById('close-atmo');
const atmoActionBtn = document.getElementById('atmo-action-btn');
const atmoContent = document.getElementById('atmo-content');
const atmoSentScreen = document.getElementById('atmo-sent-screen');
const closeAtmoSent = document.getElementById('close-atmo-sent');
const atmoStage = document.getElementById('atmo-stage');

function openAtmoOverlay() {
    lastScrollY = window.scrollY;

    if (document.activeElement) {
        document.activeElement.blur();
    }

    atmoOverlay.className = `submit-overlay atmo-overlay mailbox-mode`;
    atmoOverlay.style.display = 'flex';
    atmoOverlay.style.zIndex = '9999';
    atmoContent.style.display = 'flex';
    if (atmoSentScreen) atmoSentScreen.style.display = 'none';

    const atmoVideo = document.getElementById('atmo-video');
    if (atmoVideo) {
        atmoVideo.style.transition = 'none';
        atmoVideo.style.display = 'block';
        atmoVideo.load();
        atmoVideo.pause();
        atmoVideo.currentTime = 0;
    }

    void atmoOverlay.offsetWidth;

    document.body.classList.add('submit-open');

    currentAtmoLayout = 'single-polaroid';
    document.querySelectorAll('.atmo-layout-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.layout === 'single-polaroid');
    });

    if (typeof renderAtmoStage === 'function') {
        renderAtmoStage(currentAtmoLayout);
    }
}

function closeAtmoOverlay() {
    atmoOverlay.style.display = 'none';
    document.body.classList.remove('submit-open');
    window.scrollTo({ top: lastScrollY, behavior: 'instant' });

    const atmoHeader = document.querySelector('#atmo-overlay .submit-header');
    if (atmoHeader) atmoHeader.style.display = 'flex';

    if (typeof atmoVideo !== 'undefined' && atmoVideo) {
        atmoVideo.style.display = 'block';
        atmoVideo.style.filter = '';
        atmoVideo.style.zIndex = '';
        atmoVideo.pause();
        atmoVideo.load();
    }

    const atmoPreviewScreen = document.getElementById('atmo-preview-screen');
    const atmoContent = document.getElementById('atmo-content');
    const atmoSentScreen = document.getElementById('atmo-sent-screen');

    if (atmoPreviewScreen) atmoPreviewScreen.style.display = 'none';
    if (atmoContent) atmoContent.style.display = 'flex';
    if (atmoSentScreen) atmoSentScreen.style.display = 'none';

    const atmoImgs = document.querySelectorAll('.atmo-slot-img-fill');
    atmoImgs.forEach(img => {
        img.src = '';
        img.style.display = 'none';
        img.style.objectPosition = '50% 50%';
    });
    
    const atmoCaps = document.querySelectorAll('.atmo-polaroid-caption');
    atmoCaps.forEach(cap => cap.value = '');
    
    const atmoInputs = document.querySelectorAll('.atmo-polaroid-slot input[type="file"], .atmo-square-slot input[type="file"]');
    atmoInputs.forEach(inp => inp.value = '');
    
    const atmoPlaceholders = document.querySelectorAll('.atmo-slot-placeholder');
    atmoPlaceholders.forEach(pl => pl.style.display = 'flex');
}

    const atmoBtnEl = document.querySelector('.b-atmosphere');
if (atmoBtnEl) {
    atmoBtnEl.addEventListener('click', (e) => {
        e.preventDefault();
        openAtmoOverlay();
    });
}

    if (closeAtmoBtn) closeAtmoBtn.addEventListener('click', closeAtmoOverlay);
    if (closeAtmoSent) closeAtmoSent.addEventListener('click', closeAtmoOverlay);

    let currentAtmoLayout = 'single-polaroid';

    function buildAtmoSlot(isPolaroid, captionEnabled) {
    const slot = document.createElement('div');
    slot.className = isPolaroid ? 'atmo-polaroid-slot' : 'atmo-square-slot';
    
    const inner = document.createElement('div');
    inner.className = 'atmo-slot-placeholder';
    inner.innerHTML = `<span class="material-symbols-outlined" style="font-size:36px; color:#ccc;">add_photo_alternate</span>`;
    
    const img = document.createElement('img');
    img.className = 'atmo-slot-img-fill';
    img.style.display = 'none';
    img.style.objectFit = 'cover';
    img.style.objectPosition = '50% 50%';
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.style.display = 'none';
    
    slot.appendChild(inner);
    slot.appendChild(img);
    slot.appendChild(input);
    
    if (isPolaroid && captionEnabled) {
        const cap = document.createElement('input');
        cap.type = 'text';
        cap.className = 'atmo-polaroid-caption';
        cap.placeholder = 'підпис...';
        cap.maxLength = 35;
        slot.appendChild(cap);
    }
    
    let isDragging = false;
    let startX, startY, startPosX, startPosY;

    img.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) return;
        isDragging = false;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        const pos = img.style.objectPosition.split(' ');
        startPosX = parseFloat(pos[0]) || 50;
        startPosY = parseFloat(pos[1]) || 50;
    }, { passive: true });

    img.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) return;
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;

        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            isDragging = true;
            e.preventDefault();
            const percentX = (dx / img.offsetWidth) * 100;
            const percentY = (dy / img.offsetHeight) * 100;
            
            let newX = startPosX - (percentX * 1.5);
            let newY = startPosY - (percentY * 1.5);
            
            newX = Math.max(0, Math.min(100, newX));
            newY = Math.max(0, Math.min(100, newY));
            
            img.style.objectPosition = `${newX}% ${newY}%`;
        }
    }, { passive: false });
    
    slot.addEventListener('click', (e) => {
        if (e.target.tagName === 'INPUT' && e.target.type === 'text') return;
        if (isDragging) return;
        input.click();
    });
    
    input.addEventListener('change', () => {
        const files = Array.from(input.files);
        if (!files.length) return;
        
        const allSlots = document.querySelectorAll('#atmo-stage .atmo-polaroid-slot, #atmo-stage .atmo-square-slot');
        const currentIndex = Array.from(allSlots).indexOf(slot);
        
        files.forEach((file, i) => {
            const targetSlot = allSlots[currentIndex + i];
            if (targetSlot) {
                const targetImg = targetSlot.querySelector('.atmo-slot-img-fill');
                const targetInner = targetSlot.querySelector('.atmo-slot-placeholder');
                const reader = new FileReader();
                reader.onload = (ev) => {
                    targetImg.src = ev.target.result;
                    targetImg.style.display = 'block';
                    targetImg.style.objectPosition = '50% 50%';
                    if(targetInner) targetInner.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
        
        input.value = '';
    });
    
    return slot;
}



function renderAtmoStage(layout) {
    if (!atmoStage) return;
    atmoStage.innerHTML = '';
    atmoStage.className = 'atmo-stage atmo-stage--' + layout;
    
    if (layout === 'single-polaroid') {
        atmoStage.appendChild(buildAtmoSlot(true, true));
    } else if (layout === 'two-polaroid') {
        atmoStage.appendChild(buildAtmoSlot(true, true));
        atmoStage.appendChild(buildAtmoSlot(true, true));
        atmoStage.style.display = 'flex';
        atmoStage.style.gap = '10px';
    } else if (layout === 'single-square') {
        atmoStage.appendChild(buildAtmoSlot(false, false));
    } else if (layout === 'grid-four') {
        for (let i = 0; i < 4; i++) atmoStage.appendChild(buildAtmoSlot(false, false));
    }
}

document.querySelectorAll('.atmo-layout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.atmo-layout-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentAtmoLayout = btn.dataset.layout;
        renderAtmoStage(currentAtmoLayout);
    });
});

const atmoVideo = document.getElementById('atmo-video');

if (atmoVideo) {
    atmoVideo.src = 'skrynka.mp4';
    atmoVideo.load();
}

const atmoPreviewScreen = document.getElementById('atmo-preview-screen');
const atmoPreviewCard = document.getElementById('atmo-preview-card');
const atmoPreviewMetaLine = document.getElementById('atmo-preview-meta-line');
const atmoPreviewEditBtn = document.getElementById('atmo-preview-edit-btn');
const atmoPreviewSendBtn = document.getElementById('atmo-preview-send-btn');

let currentAtmoBg = '#FAF8F4';
const atmoBgDots = document.querySelectorAll('.atmo-bg-dot');

atmoBgDots.forEach(dot => {
    dot.addEventListener('click', () => {
        atmoBgDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        currentAtmoBg = dot.dataset.color;
        if (atmoStage) atmoStage.style.background = currentAtmoBg;
    });
});

if (atmoActionBtn) {
    atmoActionBtn.addEventListener('click', () => {
        const nameVal = getActiveNickname('atmo-content');
        let photosData = [];
        
        const slots = atmoStage.querySelectorAll('.atmo-polaroid-slot, .atmo-square-slot');
        slots.forEach(slot => {
            const img = slot.querySelector('.atmo-slot-img-fill');
            const cap = slot.querySelector('.atmo-polaroid-caption');
         
            if (img && img.style.display !== 'none' && img.src) {
                photosData.push({
                    src: img.src,
                    caption: cap && cap.value ? cap.value.trim() : '',
                    isPolaroid: slot.classList.contains('atmo-polaroid-slot'),
                    objPos: img.style.objectPosition || '50% 50%'
                });
            }
        });
        
        const textColor = ['#FAF8F4', '#FFFFFF'].includes(currentAtmoBg) ? '#1a1a1a' : '#FAF8F4';
        let html = '';
        
        const headerHTML = `
            <div class="valky-card-header-pill" style="transform: scale(0.85); margin-bottom: 14px; margin-top: -8px;">
                <img src="anonface.PNG" alt="Анонім">
                <span class="pill-yellow">ВАЛКІВСЬКА</span>
                <span class="pill-white">ПРИЙМАЛЬНЯ</span>
            </div>
        `;
        const authorHTML = `<div class="valky-card-author" style="color:${textColor};">${nameVal}</div>`;

        if (photosData.length > 0) {
            html += `
                <div class="valky-card" style="background:${currentAtmoBg}; justify-content: space-between; align-items: center;">
                    ${headerHTML}
                    <div style="display: flex; flex-wrap: wrap; justify-content: center; width: 100%; margin: auto 0; position: relative;">
            `;
            
            if (photosData.length === 4) {
                html += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; margin-bottom: 24px;">`;
                photosData.forEach(p => {
                    html += `
                        <div style="background: #fff; padding: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); border-radius: 2px;">
                            <img src="${p.src}" style="width: 100%; aspect-ratio: 1/1; object-fit: cover; object-position: ${p.objPos}; border: 1px solid #eee; display: block;">
                        </div>
                    `;
                });
                html += `</div>`;
            } else if (photosData.length === 2) {
                html += `<div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 320px; position: relative; margin-bottom: 24px;">`;
                photosData.forEach((p, idx) => {
                    const rotate = idx === 0 ? '-6deg' : '9deg';
                    const left = idx === 0 ? '0%' : 'auto';
                    const right = idx === 1 ? '-4%' : 'auto';
                    const zIndex = idx === 0 ? '1' : '2';
                    const top = idx === 0 ? '0px' : '55px';
                    const width = idx === 0 ? '58%' : '65%';
                    const shadow = idx === 0 ? '0 4px 15px rgba(0,0,0,0.15)' : '0 12px 30px rgba(0,0,0,0.3)';

                    html += `
                        <div style="position: absolute; left: ${left}; right: ${right}; top: ${top}; z-index: ${zIndex}; background: #fff; padding: 10px 10px 15px 10px; box-shadow: ${shadow}; border-radius: 2px; display: flex; flex-direction: column; width: ${width}; transform: rotate(${rotate});">
                            <img src="${p.src}" style="width: 100%; aspect-ratio: 1/1; object-fit: cover; object-position: ${p.objPos}; border: 1px solid #eee;">
                            <div style="flex: 1; display: flex; align-items: center; justify-content: center; min-height: 35px; padding-top: 5px;">
                                ${p.caption ? `<div style="font-family: 'Caveat', cursive; font-size: 16px; color: #111; text-align: center; line-height: 1;">${p.caption}</div>` : ''}
                            </div>
                        </div>
                    `;
                });
                html += `</div>`;
            } else {
                const p = photosData[0];
                const isSquare = !p.isPolaroid;
                const pb = isSquare ? '10px' : '10px';
                const minH = isSquare ? '0' : '40px';
                const w = isSquare ? '85%' : '80%';

                html += `
                    <div style="background: #fff; padding: 10px 10px ${pb} 10px; box-shadow: 0 6px 15px rgba(0,0,0,0.15); border-radius: 2px; display: flex; flex-direction: column; width: ${w}; margin-top: -10px; margin-bottom: 24px;">
                        <img src="${p.src}" style="width: 100%; aspect-ratio: 1/1; object-fit: cover; object-position: ${p.objPos}; border: 1px solid #eee; display: block;">
                        ${!isSquare ? `
                        <div style="display: flex; align-items: center; justify-content: center; min-height: ${minH}; padding-top: 8px;">
                            ${p.caption ? `<div style="font-family: 'Caveat', cursive; font-size: 22px; color: #111; text-align: center; line-height: 1;">${p.caption}</div>` : ''}
                        </div>
                        ` : ''}
                    </div>
                `;
            }

            html += `
                    </div>
                    ${authorHTML}
                </div>
            `;
        } else {
            html += `<div class="valky-card" style="background:${currentAtmoBg};"><div style="color:${textColor}; margin: auto;">Пусто</div></div>`;
        }

        atmoPreviewCard.innerHTML = html;
        if (atmoPreviewMetaLine) atmoPreviewMetaLine.style.display = 'none';
        
        atmoContent.style.display = 'none';
        atmoPreviewScreen.style.display = 'flex';
        
        const atmoHeader = document.querySelector('#atmo-overlay .submit-header');
        if (atmoHeader) atmoHeader.style.display = 'none';
    });
}





if (atmoPreviewEditBtn) {
    atmoPreviewEditBtn.addEventListener('click', () => {
        atmoPreviewScreen.style.display = 'none';
        atmoContent.style.display = 'flex';
        
        const atmoHeader = document.querySelector('#atmo-overlay .submit-header');
        if (atmoHeader) atmoHeader.style.display = 'flex';
    });
}

if (atmoPreviewSendBtn) {
    atmoPreviewSendBtn.addEventListener('click', () => {
        atmoPreviewScreen.style.background = 'transparent';
        if (atmoPreviewMetaLine) atmoPreviewMetaLine.style.opacity = '0';
        if (atmoPreviewEditBtn) atmoPreviewEditBtn.style.opacity = '0';
        atmoPreviewSendBtn.style.opacity = '0';
        
        const previewLabel = atmoPreviewScreen.querySelector('.preview-label');
        if (previewLabel) previewLabel.style.opacity = '0';

        if (atmoVideo) {
            atmoVideo.currentTime = 0;
            atmoVideo.style.zIndex = '14';
            atmoVideo.style.display = 'block';
            atmoVideo.style.filter = 'blur(0px) brightness(0.8)';
            atmoVideo.play().catch(e => console.log(e));
        }

        atmoPreviewCard.classList.add('fly-to-mailbox');

        setTimeout(() => {
            atmoPreviewScreen.style.display = 'none';
            atmoPreviewScreen.style.background = '';
            if (atmoVideo) atmoVideo.style.zIndex = '';
            atmoPreviewCard.classList.remove('fly-to-mailbox');
            if (atmoPreviewMetaLine) atmoPreviewMetaLine.style.opacity = '1';
            if (atmoPreviewEditBtn) atmoPreviewEditBtn.style.opacity = '1';
            atmoPreviewSendBtn.style.opacity = '1';
            if (previewLabel) previewLabel.style.opacity = '1';
        }, 1000);

const finishSend = () => {
    submitSentScreen.style.display = 'flex';
    submitSentScreen.style.background = 'rgba(0, 0, 0, 0.6)';
    submitSentScreen.style.backdropFilter = 'blur(6px)';
    submitSentScreen.style.webkitBackdropFilter = 'blur(6px)';
    submitSentScreen.style.zIndex = '9999';
};


        if (atmoVideo) {
            atmoVideo.onended = finishSend;
            setTimeout(() => {
                if (atmoSentScreen.style.display !== 'flex') finishSend();
            }, 8000);
        } else {
            finishSend();
        }
    });
}


// Фото і Мем //
const photoOverlay = document.getElementById('photo-overlay');
const closePhotoBtn = document.getElementById('close-photo');
const photoActionBtn = document.getElementById('photo-action-btn');
const photoContent = document.getElementById('photo-content');
const photoSentScreen = document.getElementById('photo-sent-screen');
const closePhotoSent = document.getElementById('close-photo-sent');
const photoDropZone = document.getElementById('photo-drop-zone');
const photoFileInput = document.getElementById('photo-file-input');
const photoPreviewImg = document.getElementById('photo-preview-img');
const photoDropInner = document.getElementById('photo-drop-inner');
const photoOverlayTitle = document.getElementById('photo-overlay-title');

function openPhotoOverlay(type, mode) {
    lastScrollY = window.scrollY;
    photoOverlay.className = `submit-overlay photo-overlay ${mode}-mode`;
    photoOverlay.style.display = 'flex';
    photoContent.style.display = 'flex';
    photoSentScreen.style.display = 'none';
    photoPreviewImg.style.display = 'none';
    photoDropInner.style.display = 'flex';
    photoFileInput.value = '';
    photoOverlayTitle.innerText = type === 'meme' ? 'ВІДПРАВИТИ МЕМ' : 'ВІДПРАВИТИ ФОТО';
    document.body.classList.add('submit-open');
    const captionWrap = document.getElementById('photo-caption-wrap');
    if (captionWrap) captionWrap.style.display = 'none';
    
    const photoVideo = document.getElementById('photo-video');
    if(photoVideo) {
        photoVideo.src = mode === 'hole' ? 'blackhole.mp4' : 'skrynka.mp4';
        photoVideo.load();
    }
}

function closePhotoOverlay() {
    photoOverlay.style.display = 'none';
    document.body.classList.remove('submit-open');
    window.scrollTo({ top: lastScrollY, behavior: 'instant' });
}

const photoBtnEl = document.querySelector('.b-photo');
const memeBtnEl = document.querySelector('.b-meme');
if (photoBtnEl) photoBtnEl.addEventListener('click', () => openPhotoOverlay('photo', 'mailbox'));
if (memeBtnEl) memeBtnEl.addEventListener('click', () => openPhotoOverlay('meme', 'hole'));

if (closePhotoBtn) closePhotoBtn.addEventListener('click', closePhotoOverlay);
if (closePhotoSent) closePhotoSent.addEventListener('click', closePhotoOverlay);

if (photoDropZone) {
    photoDropZone.addEventListener('click', () => photoFileInput.click());
}

if (photoFileInput) {
    photoFileInput.addEventListener('change', () => {
        const file = photoFileInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            photoPreviewImg.src = e.target.result;
            photoPreviewImg.style.display = 'block';
            photoDropInner.style.display = 'none';
            const captionWrap = document.getElementById('photo-caption-wrap');
            if (captionWrap) captionWrap.style.display = 'block';
        };
        reader.readAsDataURL(file);
    });
}

const photoPreviewScreen = document.getElementById('photo-preview-screen');
const photoPreviewCard = document.getElementById('photo-preview-card');
const photoPreviewMetaLine = document.getElementById('photo-preview-meta-line');
const photoPreviewEditBtn = document.getElementById('photo-preview-edit-btn');
const photoPreviewSendBtn = document.getElementById('photo-preview-send-btn');

if (photoActionBtn) {
    photoActionBtn.addEventListener('click', () => {
        const nameVal = getActiveNickname('photo-content');
        const rawText = document.getElementById('photo-caption') ? document.getElementById('photo-caption').value.trim() : '';
        let photosArr = [];
        
        if (photoPreviewImg && photoPreviewImg.src && photoPreviewImg.style.display !== 'none') {
            photosArr.push(photoPreviewImg.src);
        }

        const isHole = photoOverlay.classList.contains('hole-mode');
        const bg = isHole ? '#1a1a1a' : '#fff';
        const tc = isHole ? '#e0e0e0' : '#1a1a1a';
        const font = isHole ? 'Impact, sans-serif' : "'Inter', sans-serif";

        photoPreviewCard.innerHTML = generateValkyCardsHTML(rawText, photosArr, bg, tc, font, nameVal);
        if (photoPreviewMetaLine) photoPreviewMetaLine.style.display = 'none';
        
        photoContent.style.display = 'none';
        photoPreviewScreen.style.display = 'flex';
    });
}

if (photoPreviewEditBtn) {
    photoPreviewEditBtn.addEventListener('click', () => {
        photoPreviewScreen.style.display = 'none';
        photoContent.style.display = 'flex';
    });
}

if (photoPreviewSendBtn) {
    photoPreviewSendBtn.addEventListener('click', () => {
        const mode = photoOverlay.classList.contains('hole-mode') ? 'hole' : 'mailbox';
        photoPreviewScreen.style.background = 'transparent';
        if (photoPreviewMetaLine) photoPreviewMetaLine.style.opacity = '0';
        if (photoPreviewEditBtn) photoPreviewEditBtn.style.opacity = '0';
        photoPreviewSendBtn.style.opacity = '0';
        const previewLabel = photoPreviewScreen.querySelector('.preview-label');
        if (previewLabel) previewLabel.style.opacity = '0';

        const photoVideo = document.getElementById('photo-video');
        if (photoVideo) {
            photoVideo.currentTime = 0;
            photoVideo.style.zIndex = '14';
            photoVideo.style.display = 'block';
            photoVideo.style.filter = 'blur(0px) brightness(0.8)';
            photoVideo.play();
        }

        photoPreviewCard.classList.add(`fly-to-${mode}`);

        const animDuration = mode === 'hole' ? 4600 : 1000;

        setTimeout(() => {
            photoPreviewScreen.style.display = 'none';
            photoPreviewScreen.style.background = '';
            if (photoVideo) photoVideo.style.zIndex = '';
            photoPreviewCard.classList.remove(`fly-to-${mode}`);
            if (photoPreviewMetaLine) photoPreviewMetaLine.style.opacity = '1';
            if (photoPreviewEditBtn) photoPreviewEditBtn.style.opacity = '1';
            if (photoPreviewSendBtn) photoPreviewSendBtn.style.opacity = '1';
            if (previewLabel) previewLabel.style.opacity = '1';
        }, animDuration);

        const finishSend = () => {
            if (photoVideo) photoVideo.style.display = 'none';
            photoSentScreen.style.display = 'flex';
        };

        if (photoVideo) {
            photoVideo.onended = finishSend;
            setTimeout(() => { if (photoSentScreen.style.display !== 'flex') finishSend(); }, 8000);
        } else {
            finishSend();
        }
    });
}


    function showAchievementCard(text) {
    const cleanText = text.replace(/\n\n📸[\s\S]*/g, '').replace(/\n\n👀[\s\S]*/g, '');
    const lines = cleanText.split('\n').filter(l => l.trim());
    const titleLine = lines[0] || '';
    const numberMatch = titleLine.match(/Досягнення #(\d+)/);
    const number = numberMatch ? numberMatch[1] : '';
    const titleText = titleLine.replace(/Досягнення #\d+:?\s*/, '').trim();
    const descText = lines.slice(1).join(' ').trim();

    const card = document.createElement('div');
    card.className = 'achievement-card';
    card.innerHTML = `
        <div class="card-plastic-wrap">
            <span class="achievement-close" onclick="this.closest('.achievement-card').remove()">✕</span>
            <div class="card-inner">
                <div class="card-body">
                    <div class="card-number">Досягнення #${number}</div>
                    <div class="card-title">${titleText}</div>
                    <div class="card-desc">${descText}</div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(card);
}


function showDoorBubble(event, text, customDuration) {
    const doorEl = event.currentTarget;
    const rect = doorEl.getBoundingClientRect();
    const bubble = document.createElement('div');
    bubble.className = 'door-bubble';
    bubble.innerText = text;
    bubble.style.left = `${rect.left + rect.width / 2}px`;
    bubble.style.top = `${rect.top}px`;
    bubble.style.position = 'fixed';
    document.body.appendChild(bubble);
    const duration = customDuration || Math.max(2500, text.length * 60);
    setTimeout(() => bubble.remove(), duration);
}


    function showPredictionPopup(text) {
    const isArtifact = text.includes('артефакт');

    if (isArtifact) {
        const nameMatch = text.match(/<b>(.*?)<\/b>/);
        const artifactName = nameMatch ? nameMatch[1] : text;

        const card = document.createElement('div');
        card.className = 'artifact-card';
        card.innerHTML = `
            <div class="artifact-plastic-wrap">
                <span class="achievement-close" onclick="this.closest('.artifact-card').remove()">✕</span>
                <div class="artifact-inner">
                    <div class="artifact-image-area">
                        <span class="artifact-image-placeholder">🗿</span>
                    </div>
                    <div class="artifact-body">
                        <div class="artifact-label">Артефакт знайдено</div>
                        <div class="artifact-name">${artifactName}</div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(card);
        setTimeout(() => card.remove(), 8000);
        return;
    }

    const card = document.createElement('div');
    card.className = 'prediction-card';
    card.innerHTML = `<div class="prediction-card-text">${text}</div>`;
    document.body.appendChild(card);
    setTimeout(() => card.remove(), 8000);
}


    const doorBtn = document.getElementById('secret-door');
    if (doorBtn) {
    const bubbles = [
        "🤨", "🙄", "🥱", "🤖", "👊🏻", "🫵🏻", "👁️ 👁️", "👀", "💥", "🥁", "📸", "🔒", "👁️‍🗨️","🪗", "🎶", "🎧", "📬",
        "шо?", "гарного дня ❤️ (чи вечора)", "ви хто?", "та шо?", "по голові собі постукай", "закрито", "перерва", "пізніше", "нє","ніт", "скіп", "ой всьо", "а смисл?", "скіки можна?",  "touch grass, pls", "шось ти дуже активний", "я щас мамі твоїй подзвоню", "тут тільки для vip", "от дурне 🤠", "тю", "ходять тут всякі…", "ля", "таке враження, шо ти NPC якесь", "ми знаємо твій IP 👁️", "bruh", "і?", "Лудоманія — це хвороба 🎰", "наполегливість 10/10, результат 0/10", "ну да, я бачу тебе через фронталку, а шо?", "ну давай ще раз сто, раптом спрацює (ні)", "тіп реально тапає 💀", "let me sleep bro 🛌", "цьом в лобік ❤️",
        "гарного дня сонечко ☀️ (більше не стукай)", "на гербі Валок є три сливи, знаєш чому?", "я щас візьму віника", "в мене від тебе вже голова квадратна", "це не твій рівень, іди тапай у свою хвіртку", "за цими дверями ще один Посад", "я щас як відкрию",
        "Спробуй ще", "тут міг би бути промокод, але нема", "трохи нижче", "єслі шо, це просто двері", "в цьому немає сенсу", "two hours later", "не знаю шо тобі треба, але тут цього точно нема", "Ви знали, шо Валки були засновані у 1646 році як укріплений пункт (фортеця у вигляді дерев'яних зрубів — «валків») для захисту від набігів кочівників?",  "от не стукай", "мда", "я двічі не повторюю. чи повторюю?", "це не кнопка, кнопки внизу", "ну пиши вже шось, шо ти стукаєш", "уже можна починати писати", "тут нічо нема", "може хвате?", "ну ти дайош", "двері не відкриються, серйозно","ну і шо воно ото стукає", "та всьо", "шо нада", "що ви знаєте про Петра Панча?", "а тепер головою", "та..", "хто там?", "ніхто не відкриє", "закрито до завтра", "чо ти ото стукаєш?", "це не тапалка", "шо вам треба?", "нікого нема", "до побачення", "може завтра?", "буває", "шо там?", "хммм 🧐",
        "не в цей раз", "полегшало?", "а ви знали, шо тут можна відправити фото на канал?", "тут все анонімно, але гадості і вигаданий брєд про інших людей публікувати не будемо", "без сюрпризів", "знову ти?", "еххх", "хух",
        "Міша, всьо х*йня, давай по новой", "тут могла бути ваша реклама, але не буде", "шо такоє, хто ето", "та таке", "звідки стільки енергії?",
        "іди пороби шось може, нє?", "знову нє", "та ти шо", "давай, поламай тут все", "астанавітєсь", "це ж було вже"
    ];


        const valkyArtifacts = ["Артефакт"];

const achievements = {
    15: "Досягнення #1:\nЯкийсь підозрілий тіп біля дверей. \nВи постукали у двері Валківської Приймальні 15 разів. Ми вже подзвонили куди треба 🧐"
};

let hasTappedOnce = false;
let doorClicks = parseInt(localStorage.getItem('valky_door_clicks')) || 0;
let recentBubbles = [];
const fxClasses = ['door-shake'];

doorBtn.addEventListener('click', (event) => {
    const rect = doorBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 6; i++) {
        const splinter = document.createElement('div');
        splinter.className = 'door-splinter';
        document.body.appendChild(splinter);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 20 + Math.random() * 40;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity - 20;
        
        splinter.style.left = `${centerX}px`;
        splinter.style.top = `${centerY}px`;
        splinter.style.setProperty('--tx', `${tx}px`);
        splinter.style.setProperty('--ty', `${ty}px`);
        splinter.style.animation = 'splinterFly 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards';
        
        setTimeout(() => splinter.remove(), 600);
    }

    if (Math.random() < 0.02) {
        const ghost = document.createElement('div');
        ghost.className = 'door-ghost';
        ghost.innerText = '👻';
        document.body.appendChild(ghost);
        
        ghost.style.left = `${centerX - 15}px`;
        ghost.style.top = `${centerY - 15}px`;
        ghost.style.animation = 'ghostFloat 1.5s ease-out forwards';
        
        setTimeout(() => ghost.remove(), 1500);
    }

    if (!hasTappedOnce) {
        showDoorBubble(event, "колись тут будуть випадати передбачення, артефакти і ачівки", 6000);
        hasTappedOnce = true;
        return;
    }

    doorClicks++;
    localStorage.setItem('valky_door_clicks', doorClicks);

    if (achievements[doorClicks]) {
        showAchievementCard(achievements[doorClicks]);
    }

    if (doorClicks === 523) {
        doorBtn.classList.add('door-epic-falling');
        setTimeout(() => {
            doorBtn.classList.remove('door-epic-falling');
            doorBtn.innerText = '🚪';
            doorBtn.classList.add('door-broken-hole');
        }, 1200);
        return;
    }

    if (doorClicks > 523 && doorClicks <= 528) {
        if (doorClicks === 528) {
            doorBtn.classList.remove('door-broken-hole');
            doorBtn.innerText = '🚪';
            showDoorBubble(event, "Ці міцніші", 4000);
        } else {
            showDoorBubble(event, "Двері на базу", 2000);
        }
        return;
    }

    const rng = Math.random() * 100;
    
    if (rng < 1) {
        showPredictionPopup(`Знайдено артефакт:<br><br><b>${valkyArtifacts[0]}</b>`);
    } else {
        if (Math.random() < 0.40) {
            doorBtn.classList.remove(...fxClasses);
            void doorBtn.offsetWidth; 
            const randomFx = fxClasses[Math.floor(Math.random() * fxClasses.length)];
            doorBtn.classList.add(randomFx);
        } else {
            let availableBubbles = bubbles.filter(b => !recentBubbles.includes(b));
            if (availableBubbles.length === 0) availableBubbles = bubbles;
            
            const randomBubbleText = availableBubbles[Math.floor(Math.random() * availableBubbles.length)];
            recentBubbles.push(randomBubbleText);
            if (recentBubbles.length > 15) recentBubbles.shift();
            showDoorBubble(event, randomBubbleText);
        }
    }
});
}

const bagBtn = document.getElementById('bag-btn');
const bagOverlay = document.getElementById('bag-overlay');
const bagClose = document.getElementById('bag-close');
const bagContent = document.getElementById('bag-content');

const lootKey = 'valky_loot_v1';

function getLoot() {
    try {
        const data = JSON.parse(localStorage.getItem(lootKey));
        if (data && Array.isArray(data.achievements) && Array.isArray(data.predictions) && Array.isArray(data.artifacts)) {
            return data;
        }
        return { achievements: [], predictions: [], artifacts: [] };
    } catch {
        return { achievements: [], predictions: [], artifacts: [] };
    }
}

function saveLoot(loot) {
    localStorage.setItem(lootKey, JSON.stringify(loot));
}

function addToLoot(type, item) {
    const loot = getLoot();
    loot[type].push(item);
    saveLoot(loot);
    if (bagBtn) bagBtn.classList.add('has-items');
}

const initialLoot = getLoot();
if (bagBtn && (initialLoot.achievements.length || initialLoot.predictions.length || initialLoot.artifacts.length)) {
    bagBtn.classList.add('has-items');
}


function renderBagTab(tab) {
    const loot = getLoot();
    const items = loot[tab] || [];
    bagContent.innerHTML = '';

const emptyMessages = {
    achievements: `Ви ще не отримали жодного досягнення.
Стукайте у двері Валківської Приймальні.`,
    predictions: `Немає передбачень для вас.
Поки що.`,
    artifacts: `Ви ще не знайшли жодного артефакту.
Стукайте у двері Валківської Приймальні.`
};


    if (items.length === 0) {
        bagContent.innerHTML = `<div class="bag-empty">${emptyMessages[tab]}</div>`;
        return;
    }

    items.slice().reverse().forEach(item => {
        const el = document.createElement('div');
        el.className = 'bag-item';
        el.innerHTML = `
            <div class="bag-item-title">${item.title}</div>
            <div class="bag-item-sub">${item.preview}</div>
            <div class="bag-item-detail">${item.full}</div>
        `;
        el.addEventListener('click', () => el.classList.toggle('expanded'));
        bagContent.appendChild(el);
    });
}

let activeBagTab = 'achievements';


document.querySelectorAll('.bag-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.bag-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeBagTab = tab.dataset.tab;
        renderBagTab(activeBagTab);
    });
});

if (bagBtn) {
    bagBtn.addEventListener('click', () => {
        bagOverlay.classList.add('open');
        renderBagTab(activeBagTab);
    });
}

if (bagClose) {
    bagClose.addEventListener('click', () => bagOverlay.classList.remove('open'));
}

if (bagOverlay) {
    bagOverlay.addEventListener('click', (e) => {
        if (e.target === bagOverlay) bagOverlay.classList.remove('open');
    });
}
//рюкзак всьо//

//  Модалка Правил //
const rulesModal = document.getElementById('rules-modal');
const closeRulesBtn = document.getElementById('close-rules-btn');
const openRulesBtns = document.querySelectorAll('.open-rules-btn');

if (rulesModal && closeRulesBtn) {
    
    openRulesBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            rulesModal.style.display = 'flex';
        });
    });

  
    closeRulesBtn.addEventListener('click', () => {
        rulesModal.style.display = 'none';
    });

    
    rulesModal.addEventListener('click', (e) => {
        if (e.target === rulesModal) {
            rulesModal.style.display = 'none';
        }
    });
}
setInterval(() => {
    const mainBtn = document.getElementById('submit-action-btn');
    const mainEditor = document.getElementById('submit-editor');
    const attachPreview = document.getElementById('attach-preview-inline');
    
    if (mainBtn && mainEditor) {
        const hasText = mainEditor.innerText.trim().length > 0;
        const hasAttach = attachPreview && attachPreview.innerHTML.trim() !== '';
        const isValid = hasText || hasAttach;
        
        mainBtn.style.opacity = isValid ? '1' : '0.4';
        mainBtn.style.pointerEvents = isValid ? 'auto' : 'none';
    }

    const photoBtn = document.getElementById('photo-action-btn');
    const photoImg = document.getElementById('photo-preview-img');
    if (photoBtn && photoImg) {
        const src = photoImg.getAttribute('src');
        const isValid = photoImg.style.display !== 'none' && src && src.length > 5;
        photoBtn.style.opacity = isValid ? '1' : '0.4';
        photoBtn.style.pointerEvents = isValid ? 'auto' : 'none';
    }

    const atmoBtn = document.getElementById('atmo-action-btn');
    const atmoStage = document.getElementById('atmo-stage');
    if (atmoBtn && atmoStage) {
        let isValid = false;
        
        const imgs = atmoStage.querySelectorAll('img');
        imgs.forEach(img => {
            const src = img.getAttribute('src');
            if (src && src.trim().length > 5) isValid = true;
        });

        const divs = atmoStage.querySelectorAll('div');
        divs.forEach(div => {
            if (div.style.backgroundImage && div.style.backgroundImage !== 'none' && div.style.backgroundImage !== '') {
                isValid = true;
            }
        });

        atmoBtn.style.opacity = isValid ? '1' : '0.4';
        atmoBtn.style.pointerEvents = isValid ? 'auto' : 'none';
    }
}, 300);


});
