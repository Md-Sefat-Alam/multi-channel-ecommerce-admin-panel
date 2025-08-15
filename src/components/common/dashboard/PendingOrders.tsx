import {
  useGetMonthlySalesQuery,
  useGetTotalClientsQuery,
  usePendingOrdersCountQuery,
} from "@/app/(root)/utils/api/rootApis";
import { Card, Col, Row, Typography } from "antd";
import Link from "next/link";
import { FcSalesPerformance } from "react-icons/fc";
import { IoPeopleSharp } from "react-icons/io5";
import { MdOutlinePendingActions } from "react-icons/md";

type Props = {};

export default function PendingOrders({}: Props) {
  const { Title, Text } = Typography;
  const { data, isLoading } = usePendingOrdersCountQuery();
  return (
    <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-10">
      <Link href={"/orders"}>
        <Card bordered={true} className="criclebox ">
          <div className="number">
            <Row align="middle" gutter={[0, 0]}>
              <Col xs={18}>
                <span className="text-gray-400">Pending Orders</span>
                <Title level={3}>{data?.data.pendingOrdersCount || 0}</Title>
              </Col>
              <Col xs={6}>
                <div className="text-4xl text-cyan-700 flex justify-center items-center">
                  <MdOutlinePendingActions />
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      </Link>
    </Col>
  );
}
