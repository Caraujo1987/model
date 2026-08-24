const modelViewer = document.querySelector('#ar-viewer');

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
