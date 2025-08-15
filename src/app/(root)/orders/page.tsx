"use client";
import { useMessageGroup } from "@/contexts/MessageGroup";
import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import type { GetProp, TableProps } from "antd";
import {
  Button,
  DatePicker,
  Form,
  message,
  Popconfirm,
  Table,
  Tag,
  Select,
  Row,
  Col,
  Card,
  Statistic
} from "antd";
import Search from "antd/es/input/Search";
import type { SorterResult } from "antd/es/table/interface";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetOrdersQuery } from "./lib/api/orderApi";
import { IOrderGet, ORDER_STATUS } from "./lib/orderType";
import dayjs from "dayjs";
import Link from "next/link";
import { FaSync, FaShoppingCart, FaBox, FaTruck, FaCheck, FaBan } from "react-icons/fa";
import TK from "@/components/common/TK";

type ColumnsType<T extends object = object> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<
  GetProp<TableProps, "pagination">,
  boolean
>;

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>["field"];
  sortOrder?: SorterResult<any>["order"];
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
  search?: any;
}

const getRandomuserParams = (params: TableParams): IGetProps => {
  return {
    length: params.pagination?.pageSize || 10,
    start:
      ((params.pagination?.current || 0) - 1) *
      (params.pagination?.pageSize || 0) || 0,
    search: params.search || {},
    filters: params.filters || {},
  };
};

