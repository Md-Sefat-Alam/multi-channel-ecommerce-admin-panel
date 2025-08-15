"use client";
import { rule_required } from "@/app/(root)/utils/rules/formRules";
import CombineSubmitButton from "@/components/common/FormItems/CombineSumbitButton";

import { useMessageGroup } from "@/contexts/MessageGroup";
import makeFormData from "@/lib/utils/makeFormData";
import { Card, Form, message, Row } from "antd";
import { useEffect } from "react";
import InText from "@/components/common/FormItems/InText";
import { IProductPost } from "../product-management/products/create-product/lib/types";
import InImgWithCrop from "@/components/common/FormItems/InImgWithCrop";
import InTextArea from "@/components/common/FormItems/InTextArea";
import { usePostFarmingBlogMutation } from "./lib/api/customerApi";
import { useAuth } from "@/contexts/AuthContext";

type Props = {};

export default function page({ }: Props) {
  const [form] = Form.useForm<any>();
  const { user } = useAuth();
  const [postFarming, { isError, isLoading, isSuccess, data, error }] =
    usePostFarmingBlogMutation();


  const onFinish = (values: any) => {
    const { imageUrl, youtube_url, ...all } = values;
    const formData = makeFormData({
      ...all,
      imageUrl: imageUrl[0]?.originFileObj,
      authorId: user?.data?.userRoleId as number,
    });
    console.log({ values, formData });

    postFarming(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      message.success("Farming Blog Creared successfully");
      form.resetFields();
    }
  }, [isError, isSuccess, isLoading]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{}}
      style={{ maxWidth: "100%" }}
      onFinishFailed={(value: any) => {
        message.error(
          `${value?.errorFields?.length} field${value?.errorFields?.length > 1 ? "s" : ""
          } not found`
        );
      }}
    >
      <div className="!flex !flex-col !gap-8">
        <Card title={"Farming Blog Info"}>
          <Row gutter={[16, 16]}>
            <InText<IProductPost>
              name={["title"]}
              label="Title"
              rules={[rule_required()]}
              placeholder="Enter Blog Title"
            />

            <InText<IProductPost>
              name={["youtube_url"]}
              label="Youtube URL"
              rules={[]}
              placeholder="Enter youtube url"
            />
            <InImgWithCrop
              name={["imageUrl"]}
              label="Blog Images"
              rules={[rule_required()]}
              maxCount={1}
              form={form}
            />
            <InTextArea
              name={["content"]}
              label="Description"
              rules={[]}
              rows={4}
              bPoint={{ xs: 24, sm: 4 }}
              placeholder="Enter your content"
            />
          </Row>
        </Card>
      </div>

      <CombineSubmitButton<any> form={form} />
    </Form>
  );
}
