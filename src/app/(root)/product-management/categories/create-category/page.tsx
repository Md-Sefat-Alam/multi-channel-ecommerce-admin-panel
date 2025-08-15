"use client";
import { rule_required } from "@/app/(root)/utils/rules/formRules";
import CombineSubmitButton from "@/components/common/FormItems/CombineSumbitButton";
import InFile from "@/components/common/FormItems/InFile";
import InSelect from "@/components/common/FormItems/InSelect";
import InText from "@/components/common/FormItems/InText";
import { useMessageGroup } from "@/contexts/MessageGroup";
import makeFormData from "@/lib/utils/makeFormData";
import { Form, FormInstance, message, Row } from "antd";
import { useEffect } from "react";
import { ICreateCategory } from "../lib/CategoryTypes";
import { useCreateCategoryMutation } from "../lib/api/categoryApi";
import InImgWithCrop from "@/components/common/FormItems/InImgWithCrop";

type Props = {};

export default function page({}: Props) {
  const [form] = Form.useForm<FormInstance>();
  const [createCategory, { isError, isLoading, isSuccess, data, error }] =
    useCreateCategoryMutation();
  const { notify } = useMessageGroup();

  const onFinish = (values: any) => {
    values.activeStatus = values.activeStatus ? Number(values.activeStatus) : 0;

    const formData = makeFormData(values);
    createCategory(formData);
  };

  useEffect(() => {
    notify({
      isError,
      isLoading,
      isSuccess,
      key: "Create_Category",
      success_url: "/product-management/categories",
      error,
      success_content: "Category created successfully",
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
          } not found`
        );
      }}
    >
      <Row gutter={[16, 16]}>
        {/* <Divider orientation="left">Product-info</Divider> */}
        <InText<ICreateCategory>
          name={["categoryName"]}
          label='Category Name'
          rules={[rule_required()]}
          placeholder='Enter Category Name'
        />
        <InText<ICreateCategory>
          name={["categoryNameBn"]}
          label='Category Name Bn'
          rules={[rule_required()]}
          placeholder='Enter Category Name Bangla'
        />

        <InText<ICreateCategory>
          name={["categoryDescription"]}
          label='Description'
          rules={[]}
          placeholder='Enter Category description'
        />
        <InText<ICreateCategory>
          name={["categoryDescriptionBn"]}
          label='Description Bn'
          rules={[]}
          placeholder='Enter Category description Bangla'
        />

        <InSelect<ICreateCategory>
          name={["activeStatus"]}
          placeholder='Active Status'
          label='Active Status'
          values={[
            { title: "Active", value: "1" },
            { title: "Inactive", value: "0" },
          ]}
          rules={[]}
        />
        <InImgWithCrop
          name={["file__categoryImage"]}
          label='Category Images'
          rules={[rule_required()]}
          maxCount={1}
          bPoint={{ xs: 24 }}
          form={form}
        />
      </Row>
      <CombineSubmitButton<any> form={form} isLoading={isLoading} />
    </Form>
  );
}
