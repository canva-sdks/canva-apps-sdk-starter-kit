import type { APIResponseItem } from "./data_source";

export interface CanvaItemResponse<T extends APIResponseItem> {
  continuation: string;
  items: T[];
}
