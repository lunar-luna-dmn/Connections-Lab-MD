import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // Initialize text states ====================================================
    const texts = [
        document.getElementById('text0'),
        document.getElementById('text1'),
        document.getElementById('text2'),
        document.getElementById('text3'),
        document.getElementById('text4')
    ];

    gsap.set(texts[0], { opacity: 1, scale: 1 });
    gsap.set(texts.slice(1), { opacity: 0, scale: 0.8 });

    // Wheel event handler: update text every swipe ====================================================
    let currentIndex = 0;
    let isAnimating = false;
    let wheelTimeout;
    // prevent scroll if animation is in progress
    let lastScrollTime = 0;
    let scrollCooldown = 1500; // ms between scroll events


    window.addEventListener('wheel', (e) => {
         // prevent scroll if animation is in progress or within cooldown
         if (isAnimating || Date.now() - lastScrollTime < scrollCooldown) {
            e.preventDefault();
            return;
        }
        
        clearTimeout(wheelTimeout);

        wheelTimeout = setTimeout(() => {
            if (isAnimating) return;
            isAnimating = true;
            lastScrollTime = Date.now();

            // Detect scroll direction
            if (e.deltaY > 0 && currentIndex < texts.length - 1) {
                // Scrolling down
                currentIndex++;
                updateTexts();
                console.log(currentIndex, 'down');
            } else if (e.deltaY < 0 && currentIndex > 0) {
                // Scrolling up
                currentIndex--;
                updateTexts();
                console.log(currentIndex, 'up');
            } else {
                isAnimating = false;
            }
        }, 10); //timeout delay (ms)
    }, { passive: false });

    function updateTexts() {
        // Animate current text in
        gsap.to(texts[currentIndex], {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
            onComplete: () => {
                isAnimating = false;
            }
        });

        // Animate other texts out
        texts.forEach((text, index) => {
            if (index !== currentIndex) {
                gsap.to(text, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.7,
                    ease: "power2.out"
                });
            }
        });

        // change cursor to pointer when on last text
        const buttons = document.querySelectorAll('.outlined-button');
        buttons.forEach(button => {
            button.style.cursor = currentIndex === 4 ? 'pointer' : 'default';
        });
    }

    // Mouse gradient interaction ==============================================
    const interBubble = document.querySelector('.mouse-interactive');
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    function move() {
        curX += (tgX - curX) / 20;
        curY += (tgY - curY) / 20;
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
        requestAnimationFrame(() => {
            move();
        });
    }

    window.addEventListener('mousemove', (event) => {
        tgX = event.clientX;
        tgY = event.clientY;
    });

    move();
});
