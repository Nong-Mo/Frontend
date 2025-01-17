import { useState, useEffect, RefObject, useCallback } from 'react';

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

    const handleVertexDrag = useCallback((e: MouseEvent | TouchEvent) => {
        if (activeVertex === null || !svgRef.current || !imageBounds) return;

        e.preventDefault();
        e.stopPropagation();

        let clientX: number, clientY: number;

        if ('touches' in e) {
            const touch = e.touches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            clientX = (e as MouseEvent).clientX;
            clientY = (e as MouseEvent).clientY;
        }

        const svgRect = svgRef.current.getBoundingClientRect();
        let newX = clientX - svgRect.left;
        let newY = clientY - svgRect.top;

        newX = Math.max(imageBounds.x, Math.min(newX, imageBounds.x + imageBounds.width));
        newY = Math.max(imageBounds.y, Math.min(newY, imageBounds.y + imageBounds.height));

        requestAnimationFrame(() => {
            setVertices(prev => {
                if (activeVertex === null) return prev;
                const updated = [...prev];
                updated[activeVertex] = { x: newX, y: newY };
                return updated;
            });
        });
    }, [activeVertex, imageBounds]);

    const handleVertexDragStart = useCallback((index: number, e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        setActiveVertex(index);
        document.body.style.overflow = 'hidden';
    }, []);

    const handleVertexDragEnd = useCallback(() => {
        if (activeVertex !== null) {
            setActiveVertex(null);
            document.body.style.overflow = '';
        }
    }, [activeVertex]);

    useEffect(() => {
        if (activeVertex !== null) {
            const preventScroll = (e: TouchEvent) => {
                e.preventDefault();
            };

            document.addEventListener('touchmove', preventScroll, { passive: false });
            document.addEventListener('mousemove', handleVertexDrag);
            document.addEventListener('mouseup', handleVertexDragEnd);
            document.addEventListener('touchmove', handleVertexDrag);
            document.addEventListener('touchend', handleVertexDragEnd);
            window.addEventListener('blur', handleVertexDragEnd);

            return () => {
                document.removeEventListener('touchmove', preventScroll);
                document.removeEventListener('mousemove', handleVertexDrag);
                document.removeEventListener('mouseup', handleVertexDragEnd);
                document.removeEventListener('touchmove', handleVertexDrag);
                document.removeEventListener('touchend', handleVertexDragEnd);
                window.removeEventListener('blur', handleVertexDragEnd);
                handleVertexDragEnd();
            };
        }
        
        return () => {
            document.body.style.overflow = '';
        };
    }, [activeVertex, handleVertexDrag, handleVertexDragEnd]);

    const screenToImageCoordinates = useCallback((screenX: number, screenY: number): Vertex => {
        if (!imageBounds || !originalImageSize) return { x: screenX, y: screenY };

        const relativeX = (screenX - imageBounds.x) / imageBounds.scale;
        const relativeY = (screenY - imageBounds.y) / imageBounds.scale;

        return {
            x: Math.max(0, Math.min(originalImageSize.width, relativeX)),
            y: Math.max(0, Math.min(originalImageSize.height, relativeY))
        };
    }, [imageBounds, originalImageSize]);

    return {
        vertices,
        setVertices,
        activeVertex,
        handleVertexDragStart,
        screenToImageCoordinates
    };
};