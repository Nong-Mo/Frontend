import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { Text } from 'react-native';

const ScanView = React.forwardRef(({ onPictureTaken }, ref) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={ref} // 여기서 직접 ref 연결
        style={{ flex: 1 }}
        type={Camera.Constants.Type.back}
        onCameraReady={() => setCameraReady(true)}
      />
    </View>
  );
});

export default ScanView;

