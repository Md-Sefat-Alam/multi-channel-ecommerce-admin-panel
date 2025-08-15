"use client";

import { rule_required } from "@/app/(root)/utils/rules/formRules";
import CombineSubmitButton from "@/components/common/FormItems/CombineSumbitButton";
import InSelect from "@/components/common/FormItems/InSelect";
import InText from "@/components/common/FormItems/InText";
import { useMessageGroup } from "@/contexts/MessageGroup";
import { Button, Form, FormInstance, message, Row } from "antd";
import { ICreateCategory } from "../lib/CategoryTypes";
import {
  useCreateCategoryMutation,
  useEditCategoryMutation,
  useGetSingleCategoryQuery,
} from "../lib/api/categoryApi";
import makeFormData from "@/lib/utils/makeFormData";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InFile from "@/components/common/FormItems/InFile";
import InImgWithCrop from "@/components/common/FormItems/InImgWithCrop";

interface ProductPageProps {
  params: { category_id: string };
}

const CategoryPage: React.FC<ProductPageProps> = ({ params, ...rest }) => {
  const [form] = Form.useForm<FormInstance<any>>();
  const [editCategory, { isError, isLoading, isSuccess, data, error }] =
    useEditCategoryMutation();
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);

  const { data: catData, isError: categoryFetchError } =
    useGetSingleCategoryQuery({
      uuid: params.category_id,
    });

  const { notify } = useMessageGroup();

  const onFinish = (values: any) => {
    values.activeStatus = values.activeStatus ? Number(values.activeStatus) : 0;
    values["uuid"] = params.category_id;

    const formData = makeFormData(values);
    editCategory(formData);
  };

  useEffect(() => {
    notify({
      isError,
      isLoading,
      isSuccess,
      key: "Edit_Category",
      success_url: "/product-management/categories",
      error,
      success_content: "Category updated successfully!",
    });
  }, [isError, isSuccess, isLoading]);

  useEffect(() => {
    if (catData?.data.uuid) {
      const {
        categoryName,
        categoryNameBn,
        activeStatus,
        categoryDescription,
        categoryDescriptionBn,
      } = catData.data;

      form.setFieldsValue({
        categoryName: categoryName,
        categoryNameBn: categoryNameBn,
        activeStatus: String(activeStatus),
        categoryDescription: categoryDescription,
        categoryDescriptionBn: categoryDescriptionBn,
      } as any);
    }
  }, [catData]);

  useEffect(() => {
    if (categoryFetchError) {
      message.error("Error fetching category!");
      router.back();
    }
  }, [categoryFetchError]);

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
        // disabled={!isEdit}
        onFinishFailed={(value: any) => {
          message.error(
            `${value?.errorFields?.length} field${value?.errorFields?.length > 1 ? "s" : ""
            } not found`
          );
        }}
      >
        <Row gutter={[16, 16]}>
          <InText<ICreateCategory>
            name={["categoryName"]}
            label='Category Name'
            rules={[rule_required()]}
            placeholder='Enter Category Name'
            disabled={!isEdit}
          />
          <InText<ICreateCategory>
            name={["categoryNameBn"]}
            label='Category Name Bn'
            rules={[rule_required()]}
            placeholder='Enter Category Name Bangla'
            disabled={!isEdit}
          />

          <InText<ICreateCategory>
            name={["categoryDescription"]}
            label='Description'
            rules={[]}
            placeholder='Enter Category description'
            disabled={!isEdit}
          />
          <InText<ICreateCategory>
            name={["categoryDescriptionBn"]}
            label='Description Bn'
            rules={[]}
            placeholder='Enter Category description Bangla'
            disabled={!isEdit}
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
            disabled={!isEdit}
          />

          <InImgWithCrop
            name={["file__categoryImage"]}
            label='Category Images'
            rules={[rule_required()]}
            maxCount={1}
            bPoint={{ xs: 24 }}
            form={form}
            disabled={!isEdit}
            defaultValue={
              catData?.data?.categoryImage?.length
                ? [JSON.parse(catData?.data?.categoryImage[0])]
                : undefined
            }
          />
        </Row>

        {isEdit ? (
          <CombineSubmitButton<any> form={form} isLoading={isLoading} />
        ) : (
          ""
        )}
      </Form>
    </div>
  );
};

export default CategoryPage;
