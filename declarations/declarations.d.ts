declare module "*.css" {
  const styles: { [className: string]: string };
  export = styles;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  const content: React.FunctionComponent<{
    size?: "tiny" | "small" | "medium" | "large";
    className?: string;
  }>;
  export default content;
}

declare const BACKEND_HOST: string;
declare const MOCK_WINDOW_CANVA: boolean;

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
