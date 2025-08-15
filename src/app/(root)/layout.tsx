"use client";
import HeaderComp from "@/components/common/HeaderComp";
import { LockOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Input, Layout, Menu, theme } from "antd";
import Image from "next/image";
import React, { Suspense, useEffect, useState } from "react";
import fetchMenuData from "./utils/fetch/fetchMenuData";
import withAuth from "../(auth)/login/hooks/withAuth";
import Link from "next/link";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";

const { Search } = Input;

const { Content, Footer, Sider } = Layout;

// Function to create a menu item with lock status
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  isLocked?: boolean,
  url?: string
): MenuItem {
  const labelWithLock =
    isLocked && !children ? (
      <p className='flex justify-between w-full'>
        <p>{label}</p>
        <LockOutlined style={{ marginLeft: "8px" }} />
      </p>
    ) : url ? (
      <Link href={url}>{label}</Link>
    ) : (
      label
    );

  return {
    key,
    icon,
    children,
    label: labelWithLock,
    disabled: isLocked,
    expandIcon:
      isLocked && children ? (
        <LockOutlined style={{ marginRight: "-18px" }} />
      ) : undefined,
  };
}

// Component
const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [collapsed, setCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const {
    token: { colorBgContainer, borderRadiusLG, colorBgLayout },
  } = theme.useToken();

  // Fetching menu data from the backend (simulated)
  useEffect(() => {
    const loadMenuData = async () => {
      const data = await fetchMenuData();
      const formattedItems = formatMenuItems(data);
      setMenuItems(formattedItems);
      setFilteredItems(formattedItems);
    };
    loadMenuData();
  }, []);

  // Formatting the fetched data into the MenuItem type
  const formatMenuItems = (data: MenuData[]): MenuItem[] =>
    data.map((item) =>
      getItem(
        item.label,
        item.key,
        item.icon,
        item.children ? formatMenuItems(item.children) : undefined,
        item.isLocked,
        item.url
      )
    );

  // Deep search filter function
  const handleSearch = (value: string) => {
    if (!value) {
      setFilteredItems(menuItems);
      return;
    }

    const deepSearch = (items: any[], query: string): MenuItem[] => {
      return items
        .map((item) => {
          const matchedChildren = item?.children
            ? deepSearch(item?.children, query)
            : [];

          // Extract the text content from the label if it's JSX or string
          const labelText =
            typeof item.label === "string"
              ? item.label
              : item.label.props?.children &&
                typeof item.label.props.children === "string"
              ? item.label.props.children
              : "";

          const matchIndex = labelText
            .toLowerCase()
            .indexOf(query.toLowerCase());

          // Highlight the matched part
          const highlightedLabel =
            matchIndex >= 0 ? (
              <>
                {labelText.substring(0, matchIndex)}
                <span style={{ color: "#1DA1F2" }}>
                  {labelText.substring(matchIndex, matchIndex + query.length)}
                </span>
                {labelText.substring(matchIndex + query.length)}
                {item.isLocked && !item.children && (
                  <LockOutlined style={{ color: "red" }} />
                )}
              </>
            ) : (
              <>
                {labelText}
                {item.isLocked && !item.children && (
                  <LockOutlined style={{ color: "red" }} />
                )}
              </>
            );

          const isMatch = matchIndex >= 0 || matchedChildren.length > 0;

          // If there's a match, retain all children, not just the matched ones
          return isMatch
            ? {
                ...item,
                label: highlightedLabel, // Update label with highlighted text and lock icon
                children: item.children
                  ? matchedChildren.length
                    ? matchedChildren
                    : item.children
                  : undefined,
              }
            : null;
        })
        .filter((item) => item !== null); // Type guard to filter non-null values
    };

    const results = deepSearch(menuItems, value);
    setFilteredItems(results);
  };

  // Handle the opening and closing of menu items
  const handleOpenChange = (keys: string[]) => {
    if (keys.length && keys[keys.length - 1].split("-").length === 1) {
      setOpenKeys([keys[keys.length - 1]]);
    } else {
      setOpenKeys(keys);
    }
  };

  return (
    <main>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          breakpoint='lg'
          collapsible={false}
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{
            background: colorBgContainer,
            height: "100vh",
            position: "sticky",
            insetInlineStart: 0,
            top: 0,
            bottom: 0,
            overflowY: "auto",
          }}
          width={300}
          className='hide-scrollbar relative pt-[100px] lg:pt-[180px]'
        >
          {/* Sticky Header Section */}
          <div
            className='fixed w-[80px] lg:w-[300px] top-0 z-50' // Ensure it's always on top and sticky
            style={{
              background: colorBgContainer,
            }}
          >
            <div
              className='flex justify-center items-center p-2'
              style={{
                background: colorBgContainer,
                minHeight: 100,
              }}
            >
              <Image
                alt='logo'
                src={"/logo.svg"}
                height={70}
                width={70}
                priority={true}
              />
            </div>
            <Search
              placeholder='Search menus'
              // onSearch={handleSearch}
              onChange={(data) => {
                handleSearch(data.target.value);
              }}
              allowClear
              style={{
                marginBottom: 16,
                padding: "8px 16px",
                zIndex: 50, // Make sure the search bar stays above other elements
                background: colorBgContainer,
              }}
              className='!hidden lg:!block '
            />
          </div>
          {/* Sidebar Menu */}
          <Menu
            mode='inline'
            items={filteredItems}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
          />
        </Sider>

        <Layout>
          <HeaderComp />

          <Content style={{ margin: "0 16px" }}>
            <DynamicBreadcrumb menuData={menuItems} />
            <div
              style={{
                padding: 24,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                minHeight: "100%",
              }}
            >
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Salam Tech ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </main>
  );
};

export default withAuth(RootLayout);
