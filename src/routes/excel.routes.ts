import { Router } from "express";
import { checkValidation } from "../middlewares";
import { excelCtrl } from "../controllers";
import { upload } from "../libs";
import { uploadExcelValdn } from "../validations";

const router = Router();

/**
 * upload EXCEL of taxes and expirations.
 * @method post
 */
router
  .route("/excel")
  .post(
    upload.single("excel"),
    uploadExcelValdn,
    checkValidation,
    excelCtrl.uploadExcel
  );

/**
 * download excel.
 * @method get
 */
router.route("/excel").get(excelCtrl.downloadExcel);

export default router;
