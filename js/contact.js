const form = document.getElementById('contact-form');
const formWrap = document.getElementById('contact-form-wrap');
const success = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', e => {
    // Netlify handles real submissions; this fallback handles local/non-netlify hosting
    if (!form.dataset.netlify) {
      e.preventDefault();
      formWrap.style.display = 'none';
      success.classList.add('visible');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}
