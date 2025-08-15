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

export default function InListSingleItem<T>({
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
        <Col xs={24} xl={24}>
            <Card title={label} size={"small"}>
                <Form.List
                    initialValue={
                        initialValue?.length ? initialValue : [undefined]
                    }
                    name={name as NamePath}
                >
                    {(fields, { add, remove }) => (
                        <div className='flex flex-wrap'>
                            {fields.map(
                                (
                                    { key, name, ...restField },
                                    index: number
                                ) => (
                                    <InText<any>
                                        {...restField}
                                        name={[name]}
                                        rules={[rule_required()]}
                                        // bPoint={{ sm:  }}
                                        placeholder='Benefits Key'
                                        readOnly={isKeyReadOnly || readOnly}
                                        addonAfter={
                                            fields.length > 1 &&
                                            !hideCloseAble &&
                                            !readOnly ? (
                                                <MinusCircleOutlined
                                                    className='hover:text-red-400'
                                                    onClick={() => remove(name)}
                                                />
                                            ) : (
                                                ""
                                            )
                                        }
                                    />
                                )
                            )}
                            {!hideAddMoreButton && !readOnly ? (
                                <Form.Item>
                                    <Button
                                        type='primary'
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined />}
                                    >
                                        Tag
                                    </Button>
                                </Form.Item>
                            ) : (
                                ""
                            )}
                        </div>
                    )}
                </Form.List>
            </Card>
        </Col>
    );
}
