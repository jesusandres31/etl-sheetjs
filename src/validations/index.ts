import { check } from "express-validator";

export const uuidValdn = [
  check("uuid", "uuid is invalid")
    .exists({ checkNull: true })
    .isString()
    .isLength({ max: 36, min: 36 }),
];

export const uploadExcelValdn = [
  check("year", "year is invalid")
    .exists({ checkNull: true })
    .isString()
    .isLength({ min: 4, max: 4 }),
];
