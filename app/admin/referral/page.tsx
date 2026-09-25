"use client";

import { useMemo, useState } from "react";

type RuleItem = {
  level: string;
  selfSpend: string;
  directCount: string;
  rebateRate: string;
};

type TreeNode = {
  id: string;
  nickname: string;
  wallet: string;
  referralCode: string;
  inviterCode: string;
  level: string;
  children?: TreeNode[];
};

const mockRules: RuleItem[] = [
  { level: "V1", selfSpend: "100", directCount: "-", rebateRate: "0.2%" },
  { level: "V2", selfSpend: "-", directCount: "10", rebateRate: "0.4%" },
  { level: "V3", selfSpend: "-", directCount: "10", rebateRate: "0.8%" },
  { level: "V4", selfSpend: "-", directCount: "10", rebateRate: "1%" },
  { level: "V5", selfSpend: "-", directCount: "10", rebateRate: "1.5%" },
  { level: "V6", selfSpend: "-", directCount: "10", rebateRate: "2%" },
  { level: "V7", selfSpend: "-", directCount: "10", rebateRate: "2.5%" },
  { level: "V8", selfSpend: "-", directCount: "10", rebateRate: "3%" },
];

const mockTree: TreeNode = {
  id: "1",
  nickname: "A",
  wallet: "0xA111...0001",
  referralCode: "ABC123",
  inviterCode: "-",
  level: "V8",
  children: [
    {
      id: "2",
      nickname: "B",
      wallet: "0xB222...0002",
      referralCode: "BCD234",
      inviterCode: "ABC123",
      level: "V5",
      children: [
        {
          id: "5",
          nickname: "E",
          wallet: "0xE555...0005",
          referralCode: "EFG567",
          inviterCode: "BCD234",
          level: "V2",
        },
        {
          id: "6",
          nickname: "F",
          wallet: "0xF666...0006",
          referralCode: "FGH678",
          inviterCode: "BCD234",
          level: "V1",
        },
      ],
    },
    {
      id: "3",
      nickname: "C",
      wallet: "0xC333...0003",
      referralCode: "CDE345",
      inviterCode: "ABC123",
      level: "V4",
      children: [
        {
          id: "7",
          nickname: "G",
          wallet: "0xG777...0007",
          referralCode: "GHI789",
          inviterCode: "CDE345",
          level: "V1",
        },
      ],
    },
    {
      id: "4",
      nickname: "D",
      wallet: "0xD444...0004",
      referralCode: "DEF456",
      inviterCode: "ABC123",
      level: "V3",
    },
  ],
};

