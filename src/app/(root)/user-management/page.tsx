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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDeleteUserMutation, useGetUsersQuery } from "./lib/api/userApi";
import { IUserGet } from "./lib/UserTypes";
import { useMessageGroup } from "@/contexts/MessageGroup";

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
    } = useGetUsersQuery(filters);
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
    const { notify } = useMessageGroup();
    const [
        deleteUser,
        {
            isLoading: isLoadingDelete,
            isError: isErrorDelete,
            isSuccess: isSuccessDelete,
            error: deleteError,
        },
    ] = useDeleteUserMutation();

    const handleTableChange: TableProps<IUserGet>["onChange"] = (
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
                    fullName: form.getFieldValue("searchText") || undefined,
                    fullNameBn: form.getFieldValue("searchText") || undefined,
                    mobileNumber: form.getFieldValue("searchText") || undefined,
                    email: form.getFieldValue("searchText") || undefined,
                    nationalID: form.getFieldValue("searchText") || undefined,
                    gender: form.getFieldValue("searchText") || undefined,
                    address: form.getFieldValue("searchText") || undefined,
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

    const columns: ColumnsType<IUserGet> = [
        {
            title: "Full Name",
            dataIndex: "fullName",
        },
        // {
        //     title: "Full Name Bn",
        //     dataIndex: "fullNameBn",
        // },
        {
            title: "Mobile",
            dataIndex: "mobileNumber",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Gender",
            dataIndex: "gender",
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
                        title='Delete the task'
                        description='Are you sure to delete this user?'
                        onConfirm={() => {
                            deleteUser({ uuid: __.uuid });
                        }}
                        okText='Yes'
                        cancelText='No'
                        okButtonProps={{ loading: isLoadingDelete }}
                    >
                        <Button loading={isLoadingDelete} type='primary' danger>
                            <DeleteOutlined />
                        </Button>
                    </Popconfirm>
                    {/* <Button type="primary" style={{ fontSize: "20px" }}>
            <EditOutlined />
          </Button> */}
                    {/* <Button type="primary" style={{ fontSize: "20px" }}>
            <EyeOutlined />
          </Button> */}
                </div>
            ),
            width: "150px",
        },
    ];

    useEffect(() => {
        notify({
            isError: isErrorDelete,
            isLoading: isLoadingDelete,
            isSuccess: isSuccessDelete,
            key: "User_delete",
            duration: 1,
            success_content: "User deleted successfully",
        });
    }, [isLoadingDelete, isErrorDelete, deleteError, isSuccessDelete]);

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
                {/* <Button
          // onClick={() => {
          //   router.push("/product-management/categories/create-category");
          // }}
          type="primary"
          size="large"
          className="font-bold"
        >
          Create{" "}
          <PlusOutlined style={{ fontSize: "20px", fontWeight: "bold" }} />
        </Button> */}
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
