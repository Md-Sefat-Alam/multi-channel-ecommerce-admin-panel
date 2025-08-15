"use client";
import type { GetProp, TableProps } from "antd";
import { Button, Form, Image, Popconfirm, Switch, Table } from "antd";
import type { SorterResult } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";

import { useMessageGroup } from "@/contexts/MessageGroup";
import { IsJsonString } from "@/lib/utils/Json";
import getUrl from "@/lib/utils/getUrl";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  HolderOutlined,
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
import { useRouter } from "next/navigation";
import { useContext, useMemo } from "react";
import { IHeroImageGet } from "../../SettingsType";
import {
  useFetchHeroImagesQuery,
  useUpdateActiveStatusHeroMutation,
  useUpdateSorterHeroMutation,
} from "../../api/settingsApi";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

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

export default function HeroImagesTableDraggable({ }: Props) {
  const [filters, setFilters] = useState<IGetProps>({
    start: 0,
    length: 10,
    filters: {},
    search: {},
  });
  const {
    data: heroImages,
    isLoading,
    isFetching,
  } = useFetchHeroImagesQuery(filters);

  //   Update sorter for hero images
  const [
    updateSorter,
    {
      isLoading: isLoadingSorterUpdate,
      isError: isErrorSorterUpdate,
      isSuccess: isSuccessSorterUpdate,
      error: errorSorterUpdate,
    },
  ] = useUpdateSorterHeroMutation();
  const [
    updateActiveStatus,
    {
      isLoading: isLoadingDelete,
      isError: isErrorDelete,
      isSuccess: isSuccessDelete,
      error: deleteError,
    },
  ] = useUpdateActiveStatusHeroMutation();

  const [dataSource, setDataSource] = React.useState<IHeroImageGet[] | []>([]);

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
    if (heroImages?.data?.length) {
      setDataSource([...heroImages?.data]);
    }
  }, [heroImages]);

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
          (record) => record.sorter === active?.id
        );
        const overIndex = prevState.findIndex(
          (record) => record.sorter === over?.id
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

  const columns: ColumnsType<IHeroImageGet> = [
    {
      key: "sort",
      align: "center",
      width: 80,
      render: () => <DragHandle />,
    },
    {
      title: "Title",
      dataIndex: "heroTitle",
    },
    {
      title: "Sub-Title",
      dataIndex: "subTitle",
    },
    {
      title: "Image",
      render: (_, __) => (
        <div className='flex gap-2' style={{ fontSize: "20px" }}>
          {IsJsonString(__?.images) ? (
            <Image
              src={getUrl({
                path: JSON.parse(__.images)[0]?.path,
              })}
              width={90}
              height={60}
            />
          ) : (
            <>Image Not Found!</>
          )}
        </div>
      ),
      width: "150px",
    },
    // <Tag bordered={true} color={status === 1 ? "success" : "error"}>
    //       {status === 1 ? "Active" : "Inactive"}
    //     </Tag>
    {
      title: "Active Status",
      dataIndex: "activeStatus",
      render: (status, __) => (
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          value={status}
          onChange={() => {
            updateActiveStatus({
              uuid: __.uuid,
              activeStatus: Number(!__.activeStatus) as 0 | 1,
            });
          }}
        />
      ),
      width: "150px",
    },
    {
      title: "Action",
      render: (_, __) => (
        <div className='flex gap-2' style={{ fontSize: "20px" }}>
          <Popconfirm
            title='Delete the task'
            description='Are you sure to delete this hero-image?'
            onConfirm={() => {
              updateActiveStatus({
                uuid: __.uuid,
                activeStatus: -1,
              });
            }}
            okText='Delete'
            cancelText='No'
            okButtonProps={{ loading: isLoadingDelete, danger: true }}
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
      key: "Hero_Image_delete",
      duration: 1,
      success_content: "Hero Image deleted successfully",
    });
  }, [isLoadingDelete, isErrorDelete, deleteError, isSuccessDelete]);

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
      <div className='pb-10 flex justify-between'>
        {/* <div>
          <Form
            name='basic'
            form={form}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onChange={filterChanged}
            autoComplete='off'
            onFinishFailed={(value: any) => {
              message.error(
                `${value?.errorFields?.length} field${
                  value?.errorFields?.length > 1 ? "s" : ""
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
        </div> */}
      </div>
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={dataSource.map((i) => i.sorter)}
          strategy={verticalListSortingStrategy}
        >
          <Table<IHeroImageGet>
            rowKey='sorter'
            components={{ body: { row: Row } }}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            bordered
          />
        </SortableContext>
      </DndContext>
    </div>
  );
}
