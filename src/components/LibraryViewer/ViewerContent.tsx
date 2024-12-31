import React, { useState } from "react";

interface ViewerContentProps {
  width: number;
  height: number;
  title: string;
}

const ViewerContent = ({ width, height, title }: ViewerContentProps) => {
  const [activeTab, setActiveTab] = useState("recent");
  return (
    <div
      style={{ width: width, height: height }}
      className="flex justify-start pt-[21px] flex-col"
    >
      <div className="flex gap-8 h-[32px] justify-center">
        <button
          className={`px-4 py-2 transition-colors ${
            activeTab === "all"
              ? "rounded-[16px] bg-blue-500 text-white"
              : "text-gray-400 bg-gray-500"
          }`}
          onClick={() => setActiveTab("all")}
        >
          전체 목록
        </button>
        <button
          className={`px-4 py-2 transition-colors ${
            activeTab === "recent"
              ? "rounded-[16px] bg-blue-500 text-white"
              : "text-gray-400 bg-gray-500"
          }`}
          onClick={() => setActiveTab("recent")}
        >
          최근 읽은 책
        </button>
      </div>
      <div className="viewer-content-wrapper mt-[13px] w-full">
        <div className="plus-button mb-[16px]">
          <button className="text-4xl bg-[#1F222A] rounded-[12px] h-[48px] w-full text-white">
            +
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-[12px] overflow-hidden bg-gray-800"
            >
              <div className="absolute top-4 left-4">
                <div className="w-12 h-12 rounded-lg bg-purple-400" />
              </div>
              <button className="absolute top-4 right-4 text-white">⋮</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewerContent;
