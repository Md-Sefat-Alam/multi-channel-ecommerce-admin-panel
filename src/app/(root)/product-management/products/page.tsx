"use client";
import TK from "@/components/common/TK";
import { useMessageGroup } from "@/contexts/MessageGroup";
import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import type { GetProp, TableProps } from "antd";
import { Button, Form, Popconfirm, Table, Tag, Tooltip } from "antd";
import Search from "antd/es/input/Search";
import type { SorterResult } from "antd/es/table/interface";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSync } from "react-icons/fa";
import {
  useDeleteProductMutation,
  useGetProductQuery,
} from "./lib/api/productsApi";
import UpdateDiscountModal from "./lib/modals/UpdateDiscountModal";
import UpdatePriceModal from "./lib/modals/UpdatePriceModal";
import UpdateStockModal from "./lib/modals/UpdateStockModal";
import { IGetProducts } from "./lib/ProductTypes";
import classNames from "classnames";

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

function page() {
  const router = useRouter();
  const [filters, setFilters] = useState<IGetProps>({
    start: 0,
    length: 10,
    filters: {},
    search: {},
  });

  const [form] = Form.useForm();
  const [search, setSearch] = useState<any>();
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      pageSizeOptions: ["10", "20", "50", "100"],
    },
  });

  const { data, isLoading, isFetching, refetch } = useGetProductQuery(filters);

  console.log({ data });

  const [
    deleteProduct,
    {
      isLoading: deleteLoading,
      isError: deleteIsError,
      error: deleteError,
      isSuccess: deleteSuccess,
    },
  ] = useDeleteProductMutation();
  const { notify } = useMessageGroup();

  const handleTableChange: TableProps<IGetProducts>["onChange"] = (
    pagination,
    filters,
    sorter,
  ) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });
  };

  const confirm = (record: IGetProducts) => {
    deleteProduct({ uuid: record.uuid });
  };
  useEffect(() => {
    notify({
      isError: deleteIsError,
      isLoading: deleteLoading,
      isSuccess: deleteSuccess,
      key: "Product_delete",
      duration: 1,
      success_content: "Product deleted successfully",
    });
  }, [deleteLoading, deleteIsError, deleteError, deleteSuccess]);

  const columns: ColumnsType<IGetProducts> = [
    {
      title: "Title",
      dataIndex: "title",
      // sorter: true,
    },
    {
      title: "Title(Bangla)",
      dataIndex: "titleBn",
      // sorter: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      render(value, record, index) {
        return (
          <div className='flex gap-2 justify-end items-center'>
            <TK end value={value || 0} />
            <UpdatePriceModal
              price={Number(Number(value).toFixed(2))}
              uuid={record.uuid}
            />
          </div>
        );
      },
      align: "right",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      render(value, record, index) {
        return (
          <div className='flex gap-2 justify-end items-center'>
            <span>{Number(value || 0).toFixed(2)}%</span>
            <UpdateDiscountModal
              discount={Number(Number(value).toFixed(2))}
              uuid={record.uuid}
            />
          </div>
        );
      },
      align: "right",
    },
    {
      title: "Final Price",
      dataIndex: "finalPrice",
      render(value, record, index) {
        return (
          <div className={classNames("flex gap-2 justify-end items-center")}>
            <TK end value={value || 0} />
          </div>
        );
      },
      align: "right",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      render(value, record, index) {
        return (
          <div className={classNames("flex gap-2 justify-end items-center")}>
            <span>{value || 0}</span>
            <UpdateStockModal
              stock={Number(Number(value).toFixed(0))}
              uuid={record.uuid}
            />
          </div>
        );
      },
      align: "right",
    },
    {
      title: "Category",
      dataIndex: "category",
      render(value, record, index) {
        return <span>{value?.categoryName || ""}</span>;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render(value) {
        return (
          <span>{value ? dayjs(value).format("MMMM D, YYYY h:mm A") : ""}</span>
        );
      },
    },
    {
      title: "Active Status",
      dataIndex: "activeStatus",
      render: (status) => (
        <Tag bordered={true} color={status === 1 ? "success" : "error"}>
          {status === 1 ? "Active" : "Inactive"}
        </Tag>
      ),
      width: "150px",
    },
    {
      title: "Action",
      render: (_, record, index) => (
        <div className='flex gap-2' style={{ fontSize: "20px" }}>
          <Popconfirm
            title='Delete the task'
            description='Are you sure to delete this product?'
            onConfirm={() => {
              confirm(record);
            }}
            okText='Yes'
            cancelText='No'
            okButtonProps={{ loading: deleteLoading }}
          >
            <Button loading={deleteLoading} type='primary' danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
          <Button
            onClick={() => {
              router.push(`/product-management/products/${record.uuid}`);
            }}
            type='primary'
            style={{ fontSize: "20px" }}
          >
            <EyeOutlined />
          </Button>
        </div>
      ),
      width: "150px",
    },
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      const { sortField, sortOrder, filters, pagination } = tableParams;
      const params = getRandomuserParams({
        pagination: {
          current: pagination?.current,
          pageSize: pagination?.pageSize,
        },
        search: {
          title: form.getFieldValue("searchText") || undefined,
          subTitle: form.getFieldValue("searchText") || undefined,
          tags: form.getFieldValue("searchText") || undefined,
          category: form.getFieldValue("searchText") || undefined,
        },
        sortField,
        sortOrder,
        filters,
      });

      console.log({ params });

      setFilters(params);
    }, 400);

    return () => clearTimeout(handler);
  }, [tableParams, search]);

  const filterChanged = (values: any) => {
    setSearch({ searchText: values });
  };

  return (
    <div>
      <div className='pb-10 flex justify-between'>
        <div>
          <Form
            name='basic'
            form={form}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onChange={filterChanged}
            autoComplete='off'
          >
            <Form.Item label='' name='searchText'>
              <Tooltip
                placement='bottom'
                title='Searching on title, subTitle, tags, category'
              >
                <Search
                  placeholder='input search text'
                  enterButton='Search'
                  size='large'
                  loading={isLoading || isFetching}
                  allowClear
                />
              </Tooltip>
            </Form.Item>
          </Form>
        </div>
        <div className='flex gap-2'>
          <Button
            size='large'
            type='dashed'
            onClick={() => {
              refetch();
            }}
          >
            <FaSync />
          </Button>

          <Link href={"/product-management/products/create-product"}>
            <Button type='primary' size='large' className='font-bold'>
              Create{" "}
              <PlusOutlined style={{ fontSize: "20px", fontWeight: "bold" }} />
            </Button>
          </Link>
        </div>
      </div>
      <Table
        columns={columns}
        rowKey={(record) => record.uuid}
        dataSource={data?.data}
        pagination={{
          ...tableParams.pagination,
          total: data?.recordsTotal,
        }}
        loading={isLoading || isFetching}
        onChange={handleTableChange}
        rowClassName={(record) => {
          if (
            record?.lowStockAlert &&
            record?.stock &&
            record?.stock <= record?.lowStockAlert
          )
            return "bg-red-100 rounded-md";
          return "";
        }}
        bordered
      />
    </div>
  );
}

export default page;
