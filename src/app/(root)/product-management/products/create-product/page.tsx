"use client";
import { rule_required } from "@/app/(root)/utils/rules/formRules";
import CombineSubmitButton from "@/components/common/FormItems/CombineSumbitButton";
import InImgWithCrop from "@/components/common/FormItems/InImgWithCrop";
import { useMessageGroup } from "@/contexts/MessageGroup";
import makeFormData from "@/lib/utils/makeFormData";
import { Form, message } from "antd";
import { useEffect } from "react";
import ProductCommonForm from "../lib/components/ProductCommonForm";
import { usePostProductMutation } from "./lib/api/customerApi";
import { IProductPost } from "./lib/types";
import dynamic from "next/dynamic";
const InRichTextQuill = dynamic(
  () => import("@/components/common/FormItems/InRichTextQuill"),
  { ssr: false }, // ✅ এই component শুধু browser-এ load হবে
);

type Props = {};

export default function page({}: Props) {
  const [form] = Form.useForm<any>();
  const [postProduct, { isError, isLoading, isSuccess, data, error }] =
    usePostProductMutation();
  const { notify } = useMessageGroup();

  const onFinish = (values: any) => {
    const formData = makeFormData(values);
    console.log({ values, formData });

    postProduct(formData);
  };

  useEffect(() => {
    notify({
      isError,
      isLoading,
      isSuccess,
      key: "Create_Product",
      success_url: "/product-management/products",
      error,
      success_content: "Product created successfully",
    });
  }, [isError, isSuccess, isLoading]);

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={onFinish}
      initialValues={{}}
      style={{ maxWidth: "100%" }}
      onFinishFailed={(value: any) => {
        message.error(
          `${value?.errorFields?.length} field${
            value?.errorFields?.length > 1 ? "s" : ""
          } not found`,
        );
      }}
    >
      <ProductCommonForm
        form={form}
        InImage={
          <InImgWithCrop
            name={["file__productImages"]}
            label='Product Images'
            rules={[rule_required()]}
            maxCount={6}
            bPoint={{ xs: 24 }}
            form={form}
          />
        }
        InRichText={
          <>
            <div className='w-full'>
              <InRichTextQuill
                form={form}
                name={["description"]}
                label='Description'
                rules={[rule_required()]}
              />
            </div>
            <div className='w-full'>
              <InRichTextQuill
                form={form}
                name={["descriptionBn"]}
                label='Description(Bangla)'
                rules={[rule_required()]}
              />
            </div>
          </>
        }
      />

      <CombineSubmitButton<any> form={form} />
    </Form>
  );
}
