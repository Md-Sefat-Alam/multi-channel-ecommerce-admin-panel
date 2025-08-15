"use client";
import React from "react";
import InSelect from "../FormItems/InSelect";
import { InputCommonProps } from "../../../../types/commonTypes";
import { NamePath } from "antd/es/form/interface";
import { useGetCategoryQuery } from "@/app/(root)/product-management/categories/lib/api/categoryApi";

interface Props<T> extends InputCommonProps<T> {
  validate?: NamePath[];
}

export default function SelectCategory({
  name,
  readOnly,
  disabled,
  validate,
  rules,
  form,
}: Props<any>) {
  const { data: category, isLoading: categoryLoading } = useGetCategoryQuery({
    start: 0,
    length: 1000,
  });
  return (
    <InSelect
      name={name}
      values={
        category?.data?.map((item) => ({
          title: item.categoryName,
          value: item.uuid,
        })) || []
      }
      label='Category'
      placeholder='Select Category'
      loading={categoryLoading}
      disabled={disabled || readOnly}
      validate={validate}
      rules={rules}
      form={form}
    />
  );
}
