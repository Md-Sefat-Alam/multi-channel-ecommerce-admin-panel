"use client";
import TK from "@/components/common/TK";
import {
  ArrowLeftOutlined,
  DollarOutlined,
  EditOutlined,
  HistoryOutlined,
  PrinterOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  message,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Steps,
  Tag,
  Timeline,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  FaBan,
  FaBox,
  FaCheck,
  FaMoneyBillWave,
  FaShoppingCart,
  FaTruck,
} from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import {
  useGetOrdersDetailsQuery,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
} from "../lib/api/orderApi";
import { ORDER_STATUS, PAYMENT_STATUS } from "../lib/orderType";

const { Title, Text } = Typography;
const { Step } = Steps;

// Type definitions
interface Address {
  addressLine?: string;
  thana?: { nameEn: string };
  district?: { nameEn: string };
  division?: { nameEn: string };
  postalCode?: string;
}

interface User {
  fullName?: string;
  mobileNumber?: string;
  email?: string;
}

interface Category {
  categoryName: string;
}

interface Product {
  title: string;
  category: Category;
}

interface OrderItem {
  uuid: string;
  product: Product;
  price: number;
  quantity: number;
}

interface Payment {
  uuid: string;
  status: string;
  method: string;
  amount: number;
  createdAt: string;
}

interface Order {
  invoiceNo: string;
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  user?: User;
  address?: Address;
  remarks?: string;
  items: OrderItem[];
  payments?: Payment[];
}

interface OrderDetailsPageProps {
  params: {
    orderId: string;
  };
}

interface OrderStatusFormValues {
  status: string;
}

interface PaymentStatusFormValues {
  status: string;
}

