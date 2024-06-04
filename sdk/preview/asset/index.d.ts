declare type AllOrNone<T> = T | Never<T>;

/**
 * @beta
 * Defines the positioning of the color selector.
 */
export declare type Anchor = {
  height: number;
  width: number;
  top: number;
  left: number;
};

/**
 * @public
 * Options that the app must supply to initiate an asset upload.
 */
export declare type AssetUploadOptions =
  | ImageUploadOptions
  | VideoUploadOptions
  | AudioUploadOptions;

/**
 * @public
 * The supported MIME types for audio assets in Canva.
 */
export declare type AudioMimeType =
  | "audio/mpeg"
  | "audio/mp4"
  | "audio/x-m4a"
  | "audio/mp3"
  | "audio/ogg"
  | "audio/wav"
  | "audio/x-wav"
  | "audio/wave"
  | "audio/vnd.wave"
  | "audio/x-pn-wav"
  | "audio/webm";

/**
 * @public
 * A unique identifier that references an audio asset in Canva's backend.
 */
export declare type AudioRef = string & {
  __audioRef: never;
};

/**
 * @public
 * Options that the app must supply to initiate the audio upload.
 */
export declare type AudioUploadOptions = {
  /**
   * For audio upload, the type is always 'AUDIO'
   */
  readonly type: "AUDIO";
  /**
   * @deprecated
   * An id is a unique identifier specified by the developer,
   * It must be an alphanumeric string of up to 100 characters.
   * Each resource id uniquely identifies an external audio.
   */
  readonly id?: string;
  /**
   * A URL of the audio to upload. Must be an HTTPS URL of up to 4096 characters.
   */
  readonly url: string;
  /**
   * A MIME type of the audio. It must be one of these:
   * - 'audio/mpeg'
   * - 'audio/mp4'
   * - 'audio/x-m4a'
   * - 'audio/mp3'
   * - 'audio/ogg'
   * - 'audio/wav'
   * - 'audio/x-wav'
   * - 'audio/webm'
   */
  readonly mimeType: AudioMimeType;
  /**
   * Title of the audio file which Canva will display in the editor.
   */
  readonly title: string;
  /**
   * Duration of the audio file which Canva will use when using the file for the first time,
   * in milliseconds.
   */
  readonly durationMs: number;
};

/**
 * @beta
 * Callback function to close the currently open color selector
 */
export declare type CloseColorSelectorFn = () => void;

/**
 * @beta
 * A color.
 */
export declare type Color = SolidColor;

/**
 * @beta The color selection.
 */
export declare type ColorSelection = {
  ["solid"]: SolidColor;
};

/**
 * @beta
 * Information about the user's color selection based on the specified scope.
 */
export declare type ColorSelectionEvent<Scope extends ColorSelectionScope> = {
  selection: ColorSelection[Scope];
};

/**
 * @beta
 * Specifies the scope of color selection.
 */
export declare type ColorSelectionScope = "solid";

/**
 * @beta
 * Options to be passed to the `openColorSelector` api.
 */
export declare interface ColorSelectorOpts<Scope extends ColorSelectionScope> {
  /**
   * The types of color selection scopes that the color selector should support.
   */
  scopes: Scope[];
  /**
   * Callback that runs when the user makes a color selection.
   */
  onColorSelect(event: ColorSelectionEvent<Scope>): void;
}

/**
 * @public
 * The image dimensions
 */
export declare type Dimensions = {
  /**
   * Image width. Used only to calculate the aspect ratio.
   */
  readonly width: number;
  /**
   * Image height. Used only to calculate the aspect ratio.
   */
  readonly height: number;
};

/**
 * @beta
 * Lists a curated selection of fonts available for use within Canva when no `options` is provided,
 * otherwise performs filtering based on the criteria specified in the `options`.
 * @remarks
 * To list all available fonts, please use the `requestFontSelection` method.
 */
export declare function findFonts(
  options?: FindFontsOptions
): Promise<FindFontsResponse>;

/**
 * @beta
 * Arguments to the findFonts method.
 */
export declare type FindFontsOptions = {
  fontRefs?: readonly FontRef[];
};

/**
 * @public
 * A response to the findFonts method.
 */
export declare type FindFontsResponse = {
  fonts: readonly Font[];
};

/**
 * @public
 * A font which reference can be used in other parts of the SDK.
 */
export declare type Font = {
  /**
   * A unique font identifier that can be used in other parts of the SDK.
   */
  ref: FontRef;
  /**
   * Name of the font.
   */
  name: string;
  /**
   * Available weights of the font, together with information about styles usable for each weight
   */
  weights: readonly FontWeight[];
  /**
   * An URL to the preview image of the font that can be displayed in the app UI.
   */
  previewUrl?: string;
};

/**
 * @public
 * A unique identifier that references a font in Canva
 */
