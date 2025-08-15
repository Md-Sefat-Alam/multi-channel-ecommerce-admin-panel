import { Avatar, Button, Divider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

type Props = {};

export default function UserCard({}: Props) {
    const { logout, user } = useAuth();
    return (
        <div className='min-w-[250px] flex flex-col justify-center gap-2 pb-2 items-center '>
            <Avatar
                style={{
                    backgroundColor: "#87d068",
                    width: "150px",
                    height: "150px",
                }}
                icon={
                    user ? (
                        <span className='text-5xl font-bold'>
                            {user?.data?.fullName[0].toLocaleUpperCase()}
                        </span>
                    ) : (
                        <UserOutlined className='text-4xl' />
                    )
                }
            />
            <h2>{user?.data?.fullName}</h2>

            <Divider style={{ marginBottom: "10px" }} />
            <Item link='/' title='Reports' />
            <Item link='/' title='Change Password' />

            <Divider style={{ marginTop: "10px" }} />
            <div className='w-full flex justify-end'>
                <Button onClick={logout} type='primary' danger ghost>
                    Logout
                </Button>
            </div>
        </div>
    );
}

const Item = ({ link, title }: { title: string; link: string }) => {
    return (
        <Link
            className='bg-gray-200/20 w-full p-2 hover:bg-gray-200/40 rounded-md'
            href={link}
        >
            {title}
        </Link>
    );
};
