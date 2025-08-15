"use client";
import { rule_required } from "@/app/(root)/utils/rules/formRules";
import InSelect from "@/components/common/FormItems/InSelect";
import InText from "@/components/common/FormItems/InText";
import SelectProducts from "@/components/common/SelectItems/SelectProducts";
import { FormInstance, Row } from "antd";
import { ReactNode } from "react";
import { IHeroImagePost } from "../../SettingsType";

type Props = {
  form: FormInstance<any>;
  InImage: ReactNode;
};

export default function HeroImageCommonForm({ form, InImage }: Props) {
  return (
    <div className='!flex !flex-col !gap-8'>
      <Row gutter={[16, 16]}>
        <InText<IHeroImagePost>
          name={["heroTitle"]}
          label='Title'
          rules={[]}
          placeholder='Enter Product Name'
        />
        <InText<IHeroImagePost>
          name={["subTitle"]}
          label='Sub Title'
          rules={[]}
          placeholder='Enter Sub Title'
        />
        <SelectProducts
          name={["heroRelatedProducts"]}
          label='Related Products'
          rules={[rule_required()]}
          placeholder='Select Related Products'
        />

        <InSelect<IHeroImagePost>
          name={["activeStatus"]}
          placeholder='Select Active Status'
          label='Active Status'
          values={[
            { title: "Active", value: "1" },
            { title: "Inactive", value: "0" },
          ]}
          rules={[rule_required()]}
        />
        {InImage}
      </Row>
    </div>
  );
}