export declare type FontRef = string & {
  __fontRef: never;
};

/**
 * @public
 * Arguments to the requestFontSelection method.
 */
export declare type FontSelectionRequest = {
  /**
   * The ref for the font that's initially selected when the font panel opens.
   */
  selectedFontRef?: FontRef;
};

/**
 * @public
 * A response to the requestFontSelection method.
 */
export declare type FontSelectionResponse =
  | {
      type: "COMPLETED";
      font: Font;
    }
  | {
      type: "ABORTED";
    };

/**
 * @public
 * Available font styles
 */
export declare type FontStyle = "normal" | "italic";

/**
 * @public
 * Information about a specific available font weight, and which styles it can be used with
 */
export declare type FontWeight = {
  weight: FontWeightName;
  styles: FontStyle[];
};

/**
 * @public
 * Available font weights
 */
export declare type FontWeightName =
  | "normal"
  | "thin"
  | "extralight"
  | "light"
  | "medium"
  | "semibold"
  | "bold"
  | "ultrabold"
  | "heavy";

/**
 * @public
 * Returns a temporary URL to an asset already present in the current design.
 */
export declare function getTemporaryUrl(
  options: GetTemporaryUrlForImageOptions
): Promise<TemporaryUrlForImage>;

/**
 * @public
 * Returns a temporary URL to an asset already present in the current design.
 */
export declare function getTemporaryUrl(
  options: GetTemporaryUrlForVideoOptions
): Promise<TemporaryUrlForVideo>;

/**
 * @public
 * Returns a temporary URL to an asset already present in the current design.
 */
export declare function getTemporaryUrl(
  options: GetTemporaryUrlOptions
): Promise<TemporaryUrl>;

/**
 * @public
 * Options that must be passed when obtaining a temporary URL to an image present in the current
 * design.
 */
export declare type GetTemporaryUrlForImageOptions = {
  readonly type: "IMAGE";
  readonly ref: ImageRef;
};

/**
 * @public
 * Options that must be passed when obtaining a temporary URL to a video present in the current
 * design.
 */
export declare type GetTemporaryUrlForVideoOptions = {
  readonly type: "VIDEO";
  readonly ref: VideoRef;
};

/**
 * @public
 * Options that must be passed when obtaining a temporary URL to an asset present in the current
 * design.
 */
export declare type GetTemporaryUrlOptions =
  | GetTemporaryUrlForImageOptions
  | GetTemporaryUrlForVideoOptions;

/**
 * @public
 * The supported MIME types for image assets in Canva.
 */
export declare type ImageMimeType =
  | "image/jpeg"
  | "image/heic"
  | "image/png"
  | "image/svg+xml"
  | "image/webp"
  | "image/tiff";

/**
 * @public
 * A unique identifier that references an image asset in Canva's backend.
 */
export declare type ImageRef = string & {
  __imageRef: never;
};

/**
 * @public
 * Options that the app must supply to initiate the image upload.
 */
export declare type ImageUploadOptions = {
  /**
   * For image upload, the type is always 'IMAGE'
   */
  readonly type: "IMAGE";
  /**
   * @deprecated
   * An id is a unique identifier specified by the developer,
   * It must be an alphanumeric string of up to 100 characters.
   * Each resource id uniquely identifies an external image.
   */
  readonly id?: string;
  /**
   * A reference to the image that this image was derived from.
   */
  readonly parentRef?: ImageRef;
  /**
   * A URL of the image to upload. Must be an HTTPS URL of up to 4096 characters.
   */
  readonly url: string;
  /**
   * A MIME type of the image. It must be one of these:
   * - image/jpeg
   * - image/heic
   * - image/png
   * - image/svg+xml
   * - image/webp
   */
  readonly mimeType: ImageMimeType;
  /**
   * A URL of a smaller image or a thumbnail that Canva will display while the image upload
   * is still in progress. Must be a valid HTTPS URL of up to 4096 characters.
   */
  readonly thumbnailUrl: string;
} & AllOrNone<Dimensions>;

declare type Never<T> = {
  [key in keyof T]?: never;
};

/**
 * @beta
 * Prompts the user to choose a color that can be used within Canva.
 *
 */
export declare function openColorSelector<Scope extends ColorSelectionScope>(
  anchor: Anchor,
  options: ColorSelectorOpts<Scope>
): Promise<CloseColorSelectorFn>;

/**
 * @public
 * The queued asset upload
 */
export declare type QueuedAsset = QueuedImage | QueuedVideo | QueuedAudio;

/**
 * @public
 * The queued audio upload.
 */
export declare type QueuedAudio = {
  /**
   * The audio reference – a unique ID of an audio file that Canva recognizes.
   */
  readonly ref: AudioRef;
  /**
   * A method that a developer can call to await the audio upload completion.
   */
  readonly whenUploaded: () => Promise<void>;
};

