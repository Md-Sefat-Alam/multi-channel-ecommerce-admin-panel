"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Spin } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, ComponentType } from "react";

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const ComponentWithAuth = (props: P) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const path = usePathname();

    useEffect(() => {
      if (!user?.authentication.sessionId && !isLoading) {
        router.push(`/login?redirect=${encodeURIComponent(path)}`);
      }
    }, [user, router, isLoading]);

    return user ? (
      <WrappedComponent {...props} />
    ) : (
      <div className='w-screen h-screen flex justify-center items-center'>
        <Spin size='large' />
      </div>
    );
  };

  return ComponentWithAuth;
};

export default withAuth;
