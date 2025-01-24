import { API_ROUTES } from "@/constants/ApiRoutes";
import { api } from "@/lib/axios/axios";
import { useQuery } from "@tanstack/react-query";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, StyleSheet } from "react-native";
import { CaretRight, GpsFix, PlusCircle, UserCircle } from "phosphor-react-native";
import { primary } from "@/constants/Colors";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { useRefreshOnFocus } from "@/hook/useRefetchOnFocus";
import EmptyBox from "@/components/ui/EmptyBox";

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

async function getLocationById(): Promise<LocationData> {
  const res = await api.get(API_ROUTES.LOCATION.GET_BY_MANAGER_ID);
  return res.data;
}

export default function LocationList() {
  const router = useRouter();
  const locationQuery = useQuery<LocationData>({
    queryKey: ["store"],
    queryFn: getLocationById
  });
  const refetch = locationQuery.refetch;
  useRefreshOnFocus(refetch);

  return (
    <ScrollView>
      <View style={{ padding: 30, display: 'flex', alignItems: 'center', minHeight: '100%', gap: 20, position: 'relative', backgroundColor: 'white' }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Store</Text>
          <TouchableOpacity onPress={() => router.push("/(modals)/add_store")}>
            <PlusCircle size={42} color={`${primary}`} />
          </TouchableOpacity>
        </View>

        <View style={{ display: 'flex', width: '100%', gap: 10 }}>
          <TextInput placeholder="search" style={style.input} keyboardType="web-search" />

          {locationQuery.isError && <Text>Error...</Text>}
          {locationQuery?.data?.data.length === 0 && <EmptyBox text="No Stores Found" />}
          {locationQuery.data?.data.map((item, index) => {
            const truncate = (text: string, maxLength: number) =>
              text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

            const trimmedName = truncate(item.name, 20);
            const trimmedAddress = truncate(item.address, 30);

            return (
              <View
                key={item.id}
                style={{
                  paddingVertical: 10,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: "space-between",
                  alignItems: "center",
                  position: "relative"
                }}
              >
                <View
                  style={{
                    display: 'flex',
                    flexDirection: "row",
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 10
                  }}
                >
                  <GpsFix size={32} weight="duotone" color={primary} duotoneColor={primary} />
                  <View>
                    {/* Truncated Name */}
                    <Text style={{ fontWeight: "500", fontSize: 18 }}>{trimmedName}</Text>
                    {/* Full Multiline Address */}
                    <Text style={{ color: "#555", flexWrap: "wrap" }}>{trimmedAddress}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 0,
                    padding: 10,
                    backgroundColor: "#e3eeff",
                    borderRadius: 10
                  }}
                  onPress={() => router.push(`/(modals)/qr/${item.id}?name=${encodeURIComponent(item.name)}&address=${encodeURIComponent(item.address)}`)}
                >
                  <CaretRight size={32} color={primary} />
                </TouchableOpacity>
              </View>
            );
          })}
          {locationQuery.isFetching && <ActivityIndicator size="large" color={primary} />}
        </View>
      </View>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  input: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    width: "100%",
    marginBottom: 10,
    marginTop: 30
  }
})