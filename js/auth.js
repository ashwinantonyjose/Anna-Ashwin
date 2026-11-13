const Auth = {
  async logout() {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Logout failed.');
      window.location.href = 'login.html';
    } catch (error) {
      console.error('Unable to log out:', error);
      window.alert('Unable to log out. Please try again.');
    }
  },

  initHeaderAuthUI() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu || document.getElementById('navAuthLogout')) return;

    const profileLi = document.createElement('li');
    profileLi.className = 'nav-profile-tag';
    const badge = document.createElement('span');
    badge.className = 'user-badge';
    badge.textContent = '♡ Ashwin & Anna';
    profileLi.appendChild(badge);

    const logoutLi = document.createElement('li');
    logoutLi.id = 'navAuthLogout';
    const logoutButton = document.createElement('button');
    logoutButton.className = 'nav-link logout-btn';
    logoutButton.textContent = 'Logout';
    logoutButton.addEventListener('click', () => this.logout());
    logoutLi.appendChild(logoutButton);

    navMenu.append(profileLi, logoutLi);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Auth.initHeaderAuthUI();
});

if (typeof window !== 'undefined') {
  window.Auth = Auth;
}
