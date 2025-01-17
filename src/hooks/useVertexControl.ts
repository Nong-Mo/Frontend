import { useState, useEffect, RefObject } from 'react';

export interface Vertex {
    x: number;
    y: number;
}

interface ImageBounds {
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
}

interface UseVertexControlProps {
    svgRef: RefObject<SVGSVGElement>;
    imageBounds: ImageBounds | null;
    originalImageSize: { width: number; height: number } | null;
}

export const useVertexControl = ({
    svgRef,
    imageBounds,
    originalImageSize
}: UseVertexControlProps) => {
    const [vertices, setVertices] = useState<Vertex[]>([]);
    const [activeVertex, setActiveVertex] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const getEventCoordinates = (e: MouseEvent | TouchEvent): { clientX: number; clientY: number } => {
        if ('touches' in e) {
            return {
                clientX: e.touches[0].clientX,
                clientY: e.touches[0].clientY
            };
        }
        return {
            clientX: e.clientX,
            clientY: e.clientY
        };
    };

    const handleVertexDrag = (e: MouseEvent | TouchEvent) => {
        if (activeVertex === null || !svgRef.current || !imageBounds) return;

        // 드래그 중에는 이벤트 전파 중단
        e.preventDefault();
        e.stopPropagation();

        const coordinates = getEventCoordinates(e);
        const svgRect = svgRef.current.getBoundingClientRect();

        let newX = coordinates.clientX - svgRect.left;
        let newY = coordinates.clientY - svgRect.top;

        // 이미지 경계 내로 제한
        newX = Math.max(imageBounds.x, Math.min(newX, imageBounds.x + imageBounds.width));
        newY = Math.max(imageBounds.y, Math.min(newY, imageBounds.y + imageBounds.height));

        setVertices(prev => {
            const updated = [...prev];
            updated[activeVertex] = { x: newX, y: newY };
            return updated;
        });
    };

    const handleVertexDragStart = (index: number, e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        setActiveVertex(index);
        setIsDragging(true);

        // 드래그 시작 시 body의 overflow를 hidden으로 설정
        document.body.style.overflow = 'hidden';
    };

    const handleVertexDragEnd = () => {
        setActiveVertex(null);
        setIsDragging(false);

        // 드래그 종료 시 body의 overflow를 복원
        document.body.style.overflow = 'auto';
    };

    useEffect(() => {
        if (activeVertex !== null) {
            // 터치 이벤트 막기
            const preventDefault = (e: TouchEvent) => {
                if (isDragging) {
                    e.preventDefault();
                }
            };

            document.addEventListener('touchmove', preventDefault, { passive: false });
            document.addEventListener('mousemove', handleVertexDrag);
            document.addEventListener('mouseup', handleVertexDragEnd);
            document.addEventListener('touchmove', handleVertexDrag);
            document.addEventListener('touchend', handleVertexDragEnd);

            return () => {
                document.removeEventListener('touchmove', preventDefault);
                document.removeEventListener('mousemove', handleVertexDrag);
                document.removeEventListener('mouseup', handleVertexDragEnd);
                document.removeEventListener('touchmove', handleVertexDrag);
                document.removeEventListener('touchend', handleVertexDragEnd);
            };
        }
    }, [activeVertex, handleVertexDrag, imageBounds, isDragging]);

    const screenToImageCoordinates = (screenX: number, screenY: number): Vertex => {
        if (!imageBounds || !originalImageSize) return { x: screenX, y: screenY };

        const relativeX = (screenX - imageBounds.x) / imageBounds.scale;
        const relativeY = (screenY - imageBounds.y) / imageBounds.scale;

        return {
            x: Math.max(0, Math.min(originalImageSize.width, relativeX)),
            y: Math.max(0, Math.min(originalImageSize.height, relativeY))
        };
    };

    return {
        vertices,
        setVertices,
        activeVertex,
        handleVertexDragStart,
        screenToImageCoordinates,
        isDragging
    };
};