function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { orderId } = params;
  const router = useRouter();
  const [orderStatusForm] = Form.useForm<OrderStatusFormValues>();
  const [paymentStatusForm] = Form.useForm<PaymentStatusFormValues>();
  const [isOrderStatusModalVisible, setIsOrderStatusModalVisible] =
    useState<boolean>(false);
  const [isPaymentStatusModalVisible, setIsPaymentStatusModalVisible] =
    useState<boolean>(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const {
    data: orderDetails,
    isLoading,
    refetch,
  } = useGetOrdersDetailsQuery(orderId);
  const [updateOrderStatus, { isLoading: isUpdatingOrderStatus }] =
    useUpdateOrderStatusMutation();
  const [updatePaymentStatus, { isLoading: isUpdatingPaymentStatus }] =
    useUpdatePaymentStatusMutation();

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
  });

  // Order status handling
  const showOrderStatusModal = (): void => {
    orderStatusForm.setFieldsValue({ status: orderDetails?.data?.orderStatus });
    setIsOrderStatusModalVisible(true);
  };

  const handleOrderStatusUpdate = async (
    values: OrderStatusFormValues,
  ): Promise<void> => {
    try {
      await updateOrderStatus({
        uuid: orderId,
        status: values.status,
      }).unwrap();
      message.success("Order status updated successfully");
      setIsOrderStatusModalVisible(false);
      refetch();
    } catch (error) {
      message.error("Failed to update order status");
    }
  };

  // Payment status handling
  const showPaymentStatusModal = (): void => {
    if (!orderDetails?.data?.payments?.length) {
      message.error("No payment record found");
      return;
    }
    paymentStatusForm.setFieldsValue({
      status: orderDetails?.data?.payments[0]?.status,
    });
    setIsPaymentStatusModalVisible(true);
  };

  const handlePaymentStatusUpdate = async (
    values: PaymentStatusFormValues,
  ): Promise<void> => {
    try {
      if (!orderDetails?.data?.payments?.length) {
        message.error("No payment record found");
        return;
      }

      await updatePaymentStatus({
        paymentId: orderDetails.data.payments[0].uuid,
        status: values.status,
      }).unwrap();
      message.success("Payment status updated successfully");
      setIsPaymentStatusModalVisible(false);
      refetch();
    } catch (error) {
      message.error("Failed to update payment status");
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <Spin size='large' />
      </div>
    );
  }

  const order: Order | undefined = orderDetails?.data;
  if (!order) {
    return (
      <div className='flex flex-col items-center justify-center h-64'>
        <Title level={4}>Order not found</Title>
        <Button type='primary' onClick={() => router.push("/orders")}>
          Back to Orders
        </Button>
      </div>
    );
  }

  const getCurrentOrderStepIndex = (): number => {
    switch (order.orderStatus) {
      case ORDER_STATUS.PENDING:
        return 0;
      case ORDER_STATUS.SHIPPED:
        return 1;
      case ORDER_STATUS.DELIVERED:
        return 2;
      case ORDER_STATUS.COMPLETED:
        return 3;
      case ORDER_STATUS.CANCELLED:
        return -1;
      default:
        return 0;
    }
  };

  const getOrderStatusIcon = (status: string): JSX.Element | null => {
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

  const getOrderStatusColor = (status: string): string => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return "gold";
      case ORDER_STATUS.SHIPPED:
        return "blue";
      case ORDER_STATUS.DELIVERED:
        return "cyan";
      case ORDER_STATUS.COMPLETED:
        return "green";
      case ORDER_STATUS.CANCELLED:
        return "red";
      default:
        return "default";
    }
  };

  const getPaymentStatusColor = (status: string): string => {
    switch (status) {
      case PAYMENT_STATUS.PENDING:
        return "gold";
      case PAYMENT_STATUS.COMPLETED:
        return "green";
      case PAYMENT_STATUS.FAILED:
        return "red";
      case PAYMENT_STATUS.CANCELED:
        return "red";
      default:
        return "default";
    }
  };

  const formatAddress = (address?: Address): string => {
    if (!address) return "N/A";

    const parts = [
      address.addressLine,
      address.thana?.nameEn,
      address.district?.nameEn,
      address.division?.nameEn,
      address.postalCode,
    ].filter(Boolean);

    return parts.join(", ");
  };

  return (
    <div className='space-y-6'>
      {/* Header with back button and actions */}
      <div className='flex justify-between items-center '>
        <div className='flex items-center space-x-4 gap-4'>
          <Button
            type='default'
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/orders")}
          >
            Back to Orders
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            Order Details - {order.invoiceNo}
          </Title>
        </div>
        <div className='flex space-x-3'>
          <Button
            type='primary'
            icon={<PrinterOutlined />}
            onClick={handlePrint}
          >
            Print Invoice
          </Button>
        </div>
      </div>

      {/* Order Summary and Actions */}
      <Row gutter={24}>
        <Col className='!flex !flex-col !gap-6' span={16}>
          {/* Order Status Card */}
          <Card
            title={
              <div className='flex items-center space-x-2'>
                <ShoppingOutlined />
                <span>Order Status</span>
              </div>
            }
            className='mb-6'
            extra={
              <Tag
                icon={getOrderStatusIcon(order.orderStatus)}
                color={getOrderStatusColor(order.orderStatus)}
                className='px-3 py-1 flex gap-2 items-center text-base'
              >
                {order.orderStatus}
              </Tag>
            }
          >
            {order.orderStatus !== ORDER_STATUS.CANCELLED && (
              <Steps
                current={getCurrentOrderStepIndex()}
                status={
                  order.orderStatus === ORDER_STATUS.CANCELLED
                    ? "error"
                    : "process"
                }
                className='mb-4'
              >
                <Step
                  title='Pending'
                  icon={<FaShoppingCart className='text-xl' />}
                />
                <Step title='Shipped' icon={<FaTruck className='text-xl' />} />
                <Step title='Delivered' icon={<FaBox className='text-xl' />} />
                <Step
                  title='Completed'
                  icon={<FaCheck className='text-xl' />}
                />
              </Steps>
            )}

            <div className='flex justify-end mt-4'>
              <Button
                type='primary'
                icon={<EditOutlined />}
                onClick={showOrderStatusModal}
              >
                Update Order Status
              </Button>
            </div>
          </Card>

          {/* Customer and Order Information */}
          <Card
            title={
              <div className='flex items-center space-x-2'>
                <HistoryOutlined />
                <span>Order Information</span>
              </div>
            }
            className='mb-6'
          >
            <Descriptions bordered column={2}>
              <Descriptions.Item label='Order Date'>
                {dayjs(order.createdAt).format("DD MMM YYYY, HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label='Invoice No'>
                <Text strong>{order.invoiceNo}</Text>
              </Descriptions.Item>
              <Descriptions.Item label='Customer Name' span={2}>
                {order.user?.fullName}
              </Descriptions.Item>
              <Descriptions.Item label='Phone Number'>
                {order.user?.mobileNumber}
              </Descriptions.Item>
              <Descriptions.Item label='Email'>
                {order.user?.email || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label='Shipping Address' span={2}>
                {formatAddress(order.address)}
              </Descriptions.Item>
              <Descriptions.Item label='Remarks' span={2}>
                {order.remarks || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Order Items */}
          <Card
            title={
              <div className='flex items-center space-x-2'>
                <ShoppingOutlined />
                <span>Order Items</span>
              </div>
            }
            className='mb-6'
          >
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Item
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Price
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Quantity
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {order.items.map((item) => (
                  <tr key={item.uuid}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {item.product.title}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {item.product.category.categoryName}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                      <TK end value={Number(item.price.toFixed(2))} />
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                      {item.quantity}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <TK
                        value={Number((item.price * item.quantity).toFixed(2))}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className='px-6 py-4 text-right font-bold'>
                    Total:
                  </td>
                  <td className='px-6 py-4 text-right font-bold'>
                    <TK end value={Number(order.totalAmount.toFixed(2))} />
                  </td>
                </tr>
              </tfoot>
            </table>
          </Card>
        </Col>

        <Col className='!flex !flex-col !gap-6' span={8}>
          {/* Payment Information */}
          <Card
            title={
              <div className='flex items-center space-x-2'>
                <DollarOutlined />
                <span>Payment Information</span>
              </div>
            }
            className='mb-6'
            extra={
              Array.isArray(order.payments) && order.payments.length > 0 ? (
                <Tag
                  icon={<FaMoneyBillWave />}
                  color={getPaymentStatusColor(
                    order.payments[0]?.status ?? "default",
                  )}
                  className='px-3 py-1 flex gap-2 items-center text-base'
                >
                  {order.payments[0]?.status ?? "N/A"}
                </Tag>
              ) : null
            }
          >
            {Array.isArray(order.payments) && order.payments.length > 0 ? (
              <>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label='Payment Method'>
                    {order.payments[0]?.method ?? "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label='Amount'>
                    <TK
                      end
                      value={Number(order.payments[0]?.amount?.toFixed(2) ?? 0)}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label='Date'>
                    {order.payments[0]?.createdAt
                      ? dayjs(order.payments[0].createdAt).format(
                          "DD MMM YYYY, HH:mm",
                        )
                      : "N/A"}
                  </Descriptions.Item>
                </Descriptions>
                <div className='flex justify-end mt-4'>
                  <Button
                    type='primary'
                    icon={<EditOutlined />}
                    onClick={showPaymentStatusModal}
                  >
                    Update Payment Status
                  </Button>
                </div>
              </>
            ) : (
              <div className='text-center py-6'>
                <Text type='secondary'>No payment information available</Text>
              </div>
            )}
          </Card>

          {/* Order Timeline */}
          <Card
            title={
              <div className='flex items-center space-x-2'>
                <HistoryOutlined />
                <span>Order Timeline</span>
              </div>
            }
          >
            <Timeline
              mode='left'
              items={[
                {
                  color: "green",
                  label: dayjs(order.createdAt).format("DD MMM YYYY, HH:mm"),
                  children: "Order placed",
                  dot: <FaShoppingCart />,
                },
                // Additional timeline items would be added here based on order history
                // This is a placeholder since the API doesn't provide status change history
                {
                  color: getOrderStatusColor(order.orderStatus),
                  label: dayjs(order.updatedAt).format("DD MMM YYYY, HH:mm"),
                  children: `Order status: ${order.orderStatus}`,
                  dot: getOrderStatusIcon(order.orderStatus),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* Order Status Modal */}
      <Modal
        title='Update Order Status'
        open={isOrderStatusModalVisible}
        onCancel={() => setIsOrderStatusModalVisible(false)}
        footer={null}
      >
        <Form
          form={orderStatusForm}
          onFinish={handleOrderStatusUpdate}
          layout='vertical'
        >
          <Form.Item
            name='status'
            label='Order Status'
            rules={[{ required: true, message: "Please select order status" }]}
          >
            <Select>
              <Select.Option value={ORDER_STATUS.PENDING}>
                <Space>
                  <FaShoppingCart />
                  <span>Pending</span>
                </Space>
              </Select.Option>
              <Select.Option value={ORDER_STATUS.SHIPPED}>
                <Space>
                  <FaTruck />
                  <span>Shipped</span>
                </Space>
              </Select.Option>
              <Select.Option value={ORDER_STATUS.DELIVERED}>
                <Space>
                  <FaBox />
                  <span>Delivered</span>
                </Space>
              </Select.Option>
              <Select.Option value={ORDER_STATUS.COMPLETED}>
                <Space>
                  <FaCheck />
                  <span>Completed</span>
                </Space>
              </Select.Option>
              <Select.Option value={ORDER_STATUS.CANCELLED}>
                <Space>
                  <FaBan />
                  <span>Cancelled</span>
                </Space>
              </Select.Option>
            </Select>
          </Form.Item>
          <div className='flex justify-end space-x-3'>
            <Button onClick={() => setIsOrderStatusModalVisible(false)}>
              Cancel
            </Button>
            <Button
              type='primary'
              htmlType='submit'
              loading={isUpdatingOrderStatus}
            >
              Update
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Payment Status Modal */}
      <Modal
        title='Update Payment Status'
        open={isPaymentStatusModalVisible}
        onCancel={() => setIsPaymentStatusModalVisible(false)}
        footer={null}
      >
        <Form
          form={paymentStatusForm}
          onFinish={handlePaymentStatusUpdate}
          layout='vertical'
        >
          <Form.Item
            name='status'
            label='Payment Status'
            rules={[
              { required: true, message: "Please select payment status" },
            ]}
          >
            <Select>
              <Select.Option value={PAYMENT_STATUS.PENDING}>
                Pending
              </Select.Option>
              <Select.Option value={PAYMENT_STATUS.COMPLETED}>
                Completed
              </Select.Option>
              <Select.Option value={PAYMENT_STATUS.FAILED}>
                Failed
              </Select.Option>
              <Select.Option value={PAYMENT_STATUS.CANCELED}>
                Canceled
              </Select.Option>
            </Select>
          </Form.Item>
          <div className='flex justify-end space-x-3'>
            <Button onClick={() => setIsPaymentStatusModalVisible(false)}>
              Cancel
            </Button>
            <Button
              type='primary'
              htmlType='submit'
              loading={isUpdatingPaymentStatus}
            >
              Update
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Invoice Print View (hidden until print) */}
      <div style={{ display: "none" }}>
        <div ref={invoiceRef} className='px-6 bg-white'>
          {/* Single A4 page with store copy on top half and customer copy on bottom half */}
          <div
            style={{
              width: "210mm",
              minHeight: "297mm",
              margin: "0 auto",
              padding: "5mm",
            }}
          >
            {/* Store Copy (Top Half) */}
            <div
              style={{
                borderBottom: "1px dashed #000",
                paddingBottom: "5mm",
                marginBottom: "5mm",
              }}
            >
              <div className='text-center mb-4'>
                <Title level={4} style={{ margin: 0 }}>
                  INVOICE (Store Copy)
                </Title>
                <div>{order.invoiceNo}</div>
              </div>

              <Row gutter={16} className='mb-4'>
                <Col span={12}>
                  <Text strong>Bill To:</Text>
                  <div className='text-xs'>{order.user?.fullName}</div>
                  <div className='text-xs'>{order.user?.mobileNumber}</div>
                  <div className='text-xs'>{order.user?.email || ""}</div>
                  <div className='text-xs'>{formatAddress(order.address)}</div>
                </Col>
                <Col span={12} className='text-right'>
                  <div className='text-xs'>
                    <Text strong>Date:</Text>{" "}
                    {dayjs(order.createdAt).format("DD/MM/YYYY")}
                  </div>
                  <div className='text-xs'>
                    <Text strong>Status:</Text> {order.orderStatus}
                  </div>
                  <div className='text-xs'>
                    <Text strong>Payment:</Text>{" "}
                    {order.payments?.[0]?.method || "N/A"}
                  </div>
                  <div className='text-xs'>
                    <Text strong>Payment Status:</Text>{" "}
                    {order.payments?.[0]?.status || "N/A"}
                  </div>
                </Col>
              </Row>

              <table
                className='text-xs'
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: "12px",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid #ddd" }}>
                    <th style={{ padding: "4px", textAlign: "left" }}>Item</th>
                    <th style={{ padding: "4px", textAlign: "right" }}>
                      Price
                    </th>
                    <th style={{ padding: "4px", textAlign: "right" }}>Qty</th>
                    <th style={{ padding: "4px", textAlign: "right" }}>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.length > 5 ? (
                    // If more than 5 items, show item count and total amount
                    <tr>
                      <td style={{ padding: "4px", textAlign: "left" }}>
                        {order.items.length} items (see details in system)
                      </td>
                      <td style={{ padding: "4px", textAlign: "right" }}></td>
                      <td style={{ padding: "4px", textAlign: "right" }}></td>
                      <td style={{ padding: "4px", textAlign: "right" }}>
                        <TK end value={Number(order.totalAmount.toFixed(2))} />
                      </td>
                    </tr>
                  ) : (
                    // Otherwise show all items
                    order.items.map((item) => (
                      <tr
                        key={item.uuid}
                        style={{ borderBottom: "1px solid #eee" }}
                      >
                        <td style={{ padding: "4px", textAlign: "left" }}>
                          {item.product.title}
                          <div style={{ fontSize: "0.7em", color: "#666" }}>
                            {item.product.category.categoryName}
                          </div>
                        </td>
                        <td style={{ padding: "4px", textAlign: "right" }}>
                          <TK end value={Number(item.price.toFixed(2))} />
                        </td>
                        <td style={{ padding: "4px", textAlign: "right" }}>
                          {item.quantity}
                        </td>
                        <td style={{ padding: "4px", textAlign: "right" }}>
                          <TK
                            end
                            value={Number(
                              (item.price * item.quantity).toFixed(2),
                            )}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        padding: "4px",
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      Total:
                    </td>
                    <td
                      style={{
                        padding: "4px",
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      <TK end value={Number(order.totalAmount.toFixed(2))} />
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div className='mt-6'>
                <Row>
                  <Col span={12}>
                    <div className='border-t border-dashed border-gray-400 pt-1 mr-8'>
                      <Text className='text-xs'>Customer Signature</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className='border-t border-dashed border-gray-400 pt-1 ml-8'>
                      <Text className='text-xs'>Authorized Signature</Text>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className='text-center mt-4'>
                <Text type='secondary' className='text-xs'>
                  Store Copy - Thank you for your business!
                </Text>
              </div>
            </div>

            {/* Customer Copy (Bottom Half) */}
            <div>
              <div className='text-center mb-2'>
                <Title level={4} style={{ margin: 0 }}>
                  INVOICE (Customer Copy)
                </Title>
                <div>{order.invoiceNo}</div>
              </div>

              <Row gutter={16} className='mb-2'>
                <Col span={12}>
                  <Text strong>Bill To:</Text>
                  <div className='text-xs'>{order.user?.fullName}</div>
                  <div className='text-xs'>{order.user?.mobileNumber}</div>
                  <div className='text-xs'>{order.user?.email || ""}</div>
                  <div className='text-xs'>{formatAddress(order.address)}</div>
                </Col>
                <Col span={12} className='text-right'>
                  <div className='text-xs'>
                    <Text strong>Date:</Text>{" "}
                    {dayjs(order.createdAt).format("DD/MM/YYYY")}
                  </div>
                  <div className='text-xs'>
                    <Text strong>Status:</Text> {order.orderStatus}
                  </div>
                  <div className='text-xs'>
                    <Text strong>Payment:</Text>{" "}
                    {order.payments?.[0]?.method || "N/A"}
                  </div>
                  <div className='text-xs'>
                    <Text strong>Payment Status:</Text>{" "}
                    {order.payments?.[0]?.status || "N/A"}
                  </div>
                </Col>
              </Row>

              <table
                className='text-xs'
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: "12px",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid #ddd" }}>
                    <th style={{ padding: "4px", textAlign: "left" }}>Item</th>
                    <th style={{ padding: "4px", textAlign: "right" }}>
                      Price
                    </th>
                    <th style={{ padding: "4px", textAlign: "right" }}>Qty</th>
                    <th style={{ padding: "4px", textAlign: "right" }}>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.length > 5 ? (
                    // If more than 5 items, show item count and total amount
                    <tr>
                      <td style={{ padding: "4px", textAlign: "left" }}>
                        {order.items.length} items (see details in system)
                      </td>
                      <td style={{ padding: "4px", textAlign: "right" }}></td>
                      <td style={{ padding: "4px", textAlign: "right" }}></td>
                      <td style={{ padding: "4px", textAlign: "right" }}>
                        <TK end value={Number(order.totalAmount.toFixed(2))} />
                      </td>
                    </tr>
                  ) : (
                    // Otherwise show all items
                    order.items.map((item) => (
                      <tr
                        key={item.uuid}
                        style={{ borderBottom: "1px solid #eee" }}
                      >
                        <td style={{ padding: "4px", textAlign: "left" }}>
                          {item.product.title}
                          <div style={{ fontSize: "0.7em", color: "#666" }}>
                            {item.product.category.categoryName}
                          </div>
                        </td>
                        <td style={{ padding: "4px", textAlign: "right" }}>
                          <TK end value={Number(item.price.toFixed(2))} />
                        </td>
                        <td style={{ padding: "4px", textAlign: "right" }}>
                          {item.quantity}
                        </td>
                        <td style={{ padding: "4px", textAlign: "right" }}>
                          <TK
                            end
                            value={Number(
                              (item.price * item.quantity).toFixed(2),
                            )}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        padding: "4px",
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      Total:
                    </td>
                    <td
                      style={{
                        padding: "4px",
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      <TK end value={Number(order.totalAmount.toFixed(2))} />
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div className='mt-6'>
                <Row>
                  <Col span={12}>
                    <div className='border-t border-dashed border-gray-400 pt-1 mr-8'>
                      <Text className='text-xs'>Customer Signature</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className='border-t border-dashed border-gray-400 pt-1 ml-8'>
                      <Text className='text-xs'>Authorized Signature</Text>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className='text-center mt-4'>
                <Text type='secondary' className='text-xs'>
                  Customer Copy - Please keep for your records
                </Text>
              </div>
            </div>
          </div>

          {/* Alternative separate pages for larger orders */}
          {order.items.length > 5 && (
            <>
              <div style={{ pageBreakBefore: "always" }}></div>
              <div
                style={{
                  width: "210mm",
                  minHeight: "297mm",
                  margin: "0 auto",
                  padding: "5mm",
                }}
              >
                <div className='text-center mb-4'>
                  <Title level={3}>INVOICE DETAILS</Title>
                  <div>{order.invoiceNo}</div>
                </div>

                <Row gutter={16} className='mb-4'>
                  <Col span={12}>
                    <Text strong>Customer:</Text> {order.user?.fullName}
                  </Col>
                  <Col span={12} className='text-right'>
                    <Text strong>Date:</Text>{" "}
                    {dayjs(order.createdAt).format("DD MMM YYYY")}
                  </Col>
                </Row>

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: "16px",
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: "1px solid #ddd" }}>
                      <th style={{ padding: "8px", textAlign: "left" }}>
                        Item
                      </th>
                      <th style={{ padding: "8px", textAlign: "right" }}>
                        Price
                      </th>
                      <th style={{ padding: "8px", textAlign: "right" }}>
                        Qty
                      </th>
                      <th style={{ padding: "8px", textAlign: "right" }}>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr
                        key={item.uuid}
                        style={{ borderBottom: "1px solid #eee" }}
                      >
                        <td style={{ padding: "8px", textAlign: "left" }}>
                          {item.product.title}
                          <div style={{ fontSize: "0.8em", color: "#666" }}>
                            {item.product.category.categoryName}
                          </div>
                        </td>
                        <td style={{ padding: "8px", textAlign: "right" }}>
                          <TK end value={Number(item.price.toFixed(2))} />
                        </td>
                        <td style={{ padding: "8px", textAlign: "right" }}>
                          {item.quantity}
                        </td>
                        <td style={{ padding: "8px", textAlign: "right" }}>
                          <TK
                            end
                            value={Number(
                              (item.price * item.quantity).toFixed(2),
                            )}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colSpan={3}
                        style={{
                          padding: "8px",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        Total:
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        <TK end value={Number(order.totalAmount.toFixed(2))} />
                      </td>
                    </tr>
                  </tfoot>
                </table>

                <div className='text-center mt-8'>
                  <Text type='secondary'>
                    Full order details - For reference purposes
                  </Text>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
