import { API_ROUTES } from "@/constants/ApiRoutes";
import { api } from "@/lib/axios/axios";
import { useQuery } from "@tanstack/react-query";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import { PlusCircle } from "phosphor-react-native";
import { primary } from "@/constants/Colors";
import { useRouter } from "expo-router";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import React, { useRef } from "react";
import { useRefreshOnFocus } from "@/hook/useRefetchOnFocus";

interface Location {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface LocationData {
  data: Location[];
}

const QRCodeWithRef = React.forwardRef((props: any, ref: any) => (
  <QRCode
    {...props}
    getRef={ref}
  />
));

async function getLocationById(): Promise<LocationData> {
  const res = await api.get(API_ROUTES.LOCATION.GET_BY_MANAGER_ID);
  return res.data;
}

export default function LocationList() {
  useRefreshOnFocus(() => locationQuery.refetch());
  const router = useRouter();
  const locationQuery = useQuery<LocationData>({
    queryKey: ["store"],
    queryFn: getLocationById
  });

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const qrRefs = useRef<any[]>([]);

  const handlePressDownload = async (index: number, locationId: number) => {
    try {
      let isPermissionGranted = permissionResponse?.granted;
      if (!isPermissionGranted) {
        isPermissionGranted = (await requestPermission()).granted;
      }

      if (!isPermissionGranted) {
        throw new Error('Library permission access denied');
      }

      qrRefs.current[index]?.toDataURL(async (base64Code: string) => {
        const filename = FileSystem.documentDirectory + `qr_code_${locationId}.png`;
        
        await FileSystem.writeAsStringAsync(filename, base64Code, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await MediaLibrary.saveToLibraryAsync(filename);
        alert('QR code downloaded!');
      });
    } catch (error) {
      console.error('QR downloading failed: ', error);
      alert('Failed to download QR code');
    }
  };

  return (
    <ScrollView>
      <View style={{ padding: 30, display: 'flex', alignItems: 'center', minHeight: '100%', gap: 20, position: 'relative', backgroundColor: 'white' }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Store</Text>
          <TouchableOpacity onPress={() => router.push("/(modals)/add_store")}>
            <PlusCircle size={32} color={primary} />
          </TouchableOpacity>
        </View>

        <View style={{ display: 'flex', width: '100%', gap: 50 }}>
          {locationQuery.isLoading && <Text>Loading...</Text>}
          {locationQuery.isError && <Text>Error...</Text>}
          {locationQuery.data?.data.map((item, index) => (
            <View 
              style={{ 
                padding: 30, 
                width: "100%", 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: 20, 
                backgroundColor: "#f2f2f2", 
                borderRadius: 20 
              }}
              key={item.id}
            >
              <View style={{ justifyContent: 'center', alignItems: "center" }}>
                <Text style={{ fontSize: 18, fontWeight: "900" }}>{item.name}</Text>
                <Text style={{ fontSize: 12 }}>{item.address}</Text>
              </View>
              <QRCodeWithRef
                value={`${item.id}`}
                size={250}
                logo={require('@/assets/images/nexus-logo.webp')}
                backgroundColor="#f2f2f2"
                ref={el => qrRefs.current[index] = el}
              />
              <View style={{ backgroundColor: "white", padding: 10, width: "100%", borderRadius: 10 }}>
                <TouchableOpacity onPress={() => alert("This feature is not available for your device, please take screenshot")}>
                  <Text style={{ textAlign: 'center', color: 'blue' }}>Download</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}