export default function AdminReferralPage() {
  const [search, setSearch] = useState("");
  const [rules, setRules] = useState<RuleItem[]>(mockRules);

  const filteredTree = useMemo(() => {
    if (!search.trim()) return mockTree;
    return filterTree(mockTree, search.trim().toLowerCase()) || mockTree;
  }, [search]);

  const handleRuleChange = (
    index: number,
    field: keyof RuleItem,
    value: string
  ) => {
    setRules((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = () => {
    console.log("推荐规则：", rules);
    alert("推荐设置已保存（当前是演示页面，后面会接数据库）");
  };

  return (
    <div style={{ color: "#fff" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>推荐设置</h1>
        <p style={{ color: "#94a3b8" }}>
          这里配置推荐等级、返利规则、直推条件，并查看完整推荐关系树。
        </p>
      </div>

      {/* 规则设置 */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>推荐等级规则</h2>

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead style={theadStyle}>
              <tr>
                <th style={thStyle}>等级</th>
                <th style={thStyle}>自身消费</th>
                <th style={thStyle}>直推人数</th>
                <th style={thStyle}>返利比例</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((item, index) => (
                <tr key={item.level} style={trStyle}>
                  <td style={tdStyle}>{item.level}</td>
                  <td style={tdStyle}>
                    <input
                      value={item.selfSpend}
                      onChange={(e) =>
                        handleRuleChange(index, "selfSpend", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      value={item.directCount}
                      onChange={(e) =>
                        handleRuleChange(index, "directCount", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      value={item.rebateRate}
                      onChange={(e) =>
                        handleRuleChange(index, "rebateRate", e.target.value)
                      }
                      style={inputStyle}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "18px" }}>
          <button onClick={handleSave} style={saveBtnStyle}>
            保存推荐规则
          </button>
        </div>
      </section>

      {/* 关系树 */}
      <section style={sectionStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <h2 style={sectionTitleStyle}>推荐关系树</h2>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索钱包地址 / 推荐码 / 昵称"
            style={searchStyle}
          />
        </div>

        <p style={{ color: "#94a3b8", marginTop: 0 }}>
          这里可以查看所有人的推荐关系和级别，后面接数据库后会显示真实树形结构。
        </p>

        <div style={{ overflowX: "auto" }}>
          <TreeNodeView node={filteredTree} depth={0} />
        </div>
      </section>
    </div>
  );
}

function TreeNodeView({
  node,
  depth,
}: {
  node: TreeNode;
  depth: number;
}) {
  return (
    <div style={{ marginLeft: depth === 0 ? 0 : 28, marginTop: 16 }}>
      <div style={nodeCardStyle}>
        <div style={nodeHeaderStyle}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>
            {node.nickname} <span style={{ color: "#94a3b8" }}>({node.level})</span>
          </div>
          <div style={tagStyle}>推荐码: {node.referralCode}</div>
        </div>

        <div style={nodeBodyStyle}>
          <div>
            <span style={labelSmallStyle}>钱包地址：</span>
            <span>{node.wallet}</span>
          </div>
          <div>
            <span style={labelSmallStyle}>邀请人码：</span>
            <span>{node.inviterCode}</span>
          </div>
        </div>
      </div>

      {node.children && node.children.length > 0 && (
        <div style={{ borderLeft: "2px solid #22305f", marginLeft: 18, paddingLeft: 18 }}>
          {node.children.map((child) => (
            <TreeNodeView key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function filterTree(node: TreeNode, keyword: string): TreeNode | null {
  const matched =
    node.nickname.toLowerCase().includes(keyword) ||
    node.wallet.toLowerCase().includes(keyword) ||
    node.referralCode.toLowerCase().includes(keyword) ||
    node.inviterCode.toLowerCase().includes(keyword) ||
    node.level.toLowerCase().includes(keyword);

  const children =
    node.children
      ?.map((child) => filterTree(child, keyword))
      .filter(Boolean) as TreeNode[] | undefined;

  if (matched || (children && children.length > 0)) {
    return {
      ...node,
      children,
    };
  }

  return null;
}

const sectionStyle: React.CSSProperties = {
  background: "#111833",
  border: "1px solid #22305f",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "20px",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "20px",
  marginBottom: "16px",
  marginTop: 0,
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "700px",
};

const theadStyle: React.CSSProperties = {
  background: "#182347",
};

const thStyle: React.CSSProperties = {
  padding: "14px",
  textAlign: "left",
  color: "#c7d2fe",
  fontWeight: "bold",
  borderBottom: "1px solid #22305f",
};

const trStyle: React.CSSProperties = {
  borderTop: "1px solid #22305f",
};

const tdStyle: React.CSSProperties = {
  padding: "14px",
  color: "#fff",
  verticalAlign: "middle",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
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

const searchStyle: React.CSSProperties = {
  width: "320px",
  maxWidth: "100%",
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const nodeCardStyle: React.CSSProperties = {
  background: "#0f172a",
  border: "1px solid #22305f",
  borderRadius: "10px",
  padding: "14px",
  maxWidth: "720px",
};

const nodeHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "10px",
};

const nodeBodyStyle: React.CSSProperties = {
  display: "grid",
  gap: "8px",
  color: "#e2e8f0",
};

const tagStyle: React.CSSProperties = {
  fontSize: "12px",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#1d4ed8",
  color: "#fff",
};

const labelSmallStyle: React.CSSProperties = {
  color: "#94a3b8",
};