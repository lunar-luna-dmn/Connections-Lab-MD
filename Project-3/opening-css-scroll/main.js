document.addEventListener('DOMContentLoaded', () => {
    // Add text transition functionality
    const text1 = document.getElementById('text1');
    const text2 = document.getElementById('text2');
    const text3 = document.getElementById('text3');
    let currentTextIndex = 1;

    // Initialize text states
    text1.style.opacity = '1';
    text1.style.transform = 'scale(1)';
    text2.style.opacity = '0';
    text2.style.transform = 'scale(0.8)';
    text3.style.opacity = '0';
    text3.style.transform = 'scale(0.8)';

    // Handle scroll events
    window.addEventListener('wheel', (event) => {
        if (event.deltaY < 0) { // scrolling up
            if (currentTextIndex > 1) {
                fadeOut(document.getElementById(`text${currentTextIndex}`));
                currentTextIndex--;
                fadeIn(document.getElementById(`text${currentTextIndex}`));
            }
        } else { // scrolling down
            if (currentTextIndex < 3) {
                fadeOut(document.getElementById(`text${currentTextIndex}`));
                currentTextIndex++;
                fadeIn(document.getElementById(`text${currentTextIndex}`));
            }
        }
    });

    function fadeOut(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = 'opacity 1s, transform 0.5s';
    }

    function fadeIn(element) {
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
        element.style.transition = 'opacity 1s, transform 0.5s';
    }

    //end of text transition functionality

    //mouse gradient interaction
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
