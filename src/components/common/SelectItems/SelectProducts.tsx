"use client";
import React from "react";
import InSelect from "../FormItems/InSelect";
import { InputCommonProps } from "../../../../types/commonTypes";
import { NamePath } from "antd/es/form/interface";
import { useGetCategoryQuery } from "@/app/(root)/product-management/categories/lib/api/categoryApi";
import { useGetProductQuery } from "@/app/(root)/product-management/products/lib/api/productsApi";

interface Props<T> extends InputCommonProps<T> {
  validate?: NamePath[];
}

export default function SelectProducts({
  name,
  readOnly,
  disabled,
  validate,
  rules,
  label,
  bPoint,
  onChange,
  placeholder,
  size,
  form,
}: Props<any>) {
  const { data: product, isLoading } = useGetProductQuery({
    start: 0,
    length: 1000,
  });

  return (
    <InSelect
      name={name}
      values={
        product?.data?.map((item) => ({
          title: item.title,
          value: item.uuid,
        })) || []
      }
      label={label}
      bPoint={bPoint}
      onChange={onChange}
      placeholder={placeholder}
      size={size}
      loading={isLoading}
      disabled={disabled || readOnly}
      validate={validate}
      rules={rules}
      mode='multiple'
      form={form}
    />
  );
}