function OrdersPage() {
  const [filters, setFilters] = useState<IGetProps>({
    start: 0,
    length: 10,
    filters: {},
    search: {},
  });

  const { data: orders, isLoading, isFetching, refetch } = useGetOrdersQuery(filters);
  const [form] = Form.useForm();
  const router = useRouter();
  const { notify } = useMessageGroup();

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      pageSizeOptions: ["10", "20", "50", "100"],
    },
  });

  const handleTableChange: TableProps<IOrderGet>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setFilters({ start: 0, length: 10 });
    }
  };

  const onFilterChange = (values: any) => {
    form.validateFields().then(values => {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current: 1,
        },
      });
    });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      const { sortField, sortOrder, filters, pagination } = tableParams;
      const formValues = form.getFieldsValue();
      const params = getRandomuserParams({
        pagination: {
          current: pagination?.current,
          pageSize: pagination?.pageSize,
        },
        search: {
          // Use a flat structure for search

          user: formValues ? {
            fullName: formValues.searchText || undefined,
            mobileNumber: formValues.searchText || undefined,
            email: formValues.searchText || undefined
          } : undefined,
          invoiceNo: formValues.searchText || undefined,
          // Use proper date range format
          createdAt: formValues.dateRange
            ? {
              gte: formValues.dateRange[0]?.startOf('day').toISOString(),
              lte: formValues.dateRange[1]?.endOf('day').toISOString()
            }
            : undefined,
        },
        filters: {
          orderStatus: formValues.orderStatus || undefined,
        },
        sortField,
        sortOrder,
      });
      setFilters(params);
    }, 400);
    return () => clearTimeout(handler);
  }, [tableParams, form]);

  const getOrderStatusColor = (status: ORDER_STATUS) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return 'gold';
      case ORDER_STATUS.SHIPPED:
        return 'blue';
      case ORDER_STATUS.DELIVERED:
        return 'cyan';
      case ORDER_STATUS.COMPLETED:
        return 'green';
      case ORDER_STATUS.CANCELLED:
        return 'red';
      default:
        return 'default';
    }
  };

  const getOrderStatusIcon = (status: ORDER_STATUS) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return <FaShoppingCart />;
      case ORDER_STATUS.SHIPPED:
        return <FaTruck />;
      case ORDER_STATUS.DELIVERED:
        return <FaBox />;
      case ORDER_STATUS.COMPLETED:
        return <FaCheck />;
      case ORDER_STATUS.CANCELLED:
        return <FaBan />;
      default:
        return null;
    }
  };

  const columns: ColumnsType<IOrderGet> = [
    {
      title: "Invoice No",
      dataIndex: "invoiceNo",
      render: (invoiceNo: any) => <span className="font-semibold">{invoiceNo}</span>,
    },
    {
      title: "Customer Information",
      children: [
        {
          title: "Name",
          dataIndex: "user",
          render: (user: any) => <>{user?.fullName}</>,
        },
        {
          title: "Mobile",
          dataIndex: "user",
          render: (user: any) => <>{user?.mobileNumber}</>,
        },
        {
          title: "Email",
          dataIndex: "user",
          render: (user: any) => <>{user?.email || '-'}</>,
        },
      ]
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      render: (createdAt: any) => (
        <Tag bordered={false} color={"success"}>
          {dayjs(createdAt).format("DD.MM.YYYY HH:mm")}
        </Tag>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      render: (amount) => (
        <div className="flex justify-end"><TK value={Number((amount as number).toFixed(2))} ></TK></div>
      ),
      align: 'right'
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      render: (status) => (
        <Tag
          icon={getOrderStatusIcon(status)}
          color={getOrderStatusColor(status)}
          className="!px-3 !py-1 !flex gap-2 !justify-center !items-center"
          style={{

          }}
        >
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: ORDER_STATUS.PENDING },
        { text: 'Shipped', value: ORDER_STATUS.SHIPPED },
        { text: 'Delivered', value: ORDER_STATUS.DELIVERED },
        { text: 'Completed', value: ORDER_STATUS.COMPLETED },
        { text: 'Cancelled', value: ORDER_STATUS.CANCELLED }
      ],
    },
    {
      title: "Action",
      render: (_, record) => (
        <div className='flex gap-2' style={{ fontSize: "20px" }}>
          <Link href={`/orders/${record.uuid}`}>
            <Button type="primary" icon={<EyeOutlined />} size="small">
              Details
            </Button>
          </Link>
        </div>
      ),
      width: "150px",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {/* <Row gutter={16}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Orders"
              value={orderCounts.total}
              prefix={<FaShoppingCart />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Pending"
              value={orderCounts.pending}
              valueStyle={{ color: '#faad14' }}
              prefix={<FaShoppingCart />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Shipped"
              value={orderCounts.shipped}
              valueStyle={{ color: '#1890ff' }}
              prefix={<FaTruck />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Delivered"
              value={orderCounts.delivered}
              valueStyle={{ color: '#13c2c2' }}
              prefix={<FaBox />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Completed"
              value={orderCounts.completed}
              valueStyle={{ color: '#52c41a' }}
              prefix={<FaCheck />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Cancelled"
              value={orderCounts.cancelled}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<FaBan />}
            />
          </Card>
        </Col>
      </Row> */}

      {/* Filters */}

      <Form
        name="orderFilters"
        form={form}
        layout="vertical"
        onValuesChange={onFilterChange}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="searchText" label="Search">
              <Search
                placeholder="Search by invoice, name, email, mobile"
                enterButton
                loading={isLoading}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="dateRange" label="Order Date Range">
              <DatePicker.RangePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="orderStatus" label="Order Status">
              <Select
                placeholder="Select status"
                allowClear
                style={{ width: '100%' }}
                options={[
                  { value: ORDER_STATUS.PENDING, label: 'Pending' },
                  { value: ORDER_STATUS.SHIPPED, label: 'Shipped' },
                  { value: ORDER_STATUS.DELIVERED, label: 'Delivered' },
                  { value: ORDER_STATUS.COMPLETED, label: 'Completed' },
                  { value: ORDER_STATUS.CANCELLED, label: 'Cancelled' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end">
          <Button
            type="primary"
            onClick={() => {
              refetch();
            }}
            icon={<FaSync />}
          >
            Refresh
          </Button>
        </Row>
      </Form>


      {/* Orders Table */}
      <Table
        columns={columns}
        rowKey={(record) => record.uuid}
        dataSource={orders?.data || []}
        pagination={{
          ...tableParams.pagination,
          total: orders?.recordsTotal,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`,
        }}
        loading={isLoading || isFetching}
        onChange={handleTableChange}
        bordered
        size="middle"
        scroll={{ x: 1300 }}
      />
    </div>
  );
}

export default OrdersPage;