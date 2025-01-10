import React from 'react';
import { useNavigate } from 'react-router-dom';
import CollectionItem from "./CollectionItem.tsx";

export interface CollectionItemProps {
    fileID: string;
    fileName: string;
    uploadDate: string;
}

interface CollectionGridProps {
    storageName : string;
    items : CollectionItemProps[];
}

const CollectionGrid = ({items, storageName} : CollectionGridProps) => {
    const navigate = useNavigate();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const handleItemClick = (fileID: string) => {
        switch (storageName) {
            case 'book':
                navigate(`/player/audio/${fileID}`);
                break;
            case 'receipt':
                navigate(`/player/pdf/${fileID}`);
                break;
            default:
                break;
        }
    };

    return (
        <div className="w-full">
            <div className="h-full">
                <div className="grid grid-cols-2 gap-4 pb-8">
                    {items?.map(item => (
                        <CollectionItem
                            key={item.fileID}
                            title={item.fileName}
                            date={formatDate(item.uploadDate)}
                            onClickItem={() => handleItemClick(item.fileID)}
                            itemType={storageName}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CollectionGrid;