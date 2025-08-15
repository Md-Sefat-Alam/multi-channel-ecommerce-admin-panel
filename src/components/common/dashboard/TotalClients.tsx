import {
  useGetMonthlySalesQuery,
  useGetTotalClientsQuery,
} from "@/app/(root)/utils/api/rootApis";
import { Card, Col, Row, Typography } from "antd";
import { FcSalesPerformance } from "react-icons/fc";
import { IoPeopleSharp } from "react-icons/io5";

type Props = {};

export default function TotalClients({}: Props) {
  const { Title, Text } = Typography;
  const { data, isLoading } = useGetTotalClientsQuery();
  return (
    <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-10">
      <Card bordered={true} className="criclebox ">
        <div className="number">
          <Row align="middle" gutter={[0, 0]}>
            <Col xs={18}>
              <span className="text-gray-400">Total Customers</span>
              <Title level={3}>{data?.data.totalClientsCount || 0}</Title>
            </Col>
            <Col xs={6}>
              <div className="text-4xl text-green-700 flex justify-center items-center">
                <IoPeopleSharp />
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </Col>
  );
}
