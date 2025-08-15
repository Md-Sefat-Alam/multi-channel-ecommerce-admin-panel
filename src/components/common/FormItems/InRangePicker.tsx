"use client";
import Defaults from "@/constant/Defaults";
import { Col, DatePicker, Form } from "antd";
import { InputCommonProps } from "../../../../types/commonTypes";
import { NamePath } from "antd/es/form/interface";
const { RangePicker } = DatePicker;
const { Item } = Form;

interface Props<T> extends InputCommonProps<T> {
  format?: string;
}

export default function InRangePicker<T>({
  name,
  bPoint,
  label,
  rules,
  format,
  size,
}: Props<T>) {
  return (
    <Col
      xs={bPoint?.xs || 24}
      sm={bPoint?.sm || bPoint?.xs || 12}
      md={bPoint?.md || bPoint?.xs || bPoint?.sm || 12}
      lg={bPoint?.lg || bPoint?.xs || bPoint?.sm || bPoint?.md || 6}
      xl={
        bPoint?.xl || bPoint?.xs || bPoint?.sm || bPoint?.md || bPoint?.lg || 6
      }
      xxl={
        bPoint?.xxl || bPoint?.xs || bPoint?.sm || bPoint?.md || bPoint?.lg || 6
      }
    >
      <Item<T> name={name as NamePath} label={label} rules={rules}>
        <RangePicker
          size={size || Defaults.inputFields}
          format={format}
          style={{ width: "100%" }}
        />
      </Item>
    </Col>
  );
}
