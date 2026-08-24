const modelViewer = document.querySelector('#ar-viewer');
const captureButton = document.querySelector('#capture-button');
const trackingStatus = document.querySelector('#tracking-status');

const onProgress = (event) => {
  const progressBar = event.target.querySelector('.progress-bar');
  const updatingBar = event.target.querySelector('.update-bar');
  updatingBar.style.width = `${event.detail.totalProgress * 100}%`;

  if (event.detail.totalProgress === 1) {
    progressBar.classList.add('hide');
    event.target.removeEventListener('progress', onProgress);
  } else {
    progressBar.classList.remove('hide');
  }
};

modelViewer.addEventListener('progress', onProgress);

modelViewer.addEventListener('ar-tracking', (event) => {
  if (!trackingStatus) return;

  trackingStatus.textContent = event.detail.status === 'tracking'
    ? 'Plano reconocido'
    : 'Mueve el telefono para reconocer el plano';
});

document.querySelectorAll('[data-placement]').forEach((button) => {
  button.addEventListener('click', () => {
    modelViewer.setAttribute('ar-placement', button.dataset.placement);

    document.querySelectorAll('[data-placement]').forEach((option) => {
      const isActive = option === button;
      option.classList.toggle('active', isActive);
      option.setAttribute('aria-pressed', String(isActive));
    });
  });
});

captureButton?.addEventListener('click', async () => {
  captureButton.disabled = true;
  const originalText = captureButton.textContent;
  captureButton.textContent = 'Guardando...';

  try {
    const blob = await modelViewer.toBlob({ mimeType: 'image/png' });
    const fileName = `server-ar-${Date.now()}.png`;
    const file = new File([blob], fileName, { type: blob.type });

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'Servidor en AR'
      });
    } else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('No se pudo capturar la vista AR', error);
    alert('No se pudo tomar la foto desde este navegador. Usa la captura de pantalla del telefono.');
  } finally {
    captureButton.disabled = false;
    captureButton.textContent = originalText;
  }
});
