const di = window.canva.designInteraction;
export const addNativeElement = di.addNativeElement.bind(di);
export const addPage = di.addPage.bind(di);
export const setCurrentPageBackground = di.setCurrentPageBackground.bind(di);
export const addAudioTrack = di.addAudioTrack.bind(di);
export const getCurrentPageContext = di.getCurrentPageContext.bind(di);
export const getDefaultPageDimensions = di.getDefaultPageDimensions.bind(di);
export const initAppElement = di.initAppElement.bind(di);
export const selection = di.selection;
export const overlay = di.overlay;
export const getDesignToken = di.getDesignToken.bind(di);

export const ui = (() => {
  const ui = window.canva.dragAndDrop;
  return Object.freeze({
    makeDraggable: ui.makeDraggable.bind(ui),
    startDrag: ui.startDrag.bind(ui),
  });
})();

const exp = window.canva.export;
export const requestExport = exp.requestExport.bind(exp);
