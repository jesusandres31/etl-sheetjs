import { NextFunction, Request, Response } from "express";
import { taxesSvcs } from "../services";

class TaxesCtrl {
  /**
   * get taxes.
   */
  public getTaxes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const taxes = await taxesSvcs.getTaxes();
      return res.status(200).json(taxes);
    } catch (e) {
      return next(e);
    }
  };

  /**
   * get a tax by uuid.
   */
  public getTaxByUuid = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { uuid } = req.params;
      const tax = await taxesSvcs.getTaxByUuid(uuid);
      if (tax) {
        return res.status(200).json(tax);
      }
      return next({
        status: 400,
        message: "Ningun impuesto con tal Uuid.",
      });
    } catch (e) {
      return next(e);
    }
  };
}

export const taxesCtrl = new TaxesCtrl();
