import React, { useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { NavBar } from '../components/common/NavBar';
import { useScanStore } from '../hooks/useScanStore';
import { useVertexControl } from '../hooks/useVertexControl';
import { useImageBounds } from '../hooks/useImageBounds';

interface LocationState {
    photoId: string;
    photoData: string;
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

    const {
        imageBounds,
        originalImageSize,
    } = useImageBounds({
        imgRef,
        containerRef,
        onBoundsCalculated: (bounds, originalSize) => {
            // 안쪽으로 들어온 여백 설정
            const PADDING = 40;
            const paddedOffsetX = bounds.x + PADDING;
            const paddedOffsetY = bounds.y + PADDING;
            const paddedWidth = bounds.width - (PADDING * 2);
            const paddedHeight = bounds.height - (PADDING * 2);

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
                        x: normalizedX * bounds.scale + bounds.x,
                        y: normalizedY * bounds.scale + bounds.y
                    };
                });
                setVertices(updatedVertices);
            }
        }
    });

    const {
        vertices,
        setVertices,
        activeVertex,
        handleVertexDragStart,
        screenToImageCoordinates
    } = useVertexControl({
        svgRef,
        imageBounds,
        originalImageSize
    });

    const handleConfirm = async () => {
        if (!imageBounds || !originalImageSize) return;
    
        const normalizedVertices = vertices.map(vertex =>
            screenToImageCoordinates(vertex.x, vertex.y)
        );
    
        try {
            await updatePhotoVertices(photoId, normalizedVertices, photoData);
            
            navigate(`/scan/${type}`, {
                replace: true,
                state: {
                    fromVertex: true,
                    updatedPhoto: {
                        id: photoId,
                        data: photoData,
                        vertices: normalizedVertices
                    }
                }
            });
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="z-50 mt-[15px] w-full h-[896px] flex flex-col select-none">
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
                                <g key={index}
                                   style={{ cursor: 'pointer' }}>
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