import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Search, Table as TableIcon, StopCircle, Sparkles, History, FileUp, Copy, Check, RotateCcw } from "lucide-react";

type HistoryRecord = {
  id: number;
  time: string;
  user: string;
  type: string;
  status: string;
  statusClass: string;
};

// 正向编制助手输出数据结构
interface ForwardOutputData {
  type: 'text' | 'list' | 'paragraph';
  content: string;
  items?: string[];
}

// 反向文本审查输出数据结构
interface ReviewTextOutputData {
  suggestions: string[];
  issues: string[];
  recommendations: string[];
}

// 参数审查数据接口
interface ParamsReviewItem {
  param: string;
  originalValue: string;
  aiSuggestion: string;
  reason?: string;
}

// 历史记录详情数据结构
interface HistoryDetailData {
  id: number;
  title: string;
  content: string[];
  metadata: Record<string, string>;
}

const mockHistory: HistoryRecord[] = [
  {
    id: 1,
    time: "2024-07-23 10:00",
    user: "employee01",
    type: "正向编制助手",
    status: "完成",
    statusClass: "bg-green-100 text-green-800",
  },
];

// 正向编制助手输出组件
const ForwardOutputDisplay: React.FC<{ data: ForwardOutputData | null }> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="forward-output prose prose-sm max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // 自定义样式
          p: ({ children }) => <p className="text-foreground mb-3 leading-relaxed">{children}</p>,
          h1: ({ children }) => <h1 className="text-2xl font-bold text-foreground mb-4 mt-6 border-b border-border pb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold text-foreground mb-3 mt-5">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-bold text-foreground mb-2 mt-4">{children}</h3>,
          h4: ({ children }) => <h4 className="text-base font-bold text-foreground mb-2 mt-3">{children}</h4>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3 ml-4">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3 ml-4">{children}</ol>,
          li: ({ children }) => <li className="text-foreground leading-relaxed">{children}</li>,
          code: (props: any) => {
            const { inline, className, children } = props;
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="rounded-md my-3"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                {children}
              </code>
            );
          },
          pre: ({ children }) => <div className="my-3">{children}</div>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground mb-3 bg-muted/30 py-2 rounded-r">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-border rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="border-b border-border hover:bg-muted/30 transition-colors">{children}</tr>,
          th: ({ children }) => <th className="px-4 py-2 text-left font-semibold text-foreground">{children}</th>,
          td: ({ children }) => <td className="px-4 py-2 text-foreground">{children}</td>,
          a: ({ href, children }) => (
            <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic text-foreground">{children}</em>,
          hr: () => <hr className="border-border my-6" />,
        }}
      >
        {data.content}
      </ReactMarkdown>
    </div>
  );
};

