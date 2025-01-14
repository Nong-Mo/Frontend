import React from 'react';
import { FaBook, FaReceipt, FaTrash } from 'react-icons/fa';
import { IoMdMore } from "react-icons/io";
import { Menu } from '@headlessui/react';
import axiosInstance from "../../api/axios";

interface CollectionItemProps {
    id: string;
    title: string;
    date: string;
    itemType: string;
    onClickItem?: () => void;
    onDeleteSuccess?: () => void;
}


const CollectionItem = ({
                            id,
                            title,
                            date,
                            itemType,
                            onClickItem,
                            onDeleteSuccess
                        }: CollectionItemProps) => {
    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();

        try {
            await axiosInstance.delete(`/storage/files/${id}`);
            onDeleteSuccess?.();
        } catch (error) {
            console.error('파일 삭제 실패:', error);
            // 에러 처리 로직 추가 가능
            // 401 에러는 axiosInstance interceptor에서 자동으로 처리됨
        }
    };

    const getItemIcon = () => {
        const iconSize = 15;

        switch (itemType) {
            case 'book':
                return <FaBook size={iconSize}/>;
            case 'receipt':
                return <FaReceipt size={iconSize}/>;
            default:
                return null;
        }
    };

    const getIconBackgroundColor = () => {
        switch (itemType) {
            case 'book':
                return 'bg-[#FFDD72]';
            case 'receipt':
                return 'bg-[#94F0F0]';
            default:
                return 'bg-gray-400';
        }
    };

    return (
        <button
            className="w-[165px] h-[165px] bg-[#262A34] rounded-[12px] text-left cursor-pointer hover:bg-[#2d3341] transition-colors"
            onClick={onClickItem}
            type="button"
            aria-label={`${title} 열기`}
        >
            <div className="w-full h-full pl-[15px] pr-[15px] pt-[19px] pb-[18.5px]">
                <div className="flex justify-between items-center w-full h-[31px]">
                    <div className={`flex justify-center items-center w-[31px] h-[31px] ${getIconBackgroundColor()} rounded-[12px]`}>
                        {getItemIcon()}
                    </div>
                    <Menu as="div" className="relative">
                        <Menu.Button
                            className="p-1 hover:bg-[#3d4251] rounded-full transition-colors cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                            aria-label="더보기"
                        >
                            <IoMdMore size={20} className="text-white"/>
                        </Menu.Button>
                        <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right bg-[#262A34] rounded-[12px] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                            <div className="px-1 py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active ? 'bg-[#2d3341]' : ''
                                            } text-[#FF6B6B] group flex rounded-[12px] items-center w-full px-3 py-2 text-sm`}
                                            onClick={handleDelete}
                                        >
                                            <FaTrash className="mr-2 h-4 w-4" />
                                            삭제
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Menu>
                </div>
                <div className="mt-[16.3px] h-[48px]">
                    <h1 className="leading-[24px] text-white font-bold text-[17.5px]">{title}</h1>
                </div>
                <div className="mt-[16.7px]">
                    <h1 className="text-white text-xs">{date}</h1>
                </div>
            </div>
        </button>
    );
};

export default CollectionItem;