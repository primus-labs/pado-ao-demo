import "./index.scss";
import PButton from "@/components/PButton";
import { Button, Form, Input, Radio, InputNumber } from "antd";
import React, { useState } from "react";
import iconText from "@/assets/img/iconText.svg";
import iconVideo from "@/assets/img/iconVideo.svg";

type LayoutType = Parameters<typeof Form>[0]["layout"];
function Operation() {
  const [form] = Form.useForm();

  const handleConnect = () => {};
  const onFinish = (values: any) => {
    console.log("表单的值:", values); // values 就是你的 userForm 对象
    // 在这里你可以将 values 发送到后端或者进行其他处理
  };
  // 处理表单验证失败的情况
  const onFinishFailed = (errorInfo: any) => {
    console.log("表单验证失败:", errorInfo);
  };

  return (
    <div className="operationWrapper">
      <PButton
        type="text2"
        text="Connect Wallet"
        onClick={handleConnect}
        className="connectBtn"
      />
      <div className="content">
        <header>
          <h5>Share your data to earn</h5>
          <h6>Use zkFHE to ensure decentralized creator economy.</h6>
        </header>
        <Form
          layout="vertical"
          form={form}
          name="userForm"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ type: "Text" }}
          className="operationForm"
        >
          <Form.Item
            label=""
            name="type"
            className="typeFormItem"
            rules={[{ required: true, message: "${label} is required" }]}
          >
            <Radio.Group>
              <Radio.Button value="Text">
                <div className="typeWrapper">
                  <img src={iconText} alt="" className="typeIcon" />
                  <span className="typeText">Text</span>
                </div>
              </Radio.Button>
              <Radio.Button value="Video">
                <div className="typeWrapper">
                  <img src={iconVideo} alt="" />
                  <span>Video</span>
                </div>
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            className="nameFormItem"
            rules={[{ required: true, message: "${label} is required" }]}
          >
            <Input.TextArea rows={3} placeholder="File name..." />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            className="descriptionFormItem"
            rules={[{ required: true, message: "${label} is required" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Please include the key info of your file..."
            />
          </Form.Item>
          <Form.Item
            label="Price (AO)"
            name="price"
            className="priceFormItem"
            rules={[
              { required: true, message: "${label} is required" },
              { type: "number", min: 0.001 },
            ]}
          >
            <InputNumber placeholder="1.234" min="0" step="0.001" />
          </Form.Item>
          <Form.Item className="submitBtnFormItem">
            <Button type="primary" htmlType="submit">
              Next
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Operation;
