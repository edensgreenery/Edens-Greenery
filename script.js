document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Product filter chips
  const chips = document.querySelectorAll('.chip');
  const cards = document.querySelectorAll('.card');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      chips.forEach(c => c.setAttribute('aria-selected', c === chip ? 'true' : 'false'));
      const tag = chip.dataset.filter;
      cards.forEach(card => {
        const show = (tag === 'all' || (card.dataset.tags || '').includes(tag));
        card.style.display = show ? '' : 'none';
      });
    });
  });

  // Optional: quick-view modal (uses existing #modal styles)
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalClose = document.getElementById('modal-close');

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('dblclick', () => {
      if (!modal) return;
      modalTitle.textContent = card.querySelector('h3')?.textContent || 'Product';
      modalDescription.textContent = card.getAttribute('data-description') || 'Beautiful plant.';
      modal.hidden = false;
      modalClose?.focus();
    });
  });

  modalClose?.addEventListener('click', () => { if (modal) modal.hidden = true; });
  modal?.addEventListener('click', (e) => { if (e.target === modal) modal.hidden = true; });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal && !modal.hidden) modal.hidden = true; });
});
