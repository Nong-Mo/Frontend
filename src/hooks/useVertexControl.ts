// 사용자가 드래그할 수 있는 4개의 꼭지점을 제어함
import { useState, useEffect, RefObject } from 'react';

// 꼭지점(vertex)의 좌표를 나타내는 인터페이스
export interface Vertex {
    x: number;
    y: number;
}

// 이미지의 경계와 크기 정보를 나타내는 인터페이스
interface ImageBounds {
    x: number;          // 이미지의 x 좌표
    y: number;          // 이미지의 y 좌표
    width: number;      // 이미지의 너비
    height: number;     // 이미지의 높이
    scale: number;      // 이미지의 스케일(확대/축소 비율)
}

// 훅의 props 인터페이스
interface UseVertexControlProps {
    svgRef: RefObject<SVGSVGElement>;              // SVG 요소에 대한 참조
    imageBounds: ImageBounds | null;               // 이미지 경계 정보
    originalImageSize: { width: number; height: number } | null;  // 원본 이미지 크기
}

// 훅의 반환 값 인터페이스
interface UseVertexControlReturn {
    vertices: Vertex[];             // 모든 꼭지점들의 배열
    setVertices: React.Dispatch<React.SetStateAction<Vertex[]>>;  // 꼭지점 배열을 업데이트하는 함수
    activeVertex: number | null;    // 현재 활성화된(드래그 중인) 꼭지점의 인덱스
    isDragging: boolean;            // 드래그 중인지 여부
    handleVertexDragStart: (index: number, e: React.MouseEvent | React.TouchEvent) => void;  // 드래그 시작 핸들러
    screenToImageCoordinates: (screenX: number, screenY: number) => Vertex;  // 화면 좌표를 이미지 좌표로 변환
}

export const useVertexControl = ({
    svgRef,
    imageBounds,
    originalImageSize
}: UseVertexControlProps): UseVertexControlReturn => {
    // 상태 관리
    const [vertices, setVertices] = useState<Vertex[]>([]); // 꼭지점들의 배열
    const [activeVertex, setActiveVertex] = useState<number | null>(null); // 현재 드래그 중인 꼭지점
    const [isDragging, setIsDragging] = useState(false); // 드래그 상태

    // 마우스/터치 이벤트의 좌표를 일관된 형식으로 반환하는 유틸리티 함수
    const getEventCoordinates = (e: MouseEvent | TouchEvent): { clientX: number; clientY: number } => {
        if ('touches' in e) {
            // 터치 이벤트인 경우
            const touch = e.touches[0];
            return {
                clientX: touch.clientX,
                clientY: touch.clientY
            };
        }
        // 마우스 이벤트인 경우
        return {
            clientX: (e as MouseEvent).clientX,
            clientY: (e as MouseEvent).clientY
        };
    };

    // 꼭지점 드래그 중 처리하는 함수
    const handleVertexDrag = (e: MouseEvent | TouchEvent) => {
        if (activeVertex === null || !svgRef.current || !imageBounds) return;

        e.preventDefault();
        e.stopPropagation();

        // 이벤트의 좌표 가져오기
        const { clientX, clientY } = getEventCoordinates(e);
        const svgRect = svgRef.current.getBoundingClientRect();

        // 화면 좌표를 SVG 내부 좌표로 변환
        let screenX = clientX - svgRect.left;
        let screenY = clientY - svgRect.top;

        // 좌표가 이미지 경계를 벗어나지 않도록 제한
        screenX = Math.max(imageBounds.x, Math.min(screenX, imageBounds.x + imageBounds.width));
        screenY = Math.max(imageBounds.y, Math.min(screenY, imageBounds.y + imageBounds.height));

        // 꼭지점 위치 업데이트
        setVertices(prev => {
            const updated = [...prev];
            updated[activeVertex] = { x: screenX, y: screenY };
            return updated;
        });
    };

    // 꼭지점 드래그 시작 처리 함수
    const handleVertexDragStart = (index: number, e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveVertex(index);
        setIsDragging(true);

        // 터치 이벤트 처리
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

    // 드래그 종료 처리 함수
    const handleVertexDragEnd = () => {
        setActiveVertex(null);
        setIsDragging(false);
    };

    // 화면 좌표를 이미지 좌표로 변환하는 함수
    const screenToImageCoordinates = (screenX: number, screenY: number): Vertex => {
        if (!imageBounds || !originalImageSize) return { x: screenX, y: screenY };

        // 상대적 위치 계산
        const relativeX = (screenX - imageBounds.x) / imageBounds.scale;
        const relativeY = (screenY - imageBounds.y) / imageBounds.scale;

        // 이미지 경계 내로 제한
        return {
            x: Math.max(0, Math.min(originalImageSize.width, relativeX)),
            y: Math.max(0, Math.min(originalImageSize.height, relativeY))
        };
    };

    // 드래그 중 스크롤 방지 효과
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

    // 꼭지점 드래그 이벤트 리스너 설정
    useEffect(() => {
        if (activeVertex !== null) {
            // 드래그 중일 때만 이벤트 리스너 추가
            document.addEventListener('mousemove', handleVertexDrag);
            document.addEventListener('mouseup', handleVertexDragEnd);
            document.addEventListener('touchmove', handleVertexDrag, { passive: false });
            document.addEventListener('touchend', handleVertexDragEnd);

            // 컴포넌트 언마운트 또는 드래그 종료 시 이벤트 리스너 제거
            return () => {
                document.removeEventListener('mousemove', handleVertexDrag);
                document.removeEventListener('mouseup', handleVertexDragEnd);
                document.removeEventListener('touchmove', handleVertexDrag);
                document.removeEventListener('touchend', handleVertexDragEnd);
            };
        }
    }, [activeVertex, imageBounds]);

    // 훅의 반환 값
    return {
        vertices,
        setVertices,
        activeVertex,
        isDragging,
        handleVertexDragStart,
        screenToImageCoordinates
    };
};