"use client";
import React, { useState } from "react";
import { Button, Col, Modal, Row } from "antd";
import HeroSetup from "../HeroSetup";
import { PlusOutlined } from "@ant-design/icons";

type Props = {};

export default function AddHeroImage({}: Props) {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Col>
      <Row justify={"end"}>
        <Button style={{}} type='primary' onClick={showModal}>
          <PlusOutlined /> Add New
        </Button>
      </Row>
      <Modal
        title='Add Hero Image'
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText={"Add"}
        width={980}
        okButtonProps={{ htmlType: "submit" }}
        footer={false}
        zIndex={9999}
      >
        <HeroSetup handleOk={handleOk} setConfirmLoading={setConfirmLoading} />
      </Modal>
    </Col>
  );
}
