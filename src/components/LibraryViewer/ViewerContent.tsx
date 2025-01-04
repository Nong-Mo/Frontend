import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import icon1 from "../../icons/bookViewerCard/1.svg";
import icon2 from "../../icons/bookViewerCard/2.svg";
import icon3 from "../../icons/bookViewerCard/3.svg";
import icon4 from "../../icons/bookViewerCard/4.svg";
import plus from "../../icons/home/plus.svg";

import BookViewerCard from "./BookViewerCard.tsx";
import { useNavigate } from "react-router-dom";

interface ViewerContentProps {
  width: number;
  height: number;
  bookTitle?: string;
}

const ViewerContent = ({ width, height, bookTitle }: ViewerContentProps) => {
  const [activeTab, setActiveTab] = useState("recent");
  const [books, setBooks] = useState([]);  // 빈 배열로 시작
  const navigate = useNavigate();

  // 새 책이 추가되면 books 배열 업데이트
  useEffect(() => {
    if (bookTitle) {
      const newBook = {
        title: bookTitle,
        thumbnail: new URL("https://picsum.photos/156/196"),
        createdAt: new Date(),
        icon: icon3
      };
      setBooks(prevBooks => [newBook, ...prevBooks]);
    }
  }, [bookTitle]);

  return (
    <div
      style={{ width: width, height: height }}
      className="flex justify-start pt-[21px] flex-col"
    >
      {/* 책이 있을 때만 토글 버튼 표시 */}
      {books.length > 0 && (
        <div className="flex gap-8 h-[32px] justify-center z-10">
          <button
            className={`h-full w-[87px] transition-colors rounded-[16px] ${
              activeTab === "all" ? " bg-blue-500 text-white" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("all")}
          >
            전체 목록
          </button>
          <button
            className={`h-full w-[104px] transition-colors rounded-[16px] ${
              activeTab === "recent" ? " bg-blue-500 text-white" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("recent")}
          >
            최근 읽은 책
          </button>
        </div>
      )}

      {/* Content 영역*/}
      <div className="viewer-content-wrapper mt-[13px] w-full">
        {/*추가하기 버튼*/}
        <div className="plus-button mb-[16px]">
          <button 
            onClick={() => navigate("/scan")}
            className="text-4xl bg-[#1F222A] rounded-[12px] h-[48px] w-full text-white flex justify-center items-center"
          >
            <img
              src={plus}
              alt="플러스"
            />
          </button>
        </div>

        {/* Grid Content 영역 - 책이 있을 때만 표시 */}
        {books.length > 0 && (
          <div className="grid grid-cols-2 gap-x-[10px] gap-y-[7px]">
            {books.map((book, index) => (
              <BookViewerCard
                key={`${book.title}-${index}`}
                onclick={() => navigate("/player")}
                title={book.title}
                thumbnail={book.thumbnail}
                createdAt={book.createdAt}
                icon={book.icon}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewerContent;