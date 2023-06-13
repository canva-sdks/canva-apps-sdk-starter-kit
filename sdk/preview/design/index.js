const di = window.canva.designInteraction;
export const addNativeElement = di.addNativeElement.bind(di);
export const addAudioTrack = di.addAudioTrack.bind(di);
export const getCurrentPageContext = di.getCurrentPageContext.bind(di);
export const initAppElement = di.initAppElement.bind(di);

export const ui = (() => {
  const ui = window.canva.dragAndDrop;
  return Object.freeze({
    makeDraggable: ui.makeDraggable.bind(ui),
  });
})();

const exp = window.canva.export;
export const requestExport = exp.requestExport.bind(exp);

/** beta */
export const selection = window.canva.designInteraction.selection;