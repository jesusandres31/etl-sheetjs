import { Router } from "express";
import { checkValidation } from "../middlewares";
import { taxesCtrl } from "../controllers";
import { uuidValdn } from "../validations";

const router = Router();

/**
 * get taxes.
 * @method get
 */
router.route("/taxes").get(taxesCtrl.getTaxes);

/**
 * get a tax by Uuid.
 * @method get
 */
router
  .route("/taxes/:uuid")
  .get(uuidValdn, checkValidation, taxesCtrl.getTaxByUuid);

export default router;
