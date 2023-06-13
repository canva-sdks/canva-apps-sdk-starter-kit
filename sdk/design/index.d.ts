/**
 * Adds an audio track to the user's design.
 * @public
 * @param audioTrack - The audio track to add to the user's design.
 */
export declare function addAudioTrack(audioTrack: AudioTrack): Promise<void>;

/**
 * @public
 * Adds a native element to the user's design.
 * @param element - The element to add to the user's design.
 */
export declare function addNativeElement(
  element: NativeElement | NativeElementWithBox
): Promise<void>;

/**
 * @public
 * A callback that runs when an app element's data is created or updated,
 * or when the user selects an existing app element.
 */
export declare type AppElementChangeHandler<A extends AppElementData> = (
  appElement:
    | {
        data: A;
        version: number;
      }
    | undefined
) => void;

/**
 * @public
 * A client interface for managing app elements and app element data.
 */
export declare interface AppElementClient<A extends AppElementData> {
  /**
   * Attaches data to the selected app element or creates a new app element if one is not selected.
   * If data already exists, it's overwritten.
   * @param appElementData - The data to attach to the app element.
   */
  addOrUpdateElement(appElementData: A, placement?: Placement): Promise<void>;
  /**
   * Registers a callback that runs when the app element's data is created or
   * updated and when the user selects an existing app element.
   * @param handler - The callback to run when the app element's data is changed
   * and when the user selects an existing app element.
   */
  registerOnElementChange(handler: AppElementChangeHandler<A>): void;
}

/**
 * @public
 * Configuration for an AppElementClient
 */
export declare type AppElementClientConfiguration<A extends AppElementData> = {
  /**
   * The AppElementRenderer to use when rendering the app element
   */
  render: AppElementRenderer<A>;
};

/**
 * @public
 * The data an app can attach to an app element.
 */
export declare type AppElementData = Record<string, Value>;

/**
 * @public
 * A callback that runs when an app's element is changed.
 *
 * @remarks
 * This callback must return one or more elements to render within the app element.
 */
export declare type AppElementRenderer<A extends AppElementData> = (
  appElementData: A
) => AppElementRendererOutput;

/**
 * @public
 * A return value of {@link AppElementRenderer} function.
 * It is an array of elements to render within an app element.
 */
export declare type AppElementRendererOutput = Exclude<
  NativeSimpleElementWithBox,
  NativeVideoElementWithBox
>[];

/**
 * @public
 * A unique identifier that references an audio asset in the user's media library.
 */
export declare type AudioRef = string & {
  __audioRef: never;
};

/**
 * @public
 * An audio track that can be added to a user's design.
 */
export declare type AudioTrack = {
  /**
   * A unique identifier that references an audio asset in Canva's backend.
   */
  ref: AudioRef;
};

/**
 * @public
 * The dimensions, position, and rotation of an element.
 *
 * @remarks
 * Units are relative to the parent container both in terms of position and size
 */
declare type Box = Position & (WidthAndHeight | Width | Height);

declare type CommonImageDragData = {
  /**
   * The type of element.
   */
  type: "IMAGE";
  /**
   * The dimensions of the preview image.
   *
   * @remarks
   * The preview image is the image that users see under their cursor while dragging
   * it into their design.
   */
  previewSize: Dimensions;
};

/**
 * @public
 * Represents X and Y coordinates.
 */
export declare type Coordinates = {
  /**
   * Represents an X coordinate, in pixels.
   */
  x: number;
  /**
   * Represents a Y coordinate, in pixels.
   */
  y: number;
};

/**
 * @public
 * Represents a width and a height.
 */
export declare type Dimensions = {
  /**
   * Represents a width, in pixels.
   */
  width: number;
  /**
   * Represents a height, in pixels.
   */
  height: number;
};

/**
 * @public
 * Callbacks that run during the lifecycle of a drag and drop.
 */
export declare type DragCallback = {
  /**
   * A callback that runs when the user starts dragging an element into their design.
   *
   * @param element - The element being dragged into the user's design.
   */
  onDragStart: (element: HTMLElement) => void;
  /**
   * A callback that runs when the user finishes dragging an element into their design.
   *
   * @param element - The element being dragged into the user's design.
   */
  onDragEnd: (element: HTMLElement) => void;
};

/**
 * @public
 * Options for making an element draggable.
 */
