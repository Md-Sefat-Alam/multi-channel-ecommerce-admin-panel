"use client";
import {
    rule_numeric,
    rule_required,
} from "@/app/(root)/utils/rules/formRules";
import InNumber from "@/components/common/FormItems/InNumber";
import InText from "@/components/common/FormItems/InText";
import InTextArea from "@/components/common/FormItems/InTextArea";
import { SaveOutlined } from "@ant-design/icons";
import { Button, Card, Form, Row } from "antd";
import React from "react";

type Props = {};

export default function General({}: Props) {
    const [form] = Form.useForm<any>();
    // const [postSettings] =

    return (
        <Card title={"Merchant Account Setup"}>
            <Form
                form={form}
                layout='vertical'
                onFinish={(values) => {
                    console.log({ values });
                }}
                initialValues={{}}
                style={{ maxWidth: "100%" }}
                className='py-10 !pb-[80px]'
            >
                <Row gutter={[24, 24]}>
                    <InText
                        name={["config"]}
                        label='Merchant Number'
                        placeholder='e.g., 01000000000'
                        bPoint={{
                            xs: 24,
                            sm: 24,
                            lg: 12,
                            md: 12,
                            xl: 12,
                            xxl: 12,
                        }}
                        size='large'
                        rules={[rule_numeric(), rule_required()]}
                    />
                </Row>
                <Button icon={<SaveOutlined />} htmlType='submit'>
                    Save
                </Button>
            </Form>
        </Card>
    );
}
