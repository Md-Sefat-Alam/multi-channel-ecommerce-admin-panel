"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useMessageGroup } from "@/contexts/MessageGroup";
import type { FormProps } from "antd";
import { Button, Form, Input, message } from "antd";
import Image from "next/image";
import React, { useEffect } from "react";
import { useLoginMutation } from "./lib/api/loginApi";
import { getDecryptedData } from "./lib/crypto/encryption";
import { useRouter } from "next/navigation";

type FieldType = {
  email: string;
  password: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const { login, isLoading: authLoading } = useAuth();
  const [loginPost, { isError, isLoading, isSuccess, error, data }] =
    useLoginMutation();
  const { notify } = useMessageGroup();
  const router = useRouter();
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const redirect = searchParams?.get("redirect") || "/";

  useEffect(() => {
    notify({
      isError,
      isLoading,
      isSuccess,
      key: "login-Message-Group",
      error,
      success_content: "Successfully Logged-in!",
      success_url: redirect,
    });

    if (isSuccess) {
      login(data);
    }
  }, [isError, isLoading, isSuccess, error]);

  //   check is already logged-in
  useEffect(() => {
    const token = getDecryptedData("token");
    if (token && !authLoading) {
      router.push(redirect);
    }
  }, [authLoading]);

  return (
    <div className='bg-gradient-to-b min-h-screen from-gray-50 to-transparent'>
      <div className='container mx-auto min-h-screen flex justify-center items-center'>
        <div className='lg:w-3/4 sm:w-11/12 w-full mx-4 min-h-[500px] md:mx-auto rounded-xl bg-gray-100/50 flex md:flex-row flex-col justify-center items-center'>
          {/* Left Side */}
          <div
            className={`w-full md:w-1/2 flex justify-center items-center mb-4 lg:mb-0`}
          >
            <Image
              src={"/logo.svg"}
              alt='logo'
              height={250}
              width={250}
              priority
            />
          </div>
          {/* right Side */}
          <div className='w-full md:w-1/2  px-4'>
            <Form
              form={form}
              name='basic'
              style={{}}
              initialValues={{ remember: true }}
              onFinish={loginPost}
              onFinishFailed={(value: any) => {
                message.error(
                  `${value?.errorFields?.length} field${
                    value?.errorFields?.length > 1 ? "s" : ""
                  } not found`,
                );
              }}
              layout='vertical'
              className=''
            >
              <Form.Item<FieldType>
                label='Email'
                name={["email"]}
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label='Password'
                name='password'
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button loading={isLoading} type='primary' htmlType='submit'>
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
