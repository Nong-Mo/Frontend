import React from 'react';

interface BookInfoProps {
  bookName: string;
}

export const BookInfo: React.FC<BookInfoProps> = ({ bookName } : BookInfoProps) => {
  return (
    <div className="flex flex-col w-full gap-2 mb-8 items-center text-center">
      <div className="text-white text-xl font-semibold">
        {bookName}
      </div>
    </div>
  );
};