import { API_ROUTES } from "@/constants/ApiRoutes";
import { api } from "@/lib/axios/axios";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { CaretRight, PlusCircle } from "phosphor-react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { primary } from "@/constants/Colors";
import { useRefreshOnFocus } from "@/hook/useRefetchOnFocus";

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
  useRefreshOnFocus(() => salesmanQuery.refetch());
  const router = useRouter();
  const salesmanQuery = useQuery<SalesMenData>({
    queryKey: ["salesman"],
    queryFn: getSalesMenById
  });

  return (
    <ScrollView>
      <View style={{ padding: 30, display: 'flex', alignItems: 'center', minHeight: '100%', gap: 20, position: 'relative', backgroundColor: "white" }}>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Salesmen</Text>
          <TouchableOpacity onPress={() => router.push("/(modals)/add_salesmen")}>
            <PlusCircle size={32} color={`${primary}`} />
          </TouchableOpacity>
        </View>


        <View style={{ display: 'flex', width: '100%', gap: 10 }}>
          <TextInput placeholder="search" style={style.input} keyboardType="web-search" />

          {salesmanQuery.isLoading && <Text>Loading...</Text>}
          {salesmanQuery.isError && <Text>Error...</Text>}
          {salesmanQuery.data && salesmanQuery.data.data.map((item) => (
            <View key={item.id} style={{ padding: 10, backgroundColor: '#f2f2f2', borderRadius: 10, display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", position: "relative" }} >
              <View>
                <Text style={{ fontWeight: 500, fontSize: 18 }}>{item.name}</Text>
                <Text style={{}}>{item.uid}</Text>
              </View>
              <TouchableOpacity style={{ position: "absolute", right: 10 }}>
                <CaretRight size={32} />
              </TouchableOpacity>
            </View>
          ))}
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