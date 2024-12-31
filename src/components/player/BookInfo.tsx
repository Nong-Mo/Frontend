import React from 'react';

interface BookInfoProps {
  bookName: string;
  createdAt: string;
}

export const BookInfo: React.FC<BookInfoProps> = ({ bookName, createdAt }) => {
  return (
    <div className="flex flex-col w-full gap-2 mb-8">
      <div className="text-white text-xl font-semibold">
        {bookName}
      </div>
      <div className="text-white opacity-50">
        {createdAt}
      </div>
    </div>
  );
};