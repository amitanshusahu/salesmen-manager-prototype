import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';
import { primary } from '@/constants/Colors';

const QRCodeWithRef = React.forwardRef((props: any, ref: any) => (
  <QRCode
    {...props}
    getRef={ref}
  />
));

export default function StoreQr() {
  const { id, name, market_name, address } = useLocalSearchParams();
  const containerRef = useRef<View | null>(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [isViewReady, setIsViewReady] = useState(false);
  if (permissionResponse === null) {
    requestPermission();
  }

  const handleSaveToGallery = useCallback(async (uri: string) => {
    try {
      let isPermissionGranted = permissionResponse?.granted;
      if (!isPermissionGranted) {
        const result = await requestPermission();
        isPermissionGranted = result.granted;
      }

      if (!isPermissionGranted) {
        throw new Error('Gallery permission denied');
      }

      await MediaLibrary.saveToLibraryAsync(uri);
      alert('Screenshot saved to gallery!');
    } catch (error) {
      console.error('Saving to gallery failed: ', error);
      alert('Failed to save screenshot to gallery');
    }
  }, [permissionResponse]);

  const handlePrint = useCallback(async () => {
    if (!containerRef.current) {
      alert('The view is not ready for capturing!');
      return;
    }

    try {
      // Use a slight delay to ensure view is fully rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture the screen content as a PNG
      const uri = await captureRef(containerRef, {
        format: 'png',
        quality: 1,
      });

      // Convert the image to base64 for printing
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Print the captured content
      await Print.printAsync({
        html: `<img src="data:image/png;base64,${base64}" style="width:100%;"/>`,
      });
    } catch (error) {
      console.error('Print failed: ', error);
      alert('Printing failed. Saving the screenshot to the gallery instead...');

      // Fallback: Save the screenshot to the gallery
      try {
        const uri = await captureRef(containerRef, {
          format: 'png',
          quality: 1,
        });
        await handleSaveToGallery(uri);
      } catch (galleryError) {
        console.error('Gallery save failed: ', galleryError);
        alert('Failed to save screenshot to the gallery as well.');
      }
    }
  }, [handleSaveToGallery]);

  const handleLayout = useCallback(() => {
    setIsViewReady(true);
  }, []);

  return (
    <View style={styles.screen}>
      <View
        ref={containerRef}
        collapsable={false}
        onLayout={handleLayout}
        style={{
          padding: 30,
          width: "100%",
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 20,
          borderRadius: 20
        }}
      >
        <View style={{ justifyContent: 'center', alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "900" }}>{name}</Text>
          <Text style={{ fontSize: 12 }}>{market_name}</Text>
          <Text style={{ fontSize: 12 }}>{address}</Text>
        </View>
        <QRCodeWithRef
          value={`${id}`}
          size={250}
          logo={require('@/assets/images/nexus-logo.webp')}
        />
        <View style={{ backgroundColor: "white", padding: 10, width: "100%", borderRadius: 10 }}>
          <TouchableOpacity 
            onPress={handlePrint} 
            disabled={!isViewReady}
            style={{ 
              backgroundColor: "#f2fbfc", 
              padding: 10, 
              borderRadius: 10,
              opacity: isViewReady ? 1 : 0.5
            }}
          >
            <Text style={{ textAlign: 'center', color: primary }}>
              {isViewReady ? 'Print' : 'Preparing...'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 30,
    backgroundColor: 'white',
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});