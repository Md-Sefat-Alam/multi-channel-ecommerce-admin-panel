"use client";
import { rule_required } from "@/app/(root)/utils/rules/formRules";
import InDatePicker from "@/components/common/FormItems/InDatePicker";
import InListSingleItem from "@/components/common/FormItems/InListSingleItem";
import InNumber from "@/components/common/FormItems/InNumber";
import InSelect from "@/components/common/FormItems/InSelect";
import InText from "@/components/common/FormItems/InText";
import SelectCategory from "@/components/common/SelectItems/SelectCategory";
import { calculateDiscount } from "@/lib/utils/helper";
import { Card, FormInstance, Row, Tooltip } from "antd";
import { ReactNode } from "react";
import { IProductPost } from "../../create-product/lib/types";

type Props = {
  form: FormInstance<any>;
  InImage: ReactNode;
  InRichText: ReactNode;
};

export default function ProductCommonForm({
  form,
  InImage,
  InRichText,
}: Props) {
  return (
    <div className='!flex !flex-col !gap-8'>
      <Card title='Product Info'>
        <Row gutter={[16, 16]}>
          <InText<IProductPost>
            name={["title"]}
            label='Title (English)'
            rules={[rule_required()]}
            placeholder='Enter Product Name (English)'
          />
          <InText<IProductPost>
            name={["titleBn"]}
            label='Title (Bangla)'
            rules={[]}
            placeholder='Enter Product Name (Bangla)'
          />
          <InText<IProductPost>
            name={["subTitle"]}
            label='Sub Title (English)'
            rules={[]}
            placeholder='Enter Sub Title (English)'
          />
          <InText<IProductPost>
            name={["subTitleBn"]}
            label='Sub Title (Bangla)'
            rules={[]}
            placeholder='Enter Sub Title (Bangla)'
          />
          <SelectCategory
            name={["categoryId"]}
            label='Category'
            rules={[rule_required()]}
            placeholder='Select category'
          />
          <InNumber<IProductPost>
            name={["price"]}
            label='Price'
            rules={[rule_required()]}
            min={0}
            placeholder='Enter price'
            onChange={() => {
              const price = Number(form.getFieldValue(["price"]) || 0);
              const discount = Number(form.getFieldValue(["discount"]) || 0);
              const discountAmount = calculateDiscount(price, discount);
              form.setFieldValue(
                ["finalPrice"],
                discountAmount.discountAmountForPercentage,
              );
            }}
          />
          <InNumber<IProductPost>
            name={["discount"]}
            label='Discount %'
            rules={[]}
            max={100}
            min={0}
            placeholder='Enter discount'
            onChange={() => {
              const price = Number(form.getFieldValue(["price"]) || 0);
              const discount = Number(form.getFieldValue(["discount"]) || 0);
              const discountAmount = calculateDiscount(price, discount);
              form.setFieldValue(
                ["finalPrice"],
                discountAmount.discountAmountForPercentage,
              );
            }}
          />
          <InNumber<IProductPost>
            name={["finalPrice"]}
            label='Final Price'
            min={0}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) return Promise.resolve();
                  if (value > 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Zero or minus value not allowed!"),
                  );
                },
              }),
              rule_required(),
            ]}
            placeholder='Enter Final Price'
            readOnly
          />
          <InSelect<IProductPost>
            name={["unitType"]}
            placeholder='Unit Type'
            label='Unit Type'
            rules={[rule_required()]}
            values={[
              { title: "KG", value: "KG" },
              { title: "LITER", value: "LITER" },
              { title: "PIECES", value: "PIECES" },
              { title: "METER", value: "METER" },
              { title: "GRAM", value: "GRAM" },
              { title: "ML", value: "ML" },
              { title: "OTHER", value: "OTHER" },
            ]}
          />
          <InSelect<IProductPost>
            name={["activeStatus"]}
            placeholder='Active Status'
            label='Active Status'
            values={[
              { title: "Active", value: "1" },
              { title: "Inactive", value: "0" },
            ]}
            rules={[]}
          />
          {InImage}
          {InRichText}
        </Row>
      </Card>

      <Card title='Stock Info'>
        <Row gutter={[16, 16]}>
          <InNumber<IProductPost>
            name={["stock"]}
            label='Stock'
            rules={[]}
            placeholder='Enter stock'
          />
          <InNumber<IProductPost>
            name={["lowStockAlert"]}
            label='Low Stock Alert'
            rules={[]}
            placeholder='Enter Low Stock Alert'
          />
          <InDatePicker<IProductPost>
            name={["restockDate"]}
            label='Restock Date'
            rules={[]}
            placeholder='Enter Restock Date'
          />
        </Row>
      </Card>

      <Card title='SEO Info'>
        <Row gutter={[16, 16]}>
          <InText<IProductPost>
            name={["slug"]}
            label='Slug (English)'
            rules={[
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  // Only allow URL-safe slugs: letters, numbers, hyphens, underscores, and no Bangla characters
                  if (/^[a-zA-Z0-9-_]+$/.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Slug must be URL-safe: only English letters, numbers, hyphens, and underscores are allowed. No spaces or Bangla characters.",
                    ),
                  );
                },
              },
              rule_required(),
            ]}
            placeholder='Enter slug (English)'
          />

          <InText<IProductPost>
            name={["slugBn"]}
            label='Slug (Bangla/English)'
            rules={[
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  // Allow Bangla or English characters, numbers, hyphens, underscores
                  // Bangla Unicode range: \u0980-\u09FF, English: a-zA-Z
                  if (/^[\u0980-\u09FFa-zA-Z0-9-_]+$/.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Slug (Bangla/English) must contain only Bangla or English letters, numbers, hyphens, and underscores. No spaces.",
                    ),
                  );
                },
              },
              rule_required(),
            ]}
            placeholder='Enter slug (Bangla or English)'
          />
          <InText<IProductPost>
            name={["metaTitle"]}
            label='Meta Title (English)'
            rules={[]}
            placeholder='Enter Meta Title (English)'
          />
          <InText<IProductPost>
            name={["metaTitleBn"]}
            label='Meta Title (Bangla)'
            rules={[]}
            placeholder='Enter Meta Title (Bangla)'
          />
          <InText<IProductPost>
            name={["metaDescription"]}
            label='Meta Description (English)'
            rules={[]}
            placeholder='Enter Meta Description (English)'
          />
          <InText<IProductPost>
            name={["metaDescriptionBn"]}
            label='Meta Description (Bangla)'
            rules={[]}
            placeholder='Enter Meta Description (Bangla)'
          />
          <InSelect<IProductPost>
            name={["averageRating"]}
            label='Average Rating'
            rules={[]}
            placeholder='Enter Average Rating'
            values={[
              { title: "0", value: "0" },
              { title: "0.5", value: "0.5" },
              { title: "1", value: "1" },
              { title: "1.5", value: "1.5" },
              { title: "2", value: "2" },
              { title: "2.5", value: "2.5" },
              { title: "3", value: "3" },
              { title: "3.5", value: "3.5" },
              { title: "4", value: "4" },
              { title: "4.5", value: "4.5" },
              { title: "5", value: "5" },
            ].reverse()}
          />
          <InListSingleItem<IProductPost>
            name={["tags"]}
            label='Tags (English)'
            rules={[]}
            placeholder='Enter Tags (English)'
          />
          <InListSingleItem<IProductPost>
            name={["tagsBn"]}
            label='Tags (Bangla)'
            rules={[]}
            placeholder='Enter Tags (Bangla or English)'
          />
        </Row>
      </Card>
    </div>
  );
}
