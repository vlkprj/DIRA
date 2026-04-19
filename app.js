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
    
    // ---------- НОВИЙ УНІВЕРСАЛЬНИЙ WYSIWYG ФЛОУ ----------
    const wysiwygOverlay = document.getElementById('wysiwyg-overlay');
    const flowVideo = document.getElementById('flow-video');
    const stepEditor = document.getElementById('step-editor');
    const stepPreview = document.getElementById('step-preview');
    const stepSuccess = document.getElementById('step-success');

    const btnNextStep = document.getElementById('btn-next-step');
    const btnPublish = document.getElementById('btn-publish');
    const btnBack = document.getElementById('wysiwyg-back');
    const btnClose = document.getElementById('wysiwyg-close');

    const activeCard = document.getElementById('active-card');
    const cardEditor = document.getElementById('card-editor');
    const cardAnonInput = document.getElementById('card-anon-input');
    const cardAuthorDisplay = document.getElementById('card-author-display');
    const wysiwygTitle = document.getElementById('wysiwyg-title');
    
    const editorTools = document.getElementById('editor-tools');
    const photoZone = document.getElementById('card-photo-zone');
    const photoPreview = document.getElementById('card-photo-preview');
    const photoPlaceholder = document.getElementById('photo-placeholder');
    const fileInput = document.getElementById('card-file-input');

    const blackHoleGroup = ['.b-unpopular', '.b-shopopalo', '.b-admins', '.b-problem', '.rumors-container', '.b-meme'];
    const skrynkaGroup = ['.b-write-main', '.b-story', '.b-serious', '.b-atmosphere', '.b-advice', '.b-petition', '.b-complain', '.b-birthday', '.b-zbir', '.b-idea', '.b-thank', '.b-photo'];
    
    const photoRequiredButtons = ['.b-atmosphere', '.b-photo', '.b-meme'];

    cardAnonInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        cardAuthorDisplay.innerText = val ? `від: ${val}` : '👤 Анонімно';
    });

    photoZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            photoPreview.src = e.target.result;
            photoPreview.style.display = 'block';
            photoPlaceholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    });

    function openCardBuilder(selector, titleText) {
        const isHole = blackHoleGroup.includes(selector);
        const mode = isHole ? 'hole' : 'mailbox';
        const needsPhoto = photoRequiredButtons.includes(selector);
        
        wysiwygOverlay.className = `wysiwyg-overlay ${mode}-mode`;
        wysiwygOverlay.style.display = 'flex';
        
        stepEditor.style.display = 'flex';
        stepPreview.style.display = 'none';
        stepSuccess.style.display = 'none';
        btnBack.style.display = 'none';
        wysiwygTitle.style.display = 'block';
        wysiwygTitle.innerText = titleText;
        
        cardEditor.innerHTML = '';
        cardAnonInput.value = '';
        cardAuthorDisplay.innerText = '👤 Анонімно';
        photoPreview.src = '';
        photoPreview.style.display = 'none';
        photoPlaceholder.style.display = 'flex';
        fileInput.value = '';
        
        if (needsPhoto) {
            photoZone.style.display = 'block';
            cardEditor.style.minHeight = '10%'; 
            cardEditor.setAttribute('data-placeholder', 'Підпис (необовʼязково)');
            editorTools.style.display = 'none'; 
            activeCard.style.background = isHole ? '#1a1a1a' : '#fff';
            activeCard.style.color = isHole ? '#fff' : '#000';
        } else {
            photoZone.style.display = 'none';
            cardEditor.style.minHeight = '50%';
            cardEditor.setAttribute('data-placeholder', 'Починайте писати сюди...');
            editorTools.style.display = 'flex';
            activeCard.style.background = '#FAF8F4';
            activeCard.style.color = '#222221';
        }

        flowVideo.src = isHole ? 'blackhole.mp4' : 'skrynka.mp4';
        flowVideo.classList.remove('playing');
        flowVideo.pause();
        flowVideo.currentTime = 0;
        
        document.body.classList.add('submit-open');
    }

    const buttonTitles = {
        '.b-write-main': 'НАПИСАТИ', '.b-story': 'РОЗКАЗАТИ', '.b-serious': 'СЕРЙОЗНЕ',
        '.b-petition': 'ЗВЕРНЕННЯ', '.b-complain': 'ПОСКАРЖИТИСЬ', '.b-zbir': 'ЗБІР',
        '.b-idea': 'Є ІДЕЯ', '.b-thank': 'ПОДЯКУВАТИ', '.b-unpopular': 'НЕПОПУЛЯРНА ДУМКА',
        '.b-shopopalo': 'ШОПОПАЛО', '.b-admins': 'АДМІНАМ', '.rumors-container': 'ЧУТКИ',
        '.b-problem': 'ПРОБЛЕМА', '.b-advice': 'ПОРАДА', '.b-birthday': 'ДЕНЬ НАРОДЖЕННЯ',
        '.b-atmosphere': 'АТМОСФЕРА', '.b-photo': 'ФОТО', '.b-meme': 'МЕМ'
    };

    [...blackHoleGroup, ...skrynkaGroup].forEach(sel => {
        const btn = document.querySelector(sel);
        if (btn) btn.addEventListener('click', () => openCardBuilder(sel, buttonTitles[sel]));
    });

    document.querySelectorAll('.bg-color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            document.querySelectorAll('.bg-color-dot').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            activeCard.style.background = dot.dataset.color;
            document.getElementById('main-bg-color').style.background = dot.dataset.color;
        });
    });

    document.querySelectorAll('.text-color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            document.querySelectorAll('.text-color-dot').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            activeCard.style.color = dot.dataset.color;
            document.getElementById('main-text-color').style.background = dot.dataset.color;
        });
    });

    const fontSelect = document.getElementById('card-font-select');
    if (fontSelect) {
        fontSelect.addEventListener('change', () => {
            activeCard.style.fontFamily = `'${fontSelect.value}', sans-serif`;
        });
    }

    document.getElementById('main-text-color').addEventListener('click', () => {
        document.getElementById('popover-text').classList.toggle('show');
        document.getElementById('popover-bg').classList.remove('show');
    });
    
    document.getElementById('main-bg-color').addEventListener('click', () => {
        document.getElementById('popover-bg').classList.toggle('show');
        document.getElementById('popover-text').classList.remove('show');
    });

    btnNextStep.addEventListener('click', () => {
        const previewWorkspace = document.getElementById('preview-workspace');
        previewWorkspace.innerHTML = '';
        
        const clonedCard = activeCard.cloneNode(true);
        clonedCard.id = ''; 
        
        const clonedEditor = clonedCard.querySelector('.card-text-zone');
        if(clonedEditor) {
            clonedEditor.removeAttribute('contenteditable');
            if(clonedEditor.innerText.trim() === '') clonedEditor.style.display = 'none';
        }

        const clonedPhotoZone = clonedCard.querySelector('.card-photo-zone');
        if (clonedPhotoZone) {
            const prevImg = clonedPhotoZone.querySelector('img');
            if (!prevImg.src || prevImg.style.display === 'none') {
                clonedPhotoZone.style.display = 'none';
            } else {
                clonedPhotoZone.querySelector('.photo-placeholder').style.display = 'none';
            }
        }
        
        previewWorkspace.appendChild(clonedCard);
        
        stepEditor.style.display = 'none';
        stepPreview.style.display = 'flex';
        btnBack.style.display = 'block';
        wysiwygTitle.style.display = 'none';
    });

    btnBack.addEventListener('click', () => {
        stepPreview.style.display = 'none';
        stepEditor.style.display = 'flex';
        btnBack.style.display = 'none';
        wysiwygTitle.style.display = 'block';
    });

    btnClose.addEventListener('click', () => {
        wysiwygOverlay.style.display = 'none';
        document.body.classList.remove('submit-open');
    });

    btnPublish.addEventListener('click', () => {
        stepPreview.style.display = 'none';
        btnBack.style.display = 'none';
        btnClose.style.display = 'none';
        
        stepSuccess.style.display = 'flex';
        flowVideo.classList.add('playing');
        flowVideo.play();
        
        const successMsg = document.getElementById('success-message');
        successMsg.classList.remove('fade-out');
        
        setTimeout(() => {
            successMsg.classList.add('fade-out');
        }, 3000);
        
        setTimeout(() => {
            wysiwygOverlay.style.display = 'none';
            document.body.classList.remove('submit-open');
            btnClose.style.display = 'block';
        }, 5500);
    });

    // ---------- ДВЕРІ ТА ПАСХАЛКИ ----------
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

        let doorClicks = parseInt(localStorage.getItem('valky_door_clicks')) || 0;
        let recentBubbles = []; 
        const fxClasses = ['door-glow', 'door-glitch', 'fx-anime', 'fx-glitch', 'fx-upside-down', 'fx-black-hole', 'fx-earthquake', 'fx-acid-trip', 'fx-hologram', 'fx-void'];

        function showAchievementCard(text) {
            const card = document.createElement('div');
            card.className = 'achievement-card';
            card.innerHTML = `
                <div class="card-plastic-wrap">
                    <span class="achievement-close" onclick="this.closest('.achievement-card').remove()">✕</span>
                    <div class="card-inner">
                        <div class="card-body">
                            <div class="card-number">Досягнення #1</div>
                            <div class="card-title">Справжній стукач</div>
                            <div class="card-desc">${text}</div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(card);
        }

        function showArtifactCard(name) {
            const card = document.createElement('div');
            card.className = 'artifact-card';
            card.innerHTML = `
                <div class="artifact-plastic-wrap">
                    <span class="achievement-close" onclick="this.closest('.artifact-card').remove()">✕</span>
                    <div class="artifact-inner">
                        <div class="artifact-image-area"><span class="artifact-image-placeholder">🗿</span></div>
                        <div class="artifact-body">
                            <div class="artifact-label">Артефакт знайдено</div>
                            <div class="artifact-name">${name}</div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(card);
            setTimeout(() => card.remove(), 8000);
        }

        function showDoorBubble(event, text, customDuration) {
            const rect = doorBtn.getBoundingClientRect();
            const bubble = document.createElement('div');
            bubble.className = 'door-bubble';
            bubble.innerText = text;
            bubble.style.left = `${rect.left + rect.width / 2}px`;
            bubble.style.top = `${rect.top}px`;
            bubble.style.position = 'fixed';
            document.body.appendChild(bubble);
            setTimeout(() => bubble.remove(), customDuration || Math.max(2500, text.length * 60));
        }

        doorBtn.addEventListener('click', (event) => {
            doorClicks++;
            localStorage.setItem('valky_door_clicks', doorClicks);

            const rect = doorBtn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            for (let i = 0; i < 6; i++) {
                const splinter = document.createElement('div');
                splinter.className = 'door-splinter';
                document.body.appendChild(splinter);
                const angle = Math.random() * Math.PI * 2;
                const velocity = 20 + Math.random() * 40;
                splinter.style.left = `${centerX}px`;
                splinter.style.top = `${centerY}px`;
                splinter.style.setProperty('--tx', `${Math.cos(angle) * velocity}px`);
                splinter.style.setProperty('--ty', `${Math.sin(angle) * velocity - 20}px`);
                splinter.style.animation = 'splinterFly 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                setTimeout(() => splinter.remove(), 600);
            }

            if (doorClicks === 15) {
                showAchievementCard("Якийсь підозрілий тіп біля дверей. Ви постукали у двері Приймальні 15 разів. Ми вже подзвонили куди треба 🧐");
                return;
            }

            if (Math.random() < 0.01) {
                showArtifactCard("Загадковий куб Валківської міськради");
                return;
            }

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
        });
    }

    // ---------- МОДАЛКА ПРАВИЛ ----------
    const rulesModal = document.getElementById('rules-modal');
    const closeRulesBtn = document.getElementById('close-rules-btn');
    const openRulesBtns = document.querySelectorAll('.open-rules-btn');

    if (rulesModal && closeRulesBtn) {
        openRulesBtns.forEach(btn => {
            btn.addEventListener('click', () => rulesModal.style.display = 'flex');
        });
        closeRulesBtn.addEventListener('click', () => rulesModal.style.display = 'none');
        rulesModal.addEventListener('click', (e) => {
            if (e.target === rulesModal) rulesModal.style.display = 'none';
        });
    }

    // ---------- ПЕРЕВІРКА АКТИВНОСТІ КНОПОК ----------
    setInterval(() => {
        const hasText = cardEditor && cardEditor.innerText.trim().length > 0;
        const hasPhoto = photoPreview && photoPreview.style.display === 'block';
        const isValid = hasText || hasPhoto;
        
        if (btnNextStep) {
            btnNextStep.style.opacity = isValid ? '1' : '0.4';
            btnNextStep.style.pointerEvents = isValid ? 'auto' : 'none';
        }
    }, 300);
});
