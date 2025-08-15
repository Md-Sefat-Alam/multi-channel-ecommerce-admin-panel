"use client";
import type { GetProp, TableProps } from "antd";
import { Button, Form, Switch, Table, Tag } from "antd";
import type { SorterResult } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";

import { useUpdateActiveStatusHeroMutation } from "@/app/(root)/settings/lib/api/settingsApi";
import { useMessageGroup } from "@/contexts/MessageGroup";
import {
  CheckOutlined,
  CloseOutlined,
  HolderOutlined
} from "@ant-design/icons";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useContext, useMemo } from "react";
import { useFeaturedProductUpdaterMutation, useGetFeaturedProductsQuery, useUpdateSorterFeaturedProductsMutation } from "../api/featuredProductsApi";
import { IGetProducts } from "../../../products/lib/ProductTypes";


interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}

const RowContext = React.createContext<RowContextProps>({});

const DragHandle: React.FC = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type='text'
      size='small'
      icon={<HolderOutlined />}
      style={{ cursor: "move" }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

const Row: React.FC<RowProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props["data-row-key"] });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners]
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

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

interface Props { }

export default function FeaturedProductsTableDraggable({ }: Props) {
  const [filters, setFilters] = useState<IGetProps>({
    start: 0,
    length: 10,
    filters: {},
    search: {},
  });

  const { data: featuredProducts, isLoading, isFetching } = useGetFeaturedProductsQuery(filters);

  //   Update sorter for hero images
  const [
    updateSorter,
    {
      isLoading: isLoadingSorterUpdate,
      isError: isErrorSorterUpdate,
      isSuccess: isSuccessSorterUpdate,
      error: errorSorterUpdate,
    },
  ] = useUpdateSorterFeaturedProductsMutation();

  const [
    addRemoveFeaturedProducts,
    {
      isLoading: isLoadingFeaturedUpdater,
      isError: isErrorFeaturedUpdater,
      isSuccess: isSuccessFeaturedUpdater,
      error: featuredUpdaterError,
    },
  ] = useFeaturedProductUpdaterMutation();

  const [dataSource, setDataSource] = React.useState<IGetProducts[] | []>([]);

  const [updateSorterState, setUpdateSorterState] = useState<number>(0);
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

  useEffect(() => {
    if (featuredProducts?.data?.length) {
      setDataSource([...featuredProducts?.data]);
    }
  }, [featuredProducts]);

  useEffect(() => {
    if (dataSource?.length) {
      const sorted = dataSource?.map((item, index) => ({
        uuid: item?.uuid,
        sorter: index + 1,
      }));
      updateSorter(sorted);
    }
  }, [updateSorterState]);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((prevState) => {
        const activeIndex = prevState.findIndex(
          (record) => record.featuredSortOrder === active?.id
        );
        const overIndex = prevState.findIndex(
          (record) => record.featuredSortOrder === over?.id
        );
        return arrayMove(prevState, activeIndex, overIndex);
      });
      setUpdateSorterState(Math.random());
    }
  };

  //   const handleTableChange: TableProps<IHeroImageGet>["onChange"] = (
  //     pagination,
  //     filters,
  //     sorter
  //   ) => {
  //     setTableParams({
  //       pagination,
  //       filters,
  //       sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
  //       sortField: Array.isArray(sorter) ? undefined : sorter.field,
  //     });

  //     // `dataSource` is useless since `pageSize` changed
  //     if (pagination.pageSize !== tableParams.pagination?.pageSize) {
  //       setFilters({ start: 0, length: 10 });
  //     }
  //   };

  //   const filterChanged = (values: any) => {
  //     setSearch({ searchText: values });
  //   };

  //   useEffect(() => {
  //     const handler = setTimeout(() => {
  //       const { sortField, sortOrder, filters, pagination } = tableParams;
  //       const params = getRandomuserParams({
  //         pagination: {
  //           current: pagination?.current,
  //           pageSize: pagination?.pageSize,
  //         },
  //         search: {
  //           title: form.getFieldValue("searchText") || undefined,
  //         },
  //         sortField,
  //         sortOrder,
  //         filters,
  //       });

  //       setFilters(params);
  //     }, 400);

  //     return () => clearTimeout(handler);
  //   }, [tableParams, search]);

  const columns: ColumnsType<IGetProducts> = [
    {
      title: "Sorter",
      key: "sort",
      align: "center",
      width: 80,
      render: () => <DragHandle />,
    },
    {
      title: "Featured Product?",
      render: (_, record, index) => (
        <div className='flex gap-2' style={{ fontSize: "20px" }}>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={record.isFeaturedProduct}
            onChange={() => {
              addRemoveFeaturedProducts({ uuid: record.uuid })
            }}
          />
        </div>
      ),
      width: "150px",
    },
    {
      title: "Title",
      dataIndex: "title",
      // sorter: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      // sorter: true,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      // sorter: true,
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
          <span>
            {value
              ? dayjs(value).format("MMMM D, YYYY h:mm A")
              : ""}
          </span>
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

  ];
  const columnsAllProducts: ColumnsType<IGetProducts> = [
    {
      title: "Featured Product?",
      render: (_, record, index) => (
        <div className='flex gap-2' style={{ fontSize: "20px" }}>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={record.isFeaturedProduct}
            onChange={() => {
              addRemoveFeaturedProducts({ uuid: record.uuid })
            }}
          />
        </div>
      ),
      width: "150px",
    },
    {
      title: "Title",
      dataIndex: "title",
      // sorter: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      // sorter: true,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      // sorter: true,
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
          <span>
            {value
              ? dayjs(value).format("MMMM D, YYYY h:mm A")
              : ""}
          </span>
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

  ];

  useEffect(() => {
    notify({
      isError: isErrorFeaturedUpdater,
      isLoading: isLoadingFeaturedUpdater,
      isSuccess: isSuccessFeaturedUpdater,
      key: "Hero_Image_delete",
      duration: 1,
      success_content: "Hero Image deleted successfully",
    });
  }, [isLoadingFeaturedUpdater, isErrorFeaturedUpdater, featuredUpdaterError, isSuccessFeaturedUpdater]);

  useEffect(() => {
    notify({
      isError: isErrorSorterUpdate,
      isLoading: isLoadingSorterUpdate,
      isSuccess: isSuccessSorterUpdate,
      error: errorSorterUpdate,
      key: "Hero_Image_Sorter_Update",
      duration: 1,
      success_content: "Sorter Updated!",
    });
  }, [
    isErrorSorterUpdate,
    isLoadingSorterUpdate,
    isSuccessSorterUpdate,
    errorSorterUpdate,
  ]);

  return (
    <div>
      <h3 className="text-xl font-bold py-3 mt-1">Featured Products</h3>
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={dataSource.map((i) => i.featuredSortOrder)}
          strategy={verticalListSortingStrategy}
        >
          <Table<IGetProducts>
            rowKey='featuredSortOrder'
            components={{ body: { row: Row } }}
            columns={columns}
            dataSource={dataSource.filter(item => item.isFeaturedProduct)}
            pagination={false}
            loading={isLoading || isFetching}
            bordered
          />
        </SortableContext>
      </DndContext>
      <h3 className="text-xl font-bold py-3 mt-6">Add To Featured Products</h3>
      <Table<IGetProducts>
        rowKey='featuredSortOrder'
        components={{ body: { row: Row } }}
        columns={columnsAllProducts}
        dataSource={dataSource.filter(item => !item.isFeaturedProduct)}
        pagination={false}
        loading={isLoading || isFetching}
        bordered
      />
    </div>
  );
}
