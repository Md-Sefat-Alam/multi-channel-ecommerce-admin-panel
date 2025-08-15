
import { Card, Col, Row, Typography } from "antd";
import classNames from "classnames";
import { FaChartLine } from "react-icons/fa";
import { useState } from "react";
import dayjs from "dayjs";
import DashboardSalesDatePicker from "../DashboardSalesDatePicker";
import { useGetSalesCountQuery } from "@/app/(root)/utils/api/rootApis";

type Props = {};

export default function SalesCountWithDateRange({ }: Props) {
  const { Title, Text } = Typography;
  const [selectedDate, setSelectedDate] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs(),
    dayjs(),
  ]);

  const { data, isLoading } = useGetSalesCountQuery({
    dateRange: selectedDate,
  });

  const formatSelectedDate = () => {
    const [startDate, endDate] = selectedDate;
    if (startDate.isSame(endDate, "day")) {
      return startDate.format("MMMM D, YYYY"); // Show single date if same
    } else {
      return `${startDate.format("MMMM D, YYYY")} - ${endDate.format(
        "MMMM D, YYYY"
      )}`; // Show range if different
    }
  };

  return (
    <Col
      title={`${formatSelectedDate()} Sales`}
      xs={24}
      sm={24}
      md={12}
      lg={6}
      xl={6}
      className="mb-10"
    >
      <Card bordered={true} className="criclebox relative">
        <div className="number">
          <Row align="middle" gutter={[0, 0]}>
            <Col xs={18}>
              <div className="flex flex-nowrap items-center gap-1">
                <DashboardSalesDatePicker
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
                <span
                  title={`${formatSelectedDate()} Sales`}
                  className="text-gray-400 truncate"
                >
                  Sales {formatSelectedDate()}
                </span>
              </div>
              <Title level={3}>
                {data?.data.salesCount || 0}{" "}
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
              <div className="text-4xl text-cyan-700 flex justify-center items-center">
                <FaChartLine />
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </Col>
  );
}
