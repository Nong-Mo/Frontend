declare module 'react-camera-pro' {
    import { Component } from 'react';
  
    export interface CameraProps {
      aspectRatio?: 'cover' | number;
      facingMode?: 'user' | 'environment';
      errorMessages?: {
        noCameraAccessible?: string;
        permissionDenied?: string;
        switchCamera?: string;
        canvas?: string;
      };
      imageType?: string;
      numberOfCamerasCallback?(numberOfCameras: number): void;
      videoSourceDeviceId?: string;
      errorCallback?(error: Error): void;
      style?: React.CSSProperties;
    }

    export interface PhotoData {
        id: string;
        data: string;
      }
  
    export class Camera extends Component<CameraProps> {
      takePhoto(): string;
      switchCamera(): void;
      getNumberOfCameras(): number;
    }
  }