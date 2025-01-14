import React, {useEffect, useState} from "react";
import {NavBar} from "../components/common/NavBar.tsx";
import CollectionGrid, { CollectionItemProps } from "../components/viewer/CollectionGrid";
import {FaPlus} from "react-icons/fa";
import {useLocation, useNavigate} from "react-router-dom";
import { API_TYPE } from "../routes/constants";
import { getItems } from "../api/item.ts";
import { Loader2 } from "lucide-react";

export type APITypeKeys = typeof API_TYPE[keyof typeof API_TYPE];

interface LibraryViewerProps {
    collectionType: APITypeKeys;
}

const LibraryViewer = ({collectionType} : LibraryViewerProps) => {
    const [viewerTitle, setViewerTitle] = useState('');
    const [viewerEmptyText, setViewerEmptyText] = useState('');
    const [viewerText, setViewerText] = useState('');
    const [collectionItems, setCollectionItems] = useState<CollectionItemProps[]>([]);
    const [filterButton, setFilterButton] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const fetchData = async () => {
                await fetchCollectionItems();
                setLoading(false);
            };
            fetchData();
        }, 500);
    }, [location])

    const fetchCollectionItems = async () => {
        try {
            const data = await getItems(collectionType);
            console.log(data);

            if (collectionType === API_TYPE.BOOK) {
                setViewerTitle('책 보관함');
                setViewerEmptyText('보관함이 비었어요!\n책을 추가해 주세요.');
                setViewerText('감상하고 싶은\n책을 선택해 주세요.');
            } else if (collectionType === API_TYPE.RECEIPT) {
                setViewerTitle('영수증 보관함');
                setViewerEmptyText('영수증이 비었어요!\n추가해 주세요.');
                setViewerText('확인하고 싶은\n영수증을 선택해 주세요.');
            } else {
                setViewerTitle('테스트');
                setViewerEmptyText('Empty 테스트\n테스트');
                setViewerText('테스트\n테스트');
            }
            setCollectionItems(data.fileList);
        } catch (error) {
            console.error('데이터 로딩 실패:', error);
        }
    };

    const handleItemsChange = async () => {
        setCollectionItems([]);
        await fetchCollectionItems();
    };

    const onClickAllButton = () => {
        setFilterButton(0);
    }

    const onClickRecentButton = () => {
        setFilterButton(1);
    }

    const onClickAddButton = () => {
        navigate(`/scan/${collectionType}`);
    }

    return (
        <div className="w-full z-10 mt-[15px]">
            <NavBar
                title={viewerTitle}
                hideLeftIcon={false}
                showMenu={false}
                iconNames={{
                    backIcon: "뒤로가기",
                    aiIcon: "AI 로봇"
                }}
                backPageName='/home'
                rightIcons={['ai']}
            />
            <div className="w-full flex flex-col items-center">
                {loading ? (
                    <div className="flex items-center justify-center h-screen">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <>
                        <div className="w-[350px]">
                            <h1 className="pt-[15px] min-h-[115px] primary-info-text leading-50 whitespace-pre-line">
                                {collectionItems.length === 0
                                    ? <>{viewerEmptyText}</>
                                    : <>{viewerText}</>
                                }
                            </h1>
                        </div>
                        <div className="w-[350px] h-[67.2px] mt-[30px]">
                            <button className="w-full h-full flex items-center justify-center rounded-[16.5px] bg-[#262A34]"
                                    onClick={onClickAddButton}>
                                <FaPlus className="w-[15.14px] h-[16.8px] text-white"/>
                            </button>
                        </div>
                        <div className="flex justify-center h-8 mt-[30px]">
                            <button
                                onClick={onClickAllButton}
                                className={`w-[93px] h-full text-white mr-[5px] ${
                                    filterButton === 0 ? 'bg-[#246BFD] rounded-[25px]' : ''
                                }`}
                            >
                                전체 목록
                            </button>
                            <button
                                onClick={onClickRecentButton}
                                className={`w-[93px] h-full text-white ml-[5px] ${
                                    filterButton === 1 ? 'bg-[#246BFD] rounded-[25px]' : ''
                                }`}
                            >
                                최근 파일
                            </button>
                        </div>
                        <div className="w-[350px] h-[464px] mt-[30px] [&::-webkit-scrollbar]:hidden">
                            <CollectionGrid
                                items={collectionItems}
                                storageName={collectionType}
                                onItemsChange={handleItemsChange}
                                loading={loading}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LibraryViewer;