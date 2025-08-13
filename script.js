document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalClose = document.getElementById('modal-close');

  // Open modal on product click or keyboard interaction
  document.querySelectorAll('.product').forEach(product => {
    product.addEventListener('click', () => {
      openModal(product);
    });
    product.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(product);
      }
    });
  });

  modalClose.addEventListener('click', () => {
    closeModal();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  function openModal(product) {
    modalTitle.textContent = product.querySelector('figcaption').textContent;
    modalDescription.textContent = product.getAttribute('data-description');
    modal.hidden = false;
    modalClose.focus();
  }

  function closeModal() {
    modal.hidden = true;
  }
});
