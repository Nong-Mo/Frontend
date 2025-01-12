import React, {useEffect, useLayoutEffect, useState} from "react";
import {NavBar} from "../components/common/NavBar.tsx";
import CollectionGrid, { CollectionItemProps } from "../components/viewer/CollectionGrid";
import {FaPlus} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import { API_TYPE } from "../routes/constants";
import { getItems } from "../api/item.ts";


export type APITypeKeys = typeof API_TYPE[keyof typeof API_TYPE];

interface LibraryViewerProps {
    collectionType: APITypeKeys;  // 'book' | 'receipt' 타입이 됨
}

const LibraryViewer = ({collectionType} : LibraryViewerProps) => {
    // 라이브러리 타이틀
    const [viewerTitle, setViewerTitle] = useState('');
    // 라이브러리 설명 텍스트 - Empty and Non-Empty
    const [viewerEmptyText, setViewerEmptyText] = useState('');
    const [viewerText, setViewerText] = useState('');
    // 라이브러리 컬렉션 아이템 CollectionItemProps
    const [collectionItems, setCollectionItems] = useState<CollectionItemProps[]>([]);
    // 이동을 위한 Navigate
    const navigate = useNavigate();

    // 필터 버튼 상태 변화를 위한 State
    const [filterButton, setFilterButton] = useState(0);

    useEffect(() => {
        const fetchCollectionItems = async () => {
            try {
                const data = await getItems(collectionType);
                if (collectionType === API_TYPE.BOOK) {
                    setViewerTitle('책 보관함');
                    setViewerEmptyText('보관함이 비었어요!\n책을 추가해 주세요.');
                    setViewerText('감상하고 싶은\n책을 선택해 주세요.');

                } else if (collectionType === API_TYPE.RECEIPT) {
                    setViewerTitle('영수증 보관함');
                    setViewerEmptyText('영수증이 비었어요!\n추가해 주세요.');
                    setViewerText('확인하고 싶은\n영수증을 선택해 주세요.');
                }
                else {
                    setViewerTitle('테스트');
                    setViewerEmptyText('Empty 테스트\n테스트');
                    setViewerText('테스트\n테스트');
                }
                setCollectionItems(data.fileList);
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
            }
        };

        fetchCollectionItems();
    }, [collectionType]);

    const onClickAllButton = () => {
        setFilterButton(0);
    }
    const onClickRecentButton = () => {
        setFilterButton(1);
    }

    // 나중에 Viewer Filter를 통해서 필터링을 해주어야 한다.
    const updateViewFilter = () => {
    }

    const onClickAddButton = () => {
        navigate(`/scan/${collectionType}`);
    }

    return (
        <div className="w-full z-10">
            <div className="content-wrapper ml-[32px] mr-[32px] mt-[15px] md-[34px] w-[350px] flex flex-col items-center h-[896px]">
                <div className="w-full">
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
                </div>
                <div className="w-full">
                    <h1 className="min-h-[100px] mt-[15px] primary-info-text leading-50 whitespace-pre-line">
                        {collectionItems.length === 0
                            ? <>{viewerEmptyText}</>
                            : <>{viewerText}</>
                        }
                    </h1>
                </div>
                <div className="w-full h-[67.2px] mt-[30px]">
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
                <div className="h-[550px] overflow-y-auto w-full mt-[30px] [&::-webkit-scrollbar]:hidden">
                    <CollectionGrid items={collectionItems} storageName={collectionType}/>
                </div>
            </div>
        </div>
    );
};

export default LibraryViewer;