import { FormInstance, Rule } from "antd/es/form";
import { NamePath } from "antd/es/form/interface";

export interface InputCommonProps<T> {
    // name: NamePath | typeof T;
    name: keyof T | NamePath<T>;
    label?: string;
    rules?: Rule[];
    placeholder?: string;
    bPoint?: BreakPoints;
    addonBefore?: React.ReactNode;
    addonAfter?: React.ReactNode;
    size?: "large" | "middle" | "small";
    readOnly?: boolean;
    disabled?: boolean;
    loading?: boolean;
    form?: FormInstance<any>;
    onChange?: (event: any) => void;
}
