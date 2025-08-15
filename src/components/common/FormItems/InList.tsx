"use client";
import Defaults from "@/constant/Defaults";
import { Button, Card, Col, Form, Input, Space } from "antd";
import { InputCommonProps } from "../../../../types/commonTypes";
import { NamePath } from "antd/es/form/interface";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { rule_required } from "@/app/(root)/utils/rules/formRules";
import InText from "./InText";

interface Props<T> extends InputCommonProps<T> {
  initialValue?: Object[];
  hideCloseAble?: boolean;
  hideAddMoreButton?: boolean;
  isKeyReadOnly?: boolean;
}

export default function InList<T>({
  name,
  bPoint,
  label,
  placeholder,
  rules,
  size,
  initialValue,
  hideAddMoreButton,
  hideCloseAble,
  isKeyReadOnly,
  readOnly,
}: Props<T>) {
  return (
    <Col xs={24} xl={12}>
      <Card title={label} size={"small"}>
        <Form.List
          initialValue={initialValue?.length ? initialValue : [{}]}
          name={name as NamePath}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 8,
                    width: "100%",
                  }}
                  align="baseline"
                >
                  <InText<any>
                    {...restField}
                    name={[name, "key"]}
                    rules={[rule_required()]}
                    bPoint={{ sm: 24 }}
                    placeholder="Benefits Key"
                    readOnly={isKeyReadOnly || readOnly}
                  />
                  <InText<any>
                    {...restField}
                    name={[name, "value"]}
                    rules={[rule_required()]}
                    bPoint={{ sm: 24 }}
                    placeholder="Benefits Value"
                    readOnly={readOnly}
                  />
                  {fields.length > 1 && !hideCloseAble && !readOnly ? (
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  ) : (
                    ""
                  )}
                </Space>
              ))}
              {!hideAddMoreButton && !readOnly ? (
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Benefits
                  </Button>
                </Form.Item>
              ) : (
                ""
              )}
            </>
          )}
        </Form.List>
      </Card>
    </Col>
  );
}
