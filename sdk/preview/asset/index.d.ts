declare type AllOrNone<T> = T | Never<T>;

declare type AllOrNone_2<T> = T | Never_2<T>;

/**
 * @public
 * An API for operating the user's content.
 */
export declare interface Asset {




    /**
     * This method creates a new asset upload task and adds it to the upload queue.
     * It returns a asset reference, and a function called `whenUploaded()` that can
     * be used to await the upload task completion.
     */
    upload(options: ImageUploadOptions): Promise<QueuedImage>;
    upload(options: VideoUploadOptions): Promise<QueuedVideo>;
    upload(options: AudioUploadOptions): Promise<QueuedAudio>;
    upload(options: AssetUploadOptions): Promise<QueuedAsset>;
    /**
     * @beta
     * Returns a temporary URL to an asset already present in the current design.
     */
    getTemporaryUrl(options: GetTemporaryUrlForImageOptions): Promise<TemporaryUrlForImage>;
    /** @beta */
    getTemporaryUrl(options: GetTemporaryUrlForVideoOptions): Promise<TemporaryUrlForVideo>;
    /** @beta */
    getTemporaryUrl(options: GetTemporaryUrlOptions): Promise<TemporaryUrl>;
}

/**
 * @public
 * Options that the app must supply to initiate an asset upload.
 */
export declare type AssetUploadOptions = ImageUploadOptions | VideoUploadOptions | AudioUploadOptions;

/**
 * @public
 * The supported MIME types for audio assets in Canva.
 */
export declare type AudioMimeType = 'audio/mpeg' | 'audio/mp4' | 'audio/x-m4a' | 'audio/mp3' | 'audio/ogg' | 'audio/wav' | 'audio/x-wav' | 'audio/wave' | 'audio/vnd.wave' | 'audio/x-pn-wav' | 'audio/webm';

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
    readonly type: 'AUDIO';
    /**
     * An id is a unique identifier specified by the developer,
     * It must be an alphanumeric string of up to 100 characters.
     * Each resource id uniquely identifies an external audio.
     */
    readonly id: string;
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
 * Returns a temporary URL to an asset already present in the current design.
 */
export declare function getTemporaryUrl(options: GetTemporaryUrlForImageOptions): Promise<TemporaryUrlForImage>;

/** @beta */
export declare function getTemporaryUrl(options: GetTemporaryUrlForVideoOptions): Promise<TemporaryUrlForVideo>;

/** @beta */
export declare function getTemporaryUrl(options: GetTemporaryUrlOptions): Promise<TemporaryUrl>;

/**
 * @beta
 * Options that must be passed to the capability for getting a temporary URL to an image present in
 * the current design.
 */
export declare type GetTemporaryUrlForImageOptions = {
    readonly type: 'IMAGE';
    readonly ref: ImageRef;
};

/**
 * @beta
 * Options that must be passed to the capability for getting a temporary URL to a video present in
 * the current design.
 */
export declare type GetTemporaryUrlForVideoOptions = {
    readonly type: 'VIDEO';
    readonly ref: VideoRef;
};

/**
 * @beta
 * Options that must be passed to the capability for getting a temporary URL to an asset present in
 * the current design.
 */
export declare type GetTemporaryUrlOptions = GetTemporaryUrlForImageOptions | GetTemporaryUrlForVideoOptions;

/**
 * @public
 * The supported MIME types for image assets in Canva.
 */
export declare type ImageMimeType = 'image/jpeg' | 'image/heic' | 'image/png' | 'image/svg+xml';

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
    readonly type: 'IMAGE';
    /**
     * An id is a unique identifier specified by the developer,
     * It must be an alphanumeric string of up to 100 characters.
     * Each resource id uniquely identifies an external image.
     */
    readonly id: string;
    /**
     * @beta
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

declare type Never_2<T> = {
    [key in keyof T]?: never;
};

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
 * @beta
 * An object containing a temporary URL to an asset present in the current design.
 */
export declare type TemporaryUrl = TemporaryUrlForImage | TemporaryUrlForVideo;

/**
 * @beta
 * An object containing a temporary URL to an image present in the current design.
 */
export declare type TemporaryUrlForImage = {
    readonly type: 'IMAGE';
    readonly ref: ImageRef;
    readonly url: string;
};

/**
 * @beta
 * An object containing a temporary URL to a video present in the current design.
 */
export declare type TemporaryUrlForVideo = {
    readonly type: 'VIDEO';
    readonly ref: VideoRef;
    readonly url: string;
};

/**
 * @public
 * This method creates a new asset upload task and adds it to the upload queue.
 * It returns a asset reference, and a function called `whenUploaded()` that can
 * be used to await the upload task completion.
 */
export declare function upload(options: ImageUploadOptions): Promise<QueuedImage>;

/** @public */
export declare function upload(options: VideoUploadOptions): Promise<QueuedVideo>;

/** @public */
export declare function upload(options: AudioUploadOptions): Promise<QueuedAudio>;

/** @public */
export declare function upload(options: AssetUploadOptions): Promise<QueuedAsset>;

/**
 * @public
 * The supported MIME types for video assets in Canva.
 */
export declare type VideoMimeType = 'video/avi' | 'image/gif' | 'video/x-m4v' | 'video/x-matroska' | 'video/quicktime' | 'video/mp4' | 'video/mpeg' | 'video/webm';

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
    readonly type: 'VIDEO';
    /**
     * An id is a unique identifier specified by the developer.
     * It must be an alphanumeric string of up to 100 characters.
     * Each resource id uniquely identifies an external video.
     */
    readonly id: string;
    /**
     * @beta
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

export { }
