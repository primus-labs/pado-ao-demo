import {
  generateKey,
  getResult,
  submitTask,
  uploadData,
} from "@padolabs/pado-ao-sdk";
import { Button, Form, Input, Radio, InputNumber, Upload } from "antd";
import { UploadFile } from "antd/lib/upload";
import { useState, useContext, useEffect, memo, FC, useMemo } from "react";
import "./index.scss";
import PButton from "@/components/PButton";
import PBack from "@/components/PBack";
import iconText from "@/assets/img/iconText.svg";
import iconVideo from "@/assets/img/iconVideo.svg";
import CounterContext from "../CounterContext";

const Operation: FC = memo(() => {
  const {
    state: { shoppingData },
    setShoppingData,
    setOwnerAddress,
    setMarketDataListAsync,
  } = useContext(CounterContext)!;
  const [address, setAddress] = useState<string>();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [operationType, setOperationType] = useState("create");
  const [step, setStep] = useState(1);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [dataId, setDataId] = useState<string>();
  const [taskMsg, setTaskMsg] = useState<string>();
  const [fileData, setFileData] = useState<any>();
  const [form1Data, setForm1Data] = useState<{
    dataType?: string;
    dataName?: string;
    dataDescription?: string;
    dataPrice?: number;
  }>({});
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  // const [buyDataLoading, setBuyDataLoading] = useState<boolean>(false);

  const formatSize = (fileSize: number) => {
    const kbNum = fileSize / 1024;
    if (kbNum < 1024) {
      return kbNum.toFixed(2) + "KB";
    } else {
      const mNum = kbNum / 1024;
      if (mNum < 1024) {
        return mNum.toFixed(2) + "M";
      } else {
        const gNum = mNum / 1024;
        return gNum.toFixed(2) + "G";
      }
    }
  };

  const beforeUpload = (file: UploadFile) => {
    setFileList([...fileList, file]);
    return false;
  };
  const handleRemove = () => {
    form2.resetFields();
    setFileList([]);
    setFileData(undefined);
    return true;
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
      console.log("handleConnect error:", e);
    } finally {
    }
    const addressTmp = await window.arweaveWallet.getActiveAddress();

    setAddress(addressTmp);
    setOwnerAddress(addressTmp);
  };

  const onFinishForm1 = (values: any) => {
    if (!address) {
      alert("Please connect the wallet first");
      return;
    }
    console.log("The value of the form1:", values, form1.getFieldsValue()); // values 就是你的 userForm 对象
    setForm1Data({ ...form1.getFieldsValue() });
    setStep(2);
  };
  const onFinishFailedForm1 = (errorInfo: any) => {
    console.log("Form1 validation failed:", errorInfo);
  };

  const onFinishForm2 = (values: any) => {
    if (fileList.length <= 0) {
      return;
    }
    setCreateLoading(true);
    console.log(
      "The value of the form2:",
      values,
      form2.getFieldsValue(),
      form1.getFieldsValue(),
      form1Data
    );
    try {
      const file = values.uploadFile.fileList[0].originFileObj;
      if (file) {
        const { name: fileName, size: fileSize, type: fileType } = file;
        const reader = new FileReader();

        reader.readAsArrayBuffer(file);
        reader.onload = async (e: any) => {
          const content = e.target.result;
          const data = new Uint8Array(content);

          // tag for the data
          const { dataType, dataName, dataDescription, dataPrice } = form1Data;

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
            price: (dataPrice as number) * Math.pow(10, 3) + "",
            symbol: "AOCRED",
          };
          const dataId = await uploadData(
            data,
            dataTag,
            priceInfo,
            window.arweaveWallet
          );
          setMarketDataListAsync();
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
    setShoppingData({});
    form1.resetFields();
    form2.resetFields();
    setStep(1);
  };
  async function submitTaskAndGetResult() {
    if (!address) {
      alert("Please connect the wallet first");
      return;
    }
    setStep(2);
    // setBuyDataLoading(true);
    try {
      setTaskMsg("generate key...");
      let key = await generateKey();

      setTaskMsg("submit task...");
      const taskId = await submitTask(
        shoppingData.id,
        key.pk,
        window.arweaveWallet
      );
      console.log(`TASKID=${taskId}`);
      setTaskMsg("get task result...");
      const [err, data] = await getResult(taskId, key.sk)
        .then((data) => {
          setTaskMsg("");
          setTaskMsg("BuyFinished");
          return [null, data];
        })
        .catch((err) => {
          setTaskMsg(`error: ${err}`);
          alert(err);
          return [err, null];
        });
      
      console.log(`err=${err}`);
      console.log(`data=${data}`);
      //for test
      if (data) {
        setFileData(data);
        // downloadArrayBufferAsFile(data);
        // setBuyDataLoading(false);
      }
    } catch (e) {
      console.log("submitTaskAndGetResult error: ", e);
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
    setOperationType(shoppingData?.id ? "detail" : "create");
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
                      onRemove={handleRemove}
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
            {step === 1 && (
              <>
                <PBack onBack={handleInit} withLabel />
                <div className="details">
                  <div className="detailsCon">
                    <h5 className="detailsTitle">Details</h5>
                    <ul className="detailItems">
                      <li className="detailItem">
                        <div className="label">Owner</div>
                        <div className="value">
                          {shoppingData.dataTag &&
                            JSON.parse(shoppingData.dataTag).ownerAddress}
                        </div>
                      </li>
                      <li className="detailItem">
                        <div className="label">Data ID</div>
                        <div className="value">{shoppingData.id}</div>
                      </li>
                      <li className="detailItem">
                        <div className="label">Data Type</div>
                        <div className="value">
                          {shoppingData.dataTag &&
                            JSON.parse(shoppingData.dataTag).dataType}
                        </div>
                      </li>
                      <li className="detailItem">
                        <div className="label">Data Name</div>
                        <div className="value">
                          {shoppingData.dataTag &&
                            JSON.parse(shoppingData.dataTag).dataName}
                        </div>
                      </li>

                      <li className="detailItem">
                        <div className="label">Price (AO)</div>
                        <div className="value">
                          {shoppingData.dataTag &&
                            JSON.parse(shoppingData.dataTag).dataPrice}
                        </div>
                      </li>
                      <li className="detailItem">
                        <div className="label">Description</div>
                        <div className="value descriptionValue">
                          {shoppingData.dataTag &&
                            JSON.parse(shoppingData.dataTag).dataDescription}
                        </div>
                      </li>
                    </ul>
                  </div>
                  <Button
                    type="primary"
                    onClick={submitTaskAndGetResult}
                    className="okBtn"
                  >
                    Buy
                  </Button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <PBack onBack={handleBack} withLabel />
                <div className="buyProcess">
                  {fileData ? (
                    <div className="fileDesc">
                      <div className="name">
                        <i className="iconfont icon-iconUploadFile"></i>
                        <span>{JSON.parse(shoppingData.dataTag).fileName}</span>
                      </div>
                      <div className="size">
                        {formatSize(JSON.parse(shoppingData.dataTag).fileSize)}
                      </div>
                    </div>
                  ) : (
                    <div className="processDesc">{taskMsg}</div>
                  )}

                  <Button
                    type="primary"
                    onClick={downloadArrayBufferAsFile}
                    className="okBtn"
                    disabled={!fileData}
                  >
                    Download
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default Operation;
