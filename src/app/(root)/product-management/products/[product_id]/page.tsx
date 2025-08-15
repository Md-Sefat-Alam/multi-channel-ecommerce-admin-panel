"use client";
import { rule_required } from "@/app/(root)/utils/rules/formRules";
import CombineSubmitButton from "@/components/common/FormItems/CombineSumbitButton";
import InImgWithCrop from "@/components/common/FormItems/InImgWithCrop";
import InRichTextQuill from "@/components/common/FormItems/InRichTextQuill";
import { useMessageGroup } from "@/contexts/MessageGroup";
import makeFormData from "@/lib/utils/makeFormData";
import { Button, Form, FormInstance, message } from "antd";
import { useEffect, useState } from "react";
import { IProductPost } from "../create-product/lib/types";
import { useGetProductQuery } from "../lib/api/productsApi";
import ProductCommonForm from "../lib/components/ProductCommonForm";
import { useEditProductMutation } from "./lib/api/customerApi";
import SetProductEditFields from "./lib/components/SetProductEditFields";

type Props = {
  params: { product_id: string };
};

const ProductEditPage: React.FC<Props> = ({ params }) => {
  const [form] = Form.useForm<FormInstance>();
  const [isEdit, setIsEdit] = useState(false);
  // Track original images and deleted image IDs
  const [originalImages, setOriginalImages] = useState<any[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  const [editProduct, { isError, isLoading, isSuccess, data, error }] =
    useEditProductMutation();

  const { data: editData } = useGetProductQuery({
    start: 0,
    length: 10,
    filters: { uuid: params.product_id } as any,
  });

  const { notify } = useMessageGroup();

  // Set original images when edit data loads
  useEffect(() => {
    if (editData?.data?.length && editData.data[0].images) {
      setOriginalImages(editData.data[0].images);
    }
  }, [editData]);

  // Handle image delete
  const handleImageDelete = (file: any) => {
    // If file has an id (existing image), add it to deletedImageIds
    if (file.uid) {
      const fileId = (file.uid as string).split("_")[0];
      setDeletedImageIds((prev) => [...prev, Number(fileId)]);
    }
    return true; // Allow deletion
  };

  const onFinish = (values: any) => {
    values["uuid"] = params.product_id;

    // Add list of deleted image IDs to the form data
    if (deletedImageIds.length > 0) {
      values["deletedImageIds"] = deletedImageIds;
    }

    const formData = makeFormData(values);
    console.log({ values, formData, deletedImageIds });
    editProduct(formData);
  };

  useEffect(() => {
    notify({
      isError,
      isLoading,
      isSuccess,
      key: "Edit_Product",
      success_url: "/product-management/products",
      error,
      success_content: "Product edit successfully",
    });
  }, [isError, isSuccess, isLoading]);

  return (
    <div>
      <div className='flex justify-end pb-8'>
        <Button
          onClick={() => {
            setIsEdit((prev) => !prev);
          }}
          size='large'
          type={isEdit ? "primary" : "default"}
        >
          Edit
        </Button>
      </div>
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{}}
        style={{ maxWidth: "100%" }}
        disabled={!isEdit}
        onFinishFailed={(value: any) => {
          message.error(
            `${value?.errorFields?.length} field${
              value?.errorFields?.length > 1 ? "s" : ""
            } not found`,
          );
        }}
      >
        {/* Form set fields value by this component */}
        <SetProductEditFields
          form={form}
          product_id={params.product_id}
          editData={editData}
        />
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
              defaultValue={
                editData?.data?.length
                  ? (editData?.data[0]?.images as any)
                  : null
              }
              onRemove={handleImageDelete}
            />
          }
          InRichText={
            <>
              <div className='w-full'>
                <InRichTextQuill<IProductPost>
                  form={form}
                  name={["description"]}
                  label='Description'
                  rules={[rule_required()]}
                  disabled={!isEdit}
                  defaultValue={
                    editData?.data?.length && editData?.data[0].description
                      ? editData?.data[0].description
                      : ""
                  }
                />
              </div>
              <div className='w-full'>
                <InRichTextQuill<IProductPost>
                  form={form}
                  name={["descriptionBn"]}
                  label='Description(Bangla)'
                  rules={[rule_required()]}
                  disabled={!isEdit}
                  defaultValue={
                    editData?.data?.length && editData?.data[0].descriptionBn
                      ? editData?.data[0].descriptionBn
                      : ""
                  }
                />
              </div>
            </>
          }
        />
        {isEdit ? (
          <CombineSubmitButton<any> form={form} isLoading={isLoading} />
        ) : (
          ""
        )}
      </Form>
    </div>
  );
};

export default ProductEditPage;
