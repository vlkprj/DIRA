document.addEventListener("DOMContentLoaded", () => {

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
    
    //сабміт тута//

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
const attachPreview = document.getElementById('attach-preview');
const fontSelect = document.getElementById('font-select');
let lastScrollY = 0;

function openSubmitOverlay(mode) {
    lastScrollY = window.scrollY;
    submitOverlay.className = `submit-overlay ${mode}-mode`;
    submitOverlay.style.display = 'flex';
    submitContent.style.display = 'flex';
    submitSentScreen.style.display = 'none';
    submitVideo.style.display = 'block';
    document.body.classList.add('submit-open');

    const src = mode === 'mailbox' ? 'skrynka.mp4' : 'blackhole.mp4';
    submitVideo.src = src;
    submitVideo.load();
    submitVideo.pause();
    submitVideo.currentTime = 0;
    submitEditor.innerHTML = '';
    submitEditor.focus();
    
    currentBgColor = '#FAF8F4';
    currentTextColor = '#222221';
    textColorDots.forEach(d => d.classList.toggle('active', d.dataset.color === '#222221'));
    bgColorDots.forEach(d => d.classList.toggle('active', d.dataset.color === '#FAF8F4'));
    applyEditorColors();
}



function closeSubmitOverlay() {
    submitOverlay.style.display = 'none';
    submitOverlay.className = 'submit-overlay';
    submitEditor.innerHTML = '';
    const inlinePreview = document.getElementById('attach-preview-inline');
    if (inlinePreview) inlinePreview.innerHTML = '';
    submitVideo.pause();
    submitVideo.src = '';
    submitVideo.style.display = 'block';
    document.body.classList.remove('submit-open');
    window.scrollTo({ top: lastScrollY, behavior: 'instant' });
}



const mailboxButtons = ['.b-story', '.b-serious', '.b-petition', '.b-complain', '.b-zbir', '.b-idea', '.b-photo', '.side-tag'];
const holeButtons = ['.b-unpopular', '.b-shopopalo', '.b-admins', '.rumors-container', '.b-problem'];





mailboxButtons.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.addEventListener('click', () => openSubmitOverlay('mailbox'));
});

holeButtons.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.addEventListener('click', () => openSubmitOverlay('hole'));
});

if (closeSubmitBtn) closeSubmitBtn.addEventListener('click', closeSubmitOverlay);

if (closeSentBtn) closeSentBtn.addEventListener('click', closeSubmitOverlay);

submitOverlay.addEventListener('click', (e) => {
    if (e.target === submitOverlay) closeSubmitOverlay();
});


document.querySelectorAll('.toolbar-btn[data-cmd]').forEach(btn => {
    btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        document.execCommand(btn.dataset.cmd, false, null);
        btn.classList.toggle('active');
        submitEditor.focus();
    });
});

if (fontSelect) {
    fontSelect.addEventListener('change', () => {
        submitEditor.style.fontFamily = fontSelect.value;
        submitEditor.focus();
    });
}

if (attachBtn && attachInput) {
    attachBtn.addEventListener('click', () => attachInput.click());
    attachInput.addEventListener('change', () => {
        const file = attachInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'attach-thumb';
            attachPreview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

const textColorDots = document.querySelectorAll('.text-color-dot');
const bgColorDots = document.querySelectorAll('.bg-color-dot');

const safeTextColors = {
    '#FAF8F4': ['#222221'],
    '#262624': ['#FAF8F4', '#4282AA', '#B24A3B', '#D97757'],
    '#FFFFFF': ['#222221'],
};

const safeBgForText = {
    '#222221': ['#FAF8F4', '#FFFFFF'],
    '#B24A3B': ['#FAF8F4', '#FFFFFF'],
    '#4282AA': ['#262624', '#FAF8F4'],
    '#D97757': ['#262624', '#FAF8F4'],
};

let currentBgColor = '#FAF8F4';
let currentTextColor = '#222221';

function applyEditorColors() {
    submitEditor.style.background = currentBgColor;
    submitEditor.style.color = currentTextColor;
}

textColorDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const color = dot.dataset.color;
        const allowedBgs = safeBgForText[color];
        if (allowedBgs && !allowedBgs.includes(currentBgColor)) {
            currentBgColor = allowedBgs[0];
            bgColorDots.forEach(d => {
                d.classList.toggle('active', d.dataset.color === currentBgColor);
            });
        }
        currentTextColor = color;
        textColorDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        applyEditorColors();
        submitEditor.focus();
    });
});

bgColorDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const color = dot.dataset.color;
        const allowedTexts = safeTextColors[color];
        if (allowedTexts && !allowedTexts.includes(currentTextColor)) {
            currentTextColor = allowedTexts[0];
            textColorDots.forEach(d => {
                d.classList.toggle('active', d.dataset.color === currentTextColor);
            });
        }
        currentBgColor = color;
        bgColorDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        applyEditorColors();
        submitEditor.focus();
    });
});


