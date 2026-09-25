"use client";

import { useState } from "react";

type FreezeItem = {
  type: "账号" | "地址";
  value: string;
  reason: string;
  status: "冻结" | "正常";
};

type InviterChangeItem = {
  user: string;
  currentInviter: string;
  newInviter: string;
  reason: string;
  status: "待处理" | "已通过" | "已拒绝";
};

export default function AdminRiskPage() {
  const [form, setForm] = useState({
    allowSameWalletRegister: "否",
    allowSameWalletOrder: "否",
    allowSelfReferral: "否",
    limitSameIpRegister: "是",
    maxRegisterPerIpPerDay: "3",
    limitSameDeviceRegister: "是",
    maxRegisterPerDevicePerDay: "3",
    maxPendingOrdersPerWallet: "3",
    autoFreezeRiskOrder: "是",
    autoFreezeRiskAccount: "是",
    manualReviewHighRiskOrder: "是",
  });

  const [freezeList, setFreezeList] = useState<FreezeItem[]>([
    {
      type: "地址",
      value: "0x1234...abcd",
      reason: "异常注册",
      status: "冻结",
    },
    {
      type: "账号",
      value: "user_001",
      reason: "高风险订单",
      status: "冻结",
    },
  ]);

  const [inviterChangeList, setInviterChangeList] = useState<InviterChangeItem[]>([
    {
      user: "0xaaa...111",
      currentInviter: "ABC123",
      newInviter: "XYZ888",
      reason: "原邀请人填写错误",
      status: "待处理",
    },
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFreezeChange = (
    index: number,
    field: keyof FreezeItem,
    value: string
  ) => {
    setFreezeList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addFreezeItem = () => {
    setFreezeList((prev) => [
      ...prev,
      {
        type: "地址",
        value: "",
        reason: "",
        status: "冻结",
      },
    ]);
  };

  const removeFreezeItem = (index: number) => {
    setFreezeList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInviterChange = (
    index: number,
    field: keyof InviterChangeItem,
    value: string
  ) => {
    setInviterChangeList((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addInviterChangeItem = () => {
    setInviterChangeList((prev) => [
      ...prev,
      {
        user: "",
        currentInviter: "",
        newInviter: "",
        reason: "",
        status: "待处理",
      },
    ]);
  };

  const removeInviterChangeItem = (index: number) => {
    setInviterChangeList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    console.log("风控设置：", form);
    console.log("冻结列表：", freezeList);
    console.log("修改邀请人列表：", inviterChangeList);
    alert("风控设置已保存（当前是演示页面，后面会接数据库）");
  };

  return (
    <div style={{ color: "#fff" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>风控设置</h1>
        <p style={{ color: "#94a3b8" }}>
          这里配置钱包、IP、设备、推荐、订单和账户风控规则。
        </p>
      </div>

      {/* 基础风控规则 */}
      <div
        style={{
          background: "#111833",
          border: "1px solid #22305f",
          borderRadius: "12px",
          padding: "20px",
          maxWidth: "1100px",
          marginBottom: "20px",
        }}
      >
        <div style={gridStyle}>
          <SelectField
            label="同钱包允许重复注册"
            name="allowSameWalletRegister"
            value={form.allowSameWalletRegister}
            onChange={handleChange}
            options={["是", "否"]}
          />

          <SelectField
            label="同钱包允许重复下单"
            name="allowSameWalletOrder"
            value={form.allowSameWalletOrder}
            onChange={handleChange}
            options={["是", "否"]}
          />

          <SelectField
            label="允许自己推荐自己"
            name="allowSelfReferral"
            value={form.allowSelfReferral}
            onChange={handleChange}
            options={["是", "否"]}
          />

          <SelectField
            label="是否允许后台修改邀请人"
            name="manualReviewHighRiskOrder"
            value={form.manualReviewHighRiskOrder}
            onChange={handleChange}
            options={["是", "否"]}
          />

          <SelectField
            label="是否限制同 IP 注册"
            name="limitSameIpRegister"
            value={form.limitSameIpRegister}
            onChange={handleChange}
            options={["是", "否"]}
          />

          <InputField
            label="同 IP 每日最大注册数"
            name="maxRegisterPerIpPerDay"
            value={form.maxRegisterPerIpPerDay}
            onChange={handleChange}
          />

          <SelectField
            label="是否限制同设备注册"
            name="limitSameDeviceRegister"
            value={form.limitSameDeviceRegister}
            onChange={handleChange}
            options={["是", "否"]}
          />

          <InputField
            label="同设备每日最大注册数"
            name="maxRegisterPerDevicePerDay"
            value={form.maxRegisterPerDevicePerDay}
            onChange={handleChange}
          />

          <InputField
            label="单钱包最大待支付订单数"
            name="maxPendingOrdersPerWallet"
            value={form.maxPendingOrdersPerWallet}
            onChange={handleChange}
          />

          <SelectField
            label="异常订单自动冻结"
            name="autoFreezeRiskOrder"
            value={form.autoFreezeRiskOrder}
            onChange={handleChange}
            options={["是", "否"]}
          />

          <SelectField
            label="异常账号自动冻结"
            name="autoFreezeRiskAccount"
            value={form.autoFreezeRiskAccount}
            onChange={handleChange}
            options={["是", "否"]}
          />

          <SelectField
            label="高风险订单人工审核"
            name="manualReviewHighRiskOrder"
            value={form.manualReviewHighRiskOrder}
            onChange={handleChange}
            options={["是", "否"]}
          />
        </div>
      </div>

      {/* 修改邀请人流程 */}
      <div
        style={{
          background: "#111833",
          border: "1px solid #22305f",
          borderRadius: "12px",
          padding: "20px",
          maxWidth: "1100px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ fontSize: "20px", margin: 0 }}>后台修改邀请人操作流程</h2>
          <button onClick={addInviterChangeItem} style={secondaryBtnStyle}>
            + 添加修改邀请人
          </button>
        </div>

        <p style={{ color: "#94a3b8", marginTop: 0 }}>
          用于后台人工调整某个用户的邀请人关系，建议保留操作原因和审核状态。
        </p>

        <div style={{ display: "grid", gap: "16px" }}>
          {inviterChangeList.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #22305f",
                borderRadius: "10px",
                padding: "16px",
                background: "#0f172a",
              }}
            >
              <div style={gridStyle}>
                <InputField
                  label="用户账号 / 钱包地址"
                  name="user"
                  value={item.user}
                  onChange={(e) =>
                    handleInviterChange(index, "user", e.target.value)
                  }
                />

                <InputField
                  label="当前邀请人"
                  name="currentInviter"
                  value={item.currentInviter}
                  onChange={(e) =>
                    handleInviterChange(index, "currentInviter", e.target.value)
                  }
                />

                <InputField
                  label="新邀请人"
                  name="newInviter"
                  value={item.newInviter}
                  onChange={(e) =>
                    handleInviterChange(index, "newInviter", e.target.value)
                  }
                />

                <InputField
                  label="修改原因"
                  name="reason"
                  value={item.reason}
                  onChange={(e) =>
                    handleInviterChange(index, "reason", e.target.value)
                  }
                />

                <SelectField
                  label="状态"
                  name="status"
                  value={item.status}
                  onChange={(e) =>
                    handleInviterChange(index, "status", e.target.value)
                  }
                  options={["待处理", "已通过", "已拒绝"]}
                />
              </div>

              <div style={{ marginTop: "14px" }}>
                <button
                  type="button"
                  onClick={() => removeInviterChangeItem(index)}
                  style={dangerBtnStyle}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 冻结名单 */}
      <div
        style={{
          background: "#111833",
          border: "1px solid #22305f",
          borderRadius: "12px",
          padding: "20px",
          maxWidth: "1100px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ fontSize: "20px", margin: 0 }}>冻结具体账号与地址</h2>
          <button onClick={addFreezeItem} style={secondaryBtnStyle}>
            + 添加冻结项
          </button>
        </div>

        <p style={{ color: "#94a3b8", marginTop: 0 }}>
          这里用于单独冻结某个用户账号或钱包地址，并写明原因。
        </p>

        <div style={{ display: "grid", gap: "16px" }}>
          {freezeList.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #22305f",
                borderRadius: "10px",
                padding: "16px",
                background: "#0f172a",
              }}
            >
              <div style={gridStyle}>
                <SelectField
                  label="类型"
                  name="type"
                  value={item.type}
                  onChange={(e) =>
                    handleFreezeChange(index, "type", e.target.value)
                  }
                  options={["账号", "地址"]}
                />

                <InputField
                  label="账号 / 地址"
                  name="value"
                  value={item.value}
                  onChange={(e) =>
                    handleFreezeChange(index, "value", e.target.value)
                  }
                />

                <InputField
                  label="冻结原因"
                  name="reason"
                  value={item.reason}
                  onChange={(e) =>
                    handleFreezeChange(index, "reason", e.target.value)
                  }
                />

                <SelectField
                  label="状态"
                  name="status"
                  value={item.status}
                  onChange={(e) =>
                    handleFreezeChange(index, "status", e.target.value)
                  }
                  options={["冻结", "正常"]}
                />
              </div>

              <div style={{ marginTop: "14px" }}>
                <button
                  type="button"
                  onClick={() => removeFreezeItem(index)}
                  style={dangerBtnStyle}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <button onClick={handleSave} style={saveBtnStyle}>
          保存风控设置
        </button>
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        style={inputStyle}
        placeholder={`请输入${label}`}
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        style={inputStyle}
      >
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "16px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  color: "#c7d2fe",
  fontSize: "14px",
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const saveBtnStyle: React.CSSProperties = {
  padding: "12px 18px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const secondaryBtnStyle: React.CSSProperties = {
  padding: "10px 16px",
  background: "#475569",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const dangerBtnStyle: React.CSSProperties = {
  padding: "8px 12px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};