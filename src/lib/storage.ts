// documents.file_url stores the storage object path (new rows) or a legacy public URL.
export function storagePath(fileUrl: string): string {
  const m = fileUrl.match(/\/storage\/v1\/object\/(?:public|sign)\/documents\/([^?]+)/)
  return m ? decodeURIComponent(m[1]) : fileUrl
}