const submitPreviewScreen = document.getElementById('submit-preview-screen');
const previewPostCard = document.getElementById('preview-post-card');
const previewMetaLine = document.getElementById('preview-meta-line');
const previewEditBtn = document.getElementById('preview-edit-btn');
const previewSendBtn = document.getElementById('preview-send-btn');

if (submitActionBtn) {
    submitActionBtn.addEventListener('click', () => {
        const nameVal = document.getElementById('submit-name').value.trim();
        previewPostCard.innerHTML = submitEditor.innerHTML || '<span style="color:#bbb">— порожньо —</span>';
        previewPostCard.style.background = currentBgColor || '#fff';
        previewPostCard.style.color = currentTextColor || '#1a1a1a';
        previewMetaLine.innerText = nameVal ? `від: ${nameVal}` : '👤 Анонімно';
        submitContent.style.display = 'none';
        submitPreviewScreen.style.display = 'flex';
    });
}

if (previewEditBtn) {
    previewEditBtn.addEventListener('click', () => {
        submitPreviewScreen.style.display = 'none';
        submitContent.style.display = 'flex';
    });
}

if (previewSendBtn) {
    previewSendBtn.addEventListener('click', () => {
        submitPreviewScreen.style.display = 'none';
        submitVideo.play();
        submitVideo.onended = () => {
            submitVideo.style.display = 'none';
            submitSentScreen.style.display = 'flex';
        };
        setTimeout(() => {
            if (submitSentScreen.style.display !== 'flex') {
                submitVideo.style.display = 'none';
                submitSentScreen.style.display = 'flex';
            }
        }, 8000);
    });
}

const capsPreviewScreen = document.getElementById('caps-preview-screen');
const capsPreviewCard = document.getElementById('caps-preview-card');
const capsPreviewMetaLine = document.getElementById('caps-preview-meta-line');
const capsPreviewEditBtn = document.getElementById('caps-preview-edit-btn');
const capsPreviewSendBtn = document.getElementById('caps-preview-send-btn');

if (capsActionBtn) {
    capsActionBtn.addEventListener('click', () => {
        const nameVal = document.getElementById('caps-name').value.trim();
        capsPreviewCard.innerText = capsEditor.value || '— порожньо —';
        capsPreviewMetaLine.innerText = nameVal ? `від: ${nameVal}` : '👤 Анонімно';
        capsContent.style.display = 'none';
        capsPreviewScreen.style.display = 'flex';
    });
}

if (capsPreviewEditBtn) {
    capsPreviewEditBtn.addEventListener('click', () => {
        capsPreviewScreen.style.display = 'none';
        capsContent.style.display = 'flex';
    });
}

if (capsPreviewSendBtn) {
    capsPreviewSendBtn.addEventListener('click', () => {
        capsPreviewScreen.style.display = 'none';
        capsSentScreen.style.display = 'flex';
    });
}

//сабміт кінець//

const atmoOverlay = document.getElementById('atmo-overlay');
const closeAtmoBtn = document.getElementById('close-atmo');
const atmoActionBtn = document.getElementById('atmo-action-btn');
const atmoContent = document.getElementById('atmo-content');
const atmoSentScreen = document.getElementById('atmo-sent-screen');
const closeAtmoSent = document.getElementById('close-atmo-sent');
const atmoGrid = document.getElementById('atmo-grid');

function openAtmoOverlay() {
    lastScrollY = window.scrollY;
    atmoOverlay.style.display = 'flex';
    atmoContent.style.display = 'flex';
    atmoSentScreen.style.display = 'none';
    atmoGrid.querySelectorAll('.atmo-slot-img').forEach(img => {
        img.style.display = 'none';
        img.src = '';
    });
    atmoGrid.querySelectorAll('.atmo-slot-inner').forEach(inner => {
        inner.style.display = 'flex';
    });
    atmoGrid.querySelectorAll('.atmo-file-input').forEach(inp => inp.value = '');
    document.body.classList.add('submit-open');
}


function closeAtmoOverlay() {
    atmoOverlay.style.display = 'none';
    document.body.classList.remove('submit-open');
    window.scrollTo({ top: lastScrollY, behavior: 'instant' });
}



const atmoBtnEl = document.querySelector('.b-atmosphere');
if (atmoBtnEl) atmoBtnEl.addEventListener('click', openAtmoOverlay);

if (closeAtmoBtn) closeAtmoBtn.addEventListener('click', closeAtmoOverlay);
if (closeAtmoSent) closeAtmoSent.addEventListener('click', closeAtmoOverlay);

