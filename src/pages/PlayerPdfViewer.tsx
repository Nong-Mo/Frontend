import React, {useEffect, useState, useCallback, useRef} from 'react';
import {NavBar} from '../components/common/NavBar';
import ConvertModal from '../components/player/ConvertModal';
import axiosInstance from "../api/axios.ts";
import {StorageResponse} from "../services/audioService.ts";
import {useParams} from 'react-router-dom';

interface PageInfo {
    url: string;
    pageNumber: number;
    isLoaded: boolean;
}

const PlayerPdfViewer: React.FC = () => {
    const [pdfPages, setPdfPages] = useState<PageInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [pdfTitle, setPdfTitle] = useState('Empty');

    const pdfInstanceRef = useRef<any>(null);
    const loadingPagesRef = useRef<Set<number>>(new Set());
    const pageCache = useRef<Map<number, string>>(new Map());
    const containerRef = useRef<HTMLDivElement>(null);
    const pageDimensionsRef = useRef<Map<number, { width: number; height: number }>>(new Map());
    const {id} = useParams();

    const renderPage = useCallback(async (pageNum: number) => {
        try {
            if (!pdfInstanceRef.current || loadingPagesRef.current.has(pageNum)) {
                return null;
            }

            if (pageCache.current.has(pageNum)) {
                return {
                    url: pageCache.current.get(pageNum),
                    pageNumber: pageNum,
                    isLoaded: true
                };
            }

            loadingPagesRef.current.add(pageNum);

            const page = await pdfInstanceRef.current.getPage(pageNum);

            const containerWidth = containerRef.current?.clientWidth || 350;
            const viewport = page.getViewport({scale: 1.0});
            const scale = (containerWidth / viewport.width) * 2;
            const scaledViewport = page.getViewport({scale});

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) {
                throw new Error('Canvas context creation failed');
            }

            canvas.height = scaledViewport.height;
            canvas.width = scaledViewport.width;

            pageDimensionsRef.current.set(pageNum, {
                width: scaledViewport.width,
                height: scaledViewport.height
            });

            await page.render({
                canvasContext: context,
                viewport: scaledViewport,
                intent: 'display',
                enableWebGL: true,
                renderInteractiveForms: false
            }).promise;

            const quality = getImageQuality(pageNum);
            const url = canvas.toDataURL('image/jpeg', quality);

            context.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = 0;
            canvas.height = 0;

            pageCache.current.set(pageNum, url);
            loadingPagesRef.current.delete(pageNum);

            return {
                url,
                pageNumber: pageNum,
                isLoaded: true
            };
        } catch (error) {
            console.error(`Error rendering page ${pageNum}:`, error);
            loadingPagesRef.current.delete(pageNum);
            return null;
        }
    }, []);

    const getImageQuality = (pageNum: number) => {
        const distanceFromCurrent = Math.abs(pageNum - currentPage);
        if (distanceFromCurrent === 0) return 0.8;
        if (distanceFromCurrent === 1) return 0.6;
        return 0.4;
    };

    const observerRef = useRef<IntersectionObserver | null>(null);

    const initIntersectionObserver = useCallback(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const pageNum = parseInt(entry.target.getAttribute('data-page') || '0', 10);
                        if (pageNum > 0) {
                            loadPage(pageNum);
                        }
                    }
                });
            },
            {
                root: null,
                rootMargin: '200px',
                threshold: 0.1
            }
        );
    }, []);

    const loadPage = useCallback(async (pageNum: number) => {
        if (pageNum > totalPages || pageNum < 1) return;

        const existingPage = pdfPages.find(p => p.pageNumber === pageNum);
        if (existingPage?.isLoaded) return;

        const renderedPage = await renderPage(pageNum);
        if (renderedPage) {
            setPdfPages(prev => {
                const newPages = [...prev];
                const index = newPages.findIndex(p => p.pageNumber === pageNum);
                if (index >= 0) {
                    newPages[index] = renderedPage;
                } else {
                    newPages.push(renderedPage);
                }
                return newPages.sort((a, b) => a.pageNumber - b.pageNumber);
            });
        }
    }, [totalPages, pdfPages, renderPage]);

    useEffect(() => {
        const loadPdf = async () => {
            if (!id) return;

            setIsLoading(true);
            setError(null);

            try {
                if (!window['pdfjs-dist/build/pdf']) {
                    await new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
                        script.onload = resolve;
                        script.onerror = reject;
                        document.head.appendChild(script);
                    });
                }

                const pdfjsLib = window['pdfjs-dist/build/pdf'];
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

                const {data} = await axiosInstance.get<StorageResponse>(`storage/files/${id}`);
                setPdfTitle(data.fileName);
                const pdfUrl = data.relatedFile?.fileUrl;

                if (!pdfUrl) throw new Error('PDF 파일을 찾을 수 없습니다.');

                try {
                    const loadingTask = pdfjsLib.getDocument(pdfUrl);
                    loadingTask.onProgress = ({loaded, total}) => {
                        const progress = total ? Math.round((loaded / total) * 100) : 0;
                        setLoadingProgress(progress);
                    };

                    const pdf = await loadingTask.promise;
                    pdfInstanceRef.current = pdf;
                    setTotalPages(pdf.numPages);

                    const placeholders = Array.from(
                        {length: pdf.numPages},
                        (_, i) => ({
                            url: '',
                            pageNumber: i + 1,
                            isLoaded: false
                        })
                    );
                    setPdfPages(placeholders);

                    // 초기 5페이지 프리로드
                    const initialPages = await Promise.all(
                        Array.from({length: Math.min(5, pdf.numPages)}, (_, i) => i + 1)
                            .map(pageNum => renderPage(pageNum))
                    );

                    setPdfPages(prev => {
                        const newPages = [...prev];
                        initialPages.forEach((page, index) => {
                            if (page) {
                                const pageIndex = newPages.findIndex(p => p.pageNumber === index + 1);
                                if (pageIndex >= 0) {
                                    newPages[pageIndex] = page;
                                }
                            }
                        });
                        return newPages;
                    });

                } catch (pdfError) {
                    console.error('PDF loading error:', pdfError);
                    throw new Error('PDF 로딩에 실패했습니다.');
                }
            } catch (error) {
                console.error('PDF 로드 오류:', error);
                setError(error instanceof Error ? error.message : 'PDF 파일을 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        loadPdf();
        initIntersectionObserver();

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
            pageCache.current.clear();
        };
    }, [id, initIntersectionObserver, renderPage]);

    useEffect(() => {
        const observer = observerRef.current;
        if (!observer) return;

        const placeholders = document.querySelectorAll('.pdf-page-placeholder');
        placeholders.forEach(placeholder => {
            observer.observe(placeholder);
        });

        return () => {
            placeholders.forEach(placeholder => {
                observer.unobserve(placeholder);
            });
        };
    }, [pdfPages]);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const containerHeight = container.clientHeight;

        const currentPageElement = Array.from(container.children).find((child) => {
            const rect = child.getBoundingClientRect();
            return rect.top <= containerHeight && rect.bottom >= 0;
        });

        if (currentPageElement) {
            const pageNum = parseInt(currentPageElement.getAttribute('data-page') || '1', 10);
            setCurrentPage(pageNum);

            const pagesToPreload = [
                pageNum - 3,
                pageNum - 2,
                pageNum - 1,
                pageNum + 1,
                pageNum + 2,
                pageNum + 3
            ].filter(num => num > 0 && num <= totalPages);

            Promise.all(
                pagesToPreload.map(async (num) => {
                    await new Promise(resolve => setTimeout(resolve, Math.abs(num - pageNum) * 100));
                    loadPage(num);
                })
            );
        }

        setPdfPages(prev => prev.map(page => {
            if (Math.abs(page.pageNumber - currentPage) > 5) {
                return {
                    ...page,
                    url: '',
                    isLoaded: false
                };
            }
            return page;
        }));
    }, [currentPage, totalPages, loadPage]);

    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    return (
        <div className="mt-[15px] w-full flex flex-col min-h-screen z-10">
            <NavBar
                onMenuClick={handleModalOpen}
                title='PDF 뷰어'
                hideLeftIcon={false}
                showMenu={false}
                iconNames={{
                    backIcon: "뒤로가기",
                    convertIcon: "변환하기",
                    aiIcon: "AI 로봇"
                }}
                backPageName={`/library/${useParams().type}`}
                rightIcons={['convert', 'ai']}
            />

            <div className="flex justify-center">
                <div className="w-[350px] h-[768px]"
                     ref={containerRef}>
                    <div className="w-full px-4 py-3 border-b flex flex-col items-center border-gray-700 text-white">
                        <h1 className="text-[25px] text-center font-bold whitespace-nowrap overflow-hidden text-ellipsis w-full">{pdfTitle}</h1>
                    </div>

                    <div
                        className="flex-1 w-full h-[calc(100%-64px)] overflow-auto"
                        onScroll={handleScroll}
                    >
                        {isLoading && (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-700">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-700 mb-2"></div>
                                <p className="text-sm">{loadingProgress}% 로딩중...</p>
                            </div>
                        )}

                        {!isLoading && error && (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    <p>{error}</p>
                                </div>
                            </div>
                        )}

                        {!isLoading && !error && pdfPages.length > 0 && (
                            <div className="w-full">
                                {pdfPages.map((page) => (
                                    <div
                                        key={page.pageNumber}
                                        className="pdf-page-placeholder w-full mb-4"
                                        data-page={page.pageNumber}
                                    >
                                        {page.isLoaded ? (
                                            <img
                                                src={page.url}
                                                alt={`PDF page ${page.pageNumber}`}
                                                className="w-full h-auto"
                                                loading="lazy"
                                                onError={() => {
                                                    setError('PDF 미리보기를 표시하는데 실패했습니다.');
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="w-full flex items-center justify-center transition-all duration-200"
                                                style={{
                                                    height: pageDimensionsRef.current.get(page.pageNumber)?.height || 'auto',
                                                    minHeight: '300px'
                                                }}
                                            >
                                                <div className="flex flex-col items-center space-y-2">
                                                    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                                    <p className="text-gray-400 text-sm">페이지 {page.pageNumber}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConvertModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
            />
        </div>
    );
};

export default PlayerPdfViewer;