export declare type DraggableElementData = ElementData | ImageElementData;

/**
 * @public
 * Options for making an `HTMLElement` draggable.
 */
export declare type ElementData = DragCallback & {
  /**
   * The element to be made draggable.
   */
  node: HTMLElement;
  /**
   * Options for defining the drag and drop behavior.
   *
   * @remarks
   * This data is required because it can't be inferred from the `node` property.
   */
  dragData: UserSuppliedDragData;
};

/**
 * @public
 * Export aborted response
 *
 * @remarks
 * Ane export flow is considered aborted when a user closes
 * the export options menu.
 */
export declare type ExportAborted = {
  /**
   * The status of the export flow when the user has aborted the export menu.
   */
  status: "ABORTED";
};

/**
 * @public
 * The exported file.
 */
export declare type ExportBlob = {
  /**
   * The URL of the exported design.
   *
   * @remarks
   * If the user's design contains multiple pages but is exported in a format that doesn't support multiple pages, the URL will point to a ZIP file that contains each page as a separate file.
   *
   * For example:
   *
   * - If a single-page design is exported as a JPG, the URL will point to a JPG file
   * - If a multi-page design is exported as a JPG, the URL will point to a ZIP file that contains a separate JPG file for each page
   * - If a multi-page design is exported as a PDF, the URL will point to a PDF file that contains all of the pages
   *
   * The following file types support multiple pages:
   *
   * - `"GIF"`
   * - `"PDF_STANDARD"`
   * - `"PPTX"`
   * - `"VIDEO"`
   *
   * The following file types do not support multiple pages:
   *
   * - `"JPG"`
   * - `"PNG"`
   * - `"SVG"`
   */
  url: string;
};

/**
 * @public
 * Export completed response
 */
export declare type ExportCompleted = {
  /**
   * The status of the export flow when the user has submitted the export menu.
   */
  status: "COMPLETED";
  /**
   * The exported files.
   *
   * @remarks
   * This array only contains one element. This is because, if a multi-page design is exported as multiple files, the files are exported in a ZIP file. In the future, there'll be an option for each file to be a separate element in the array.
   */
  exportBlobs: ExportBlob[];
};

/**
 * @public
 * The types of files that Canva supports for exported designs.
 */
export declare type ExportFileType =
  | "PNG"
  | "JPG"
  | "PDF_STANDARD"
  | "VIDEO"
  | "GIF"
  | "PPTX"
  | "SVG";

/**
 * @public
 * The options for configuring the export of a design.
 */
export declare type ExportRequest = {
  /**
   * The types of files the user can export their design as.
   *
   * @remarks
   * You must provide at least one file type.
   */
  acceptedFileTypes: ExportFileType[];
};

/**
 * @public
 * The response of an export request.
 */
export declare type ExportResponse = ExportCompleted | ExportAborted;

/**
 * @public
 * The appearance of a path's interior.
 */
export declare type Fill = {
  /**
   * The color of the fill as a hex code.
   *
   * @remarks
   * The hex code must include all six characters and be prefixed with a # symbol (e.g. #ff0099).
   * Only one type of fill (color, image or video) can be set.
   */
  color?: string;
};

/**
 * Allows to get the context of currently selected page.
 * @public
 * @returns Page context of currently selected page
 */
export declare function getCurrentPageContext(): Promise<PageContext>;

declare type Height = {
  width: "auto";
  height: number;
};

/**
 * @public
 * Options for making an `HTMLImageElement` draggable.
 */
export declare type ImageElementData = DragCallback & {
  /**
   * The element to be made draggable.
   */
  node: HTMLImageElement;
  /**
   * Options for defining the drag and drop behavior.
   *
   * @remarks
   * If any of this data is omitted, it's inferred from the `node` property.
   */
  dragData?:
    | Partial<UserSuppliedImageDragData>
    | (Partial<UserSuppliedVideoDragData> &
        Pick<UserSuppliedVideoDragData, "type" | "resolveVideoRef">);
};

/**
 * @public
 * A unique identifier that references an image asset in Canva's backend.
 */
export declare type ImageRef = string & {
  __imageRef: never;
};

/**
 * @public
 * @param appElementConfig
 */
export declare function initAppElement<A extends AppElementData>(
  appElementConfig: AppElementClientConfiguration<A>
): AppElementClient<A>;

