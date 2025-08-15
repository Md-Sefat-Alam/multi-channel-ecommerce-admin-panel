import { message } from "antd";
import { NoticeType } from "antd/es/message/interface";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface MessageGroupContextType {
  key: string;
  loading_content?: string;
  success_content?: string;
  error_content?: string;
  duration?: number;
  success_url?: string;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: any;
}

const MessageGroupContext = createContext<
  { notify: (values: MessageGroupContextType) => void } | undefined
>(undefined);

export function MessageGroupProvider({ children }: { children: ReactNode }) {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const [states, setStates] = useState<MessageGroupContextType>({
    key: "key",
    loading_content: "Loading...",
    success_content: "Success",
    duration: 2,
    error_content: "Something went wrong!",
    success_url: "",
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: "Something went wrong",
  });

  useEffect(() => {
    if (states.isLoading) {
      messageApi.open({
        key: states.key,
        type: "loading",
        content: states.loading_content || "Loading...",
      });
    }
    if (states.isSuccess) {
      messageApi.open({
        key: states.key,
        type: "success",
        content: states.success_content || "Success",
        duration: 2,
      });
      states.success_url && router.push(states.success_url);
    } else if (states.isError) {
      console.error({
        error: states?.error,
        message: states.error?.data?.message,
        errorContent: states.error_content,
      });
      messageApi.open({
        key: states.key,
        type: "error",
        content: states.error?.data?.message || states.error_content,
        duration: 2,
      });
    }
  }, [states]);

  const setValues = (values: MessageGroupContextType) => {
    setStates((prev) => ({ ...prev, ...values }));
  };

  return (
    <MessageGroupContext.Provider value={{ notify: setValues }}>
      {contextHolder}
      {children}
    </MessageGroupContext.Provider>
  );
}

export function useMessageGroup() {
  const context = useContext(MessageGroupContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
