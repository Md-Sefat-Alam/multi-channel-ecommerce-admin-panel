import { BellOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Layout, Popover, theme } from "antd";
import Search from "antd/es/input/Search";
import Notification from "../Header/Notification";
import UserCard from "../Header/UserCard";
import ThemeSwitcher from "./ThemeSwitcher";
import { useAuth } from "@/contexts/AuthContext";
const { Header } = Layout;

type Props = {};

export default function HeaderComp({}: Props) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { user } = useAuth();

  return (
    <Header
      className='flex items-center justify-between'
      style={{ padding: 0, background: colorBgContainer }}
    >
      <div className='flex justify-center items-center gap-4 pl-4'>
        {/* <MenuOutlined /> */}
        {/* <Search placeholder='Search menus' onSearch={() => {}} allowClear /> */}
      </div>
      <div className='flex justify-center items-center gap-6 pr-4'>
        <ThemeSwitcher />

        {/* <Popover title={false} content={<Notification />} trigger='click'>
          <Badge count={5}>
            <BellOutlined
              style={{ color: "red" }}
              className='text-xl p-1 cursor-pointer'
            />
          </Badge>
        </Popover> */}

        <Popover
          title={false}
          content={<UserCard />}
          trigger='click'
          zIndex={99999}
        >
          <Avatar
            style={{ backgroundColor: "#87d068" }}
            icon={
              user ? (
                <span className='font-bold'>
                  {user?.data?.fullName[0].toLocaleUpperCase()}
                </span>
              ) : (
                <UserOutlined className='text-4xl' />
              )
            }
            className='cursor-pointer'
          />
        </Popover>
      </div>
    </Header>
  );
}
