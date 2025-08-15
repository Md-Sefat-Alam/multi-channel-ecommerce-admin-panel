declare interface MenuData {
  key: string;
  label: string;
  icon: React.ReactNode;
  children?: MenuData[];
  isLocked?: boolean; // Adding isLocked to handle permission lock
  url?: string;
}

declare type MenuItem = Required<MenuProps>["items"][number];

declare interface BreakPoints {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}

// -----------Insurer Interface--------------
declare interface IGetProps {
  start: number; // start value to fetch data from. default = 0;
  length: number; // number of data to fetch. default = 10;
  filters?: {
    [string]: any;
  };
  search?: {
    // search value can also be an empty set{}.
    value?: {
      [string]: any;
    };
    [string]: any;
  };
}

declare interface IPostReturnType {
  correlationId: string;
  status: string;
  name: "Unauthorized" | "Authorized";
  message: string;
}

declare interface IRes<T> {
  data: T;
  recordsTotal: number;
  recordsFiltered: number;
  message: string;
}

declare interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>["field"];
  sortOrder?: SorterResult<any>["order"];
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

declare type ColumnsType<T extends object = object> = TableProps<T>["columns"];
