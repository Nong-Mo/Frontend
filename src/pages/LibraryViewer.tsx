import React, { useEffect, useState, useMemo } from "react";
import { NavBar } from "../components/common/NavBar.tsx";
import CollectionGrid, { CollectionItemProps } from "../components/viewer/CollectionGrid";
import { FaPlus } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { API_TYPE } from "../routes/constants";
import { getItems } from "../api/item.ts";
import { Loader2, AlertCircle } from "lucide-react";

export type APITypeKeys = typeof API_TYPE[keyof typeof API_TYPE];

interface LibraryViewerProps {
    collectionType: APITypeKeys;
}

// 뷰어 타입별 텍스트 설정
const VIEWER_CONFIGS = {
    [API_TYPE.BOOK]: {
        title: '책 보관함',
        emptyText: '보관함이 비었어요!\n책을 추가해 주세요.',
        viewerText: '감상하고 싶은\n책을 선택해 주세요.'
    },
    [API_TYPE.RECEIPT]: {
        title: '영수증 보관함',
        emptyText: '영수증이 비었어요!\n추가해 주세요.',
        viewerText: '확인하고 싶은\n영수증을 선택해 주세요.'
    },
    default: {
        title: '테스트',
        emptyText: 'Empty 테스트\n테스트',
        viewerText: '테스트\n테스트'
    }
};

const LibraryViewer = ({ collectionType }: LibraryViewerProps) => {
    const [collectionItems, setCollectionItems] = useState<CollectionItemProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();

    // 뷰어 설정 메모이제이션
    const viewerConfig = useMemo(() =>
            VIEWER_CONFIGS[collectionType] || VIEWER_CONFIGS.default
        , [collectionType]);

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            if (!mounted) return;

            setLoading(true);
            setError(null);

            try {
                const data = await getItems(collectionType);
                if (mounted) {
                    setCollectionItems(data.fileList);
                }
            } catch (error) {
                if (mounted) {
                    setError('데이터를 불러오는 중 오류가 발생했습니다.');
                    console.error('데이터 로딩 실패:', error);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            mounted = false;
        };
    }, [collectionType, location]);

    const handleItemsChange = async () => {
        setCollectionItems([]);
        setLoading(true);
        setError(null);

        try {
            const data = await getItems(collectionType);
            setCollectionItems(data.fileList);
        } catch (error) {
            setError('데이터를 갱신하는 중 오류가 발생했습니다.');
            console.error('데이터 갱신 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500"/>
            </div>
        );
    }

    return (
        <div className="w-full z-10 mt-[15px]">
            <NavBar
                title={viewerConfig.title}
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
                {error && (
                    <div className="w-[350px] mb-4 p-4 bg-red-100 border border-red-400 rounded-lg flex items-center text-red-700">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>{error}</span>
                    </div>
                )}
                <div className="w-[350px]">
                    <h1 className="pt-[15px] min-h-[115px] primary-info-text leading-50 whitespace-pre-line">
                        {collectionItems.length === 0
                            ? viewerConfig.emptyText
                            : viewerConfig.viewerText
                        }
                    </h1>
                </div>
                <div className="w-[350px] h-[67.2px] mt-[30px]">
                    <button
                        className="w-full h-full flex items-center justify-center rounded-[16.5px] bg-[#262A34]"
                        onClick={() => navigate(`/scan/${collectionType}`)}>
                        <FaPlus className="w-[15.14px] h-[16.8px] text-white"/>
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
            </div>
        </div>
    );
};

export default LibraryViewer;