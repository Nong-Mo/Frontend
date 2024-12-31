import React from "react";

interface BookViewerCardProps {
  title: string;
  thumbnail: File | URL;
  createdAt: Date;
}

const BookViewerCard = ({
  title,
  thumbnail,
  createdAt,
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

      {/* Book Icon */}
      <div className="absolute top-4 left-4">
        <div className="w-12 h-12 rounded-lg bg-purple-400" />
      </div>

      {/* Menu Button */}
      <button className="absolute top-4 right-4 text-white">⋮</button>

      {/* Title and Date */}
      <div className="absolute bottom-4 left-4 text-white">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm mt-1">
          {createdAt.toLocaleDateString("ko-KR", {
            year: "numeric",
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
