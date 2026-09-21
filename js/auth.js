/**
 * ====================================================================
 * AUTHENTICATION SYSTEM (auth.js)
 * ====================================================================
 * Handles login validation, session state management, page protection guards,
 * and logout functionality for Ashwin & Anna's Relationship Website.
 */

const AUTH_KEY = 'ashwin_anna_auth_user';

const Auth = {
  // Valid Credentials
  VALID_USERNAME: 'annaashwin',
  VALID_PASSWORD: '20022026',

  /**
   * Check if user is logged in
   */
  getUser() {
    try {
      const sessionData = sessionStorage.getItem(AUTH_KEY);
      if (sessionData) return JSON.parse(sessionData);

      const localData = localStorage.getItem(AUTH_KEY);
      if (localData) return JSON.parse(localData);
    } catch (e) {
      console.error('Error reading auth state', e);
    }
    return null;
  },

  isAuthenticated() {
    return this.getUser() !== null;
  },

  /**
   * Attempt Login
   */
  login(username, password, rememberMe = false) {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (cleanUser === this.VALID_USERNAME && cleanPass === this.VALID_PASSWORD) {
      const userPayload = {
        username: 'annaashwin',
        displayName: 'Ashwin & Anna',
        loginTime: new Date().toISOString()
      };

      if (rememberMe) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(userPayload));
        sessionStorage.removeItem(AUTH_KEY);
      } else {
        sessionStorage.setItem(AUTH_KEY, JSON.stringify(userPayload));
        localStorage.removeItem(AUTH_KEY);
      }
      return { success: true, user: userPayload };
    }

    return { success: false, message: 'Invalid username or password' };
  },

  /**
   * Logout user and redirect to login.html
   */
  logout() {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    window.location.href = 'login.html';
  },

  /**
   * Page Protection Guard
   * Call on every protected page (index.html, about.html, gallery.html)
   */
  protectPage() {
    const isLoginPage = window.location.pathname.endsWith('login.html');
    const isAuthed = this.isAuthenticated();

    if (!isAuthed && !isLoginPage) {
      // Redirect unauthenticated user to login
      window.location.href = 'login.html';
    } else if (isAuthed && isLoginPage) {
      // If already logged in and visiting login.html, redirect to home
      window.location.href = 'index.html';
    }
  },

  /**
   * Inject Profile Indicator & Logout Button into Header
   */
  initHeaderAuthUI() {
    if (!this.isAuthenticated()) return;

    const user = this.getUser();
    const navMenu = document.getElementById('navMenu');
    
    if (navMenu) {
      // Check if auth items already added
      if (document.getElementById('navAuthLogout')) return;

      const profileLi = document.createElement('li');
      profileLi.className = 'nav-profile-tag';
      profileLi.innerHTML = `<span class="user-badge">♡ ${user.displayName || 'Ashwin & Anna'}</span>`;

      const logoutLi = document.createElement('li');
      logoutLi.id = 'navAuthLogout';
      logoutLi.innerHTML = `<button onclick="Auth.logout()" class="nav-link logout-btn">Logout</button>`;

      navMenu.appendChild(profileLi);
      navMenu.appendChild(logoutLi);
    }
  }
};

// Execute page guard immediately before rendering content
Auth.protectPage();

document.addEventListener('DOMContentLoaded', () => {
  Auth.initHeaderAuthUI();
});

if (typeof window !== 'undefined') {
  window.Auth = Auth;
}