/**
 * @public
 * A native element.
 */
export declare type NativeElement =
  | NativeImageElement
  | NativeVideoElement
  | NativeEmbedElement
  | NativeTextElement
  | NativeShapeElement
  | NativeGroupElement;

/**
 * @public
 * The types of elements an app can add to a user's design.
 */
export declare type NativeElementType =
  | "IMAGE"
  | "EMBED"
  | "TEXT"
  | "SHAPE"
  | "VIDEO";

/**
 * @public
 * An element that exists within an app or group element.
 */
export declare type NativeElementWithBox =
  | NativeImageElementWithBox
  | NativeVideoElementWithBox
  | NativeEmbedElementWithBox
  | NativeTextElementWithBox
  | NativeShapeElementWithBox
  | NativeGroupElementWithBox;

/**
 * @public
 * An element that renders an embeddable piece of media, such as a YouTube video.
 */
export declare type NativeEmbedElement = {
  /**
   * The type of element.
   */
  type: "EMBED";
  /**
   * The URL of the embed. This URL must be supported by the Iframely API.
   */
  url: string;
};

/**
 * @public
 * An element that renders an embeddable piece of media, such as a YouTube video.
 *
 * @remarks
 * This type includes properties for controlling the position and dimensions of the
 * element.
 * It will be positioned and sized relative to its parent container.
 * The parent container may be an app element, or the current page.
 */
export declare type NativeEmbedElementWithBox = {
  /**
   * The type of element.
   */
  type: "EMBED";
  /**
   * The URL of the embed.
   *
   * @remarks
   * This URL must be supported by the Iframely API.
   */
  url: string;
} & Box;

/**
 * @public
 * An element containing two or more {@link NativeElementWithBox}.
 */
export declare type NativeGroupElement = {
  /**
   * The type of element.
   */
  type: "GROUP";
  /**
   * The inner elements contained by the group element. These elements require a Box as they are
   * relatively positioned to the outer boundaries of the group element.
   */
  children: NativeSimpleElementWithBox[];
};

/**
 * @public
 * An element containing two or more {@link NativeSimpleElementWithBox}.
 *
 * @remarks
 * This type includes properties for controlling the position and dimensions
 * of the element
 */
declare type NativeGroupElementWithBox = {
  /**
   * The type of element.
   */
  type: "GROUP";
  /**
   * The inner elements contained by the group element. These elements require a Box as they are
   * relatively positioned to the outer boundaries of the group element.
   */
  children: NativeSimpleElementWithBox[];
} & Box;

/**
 * @public
 * An element that renders an image in the user's design.
 */
export declare type NativeImageElement = {
  /**
   * The type of element.
   */
  type: "IMAGE";
} & (
  | {
      /**
       * A data URL that contains the image data.
       */
      dataUrl: string;
      /**
       * A unique identifier that references an image asset in Canva's backend.
       */
      ref?: never;
    }
  | {
      /**
       * A data URL that contains the image data.
       */
      dataUrl?: never;
      /**
       * A unique identifier that references an image asset in Canva's backend.
       */
      ref: ImageRef;
    }
);

/**
 * @public
 * An element that renders an image in the user's design.
 *
 * @remarks
 * This type includes properties for controlling the position and dimensions
 * of the element.
 * It will be positioned and sized relative to its parent container.
 * The parent container may be an app element, or the current page.
 */
export declare type NativeImageElementWithBox = NativeImageElement & Box;

/**
 * @public
 * An element that renders a vector shape.
 */
export declare type NativeShapeElement = {
  /**
   * The type of element.
   */
  type: "SHAPE";
  /**
   * Properties for configuring the scale and cropping of a shape.
   *
   * @remarks
   * This is similar to the `viewBox` attribute of the <svg> element.
   */
  viewBox: ShapeViewBox;
  /**
   * The paths that define the shape of the element.
   *
   * @remarks
   * There must be between 1 and 30 paths. The maximum combined size of all paths must
   * not exceed 2kb. The maximum numbrer of unique fill colors across all paths is 6.
   */
  paths: ShapePath[];
};

/**
 * @public
 * An element that renders a vector shape.
 *
 * @remarks
 * This type includes properties for controlling the position and dimensions of the
 * element.
 * It will be positioned and sized relative to its parent container.
 * The parent container may be an app element, or the current page.
 */
