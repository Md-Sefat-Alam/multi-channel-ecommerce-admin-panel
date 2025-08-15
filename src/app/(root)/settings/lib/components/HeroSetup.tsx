"use client";
import { rule_required } from "@/app/(root)/utils/rules/formRules";
import CombineSubmitButton from "@/components/common/FormItems/CombineSumbitButton";
import InImgWithCrop from "@/components/common/FormItems/InImgWithCrop";
import { useMessageGroup } from "@/contexts/MessageGroup";
import makeFormData from "@/lib/utils/makeFormData";
import { Form, message } from "antd";
import { useEffect } from "react";
import { usePostHeroImageMutation } from "../api/settingsApi";
import HeroImageCommonForm from "./HeroImage/HeroImageCommonForm";

type Props = {
  handleOk: () => void;
  setConfirmLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function HeroSetup({ handleOk, setConfirmLoading }: Props) {
  const [form] = Form.useForm<any>();
  const [addHeroImage, { isError, isLoading, isSuccess, data, error }] =
    usePostHeroImageMutation();
  const { notify } = useMessageGroup();

  const onFinish = (values: any) => {
    const formData = makeFormData(values);
    console.log({ values, formData });

    addHeroImage(formData);
  };

  useEffect(() => {
    setConfirmLoading(isLoading);
    notify({
      isError,
      isLoading,
      isSuccess,
      key: "Create_Hero_Image",
      // success_url: "/product-management/products",
      error,
      success_content: "Hero image added successfully",
    });
    if (isSuccess) {
      handleOk();
    }
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
      <HeroImageCommonForm
        form={form}
        InImage={
          <InImgWithCrop
            name={["file__heroImages"]}
            label='Product Images'
            rules={[rule_required()]}
            maxCount={1}
            bPoint={{ xs: 24 }}
            form={form}
            accept={16 / 9}
          />
        }
      />

      <CombineSubmitButton<any> form={form} />
    </Form>
  );
}
