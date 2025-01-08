import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavBar } from '../components/common/NavBar';
import { useScanStore } from '../hooks/useScanStore';

interface Vertex {
    x: number;
    y: number;
}

interface LocationState {
    photoId: string;
    photoData: string;
}

interface ImageBounds {
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
}

const ScanVertex: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const svgRef = useRef<SVGSVGElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { photoId, photoData } = location.state as LocationState;
    const { updatePhotoVertices } = useScanStore();
    const [vertices, setVertices] = useState<Vertex[]>([]);
    const [activeVertex, setActiveVertex] = useState<number | null>(null);
    const [imageBounds, setImageBounds] = useState<ImageBounds | null>(null);
    const [originalImageSize, setOriginalImageSize] = useState<{ width: number; height: number } | null>(null);

    // 원본 이미지 크기와 화면 크기 간의 비율 계산
    const calculateImageScale = (imgWidth: number, imgHeight: number, containerWidth: number, containerHeight: number) => {
        const widthScale = containerWidth / imgWidth;
        const heightScale = containerHeight / imgHeight;
        return Math.min(widthScale, heightScale);
    };

    // 화면 좌표를 원본 이미지 좌표로 변환
    const screenToImageCoordinates = (screenX: number, screenY: number): Vertex => {
        if (!imageBounds || !originalImageSize) return { x: screenX, y: screenY };

        const relativeX = (screenX - imageBounds.x) / imageBounds.scale;
        const relativeY = (screenY - imageBounds.y) / imageBounds.scale;

        return {
            x: Math.max(0, Math.min(originalImageSize.width, relativeX)),
            y: Math.max(0, Math.min(originalImageSize.height, relativeY))
        };
    };

    // 원본 이미지 좌표를 화면 좌표로 변환
    const imageToScreenCoordinates = (imageX: number, imageY: number): Vertex => {
        if (!imageBounds) return { x: imageX, y: imageY };

        return {
            x: imageX * imageBounds.scale + imageBounds.x,
            y: imageY * imageBounds.scale + imageBounds.y
        };
    };

    const calculateImageBounds = () => {
        if (!imgRef.current || !svgRef.current || !containerRef.current) return;

        const img = imgRef.current;
        const svg = svgRef.current;
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();

        // 원본 이미지 크기 저장
        const imgNaturalWidth = img.naturalWidth;
        const imgNaturalHeight = img.naturalHeight;
        setOriginalImageSize({ width: imgNaturalWidth, height: imgNaturalHeight });

        // 스케일 계산
        const scale = calculateImageScale(
            imgNaturalWidth,
            imgNaturalHeight,
            containerRect.width,
            containerRect.height
        );

        // 실제 표시될 이미지 크기
        const scaledWidth = imgNaturalWidth * scale;
        const scaledHeight = imgNaturalHeight * scale;

        // 중앙 정렬을 위한 오프셋 계산
        const offsetX = (containerRect.width - scaledWidth) / 2;
        const offsetY = (containerRect.height - scaledHeight) / 2;

        const bounds = {
            x: offsetX,
            y: offsetY,
            width: scaledWidth,
            height: scaledHeight,
            scale: scale
        };

        setImageBounds(bounds);

        // 초기 정점 설정
        if (vertices.length === 0) {
            // 화면 좌표로 초기 정점 설정
            setVertices([
                { x: offsetX, y: offsetY }, // 좌상단
                { x: offsetX + scaledWidth, y: offsetY }, // 우상단
                { x: offsetX + scaledWidth, y: offsetY + scaledHeight }, // 우하단
                { x: offsetX, y: offsetY + scaledHeight } // 좌하단
            ]);
        }
    };

    useEffect(() => {
        const img = imgRef.current;
        if (img) {
            if (img.complete) {
                calculateImageBounds();
            } else {
                img.onload = calculateImageBounds;
            }
        }

        const handleResize = () => {
            calculateImageBounds();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getEventCoordinates = (e: MouseEvent | TouchEvent): { clientX: number; clientY: number } => {
        if ('touches' in e) {
            const touch = e.touches[0];
            return {
                clientX: touch.clientX,
                clientY: touch.clientY
            };
        }
        return {
            clientX: (e as MouseEvent).clientX,
            clientY: (e as MouseEvent).clientY
        };
    };

    const handleVertexDrag = (e: MouseEvent | TouchEvent) => {
        if (activeVertex === null || !svgRef.current || !imageBounds) return;

        e.preventDefault();
        e.stopPropagation();

        const { clientX, clientY } = getEventCoordinates(e);
        const svgRect = svgRef.current.getBoundingClientRect();

        // 화면 좌표 계산
        let screenX = clientX - svgRect.left;
        let screenY = clientY - svgRect.top;

        // 이미지 영역 내로 제한
        screenX = Math.max(imageBounds.x, Math.min(screenX, imageBounds.x + imageBounds.width));
        screenY = Math.max(imageBounds.y, Math.min(screenY, imageBounds.y + imageBounds.height));

        // 정점 업데이트
        setVertices(prev => {
            const updated = [...prev];
            updated[activeVertex] = { x: screenX, y: screenY };
            return updated;
        });
    };

    const handleVertexDragStart = (index: number, e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        setActiveVertex(index);
    };

    const handleVertexDragEnd = () => {
        setActiveVertex(null);
    };

    const handleConfirm = () => {
        if (!imageBounds || !originalImageSize) return;

        // 화면 좌표를 원본 이미지 좌표로 변환하여 저장
        const normalizedVertices = vertices.map(vertex => 
            screenToImageCoordinates(vertex.x, vertex.y)
        );

        updatePhotoVertices(photoId, normalizedVertices);
        navigate(-1);
    };

    useEffect(() => {
        if (activeVertex !== null) {
            document.addEventListener('mousemove', handleVertexDrag);
            document.addEventListener('mouseup', handleVertexDragEnd);
            document.addEventListener('touchmove', handleVertexDrag, { passive: false });
            document.addEventListener('touchend', handleVertexDragEnd);

            return () => {
                document.removeEventListener('mousemove', handleVertexDrag);
                document.removeEventListener('mouseup', handleVertexDragEnd);
                document.removeEventListener('touchmove', handleVertexDrag);
                document.removeEventListener('touchend', handleVertexDragEnd);
            };
        }
    }, [activeVertex, imageBounds]);

    return (
        <div className="z-50 w-full h-[896px] flex flex-col select-none">
            <NavBar
                title="영역 설정"
                hideLeftIcon={false}
                showMenu={false}
                iconNames={{
                    backIcon: "뒤로가기"
                }}
                rightIcons={[]}
            />
            
            <div ref={containerRef} className="relative w-[414px] h-[615px] bg-gray-900">
                <img
                    ref={imgRef}
                    src={photoData}
                    alt="scanned"
                    className="absolute w-full h-full object-contain"
                    draggable={false}
                />
                
                <svg
                    ref={svgRef}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ touchAction: 'none', pointerEvents: 'none' }}
                >
                    {vertices.length > 0 && imageBounds && (
                        <>
                            <path
                                d={`M ${vertices.map(v => `${v.x},${v.y}`).join(' L ')} Z`}
                                stroke="#2563EB"
                                strokeWidth="2"
                                fill="none"
                            />
                            
                            {vertices.map((vertex, index) => (
                                <circle
                                    key={index}
                                    cx={vertex.x}
                                    cy={vertex.y}
                                    r="12"
                                    fill="#2563EB"
                                    strokeWidth="2"
                                    stroke="#ffffff"
                                    className="cursor-move"
                                    style={{ pointerEvents: 'auto' }}
                                    onMouseDown={(e) => handleVertexDragStart(index, e)}
                                    onTouchStart={(e) => handleVertexDragStart(index, e)}
                                />
                            ))}
                        </>
                    )}
                </svg>
            </div>

            <div className="flex justify-center bg-[#181A20] flex-col h-[187.5px]">
                <button
                    onClick={handleConfirm}
                    className="mx-auto text-white text-[25px] font-bold"
                >
                    영역 설정 완료
                </button>
            </div>
        </div>
    );
};

export default ScanVertex;