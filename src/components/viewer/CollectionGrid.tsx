import React, { useState, useEffect } from 'react';
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
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
    const [localItems, setLocalItems] = useState<CollectionItemProps[]>([]);

    // items prop이 변경될 때 localItems 업데이트
    useEffect(() => {
        setLocalItems([...items].reverse());
    }, [items]);

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
        navigate(`/player/${storageName}/audio/${fileID}`);
    };

    const handleDeleteItem = async (fileID: string) => {
        setLoading(prev => ({ ...prev, [fileID]: true }));

        try {
            await axiosInstance.delete(`/storage/files/${fileID}`);
            const updatedItems = items.filter(item => item.fileID !== fileID);
            setLocalItems([...updatedItems].reverse());
            onItemsChange?.(updatedItems);
        } catch (error) {
            console.error('파일 삭제 실패:', error);
        } finally {
            setLoading(prev => ({ ...prev, [fileID]: false }));
            window.location.reload();
        }
    };

    return (
        <div className="w-full overflow-y-auto h-full [&::-webkit-scrollbar]:hidden">
            <div className="grid grid-cols-2 gap-4 pb-8">
                {localItems.map(item => (
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
    );
};

export default CollectionGrid;