if (atmoGrid) {
    atmoGrid.querySelectorAll('.atmo-slot').forEach(slot => {
        const input = slot.querySelector('.atmo-file-input');
        const img = slot.querySelector('.atmo-slot-img');
        const inner = slot.querySelector('.atmo-slot-inner');

        slot.addEventListener('click', () => input.click());

        input.addEventListener('change', () => {
            const file = input.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
                img.style.display = 'block';
                inner.style.display = 'none';
            };
            reader.readAsDataURL(file);
        });
    });

    document.querySelectorAll('.atmo-frame-pick').forEach(pick => {
        pick.addEventListener('click', () => {
            document.querySelectorAll('.atmo-frame-pick').forEach(p => p.classList.remove('active'));
            pick.classList.add('active');
            const frame = pick.dataset.frame;
            atmoGrid.querySelectorAll('.atmo-slot').forEach(slot => {
                slot.dataset.frame = frame;
            });
        });
    });
}

if (atmoActionBtn) {
    atmoActionBtn.addEventListener('click', () => {
        atmoContent.style.display = 'none';
        atmoSentScreen.style.display = 'flex';
    });
}

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

function openPhotoOverlay(mode) {
    lastScrollY = window.scrollY;
    photoOverlay.style.display = 'flex';
    photoContent.style.display = 'flex';
    photoSentScreen.style.display = 'none';
    photoPreviewImg.style.display = 'none';
    photoDropInner.style.display = 'flex';
    photoFileInput.value = '';
    photoOverlayTitle.innerText = mode === 'meme' ? 'ВІДПРАВИТИ МЕМ' : 'ВІДПРАВИТИ ФОТО';
    document.body.classList.add('submit-open');
}


function closePhotoOverlay() {
    photoOverlay.style.display = 'none';
    document.body.classList.remove('submit-open');
    window.scrollTo({ top: lastScrollY, behavior: 'instant' });
}



const photoBtnEl = document.querySelector('.b-photo');
const memeBtnEl = document.querySelector('.b-meme');
if (photoBtnEl) photoBtnEl.addEventListener('click', () => openPhotoOverlay('photo'));
if (memeBtnEl) memeBtnEl.addEventListener('click', () => openPhotoOverlay('meme'));

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
        };
        reader.readAsDataURL(file);
    });
}

if (photoActionBtn) {
    photoActionBtn.addEventListener('click', () => {
        photoContent.style.display = 'none';
        photoSentScreen.style.display = 'flex';
    });
}

const capsOverlay = document.getElementById('caps-overlay');
const closeCapsBtn = document.getElementById('close-caps');
const capsActionBtn = document.getElementById('caps-action-btn');
const capsEditor = document.getElementById('caps-editor');
const capsSentScreen = document.getElementById('caps-sent-screen');
const closeCapsSet = document.getElementById('close-caps-sent');
const capsContent = document.getElementById('caps-content');

function openCapsOverlay() {
    lastScrollY = window.scrollY;
    capsOverlay.style.display = 'flex';
    capsContent.style.display = 'flex';
    capsSentScreen.style.display = 'none';
    capsEditor.value = '';
    document.body.classList.add('submit-open');
    capsEditor.focus();
}


function closeCapsOverlay() {
    capsOverlay.style.display = 'none';
    capsEditor.value = '';
    document.body.classList.remove('submit-open');
    window.scrollTo({ top: lastScrollY, behavior: 'instant' });
}


const capsBtn = document.querySelector('.b-capslock');
if (capsBtn) capsBtn.addEventListener('click', openCapsOverlay);

if (closeCapsBtn) closeCapsBtn.addEventListener('click', closeCapsOverlay);
if (closeCapsSet) closeCapsSet.addEventListener('click', closeCapsOverlay);

if (capsEditor) {
    capsEditor.addEventListener('input', () => {
        const pos = capsEditor.selectionStart;
        capsEditor.value = capsEditor.value.toUpperCase();
        capsEditor.setSelectionRange(pos, pos);
    });
    capsEditor.addEventListener('keypress', (e) => {
        if (e.key.length === 1) {
            e.preventDefault();
            const pos = capsEditor.selectionStart;
            const val = capsEditor.value;
            capsEditor.value = val.substring(0, pos) + e.key.toUpperCase() + val.substring(pos);
            capsEditor.setSelectionRange(pos + 1, pos + 1);
        }
    });
}

