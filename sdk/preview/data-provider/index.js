export function getDataProvider() {
  if (window.canva && window.canva.dataProvider) {
    return window.canva.dataProvider;
  }

  throw new Error("[INTERNAL_ERROR]: Could not retrieve the preview Data Provider SDK client");
}
