import InNumber from "@/components/common/FormItems/InNumber";
import { useMessageGroup } from "@/contexts/MessageGroup";
import { Button, Form, message, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import { TbHandClick } from "react-icons/tb";
import { rule_required } from "@/app/(root)/utils/rules/formRules";
import { useUpdateProductFieldMutation } from "../api/productsApi";

interface Props {
  price: number;
  uuid: string;
}

const UpdatePriceModal: React.FC<Props> = ({ price, uuid }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<any>();
  const [updateProductField, { isError, isLoading, isSuccess, data, error }] =
    useUpdateProductFieldMutation();

  const { notify } = useMessageGroup();

  const onFinish = (values: any) => {
    // Send the request with uuid and price
    updateProductField({
      uuid,
      price: values.price
    });

    // Close modal on success
    if (!isError) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    notify({
      isError,
      isLoading,
      isSuccess,
      key: "Product_update_price",
      error,
      success_content: "Product price updated!",
    });

    // Close modal on success
    if (isSuccess) {
      setIsModalOpen(false);
    }
  }, [isError, isSuccess, isLoading]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    form.setFieldsValue({ price: price });
  }, [price, form]);

  return (
    <>
      <Button
        type="text"
        onClick={showModal}
        icon={<TbHandClick className="text-gray-500" />}
      />
      <Modal
        title="Update Price"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ price }}
          style={{ maxWidth: "100%" }}
          onFinishFailed={(value: any) => {
            message.error(
              `${value?.errorFields?.length} field${value?.errorFields?.length > 1 ? "s" : ""
              } not found`
            );
          }}
        >
          <Row gutter={24}>
            <InNumber
              rules={[rule_required()]}
              name={["price"]}
              label="Price"
              bPoint={{ xs: 24 }}
              min={0}
              step={0.01}
            />
          </Row>
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Update
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default UpdatePriceModal;