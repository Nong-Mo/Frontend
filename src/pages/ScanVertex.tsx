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
}

const ScanVertex: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const svgRef = useRef<SVGSVGElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const { photoId, photoData } = location.state as LocationState;
    const { updatePhotoVertices } = useScanStore();
    const [vertices, setVertices] = useState<Vertex[]>([]);
    const [activeVertex, setActiveVertex] = useState<number | null>(null);
    const [imageBounds, setImageBounds] = useState<ImageBounds | null>(null);

    useEffect(() => {
        if (activeVertex !== null) {
            document.addEventListener('mousemove', handleVertexDrag);
            document.addEventListener('mouseup', handleVertexDragEnd);
            document.addEventListener('touchmove', handleVertexDrag);
            document.addEventListener('touchend', handleVertexDragEnd);

            return () => {
                document.removeEventListener('mousemove', handleVertexDrag);
                document.removeEventListener('mouseup', handleVertexDragEnd);
                document.removeEventListener('touchmove', handleVertexDrag);
                document.removeEventListener('touchend', handleVertexDragEnd);
            };
        }
    }, [activeVertex, imageBounds]);

    const calculateImageBounds = () => {
        if (imgRef.current && svgRef.current) {
            const img = imgRef.current;
            const svg = svgRef.current;
            const svgRect = svg.getBoundingClientRect();
            
            const imgAspectRatio = img.naturalWidth / img.naturalHeight;
            const containerAspectRatio = svgRect.width / svgRect.height;
            
            let imageWidth, imageHeight, imageX, imageY;
            
            if (imgAspectRatio > containerAspectRatio) {
                imageWidth = svgRect.width;
                imageHeight = svgRect.width / imgAspectRatio;
                imageX = 0;
                imageY = (svgRect.height - imageHeight) / 2;
            } else {
                imageHeight = svgRect.height;
                imageWidth = svgRect.height * imgAspectRatio;
                imageX = (svgRect.width - imageWidth) / 2;
                imageY = 0;
            }

            const bounds = { x: imageX, y: imageY, width: imageWidth, height: imageHeight };
            setImageBounds(bounds);
            
            if (vertices.length === 0) {
                setVertices([
                    { x: imageX, y: imageY },
                    { x: imageX + imageWidth, y: imageY },
                    { x: imageX + imageWidth, y: imageY + imageHeight },
                    { x: imageX, y: imageY + imageHeight }
                ]);
            }
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

        window.addEventListener('resize', calculateImageBounds);
        return () => window.removeEventListener('resize', calculateImageBounds);
    }, []);

    const handleVertexDrag = (e: MouseEvent | TouchEvent) => {
        if (activeVertex === null || !svgRef.current || !imageBounds) return;

        e.preventDefault();
        e.stopPropagation();

        const svgRect = svgRef.current.getBoundingClientRect();
        
        const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

        let x = clientX - svgRect.left;
        let y = clientY - svgRect.top;

        x = Math.max(imageBounds.x, Math.min(x, imageBounds.x + imageBounds.width));
        y = Math.max(imageBounds.y, Math.min(y, imageBounds.y + imageBounds.height));

        setVertices(prev => {
            const updated = [...prev];
            updated[activeVertex] = { x, y };
            return updated;
        });
    };

    const handleVertexDragStart = (index: number) => {
        setActiveVertex(index);
    };

    const handleVertexDragEnd = () => {
        setActiveVertex(null);
    };

    const handleConfirm = () => {
        updatePhotoVertices(photoId, vertices);
        navigate(-1);
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
            
            {/* flex-1 제거하고 고정 높이 사용 */}
            <div className="relative w-[414px] h-[615px] bg-gray-900">
                <img
                    ref={imgRef}
                    src={photoData}
                    alt="scanned"
                    className="w-full h-full object-cover"
                />
                
                <svg
                    ref={svgRef}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ touchAction: 'none' }}
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
                                    stroke="#2563EB"
                                    strokeWidth={3}
                                    r="10"
                                    fill="#2563EB"
                                    className="cursor-move"
                                    style={{ pointerEvents: 'auto' }}
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                        handleVertexDragStart(index);
                                    }}
                                    onTouchStart={(e) => {
                                        e.stopPropagation();
                                        handleVertexDragStart(index);
                                    }}
                                />
                            ))}
                        </>
                    )}
                </svg>
            </div>

            <div className="flex justify-center bg-[#181A20] flex-col h-[187.5px]">
                <button
                    onClick={handleConfirm}
                    className="mx-auto  text-white text-[25px] font-bold"
                >
                    영역 설정 완료
                </button>
            </div>
        </div>
    );
};

export default ScanVertex;