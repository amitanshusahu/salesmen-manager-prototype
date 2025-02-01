import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';
import { primary } from '@/constants/Colors';
import { ArrowClockwise, ArrowCounterClockwise, ArrowsIn, ArrowsOut } from 'phosphor-react-native';

export default function StoreQr() {
  const { id, name, market_name, address } = useLocalSearchParams();
  const containerRef = useRef<View | null>(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
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
      console.log('The view is not ready for capturing!');
      alert('The view is not ready for capturing!');
      return;
    }
    console.log('Printing...');
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const uri = await captureRef(containerRef, { format: 'png', quality: 1 });
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await Print.printAsync({
        html: `<img src="data:image/png;base64,${base64}" style="width:100%;"/>`,
      });
    } catch (error) {
      console.error('Print failed: ', error);
      alert('Printing failed. Saving the screenshot to the gallery instead...');
      try {
        const uri = await captureRef(containerRef, { format: 'png', quality: 1 });
        await handleSaveToGallery(uri);
      } catch (galleryError) {
        console.error('Gallery save failed: ', galleryError);
        alert('Failed to save screenshot to the gallery as well.');
      }
    }
  }, [handleSaveToGallery]);

  const handleLayout = useCallback(() => setIsViewReady(true), []);

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View
          style={{ 
            padding: 30, 
            backgroundColor: 'white', 
            borderRadius: 15, 
            gap: 30, 
            transform: [{ rotate: `${rotation}deg` }, { scale: scale }]
          }}
          ref={containerRef}
          collapsable={false}
          onLayout={handleLayout}
        >
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.subtitle}>{market_name}</Text>
            <Text style={styles.subtitle}>{address}</Text>
          </View>
          <QRCode value={`${id}`} size={250} logo={require('@/assets/images/nexus-logo.webp')} />
        </View>

        <View style={styles.controls}>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => setRotation(rotation - 90)} style={styles.button}>
              <ArrowCounterClockwise size={32} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setScale(scale + 0.2)} style={styles.button}>
              <ArrowsOut size={32} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setScale(Math.max(scale - 0.2, 0.5))} style={styles.button}>
              <ArrowsIn size={32} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRotation(rotation + 90)} style={styles.button}>
              <ArrowClockwise size={32} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handlePrint} disabled={!isViewReady} style={[styles.printButton, { opacity: isViewReady ? 1 : 0.5 }]}>
            <Text style={styles.printText}>{isViewReady ? 'Print' : 'Preparing...'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 30,
    backgroundColor: '#f2f2f2',
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 30,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 12,
  },
  controls: {
    width: '100%',
    gap: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 999,
  },
  printButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
  printText: {
    textAlign: 'center',
    color: primary,
    fontSize: 14,
  },
});
