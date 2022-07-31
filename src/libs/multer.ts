import multer from "multer";

const upload = multer({
  limits: { fileSize: 100000000 },
});

export default upload;
