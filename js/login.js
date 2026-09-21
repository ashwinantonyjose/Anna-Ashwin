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
  const forgotLink = document.getElementById('forgotPasswordLink');

  if (!loginForm) return;

  // Handle Form Submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;
    const rememberMe = rememberMeCheck.checked;

    // Call Auth login method
    const result = Auth.login(username, password, rememberMe);

    if (result.success) {
      loginError.classList.remove('visible');
      // Redirect to home page
      window.location.href = 'index.html';
    } else {
      loginError.textContent = result.message || 'Invalid username or password. Please try again.';
      loginError.classList.add('visible');
      
      // Shake effect on error
      const card = document.querySelector('.login-card');
      if (card) {
        card.style.animation = 'none';
        setTimeout(() => {
          card.style.animation = 'shake 0.4s ease';
        }, 10);
      }
    }
  });

  // Handle Forgot Password click
  if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Hint: Use username "annaashwin" and password "20022026" ♡');
    });
  }
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
