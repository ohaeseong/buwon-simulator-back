import { diskStorage } from 'multer';
import { v4 } from 'uuid';

export const storage = diskStorage({
  destination: './upload/plan',
  filename: function (_, file, cb) {
    const fileName = `${v4()}-${file.originalname}`;
    cb(null, fileName);
  },
});
