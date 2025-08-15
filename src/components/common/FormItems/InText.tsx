"use client";
import Defaults from "@/constant/Defaults";
import { Col, Form, Input } from "antd";
import { InputCommonProps } from "../../../../types/commonTypes";
import { NamePath } from "antd/es/form/interface";
const { Item } = Form;

interface Props<T> extends InputCommonProps<T> {}

export default function InText<T>({
    name,
    bPoint,
    label,
    placeholder,
    rules,
    size,
    readOnly,
    disabled,
    addonBefore,
    addonAfter,
    ...rest
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
            <Item<T> name={name as NamePath} label={label} rules={rules}>
                <Input
                    size={size || Defaults.inputFields}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    disabled={disabled}
                    prefix={addonBefore}
                    suffix={addonAfter}
                />
            </Item>
        </Col>
    );
}
