document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePasswordButton = document.getElementById("toggle-password");
    const eyeIcon = document.querySelector(".eye-icon");
    const eyeOffIcon = document.querySelector(".eye-off-icon");
    const loginForm = document.getElementById("login-form");
    const errorMessage = document.getElementById("error-message");
    const loginButton = document.getElementById("login-button");

    const purpleCharacter = document.getElementById("purple-character");

    const allCharacters = [purpleCharacter];
    const allEyes = document.querySelectorAll('.eye, .pupil');

    let mouseX = 0;
    let mouseY = 0;
    let isTyping = false;
    let isPasswordVisible = false;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isTyping) {
            updateCharacterPositions();
        }
    });

    emailInput.addEventListener("focus", () => {
        isTyping = true;
        setTypingAnimation(true);
    });

    emailInput.addEventListener("blur", () => {
        isTyping = false;
        setTypingAnimation(false);
    });

    passwordInput.addEventListener("focus", () => {
        isTyping = true;
        setTypingAnimation(true);
    });

    passwordInput.addEventListener("blur", () => {
        isTyping = false;
        setTypingAnimation(false);
    });

    togglePasswordButton.addEventListener("click", () => {
        isPasswordVisible = !isPasswordVisible;
        passwordInput.type = isPasswordVisible ? "text" : "password";
        eyeIcon.style.display = isPasswordVisible ? "none" : "block";
        eyeOffIcon.style.display = isPasswordVisible ? "block" : "none";
        updatePasswordVisibilityAnimation();
    });

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        errorMessage.style.display = "none";
        loginButton.disabled = true;
        loginButton.textContent = "Signing in...";

        await new Promise(resolve => setTimeout(resolve, 300));

        if (emailInput.value === "erik@gmail.com" && passwordInput.value === "1234") {
            alert("Login successful! Welcome, Erik!");
        } else {
            errorMessage.textContent = "Invalid email or password. Please try again.";
            errorMessage.style.display = "block";
        }

        loginButton.disabled = false;
        loginButton.textContent = "Log in";
    });

    function setTypingAnimation(typing) {
        if (typing) {
            allCharacters.forEach(char => char.classList.add('typing'));
            // Special adjustments for typing
            purpleCharacter.style.transform = `skewX(-5deg)`; // A slight lean
        } else {
            allCharacters.forEach(char => char.classList.remove('typing'));
            updateCharacterPositions(); // Return to mouse-following
        }
    }


    function updatePasswordVisibilityAnimation() {
        if (passwordInput.value.length > 0 && isPasswordVisible) {
            // Start peeking
            purpleCharacter.classList.add('peeking');
            peekAnimation();
        } else {
            purpleCharacter.classList.remove('peeking');
        }
    }

    let peekTimeout;
    function peekAnimation() {
        if (!purpleCharacter.classList.contains('peeking')) return;

        const purpleEyes = purpleCharacter.querySelector('.eyes');
        const purplePupils = purpleCharacter.querySelectorAll('.pupil');

        // Change position and pupil direction for peeking
        purpleEyes.style.left = '20px';
        purpleEyes.style.top = '35px';
        purplePupils.forEach(p => p.style.transform = 'translate(4px, 5px)');

        peekTimeout = setTimeout(() => {
            purplePupils.forEach(p => p.style.transform = 'translate(-4px, -4px)'); // Look away
            setTimeout(() => { // Schedule next peek
                if (purpleCharacter.classList.contains('peeking')) {
                    peekAnimation();
                }
            }, Math.random() * 3000 + 2000);
        }, 800);
    }

    passwordInput.addEventListener('input', updatePasswordVisibilityAnimation);


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

    function updateCharacterPositions() {
        if (isTyping || purpleCharacter.classList.contains('peeking')) return;

        const positions = {
            purple: calculatePosition(purpleCharacter),
        };

        purpleCharacter.style.transform = `skewX(${positions.purple.bodySkew}deg)`;

        positionEyes(purpleCharacter, positions.purple);
    }

    function positionEyes(character, pos) {
        const eyes = character.querySelector('.eyes');
        if (!eyes) return;

        // Reset to base position before applying new offset
        eyes.style.left = '';
        eyes.style.top = '';

        const baseLeft = parseInt(getComputedStyle(eyes).left, 10);
        const baseTop = parseInt(getComputedStyle(eyes).top, 10);

        eyes.style.left = `${baseLeft + pos.faceX}px`;
        eyes.style.top = `${baseTop + pos.faceY}px`;

        // Pupil movement inside the eye based on mouse
        const pupils = character.querySelectorAll('.pupil');
        pupils.forEach(pupil => {
            const pupilPos = calculatePupilPosition(pupil, 5); // max distance 5
            pupil.style.transform = `translate(${pupilPos.x}px, ${pupilPos.y}px)`;
        });
    }

    function calculatePupilPosition(pupilRef, maxDistance) {
        if (!pupilRef) return { x: 0, y: 0 };
        const pupil = pupilRef.getBoundingClientRect();
        const pupilCenterX = pupil.left + pupil.width / 2;
        const pupilCenterY = pupil.top + pupil.height / 2;
        const deltaX = mouseX - pupilCenterX;
        const deltaY = mouseY - pupilCenterY;
        const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
        const angle = Math.atan2(deltaY, deltaX);
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        return { x, y };
    }

    // Blinking animations
    function randomBlink(character) {
        const eyes = character.querySelectorAll('.eye');
        if (eyes.length === 0) return;

        setTimeout(() => {
            eyes.forEach(eye => eye.style.height = '2px');
            setTimeout(() => {
                eyes.forEach(eye => eye.style.height = ''); // Revert to original height
                randomBlink(character);
            }, 150);
        }, Math.random() * 4000 + 3000);
    }

    randomBlink(purpleCharacter);

});
