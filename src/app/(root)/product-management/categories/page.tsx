"use client";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import type { GetProp, TableProps } from "antd";
import { Button, Form, message, Popconfirm, Table, Tag } from "antd";
import Search from "antd/es/input/Search";
import type { SorterResult } from "antd/es/table/interface";
import { useEffect, useState } from "react";
import {
    useEditCategoryMutation,
    useGetCategoryQuery,
} from "./lib/api/categoryApi";
import { ICategoryGet } from "./lib/CategoryTypes";
import makeFormData from "@/lib/utils/makeFormData";
import { useRouter } from "next/navigation";

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
    const [filters, setFilters] = useState<IGetProps>({
        start: 0,
        length: 10,
        filters: {},
        search: {},
    });
    const {
        data: categoris,
        isLoading,
        isFetching,
    } = useGetCategoryQuery(filters);

    const [
        editCat,
        { isLoading: catEditLoading, isError: catIsError, isSuccess },
    ] = useEditCategoryMutation();

    const [search, setSearch] = useState<any>();
    const router = useRouter();
    const [form] = Form.useForm();
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
            pageSizeOptions: ["10", "20", "50", "100"],
        },
    });

    const handleTableChange: TableProps<ICategoryGet>["onChange"] = (
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

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setFilters({ start: 0, length: 10 });
        }
    };

    const filterChanged = (values: any) => {
        setSearch({ searchText: values });
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            const { sortField, sortOrder, filters, pagination } = tableParams;
            const params = getRandomuserParams({
                pagination: {
                    current: pagination?.current,
                    pageSize: pagination?.pageSize,
                },
                search: {
                    categoryName: form.getFieldValue("searchText") || undefined,
                    categoryNameBn:
                        form.getFieldValue("searchText") || undefined,
                    categoryDescription:
                        form.getFieldValue("searchText") || undefined,
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

    // show error message
    useEffect(() => {
        if (catIsError) {
            message.error("Something went wrong!");
        }
    }, [catIsError]);
    useEffect(() => {
        if (isSuccess) {
            message.error("Category deleted successful!");
        }
    }, [isSuccess]);

    const columns: ColumnsType<ICategoryGet> = [
        {
            title: "Category Name",
            dataIndex: "categoryName",
        },
        {
            title: "Category Name Bn",
            dataIndex: "categoryNameBn",
        },
        {
            title: "Description",
            dataIndex: "categoryDescription",
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
            render: (_, __) => (
                <div className='flex gap-2' style={{ fontSize: "20px" }}>
                    <Popconfirm
                        title='Delete Category'
                        description='Are you sure want to delete this category'
                        onConfirm={() => {
                            const formData = makeFormData({
                                uuid: __.uuid,
                                activeStatus: -1,
                            });
                            editCat({
                                uuid: __.uuid,
                                categoryName: __.categoryName,
                                activeStatus: -1,
                            });
                        }}
                        // onCancel={cancel}
                        okText='Yes'
                        cancelText='No'
                        okButtonProps={{ loading: catEditLoading }}
                    >
                        <Button loading={catEditLoading} type='primary' danger>
                            <DeleteOutlined />
                        </Button>
                    </Popconfirm>
                    <Button
                        onClick={() => {
                            router.push(
                                `/product-management/categories/${__.uuid}`
                            );
                        }}
                        type='primary'
                        style={{ fontSize: "20px" }}
                    >
                        <EyeOutlined />
                    </Button>
                    {/* <Button type="primary" style={{ fontSize: "20px" }}>
            <EyeOutlined />
          </Button> */}
                </div>
            ),
            width: "150px",
        },
    ];

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
                        onFinishFailed={(value: any) => {
                            message.error(
                                `${value?.errorFields?.length} field${value?.errorFields?.length > 1 ? "s" : ""
                                } not found`
                            );
                        }}
                    >
                        <Form.Item label='' name='searchText'>
                            <Search
                                placeholder='input search text'
                                enterButton='Search'
                                size='large'
                                loading={isLoading}
                            />
                        </Form.Item>
                    </Form>
                </div>
                <Button
                    onClick={() => {
                        router.push(
                            "/product-management/categories/create-category"
                        );
                    }}
                    type='primary'
                    size='large'
                    className='font-bold'
                >
                    Create{" "}
                    <PlusOutlined
                        style={{ fontSize: "20px", fontWeight: "bold" }}
                    />
                </Button>
            </div>
            <Table
                columns={columns}
                rowKey={(record) => record.uuid}
                dataSource={categoris?.data || []}
                pagination={{
                    ...tableParams.pagination,
                    total: categoris?.recordsTotal,
                }}
                loading={isLoading || isFetching}
                onChange={handleTableChange}
                bordered
            />
        </div>
    );
}

export default page;
