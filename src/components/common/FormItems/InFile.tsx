"use client";
import { Col, Form, Upload } from "antd";
import { InputCommonProps } from "../../../../types/commonTypes";
import { NamePath } from "antd/es/form/interface";
import { PlusOutlined } from "@ant-design/icons";

const { Item } = Form;

interface Props<T> extends InputCommonProps<T> {
    maxCount?: number; // Prop to determine if multiple files are allowed
    accept?: string; // Prop to specify accepted file types
}

const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

export default function InFile<T>({
    name,
    bPoint,
    label,
    placeholder,
    rules,
    size,
    readOnly,
    disabled,
    maxCount = 1, // Default is single file upload
    accept, // Optional file type acceptance
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
            <Form.Item
                label={label}
                rules={rules}
                name={name as NamePath}
                valuePropName='fileList'
                getValueFromEvent={normFile}
            >
                <Upload
                    listType='picture-card'
                    maxCount={maxCount}
                    accept={accept} // Accepts specific file types (e.g., "image/*, .pdf")
                    disabled={readOnly || disabled}
                >
                    <button
                        style={{ border: 0, background: "none" }}
                        type='button'
                    >
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </button>
                </Upload>
            </Form.Item>
        </Col>
    );
}
