import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import CollectionItem from "./CollectionItem";

export interface CollectionItemProps {
    fileID: string;
    fileName: string;
    uploadDate: string;
}

interface CollectionGridProps {
    storageName: string;
    items: CollectionItemProps[];
    onItemsChange?: (items: CollectionItemProps[]) => void;
}

const CollectionGrid = ({ items, storageName, onItemsChange }: CollectionGridProps) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<{[key: string]: boolean}>({});

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
                navigate(`/player/${storageName}/audio/${fileID}`);
                break;
            case 'receipt':
                navigate(`/player/${storageName}/pdf/${fileID}`);
                break;
            default:
                break;
        }
    };

    const handleDeleteItem = async (fileID: string) => {
        setLoading(prev => ({ ...prev, [fileID]: true }));

        try {
            console.log(fileID);

            await axiosInstance.delete(`/storage/files/${fileID}`);

            // 삭제된 아이템을 제외한 새로운 배열 생성
            const updatedItems = items.filter(item => item.fileID !== fileID);
            onItemsChange?.(updatedItems);
        } catch (error) {
            console.error('파일 삭제 실패:', error);
        } finally {
            setLoading(prev => ({ ...prev, [fileID]: false }));
        }
    };

    return (
        <div className="w-full">
            <div className="h-full">
                <div className="grid grid-cols-2 gap-4 pb-8">
                    {items?.map(item => (
                        <CollectionItem
                            key={item.fileID}
                            id={item.fileID}
                            title={item.fileName}
                            date={formatDate(item.uploadDate)}
                            onClickItem={() => handleItemClick(item.fileID)}
                            onDeleteSuccess={() => handleDeleteItem(item.fileID)}
                            itemType={storageName}
                            isDeleting={loading[item.fileID]}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CollectionGrid;