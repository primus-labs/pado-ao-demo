import "./index.scss";
import PButton from "@/components/PButton";

import { Button, Form, Input, Radio, InputNumber, Upload } from "antd";
import React, { useState, useContext } from "react";
import PBack from "@/components/PBack";
import iconText from "@/assets/img/iconText.svg";
import iconVideo from "@/assets/img/iconVideo.svg";
import CounterContext from "../CounterContext";

type LayoutType = Parameters<typeof Form>[0]["layout"];
function Operation() {
  const {
    state: { shoppingId },
    setShoppingId,
  } = useContext(CounterContext)!;
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [operationType, setOperationType] = useState("create");
  const [step, setStep] = useState(3);
  const [fileList, setFileList] = useState([]);

  // 模拟上传成功后的处理函数
  const handleSuccess = (response, file) => {
    // 这里通常处理服务器返回的数据，但因为我们不实际上传，所以可以忽略response
    file.response = { status: "success" }; // 模拟成功状态
    // 假设你需要更新fileList，但实际上由于我们没有发送请求，这里可以不做任何处理
  };
  // 自定义的beforeUpload函数，这里我们阻止实际的上传行为
  const beforeUpload = (file) => {
    debugger;
    // 这里只是简单地将文件添加到fileList中，而不实际发送文件到服务器
    setFileList([...fileList, file]);
    // 阻止Upload组件的默认上传行为
    return false;
  };

  const handleConnect = () => {};
  const onFinish = (values: any) => {
    console.log("表单的值:", values, form1.getFieldsValue()); // values 就是你的 userForm 对象
    setStep(2);
    // 在这里你可以将 values 发送到后端或者进行其他处理
  };
  // 处理表单验证失败的情况
  const onFinishFailed = (errorInfo: any) => {
    console.log("表单验证失败:", errorInfo);
  };
  const onFinish2 = (values: any) => {
    console.log("表单的值:", values, form2.getFieldsValue()); // values 就是你的 userForm 对象
    setStep(3);
    // 在这里你可以将 values 发送到后端或者进行其他处理
  };
  // 处理表单验证失败的情况
  const onFinishFailed2 = (errorInfo: any) => {
    console.log("表单验证失败:", errorInfo);
  };
  const handleBack = () => {
    setStep((p) => --p);
  };
  const handleInit = () => {
    form1.resetFields();
    form2.resetFields();
    setStep(1);
  };
  const handleBuy = () => {
    
  }
  return (
    <div className="operationWrapper">
      <PButton
        type="text2"
        text="Connect Wallet"
        onClick={handleConnect}
        className="connectBtn"
      />
      <div className="content">
        {operationType === "create" && (
          <>
            {step === 1 && (
              <>
                <header>
                  <h5>Share your data to earn</h5>
                  <h6>Use zkFHE to ensure decentralized creator economy.</h6>
                </header>
                <Form
                  layout="vertical"
                  form={form1}
                  name="userForm"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  initialValues={{ type: "Text" }}
                  requiredMark={false}
                  className="operationForm"
                >
                  <Form.Item
                    label=""
                    name="type"
                    className="typeFormItem"
                    rules={[
                      { required: true, message: "${label} is required" },
                    ]}
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
                    rules={[
                      { required: true, message: "${label} is required" },
                    ]}
                  >
                    <Input.TextArea rows={3} placeholder="File name..." />
                  </Form.Item>
                  <Form.Item
                    label="Description"
                    name="description"
                    className="descriptionFormItem"
                    rules={[
                      { required: true, message: "${label} is required" },
                    ]}
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
              </>
            )}
            {step === 2 && (
              <>
                <PBack onBack={handleBack} withLabel />
                <Form
                  layout="vertical"
                  form={form2}
                  name="userForm2"
                  onFinish={onFinish2}
                  onFinishFailed={onFinishFailed2}
                  requiredMark={false}
                  className="operationForm operationForm2"
                >
                  <Form.Item
                    label="Upload File"
                    name="uploadFile"
                    className="uploadFileFormItem"
                    rules={[
                      { required: true, message: "${label} is required" },
                    ]}
                  >
                    <Upload
                      name="uFile"
                      maxCount={1}
                      action="" // 可以留空或者是一个返回Promise的模拟函数
                      beforeUpload={beforeUpload}
                      onChange={(info) => {
                        // if (info.file.status !== "uploading") {
                        //   console.log(info.file, info.fileList);
                        // }
                        // if (info.file.status === "done") {
                        //   message.success(`${info.file.name} 上传成功`);
                        // } else if (info.file.status === "error") {
                        //   message.error(`${info.file.name} 上传失败`);
                        // }
                      }}
                      onSuccess={handleSuccess}
                      fileList={fileList}
                    >
                      <PButton
                        type="icon"
                        icon={<i className="iconfont icon-iconUpload"></i>}
                        onClick={() => {}}
                        stopPropagation={false}
                        className="uploadBtn"
                      ></PButton>
                      <p>Click to browse or drag and drop your file</p>
                    </Upload>
                  </Form.Item>
                  <Form.Item className="submitBtnFormItem submitBtnFormItem2">
                    <Button type="primary" htmlType="submit">
                      Encrypt & send to Arweave
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}
            {step === 3 && (
              <>
                <PBack onBack={handleBack} withLabel />
                <div className="details">
                  <div className="detailsCon">
                    <div className="tip">
                      <i className="iconfont icon-iconResultSuc"></i>
                      <p>Send to Arweave successfully!</p>
                    </div>
                    <h5 className="detailsTitle">Details</h5>
                    <ul className="detailItems">
                      <li className="detailItem">
                        <div className="label">Owner</div>
                        <div className="value">
                          vl4VbEYIab4HmxkzOg7U-H2DFe-gBV_3Uh8V9bwvuOY
                        </div>
                      </li>
                      <li className="detailItem">
                        <div className="label">Data ID</div>
                        <div className="value">
                          vl4VbEYIab4HmxkzOg7U-H2DFe-gBV_3Uh8V9bwvuOY
                        </div>
                      </li>
                      <li className="detailItem">
                        <div className="label">Data Type</div>
                        <div className="value">
                          vl4VbEYIab4HmxkzOg7U-H2DFe-gBV_3Uh8V9bwvuOY
                        </div>
                      </li>
                      <li className="detailItem">
                        <div className="label">Data Name</div>
                        <div className="value">
                          vl4VbEYIab4HmxkzOg7U-H2DFe-gBV_3Uh8V9bwvuOY
                        </div>
                      </li>
                      <li className="detailItem">
                        <div className="label">Data Type</div>
                        <div className="value">
                          vl4VbEYIab4HmxkzOg7U-H2DFe-gBV_3Uh8V9bwvuOY
                        </div>
                      </li>
                      <li className="detailItem">
                        <div className="label">Price (AO)</div>
                        <div className="value">
                          vl4VbEYIab4HmxkzOg7U-H2DFe-gBV_3Uh8V9bwvuOY
                        </div>
                      </li>
                      <li className="detailItem">
                        <div className="label">Description</div>
                        <div className="value descriptionValue">
                          vl4VbEYIab4HmxkzOg7U-H2DFe-gBV_3Uh8V9bwvuOY
                        </div>
                      </li>
                    </ul>
                  </div>

                  <Button type="primary" onClick={handleInit} className="okBtn">
                    OK
                  </Button>
                </div>
              </>
            )}
          </>
        )}
        {operationType === "detail" && (
          <>
            <PBack onBack={handleBack} withLabel />
            <div className="details">
              <div className="detailsCon">
                <div className="tip">
                  <i className="iconfont icon-iconResultSuc"></i>
                  <p>Send to Arweave successfully!</p>
                </div>
                <h5 className="detailsTitle">Details</h5>
                <ul className="detailItems">
                  <li className="detailItem">
                    <div className="label">Owner</div>
                    <div className="value">
                      vl4VbEYIab4HmxkzOg7U-H2DFe-gBV_3Uh8V9bwvuOY
                    </div>
                  </li>
                  <li className="detailItem">
                    <div className="label">Data ID</div>
                    <div className="value">
                      vl4VbEYIab4HmxkzOg7U-H2DFe-gBV_3Uh8V9bwvuOY
                    </div>
                  </li>
                  <li className="detailItem">
                    <div className="label">Data Type</div>
                    <div className="value">
                      vl4VbEYIab4HmxkzOg7U-H2DFe-gBV_3Uh8V9bwvuOY
                    </div>
                  </li>
                  <li className="detailItem">
                    <div className="label">Data Name</div>
                    <div className="value">
                      vl4VbEYIab4HmxkzOg7U-H2DFe-gBV_3Uh8V9bwvuOY
                    </div>
                  </li>
                  <li className="detailItem">
                    <div className="label">Data Type</div>
                    <div className="value">
                      vl4VbEYIab4HmxkzOg7U-H2DFe-gBV_3Uh8V9bwvuOY
                    </div>
                  </li>
                  <li className="detailItem">
                    <div className="label">Price (AO)</div>
                    <div className="value">
                      vl4VbEYIab4HmxkzOg7U-H2DFe-gBV_3Uh8V9bwvuOY
                    </div>
                  </li>
                  <li className="detailItem">
                    <div className="label">Description</div>
                    <div className="value descriptionValue">
                      vl4VbEYIab4HmxkzOg7U-H2DFe-gBV_3Uh8V9bwvuOY
                    </div>
                  </li>
                </ul>
              </div>
              <Button type="primary" onClick={handleBuy} className="okBtn">
                Buy
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Operation;
