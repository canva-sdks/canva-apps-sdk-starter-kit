interface Window {
  canva: {
    CanvaError: any;
    authentication: any;
    content: any;
    dataConsumer: any;
    export: any;
    designInteraction: {
      addNativeElement: any;
      addPage: any;
      getDefaultPageDimensions: any;
      hd: any[];
      onAppElementChange: any;
      onAppElementDrop: any;
      registerRenderAppElement: any;
      addAudioTrack: any;
      getCurrentPageContext: any;
      initAppElement: any;
      selection: {
        registerOnChange: any;
        setContent: any;
        updateAllContent: any;
      };
      selection2: {
        registerOnChange: any;
      };
      setCurrentPageBackground: any;
    };
    dragAndDrop: any;
    fetch: {
      post: any;
      get: any;
    };
    generation: {
      requestReportContent: any;
      requestUpgrade: any;
      generateImages: any;
      getQuota: any;
    };
    interactiveElement: {
      onAppElementChange: any;
    };
    platform: any;
    skeleton: any;
  };
}