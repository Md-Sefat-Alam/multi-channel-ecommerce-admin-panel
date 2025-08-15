import { FormInstance } from "antd";
import React, { useEffect } from "react";
import { useGetProductQuery } from "../../../lib/api/productsApi";
import { IGetProducts } from "../../../lib/ProductTypes";
import dayjs from "dayjs";
import { IsJsonString } from "@/lib/utils/Json";

type Props = {
  form: FormInstance<FormInstance<any>>;
  product_id: string;
  editData: IRes<IGetProducts[]> | undefined;
};

export default function SetProductEditFields({
  product_id,
  form,
  editData,
}: Props) {
  //   const {} = [];
  // set form values
  useEffect(() => {
    if (editData?.data.length) {
      const {
        title,
        description,
        price,
        stock,
        categoryId,
        activeStatus,

        finalPrice,
        createdAt,
        createdBy,
        tags,
        unitType,
        updatedAt,
        updatedBy,
        uuid,
        averageRating,
        discount,
        lowStockAlert,
        metaDescription,
        metaTitle,
        originalPrice,
        restockDate,
        slug,
        subTitle,
        variants,

        titleBn,
        subTitleBn,
        slugBn,
        metaTitleBn,
        metaDescriptionBn,
        tagsBn,
      } = editData?.data[0];
      form.setFieldsValue({
        title: title || undefined,
        price: Number(price) || undefined,
        stock: Number(stock) || undefined,
        categoryId: categoryId || undefined,
        activeStatus: String(activeStatus) || undefined,
        // productImages: productImages || undefined,
        // description: IsJsonString(description)
        //     ? JSON.parse(description as any) || [""]
        //     : [""],

        finalPrice: Number(finalPrice) || undefined,
        tags: tags || undefined,
        unitType: unitType || undefined,
        averageRating: String(averageRating) || undefined,
        discount: Number(discount || 0) || 0,
        lowStockAlert: lowStockAlert || undefined,
        metaDescription: metaDescription || undefined,
        metaTitle: metaTitle || undefined,
        originalPrice: originalPrice || undefined,
        restockDate: restockDate ? dayjs(restockDate) : undefined,
        slug: slug || undefined,
        subTitle: subTitle || undefined,
        variants: variants || undefined,

        titleBn: titleBn || undefined,
        subTitleBn: subTitleBn || undefined,
        slugBn: slugBn || undefined,
        metaTitleBn: metaTitleBn || undefined,
        metaDescriptionBn: metaDescriptionBn || undefined,
        tagsBn: tagsBn || undefined,
      } as any);
    }
  }, [editData]);

  return <></>;
}
