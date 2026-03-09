document.addEventListener("DOMContentLoaded", () => {
    const glitchLetter = document.getElementById('glitch-letter');
    if (glitchLetter) {
        setInterval(() => {
            glitchLetter.innerText = glitchLetter.innerText === 'Е' ? 'О' : 'Е';
        }, 800);
    }

    const baseStr = "Розказати ";
    const words = ["про..", "щось..."];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const storyEl = document.getElementById('story-text');

    function typeWriter() {
        if (!storyEl) return;
        const currentWord = words[wordIdx];

        if (isDeleting) {
            storyEl.innerText = baseStr + currentWord.substring(0, charIdx - 1);
            charIdx--;
        } else {
            storyEl.innerText = baseStr + currentWord.substring(0, charIdx + 1);
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

    const hints = ["як зробити місто краще", "а давайте…", "можна ж було б…", "як покращити…"];
    const hintEl = document.getElementById('idea-hint-text');
    if (hintEl) {
        let hintIdx = 0;
        setInterval(() => {
            hintIdx = (hintIdx + 1) % hints.length;
            hintEl.innerText = hints[hintIdx];
        }, 2000);
    }

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

    const silenceBtn = document.getElementById('btn-silence');
    const overlay = document.getElementById('silence-overlay');
    const closeBtn = document.getElementById('close-silence');
    const timerEl = document.getElementById('silence-timer');
    const breatheContainer = document.getElementById('breathe-container');
    const breatheMsg = document.getElementById('breathe-msg');
    let silenceInterval;
    let silenceTimeout;
    let breatheInterval;

        const silenceMainMsg = document.getElementById('silence-main-msg');
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
            if (scrolledToBottom) {
                fabIcon.innerHTML = 'arrow_upward';
            } else {
                fabIcon.innerHTML = 'arrow_downward';
            }
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

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('brutal-theme');
        } else {
            document.body.classList.remove('brutal-theme');
        }
    });
}
