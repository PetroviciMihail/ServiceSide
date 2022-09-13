import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  RefreshControl,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import colors from "../config/colors";
import { auth, getRequests } from "../api/firebase";
import RequestListItem from "../components/lists/RequestListItem";
import AppTextInput from "../components/AppTextInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PickerItem from "../components/PickerItem";
import { ScrollView } from "react-native-gesture-handler";

const categories = [
  {
    label: "All",
    value: 0,
  },
  {
    label: "Inspection",
    value: 1,
  },
  {
    label: "Diagnostics",
    value: 2,
  },
  {
    label: "Maintenance",
    value: 3,
  },
  {
    label: "Brakes",
    value: 4,
  },
  {
    label: "Suspension",
    value: 5,
  },
  {
    label: "Direction",
    value: 6,
  },
  {
    label: "Tyres-Wheels",
    value: 7,
  },
  {
    label: "Engine",
    value: 8,
  },
  {
    label: "Ac and heating",
    value: 9,
  },
  {
    label: "Body work",
    value: 10,
  },
  {
    label: "Paint",
    value: 11,
  },
];

function ServiceRequestScreen({ navigation }) {
  //const getListingsApi = useApi(listingsApi.getListings);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [requestsdata, setrequestsData] = useState([]);
  const [distance, setDistance] = useState("3");
  const [category, setCategory] = useState("All");
  //console.log("am reincarcat toata faza");
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    //console.log("refershing");
    wait(1000).then(() => setRefreshing(false));
  }, []);
  useEffect(() => {
    //console.log("-----------------------------");
    getServiceRequestFromDB();
  }, []);
  useEffect(() => {
    //console.log("-----------------------------");
    getServiceRequestFromDB();
  }, [distance, isFocused, category, refreshing]);

  const getServiceRequestFromDB = async () => {
    const result = await getRequests(
      auth.currentUser.email,
      distance,
      category
    );
    setrequestsData(result);
    //console.log(requestsdata);
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.title}>
          Choose radius around the service (km)
        </AppText>
        <AppTextInput
          width="40%"
          icon="map-marker-radius"
          placeholder={"Distance"}
          defaultValue={distance}
          keyboardType="number-pad"
          onChangeText={(text) => {
            setDistance(text);
          }}
        />
      </View>
      <View style={styles.header}>
        <AppText style={styles.title}>Choose</AppText>
        <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
          <View style={styles.picker}>
            <AppText style={styles.text}>{category}</AppText>

            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color={colors.medium}
            />
          </View>
        </TouchableWithoutFeedback>
        <Modal visible={modalVisible} animationType="slide">
          <Screen>
            <AppButton
              title="Close"
              color={"medium"}
              onPress={() => setModalVisible(false)}
            />
            <FlatList
              data={categories}
              keyExtractor={(item) => item.value.toString()}
              numColumns={1}
              renderItem={({ item }) => (
                <PickerItem
                  label={item.label}
                  onPress={() => {
                    setModalVisible(false);
                    setCategory(item.label);
                  }}
                />
              )}
            />
          </Screen>
        </Modal>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {requestsdata.length ? (
          <View style={{ flex: 1 }}>
            <FlatList
              data={requestsdata}
              keyExtractor={(item) => item.timestamp}
              renderItem={({ item }) => (
                <RequestListItem
                  category={"Category: " + item.category}
                  title={
                    item.carMake + " " + item.carModel + " " + item.carYear
                  }
                  image={item.images[0]}
                  subTitle={"Current number of offers: " + item.offers.length}
                  onPress={() => navigation.navigate("Details", item)}
                />
              )}
            />
          </View>
        ) : (
          <AppText style={styles.missingMessage}>
            No local requests yet, choose another category or select a bigger
            radius
          </AppText>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundColor,
  },
  title: {
    fontSize: 18,
    paddingLeft: 25,
    paddingTop: 20,
    color: colors.dark,
    marginBottom: 15,
    width: "60%",
  },
  addbutton: {
    bottom: 10,
  },
  missingMessage: {
    flex: 1,
    marginTop: 200,
    textAlign: "center",
    textAlignVertical: "center",
  },
  header: {
    flexDirection: "row",
    width: "100%",
  },
  picker: {
    backgroundColor: colors.light,
    borderRadius: 25,
    flexDirection: "row",
    width: "40%",
    padding: 15,
    paddingLeft: 25,
    marginRight: 25,
    marginVertical: 5,
    justifyContent: "center",
  },
});

export default ServiceRequestScreen;
