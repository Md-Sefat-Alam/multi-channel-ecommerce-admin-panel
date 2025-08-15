'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Image,
  Pagination,
  Typography,
  Row,
  Col,
  Statistic,
  message,
  Spin,
  Select,
  Tooltip,
  Badge,
  Progress,
  notification,
  Alert
} from 'antd';
import {
  DownloadOutlined,
  UploadOutlined,
  SyncOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  EyeOutlined,
  BarChartOutlined,
  ShopOutlined,
  LinkOutlined,
  WifiOutlined,
  DisconnectOutlined
} from '@ant-design/icons';
import { apiSlice } from "@/lib/api/apiSlice";
import { useSelector } from 'react-redux';
import dayjs from "dayjs";
import { IoTrendingUp, IoTriangleOutline } from 'react-icons/io5';
import getUrl from '@/lib/utils/getUrl';
import useSocket from '@/hooks/useSocket';

const { Title, Text } = Typography;
const { Option } = Select;

// Types remain the same...
interface IntegrationStatus {
  ssActiveWearLinked: boolean;
  shopifyDeployed: boolean;
  styleNumber?: string;
  shopifyId?: string;
}

interface ProductImage {
  path: string;
}

interface Product {
  id: string;
  uuid: string;
  title: string;
  finalPrice: number;
  stock: number;
  integrationStatus: IntegrationStatus;
  images?: ProductImage[];
}

interface Stats {
  totalProducts: number;
  ssActiveWearLinked: number;
  shopifyDeployed: number;
  outOfStock: number;
  lowStock: number;
  syncCoverage: number;
  deploymentRate: number;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface ProductsResponse {
  products: Product[];
  pagination: PaginationData;
}

// API Endpoints remain the same...
export const multiChannelApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMultiChannelStats: builder.query<
      IRes<Stats>,
      void
    >({
      query: () => ({
        url: "/admin/multi-channel/stats",
        method: "GET",
      }),
      providesTags: ["MultiChannel"],
    }),

    getMultiChannelProducts: builder.query<
      IRes<ProductsResponse>,
      { page?: number; limit?: number; filter?: string }
    >({
      query: ({ page = 1, limit = 10, filter = 'all' }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (filter !== 'all') {
          params.append('filter', filter);
        }

        return {
          url: `/admin/multi-channel/products?${params}`,
          method: "GET",
        };
      },
      providesTags: ["MultiChannel"],
    }),

    importFromSSActiveWear: builder.mutation<
      IRes<{ imported: number; updated: number }>,
      { page?: number; limit?: number }
    >({
      query: (body) => ({
        url: "/admin/multi-channel/import/ssactivewear",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MultiChannel"],
    }),

    deployToShopify: builder.mutation<
      IRes<any>,
      string
    >({
      query: (productId) => ({
        url: `/admin/multi-channel/deploy/shopify/${productId}`,
        method: "POST",
      }),
      invalidatesTags: ["MultiChannel"],
    }),

    syncInventory: builder.mutation<
      IRes<{ successful?: number; totalProducts?: number }>,
      string | null
    >({
      query: (productId) => ({
        url: productId
          ? `/admin/multi-channel/sync/inventory/${productId}`
          : "/admin/multi-channel/sync/bulk",
        method: "POST",
      }),
      invalidatesTags: ["MultiChannel"],
    }),

    testImportSample: builder.mutation<
      IRes<any>,
      void
    >({
      query: () => ({
        url: "/admin/multi-channel/test/import-sample",
        method: "POST",
      }),
      invalidatesTags: ["MultiChannel"],
    }),

    testDeploySample: builder.mutation<
      IRes<any>,
      void
    >({
      query: () => ({
        url: "/admin/multi-channel/test/deploy-sample",
        method: "POST",
      }),
      invalidatesTags: ["MultiChannel"],
    }),
  }),
});

export const {
  useGetMultiChannelStatsQuery,
  useGetMultiChannelProductsQuery,
  useImportFromSSActiveWearMutation,
  useDeployToShopifyMutation,
  useSyncInventoryMutation,
  useTestImportSampleMutation,
  useTestDeploySampleMutation,
} = multiChannelApi;