// 反向文本审查输出组件
const ReviewTextOutputDisplay: React.FC<{ data: ReviewTextOutputData | null }> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="review-text-output space-y-4">
      {data.suggestions.length > 0 && (
        <div>
          <h6 className="font-medium text-blue-600 mb-2">建议改进：</h6>
          <ul className="list-disc list-inside space-y-1">
            {data.suggestions.map((suggestion, index) => (
              <li key={index} className="text-gray-700">{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
      
      {data.issues.length > 0 && (
        <div>
          <h6 className="font-medium text-red-600 mb-2">发现问题：</h6>
          <ul className="list-disc list-inside space-y-1">
            {data.issues.map((issue, index) => (
              <li key={index} className="text-gray-700">{issue}</li>
            ))}
          </ul>
        </div>
      )}
      
      {data.recommendations.length > 0 && (
        <div>
          <h6 className="font-medium text-green-600 mb-2">推荐方案：</h6>
          <ul className="list-disc list-inside space-y-1">
            {data.recommendations.map((recommendation, index) => (
              <li key={index} className="text-gray-700">{recommendation}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// 参数审查表格组件
const ParamsReviewTable: React.FC<{ data: ParamsReviewItem[] }> = ({ data }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center w-1/4">参数</TableHead>
          <TableHead className="text-center w-1/4">原值</TableHead>
          <TableHead className="text-center w-1/4">AI建议</TableHead>
          <TableHead className="text-center w-1/4">说明</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="text-center font-medium">{item.param}</TableCell>
            <TableCell className="text-center">{item.originalValue}</TableCell>
            <TableCell className="text-center font-medium text-blue-600">{item.aiSuggestion}</TableCell>
            <TableCell className="text-center text-sm text-gray-600">{item.reason || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// 历史记录详情组件
const HistoryDetailDisplay: React.FC<{ data: HistoryDetailData | null }> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="history-detail space-y-4">
      <div className="border-b pb-2">
        <h4 className="text-lg font-semibold text-gray-800">{data.title}</h4>
        <p className="text-sm text-gray-500">记录ID: {data.id}</p>
      </div>
      
      <div className="space-y-2">
        {data.content.map((item, index) => (
          <p key={index} className="text-gray-700">{item}</p>
        ))}
      </div>
      
      {Object.keys(data.metadata).length > 0 && (
        <div className="bg-gray-50 p-3 rounded">
          <h5 className="font-medium text-gray-700 mb-2">详细信息：</h5>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(data.metadata).map(([key, value]) => (
              <div key={key}>
                <span className="font-medium text-gray-600">{key}:</span>
                <span className="ml-2 text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PSARPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("forward");
  const [forwardInput, setForwardInput] = useState("");
  const [forwardOutput, setForwardOutput] = useState<ForwardOutputData | null>(null);
  const [isLoading, setIsLoading] = useState({
    forward: false,
    reviewText: false,
    reviewParams: false,
  });

  const [reviewTextInput, setReviewTextInput] = useState("");
  const [reviewTextOutput, setReviewTextOutput] = useState<ReviewTextOutputData | null>(null);

  const [paramsReviewData, setParamsReviewData] = useState<ParamsReviewItem[]>([]);

  const [historyRecords] = useState<HistoryRecord[]>(mockHistory);
  const [historyDetailData, setHistoryDetailData] = useState<HistoryDetailData | null>(null);

  // 流式打字机效果相关状态
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 复制功能相关状态
  const [copiedForward, setCopiedForward] = useState(false);
  const [copiedReview, setCopiedReview] = useState(false);

  // 复制到剪贴板
  const copyToClipboard = async (text: string, type: 'forward' | 'review') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'forward') {
        setCopiedForward(true);
        setTimeout(() => setCopiedForward(false), 2000);
      } else {
        setCopiedReview(true);
        setTimeout(() => setCopiedReview(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // 获取当前显示的文本内容
  const getCurrentTextContent = () => {
    if (streamingText) return streamingText;
    if (forwardOutput) return forwardOutput.content;
    return "";
  };

  // 重置页面状态
  const resetPage = () => {
    // 重置正向编制助手状态
    setForwardInput("");
    setForwardOutput(null);
    setStreamingText("");
    setIsStreaming(false);
    
    // 重置反向文本审查状态
    setReviewTextInput("");
    setReviewTextOutput(null);
    
    // 重置参数审查状态
    setParamsReviewData([]);
    
    // 重置复制状态
    setCopiedForward(false);
    setCopiedReview(false);
    
    // 取消正在进行的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // 重置加载状态
    setIsLoading({
      forward: false,
      reviewText: false,
      reviewParams: false,
    });
  };

  // 正向编制助手 - 流式调用OpenAI
  const generateContent = async () => {
    if (!forwardInput.trim()) {
      alert("请输入内容");
      return;
    }

    setIsLoading((l) => ({ ...l, forward: true }));
    setIsStreaming(true);
    setStreamingText("");
    setForwardOutput(null);

    // 创建新的AbortController用于取消请求
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: forwardInput }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 开始接收流式数据时，设置加载状态为false，让UI显示打字机效果
      setIsLoading((l) => ({ ...l, forward: false }));

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') {
              break;
            }
            try {
              const data = JSON.parse(dataStr);
              if (data.data) {
                const content = data.data;
                accumulatedText += content;
                setStreamingText(accumulatedText);
              }
            } catch {
              // 忽略解析错误，继续处理下一行
            }
          }
        }
      }

      // 流式传输完成后，设置最终结果
      setForwardOutput({
        type: 'text',
        content: accumulatedText,
      });

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request was aborted');
      } else {
        console.error('Error generating content:', error);
        // 如果API调用失败，显示错误信息
        setStreamingText(`生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    } finally {
      setIsLoading((l) => ({ ...l, forward: false }));
      setIsStreaming(false);
      // 不清空streamingText，保持打字机效果
      abortControllerRef.current = null;
    }
  };

  // 取消生成
  const cancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // 清理函数
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // 反向文本审查
  const startTextReview = async () => {
    setIsLoading((l) => ({ ...l, reviewText: true }));
    setTimeout(() => {
      const mockData: ReviewTextOutputData = {
        suggestions: [
          "建议在开头添加背景介绍",
          "可以增加具体的数据支撑",
          "建议优化段落结构"
        ],
        issues: [
          "部分表述不够准确",
          "缺少必要的技术细节"
        ],
        recommendations: [
          "参考相关标准规范",
          "补充技术参数说明"
        ]
      };
      setReviewTextOutput(mockData);
      setIsLoading((l) => ({ ...l, reviewText: false }));
    }, 1200);
  };

  // 反向数值类参数审查
  const handleFileChange = () => {
    // 这里只做演示
    setParamsReviewData([]);
  };
  
  const startParamsReview = async () => {
    setIsLoading((l) => ({ ...l, reviewParams: true }));
    setTimeout(() => {
      const mockData: ParamsReviewItem[] = [
        {
          param: "参数A",
          originalValue: "100",
          aiSuggestion: "98",
          reason: "根据标准规范建议调整"
        },
        {
          param: "参数B", 
          originalValue: "200",
          aiSuggestion: "205",
          reason: "考虑安全系数后推荐值"
        }
      ];
      setParamsReviewData(mockData);
      setIsLoading((l) => ({ ...l, reviewParams: false }));
    }, 1200);
  };

  // 历史详情
  const showHistoryDetail = (id: number) => {
    const mockDetailData: HistoryDetailData = {
      id: id,
      title: `运行记录详情 - ID ${id}`,
      content: [
        "这是记录ID为" + id + "的详细内容。",
        "包含了完整的操作过程和结果分析。",
        "所有相关参数和配置信息都已记录。"
      ],
      metadata: {
        "操作时间": "2024-07-23 10:00:00",
        "操作人": "employee01",
        "审查类型": "正向编制助手",
        "处理状态": "已完成"
      }
    };
    setHistoryDetailData(mockDetailData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center">
            <a className="flex items-center space-x-2" href="#">
              <Bot className="h-6 w-6" />
              <span className="font-bold">
                PSAR/FSAR AI 智能审查
              </span>
            </a>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              欢迎, employee01
            </Button>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <div className="container mx-auto py-6 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 h-12">
            <TabsTrigger value="forward" className="flex items-center justify-center gap-2 text-sm">
              <Sparkles className="h-4 w-4" />
              正向编制助手
            </TabsTrigger>
            <TabsTrigger value="review-text" className="flex items-center justify-center gap-2 text-sm">
              <Search className="h-4 w-4" />
              反向文本审查
            </TabsTrigger>
            <TabsTrigger value="review-params" className="flex items-center justify-center gap-2 text-sm">
              <TableIcon className="h-4 w-4" />
              反向数值类参数审查
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center justify-center gap-2 text-sm">
              <History className="h-4 w-4" />
              运行记录
            </TabsTrigger>
          </TabsList>

          {/* 正向编制助手 */}
          <TabsContent value="forward" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>正向编制助手</CardTitle>
                <CardDescription>
                  输入您的初步想法、大纲或关键指令，AI将自动生成报告文本
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="forward-input">输入内容/提示词 (Prompt)</Label>
                    <div className="border rounded-md bg-muted/50">
                      <ScrollArea className="h-[400px] w-full">
                        <div className="p-4">
                          <Textarea
                            id="forward-input"
                            value={forwardInput}
                            onChange={(e) => setForwardInput(e.target.value)}
                            placeholder="在此输入您的初步想法、大纲或关键指令..."
                            className="min-h-[350px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:border-0"
                          />
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>AI 生成结果</Label>
                      {(streamingText || forwardOutput) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(getCurrentTextContent(), 'forward')}
                          className="h-8 px-2 gap-1"
                        >
                          {copiedForward ? (
                            <>
                              <Check className="h-3 w-3" />
                              已复制
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              复制
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    <div className="border rounded-md bg-muted/50">
                      <ScrollArea className="h-[400px] w-full">
                        <div className="p-4">
                          {isLoading.forward ? (
                            <div className="flex justify-center items-center h-full">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                              <span>生成中...</span>
                            </div>
                          ) : (isStreaming || streamingText) ? (
                            <div className="forward-output prose prose-sm max-w-none">
                              {streamingText ? (
                                                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ children }) => <p className="text-foreground mb-3 leading-relaxed">{children}</p>,
                                h1: ({ children }) => <h1 className="text-2xl font-bold text-foreground mb-4 mt-6 border-b border-border pb-2">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-xl font-bold text-foreground mb-3 mt-5">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-lg font-bold text-foreground mb-2 mt-4">{children}</h3>,
                                h4: ({ children }) => <h4 className="text-base font-bold text-foreground mb-2 mt-3">{children}</h4>,
                                ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3 ml-4">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3 ml-4">{children}</ol>,
                                li: ({ children }) => <li className="text-foreground leading-relaxed">{children}</li>,
                                code: (props: any) => {
                                  const { inline, className, children } = props;
                                  const match = /language-(\w+)/.exec(className || '');
                                  return !inline && match ? (
                                    <SyntaxHighlighter
                                      style={oneDark}
                                      language={match[1]}
                                      PreTag="div"
                                      className="rounded-md my-3"
                                    >
                                      {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                  ) : (
                                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                                      {children}
                                    </code>
                                  );
                                },
                                pre: ({ children }) => <div className="my-3">{children}</div>,
                                blockquote: ({ children }) => (
                                  <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground mb-3 bg-muted/30 py-2 rounded-r">
                                    {children}
                                  </blockquote>
                                ),
                                table: ({ children }) => (
                                  <div className="overflow-x-auto my-4">
                                    <table className="min-w-full border border-border rounded-lg">
                                      {children}
                                    </table>
                                  </div>
                                ),
                                thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
                                tbody: ({ children }) => <tbody>{children}</tbody>,
                                tr: ({ children }) => <tr className="border-b border-border hover:bg-muted/30 transition-colors">{children}</tr>,
                                th: ({ children }) => <th className="px-4 py-2 text-left font-semibold text-foreground">{children}</th>,
                                td: ({ children }) => <td className="px-4 py-2 text-foreground">{children}</td>,
                                a: ({ href, children }) => (
                                  <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                                    {children}
                                  </a>
                                ),
                                strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                                em: ({ children }) => <em className="italic text-foreground">{children}</em>,
                                hr: () => <hr className="border-border my-6" />,
                              }}
                            >
                                  {streamingText}
                                </ReactMarkdown>
                              ) : (
                                <p className="text-muted-foreground">准备生成内容...</p>
                              )}
                              {isStreaming && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1"></span>}
                            </div>
                          ) : forwardOutput ? (
                            <ForwardOutputDisplay data={forwardOutput} />
                          ) : (
                            <p className="text-muted-foreground">点击"生成内容"后，AI将根据左侧输入自动生成报告文本。</p>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-3 pt-4">
                  <Button
                    onClick={resetPage}
                    variant="outline"
                    className="gap-2"
                    disabled={isLoading.forward || isStreaming}
                  >
                    <RotateCcw className="h-4 w-4" />
                    重置
                  </Button>
                  {isStreaming ? (
                    <Button
                      onClick={cancelGeneration}
                      variant="destructive"
                      className="gap-2"
                    >
                      <StopCircle className="h-4 w-4" />
                      停止生成
                    </Button>
                  ) : (
                    <Button
                      onClick={generateContent}
                      disabled={isLoading.forward}
                      className="gap-2"
                    >
                      {isLoading.forward ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      生成内容
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 反向文本审查 */}
          <TabsContent value="review-text" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>反向文本审查</CardTitle>
                <CardDescription>
                  粘贴需要进行AI审查的完整段落或报告，AI将自动分析并给出意见
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="review-text-input">待审查文本</Label>
                    <div className="border rounded-md bg-muted/50">
                      <ScrollArea className="h-[400px] w-full">
                        <div className="p-4">
                          <Textarea
                            id="review-text-input"
                            value={reviewTextInput}
                            onChange={(e) => setReviewTextInput(e.target.value)}
                            placeholder="在此粘贴需要进行AI审查的完整段落或报告..."
                            className="min-h-[350px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:border-0"
                          />
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>AI 审查意见</Label>
                      {reviewTextOutput && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(JSON.stringify(reviewTextOutput, null, 2), 'review')}
                          className="h-8 px-2 gap-1"
                        >
                          {copiedReview ? (
                            <>
                              <Check className="h-3 w-3" />
                              已复制
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              复制
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    <div className="border rounded-md bg-muted/50">
                      <ScrollArea className="h-[400px] w-full">
                        <div className="p-4">
                          {isLoading.reviewText ? (
                            <div className="flex justify-center items-center h-full">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                              <span>审查中...</span>
                            </div>
                          ) : reviewTextOutput ? (
                            <ReviewTextOutputDisplay data={reviewTextOutput} />
                          ) : (
                            <p className="text-muted-foreground">点击"开始审查"后，AI将自动分析文本并给出意见。</p>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-3 pt-4">
                  <Button
                    onClick={resetPage}
                    variant="outline"
                    className="gap-2"
                    disabled={isLoading.reviewText}
                  >
                    <RotateCcw className="h-4 w-4" />
                    重置
                  </Button>
                  <Button
                    onClick={startTextReview}
                    disabled={isLoading.reviewText}
                    className="gap-2"
                  >
                    {isLoading.reviewText ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    开始审查
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 反向数值类参数审查 */}
          <TabsContent value="review-params" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>反向数值类参数审查</CardTitle>
                <CardDescription>
                  上传包含数值参数的文件，AI将自动审查并给出优化建议
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor="file-upload" className="sr-only">选择文件</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      className="w-full"
                    />
                  </div>
                  <Button variant="outline" className="gap-2 whitespace-nowrap">
                    <FileUp className="h-4 w-4" />
                    上传文件
                  </Button>
                </div>
                <div className="flex justify-center gap-3 pt-4">
                  <Button
                    onClick={resetPage}
                    variant="outline"
                    className="gap-2"
                    disabled={isLoading.reviewParams}
                  >
                    <RotateCcw className="h-4 w-4" />
                    重置
                  </Button>
                  <Button
                    onClick={startParamsReview}
                    disabled={isLoading.reviewParams}
                    className="gap-2"
                  >
                    {isLoading.reviewParams ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : (
                      <TableIcon className="h-4 w-4" />
                    )}
                    开始审查
                  </Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>审查结果对比</Label>
                  <div className="border rounded-md">
                    {isLoading.reviewParams ? (
                      <div className="flex justify-center items-center h-20">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                        <span>审查中...</span>
                      </div>
                    ) : paramsReviewData.length > 0 ? (
                      <ScrollArea className="h-[300px] w-full">
                        <div className="p-4">
                          <ParamsReviewTable data={paramsReviewData} />
                        </div>
                      </ScrollArea>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">上传文件并点击"开始审查"后，此处将显示结果对比表格。</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 运行记录 */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>历史运行记录</CardTitle>
                <CardDescription>
                  查看所有历史操作记录和详细信息
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center w-16">ID</TableHead>
                      <TableHead className="text-center w-32">操作时间</TableHead>
                      <TableHead className="text-center w-24">操作人</TableHead>
                      <TableHead className="text-center w-32">审查类型</TableHead>
                      <TableHead className="text-center w-20">状态</TableHead>
                      <TableHead className="text-center w-24">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="text-center">{record.id}</TableCell>
                        <TableCell className="text-center">{record.time}</TableCell>
                        <TableCell className="text-center">{record.user}</TableCell>
                        <TableCell className="text-center">{record.type}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className={record.statusClass}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => showHistoryDetail(record.id)}
                              >
                                查看详情
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>运行记录详情</DialogTitle>
                                <DialogDescription>
                                  记录ID: {record.id}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <HistoryDetailDisplay data={historyDetailData} />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PSARPage;