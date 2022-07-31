import { Month } from '../types';

export interface IExpiration {
  tax_id: number | null;
  year: number | null;
  month: Month;
  taxpayer_financial_year_close: Month | null;
  exp_0: number | null;
  exp_1: number | null;
  exp_2: number | null;
  exp_3: number | null;
  exp_4: number | null;
  exp_5: number | null;
  exp_6: number | null;
  exp_7: number | null;
  exp_8: number | null;
  exp_9: number | null;
}
