import { db, qrm } from "../database";
import { ITax } from "../interfaces";

class TaxesSvcs {
  /**
   * get taxes.
   */
  public getTaxes = (): Promise<ITax[]> => {
    return db.func("config.get_taxes", []);
  };

  /**
   * get a tax by uuid.
   */
  public getTaxByUuid = (uuid: string): Promise<ITax> => {
    return db.func("config.get_tax", [uuid], qrm.one);
  };
}

export const taxesSvcs = new TaxesSvcs();
