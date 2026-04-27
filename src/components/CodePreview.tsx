import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { generateCode } from '@/utils/codeGenerator';
import { NetworkGraph } from '@/types';

interface CodePreviewProps {
  nodes: any[];
  edges: any[];
}

type Framework = 'pytorch' | 'tensorflow' | 'keras';

export default function CodePreview({ nodes, edges }: CodePreviewProps) {
  const [framework, setFramework] = useState<Framework>('pytorch');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (nodes.length === 0) {
      toast.error('请先在画布上添加组件');
      return;
    }
    setIsGenerating(true);
    try {
      const graph: NetworkGraph = { nodes, edges };
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ graph, framework }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setGeneratedCode(data.code);
            toast.success('代码生成成功！');
            setIsGenerating(false);
            return;
          }
        }
      } catch (_) { /* 使用本地生成器 */ }
      const code = generateCode(graph, framework);
      setGeneratedCode(code);
      toast.success('代码生成成功！');
    } catch (error: any) {
      toast.error(`代码生成失败: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [nodes, edges, framework]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generatedCode);
    toast.success('代码已复制到剪贴板');
  }, [generatedCode]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'model.py';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('文件已下载');
  }, [generatedCode]);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white transition-colors duration-200">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800">
        <h2 className="text-lg font-bold flex items-center gap-2">
          💻 代码预览
        </h2>
        <div className="flex items-center gap-2">
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value as Framework)}
            className="px-3 py-1.5 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="pytorch">PyTorch</option>
            <option value="tensorflow">TensorFlow</option>
            <option value="keras">Keras</option>
          </select>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-300 dark:disabled:bg-slate-600 disabled:text-gray-500 text-white rounded text-sm font-medium transition-colors"
          >
            {isGenerating ? '生成中...' : '🔄 生成代码'}
          </button>
        </div>
      </div>

      {/* 代码显示区 */}
      <div className="flex-1 overflow-auto p-4">
        {generatedCode ? (
          <pre className="code-preview text-gray-200 whitespace-pre-wrap bg-slate-800 rounded-lg p-4 overflow-x-auto shadow-inner">
            <code>{generatedCode}</code>
          </pre>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-slate-500">
            <p className="text-4xl mb-4">📝</p>
            <p>点击"生成代码"按钮</p>
            <p>将神经网络结构转换为代码</p>
          </div>
        )}
      </div>

      {/* 操作栏 */}
      {generatedCode && (
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 flex gap-3 bg-white dark:bg-slate-800">
          <button
            onClick={handleCopy}
            className="flex-1 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-white rounded font-medium transition-colors flex items-center justify-center gap-2"
          >
            📋 复制代码
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-medium transition-colors flex items-center justify-center gap-2"
          >
            💾 下载文件
          </button>
        </div>
      )}
    </div>
  );
}
