import { API_ROUTES } from '@/constants/ApiRoutes';
import { primary, secondary } from '@/constants/Colors';
import { api } from '@/lib/axios/axios';
import { useMannagedCounts } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { MapPin, UserCircle } from 'phosphor-react-native';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native'

interface SalesMen {
  id: number;
  name: string;
  uid: string;
  phone: string;
  managerId: number;
}

interface SalesMenData {
  data: SalesMen[];
}

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

async function getSalesMenById(): Promise<SalesMenData> {
  const res = await api.get(API_ROUTES.SALESMEN.GET_BY_MANAGER_ID);
  return res.data;
}
async function getLocationById(): Promise<LocationData> {
  const res = await api.get(API_ROUTES.LOCATION.GET_BY_MANAGER_ID);
  return res.data;
}

export default function TotalMannaged() {
  const { setTotalSalesmen, setTotalStores, totalSalesmen, totalStores } = useMannagedCounts();
  const salesmanQuery = useQuery<SalesMenData>({
    queryKey: ["salesman"],
    queryFn: getSalesMenById
  });
  useEffect(() => {
    if (salesmanQuery.isSuccess) {
      setTotalSalesmen(salesmanQuery.data.data.length);
    }
  }, [salesmanQuery.data]);

  const locationQuery = useQuery<LocationData>({
    queryKey: ["store"],
    queryFn: getLocationById
  });
  useEffect(() => {
    if (locationQuery.isSuccess) {
      setTotalStores(locationQuery.data.data.length);
    }
  }, [locationQuery.data]);

  return (
    <View style={{ padding: 30, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', gap: 30 }}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <UserCircle size={100} weight="duotone" color={primary} duotoneColor={primary} />
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: primary }}>Salesman: {totalSalesmen}</Text>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <MapPin size={100} weight="duotone" color={primary} duotoneColor={primary} />
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: primary }}>Stores: {totalStores}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})