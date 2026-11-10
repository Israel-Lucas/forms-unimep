const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxQVhebSayvN0QfVnCdkgEXPXTzFwVWb7tBfJUgkoCg9VrvRy1he_6UgE4HpvJd_sbk/exec";

const form = document.querySelector('#registration-form');
const statusMessage = document.querySelector('#status');
const button = form.querySelector('button');
const successModal = document.querySelector('#success-modal');
const closeModalButton = document.querySelector('#close-modal');
let closeModalTimer;

function closeModal() {
  clearTimeout(closeModalTimer);
  successModal.classList.remove('open');
  successModal.setAttribute('aria-hidden', 'true');
}

function openSuccessModal() {
  successModal.classList.add('open');
  successModal.setAttribute('aria-hidden', 'false');
  closeModalButton.focus();
  closeModalTimer = setTimeout(closeModal, 2000);
}

async function sendWithAppsScript(formData) {
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: formData
  });
}

closeModalButton.addEventListener('click', closeModal);
successModal.addEventListener('click', (event) => { if (event.target === successModal) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  statusMessage.className = 'status';

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  button.disabled = true;
  button.textContent = 'Enviando...';

  try {
    const formData = new FormData(form);

    await sendWithAppsScript(formData);

    form.reset();
    statusMessage.className = 'status success';
    statusMessage.textContent = 'Inscrição enviada com sucesso!';
    openSuccessModal();
  } catch (error) {
    statusMessage.textContent = 'Não foi possível enviar agora. Verifique sua conexão e tente novamente.';
  } finally {
    button.disabled = false;
    button.textContent = 'Enviar inscrição';
  }
});
