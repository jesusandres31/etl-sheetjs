import { db } from "../database";
import { IExpiration, ITax } from "../interfaces";
import {
  MS_SPREADSHEET_EXT,
  EXCEL_FOLDER_PATH,
  EXCEL_TITLE,
} from "../constants";
import fs from "fs";
import xlsx from "xlsx";

class ExcelSvcs {
  /**
   * upload taxes.
   */
  public uploadTaxes = (taxes: string[]): Promise<ITax[]> => {
    return db.func("config.upload_taxes", [taxes]);
  };

  /**
   * upload expirations.
   */
  public uploadExpirations = (
    expirations: IExpiration[],
    year: string
  ): Promise<IExpiration[]> => {
    return db.func("config.upload_expirations", [
      JSON.stringify(expirations),
      year,
    ]);
  };

  /**
   * save excel.
   */
  public saveExcel = async (
    workBook: xlsx.WorkBook
  ): Promise<Response | void> => {
    const path = `${EXCEL_FOLDER_PATH}/${EXCEL_TITLE}.${MS_SPREADSHEET_EXT}`;
    // create folder if doesn't exist
    if (!fs.existsSync(EXCEL_FOLDER_PATH)) {
      fs.mkdirSync(EXCEL_FOLDER_PATH);
    }
    // adding metadata to excel
    workBook.Props = {
      Title: EXCEL_TITLE,
      Subject: "etl-webapp",
      Author: "etl-webapp",
      CreatedDate: new Date(),
    };
    // save
    xlsx.writeFile(workBook, path);
  };
}

export const excelSvcs = new ExcelSvcs();
