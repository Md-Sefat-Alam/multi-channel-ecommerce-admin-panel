"use client";

import { Card, Col, Row, Spin, Tag, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "antd/dist/reset.css"; // Ant Design styles
import { useGetAllBlogsQuery } from "./lib/api/blogsApi";

const { Title, Paragraph } = Typography;

export default function BlogListPage() {
  const router = useRouter();
  const { data: blogs, isLoading, isError, error } = useGetAllBlogsQuery('');

  // Handle API errors
  useEffect(() => {
    if (isError) {
      message.error("Failed to load blog posts. Please try again later.");
    }
  }, [isError, error]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading blog posts..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Title level={2} className="text-center mb-8 text-gray-800">
        All Blog Posts
      </Title>
      <Row gutter={[24, 24]} className="justify-center">
        {blogs?.data.map((blog: any) => (
          <Col xs={24} sm={12} md={8} lg={6} key={blog.uuid}>
            <Card
              hoverable
              className="shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
              cover={
                blog.imageUrl ? (
                  <img
                    alt={blog.title}
                    src={`http://localhost:5000/api/uploads/imageUrl/${blog.imageUrl}`}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <EyeOutlined className="text-4xl text-gray-400" />
                  </div>
                )
              }
              onClick={() => router.push(`/blog/${blog.slug}`)}
            >
              <Card.Meta
                title={<span className="text-lg font-semibold text-gray-900">{blog.title}</span>}
                description={
                  <div className="space-y-2">
                    <Paragraph ellipsis={{ rows: 2 }} className="text-gray-600">
                      {blog.subtitle || blog.summary}
                    </Paragraph>
                    <div className="text-sm text-gray-500">
                      <span>By {blog.author.fullName}</span> |{" "}
                      <span>{dayjs(blog.publishedAt).format("MMMM D, YYYY")}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag: any, index: any) => (
                        <Tag key={index} color="blue" className="rounded-full">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}