export declare type NativeShapeElementWithBox = {
  /**
   * The type of element.
   */
  type: "SHAPE";
  /**
   * Properties for configuring the scale and cropping of a shape.
   *
   * @remarks
   * This is similar to the `viewBox` attribute of the <svg> element.
   */
  viewBox: ShapeViewBox;
  /**
   * The paths that define the shape of the element.
   */
  paths: ShapePath[];
} & Box;

/**
 * @public
 * An element that exists within a group element.
 */
export declare type NativeSimpleElementWithBox = Exclude<
  NativeElementWithBox,
  NativeGroupElementWithBox
>;

/**
 * @public
 * An element that renders text.
 */
export declare type NativeTextElement = {
  /**
   * The type of element.
   */
  type: "TEXT";
  /**
   * The text to render within the element. In the future, each item in this
   * array will map to a paragraph. At the moment, only one item is supported.
   */
  children: string[];
} & TextAttributes;

/**
 * @public
 * An element that renders text.
 *
 * @remarks
 * This type includes properties for controlling the position and dimensions of the
 * element.
 * It will be positioned and sized relative to its parent container.
 * The parent container may be an app element, or the current page.
 */
export declare type NativeTextElementWithBox = {
  /**
   * The type of element.
   */
  type: "TEXT";
  /**
   * The text to render within the element.
   *
   * @remarks
   * In the future, each item in this array will map to a paragraph. At the moment,
   * only one item is supported.
   */
  children: [string];
  /**
   * The width of the element. This must be an integer between 0 and 32767.
   */
  width?: number;
  /**
   * The distance from the top edge of the container.
   *
   * @remarks
   * This must be an integer between -32768 and 32767. This property doesn't have
   * any effect if the app element only contains a single element.
   */
  top: number;
  /**
   * The distance from the left edge of the container.
   *
   * @remarks
   * This must be an integer between -32768 and 32767. This property doesn't have
   * any effect if the app element only contains a single element.
   */
  left: number;
  /**
   * The rotation of the element, in degrees.
   *
   * @remarks
   * This must be an integer between -180 and 180.
   */
  rotation?: number;
} & TextAttributes;

/**
 * @public
 * An element that renders a video in the user's design.
 */
export declare type NativeVideoElement = {
  /**
   * The type of element.
   */
  type: "VIDEO";
  /**
   * A unique identifier that references a video asset in Canva's backend.
   */
  ref: VideoRef;
};

/**
 * @public
 * An element that renders a video in the user's design.
 *
 * @remarks
 * This type includes properties for controlling the position and dimensions
 * of the element.
 * It will be positioned and sized relative to its parent container.
 * The parent container may be an app element, or the current page.
 */
export declare type NativeVideoElementWithBox = NativeVideoElement & Box;

/**
 * The types of object primitive values that can be stored within an app element's data.
 */
declare type ObjectPrimitive = Boolean | String;

/**
 * @public
 * Page context
 */
export declare type PageContext = {
  /**
   * Page dimensions in px
   *
   * @remarks
   * This value is undefined for Whiteboard and Docs
   */
  dimensions: PageDimensions | undefined;
};

/**
 * @public
 * Page Dimensions
 */
declare type PageDimensions = {
  width: number;
  height: number;
};

/**
 * @public
 * The outline of a path.
 */
export declare type PathStroke = {
  /**
   * The weight of the stroke. This must be an integer between 0 and 100.
   */
  weight: number;
  /**
   * The color of the stroke as a hex code.
   *
   * @remarks
   * The hex code must include all six characters and be prefixed with a # symbol (e.g. #ff0099).
   */
  color: string;
  /**
   * The alignment of the stroke. The only supported value is 'inset'.
   */
  strokeAlign: "inset";
};

/**
 * @public
 * The dimensions, position, and rotation of an element.
 */
export declare type Placement = Position & (WidthAndHeight | Width | Height);

declare type Position = {
  /**
   * The distance from the top edge of the container.
   *
   * @remarks
   * This must be an integer between -32768 and 32767. This property doesn't
   * have any effect if the app element only contains a single element.
   */
  top: number;
  /**
   * The distance from the left edge of the container.
   *
   * @remarks
   * This must be an integer between -32768 and 32767. This property doesn't
   * have any effect if the app element only contains a single element.
   */
  left: number;
  /**
   * The rotation of the box, in degrees.
   *
   * @remarks
   * This must be an integer between -180 and 180.
   */
  rotation?: number;
};

