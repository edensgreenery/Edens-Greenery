document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  toggle?.addEventListener('click', () => nav.classList.toggle('open'));
  const chips = document.querySelectorAll('.chip');
  const cards = document.querySelectorAll('.card');
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const tag = chip.dataset.filter;
    cards.forEach(card => {
      card.style.display = (tag === 'all' || card.dataset.tags.includes(tag)) ? '' : 'none';
    });
  }));
});