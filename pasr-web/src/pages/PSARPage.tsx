import React, { useState } from "react";
import type { ChangeEvent } from "react";

type HistoryRecord = {
  id: number;
  time: string;
  user: string;
  type: string;
  status: string;
  statusClass: string;
};

const mockHistory: HistoryRecord[] = [
  {
    id: 1,
    time: "2024-07-23 10:00",
    user: "employee01",
    type: "正向编制助手",
    status: "完成",
    statusClass: "bg-green-100 text-green-800",
  },
  // 可添加更多 mock 数据
];

const PSARPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("forward");
  const [forwardInput, setForwardInput] = useState("");
  const [forwardOutput, setForwardOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState({
    forward: false,
    reviewText: false,
    reviewParams: false,
  });

  const [reviewTextInput, setReviewTextInput] = useState("");
  const [reviewTextOutput, setReviewTextOutput] = useState<string | null>(null);

  const [paramsReviewOutput, setParamsReviewOutput] = useState<string | null>(null);

  const [historyRecords] = useState<HistoryRecord[]>(mockHistory);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyModalContent, setHistoryModalContent] = useState<string>("");

  // 正向编制助手
  const generateContent = async () => {
    setIsLoading((l) => ({ ...l, forward: true }));
    setTimeout(() => {
      setForwardOutput(`<p>AI 生成内容示例：${forwardInput || "（这里会显示AI生成的内容）"}</p>`);
      setIsLoading((l) => ({ ...l, forward: false }));
    }, 1200);
  };

  // 反向文本审查
  const startTextReview = async () => {
    setIsLoading((l) => ({ ...l, reviewText: true }));
    setTimeout(() => {
      setReviewTextOutput(`<p>AI 审查意见示例：${reviewTextInput || "（这里会显示AI审查意见）"}</p>`);
      setIsLoading((l) => ({ ...l, reviewText: false }));
    }, 1200);
  };

  // 反向数值类参数审查
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // 这里只做演示
    setParamsReviewOutput(null);
  };
  const startParamsReview = async () => {
    setIsLoading((l) => ({ ...l, reviewParams: true }));
    setTimeout(() => {
      setParamsReviewOutput(`
        <table class="min-w-full text-sm border border-gray-200">
          <thead>
            <tr>
              <th class="px-4 py-2 text-center border-b border-gray-200 whitespace-nowrap">参数</th>
              <th class="px-4 py-2 text-center border-b border-gray-200 whitespace-nowrap">原值</th>
              <th class="px-4 py-2 text-center border-b border-gray-200 whitespace-nowrap">AI建议</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b last:border-b-0 border-gray-100">
              <td class="px-4 py-2 text-center whitespace-nowrap">参数A</td>
              <td class="px-4 py-2 text-center whitespace-nowrap">100</td>
              <td class="px-4 py-2 text-center whitespace-nowrap">98</td>
            </tr>
          </tbody>
        </table>
      `);
      setIsLoading((l) => ({ ...l, reviewParams: false }));
    }, 1200);
  };

  // 历史详情
  const showHistoryDetail = (id: number) => {
    setHistoryModalContent(`<p>这里是记录ID为${id}的详细内容。</p>`);
    setHistoryModalOpen(true);
  };

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          <a className="flex items-center gap-2 font-bold text-lg" href="#">
            <span className="i-bi-robot" /> PSAR/FSAR AI 智能审查
          </a>
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-800 focus:outline-none group">
              <span className="i-bi-person-circle" />
              欢迎, employee01
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* 下拉菜单 */}
            <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg hidden group-hover:block">
              <a className="block px-4 py-2 hover:bg-gray-100" href="#">个人中心</a>
              <a className="block px-4 py-2 hover:bg-gray-100" href="#">切换账号</a>
              <div className="border-t my-1" />
              <a className="block px-4 py-2 hover:bg-gray-100" href="#">退出登录</a>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <div className="container mx-auto mt-4">
        {/* 标签页 */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4">
            <button
              className={`px-4 py-2 border-b-2 font-medium ${activeTab === "forward" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-600"}`}
              onClick={() => setActiveTab("forward")}
            >
              正向编制助手
            </button>
            <button
              className={`px-4 py-2 border-b-2 font-medium ${activeTab === "review-text" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-600"}`}
              onClick={() => setActiveTab("review-text")}
            >
              反向文本审查
            </button>
            <button
              className={`px-4 py-2 border-b-2 font-medium ${activeTab === "review-params" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-600"}`}
              onClick={() => setActiveTab("review-params")}
            >
              反向数值类参数审查
            </button>
            <button
              className={`px-4 py-2 border-b-2 font-medium ${activeTab === "history" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-600"}`}
              onClick={() => setActiveTab("history")}
            >
              运行记录
            </button>
          </nav>
        </div>

        {/* 正向编制助手 */}
        {activeTab === "forward" && (
          <div className="bg-white rounded shadow mt-6 p-6">
            <div className="font-semibold mb-4">正向编制助手</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-2">输入内容/提示词 (Prompt)</h5>
                <textarea
                  value={forwardInput}
                  onChange={(e) => setForwardInput(e.target.value)}
                  className="w-full min-h-[120px] border rounded p-2"
                  placeholder="在此输入您的初步想法、大纲或关键指令..."
                />
              </div>
              <div>
                <h5 className="font-medium mb-2">AI 生成结果</h5>
                <div className={`min-h-[120px] border rounded p-2 ${!forwardOutput ? "flex items-center justify-center" : ""}`}>
                  {isLoading.forward ? (
                    <div className="flex justify-center items-center h-full">
                      <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></span>
                      <span>生成中...</span>
                    </div>
                  ) : forwardOutput ? (
                    <div dangerouslySetInnerHTML={{ __html: forwardOutput }} />
                  ) : (
                    <p className="text-gray-400">点击“生成内容”后，AI将根据左侧输入自动生成报告文本。</p>
                  )}
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <button
                onClick={generateContent}
                className="btn btn-primary px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                disabled={isLoading.forward}
              >
                {isLoading.forward ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></span>
                ) : (
                  <span className="i-bi-magic mr-2" />
                )}
                生成内容
              </button>
            </div>
          </div>
        )}

        {/* 反向文本审查 */}
        {activeTab === "review-text" && (
          <div className="bg-white rounded shadow mt-6 p-6">
            <div className="font-semibold mb-4">反向文本审查</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-2">待审查文本</h5>
                <textarea
                  value={reviewTextInput}
                  onChange={(e) => setReviewTextInput(e.target.value)}
                  className="w-full min-h-[120px] border rounded p-2"
                  placeholder="在此粘贴需要进行AI审查的完整段落或报告..."
                />
              </div>
              <div>
                <h5 className="font-medium mb-2">AI 审查意见</h5>
                <div className={`min-h-[120px] border rounded p-2 ${!reviewTextOutput ? "flex items-center justify-center" : ""}`}>
                  {isLoading.reviewText ? (
                    <div className="flex justify-center items-center h-full">
                      <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></span>
                      <span>审查中...</span>
                    </div>
                  ) : reviewTextOutput ? (
                    <div dangerouslySetInnerHTML={{ __html: reviewTextOutput }} />
                  ) : (
                    <p className="text-gray-400">点击“开始审查”后，AI将自动分析文本并给出意见。</p>
                  )}
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <button
                onClick={startTextReview}
                className="btn btn-primary px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                disabled={isLoading.reviewText}
              >
                {isLoading.reviewText ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></span>
                ) : (
                  <span className="i-bi-search mr-2" />
                )}
                开始审查
              </button>
            </div>
          </div>
        )}

        {/* 反向数值类参数审查 */}
        {activeTab === "review-params" && (
          <div className="bg-white rounded shadow mt-6 p-6">
            <div className="font-semibold mb-4">反向数值类参数审查</div>
            <div className="mb-3 flex items-center gap-2">
              <input
                type="file"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={handleFileChange}
              />
              <span className="inline-block px-3 py-2 bg-gray-100 rounded">上传文件</span>
            </div>
            <div className="text-center mb-3">
              <button
                onClick={startParamsReview}
                className="btn btn-primary px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                disabled={isLoading.reviewParams}
              >
                {isLoading.reviewParams ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></span>
                ) : (
                  <span className="i-bi-table mr-2" />
                )}
                开始审查
              </button>
            </div>
            <hr className="my-4" />
            <h5 className="font-medium mb-2">审查结果对比</h5>
            <div className="overflow-x-auto">
              {isLoading.reviewParams ? (
                <div className="flex justify-center items-center h-20">
                  <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></span>
                  <span>审查中...</span>
                </div>
              ) : paramsReviewOutput ? (
                <div dangerouslySetInnerHTML={{ __html: paramsReviewOutput }} />
              ) : (
                <p className="text-gray-400 text-center">上传文件并点击“开始审查”后，此处将显示结果对比表格。</p>
              )}
            </div>
          </div>
        )}

        {/* 运行记录 */}
        {activeTab === "history" && (
          <div className="bg-white rounded shadow mt-6 p-6">
            <div className="font-semibold mb-4">历史运行记录</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-center border-b border-gray-200 whitespace-nowrap">ID</th>
                    <th className="px-4 py-2 text-center border-b border-gray-200 whitespace-nowrap">操作时间</th>
                    <th className="px-4 py-2 text-center border-b border-gray-200 whitespace-nowrap">操作人</th>
                    <th className="px-4 py-2 text-center border-b border-gray-200 whitespace-nowrap">审查类型</th>
                    <th className="px-4 py-2 text-center border-b border-gray-200 whitespace-nowrap">状态</th>
                    <th className="px-4 py-2 text-center border-b border-gray-200 whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {historyRecords.map((record) => (
                    <tr key={record.id} className="border-b last:border-b-0 border-gray-100">
                      <td className="px-4 py-2 text-center whitespace-nowrap">{record.id}</td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">{record.time}</td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">{record.user}</td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">{record.type}</td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs ${record.statusClass}`}>{record.status}</span>
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                          onClick={() => showHistoryDetail(record.id)}
                        >
                          查看详情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 历史记录详情 Modal */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center border-b px-4 py-2">
              <h5 className="font-semibold">运行记录详情</h5>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setHistoryModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="p-4" dangerouslySetInnerHTML={{ __html: historyModalContent }} />
            <div className="flex justify-end border-t px-4 py-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setHistoryModalOpen(false)}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PSARPage;