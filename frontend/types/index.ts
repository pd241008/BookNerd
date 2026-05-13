export type StorageType = "standard" | "persistent";

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  fileUrl: string;
  expiryDate?: string;
  storageType?: StorageType;
}
