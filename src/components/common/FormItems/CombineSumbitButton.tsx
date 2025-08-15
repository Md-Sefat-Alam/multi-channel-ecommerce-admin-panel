"use client";
import Defaults from "@/constant/Defaults";
import {
  ArrowLeftOutlined,
  ReloadOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Col, FormInstance, Popconfirm, Row } from "antd";
import { useRouter } from "next/navigation";

type Props<T> = { form: FormInstance<FormInstance<T>>; isLoading?: boolean };

export default function CombineSubmitButton<T>({ form, isLoading }: Props<T>) {
  const router = useRouter();
  return (
    <Row className="mt-10">
      <Col span={24}>
        <div className="flex justify-end flex-col sm:flex-row gap-[15px]">
          <Button
            size={Defaults.inputFields}
            type={"dashed"}
            htmlType={"reset"}
            onClick={() => {
              router.back();
            }}
          >
            <ArrowLeftOutlined /> Go Back
          </Button>

          <Popconfirm
            title="Reset Form"
            description="Are you sure to reset this form?"
            onConfirm={() => {
              form.resetFields();
            }}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button size={Defaults.inputFields} type={"dashed"}>
              Reset <ReloadOutlined />
            </Button>
          </Popconfirm>

          <Button
            // loading={isLoading}
            size={Defaults.inputFields}
            type={"primary"}
            htmlType={"submit"}
            loading={isLoading}
          >
            Submit <SaveOutlined />
          </Button>
        </div>
      </Col>
    </Row>
  );
}
