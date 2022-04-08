import path from 'path'
import fs from 'fs'
import { diskStorage } from 'multer'

export const multerStoragePath = (folderName: string) => {
  return {
    storage: diskStorage({
      destination: (_req, _file, cb) => {
        const tempPath = path.join(__dirname, '..', '..', 'uploads', folderName)
        fs.mkdirSync(tempPath, { recursive: true })
        cb(null, tempPath)
      },
      filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
      },
    }),
  }
}
