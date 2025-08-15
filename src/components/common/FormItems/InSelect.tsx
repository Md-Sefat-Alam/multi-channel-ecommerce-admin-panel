"use client";
import Defaults from "@/constant/Defaults";
import { Col, Form, Select } from "antd";
import { InputCommonProps } from "../../../../types/commonTypes";
import { NamePath } from "antd/es/form/interface";
const { Item } = Form;
const { Option } = Select;

interface Props<T> extends InputCommonProps<T> {
    defaultValue?: string | number;
    values: { title: string; value: string }[];
    validate?: NamePath[];
    mode?: "multiple" | "tags";
}

export default function InSelect<T>({
    name,
    bPoint,
    label,
    placeholder,
    rules,
    defaultValue,
    values,
    size,
    loading,
    disabled,
    readOnly,
    validate,
    form,
    onChange,
    mode,
}: Props<T>) {
    return (
        <Col
            xs={bPoint?.xs || 24}
            sm={bPoint?.sm || bPoint?.xs || 12}
            md={bPoint?.md || bPoint?.xs || bPoint?.sm || 12}
            lg={bPoint?.lg || bPoint?.xs || bPoint?.sm || bPoint?.md || 6}
            xl={
                bPoint?.xl ||
                bPoint?.xs ||
                bPoint?.sm ||
                bPoint?.md ||
                bPoint?.lg ||
                6
            }
            xxl={
                bPoint?.xxl ||
                bPoint?.xs ||
                bPoint?.sm ||
                bPoint?.md ||
                bPoint?.lg ||
                6
            }
        >
            <Item<T>
                name={name as NamePath}
                label={label}
                rules={[...(rules || [])]}
            >
                <Select
                    size={size || Defaults.inputFields}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    loading={loading}
                    disabled={disabled || readOnly}
                    onChange={(e) => {
                        if (validate?.length && form) {
                            form.validateFields(validate);
                        }
                        if (onChange) onChange(e);
                    }}
                    mode={mode}
                >
                    {values?.map((item) => (
                        <Option value={item.value}>{item.title}</Option>
                    ))}
                </Select>
            </Item>
        </Col>
    );
}
