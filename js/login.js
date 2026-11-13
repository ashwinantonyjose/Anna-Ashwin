/**
 * ====================================================================
 * LOGIN CONTROLLER (login.js)
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('usernameInput');
  const passwordInput = document.getElementById('passwordInput');
  const rememberMeCheck = document.getElementById('rememberMeCheck');
  const loginError = document.getElementById('loginError');

  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.classList.remove('visible');

    const submitButton = loginForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.value,
          password: passwordInput.value,
          rememberMe: rememberMeCheck.checked
        })
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Login failed. Please try again.');
      window.location.href = 'index.html';
    } catch (error) {
      loginError.textContent = error.message || 'Unable to log in. Please try again.';
      loginError.classList.add('visible');

      const card = document.querySelector('.login-card');
      if (card) {
        card.style.animation = 'none';
        setTimeout(() => {
          card.style.animation = 'shake 0.4s ease';
        }, 10);
      }
    } finally {
      submitButton.disabled = false;
    }
  });
});

// Add keyframe shake animation dynamically for invalid login
const shakeStyle = document.createElement('style');
shakeStyle.innerHTML = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-10px); }
    40%, 80% { transform: translateX(10px); }
  }
`;
document.head.appendChild(shakeStyle);