const MultiChannelDashboard: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [bulkSyncProgress, setBulkSyncProgress] = useState<any>(null);
  const [recentUpdates, setRecentUpdates] = useState<any[]>([]);


  // Socket connection
  const { isConnected, subscribe, unsubscribe, emit, socket } = useSocket();


  // RTK Query hooks
  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useGetMultiChannelStatsQuery();
  const {
    data: productsData,
    isLoading: productsLoading,
    refetch: refetchProducts
  } = useGetMultiChannelProductsQuery({
    page: currentPage,
    limit: pageSize,
    filter
  });

  // Mutations
  const [importFromSSActiveWear, { isLoading: importLoading }] = useImportFromSSActiveWearMutation();
  const [deployToShopify, { isLoading: deployLoading }] = useDeployToShopifyMutation();
  const [syncInventory, { isLoading: syncLoading }] = useSyncInventoryMutation();
  const [testImportSample, { isLoading: testImportLoading }] = useTestImportSampleMutation();
  const [testDeploySample, { isLoading: testDeployLoading }] = useTestDeploySampleMutation();

  const stats = statsData?.data;
  const products = productsData?.data?.products || [];
  const pagination = productsData?.data?.pagination;

  // Socket event handlers
  const handleInventoryUpdate = useCallback((data: any) => {
    console.log('Inventory updated:', data);

    // Show notification
    notification.success({
      message: 'Inventory Updated',
      description: `${data.productTitle}: ${data.oldStock} → ${data.newStock} units`,
      placement: 'bottomRight',
      duration: 3,
    });

    // Add to recent updates
    setRecentUpdates(prev => [{
      id: Date.now(),
      type: 'inventory_update',
      message: `${data.productTitle} stock: ${data.oldStock} → ${data.newStock}`,
      timestamp: data.timestamp,
      channel: data.channel
    }, ...prev.slice(0, 49)]); // Keep last 50 updates

    // Refresh data
    refetchProducts();
    refetchStats();
  }, [refetchProducts, refetchStats]);

  const handleProductStatusUpdate = useCallback((data: any) => {
    console.log('Product status updated:', data);

    let notificationMessage = '';
    switch (data.status) {
      case 'DEPLOYING':
        notificationMessage = `Deploying ${data.productTitle} to ${data.channel}...`;
        break;
      case 'DEPLOYED':
        notificationMessage = `${data.productTitle} deployed to ${data.channel} successfully!`;
        break;
      case 'DEPLOYMENT_FAILED':
        notificationMessage = `Failed to deploy ${data.productTitle} to ${data.channel}`;
        break;
    }

    if (data.status === 'DEPLOYMENT_FAILED') {
      notification.error({
        message: 'Deployment Failed',
        description: notificationMessage,
        placement: 'bottomRight',
        duration: 4,
      });
    } else if (data.status === 'DEPLOYED') {
      notification.success({
        message: 'Deployment Success',
        description: notificationMessage,
        placement: 'bottomRight',
        duration: 3,
      });
    } else {
      notification.info({
        message: 'Status Update',
        description: notificationMessage,
        placement: 'bottomRight',
        duration: 2,
      });
    }

    // Add to recent updates
    setRecentUpdates(prev => [{
      id: Date.now(),
      type: 'status_update',
      message: notificationMessage,
      timestamp: data.timestamp,
      status: data.status
    }, ...prev.slice(0, 49)]);

    // Refresh data
    refetchProducts();
    refetchStats();
  }, [refetchProducts, refetchStats]);

  const handleBulkSyncProgress = useCallback((data: any) => {
    console.log('Bulk sync progress:', data);
    setBulkSyncProgress(data);

    // Show progress notification
    notification.info({
      message: 'Bulk Sync Progress',
      description: `${data.completed}/${data.total} products synced`,
      placement: 'bottomRight',
      duration: 2,
    });
  }, []);

  const handleBulkSyncCompleted = useCallback((data: any) => {
    console.log('Bulk sync completed:', data);
    setBulkSyncProgress(null);

    notification.success({
      message: 'Bulk Sync Completed',
      description: `${data.successful}/${data.totalProducts} products synced successfully`,
      placement: 'bottomRight',
      duration: 4,
    });

    // Add to recent updates
    setRecentUpdates(prev => [{
      id: Date.now(),
      type: 'bulk_sync',
      message: `Bulk sync completed: ${data.successful}/${data.totalProducts} products`,
      timestamp: data.timestamp,
    }, ...prev.slice(0, 49)]);

    refetchProducts();
    refetchStats();
  }, [refetchProducts, refetchStats]);

  const handleStatsUpdate = useCallback((data: any) => {
    console.log('Stats updated:', data);
    refetchStats();
  }, [refetchStats]);

  const handleImportCompleted = useCallback((data: any) => {
    console.log('Import completed:', data);

    notification.success({
      message: 'Import Completed',
      description: `${data.imported} new products imported, ${data.updated} updated`,
      placement: 'bottomRight',
      duration: 4,
    });

    setRecentUpdates(prev => [{
      id: Date.now(),
      type: 'import',
      message: `Import: ${data.imported} new, ${data.updated} updated`,
      timestamp: data.timestamp,
    }, ...prev.slice(0, 49)]);

    refetchProducts();
    refetchStats();
  }, [refetchProducts, refetchStats]);

  const handleShopifyOrderProcessed = useCallback((data: any) => {
    console.log('Shopify order processed:', data);

    notification.info({
      message: 'Shopify Order Received',
      description: `Order #${data.orderId} processed. ${data.updatedProducts.length} products updated.`,
      placement: 'bottomRight',
      duration: 3,
    });

    setRecentUpdates(prev => [{
      id: Date.now(),
      type: 'shopify_order',
      message: `Order #${data.orderId}: ${data.updatedProducts.length} products updated`,
      timestamp: data.timestamp,
    }, ...prev.slice(0, 49)]);

    refetchProducts();
    refetchStats();
  }, [refetchProducts, refetchStats]);

  // Setup socket event listeners
  useEffect(() => {
    if (!isConnected) return;

    // Subscribe to socket events
    subscribe('inventory-updated', handleInventoryUpdate);
    subscribe('product-status-updated', handleProductStatusUpdate);
    subscribe('bulk-sync-progress', handleBulkSyncProgress);
    subscribe('bulk-sync-completed', handleBulkSyncCompleted);
    subscribe('stats-updated', handleStatsUpdate);
    subscribe('import-completed', handleImportCompleted);
    subscribe('shopify-order-processed', handleShopifyOrderProcessed);

    // Cleanup function
    return () => {
      unsubscribe('inventory-updated', handleInventoryUpdate);
      unsubscribe('product-status-updated', handleProductStatusUpdate);
      unsubscribe('bulk-sync-progress', handleBulkSyncProgress);
      unsubscribe('bulk-sync-completed', handleBulkSyncCompleted);
      unsubscribe('stats-updated', handleStatsUpdate);
      unsubscribe('import-completed', handleImportCompleted);
      unsubscribe('shopify-order-processed', handleShopifyOrderProcessed);
    };
  }, [
    isConnected,
    subscribe,
    unsubscribe,
    handleInventoryUpdate,
    handleProductStatusUpdate,
    handleBulkSyncProgress,
    handleBulkSyncCompleted,
    handleStatsUpdate,
    handleImportCompleted,
    handleShopifyOrderProcessed
  ]);

  // Event handlers
  const handleImportProducts = async () => {
    if (!isConnected) {
      message.error('Socket connection is not established. Please try again later.');
      return;
    }
    try {
      // Emit sync request to socket
      emit('sync-inventory-request', { type: 'import' });

      const result = await importFromSSActiveWear({ page: 1, limit: 10 }).unwrap();
      message.success(`Import completed: ${result.data.imported} imported, ${result.data.updated} updated`);
    } catch (error: any) {
      message.error(error?.data?.message || 'Import failed');
    }
  };

  const handleDeployToShopify = async (productId: string) => {
    try {
      await deployToShopify(productId).unwrap();
      message.success('Product deployed to Shopify successfully');
    } catch (error: any) {
      message.error(error?.data?.message || 'Deployment failed');
    }
  };

  const handleSyncInventory = async (productId?: string) => {
    try {
      // Emit sync request to socket
      emit('sync-inventory-request', { productId });

      const result = await syncInventory(productId || null).unwrap();
      const msg = productId
        ? 'Product inventory synced successfully'
        : `Bulk sync completed: ${result.data.successful}/${result.data.totalProducts} products synced`;
      message.success(msg);
    } catch (error: any) {
      message.error(error?.data?.message || 'Sync failed');
    }
  };

  const handleTestImport = async () => {
    try {
      await testImportSample().unwrap();
      message.success('Sample import completed successfully');
    } catch (error: any) {
      message.error(error?.data?.message || 'Test import failed');
    }
  };

  const handleTestDeploy = async () => {
    try {
      await testDeploySample().unwrap();
      message.success('Sample deployment completed successfully');
    } catch (error: any) {
      message.error(error?.data?.message || 'Test deployment failed');
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (product: Product) => {
    const { integrationStatus } = product;
    if (integrationStatus.ssActiveWearLinked && integrationStatus.shopifyDeployed) {
      return <Tag color="success">Fully Synced</Tag>;
    } else if (integrationStatus.ssActiveWearLinked) {
      return <Tag color="blue">SSActiveWear Only</Tag>;
    } else if (integrationStatus.shopifyDeployed) {
      return <Tag color="purple">Shopify Only</Tag>;
    }
    return <Tag color="default">Not Synced</Tag>;
  };

  const getStockTag = (stock: number) => {
    if (stock === 0) return <Tag color="error">{stock} units</Tag>;
    if (stock <= 10) return <Tag color="warning">{stock} units</Tag>;
    return <Tag color="success">{stock} units</Tag>;
  };

  // Table columns
  const columns = [
    {
      title: 'Product',
      key: 'product',
      render: (record: Product) => (
        <div className="flex items-center space-x-3">
          {record.images?.[0] && (
            <Image
              width={40}
              height={40}
              src={getUrl({ path: record.images[0].path })}
              alt={record.title}
              className="rounded object-cover"
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
            />
          )}
          <div>
            <Text strong className="block">{record.title}</Text>
            {record.integrationStatus?.styleNumber && (
              <Text type="secondary" className="text-xs">
                Style: {record.integrationStatus.styleNumber}
              </Text>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: Product) => getStatusBadge(record),
    },
    {
      title: 'Stock',
      key: 'stock',
      render: (record: Product) => getStockTag(record.stock),
    },
    {
      title: 'Price',
      key: 'price',
      render: (record: Product) => <Text strong>${record.finalPrice}</Text>,
    },
    {
      title: 'Integration',
      key: 'integration',
      render: (record: Product) => (
        <Space>
          {record.integrationStatus.ssActiveWearLinked && (
            <Tooltip title="SSActiveWear">
              <Tag icon={<DownloadOutlined />} color="blue">SS</Tag>
            </Tooltip>
          )}
          {record.integrationStatus.shopifyDeployed && (
            <Tooltip title="Shopify">
              <Tag icon={<ShopOutlined />} color="purple">Shopify</Tag>
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Product) => (
        <Space>
          {record.integrationStatus.ssActiveWearLinked && !record.integrationStatus.shopifyDeployed && (
            <Tooltip title="Deploy to Shopify">
              <Button
                type="text"
                size="small"
                icon={<UploadOutlined />}
                loading={deployLoading}
                onClick={() => handleDeployToShopify(record.uuid)}
                className="text-purple-600 hover:text-purple-800"
              />
            </Tooltip>
          )}
          {record.integrationStatus.ssActiveWearLinked && (
            <Tooltip title="Sync Inventory">
              <Button
                type="text"
                size="small"
                icon={<SyncOutlined />}
                loading={syncLoading}
                onClick={() => handleSyncInventory(record.uuid)}
                className="text-green-600 hover:text-green-800"
              />
            </Tooltip>
          )}
          {record.integrationStatus.shopifyDeployed && (
            <Tooltip title="View in Shopify">
              <Button
                type="text"
                size="small"
                icon={<LinkOutlined />}
                onClick={() => window.open(`https://${process.env.NEXT_PUBLIC_SHOPIFY_SHOP}/admin/products/${record.integrationStatus.shopifyId}`, '_blank')}
                className="text-gray-600 hover:text-gray-800"
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'SSActiveWear Linked', value: 'ssactivewear-linked' },
    { label: 'Shopify Deployed', value: 'shopify-deployed' },
    { label: 'Not Synced', value: 'not-synced' },
    { label: 'Low Stock', value: 'low-stock' },
    { label: 'Out of Stock', value: 'out-of-stock' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Connection Status */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <Title level={2}>Multi-Channel Integration Dashboard</Title>
            <Text type="secondary">Manage products across SSActiveWear and Shopify channels</Text>
          </div>
          <div className="flex items-center space-x-4">
            <Badge
              status={isConnected ? "success" : "error"}
              text={isConnected ? "Real-time Connected" : "Disconnected"}
            />
            {isConnected ? (
              <WifiOutlined className="text-green-500 text-lg" />
            ) : (
              <DisconnectOutlined className="text-red-500 text-lg" />
            )}
          </div>
        </div>
      </div>

      {/* Bulk Sync Progress */}
      {bulkSyncProgress && (
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <Text strong>Bulk Sync in Progress</Text>
            <Text>{bulkSyncProgress.completed}/{bulkSyncProgress.total}</Text>
          </div>
          <Progress
            percent={Math.round((bulkSyncProgress.completed / bulkSyncProgress.total) * 100)}
            status={bulkSyncProgress.completed === bulkSyncProgress.total ? "success" : "active"}
          />
          {bulkSyncProgress.currentProduct && (
            <Text type="secondary" className="text-xs mt-1">
              Current: {bulkSyncProgress.currentProduct}
            </Text>
          )}
        </Card>
      )}

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={stats?.totalProducts || 0}
              loading={statsLoading}
              prefix={<ShoppingCartOutlined className="text-blue-600" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="SSActiveWear Linked"
              value={stats?.ssActiveWearLinked || 0}
              loading={statsLoading}
              prefix={<DownloadOutlined className="text-green-600" />}
              suffix={
                <Text type="secondary" className="text-xs">
                  ({stats?.syncCoverage || 0}%)
                </Text>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Shopify Deployed"
              value={stats?.shopifyDeployed || 0}
              loading={statsLoading}
              prefix={<ShopOutlined className="text-purple-600" />}
              suffix={
                <Text type="secondary" className="text-xs">
                  ({stats?.deploymentRate || 0}%)
                </Text>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Stock Issues"
              value={(stats?.outOfStock || 0) + (stats?.lowStock || 0)}
              loading={statsLoading}
              prefix={<IoTriangleOutline className="text-red-600" />}
              suffix={
                <Text type="secondary" className="text-xs">
                  ({stats?.outOfStock || 0} out, {stats?.lowStock || 0} low)
                </Text>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Updates Panel */}
      {recentUpdates.length > 0 && (
        <Card className="mb-8">
          <Title level={5}>Recent Updates</Title>
          <div className="max-h-[650px] overflow-y-auto">
            {recentUpdates.map((update) => (
              <div key={update.id} className="flex justify-between items-center py-1 border-b last:border-0">
                <Text className="text-sm">{update.message} <Tag color={update.channel === 'sync' ? "magenta" : "success"}>{update.channel}</Tag></Text>
                <Text type="secondary" className="text-xs">
                  {dayjs(update.timestamp).format('HH:mm:ss')}
                </Text>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <Card className="mb-8">
        <Title level={4}>Quick Actions</Title>
        <Space wrap>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            loading={testImportLoading}
            onClick={handleTestImport}
          >
            Test Import (5 products)
          </Button>
          <Button
            icon={<UploadOutlined />}
            loading={testDeployLoading}
            onClick={handleTestDeploy}
          >
            Test Deploy
          </Button>
          <Button
            icon={<SyncOutlined />}
            loading={syncLoading}
            onClick={() => handleSyncInventory()}
          >
            Bulk Sync Inventory
          </Button>
          <Button
            icon={<IoTrendingUp />}
            loading={importLoading}
            onClick={handleImportProducts}
          >
            Import New Products
          </Button>
        </Space>
      </Card>

      {/* Products Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Title level={4} className="mb-0">Products</Title>
          <Select
            value={filter}
            onChange={handleFilterChange}
            style={{ width: 200 }}
            placeholder="Filter products"
          >
            {filterOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={products}
          loading={productsLoading}
          pagination={false}
          rowKey="id"
          scroll={{ x: 800 }}
        />

        {pagination && (
          <div className="flex justify-between items-center mt-4">
            <Text type="secondary">
              Showing {((currentPage - 1) * pageSize) + 1} to{' '}
              {Math.min(currentPage * pageSize, pagination.totalItems)} of{' '}
              {pagination.totalItems} products
            </Text>
            <Pagination
              current={currentPage}
              total={pagination.totalItems}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default MultiChannelDashboard;