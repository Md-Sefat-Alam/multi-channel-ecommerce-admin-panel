"use client";
import Defaults from "@/constant/Defaults";
import { Col, Form, Input } from "antd";
import { NamePath } from "antd/es/form/interface";
import { InputCommonProps } from "../../../../types/commonTypes";
const { Item } = Form;
const { TextArea } = Input;

interface Props<T> extends InputCommonProps<T> {
  cols?: number;
  rows?: number;
}

export default function InTextArea<T>({
  name,
  bPoint,
  label,
  placeholder,
  rules,
  cols,
  rows,
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
        <TextArea
          size={size || Defaults.inputFields}
          cols={cols || 3}
          rows={rows || 1}
          placeholder={placeholder}
        />
      </Item>
    </Col>
  );
}