/**
 * @public
 * The queued image upload
 */
export declare type QueuedImage = {
  /**
   * The image reference – a unique ID of an image file that Canva recognizes.
   */
  readonly ref: ImageRef;
  /**
   * A method that a developer can call to await the image upload completion.
   */
  readonly whenUploaded: () => Promise<void>;
};

/**
 * @public
 * The queued video upload.
 */
export declare type QueuedVideo = {
  /**
   * The video reference – a unique ID of a video file that Canva recognizes.
   */
  readonly ref: VideoRef;
  /**
   * A method that a developer can call to await the video upload completion.
   */
  readonly whenUploaded: () => Promise<void>;
};

/**
 * @public
 * A generic type for all asset references including images, videos, and audios.
 */
export declare type Ref = ImageRef | VideoRef | AudioRef;

/**
 * @public
 * Prompts the user to choose a font that can be used within Canva.
 */
export declare function requestFontSelection(
  request?: FontSelectionRequest
): Promise<FontSelectionResponse>;

/**
 * @beta
 * A solid color.
 */
export declare type SolidColor = {
  type: "solid";
  hexString: string;
};

/**
 * @public
 * An object containing a temporary URL to an asset present in the current design.
 */
export declare type TemporaryUrl = TemporaryUrlForImage | TemporaryUrlForVideo;

/**
 * @public
 * An object containing a temporary URL to an image present in the current design.
 */
export declare type TemporaryUrlForImage = {
  readonly type: "IMAGE";
  readonly ref: ImageRef;
  readonly url: string;
};

/**
 * @public
 * An object containing a temporary URL to a video present in the current design.
 */
export declare type TemporaryUrlForVideo = {
  readonly type: "VIDEO";
  readonly ref: VideoRef;
  readonly url: string;
};

/**
 * @public
 * This method creates a new asset upload task and adds it to the upload queue.
 * It returns a asset reference, and a function called `whenUploaded()` that can
 * be used to await the upload task completion.
 */
export declare function upload(
  options: ImageUploadOptions
): Promise<QueuedImage>;

/**
 * @public
 * This method creates a new asset upload task and adds it to the upload queue.
 * It returns a asset reference, and a function called `whenUploaded()` that can
 * be used to await the upload task completion.
 */
export declare function upload(
  options: VideoUploadOptions
): Promise<QueuedVideo>;

/**
 * @public
 * This method creates a new asset upload task and adds it to the upload queue.
 * It returns a asset reference, and a function called `whenUploaded()` that can
 * be used to await the upload task completion.
 */
export declare function upload(
  options: AudioUploadOptions
): Promise<QueuedAudio>;

/**
 * @public
 * This method creates a new asset upload task and adds it to the upload queue.
 * It returns a asset reference, and a function called `whenUploaded()` that can
 * be used to await the upload task completion.
 */
export declare function upload(
  options: AssetUploadOptions
): Promise<QueuedAsset>;

/**
 * @public
 * The supported MIME types for video assets in Canva.
 */
export declare type VideoMimeType =
  | "video/avi"
  | "image/gif"
  | "video/x-m4v"
  | "video/x-matroska"
  | "video/quicktime"
  | "video/mp4"
  | "video/mpeg"
  | "video/webm"
  | "application/json";

/**
 * @public
 * A unique identifier that references a video asset in Canva's backend.
 */
export declare type VideoRef = string & {
  __videoRef: never;
};

/**
 * @public
 * Options that the app must supply to initiate the video upload.
 */
export declare type VideoUploadOptions = {
  /**
   * For video upload, the type is always 'VIDEO'
   */
  readonly type: "VIDEO";
  /**
   * @deprecated
   * An id is a unique identifier specified by the developer.
   * It must be an alphanumeric string of up to 100 characters.
   * Each resource id uniquely identifies an external video.
   */
  readonly id?: string;
  /**
   * A reference to the video that this video was derived from.
   */
  readonly parentRef?: VideoRef;
  /**
   * A URL of the video to upload. Must be an HTTPS URL of up to 4096 characters.
   */
  readonly url: string;
  /**
   * A MIME type of the video. It must be one of these:
   * - video/avi
   * - image/gif
   * - video/x-m4v
   * - video/x-matroska
   * - video/quicktime
   * - video/mp4
   * - video/mpeg
   * - video/webm
   * - application/json (Lottie files only)
   */
  readonly mimeType: VideoMimeType;
  /**
   * A URL of a smaller video that Canva will display while the image upload
   * is still in progress. Must be a valid HTTPS URL of up to 4096 characters.
   */
  readonly thumbnailVideoUrl?: string;
  /**
   * A URL of a smaller image that Canva will display while the image upload
   * is still in progress. Must be a valid HTTPS URL of up to 4096 characters.
   */
  readonly thumbnailImageUrl: string;
} & AllOrNone<Dimensions>;

export {};
