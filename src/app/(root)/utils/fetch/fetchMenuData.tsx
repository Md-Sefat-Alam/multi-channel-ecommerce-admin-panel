import {
  AlertOutlined,
  AppstoreAddOutlined,
  BellOutlined,
  BookOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  FileDoneOutlined,
  FileOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  LockOutlined,
  OrderedListOutlined,
  ReconciliationOutlined,
  SafetyOutlined,
  ScheduleOutlined,
  SecurityScanOutlined,
  SettingOutlined,
  SolutionOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { CgWebsite } from "react-icons/cg";
import { FaBloggerB } from "react-icons/fa";
import { MdOutlineCategory, MdOutlineFeaturedPlayList, MdOutlineLocalPolice } from "react-icons/md";

// Extended Simulated backend menu data for a Bank Management System
const fetchMenuData = async (): Promise<MenuData[]> => {
  return [
    {
      key: "1",
      label: "Dashboard",
      icon: <DashboardOutlined />,
      url: "/",
    },
    {
      key: "2",
      label: "Orders",
      icon: <OrderedListOutlined />,
      url: "/orders",
    },
    {
      key: "3",
      label: "Product Management",
      icon: <MdOutlineLocalPolice />,
      children: [
        {
          key: "3-1",
          label: "Products",
          icon: <AppstoreAddOutlined />,
          url: "/product-management/products",
        },

        {
          key: "3-2",
          label: "Categories",
          icon: <MdOutlineCategory />,
          url: "/product-management/categories",
        },
        {
          key: "3-3",
          label: "Featured Products",
          icon: <MdOutlineFeaturedPlayList />,
          url: "/product-management/featured-products",
        },
      ],
    },
    // {
    //     key: "31",
    //     label: "Farming",
    //     icon: <FaBloggerB />,
    //     url: "/farming",

    // },

    {
      key: "4",
      label: "Report",
      icon: <FileDoneOutlined />,
      children: [
        {
          key: "4-1",
          label: "Daily Sales",
          icon: <SafetyOutlined />,
          children: [
            {
              icon: <OrderedListOutlined />,
              key: "4-1-1",
              label: "Daily Sales report",
              url: "/report/daily-sales-report",
              isLocked: true,
            },
          ],
        },
        {
          key: "4-2",
          label: "Payment",
          icon: <CreditCardOutlined />,
          children: [
            {
              icon: <OrderedListOutlined />,
              key: "4-2-1",
              label: "Payment report",
              url: "/report/payment",
              isLocked: true,
            },
          ],
        },
      ],
    },
    {
      key: "6",
      label: "Notifications",
      icon: <BellOutlined />,
      children: [
        {
          key: "6-1",
          label: "Alerts",
          icon: <AlertOutlined />,
          url: "/notifications/alerts",
          isLocked: true,
        },
        {
          key: "6-2",
          label: "Messages",
          icon: <SolutionOutlined />,
          url: "/notifications/messages",
          isLocked: true,
        },
      ],
    },
    {
      key: "7",
      label: "Security",
      icon: <LockOutlined />,
      children: [
        {
          key: "7-1",
          label: "Access Control",
          icon: <SafetyOutlined />,
          url: "/security/access-control",
          isLocked: true,
        },
        {
          key: "7-2",
          label: "Audit Logs",
          icon: <SecurityScanOutlined />,
          url: "/security/audit-logs",
          isLocked: true,
        },
      ],
    },
    {
      key: "8",
      label: "Audit",
      icon: <ReconciliationOutlined />,
      children: [
        {
          key: "8-1",
          label: "Audit History",
          icon: <FileOutlined />,
          url: "/audit/history",
          isLocked: true,
        },
        {
          key: "8-2",
          label: "Scheduled Audits",
          icon: <ScheduleOutlined />,
          url: "/audit/scheduled",
          isLocked: true,
        },
      ],
    },
    {
      key: "9",
      label: "Customer Feedback",
      icon: <SolutionOutlined />,
      children: [
        {
          key: "9-1",
          label: "Surveys",
          icon: <FileTextOutlined />,
          url: "/customer-feedback/surveys",
          isLocked: true,
        },
        {
          key: "9-2",
          label: "Feedback Reports",
          icon: <BookOutlined />,
          url: "/customer-feedback/feedback-reports",
          isLocked: true,
        },
      ],
    },
    {
      key: "10",
      label: "Data Management",
      icon: <DatabaseOutlined />,
      children: [
        {
          key: "10-1",
          label: "Data Backup",
          icon: <SyncOutlined />,
          url: "/data-management/backup",
          isLocked: true,
        },
        {
          key: "10-2",
          label: "Data Recovery",
          icon: <FileSearchOutlined />,
          url: "/data-management/recovery",
          isLocked: true,
        },
      ],
    },

    {
      key: "11",
      label: "Registered Customer",
      icon: <UserOutlined />,
      url: "/user-management",
    },

    {
      key: "12",
      label: "Settings",
      icon: <SettingOutlined />,
      children: [
        {
          key: "12-1",
          label: "General Settings",
          icon: <UserOutlined />,
          url: "/settings/general",
        },
        {
          key: "12-2",
          label: "Heo Image",
          icon: <CgWebsite />,
          url: "/settings/hero-images",
        },
      ],
    },

    {
      key: "13",
      label: "Blog Management",
      icon: <SafetyOutlined />,
      children: [
        {
          key: "13-1",
          label: "Create Blog",
          icon: <AppstoreAddOutlined />,
          url: "/blog-management/create-blog",
          isLocked: false,
        },
        // {
        //   key: "13-2",
        //   label: "Insurer list",
        //   icon: <OrderedListOutlined />,
        //   url: "/insurer",
        //   isLocked: true,
        // },
      ],
    },
  ];
};

export default fetchMenuData;
