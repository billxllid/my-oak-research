"use client";

import React from "react";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const value = "";
const onChange = (value: string) => {
  console.log(value);
};

const MDEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const ReportEditor = () => {
  return (
    <Card className="h-[calc(100vh-7rem)] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Report Editor</CardTitle>
      </CardHeader>

      {/* 关键：可伸展父级 */}
      <CardContent className="flex-1 min-h-0 px-4 py-0 flex flex-col">
        {/* 关键：给 wrapper 加 h-full */}
        <MDEditor
          id="report-mde" // 可选：让 wrapper id 稳定（report-mde-wrapper）
          className="h-full editor-full" // 关键：wrapper 占满高度
          value={value}
          onChange={onChange}
          options={{
            spellChecker: false,
            autoDownloadFontAwesome: false,
          }}
        />
      </CardContent>

      {/* 兜底：让 EasyMDE/CodeMirror 跟随 wrapper 占满高度 */}
      <style jsx global>{`
        /* 如果你设置了 id，上面会生成 #report-mde-wrapper */
        #report-mde-wrapper {
          height: 100% !important;
        }
        /* 作用域 class 的兜底 */
        .editor-full .EasyMDEContainer {
          height: 100% !important;
          display: flex;
          flex-direction: column;
        }
        .editor-full .CodeMirror {
          height: 100% !important;
        }
        .editor-full .CodeMirror-scroll {
          min-height: 0 !important; /* 防止内部滚动容器把高度撑坏 */
        }
      `}</style>
    </Card>
  );
};

export default ReportEditor;
