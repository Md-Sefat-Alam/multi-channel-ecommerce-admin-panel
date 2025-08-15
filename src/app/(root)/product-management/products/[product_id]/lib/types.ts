export interface ICustomerEdit {
  productName: string; // required;
  productDescription: JSON; // required;
  sumAssured: number; //int; required;
  term?: number; // int;
  mode?: "MONTHLY" | "QUARTERLY" | "HALF YEARLY" | "YEARLY"; // MONTHLY, QUARTERLY, HALF YEARLY, YEARLY
  adcOrgId: number; // int; required;
}
