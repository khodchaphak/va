(function(){
    function ensureContainer(){
        let c = document.getElementById('hearts-container');
        if(!c){
            c = document.createElement('div');
            c.id = 'hearts-container';
            document.body.appendChild(c);
        }
        return c;
    }

    function createHeart(){
        const container = ensureContainer();
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '💖';

        const size = Math.random() * 30 + 12; // 12 - 42px
        heart.style.fontSize = size + 'px';

        // position inside viewport
        const left = Math.random() * 100; // vw
        const top = Math.random() * 100; // vh
        heart.style.left = left + 'vw';
        heart.style.top = top + 'vh';

        // slight random rotation
        const rot = (Math.random() - 0.5) * 60;
        heart.style.transform = `rotate(${rot}deg)`;

        // random opacity
        heart.style.opacity = (Math.random() * 0.6 + 0.4).toString();

        container.appendChild(heart);

        // remove after animation finishes
        setTimeout(() => {
            heart.remove();
        }, 4200);
    }

    // spawn bursts sometimes and steady otherwise
    setInterval(() => {
        if(window.heartsPaused) return;
        const container = document.getElementById('hearts-container');
        if(!container) return;
        if(Math.random() < 0.12){
            const burst = Math.floor(Math.random() * 6) + 4;
            for(let i=0;i<burst;i++){
                setTimeout(createHeart, i * 80);
            }
        } else {
            createHeart();
        }
    }, 500);

    // expose initializer to set up the letter reveal and emoji spawning
    window.initLetter = function(){
        const openBtn = document.getElementById('openLetterBtn');
        const letterTextEl = document.getElementById('letterText');
        ensureContainer();

        if(!openBtn || !letterTextEl) return;

        const message = `เรารอมาตลอดเลยรักไอหมูอ้วนนนนที่สุดเลย อยู่กับไอมุไปนานๆนะ เราจะไม่ปล่อยมือกันอีกแล้ว แค่ครั้งนี้ครั้งเดียวนะ แค่เห็นอ้วนรักกับคนอื่นก็เจ็บพอแล้ว จินตนาการถึงอื่นๆอีกมากมาย ถ้ากลับมาแล้ว ขอให้เรารักกันไปเรื่อยๆนะ ค่อยๆปรับ ค่อยๆสร้างกันใหม่ สุดท้ายนี้ ขอโทษไออ้วนที่ทำให้เสียใจ เสียน้ำตา ขอโทษนะ กลับมารักกันเหมือนเดิมนะ 💖💖`;

        function spawnEmoji(){
            // weighted towards 🥺 and 🥹
            const emojis = ['🥺','🥺','🥺','🥹','🥹','🥹','💖'];
            const emoji = document.createElement('div');
            emoji.className = 'emoji';
            emoji.textContent = emojis[Math.floor(Math.random()*emojis.length)];

            const letterEl = document.querySelector('.letter');
            let rect = {left: window.innerWidth/2 - 150, top: window.innerHeight/2 - 80, width:300, height:160};
            if(letterEl) rect = letterEl.getBoundingClientRect();

            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;
            emoji.style.left = x + 'px';
            emoji.style.top = y + 'px';
            emoji.style.fontSize = (14 + Math.random()*26) + 'px';

            document.body.appendChild(emoji);
            setTimeout(() => emoji.remove(), 2200);
        }

        openBtn.addEventListener('click', function(){
            letterTextEl.textContent = message;
            letterTextEl.classList.add('visible');

            // reduce heart spawning while emojis burst
            window.heartsPaused = true;
            const burstCount = 50; // increased number of initial emojis
            for(let i=0;i<burstCount;i++){
                setTimeout(spawnEmoji, i * 40);
            }

            // continue spawning more frequently for a longer period
            const interval = setInterval(spawnEmoji, 180);
            setTimeout(() => clearInterval(interval), 8000);

            // resume heart spawning after emojis finish
            setTimeout(() => { window.heartsPaused = false; }, 8200);
        }, { once: true });
    };

    // hidden background audio that starts on first user click
    (function setupAudio(){
        const audioSrc = 'Ariana_Grande_-_intro_end_of_the_world_extended_(mp3.pm).mp3';
        try{
            let a = document.getElementById('bgAudio');
            if(!a){
                a = document.createElement('audio');
                a.id = 'bgAudio';
                a.src = audioSrc;
                a.loop = true;
                a.preload = 'auto';
                a.style.display = 'none';
                a.volume = 0.6;
                document.body.appendChild(a);
            }

            document.addEventListener('click', function onFirstClick(){
                const p = a.play();
                if(p !== undefined) p.catch(()=>{});
                document.removeEventListener('click', onFirstClick);
            }, { once: true });
        }catch(e){ console.warn('Audio setup failed', e); }
    })();

})();
