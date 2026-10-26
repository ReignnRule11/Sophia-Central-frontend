import { apiRequest } from './client';

type PresignedUpload = { presignedUrl: string; key: string; uploadId: string; publicUrl: string };

export const uploadApi = {
  presign: (payload: { resourceId: string; filename: string; mimetype: string; size: number }) =>
    apiRequest<PresignedUpload>('/upload/presigned-url', { method: 'POST', body: JSON.stringify(payload) }),
  complete: (payload: { key: string; resourceId: string; mimetype: string; size: number }) =>
    apiRequest<{ success: boolean; resourceId: string; fileUrl: string; message: string }>('/upload/complete', { method: 'POST', body: JSON.stringify(payload) }),
};
