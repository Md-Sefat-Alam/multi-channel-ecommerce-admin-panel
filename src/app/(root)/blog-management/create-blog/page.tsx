"use client";

import { Form, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
import makeFormData from "@/lib/utils/makeFormData";
import { useMessageGroup } from "@/contexts/MessageGroup";
import CombineSubmitButton from "@/components/common/FormItems/CombineSumbitButton";
import InText from "@/components/common/FormItems/InText";
import InTextArea from "@/components/common/FormItems/InTextArea";
import InImgWithCrop from "@/components/common/FormItems/InImgWithCrop";
import InRichText from "@/components/common/FormItems/InRichText";
import InSelect from "@/components/common/FormItems/InSelect";
import InListSingleItem from "@/components/common/FormItems/InListSingleItem";
import { rule_required } from "@/app/(root)/utils/rules/formRules";
import { usePostBlogMutation } from "../lib/api/blogsApi";
import InCheckbox from "@/components/common/FormItems/InCheckbox";

export default function CreateBlogPage() {
  const [form] = useForm();
  const [postBlog, { isError, isLoading, isSuccess, error }] = usePostBlogMutation();
  const { notify } = useMessageGroup();

  const onFinish = (values: any) => {
    const formData = makeFormData(values);
    postBlog(formData);
  };

  useEffect(() => {
    notify({
      isError,
      isLoading,
      isSuccess,
      key: "Create_Blog",
      success_url: "/blog-management/blogs",
      error,
      success_content: "Blog post created successfully",
    });
  }, [isError, isLoading, isSuccess, error]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ status: "DRAFT", featured: false }}
      style={{ maxWidth: "100%" }}
      onFinishFailed={(value) => {
        message.error(`${value.errorFields.length} field${value.errorFields.length > 1 ? "s" : ""} not found`);
      }}
    >
      <div className="!flex !flex-col !gap-8">
        {/* Blog Info */}
        <div className="ant-card">
          <div className="ant-card-head"><h3>Blog Info</h3></div>
          <div className="ant-card-body">
            <InText name="title" label="Title" rules={[rule_required()]} placeholder="Enter blog title" />
            <InText name="subtitle" label="Subtitle" placeholder="Enter subtitle" />
            <InRichText form={form} name="content" label="Content" rules={[rule_required()]} />
            <InTextArea name="summary" label="Summary" placeholder="Enter summary" />
            <InImgWithCrop
              name={["file__imageUrl"]}
              label="Image"
              rules={[rule_required()]}
              maxCount={1}
              bPoint={{ xs: 24 }}
              form={form}
            />
            <InListSingleItem name="youtubeUrls" label="YouTube URLs" placeholder="Add YouTube URL" />
            <InListSingleItem name="facebookPosts" label="Facebook Posts" placeholder="Add Facebook post URL" />
            <InTextArea name="otherEmbeds" label="Other Embeds (JSON)" placeholder='Enter JSON e.g., {"twitter": "url"}' />
          </div>
        </div>

        {/* SEO Info */}
        <div className="ant-card">
          <div className="ant-card-head"><h3>SEO Info</h3></div>
          <div className="ant-card-body">
            <InText name="metaTitle" label="Meta Title" placeholder="Enter meta title" />
            <InTextArea name="metaDescription" label="Meta Description" placeholder="Enter meta description" />
            <InListSingleItem name="keywords" label="Keywords" placeholder="Add keyword" />
          </div>
        </div>

        {/* Additional Settings */}
        <div className="ant-card">
          <div className="ant-card-head"><h3>Settings</h3></div>
          <div className="ant-card-body">
            <InSelect
              name="authorId"
              label="Author"
              rules={[rule_required()]}
              placeholder="Select author"
              // Fetch authors dynamically in a real scenario
              values={[{ title: "Admin", value: '1' }]} // Placeholder
            />
            <InSelect
              name="status"
              label="Status"
              rules={[rule_required()]}
              placeholder="Select status"
              values={[
                { title: "Draft", value: "DRAFT" },
                { title: "Published", value: "PUBLISHED" },
                { title: "Archived", value: "ARCHIVED" },
              ]}
            />
            <InCheckbox name="featured" label="Featured" />
            <InSelect
              name="categoryIds"
              label="Categories"
              placeholder="Select categories"
              mode="multiple"
              // Fetch categories dynamically in a real scenario
              values={[
                { title: "Farming Tips", value: '1' },
                { title: "Farming Tips 2", value: '2' }
              ]} // Placeholder
            />
            <InListSingleItem name="tags" label="Tags" placeholder="Add tag" />
          </div>
        </div>

        <CombineSubmitButton form={form} />
      </div>
    </Form>
  );
}