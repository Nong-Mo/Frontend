import React, { useEffect, useState } from "react";
import icon4 from "../../icons/bookViewerCard/4.svg";
import plus from "../../icons/home/plus.svg";

import BookViewerCard from "./BookViewerCard.tsx";
import { useNavigate } from "react-router-dom";

interface ViewerContentProps {
  width: number;
  height: number;
  title: string;
}

const ViewerContent = ({ width, height, title }: ViewerContentProps) => {
  const [activeTab, setActiveTab] = useState("recent");
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);

  const addNewBook = () => {
    const newBook = {
      title: "새 책",
      thumbnail: new URL("https://picsum.photos/156/196"),
      createdAt: new Date(),
      icon: icon4,
    };
    setBooks([...books, newBook]);
  };

  return (
    <div
      style={{ width: width, height: height }}
      className="flex justify-start pt-[21px] flex-col"
    >
      {/*토글 버튼*/}
      <div className="flex gap-8 min-h-[32px] justify-center z-10">
        <button
          className={`h-full w-[87px] transition-colors rounded-[16px] ${
            activeTab === "all" ? " bg-blue-500 text-white" : "text-gray-400 "
          }`}
          onClick={() => setActiveTab("all")}
        >
          전체 목록
        </button>
        <button
          className={`h-full w-[104px] transition-colors rounded-[16px] ${
            activeTab === "recent"
              ? " bg-blue-500 text-white"
              : "text-gray-400 "
          }`}
          onClick={() => setActiveTab("recent")}
        >
          최근 읽은 책
        </button>
      </div>

      {/* Content 영역*/}
      <div className="viewer-content-wrapper mt-[13px] w-full">
        {/*추가하기 버튼*/}
        <div className="plus-button mb-[16px]">
          <button
            className="text-4xl bg-[#1F222A] rounded-[12px] h-[48px] w-full text-white flex justify-center items-center"
            onClick={() => navigate("/scan")}
          >
            <img src={plus} alt="플러스" />
          </button>
        </div>

        {/* Grid Content 영역*/}
        <div className="grid grid-cols-2 gap-x-[10px] gap-y-[7px]">
          {books.map((book, index) => (
            <BookViewerCard key={index} {...book} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewerContent;
