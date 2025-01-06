import React, {useEffect, useState} from "react";
import {NavBar} from "../components/common/NavBar.tsx";
import CollectionGrid from "../components/viewer/CollectionGrid";
import {FaPlus} from "react-icons/fa";

const LibraryViewer = () => {
    const [viewerTitle, setViewerTitle] = useState('책 보관함');
    const [collectionItems, setCollectionItems] = useState([]);
    const [collectionItemType, setCollectionItemType] = useState('BOOK');

    const [filterButton, setFilterButton] = useState(0);

    const onClickAllButton = () => {
        setFilterButton(0);
    }
    const onClickRecentButton = () => {
        setFilterButton(1);
    }
    const onClickAddButton = () => {
        const newItem = {
            id: collectionItems.length + 1,
            title: `제목 ${collectionItems.length + 1}`,
            date: new Date().toLocaleString(),
            itemType: collectionItemType
        };

        setCollectionItems(prevItems => [...prevItems, newItem]);
    }

    // 추후 UseEffect를 통해서 호출받은 API에 따라서 값을 변경해주어야 한다.

    return (
        <div className="w-full z-10">
            <div className="content-wrapper ml-[32px] mr-[32px] mt-[15px] md-[34px] w-[350px] flex flex-col items-center h-[896px]">
                <div className="w-full">
                    <NavBar title={viewerTitle}
                            rightIcon="search"/>
                </div>
                <div className="w-full">
                    <h1 className="mt-[15px] primary-info-text leading-50">
                        {collectionItems.length === 0
                            ? <>보관함이 비었어요!<br/>책을 추가해 주세요.</>
                            : <>감상하고 싶은<br/>책을 선택해 주세요.</>
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
                        최근 읽은 책
                    </button>
                </div>
                <div className="h-[550px] overflow-y-auto w-full mt-[30px] [&::-webkit-scrollbar]:hidden">
                    <CollectionGrid items={collectionItems}/>
                </div>
            </div>
        </div>
    );
};

export default LibraryViewer;