/**
 * The types of primitive values that can be stored within an app element's data.
 *
 * @remarks
 * All types of primitives are supported except for symbols.
 */
declare type Primitive = undefined | null | number | boolean | string | bigint;

/**
 * @public
 * Exports the user's design as one or more static files.
 * @param request - The request object containing configurations of the design export.
 */
export declare function requestExport(
  request: ExportRequest
): Promise<ExportResponse>;

/**
 * @public
 * A path that defines the shape of a shape element.
 */
export declare type ShapePath = {
  /**
   * The shape of the path.
   *
   * @remarks
   * This accepts the same value as the `d` attribute of the SVG <path> element,
   * with some limitations.
   *
   * The path must:
   *
   * - start with an M command
   * - not have more than one M command
   * - not use the Q command
   * - be closed, either with a Z command at the end or by having the last
   * coordinate match the first coordinate
   */
  d: string;
  /**
   * The appearance of the path's interior.
   */
  fill: Fill;
  /**
   * The outline of the path.
   */
  stroke?: PathStroke;
};

/**
 * @public
 * Properties for configuring the scale and cropping of a shape.
 *
 * @remarks
 * This is similar to the `viewBox` attribute of the <svg> element.
 */
export declare type ShapeViewBox = {
  /**
   * The distance of the shape from the top edge of the element.
   */
  top: number;
  /**
   * The distance of the shape from the left edge of the element.
   */
  left: number;
  /**
   * The width of the view box.
   */
  width: number;
  /**
   * The height of the view box.
   */
  height: number;
};

/**
 * @public
 * Attributes for changing the appearance of text.
 */
declare type TextAttributes = {
  /**
   * The size of the text.
   *
   * @remarks
   * The default value is 16. This must be an integer between 1 and 1000.
   * This property will be ignored when adding native text elements without specifying placement.
   */
  fontSize?: number;
  /**
   * The alignment of the text. The default value is 'start'.
   */
  textAlign?: "start" | "center" | "end";
  /**
   * The color of the text as a hex code.
   *
   * @remarks
   * The hex code must include all six characters and be prefixed with a # symbol
   * (e.g. #ff0099). The default value is #000000.
   */
  color?: string;
  /**
   * The weight of the font. The default value is 'normal'.
   */
  fontWeight?: "normal" | "bold";
  /**
   * The style of the font. The default value is 'normal'.
   */
  fontStyle?: "normal" | "italic";
  /**
   * The decoration of the font. The default value is 'none'.
   */
  decoration?: "none" | "underline";
};

/**
 * The methods for adding drag-and-drop behavior to an app.
 * @public
 */
export declare interface UI {
  /**
   * Makes the specified node draggable.
   *
   * @param options - Options for making an element draggable.
   */
  makeDraggable(options: DraggableElementData): void;
}

/**
 * An alias for the UI interface, providing access to ui related functionality
 * @public
 */
export declare const ui: UI;

/**
 * @public
 * Options for defining the drag and drop behavior of audio tracks.
 */
export declare type UserSuppliedAudioDragData = {
  /**
   * The type of element.
   */
  type: "AUDIO";
  /**
   * A function that returns a reference (ref) to an audio asset in Canva's backend.
   */
  resolveAudioRef: () => Promise<{
    ref: AudioRef;
  }>;
  /**
   * The duration of the audio track, in milliseconds.
   */
  durationMs: number;
  /**
   * A human readable title for the audio track.
   */
  title: string;
};

/**
 * @public
 *
 * Options for defining the Drag and Drop behaviour for images
 * which have been supplied as data urls
 */
export declare type UserSuppliedDataUrlImageDragData = CommonImageDragData & {
  /**
   * The dimensions of the full-size image.
   *
   * @remarks
   * The full-size image is the image that Canva uploads to the user's account and
   * adds to their design.
   *
   * If omitted, the value of the `previewSize` property is used as a fallback.
   */
  fullSize?: Dimensions;
  /**
   * The data URL of the preview image.
   *
   * @remarks
   * The preview image is the image that users see under their cursor while dragging
   * it into their design.
   *
   * If omitted, the value of the `fullSizeSrc` property is used as a fallback.
   */
  previewSrc?: string;
  /**
   * The data URL of the full-size image.
   *
   * @remarks
   * The full-size image is the image that Canva uploads to the user's account and
   * adds to their design.
   */
  fullSizeSrc: string;
};

