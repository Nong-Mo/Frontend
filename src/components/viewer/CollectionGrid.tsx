import React from 'react';
import CollectionItem from "./CollectionItem.tsx";

export interface CollectionItemProps {
    fileID: string;
    fileName: string;
    uploadDate: string;
}

interface CollectionGridProps {
    items : CollectionItemProps[];
}

const CollectionGrid = ({items} : CollectionGridProps) => {

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    return (
        <div className="w-full">
            <div className="h-full">
                <div className="grid grid-cols-2 gap-[15px] pb-[30px]">
                    {items?.map(item => (
                        <CollectionItem
                            key={item.fileID}
                            title={item.fileName}
                            date={formatDate(item.uploadDate)} // 포맷팅된 날짜 전달
                            itemType="BOOK"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CollectionGrid;