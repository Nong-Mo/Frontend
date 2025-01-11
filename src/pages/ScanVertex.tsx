import React, { useState, useEffect, useRef } from 'react';
import {useNavigate, useLocation, useParams} from 'react-router-dom';
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
    const type = useParams().type;
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
    const [isDragging, setIsDragging] = useState(false);

    // Prevent scroll when dragging
    useEffect(() => {
        const preventDefault = (e: TouchEvent | WheelEvent) => {
            if (isDragging) {
                e.preventDefault();
            }
        };

        if (isDragging) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('touchmove', preventDefault, { passive: false });
            document.addEventListener('wheel', preventDefault, { passive: false });
        }

        return () => {
            document.body.style.overflow = 'auto';
            document.removeEventListener('touchmove', preventDefault);
            document.removeEventListener('wheel', preventDefault);
        };
    }, [isDragging]);

    const calculateImageScale = (imgWidth: number, imgHeight: number, containerWidth: number, containerHeight: number) => {
        const widthScale = containerWidth / imgWidth;
        const heightScale = containerHeight / imgHeight;
        return Math.min(widthScale, heightScale);
    };

    const screenToImageCoordinates = (screenX: number, screenY: number): Vertex => {
        if (!imageBounds || !originalImageSize) return { x: screenX, y: screenY };

        const relativeX = (screenX - imageBounds.x) / imageBounds.scale;
        const relativeY = (screenY - imageBounds.y) / imageBounds.scale;

        return {
            x: Math.max(0, Math.min(originalImageSize.width, relativeX)),
            y: Math.max(0, Math.min(originalImageSize.height, relativeY))
        };
    };

    const calculateImageBounds = () => {
        if (!imgRef.current || !svgRef.current || !containerRef.current) return;
    
        const img = imgRef.current;
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
    
        const imgNaturalWidth = img.naturalWidth;
        const imgNaturalHeight = img.naturalHeight;
        setOriginalImageSize({ width: imgNaturalWidth, height: imgNaturalHeight });
    
        const scale = calculateImageScale(
            imgNaturalWidth,
            imgNaturalHeight,
            containerRect.width,
            containerRect.height
        );
    
        const scaledWidth = imgNaturalWidth * scale;
        const scaledHeight = imgNaturalHeight * scale;
    
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
    
        // 안쪽으로 들어온 여백 설정
        const PADDING = 40;
        const paddedOffsetX = offsetX + PADDING;
        const paddedOffsetY = offsetY + PADDING;
        const paddedWidth = scaledWidth - (PADDING * 2);
        const paddedHeight = scaledHeight - (PADDING * 2);
    
        if (vertices.length === 0) {
            setVertices([
                { x: paddedOffsetX, y: paddedOffsetY }, // 좌상단
                { x: paddedOffsetX + paddedWidth, y: paddedOffsetY }, // 우상단
                { x: paddedOffsetX + paddedWidth, y: paddedOffsetY + paddedHeight }, // 우하단
                { x: paddedOffsetX, y: paddedOffsetY + paddedHeight } // 좌하단
            ]);
        } else {
            const updatedVertices = vertices.map(vertex => {
                const normalizedX = (vertex.x - bounds.x) / bounds.scale;
                const normalizedY = (vertex.y - bounds.y) / bounds.scale;
                return {
                    x: normalizedX * scale + offsetX,
                    y: normalizedY * scale + offsetY
                };
            });
            setVertices(updatedVertices);
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

        let screenX = clientX - svgRect.left;
        let screenY = clientY - svgRect.top;

        screenX = Math.max(imageBounds.x, Math.min(screenX, imageBounds.x + imageBounds.width));
        screenY = Math.max(imageBounds.y, Math.min(screenY, imageBounds.y + imageBounds.height));

        setVertices(prev => {
            const updated = [...prev];
            updated[activeVertex] = { x: screenX, y: screenY };
            return updated;
        });
    };

    const handleVertexDragStart = (index: number, e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveVertex(index);
        setIsDragging(true);

        if (e.type === 'touchstart') {
            const touch = (e as React.TouchEvent).touches[0];
            const svgRect = svgRef.current?.getBoundingClientRect();
            if (svgRect && touch) {
                const screenX = touch.clientX - svgRect.left;
                const screenY = touch.clientY - svgRect.top;
                setVertices(prev => {
                    const updated = [...prev];
                    updated[index] = { x: screenX, y: screenY };
                    return updated;
                });
            }
        }
    };

    const handleVertexDragEnd = () => {
        setActiveVertex(null);
        setIsDragging(false);
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

    const handleConfirm = async () => {
        if (!imageBounds || !originalImageSize) return;
    
        const normalizedVertices = vertices.map(vertex => 
            screenToImageCoordinates(vertex.x, vertex.y)
        );
    
        try {
            await updatePhotoVertices(photoId, normalizedVertices, photoData);
            navigate(-1 as Number, { replace: true });
        } catch (error) {
            console.error('이미지 처리 중 오류 발생:', error);
        }
    };
    
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
            
            <div 
                ref={containerRef} 
                className="relative w-[414px] h-[615px] bg-gray-900"
            >
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
                >
                    {vertices.length > 0 && imageBounds && (
                        <g style={{ pointerEvents: 'all' }}>
                            <path
                                d={`M ${vertices.map(v => `${v.x},${v.y}`).join(' L ')} Z`}
                                stroke="#2563EB"
                                strokeWidth="3"
                                fill="rgba(37, 99, 235, 0.2)"
                                style={{ pointerEvents: 'none' }}
                            />
                            
                            {vertices.map((vertex, index) => (
                                <g key={index} style={{ cursor: 'pointer' }}>
                                    <circle
                                        cx={vertex.x}
                                        cy={vertex.y}
                                        r="20"
                                        fill="rgba(37, 99, 235, 0.1)"
                                        onMouseDown={(e) => handleVertexDragStart(index, e)}
                                        onTouchStart={(e) => handleVertexDragStart(index, e)}
                                    />
                                    <circle
                                        cx={vertex.x}
                                        cy={vertex.y}
                                        r="8"
                                        fill="#246BFD"
                                        stroke="#ffffff"
                                        strokeWidth="2"
                                        style={{ pointerEvents: 'none' }}
                                    />
                                    {activeVertex === index && (
                                        <circle
                                            cx={vertex.x}
                                            cy={vertex.y}
                                            r="14"
                                            fill="none"
                                            stroke="#2563EB"
                                            strokeWidth="2"
                                            opacity="0.5"
                                            style={{ pointerEvents: 'none' }}
                                        />
                                    )}
                                </g>
                            ))}
                        </g>
                    )}
                </svg>
            </div>

            <div className="flex justify-center items-center bg-[#181A20] h-[187.5px]">
                <button
                    onClick={handleConfirm}
                    className="w-[80%] py-4 rounded-[24px] bg-[#246BFD] hover:bg-blue-700 active:bg-blue-800 transition-colors text-white text-[25px] font-bold cursor-pointer"
                >
                    영역 설정 완료
                </button>
            </div>
        </div>
    );
};

export default ScanVertex;