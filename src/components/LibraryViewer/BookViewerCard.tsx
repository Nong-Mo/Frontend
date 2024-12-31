import React from "react";

interface BookViewerCardProps {
  title: string;
  thumbnail: File | URL;
  createdAt: Date;
  icon: File | URL;
}

const BookViewerCard = ({
  title,
  thumbnail,
  createdAt,
  icon,
}: BookViewerCardProps) => {
  return (
    <div className="relative w-[156px] h-[196px] rounded-[12px] overflow-hidden">
      <img
        src={
          thumbnail instanceof File
            ? URL.createObjectURL(thumbnail)
            : thumbnail.toString()
        }
        className="w-full h-full object-cover"
        alt={title}
      />
      <div className="absolute inset-0 bg-black/50" />
      {/* Book Icon */}
      <div className="absolute top-[20px] left-[20px]">
        <img
          src={
            icon instanceof File ? URL.createObjectURL(icon) : icon.toString()
          }
          className="w-[40px] h-[40px]"
          alt="book icon"
        />
      </div>

      {/* 더보기 버튼 */}
      <div className="absolute w-[20px] h-[20px] top-[20px] right-[18.5px] text-center">
        <button className="w-full h-full text-white">⋮</button>
      </div>

      {/* 제목 및 시간 */}
      <div className="absolute top-[72px] left-[20px] text-white">
        <h2 className="w-[116px] h-[48px] text-[18px] leading-[24px] font-semibold">
          {title}
        </h2>
      </div>

      <div className="absolute top-[150px] left-[20px] text-white">
        <p className="text-[13px] w-[121px] h-[24px]">
          {createdAt.toLocaleDateString("ko-KR", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
};

export default BookViewerCard;
