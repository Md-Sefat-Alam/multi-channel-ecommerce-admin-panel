"use client";
import type { FormInstance, GetProp, UploadFile, UploadProps } from "antd";
import { Col, Form, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { NamePath } from "antd/es/form/interface";
import { useEffect, useState } from "react";
import { InputCommonProps } from "../../../../types/commonTypes";
import getUrl from "@/lib/utils/getUrl";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface Props<T> extends InputCommonProps<T> {
  maxCount?: number;
  accept?: number;
  cropShape?: "rect" | "round";
  form: FormInstance<any>;
  defaultValue?: Array<any>;
  onRemove?: (file: any) => boolean | void;
}

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default function InImgWithCrop<T>({
  name,
  bPoint,
  label,
  placeholder,
  rules,
  size,
  readOnly,
  disabled,
  maxCount = 1,
  accept,
  form,
  defaultValue,
  cropShape,
  onRemove,
}: Props<T>) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (form && form.setFieldValue) {
      form.setFieldValue(name, newFileList);
    }
  };

  const onPreview = async (file: UploadFile) => {
    // Check if we're in browser environment
    if (typeof window === "undefined") return;

    let src = file.url as string;

    if (!src && file.originFileObj && window.FileReader) {
      try {
        src = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj as FileType);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Failed to read file"));
        });
      } catch (error) {
        console.error("Error reading file:", error);
        return;
      }
    }

    if (src) {
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      if (imgWindow) {
        imgWindow.document.write(image.outerHTML);
      }
    }
  };

  useEffect(() => {
    if (defaultValue?.length && form) {
      try {
        const imgList: UploadFile[] = defaultValue.map((item, index) => ({
          uid: `${index}_id`,
          name: item?.filename || `image_${index}`,
          status: "done",
          url: item?.path ? getUrl({ path: item.path }) : "",
        }));

        // Use setTimeout to ensure form is ready
        const timeoutId = setTimeout(() => {
          if (form.setFieldValue) {
            form.setFieldValue(name, imgList);
            setFileList(imgList);
          }
        }, 0);

        return () => clearTimeout(timeoutId);
      } catch (error) {
        console.error("Error setting default images:", error);
      }
    }
  }, [defaultValue, form, name]);

  const handleRemove = (file: UploadFile) => {
    // Call the parent's onRemove handler if provided
    if (onRemove && onRemove(file) === false) {
      return false;
    }

    // Remove from local state
    const index = fileList.indexOf(file);
    if (index > -1) {
      const newFileList = [...fileList];
      newFileList.splice(index, 1);
      setFileList(newFileList);

      // Update form value
      if (form && form.setFieldValue) {
        form.setFieldValue(name, newFileList);
      }
    }

    return true;
  };

  return (
    <Col
      xs={bPoint?.xs || 24}
      sm={bPoint?.sm || bPoint?.xs || 12}
      md={bPoint?.md || bPoint?.xs || bPoint?.sm || 12}
      lg={bPoint?.lg || bPoint?.xs || bPoint?.sm || bPoint?.md || 6}
      xl={
        bPoint?.xl || bPoint?.xs || bPoint?.sm || bPoint?.md || bPoint?.lg || 6
      }
      xxl={
        bPoint?.xxl || bPoint?.xs || bPoint?.sm || bPoint?.md || bPoint?.lg || 6
      }
    >
      <Form.Item
        label={label}
        rules={rules}
        name={name as NamePath}
        valuePropName='fileList'
        getValueFromEvent={normFile}
      >
        <ImgCrop rotationSlider cropShape={cropShape || "rect"} aspect={accept}>
          <Upload
            listType='picture-card'
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
            maxCount={maxCount}
            accept='image/*'
            disabled={readOnly || disabled}
            onRemove={handleRemove}
          >
            {fileList.length < maxCount && "+ Upload"}
          </Upload>
        </ImgCrop>
      </Form.Item>
    </Col>
  );
}
