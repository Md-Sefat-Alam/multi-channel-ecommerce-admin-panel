import { useGetMonthlySalesQuery } from "@/app/(root)/utils/api/rootApis";
import { Card, Col, Row, Typography } from "antd";
import classNames from "classnames";
import { FaChartLine } from "react-icons/fa";

type Props = {};

export default function MonthlySales({}: Props) {
  const { Title, Text } = Typography;
  const { data, isLoading } = useGetMonthlySalesQuery();
  return (
    <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-10">
      <Card bordered={false} className="criclebox ">
        <div className="number">
          <Row align="middle" gutter={[0, 0]}>
            <Col xs={18}>
              <span className="text-gray-400">Monthly Sales</span>
              <Title level={3}>
                {data?.data.currentMonthSalesCount || 0}{" "}
                <small
                  className={classNames("font-normal text-sm", {
                    "text-red-700": (data?.data.percentageChange || 0) <= 0,
                    "text-green-700": (data?.data.percentageChange || 0) > 0,
                  })}
                >
                  {data?.data.percentageChange || 0}%
                </small>
              </Title>
            </Col>
            <Col xs={6}>
              <div className="text-5xl text-blue-700">
                <FaChartLine />
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </Col>
  );
}
