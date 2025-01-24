import { API_ROUTES } from "@/constants/ApiRoutes";
import { api } from "@/lib/axios/axios";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { CaretRight, PlusCircle, UserCircle } from "phosphor-react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { primary } from "@/constants/Colors";
import { useRefreshOnFocus } from "@/hook/useRefetchOnFocus";
import EmptyBox from "@/components/ui/EmptyBox";
import { useEffect } from "react";
import { useMannagedCounts } from "@/store";

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

async function getSalesMenById(): Promise<SalesMenData> {
  const res = await api.get(API_ROUTES.SALESMEN.GET_BY_MANAGER_ID);
  return res.data;
}

export default function salesmen() {
  const router = useRouter();
  const salesmanQuery = useQuery<SalesMenData>({
    queryKey: ["salesman"],
    queryFn: getSalesMenById
  });
  const refetch = salesmanQuery.refetch;
  useRefreshOnFocus(refetch);
  const {setTotalSalesmen} = useMannagedCounts();
  useEffect(() => {
    if(salesmanQuery.isSuccess) {
      setTotalSalesmen(salesmanQuery.data.data.length);
    }
  }, [salesmanQuery.data]);

  return (
    <ScrollView>
      <View style={{ padding: 30, display: 'flex', alignItems: 'center', minHeight: '100%', gap: 20, position: 'relative', backgroundColor: "white" }}>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Salesmen</Text>
          <TouchableOpacity onPress={() => router.push("/(modals)/add_salesmen")}>
            <PlusCircle size={42} color={`${primary}`} />
          </TouchableOpacity>
        </View>


        <View style={{ display: 'flex', width: '100%', gap: 10 }}>
          <TextInput placeholder="search" style={style.input} keyboardType="web-search" />

          {salesmanQuery.isError && <Text>Error...</Text>}
          {salesmanQuery?.data?.data.length === 0 && <EmptyBox text="No Salesmen Found"/>}
          {salesmanQuery.data && salesmanQuery.data.data.map((item) => (
            <View key={item.id} style={{ paddingVertical: 8, backgroundColor: 'white', borderRadius: 10, display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", position: "relative" }} >
              <View style={{ display: 'flex', flexDirection: "row", justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                <UserCircle size={52} weight="duotone" color={primary} duotoneColor={primary} />
                <View style={{ flexShrink: 1 }}>
                  <Text
                    style={{ fontWeight: "500", fontSize: 18 }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{ color: "#555" }}
                  >
                    {item.uid}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={{ position: "absolute", right: 0, padding: 10, backgroundColor: "#e3eeff", borderRadius: 10 }} onPress={() => router.push(`/(modals)/salesmen/${item.id}?name=${encodeURIComponent(item.name)}&uid=${encodeURIComponent(item.uid)}`)}>
                <CaretRight size={32} color={primary} />
              </TouchableOpacity>
            </View>
          ))}
          {salesmanQuery.isFetching && <ActivityIndicator size="large" color={primary} />}
        </View>
      </View>
    </ScrollView>
  )
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