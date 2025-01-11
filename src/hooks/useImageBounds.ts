// 원본 이미지의 크기를 유지하면서 컨테이너에 맞게 이미지의 크기를 조절함
import { useState, useEffect, RefObject } from 'react';

// 이미지의 경계와 크기 정보를 나타내는 인터페이스
interface ImageBounds {
    x: number;          // 이미지의 왼쪽 위치
    y: number;          // 이미지의 상단 위치
    width: number;      // 이미지의 너비
    height: number;     // 이미지의 높이
    scale: number;      // 이미지의 스케일(확대/축소 비율)
}

// 훅의 입력 props 인터페이스
interface UseImageBoundsProps {
    imgRef: RefObject<HTMLImageElement>;     // 이미지 요소에 대한 참조
    containerRef: RefObject<HTMLDivElement>; // 이미지를 감싸는 컨테이너 요소에 대한 참조
    onBoundsCalculated?: (                   // 경계가 계산되었을 때 호출되는 콜백 함수
        bounds: ImageBounds,                 // 계산된 경계 정보
        originalSize: { width: number; height: number }  // 원본 이미지 크기
    ) => void;
}

// 훅의 반환 값 인터페이스
interface UseImageBoundsReturn {
    imageBounds: ImageBounds | null;        // 계산된 이미지 경계 정보
    originalImageSize: { width: number; height: number } | null;  // 원본 이미지 크기
    calculateImageBounds: () => void;        // 경계를 재계산하는 함수
}

export const useImageBounds = ({
    imgRef,
    containerRef,
    onBoundsCalculated
}: UseImageBoundsProps): UseImageBoundsReturn => {
    // 이미지 경계 정보 상태
    const [imageBounds, setImageBounds] = useState<ImageBounds | null>(null);
    // 원본 이미지 크기 상태
    const [originalImageSize, setOriginalImageSize] = useState<{ width: number; height: number } | null>(null);

    // 이미지 스케일을 계산하는 함수
    // 컨테이너 크기에 맞게 이미지를 비율을 유지하면서 맞추기 위한 계산
    const calculateImageScale = (
        imgWidth: number,       // 원본 이미지 너비
        imgHeight: number,      // 원본 이미지 높이
        containerWidth: number, // 컨테이너 너비
        containerHeight: number // 컨테이너 높이
    ) => {
        // 너비와 높이의 스케일 계산
        const widthScale = containerWidth / imgWidth;
        const heightScale = containerHeight / imgHeight;
        // 더 작은 스케일을 반환 (이미지가 컨테이너를 벗어나지 않도록)
        return Math.min(widthScale, heightScale);
    };

    // 이미지 경계를 계산하는 함수
    const calculateImageBounds = () => {
        if (!imgRef.current || !containerRef.current) return;

        const img = imgRef.current;
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();

        // 원본 이미지 크기 가져오기
        const imgNaturalWidth = img.naturalWidth;
        const imgNaturalHeight = img.naturalHeight;
        const originalSize = { width: imgNaturalWidth, height: imgNaturalHeight };
        setOriginalImageSize(originalSize);

        // 이미지 스케일 계산
        const scale = calculateImageScale(
            imgNaturalWidth,
            imgNaturalHeight,
            containerRect.width,
            containerRect.height
        );

        // 스케일이 적용된 이미지 크기 계산
        const scaledWidth = imgNaturalWidth * scale;
        const scaledHeight = imgNaturalHeight * scale;

        // 이미지를 컨테이너 중앙에 위치시키기 위한 오프셋 계산
        const offsetX = (containerRect.width - scaledWidth) / 2;
        const offsetY = (containerRect.height - scaledHeight) / 2;

        // 최종 경계 정보 생성
        const bounds = {
            x: offsetX,
            y: offsetY,
            width: scaledWidth,
            height: scaledHeight,
            scale: scale
        };

        // 상태 업데이트 및 콜백 호출
        setImageBounds(bounds);
        onBoundsCalculated?.(bounds, originalSize);
    };

    // 이미지 로드 및 리사이즈 이벤트 처리
    useEffect(() => {
        const img = imgRef.current;
        if (img) {
            // 이미지가 이미 로드되어 있으면 바로 계산
            if (img.complete) {
                calculateImageBounds();
            } else {
                // 아니면 로드 완료 시 계산
                img.onload = calculateImageBounds;
            }
        }

        // 윈도우 리사이즈 이벤트 처리
        const handleResize = () => {
            calculateImageBounds();
        };

        // 리사이즈 이벤트 리스너 등록
        window.addEventListener('resize', handleResize);
        // 클린업 함수에서 리스너 제거
        return () => window.removeEventListener('resize', handleResize);
    }, []); // 의존성 배열이 비어있어 마운트 시에만 실행

    // 훅의 반환 값
    return {
        imageBounds,
        originalImageSize,
        calculateImageBounds
    };
};

export default useImageBounds;