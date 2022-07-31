import { Router } from "express";
import taxesRoutes from "./taxes.routes";
import excelRoutes from "./excel.routes";

const router = Router();

router.use(taxesRoutes, excelRoutes);

export default router;
