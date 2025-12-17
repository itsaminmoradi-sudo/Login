document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.getElementById('toggle-password');

    const purpleCharacter = document.getElementById('purple-character');
    const blackCharacter = document.getElementById('black-character');
    const orangeCharacter = document.getElementById('orange-character');
    const yellowCharacter = document.getElementById('yellow-character');

    let mouseX = 0;
    let mouseY = 0;
    let isTyping = false;
    let isLookingAtEachOther = false;
    let isPurplePeeking = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function setTyping(typing) {
        isTyping = typing;
        if (isTyping) {
            isLookingAtEachOther = true;
            setTimeout(() => isLookingAtEachOther = false, 800);
        }
    }

    emailInput.addEventListener('focus', () => setTyping(true));
    emailInput.addEventListener('blur', () => setTyping(false));
    passwordInput.addEventListener('focus', () => setTyping(true));
    passwordInput.addEventListener('blur', () => setTyping(false));

    let showPassword = false;
    togglePasswordButton.addEventListener('click', () => {
        showPassword = !showPassword;
        passwordInput.type = showPassword ? 'text' : 'password';
    });

    function scheduleBlink(character, eyeSize) {
        const eyes = character.querySelectorAll('.eyeball');
        const blinkTimeout = setTimeout(() => {
            eyes.forEach(eye => eye.style.height = '2px');
            setTimeout(() => {
                eyes.forEach(eye => eye.style.height = `${eyeSize}px`);
                scheduleBlink(character, eyeSize);
            }, 150);
        }, Math.random() * 4000 + 3000);
    }

    function schedulePeek() {
        const peekTimeout = setTimeout(() => {
            if (passwordInput.value.length > 0 && showPassword) {
                isPurplePeeking = true;
                setTimeout(() => isPurplePeeking = false, 800);
            }
            schedulePeek();
        }, Math.random() * 3000 + 2000);
    }

    scheduleBlink(purpleCharacter, 18);
    scheduleBlink(blackCharacter, 16);
    schedulePeek();

    function calculatePosition(ref) {
        if (!ref) return { faceX: 0, faceY: 0, bodySkew: 0 };
        const rect = ref.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 3;
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;
        const faceX = Math.max(-15, Math.min(15, deltaX / 20));
        const faceY = Math.max(-10, Math.min(10, deltaY / 30));
        const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));
        return { faceX, faceY, bodySkew };
    }

    function updatePupilPosition(pupil, maxDistance, forceLookX, forceLookY) {
        let x = 0;
        let y = 0;

        if (forceLookX !== undefined && forceLookY !== undefined) {
            x = forceLookX;
            y = forceLookY;
        } else {
            const pupilRect = pupil.parentElement.getBoundingClientRect();
            const pupilCenterX = pupilRect.left + pupilRect.width / 2;
            const pupilCenterY = pupilRect.top + pupilRect.height / 2;
            const deltaX = mouseX - pupilCenterX;
            const deltaY = mouseY - pupilCenterY;
            const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
            const angle = Math.atan2(deltaY, deltaX);
            x = Math.cos(angle) * distance;
            y = Math.sin(angle) * distance;
        }

        pupil.style.transform = `translate(${x}px, ${y}px)`;
    }

    function animate() {
        const purplePos = calculatePosition(purpleCharacter);
        const blackPos = calculatePosition(blackCharacter);
        const orangePos = calculatePosition(orangeCharacter);
        const yellowPos = calculatePosition(yellowCharacter);

        purpleCharacter.style.height = (isTyping || (passwordInput.value.length > 0 && !showPassword)) ? '440px' : '400px';
        purpleCharacter.style.transform = (passwordInput.value.length > 0 && showPassword) ? `skewX(0deg)` : (isTyping || (passwordInput.value.length > 0 && !showPassword)) ? `skewX(${purplePos.bodySkew - 12}deg) translateX(40px)` : `skewX(${purplePos.bodySkew}deg)`;

        const purpleEyes = purpleCharacter.querySelector('.flex');
        purpleEyes.style.left = (passwordInput.value.length > 0 && showPassword) ? '20px' : isLookingAtEachOther ? '55px' : `${45 + purplePos.faceX}px`;
        purpleEyes.style.top = (passwordInput.value.length > 0 && showPassword) ? '35px' : isLookingAtEachOther ? '65px' : `${40 + purplePos.faceY}px`;
        purpleCharacter.querySelectorAll('.pupil').forEach(pupil => {
            const forceX = (passwordInput.value.length > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined;
            const forceY = (passwordInput.value.length > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined;
            updatePupilPosition(pupil, 5, forceX, forceY);
        });

        blackCharacter.style.transform = (passwordInput.value.length > 0 && showPassword) ? `skewX(0deg)` : isLookingAtEachOther ? `skewX(${blackPos.bodySkew * 1.5 + 10}deg) translateX(20px)` : (isTyping || (passwordInput.value.length > 0 && !showPassword)) ? `skewX(${blackPos.bodySkew * 1.5}deg)` : `skewX(${blackPos.bodySkew}deg)`;

        const blackEyes = blackCharacter.querySelector('.flex');
        blackEyes.style.left = (passwordInput.value.length > 0 && showPassword) ? '10px' : isLookingAtEachOther ? '32px' : `${26 + blackPos.faceX}px`;
        blackEyes.style.top = (passwordInput.value.length > 0 && showPassword) ? '28px' : isLookingAtEachOther ? '12px' : `${32 + blackPos.faceY}px`;
        blackCharacter.querySelectorAll('.pupil').forEach(pupil => {
            const forceX = (passwordInput.value.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined;
            const forceY = (passwordInput.value.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined;
            updatePupilPosition(pupil, 4, forceX, forceY);
        });

        orangeCharacter.style.transform = (passwordInput.value.length > 0 && showPassword) ? `skewX(0deg)` : `skewX(${orangePos.bodySkew}deg)`;
        orangeCharacter.querySelectorAll('.pupil').forEach(pupil => {
            const forceX = (passwordInput.value.length > 0 && showPassword) ? -5 : undefined;
            const forceY = (passwordInput.value.length > 0 && showPassword) ? -4 : undefined;
            updatePupilPosition(pupil, 5, forceX, forceY);
        });

        yellowCharacter.style.transform = (passwordInput.value.length > 0 && showPassword) ? `skewX(0deg)` : `skewX(${yellowPos.bodySkew}deg)`;
        yellowCharacter.querySelectorAll('.pupil').forEach(pupil => {
            const forceX = (passwordInput.value.length > 0 && showPassword) ? -5 : undefined;
            const forceY = (passwordInput.value.length > 0 && showPassword) ? -4 : undefined;
            updatePupilPosition(pupil, 5, forceX, forceY);
        });

        requestAnimationFrame(animate);
    }

    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('login-button');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.classList.add('hidden');
        loginButton.textContent = 'Signing in...';
        loginButton.disabled = true;

        await new Promise(resolve => setTimeout(resolve, 300));

        if (emailInput.value === 'erik@gmail.com' && passwordInput.value === '1234') {
            alert('Login successful! Welcome, Erik!');
        } else {
            errorMessage.textContent = 'Invalid email or password. Please try again.';
            errorMessage.classList.remove('hidden');
        }

        loginButton.textContent = 'Log in';
        loginButton.disabled = false;
    });

    animate();
});
