function getCanvaError() {
  if (window.canva && window.canva.CanvaError) {
    return window.canva.CanvaError;
  }

  throw new Error('[INTERNAL_ERROR]: Could not retrieve CanvaError');
}

export const CanvaError = getCanvaError();
