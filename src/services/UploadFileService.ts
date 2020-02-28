import multer from 'multer';

import multerConfig from '@config/multer';

const uploadFileService = multer(multerConfig);

export default uploadFileService;
