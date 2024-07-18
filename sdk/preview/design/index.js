const di = window.canva.designInteraction;
export const addNativeElement = di.addNativeElement.bind(di);
export const addPage = di.addPage.bind(di);
export const createRichtextRange = di.createRichtextRange.bind(di);
export const setCurrentPageBackground = di.setCurrentPageBackground.bind(di);
export const addAudioTrack = di.addAudioTrack.bind(di);
export const getCurrentPageContext = di.getCurrentPageContext.bind(di);
export const getDefaultPageDimensions = di.getDefaultPageDimensions.bind(di);
export const initAppElement = di.initAppElement.bind(di);
export const selection = di.selection;
export const overlay = di.overlay;
export const getDesignToken = di.getDesignToken.bind(di);

const dd = window.canva.dragAndDrop;

export const ui = Object.freeze({
  makeDraggable: dd.makeDraggable.bind(dd),
  startDrag: dd.startDrag.bind(dd),
});

const exp = window.canva.export;
export const requestExport = exp.requestExport.bind(exp);
