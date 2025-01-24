import { API_ROUTES } from '@/constants/ApiRoutes';
import { primary } from '@/constants/Colors';
import { useRefreshOnFocus } from '@/hook/useRefetchOnFocus';
import { api } from '@/lib/axios/axios';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import BoxEmpty from './BoxEmpty';
import { ClockCounterClockwise, GpsFix, MapPin } from 'phosphor-react-native';

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

interface VisitedLocationsData {
  data: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    date: Date;
    locationId: number;
    UserLatitude: number;
    UserLongitude: number;
    scanDistance: number;
    visitCount: number;
    salesManId: number;
  }[] | [];
}

async function getAssignedStores(id: number): Promise<AssignedStoresData> {
  const res = await api.get(API_ROUTES.SALESMEN.GET_ASSIGNED_STORES_BY_SALESMAN_ID + id);
  return res.data;
}

async function getVisitedLocations(id: number): Promise<VisitedLocationsData> {
  const res = await api.get(API_ROUTES.SALESMEN.GET_VISITED_LOCATIONS_BY_SALESMAN_ID + id);
  return res.data;
}

export default function AssignedStores({ id }: { id: number }) {

  const assignedStoresQuery = useQuery({
    queryKey: ['assignedStores'],
    queryFn: () => getAssignedStores(id)
  })
  const refetch = assignedStoresQuery.refetch;
  useRefreshOnFocus(refetch);

  useEffect(() => {
    if (assignedStoresQuery.isSuccess) {
      console.log(assignedStoresQuery.data)
    }
    if (assignedStoresQuery.isError) {
      alert(assignedStoresQuery.error)
    }
  }, [assignedStoresQuery.data]);

  const vistitedLocationQuery = useQuery({
    queryKey: ['visitedLocations'],
    queryFn: () => getVisitedLocations(id)
  })

  useEffect(() => {
    if (vistitedLocationQuery.isSuccess) {
      console.log(vistitedLocationQuery.data)
    }
    if (vistitedLocationQuery.isError) {
      alert(vistitedLocationQuery.error)
    }
  }, []);

  if (assignedStoresQuery.data?.assign.length === 0) {
    return (
      <View style={{ marginTop: 20 }}>
        <BoxEmpty text="No Assigned Stores" />
      </View>
    )
  }

  const getScanDistanceFromLocationId = (locationId: number) => {
    const location = vistitedLocationQuery.data?.data.find((item) => item.locationId === locationId);
    return location?.scanDistance;
  }

  const getVisitCountFromLocationId = (locationId: number) => {
    const location = vistitedLocationQuery.data?.data.find((item) => item.locationId === locationId);
    return location ? location?.visitCount : 0;
  }

  return (
    <View style={{ marginTop: 10 }}>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <MapPin size={24} weight="bold" color={primary} />
          <Text style={styles.infoText}>Assigned Stores: {assignedStoresQuery?.data?.assign?.length} </Text>
        </View>
        <View style={styles.infoRow}>
          <ClockCounterClockwise size={24} weight="bold" color={primary} />
          <Text style={styles.infoText}>Last Activity:
            {
              (vistitedLocationQuery.data ? vistitedLocationQuery.data.data.length > 0 : false)
              ? `${vistitedLocationQuery.data?.data[vistitedLocationQuery.data?.data.length - 1]?.updatedAt}`
              : ' NA '
           }</Text>
        </View>
      </View>

      {
        assignedStoresQuery.data?.assign.map((item) => {
          const truncate = (text: string, maxLength: number) =>
            text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

          const trimmedName = truncate(item.Location.name, 20);
          const trimmedAddress = truncate(item.Location.address, 30);

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
                  alignItems: 'flex-start',
                  gap: 10
                }}
              >
                <GpsFix size={24} color={primary} duotoneColor={primary} />
                <View>
                  {/* Truncated Name */}
                  <Text>{trimmedName}</Text>
                  {/* Full Multiline Address */}
                  <Text style={{ color: "#aaa", flexWrap: "wrap" }}>{trimmedAddress}</Text>
                  <Text style={{ color: "#aaa" }}>Scan Distance: {getScanDistanceFromLocationId(item.locationId) || 0} </Text>
                </View>
              </View>
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  padding: 10,
                  backgroundColor: "#fff2f2",
                  borderRadius: 10
                }}
              >
                <Text style={{ color: 'red' }}> {getVisitCountFromLocationId(item.locationId)} </Text>
              </View>
            </View>
          );
        })
      }
      {
        assignedStoresQuery.isFetching && <ActivityIndicator size="large" color={primary} />
      }

    </View>
  )
}

const styles = StyleSheet.create({
  infoContainer: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#f2fafb',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    gap: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontWeight: '500',
    color: '#555',
    marginLeft: 10,
  },
})