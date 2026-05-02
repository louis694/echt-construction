const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    cards.forEach(card => {
      if (filter === 'all' || card.dataset.type === filter) {
        card.removeAttribute('hidden');
      } else {
        card.setAttribute('hidden', '');
      }
    });
  });
});
