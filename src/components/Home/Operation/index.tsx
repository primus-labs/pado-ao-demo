import {
  generateKey,
  getResult,
  submitTask,
  uploadData,
} from "@padolabs/pado-ao-sdk";
import { Button, Form, Input, Radio, InputNumber, Upload } from "antd";
import React, {
  useState,
  useContext,
  useEffect,
  memo,
  FC,
  useMemo,
} from "react";
import "./index.scss";
import PButton from "@/components/PButton";
import PBack from "@/components/PBack";
import iconText from "@/assets/img/iconText.svg";
import iconVideo from "@/assets/img/iconVideo.svg";
import CounterContext from "../CounterContext";

const Operation: FC = memo(() => {
  const {
    state: { shoppingData },
  } = useContext(CounterContext)!;
  const [address, setAddress] = useState<string>();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [operationType, setOperationType] = useState("create");
  const [step, setStep] = useState(1);
  const [fileList, setFileList] = useState([]);
  const [dataId, setDataId] = useState<string>();
  const [taskMsg, setTaskMsg] = useState<string>();
  const [fileData, setFileData] = useState();
  const [form1Data, setForm1Data] = useState({});
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [buyDataLoading, setBuyDataLoading] = useState<boolean>(false);

  const handleSuccess = (response, file) => {
    file.response = { status: "success" };
  };
  const beforeUpload = (file) => {
    setFileList([...fileList, file]);
    return false;
  };

  const handleConnect = async () => {
    if (address) {
      return;
    }
    try {
      await window.arweaveWallet.connect(
        // request permissions to read the active address
        ["ACCESS_ADDRESS", "SIGN_TRANSACTION"]
      );
    } catch (e) {
      console.log(e);
    } finally {
    }
    const addressTmp = await window.arweaveWallet.getActiveAddress();

    setAddress(addressTmp);
  };

  const onFinishForm1 = (values: any) => {
    console.log("The value of the form1:", values, form1.getFieldsValue()); // values 就是你的 userForm 对象
    setForm1Data({ ...form1.getFieldsValue() });
    setStep(2);
  };
  const onFinishFailedForm1 = (errorInfo: any) => {
    console.log("Form1 validation failed:", errorInfo);
  };

  const onFinishForm2 = (values: any) => {
    setCreateLoading(true);
    console.log(
      "The value of the form2:",
      values,
      form2.getFieldsValue(),
      form1.getFieldsValue(),
      form1Data
    ); // values 就是你的 userForm 对象
    try {
      const file = values.uploadFile.fileList[0].originFileObj;
      if (file) {
        const { name: fileName, size: fileSize, type: fileType } = file;
        const reader = new FileReader();

        reader.readAsArrayBuffer(file);
        reader.onload = async (e) => {
          const content = e.target.result;
          const data = new Uint8Array(content);

          // tag for the data
          const { dataType, dataName, dataDescription, dataPrice } = form1Data;
          debugger;
          let dataTag = {
            dataType,
            dataName,
            dataDescription,
            dataPrice,
            fileType,
            fileName,
            fileSize,
            ownerAddress: address,
          };

          // price for the data
          let priceInfo = {
            price: dataPrice * Math.pow(10, 3) + "",
            symbol: "AOCRED",
          };
          debugger;

          const dataId = await uploadData(
            data,
            dataTag,
            priceInfo,
            window.arweaveWallet
          );
          setDataId(dataId);
          console.log(`DATAID=${dataId}`);
          setCreateLoading(false);
          setStep(3);
        };
      }
    } catch (e) {
      console.log("onFinishForm2 e:", e);
    }
  };
  const onFinishFailedForm2 = (errorInfo: any) => {
    console.log("Form2 validation failed:", errorInfo);
  };

  const handleBack = () => {
    setStep((p) => --p);
  };
  const handleInit = () => {
    form1.resetFields();
    form2.resetFields();
    setStep(1);
  };
  async function submitTaskAndGetResult() {
    setBuyDataLoading(true);
    setTaskMsg("generate key");
    let key = await generateKey();

    setTaskMsg("submit task");
    const taskId = await submitTask(
      shoppingData.id,
      key.pk,
      window.arweaveWallet
    );
    console.log(`TASKID=${taskId}`);
    setTaskMsg("get task result");
    const [err, data] = await getResult(taskId, key.sk)
      .then((data) => {
        setTaskMsg("");
        return [null, data];
      })
      .catch((err) => {
        setTaskMsg("");
        alert(err);
        return [err, null];
      });
    console.log(`err=${err}`);
    console.log(`data=${data}`);
    //for test
    if (data) {
      setFileData(data);
      // downloadArrayBufferAsFile(data);
      setBuyDataLoading(false);
    }
  }

  function downloadArrayBufferAsFile() {
    const dataTagObj = JSON.parse(shoppingData.dataTag);
    const { fileName, fileType } = dataTagObj;
    const blob = new Blob([fileData], { type: fileType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
  const formatAddress = useMemo(() => {
    if (address) {
      const startS = address.substr(0, 7);
      const endS = address.substr(-5);
      return `${startS}...${endS}`;
    } else {
      return "";
    }
  }, [address]);
  useEffect(() => {
    setOperationType(shoppingData ? "detail" : "create");
  }, [shoppingData]);
  return (
    <div className="operationWrapper">
      <PButton
        type="text2"
        text={address ? formatAddress : "Connect Wallet"}
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
                  onFinish={onFinishForm1}
                  onFinishFailed={onFinishFailedForm1}
                  initialValues={{
                    dataType: "Text",
                    dataName: "name2",
                    dataDescription: "description2",
                    dataPrice: 0.001,
                  }}
                  requiredMark={false}
                  className="operationForm"
                >
                  <Form.Item
                    label=""
                    name="dataType"
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
                    name="dataName"
                    className="nameFormItem"
                    rules={[
                      { required: true, message: "${label} is required" },
                    ]}
                  >
                    <Input.TextArea rows={3} placeholder="File name..." />
                  </Form.Item>
                  <Form.Item
                    label="Description"
                    name="dataDescription"
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
                    name="dataPrice"
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
                  onFinish={onFinishForm2}
                  onFinishFailed={onFinishFailedForm2}
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
                      action=""
                      beforeUpload={beforeUpload}
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
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={createLoading}
                    >
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
                        <div className="value">{address}</div>
                      </li>
                      <li className="detailItem">
                        <div className="label">Data ID</div>
                        <div className="value">{dataId}</div>
                      </li>
                      <li className="detailItem">
                        <div className="label">Data Type</div>
                        <div className="value">{form1Data?.dataType}</div>
                      </li>
                      <li className="detailItem">
                        <div className="label">Data Name</div>
                        <div className="value">{form1Data?.dataName}</div>
                      </li>
                      <li className="detailItem">
                        <div className="label">Price (AO)</div>
                        <div className="value">{form1Data?.dataPrice}</div>
                      </li>
                      <li className="detailItem">
                        <div className="label">Description</div>
                        <div className="value descriptionValue">
                          {form1Data?.dataDescription}
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
                    <div className="value">{shoppingData.id}</div>
                  </li>
                  <li className="detailItem">
                    <div className="label">Data Type</div>
                    <div className="value">
                      {JSON.parse(shoppingData.dataTag).dataType}
                    </div>
                  </li>
                  <li className="detailItem">
                    <div className="label">Data Name</div>
                    <div className="value">
                      {JSON.parse(shoppingData.dataTag).dataName}
                    </div>
                  </li>

                  <li className="detailItem">
                    <div className="label">Price (AO)</div>
                    <div className="value">
                      {JSON.parse(shoppingData.dataTag).dataPrice}
                    </div>
                  </li>
                  <li className="detailItem">
                    <div className="label">Description</div>
                    <div className="value descriptionValue">
                      {JSON.parse(shoppingData.dataTag).dataDescription}
                    </div>
                  </li>
                </ul>
              </div>
              <Button
                type="primary"
                onClick={submitTaskAndGetResult}
                className="okBtn"
                loading={buyDataLoading}
              >
                Buy
              </Button>
              {fileData && (
                <Button
                  type="primary"
                  onClick={downloadArrayBufferAsFile}
                  className="okBtn"
                >
                  Download
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default Operation;
