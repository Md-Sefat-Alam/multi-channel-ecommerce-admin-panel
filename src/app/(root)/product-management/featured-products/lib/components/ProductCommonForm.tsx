"use client";
import { rule_required } from "@/app/(root)/utils/rules/formRules";
import InDatePicker from "@/components/common/FormItems/InDatePicker";
import InListSingleItem from "@/components/common/FormItems/InListSingleItem";
import InNumber from "@/components/common/FormItems/InNumber";
import InSelect from "@/components/common/FormItems/InSelect";
import InText from "@/components/common/FormItems/InText";
import SelectCategory from "@/components/common/SelectItems/SelectCategory";
import { Card, FormInstance, Row } from "antd";
import { ReactNode } from "react";
import { calculateDiscount } from "@/lib/utils/helper";
import { ICustomerPost } from "@/app/(root)/farming/lib/types";

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
            <Card title={"Product Info"}>
                <Row gutter={[16, 16]}>
                    <InText<ICustomerPost>
                        name={["title"]}
                        label='Title'
                        rules={[rule_required()]}
                        placeholder='Enter Product Name'
                    />
                    <InText<ICustomerPost>
                        name={["subTitle"]}
                        label='Sub Title'
                        rules={[]}
                        placeholder='Enter Sub Title'
                    />
                    <SelectCategory
                        name={["categoryId"]}
                        label='Category'
                        rules={[rule_required()]}
                        placeholder='Enter category'
                    />
                    <InNumber<ICustomerPost>
                        name={["price"]}
                        label='Price'
                        rules={[rule_required()]}
                        min={0}
                        placeholder='Enter price'
                        onChange={() => {
                            const price = Number(
                                form.getFieldValue(["price"]) || 0
                            );
                            const discount = Number(
                                form.getFieldValue(["discount"]) || 0
                            );
                            const discountAmount = calculateDiscount(
                                price,
                                discount
                            );

                            form.setFieldValue(
                                ["finalPrice"],
                                discountAmount.discountAmountForPercentage
                            );
                        }}
                    />
                    <InNumber<ICustomerPost>
                        name={["discount"]}
                        label='Discount %'
                        rules={[]}
                        max={100}
                        min={0}
                        placeholder='Enter discount'
                        onChange={() => {
                            const price = Number(
                                form.getFieldValue(["price"]) || 0
                            );
                            const discount = Number(
                                form.getFieldValue(["discount"]) || 0
                            );
                            const discountAmount = calculateDiscount(
                                price,
                                discount
                            );

                            form.setFieldValue(
                                ["finalPrice"],
                                discountAmount.discountAmountForPercentage
                            );
                        }}
                    />
                    <InNumber<ICustomerPost>
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
                                        new Error(
                                            "Zero or minus value not allowed!"
                                        )
                                    );
                                },
                            }),
                            rule_required(),
                        ]}
                        placeholder='Enter Final Price'
                        readOnly
                    />
                    <InSelect<ICustomerPost>
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
                    <InSelect<ICustomerPost>
                        name={["activeStatus"]}
                        placeholder='Active Status'
                        label='Active Status'
                        values={[
                            { title: "Active", value: "1" },
                            { title: "Inactive", value: "0" },
                        ]}
                        rules={[]}
                    />
                    {/* <InImgWithCrop
                        name={["file__productImages"]}
                        label='Product Images'
                        rules={[rule_required()]}
                        maxCount={6}
                        bPoint={{ xs: 24 }}
                        form={form}
                    /> */}
                    {InImage}

                    {/* <InRichText<ICustomerPost>
                        form={form}
                        name={["description"]}
                        label='Description'
                        rules={[rule_required()]}
                    /> */}
                    {InRichText}
                </Row>
            </Card>

            <Card title={"Stock Info"}>
                <Row gutter={[16, 16]}>
                    <InNumber<ICustomerPost>
                        name={["stock"]}
                        label='Stock'
                        rules={[]}
                        placeholder='Enter stock'
                    />
                    <InNumber<ICustomerPost>
                        name={["lowStockAlert"]}
                        label='Low Stock Alert'
                        rules={[]}
                        placeholder='Enter Low Stock Alert'
                    />
                    <InDatePicker<ICustomerPost>
                        name={["restockDate"]}
                        label='Restock Date'
                        rules={[]}
                        placeholder='Enter Restock Date'
                    />
                </Row>
            </Card>

            <Card title={"SEO Info"}>
                <Row gutter={[16, 16]}>
                    <InText<ICustomerPost>
                        name={["slug"]}
                        label='Slug'
                        rules={[]}
                        placeholder='Enter slug'
                    />
                    <InText<ICustomerPost>
                        name={["metaTitle"]}
                        label='Meta Title'
                        rules={[]}
                        placeholder='Enter Meta Title'
                    />
                    <InText<ICustomerPost>
                        name={["metaDescription"]}
                        label='Meta Description'
                        rules={[]}
                        placeholder='Enter Meta Title'
                    />
                    <InSelect<ICustomerPost>
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
                    <InListSingleItem<ICustomerPost>
                        name={["tags"]}
                        label='Tags'
                        rules={[]}
                        placeholder='Enter Tags'
                    />
                </Row>
            </Card>
        </div>
    );
}
