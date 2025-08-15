import { Button, DatePicker, Modal, TimeRangePickerProps } from "antd";
import dayjs from "dayjs";
import React, { Dispatch, SetStateAction, useState } from "react";
import { CiCalendarDate } from "react-icons/ci";
const { RangePicker } = DatePicker;

type Props = {
  setSelectedDate: Dispatch<SetStateAction<[dayjs.Dayjs, dayjs.Dayjs]>>;
  selectedDate: [dayjs.Dayjs, dayjs.Dayjs];
};
const DashboardSalesDatePicker: React.FC<Props> = ({
  selectedDate,
  setSelectedDate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const disableFutureDates = (current: dayjs.Dayjs) => {
    return current && current.isAfter(dayjs().endOf("day"));
  };

  const rangePresets: TimeRangePickerProps["presets"] = [
    { label: "Today", value: [dayjs(), dayjs()] },
    { label: "Yesterday", value: [dayjs().add(-1, "d"), dayjs().add(-1, "d")] },
    { label: "Last Week", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "Last 2 Weeks", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "Last Month", value: [dayjs().add(-30, "d"), dayjs()] },
    { label: "Last 3 Months", value: [dayjs().add(-90, "d"), dayjs()] },
    { label: "Last 6 Months", value: [dayjs().add(-(90 * 2), "d"), dayjs()] },
    { label: "Last Year", value: [dayjs().add(-365, "d"), dayjs()] },
  ];

  return (
    <>
      <Button
        style={{
          padding: 0,
          margin: 0,
          fontSize: "25px",
        }}
        type="text"
        size="small"
        onClick={showModal}
      >
        <CiCalendarDate className="text-cyan-700" />
      </Button>
      <Modal
        title="Sales Date Range"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={400}
      >
        <br />
        <p>Select sales date range</p>
        <RangePicker
          onChange={(e) => {
            setSelectedDate(e as any);
            handleOk();
          }}
          presets={rangePresets}
          value={selectedDate}
          disabledDate={disableFutureDates}
          size="large"
        />
        <br />
        <br />
      </Modal>
    </>
  );
};

export default DashboardSalesDatePicker;
