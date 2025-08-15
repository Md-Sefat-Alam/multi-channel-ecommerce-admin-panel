"use client";
import Defaults from "@/constant/Defaults";
import { Checkbox, Col, Form, Input } from "antd";
import { InputCommonProps } from "../../../../types/commonTypes";
import { NamePath } from "antd/es/form/interface";
const { Item } = Form;

interface Props<T> extends InputCommonProps<T> { }

export default function InCheckbox<T>({
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
            <Item<T> name={name as NamePath} label={false} rules={rules}>
                <Checkbox>{label}</Checkbox>
            </Item>
        </Col>
    );
}
