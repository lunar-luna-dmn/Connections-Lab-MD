import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
// Scroll-based text transition
    const text1 = document.getElementById('text1');
    const text2 = document.getElementById('text2');
    const text3 = document.getElementById('text3');
    const text4 = document.getElementById('text4');

    // insitialize text states
    gsap.set(text1, { opacity: 1, scale: 1 });
    gsap.set([text2, text3, text4], { opacity: 0, scale: 0.8 });

    // create ScrollTrigger for text transitions
    ScrollTrigger.create({
        trigger: ".scroll-container", 
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // smooth scrubbing effect
        markers: true, // for debugging - remove in production
        onUpdate: (self) => {
            const progress = self.progress;
            const transitionDuration = 0.5;

            if (progress < 0.25) {
                gsap.to(text1, { opacity: 1, scale: 1, duration: transitionDuration });
                gsap.to([text2, text3, text4], { opacity: 0, scale: 0.8, duration: transitionDuration});
            } else if (progress < 0.5) {
                gsap.to(text1, { opacity: 0, scale: 0.8, duration: transitionDuration });
                gsap.to(text2, { opacity: 1, scale: 1, duration: transitionDuration });
                gsap.to([text3, text4], { opacity: 0, scale: 0.8, duration: transitionDuration });
            } else if (progress < 0.75) {
                gsap.to([text1, text2], { opacity: 0, scale: 0.8, duration: transitionDuration });
                gsap.to(text3, { opacity: 1, scale: 1, duration: transitionDuration });
                gsap.to(text4, { opacity: 0, scale: 0.8, duration: transitionDuration });
            } else {
                gsap.to([text1, text2, text3], { opacity: 0, scale: 0.8, duration: transitionDuration });
                gsap.to(text4, { opacity: 1, scale: 1, duration: transitionDuration });
            }
        }
    });

    
//Mouse gradient interaction
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
