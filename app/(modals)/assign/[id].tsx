import { API_ROUTES } from "@/constants/ApiRoutes";
import { api } from "@/lib/axios/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, StyleSheet } from "react-native";
import { GpsFix, Plus, X } from "phosphor-react-native";
import { primary } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { useRefreshOnFocus } from "@/hook/useRefetchOnFocus";
import EmptyBox from "@/components/ui/EmptyBox";

interface Location {
  id: number;
  name: string;
  market_name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface LocationData {
  data: Location[];
}

interface AssignedStoresData {
  assign:
  {
    id: number,
    managerId: number,
    salesManId: number,
    locationId: number,
    createdAt: string,
    updatedAt: string,
    Location: {
      name: string,
      address: string,
      latitude: number,
      longitude: number,
    }
  }[] | [];
}

async function getAssignedStores(id: number): Promise<AssignedStoresData> {
  const res = await api.get(API_ROUTES.SALESMEN.GET_ASSIGNED_STORES_BY_SALESMAN_ID + id);
  return res.data;
}

async function getLocationById(): Promise<LocationData> {
  const res = await api.get(API_ROUTES.LOCATION.GET_BY_MANAGER_ID);
  return res.data;
}

async function assignLocation({ locationId, salesManId }: { locationId: number, salesManId: number }) {
  const res = await api.post(API_ROUTES.SALESMEN.ASSIGN_STORE, { locationId, salesManId });
  return res.data;
}

export default function AboutSalesmen() {
  useRefreshOnFocus(() => locationQuery.refetch());
  const { id } = useLocalSearchParams();
  const locationQuery = useQuery<LocationData>({
    queryKey: ["store"],
    queryFn: getLocationById,
  });

  const assignedStoresQuery = useQuery({
    queryKey: ["assignedStores"],
    queryFn: () => getAssignedStores(Number(id)),
  });
  const refetch = assignedStoresQuery.refetch;
  useRefreshOnFocus(refetch);

  const assignMutaion = useMutation({
    mutationFn: assignLocation,
    onSuccess: () => {
      alert("Location Assigned");
      // Refetch assigned stores to update the UI
      refetch();
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const handleAssignLocation = (locationId: number) => {
    if (typeof id === "string") {
      assignMutaion.mutate({ locationId, salesManId: parseInt(id) });
    }
  };

  useEffect(() => {
    if (assignedStoresQuery.isSuccess) {
      console.log(assignedStoresQuery.data);
    }
    if (assignedStoresQuery.isError) {
      alert(assignedStoresQuery.error);
    }
  }, [assignedStoresQuery.data]);

  return (
    <ScrollView style={styles.screen}>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          minHeight: "100%",
          gap: 20,
          position: "relative",
          backgroundColor: "white",
        }}
      >
        {assignMutaion.isPending && (
          <ActivityIndicator size="large" color={primary} />
        )}

        <View style={{ display: "flex", width: "100%", gap: 10 }}>
          <TextInput
            placeholder="search"
            style={styles.input}
            keyboardType="web-search"
          />
          {locationQuery.isLoading && (
            <ActivityIndicator size="large" color={primary} />
          )}
          {locationQuery.isError && <Text>Error...</Text>}
          {locationQuery?.data?.data?.length === 0 && (
            <EmptyBox text="No Stores Found" />
          )}
          {locationQuery.data?.data.map((item) => {
            const truncate = (text: string, maxLength: number) =>
              text?.length > maxLength
                ? text.substring(0, maxLength) + "..."
                : text;

            const trimmedName = truncate(item.name, 20);
            const trimmedAddress = truncate(item.address, 30);
            const trimmedMarketName = truncate(item?.market_name, 30);

            // Check if the location is already assigned
            const isAssigned = assignedStoresQuery.data?.assign.some(
              (assignedStore) => assignedStore.locationId === item.id
            );

            return (
              <View
                key={item.id}
                style={{
                  paddingVertical: 10,
                  backgroundColor: "white",
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: 10,
                  }}
                >
                  <GpsFix
                    size={32}
                    weight="duotone"
                    color={primary}
                    duotoneColor={primary}
                  />
                  <View>
                    <Text style={{ fontWeight: "500", fontSize: 18 }}>
                      {trimmedName}
                    </Text>
                    <Text style={{ color: "#555", flexWrap: "wrap" }}>{trimmedMarketName}</Text>
                    <Text style={{ color: "#555", flexWrap: "wrap" }}>
                      {trimmedAddress}
                    </Text>
                  </View>
                </View>

                {/* Show Plus or Cross Button based on assignment */}
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 0,
                    padding: 10,
                    backgroundColor: isAssigned ? "#ffebe6" : "#e3eeff",
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    if (!isAssigned) {
                      handleAssignLocation(item.id);
                    } else {
                      alert(
                        "This location is already assigned, ask for support to unassign"
                      );
                    }
                  }}
                >
                  {isAssigned ? (
                    <X size={32} color="red" />
                  ) : (
                    <Plus size={32} color={primary} />
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
      <View style={{padding: 30}}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 30,
    backgroundColor: 'white',
    minHeight: '100%',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    width: "100%",
    marginBottom: 10,
    marginTop: 30
  }
});


