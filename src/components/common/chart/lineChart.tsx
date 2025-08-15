import React from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { MinusOutlined } from "@ant-design/icons";
import { useGetMonthlyMetricsQuery } from "@/app/(root)/utils/api/rootApis";

function LineChart() {
  const { Title, Paragraph } = Typography;

  // Fetch monthly data for sales and clients
  const { data, isLoading } = useGetMonthlyMetricsQuery();

  // Set default chart data if loading or no data yet
  const chartData = data?.data || {
    months: [],
    sales: [],
    clients: [],
  };

  const lineChartOptions = {
    series: [
      {
        name: "Sales",
        data: chartData.sales,
      },
      {
        name: "Clients",
        data: chartData.clients,
      },
    ],
    options: {
      chart: {
        width: "100%",
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: ["#8c8c8c"],
          },
        },
      },
      xaxis: {
        categories: chartData.months,
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: new Array(chartData.months.length).fill("#8c8c8c"),
          },
        },
      },
      tooltip: {
        y: {
          formatter: (val: any) => val,
        },
      },
    },
  };

  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>Sales & Clients Count</Title>
          {/* <Paragraph className="lastweek">
            than last week <span className="bnb2">0%</span>
          </Paragraph> */}
        </div>
        <div className="sales">
          <ul>
            <li>{<MinusOutlined />} Sales</li>
            <li>{<MinusOutlined />} Clients</li>
          </ul>
        </div>
      </div>

      {!false && (
        <ReactApexChart
          className="full-width"
          options={lineChartOptions.options as any}
          series={lineChartOptions.series}
          type="area"
          height={350}
          width={"100%"}
        />
      )}
    </>
  );
}

export default LineChart;
