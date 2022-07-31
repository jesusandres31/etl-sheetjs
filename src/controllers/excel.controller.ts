import { NextFunction, Request, Response } from "express";
import { excelSvcs } from "../services";
import { getMonth } from "../utils";
import { IExpiration, IExcelRow } from "../interfaces";
import {
  MS_SPREADSHEET_EXT,
  EXCEL_FOLDER_PATH,
  EXCEL_TITLE,
} from "../constants";
import fs from "fs";
import xlsx from "xlsx";

class ExcelCtrl {
  /**
   * upload EXCEL of taxes and expirations.
   */
  public uploadExcel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { year } = req.query;
      const excel = req.file?.buffer;
      const workBook = xlsx.read(excel);
      const workSheet = workBook.SheetNames;
      const taxes: string[] = workSheet;
      const expirations: IExpiration[] = [];

      // upload new taxes in the db table
      const uploadedTaxes = await excelSvcs.uploadTaxes(taxes);

      if (uploadedTaxes) {
        // iterate through EXCEL sheets
        taxes.forEach((sheetName, i) => {
          const currentTax = uploadedTaxes.find(
            (row) => row.name === sheetName
          ); // find current taxe

          if (currentTax) {
            const jsonSheet: IExcelRow[] = xlsx.utils.sheet_to_json(
              workBook.Sheets[sheetName]
            );

            let currentCloseMonth: string | null = null; // var to save CIERRE_EJERCICIO value

            // iterate through EXCEL rows
            jsonSheet.forEach((row: IExcelRow) => {
              // creating 'expiration' object
              const exp: IExpiration = {
                year: Number(year as string),
                tax_id: currentTax.id,
                month: getMonth(row.MES),
                taxpayer_financial_year_close: getMonth(row.CIERRE_EJERCICIO),
                exp_0: row.CUIT_0,
                exp_1: row.CUIT_1,
                exp_2: row.CUIT_2,
                exp_3: row.CUIT_3,
                exp_4: row.CUIT_4,
                exp_5: row.CUIT_5,
                exp_6: row.CUIT_6,
                exp_7: row.CUIT_7,
                exp_8: row.CUIT_8,
                exp_9: row.CUIT_9,
              };

              // if row is the one with CIERRE_EJERCICIO, then save that value
              if (row.CIERRE_EJERCICIO) {
                currentCloseMonth = row.CIERRE_EJERCICIO;
              }

              // if next row has its CIERRE_EJERCICIO undefined (because of how it's parsed from excel to json),
              // then assign the saved value
              if (!row.CIERRE_EJERCICIO) {
                exp.taxpayer_financial_year_close = getMonth(currentCloseMonth);
              }

              // push formated 'expiration' in the global array of expiration objects
              expirations.push(exp);
            });
          }
        });

        // upload new expirations
        const uploadedExps = await excelSvcs.uploadExpirations(
          expirations,
          year as string
        );

        // save excel
        excelSvcs.saveExcel(workBook);

        if (uploadedExps) {
          return res.status(200).json({
            message: `Impuestos y Vencimientos actualizados exitosamente.`,
            data: uploadedTaxes,
          });
        }
        return next({
          status: 400,
          message: "Ocurrio un error tratando de insertar los Vencimientos.",
          hint: "Revise el formato del documento Excel.",
        });
      }
      return next({
        status: 400,
        message: "Ocurrio un error tratando de insertar los Impuestos.",
        hint: "Revise el formato del documento Excel.",
      });
    } catch (err) {
      return next(err);
    }
  };

  /**
   * download excel.
   */
  public downloadExcel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const path = `${EXCEL_FOLDER_PATH}/${EXCEL_TITLE}.${MS_SPREADSHEET_EXT}`;
    try {
      if (fs.existsSync(path)) {
        return res.download(path);
      }
      return next({
        status: 400,
        message: "No se ha encontrado el archivo Excel.",
      });
    } catch (e) {
      return next(e);
    }
  };
}

export const excelCtrl = new ExcelCtrl();
