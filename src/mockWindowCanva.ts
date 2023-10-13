const generateEmptyFunction = (name: string) => function (...props) {
  console.log(`Canva function ${name} is called with params: `, props)
}
const generateEmptyAsyncFunction = (name?: string) => async function (...props) {
  console.log(`Canva async function ${name} is called with params: `, props)
}
window.canva = {
  CanvaError: class {
  },
  authentication: {},
  content: {},
  dataConsumer: {},
  designInteraction: {
    addNativeElement: generateEmptyAsyncFunction('addNativeElement'),
    addPage: generateEmptyAsyncFunction('addPage'),
    getCurrentPageContext: generateEmptyFunction('getCurrentPageContext'),
    getDefaultPageDimensions: generateEmptyAsyncFunction('getDefaultPageDimensions'),
    addAudioTrack: generateEmptyFunction('addAudioTrack'),
    initAppElement: generateEmptyFunction('initAppElement'),
    hd: [],
    onAppElementChange: generateEmptyFunction('onAppElementChange'),
    onAppElementDrop: generateEmptyFunction('onAppElementDrop'),
    registerRenderAppElement: generateEmptyFunction('registerRenderAppElement'),
    selection: {
      registerOnChange: generateEmptyFunction('registerOnChange'),
      setContent: generateEmptyFunction('setContent'),
      updateAllContent: generateEmptyFunction('updateAllContent'),
    },
    selection2: {
      registerOnChange: generateEmptyFunction('registerOnChange'),
    },
    setCurrentPageBackground: generateEmptyFunction('setCurrentPageBackground'),
  },
  dragAndDrop: {
    makeDraggable: generateEmptyFunction('makeDraggable'),
    startDrag: generateEmptyFunction('startDrag'),
  },
  export: {
    requestExport: generateEmptyFunction('requestExport'),
  },
  fetch: {
    post: generateEmptyFunction('post'),
    get: generateEmptyFunction('get'),
  },
  generation: {
    requestReportContent: generateEmptyFunction('requestReportContent'),
    requestUpgrade: generateEmptyFunction('requestUpgrade'),
    generateImages: generateEmptyFunction('generateImages'),
    getQuota: generateEmptyFunction('getQuota'),
  },
  interactiveElement: {
    onAppElementChange: generateEmptyFunction('onAppElementChange'),
  },
  platform: {
    requestOpenExternalUrl: generateEmptyFunction('requestOpenExternalUrl'),
  },
  skeleton: {},
}

// @ts-ignore
window.__canva__ = {
  uiKit: {
    getUiContext: async function () {
      return Promise.resolve({
        direction: "ltr",
        theme: "dark"
      })
    },
    onUiContextChange: generateEmptyAsyncFunction('onUiContextChange'),
  }
}