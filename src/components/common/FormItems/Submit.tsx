import Defaults from "@/constant/Defaults";
import { Button, Col, Form } from "antd";
import React from "react";
const { Item } = Form;

type Props = {
  type?: "link" | "text" | "primary" | "default" | "dashed";
  htmlType?: "button" | "submit" | "reset";
  btnTitle: string;
  size?: "large" | "middle" | "small";
  bPoint?: BreakPoints;
};

export default function Submit({
  htmlType,
  type,
  btnTitle,
  size,
  bPoint,
}: Props) {
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
      <Item>
        <Button
          size={size || Defaults.inputFields}
          type={type}
          htmlType={htmlType}
        >
          {btnTitle}
        </Button>
      </Item>
    </Col>
  );
}