/**
 * @public
 * Options for defining the drag and drop behavior that can be defined by an app developer.
 */
export declare type UserSuppliedDragData =
  | UserSuppliedImageDragData
  | UserSuppliedTextDragData
  | UserSuppliedVideoDragData
  | UserSuppliedAudioDragData;

/**
 * @public
 *
 * Options for defining the Drag and Drop behaviour for images uploaded
 * via the Content capability.
 */
export declare type UserSuppliedExternalImageDragData = CommonImageDragData & {
  /**
   * The function that resolves an image ref
   * @remarks
   *
   * This function will be run during the drag process in order to fetch the media ref of the
   * external image being fetched. This function should return the result of `upload`
   * from the content capability.
   */
  resolveImageRef: () => Promise<{
    ref: ImageRef;
  }>;
  /**
   * The URL of the preview image.
   *
   * @remarks
   * The preview image is the image that users see under their cursor while dragging
   * it into their design.
   */
  previewSrc: string;
  /**
   * The dimensions of the full-size image.
   *
   * @remarks
   * The full-size image is the image that Canva uploads to the user's account and
   * adds to their design.
   *
   * If omitted, the value of the `previewSize` property is used as a fallback.
   */
  fullSize?: Dimensions;
};

/**
 * @public
 * Options for defining the drag and drop behavior of an image element that can be defined by an
 * app developer.
 */
export declare type UserSuppliedImageDragData =
  | UserSuppliedDataUrlImageDragData
  | UserSuppliedExternalImageDragData;

/**
 * @public
 * Options for defining the drag and drop behavior of a text element.
 */
export declare type UserSuppliedTextDragData = {
  /**
   * The type of element.
   */
  type: "TEXT";
  /**
   * The text content to drag.
   */
  children?: string[];
  /**
   * The alignment of the text. The default value is 'start'.
   */
  textAlign?: "start" | "center" | "end";
  /**
   * The weight of the font. The default value is 'normal'.
   */
  fontWeight?: "normal" | "bold";
  /**
   * The style of the font. The default value is 'normal'.
   */
  fontStyle?: "normal" | "italic";
  /**
   * The decoration of the font. The default value is 'none'.
   */
  decoration?: "none" | "underline";
};

/**
 * @public
 * Options for defining the drag and drop behavior for videos.
 */
export declare type UserSuppliedVideoDragData = {
  /**
   * The type of element.
   */
  type: "VIDEO";
  /**
   * The function used resolve the video ref.
   * This is used in conjunction with content import.
   */
  resolveVideoRef: () => Promise<{
    ref: VideoRef;
  }>;
  /**
   * The dimensions of the preview image.
   * @remarks
   * The preview image is the image that users see under their cursor
   * while dragging it into their design.
   */
  previewSize: Dimensions;
  /**
   * The dimensions of the full-size video.
   * These dimensions are used when adding the video to the design
   *
   * If omitted, the value of the `previewSize` property is
   * used as a fallback.
   */
  fullSize?: Dimensions;
  /**
   * The URL of the preview image.
   *
   * @remarks
   * The preview image is the image that users see under their cursor while dragging
   * it into their design.
   */
  previewSrc: string;
};

/**
 * @public
 * The types of values that can be stored within an app element's data.
 */
export declare type Value =
  | Primitive
  | ObjectPrimitive
  | Value[]
  | {
      [key: string]: Value;
    }
  | Map<Value, Value>
  | Set<Value>;

/**
 * @public
 * A unique identifier that references a video asset in Canva's backend.
 */
export declare type VideoRef = string & {
  __videoRef: never;
};

declare type Width = {
  width: number;
  height: "auto";
};

declare type WidthAndHeight = {
  /**
   * The width of the box. If height is a number, this can be set to "auto".
   * Otherwise, it must be an integer between 0 and 32767.
   */
  width: number;
  /**
   * The height of the box. If width is a number, this can be set to "auto".
   * Otherwise, it must be an integer between 0 and 32767.
   */
  height: number;
};

export {};