if (capsActionBtn) {
    capsActionBtn.addEventListener('click', () => {
        capsContent.style.display = 'none';
        capsSentScreen.style.display = 'flex';
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


function showDoorBubble(event, text) {
    const doorEl = event.currentTarget;
    const rect = doorEl.getBoundingClientRect();
    const bubble = document.createElement('div');
    bubble.className = 'door-bubble';
    bubble.innerText = text;
    bubble.style.left = `${rect.left + rect.width / 2}px`;
    bubble.style.top = `${rect.top + window.scrollY}px`;
    bubble.style.position = 'fixed';
    bubble.style.top = `${rect.top}px`;
    document.body.appendChild(bubble);
    setTimeout(() => bubble.remove(), 2500);
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
            "🤨", "🙄", "🥱", "🤖", "👊🏻", "🫵🏻", "👁️ 👁️", "👀", "💥💥💥", "🥁", "📸", "🔒", "👁️‍🗨️",
            "шо?", "гарного дня ❤️ (чи вечора)", "ви хто?", "та шо?", "по голові собі постукай", "закрито", "перерва", "пізніше", "нє","ніт",  "скіп", "ой, всьо", "а смисл?", "скіки можна?",  "touch grass, pls", "шось ти дуже активний", "я щас мамі твоїй подзвоню", "тобі шо, медом намазано?", "тут тільки для vip", "от дурне 🤠", "тю", "ходять тут всякі…", "ля", "таке враження, шо ти NPC якесь", "ми знаємо твій IP 👁️", "bruh", "і?", "Лудоманія — це хвороба 🎰", "наполегливість 10/10, результат 0/10", "ну да, я бачу тебе через фронталку, а шо?", "давай ще раз 100, раптом спрацює (ні)", "тіп реально тапає 💀", "let me sleep bro 🛌", "цьом в лобік ❤️",
    "гарного дня сонечко ☀️ (більше не стукай)", "на гербі Валок є три сливи, знаєш чому?", "я щас візьму віника", "в мене від тебе вже голова квадратна", "це не твій рівень, йди тапай у хвіртку", "за цими дверями ще один Посад",
            "Спробуй ще", "от не стукай", "Мда", "я двічі не повторюю! чи повторюю?", "це не кнопка, кнопки внизу", "ну пиши вже шось, шо ти стукаєш", "уже можна починати писати", "тут нічо нема", "може хвате?", "ну ти дайош", "двері не відкриються, серйозно","ну і шо воно ото стукає", "та всьо", "шо нада", "робити вобщє нічого", "а тепер головою", "та..", "хто там?", "ніхто не відкриє", "закрито до завтра", "чо ти стукаєш?", "це не тапалка", "Шо вам треба?", "нікого нема", "я щас різко вийду, ти ляжеш", "до побачення", "може завтра?", "буває", "шо там?", "хммм 🧐",
            "не в цей раз", "полегшало?", "а ви знали, шо тут можна відправити фото на канал?", "тут все анонімно, але гадості і вигаданий брєд про інших людей публікувати не будемо", "без сюрпризів", "знову ти?", "еххх", "хух",
            "Міша, всьо х*йня, давай по новой", "тут могла бути ваша реклама, але не буде", "шо такоє, хто ето", "та таке", "звідки стільки енергії?",
            "іди пороби шось може, нє?", "знову нє", "та ти шо", "давай, поламай тут все", "астанавітєсь", "це ж було вже"
        ];

        const valkyArtifacts = [
            "артефакт у розробці ⏳", "артефакт у розробці ⏳", "артефакт у розробці ⏳", "артефакт у розробці ⏳",
            "артефакт у розробці ⏳", "артефакт у розробці ⏳",
            "артефакт у розробці ⏳", "артефакт у розробці ⏳", "артефакт у розробці ⏳",
            "артефакт у розробці ⏳", "артефакт у розробці ⏳", "артефакт у розробці ⏳",
            "артефакт у розробці ⏳", "артефакт у розробці ⏳", "артефакт у розробці ⏳"
        ];

       const noArtifactsText = "\n\n👀 Ви зможете додавати в додаток власні артефакти починаючи з 3 рівня";

const getArtifactText = (count) => `\n\n📸 **Ти відкрив(ла) можливість додавати власні артефакти! Твій ліміт: ${count} шт.**
Знайди і сфоткай якусь унікальну мікро-деталь Валок. Це може бути стара табличка, лавочка, кущ, квіточка, відпавша від будівлі цеглина, доска, якийсь дурнуватий напис на стіні, дивний пеньок, мусорка, чийсь загублений ключ, чийсь гуляючий котик, декоративний елемент, красива клумба, ну або пакет з Аврори, який епічно застряг на дереві. Короче — будь-який цікавий (або максимально нецікавий) об'єкт нашої локальної цивілізації. 

🛑 **Жорсткі правила:** КАТЕГОРИЧНО не фоткаємо військових, техніку, будь-яку критичну інфраструктуру та обличчя людей. Без винятків, такі фотки одразу йдуть у смітник. Ми збираємо лише дрібні артефакти міста.

Обовʼязково опиши що це, де і коли ти це сфоткав(ла), додай своє імʼя або нік, який буде відображатись. Відправляй фото разом зі скріншотом цієї картки сюди: @valkyshobot 👈🏻 Якщо все ок — ми додамо твій артефакт у додаток, щоб інші теж могли його знайти 🔍`;


        const achievements = {
            15: "Досягнення #1:\nЯкийсь підозрілий тіп біля дверей. Ви постукали у двері Валківської Приймальні 15 разів. Ми вже подзвонили куди треба 🧐" + noArtifactsText,
            50: "Досягнення #2:\nХатіко на мінімалках 🐕\nВ розробці 🕝. Ви постукали у двері Валківської Приймальні 50 разів." + noArtifactsText,
            100: "Досягнення #3:\nДятел Вуді, бл*%# 🪵\nВи постукали у двері Валківської Приймальні 100 раз." + noArtifactsText,
            200: "Досягнення #4:\nКлінічний випадок 🏥\nЦе не досягнення, це діагноз. Ви постукали у двері Валківської Приймальні 200 раз." + getArtifactText(1),
            250: "Досягнення #5:\nСвідок Єгови чи просто на лічильник глянути? 📖\nВи постукали у двері Валківської Приймальні 250 раз." + getArtifactText(2),
            300: "Досягнення #6:\nЗадротіще 🤓\nВи постукали у двері Валківської Приймальні 300 раз." + getArtifactText(3),
            523: "Досягнення #7:\nБандіт 😎\nНа 523 раз Ви вибили нахер двері Валківської Приймальні. Тепер ставте нові." + getArtifactText(4),
            777: "Досягнення #8:\nЛегенда ✨\nВи легендарно постукали у двері легендарної Валківської Приймальні легендарні 777 раз. Легендарно безглуздо🎰. Нагадаємо на всяк випадок, шо тут нема фріспінів, грошей вам за це ніхто не дасть, джекпоту не буде 👋🏻" + getArtifactText(5),
            888: "Досягнення #9:\nМамин езотерик 🔮\nВи постукали у двері Валківської Приймальні 888 разів — згідно нумерології це число нескінченного багатства і успіху, а також кількість разів, коли можна було вже зупинитись і зайнятись чимось кориснішим." + getArtifactText(6),
            1000: "Досягнення #10:\nАмбасадор тунельного синдрому 🤲\nВи постукали у двері Валківської Приймальні 1000 разів." + getArtifactText(7),
            2000: "Досягнення #11:\nБотяра якийсь 🤖\nВи постукали у двері Валківської Приймальні 2000 раз. Ну ви або зовсім таво або проходьте капчу." + getArtifactText(8),
            2345: "Досягнення #12:\nПохибка симуляції 👾\nАномалія. Ви абсолютно унікальні. Цього не мало статися. Ви постукали у двері Валківської Приймальні рівно 2345 рази. Ми цього не планували. Доведеться придумувати ще щось." + getArtifactText(9),
            5000: "Досягнення #13:\nHEEEEERE'S JOHNNY! 🪓\nВи постукали у двері Валківської Приймальні 5000 разів. Ви офіційно зловили шизу як Джек Ніколсон у «Сяйві». Візьміть вже сокиру і розрубайте цей фронтенд к хєрам." + getArtifactText(10),
            8000: "Досягнення #14:\nЛисий хомʼяк. Лістинг скасовується 📉\nВи постукали у двері Валківської Приймальні 8000 раз. Бро реально думає, шо це якась тапалка в Телеграмі і зараз з дверей посиплеться кріпта? Дропу не буде, розходимось, ти затапав своє життя в нуль, хомʼячок." + getArtifactText(11),
            9999: "Досягнення #15:\nВиклик санітарів 🚑\nЧо ви до*бались до цих дверей? Ви постукали у двері Валківської Приймальні 9999 раз — це ненормально. За вами вже виїхала бригада. Будь ласка, просто покладіть телефон на підлогу, відійдіть від нього на три кроки і не робіть різких рухів." + getArtifactText(12),
            10000: "Досягнення #16:\nGOAT. Найпотужніша потужність. Рівень наполегливості — БОГ. 👑\nВи постукали у двері Валківської Приймальні 10000 раз. Далі нічого немає, чесно! Ніяких феєрверків, фанфар чи скрімерів — справжня велич завжди тиха і трохи меланхолійна. Це кінець шляху. Хай щастить!" + getArtifactText(15)
        };
       


        const names = ["Юля", "Оля", "Аліна", "Альона", "Яна", "Віка", "Каріна", "Лєна", "Свєта", "ота тьотка", "тьоть Валя", "ота бабуля", "Аня", "Настя", "Даша", "Оксана", "Марина"];
        const names2 = ["Саня", "Дімон", "Влад", "Оля", "Аліна", "Каріна", "ота дивна дівчина", "отой странний чувак", "Таня", "тьоть Таня", "Макс", "Ігорьок", "дядя Толя", "той тіп з центру", "Настя", "Ріта", "Наташа", "Даша", "Ліза", "Серьога", "Артем", "Денчик", "Жека", "Рома"];
        const predictions = [
"✨🔮✨ Зірки кажуть, що сьогодні тобі пощастить, якщо по дорозі в Посад ти посміхнешся дівчині, яка буде йти назустріч і балакати по телефону",
"✨🔮✨ Зірки кажуть, що зараз твої плани на цей місяць виглядають так само перспективно, як недобудова ДК в центрі.",
"✨🔮✨ Зірки кажуть, що тобі треба терміново вийти прогулятись через парк Сонечко — там ти обовʼязково побачиш щось, що надихне тебе на щось нове.",
"✨🔮✨ Зірки кажуть, що давно вже пора сфоткати і продати той мотлох на Валківському Базарчику",
"✨🔮✨ Зірки кажуть, що Всесвіту сьогодні глибоко пофіг на твої проблеми, тому просто розслабся і не вий*буйся",
"✨🔮✨ Зірки кажуть, що сьогодні ідеальний день, щоб багатозначно мовчати і дивитись на всіх навколо як на гівно",
"✨🔮✨ Зірки кажуть, що якщо ти планував(ла) сьогодні почати нове життя, то зірки поржали і перенесли це на наступний понеділок",
"✨🔮✨ Зірки кажуть, що сьогодні удача посміхається всім, окрім тебе. Просто змирись, закрий телефон і лягай спати.",
"✨🔮✨ Зірки кажуть, що ти сьогодні випромінюєш вайб людини, яка забула пакет з пакетами вдома і тепер змушена купувати новий на касі",
"✨🔮✨ Зірки кажуть, що єдине, шо тебе сьогодні врятує — піца і роли з Вишні 🍒",
"✨🔮✨ Зірки кажуть, що ретроградний Меркурій на цей раз ні до чого, ти просто сам(а) любиш ускладнювати життя собі й іншим",
"✨🔮✨ Зірки кажуть, що скоро ти порішаєш всі свої проблєми як справжній бос, але не розслабляйся, бо попереду ще багато цікавого",
"✨🔮✨ Зірки кажуть, що Всесвіт посилає тобі знаки, але ти занадто зайнятий(а) якоюсь херньою в інтернеті, щоб їх помітити. Вийди погуляй, подихай свіжим повітрям.",
"✨🔮✨ Зірки кажуть, що єдине твоє досягнення сьогодні — це те, що ти нікого не прибив(ла). Ну, поки що.",
"✨🔮✨ Зірки кажуть, що твої плани на цей тиждень тримаються на суперклеї і фразі «якось воно буде»",
"✨🔮✨ Зірки кажуть, що твоя мотивація сьогодні вийшла з чату і видалила акаунт. Сьогодні краще не змушувати себе робити те, на що не вистачає енергії.",
"✨🔮✨ Зірки кажуть, що сьогодні ти випромінюватимеш вайб людини, яка пожартувала, але ніхто не засміявся 💔",
"✨🔮✨ Зірки кажуть, що краще сьогодні обійти парк Сонечко десятою дорогою, бо там ти стопудово зустрінеш того, кого ти дуже не хочеш побачити",
"✨🔮✨ Зірки нічо не кажуть, сорян",
"✨🔮✨ Зірки кажуть, що на тебе чекає раптова зустріч десь біля Норми, від якої ти не зможеш відмазатись",
"✨🔮✨ Зірки кажуть «боже, який позор»",
"✨🔮✨ Зірки кажуть, що твої плани на вечір обламаються швидше, ніж ти встигнеш дійти до центру",
"✨🔮✨ Зірки радять тобі просто сісти на лавочку біля площі і філософськи споглядати цей тлєн",
"✨🔮✨ Зірки кажуть, що твої спроби бути дорослою і відповідальною людиною сьогодні зазнають нищівного фіаско",
"✨🔮✨ Зірки радять не дуже засмучуватись, якщо сьогодні ти будуть часто казати «не тупі». Просто день такий дурнуватий.",
"✨🔮✨ Зірки кажуть, що сьогодні краще <s>закрити є*ало і не вийо*уватись </s> утриматись від непроханих коментарів в сторону інших людей.",
"✨🔮✨ Зірки кажуть, що якщо ти сьогодні ні в чому не налажаєш, день можна вважати прожитим даремно",
"✨🔮✨ Зірки кажуть, що сьогодні ідеальний день, щоб драматично постояти біля ставка під сумну музику, вдаючи з себе головного героя.",
"✨🔮✨ Зірки кажуть, що сьогодні ти приймеш дуже зважене, логічне і абсолютно неправильне рішення",
"✨🔮✨ Зірки кажуть: якщо сьогодні хтось напише «шо ти?», сміливо відповідай «нічо» — і навіть не думай питати «а ти шо?».",
"✨🔮✨ Зірки кажуть, що {NAME2} вважає, що ти повне єбобо, і зірки, якщо чесно, абсолютно згодні",
"✨🔮✨ Зірки кажуть, що {NAME} скинула твій профіль подружкам у приватний чат в тг з підписом «ПХАХАХАХ»",
"✨🔮✨ Зірки кажуть, що {NAME} оцінила твій сьогоднішній лук на 0/10",
"✨🔮✨ Зірки кажуть: якщо сьогодні ви натрапите на алкаша поблизу музею, уважно прислухайтесь до того, що він намагається сказати — іноді Всесвіт говорить через дуже неочікуваних спікерів.",
"✨🔮✨ Зірки кажуть, що сьогодні хтось біля Посаду подивиться на тебе так, ніби ти винен йому гроші. І знаєш, можливо, ти дійсно винен.",
"✨🔮✨ Зірки кажуть, що хтось щойно балакав про твою прічоску. І повір, це були далеко не компліменти…",
"✨🔮✨ Зірки кажуть, що твоя карма сьогодні в мінусі, тому будь обережним_ою на пішохідних переходах і нікому не хами",
"✨🔮✨ Зірки кажуть, що сьогодні на тебе чекає раптовий прибуток. Може, знайдеш сотку в старій куртці, а може, просто не витратиш зайвого на хєрню, що вже тіпа як перемога",
"✨🔮✨ Зірки кажуть, що ти сьогодні виглядаєш настільки класно, що навіть бабулі-сусідки не знають до чого до*атись",
"✨🔮✨ Зірки кажуть, що сьогодні твій мозок раптом видасть геніальну ідею. Головне — не провтикай її (як завжди).",
"✨🔮✨ Зірки кажуть, що сьогодні тебе ніхто не буде бісити. Це статистична аномалія, тож насолоджуйся.",
"✨🔮✨ Зірки кажуть, що тебе очікує щось дуже романтичне 💖 . Ну або хоча б твій кіт САМ прийде до тебе помурчати на коліна, що об'єктивно набагато краще.",
"✨🔮✨ Зірки кажуть, що ти сьогодні зробиш правильний вибір. Навіть якщо це буде просто вибір між темним по акції в Посаді і світлим, яке продається тільки в Нормі — він буде ідеальним.",
"✨🔮✨ Зірки кажуть, що хтось сьогодні скаже про тебе щось дуже хороше за твоєю спиною. Так, таке теж буває.",
"✨🔮✨ Зірки кажуть: «Ми звідси бачимо твій екранний час, і це тупо клініка»",
"✨🔮✨ Зірки кажуть: «Давай ти просто сьогодні помовчиш, окей?»",
"✨🔮✨ Зірки кажуть: «Сьогодні ідеальний день, щоб перестати драматизувати кожну х**ню і просто розслабитись»",
"✨🔮✨ Зірки кажуть: «Краще б ти сьогодні взагалі з ліжка не вилазило, чесне слово…»",
"✨🔮✨ Зірки кажуть: «Ми бачили твою історію пошуку. МДА….»",
"✨🔮✨ Зірки совєтують попити магній, бо нікому не подобається оцей твій вираз обличчя, ну чесно",
"✨🔮✨ Зірки кажуть: «Ти реально збираєшся вийти в люди з таким виразом обличчя?»",
"✨🔮✨ Зірки кажуть: «Все буде добре ❤️»",
"✨🔮✨ Зірки попереджають: сьогодні не варто довіряти будь-кому, кого звуть Настя або Каріна. Навіть якщо це ви самі. Не довіряйте собі складні рішення.",
"✨🔮✨ Зірки не радять заводити політичні бесіди з таксистами в центрі",
"✨🔮✨ Зірки не радять сьогодні вірити людям, які кажуть, що «та тут пройтись хвилин десять»",
"✨🔮✨ Зірки попереджають: твій внутрішній компас сьогодні зламаний, тому замість світлого майбутнього ти можеш випадково зайти на Коржівку і заблукати",
"✨🔮✨ Зірки не радять сьогодні надягати білі кросовки",
"✨🔮✨ Зірки прогнозують, що твоя аура сьогодні випромінюватиме вайб людини, яка щойно запізнилася на останню маршрутку з Ков'яг",
"✨🔮✨ Зірки кажуть: «сьогодні удача на твоєму боці».",
"✨🔮✨ Зірки кажуть, що охраннік в Посаді реально вважає, що ти якийсь мутний.",
"✨🔮✨ Зірки кажуть, що сьогодні тобі може подзвонити {NAME2}. А може і не подзвоне.",
"✨🔮✨ Зірки кажуть, що хтось з твоїх знайомих, хто зараз постить фотки з Європи, іноді спеціально заходить на твою сторінку, щоб підняти собі самооцінку",
"✨🔮✨ Зірки кажуть, що сьогодні є всі шанси зловити екзистенційну кризу прямо посеред Посаду, обираючи між пєльменями і гречкою",
"✨🔮✨ Зірки радять приготуватися: сьогодні тебе може несподівано пробити на шалену продуктивність.",
"✨🔮✨ Зірки кажуть, що сьогодні доведеться робити вигляд, ніби тебе реально хвилюють проблеми інших людей.",
"✨🔮✨ Зірки кажуть, що {NUM1} — це твоє щасливе число сьогодні.",
"✨🔮✨ Зірки попереджають: є величезна ймовірність почути крутий комплімент, на який доведеться якось адекватно зреагувати. Підготуйтесь!",
"✨🔮✨ Зірки кажуть, що сьогодні твоя інтуїція працює на рівні екстрасенса, тому всі спонтанні рішення будуть абсолютно геніальними",
"✨🔮✨ Зірки радять звернути увагу на дрібниці: сьогодні Всесвіт буде підкидати маленькі приємності і знаки на кожному кроці. Навіть якщо це крок в калюжу.",
"✨🔮✨ Зірки попереджають: твоя харизма сьогодні може випадково розбити чиєсь сердечко 💔✨",
"✨🔮✨ Зірки гарантують, що твої жарти сьогодні залітатимуть на ура, тому не стримуй свого внутрішнього стендапера"
];

               function getPrediction() {
            let text = predictions[Math.floor(Math.random() * predictions.length)];
                text = text.replace('{NAME}', names[Math.floor(Math.random() * names.length)]);
                 text = text.replace('{NAME2}', names2[Math.floor(Math.random() * names2.length)]);
            
        
            text = text.replace('{NUM1}', Math.floor(Math.random() * 50) + 1);
            
            return text;
        }


        let doorClicks = 0;
        let hasTappedOnce = false;
        let lastPredictionAt = -10;

        doorBtn.addEventListener('click', (event) => {
            if (!hasTappedOnce) {
                showDoorBubble(event, "тут може випасти передбачення, артефакт або ачівка, але не в цей раз і не тобі, спробуй ще");
                hasTappedOnce = true;
                return;
            }

            doorClicks++;

            if (doorClicks === 2) {
                bagBtn.classList.add('visible');
            }

            if (achievements[doorClicks]) {
                showAchievementCard(achievements[doorClicks]);
                
                const achText = achievements[doorClicks];
                const achLines = achText.split('\n');
                addToLoot('achievements', {
                    title: achLines[0] || 'Досягнення',
                    preview: achLines[1] ? achLines[1].substring(0, 60) + '...' : '',
                    full: achLines.slice(1).join('<br>')
                });

                if (doorClicks === 523) {
                    doorBtn.classList.add('door-falling');
                    setTimeout(() => {
                        doorBtn.innerText = '◼️';
                        doorBtn.classList.remove('door-falling');
                    }, 1000);
                }
                return;
            }

            const rng = Math.random() * 100;
            const predictionCooldown = 36;

            if (rng < 1) {
                const randomArtifact = valkyArtifacts[Math.floor(Math.random() * valkyArtifacts.length)];
                showPredictionPopup(`Знайдено артефакт:<br><br><b>${randomArtifact}</b>`);
                
                addToLoot('artifacts', {
                    title: randomArtifact,
                    preview: 'Валківський артефакт',
                    full: `Знайдено: ${randomArtifact}`
                });

            } else if (rng < 22 && (doorClicks - lastPredictionAt) >= predictionCooldown) {
                const predText = getPrediction();
                showPredictionPopup(`🔮 ${predText}`);
                
                addToLoot('predictions', {
                    title: '🔮 Передбачення',
                    preview: predText.substring(0, 60) + '...',
                    full: predText
                });

                lastPredictionAt = doorClicks;

            } else {
                const randomBubbleText = bubbles[Math.floor(Math.random() * bubbles.length)];
                showDoorBubble(event, randomBubbleText);
            }
        });
}

//рюкзак//

const bagBtn = document.getElementById('bag-btn');
const initialLoot = getLoot();
if (bagBtn && (initialLoot.achievements.length || initialLoot.predictions.length || initialLoot.artifacts.length)) {
    bagBtn.classList.add('has-items');
}
const bagOverlay = document.getElementById('bag-overlay');
const bagClose = document.getElementById('bag-close');
const bagContent = document.getElementById('bag-content');

const lootKey = 'valky_loot_v1';

function getLoot() {
    try {
        return JSON.parse(localStorage.getItem(lootKey)) || { achievements: [], predictions: [], artifacts: [] };
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


function renderBagTab(tab) {
    const loot = getLoot();
    const items = loot[tab] || [];
    bagContent.innerHTML = '';

    const emptyMessages = {
        achievements: 'Ви ще не отримали жодного досягнення. Стукайте у двері Валківської Приймальні.',
        predictions: 'Немає передбачень для вас. Поки що.',
        artifacts: 'Ви ще не знайшли жодного артефакту. Стукайте у двері Валківської Приймальні.'
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

});
