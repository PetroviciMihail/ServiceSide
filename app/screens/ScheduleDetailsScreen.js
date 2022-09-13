import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import Screen from "../components/Screen";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { ListItem } from "../components/lists";
import CarListItem from "../components/lists/CarListItem";
import AppText from "../components/AppText";
import colors from "../config/colors";
import { db, auth } from "../api/firebase";
import InfoListItem from "../components/lists/InfoListItem";

function ScheduleDetailsScreen({ route, navigation }) {
  const { appointment, date, hour } = route.params;
  const [loaded, setLoaded] = useState(0);
  const [request, setRequest] = useState({});
  const [finalPrice, setFinalPrice] = useState(0);
  const [odometer, setOdometer] = useState(0);
  //appoitment in client appointments vin+requestTImeAdded de updatat cu km, done sau cancelled
  //detaiile despre request le iau din servicerequests, carvin+requestTimeAdded
  useEffect(() => {
    getDetailsFromDB();
  }, []);

  const getDetailsFromDB = async () => {
    const docSnap = await getDoc(
      doc(
        db,
        "ServiceRequests",
        appointment.carVinNumber + appointment.requestTimeAdded
      )
    );
    setRequest(docSnap.data());

    setLoaded(1);
  };

  const confirmRequest = () => {
    var docName = request.carVinNumber + request.timeadded;
    var data = {
      done: true,
    };
    updateDoc(doc(db, "ServiceRequests", docName), data)
      .then(() => {
        //console.log("Request updated-done");
      })
      .catch((error) => {
        alert(error.message);
      });

    var docName = request.carVinNumber + request.timeadded;
    var data = {
      done: true,
      price: finalPrice,
      km: odometer,
    };
    updateDoc(
      doc(db, "ClientsAccountDetails", request.owner, "appoitments", docName),
      data
    )
      .then(() => {
        //console.log("appoitment updated-done");
      })
      .catch((error) => {
        alert(error.message);
      });
    navigation.pop();
  };

  const cancelRequest = () => {
    var docName = request.carVinNumber + request.timeadded;
    var data = {
      canceled: true,
    };
    updateDoc(doc(db, "ServiceRequests", docName), data)
      .then(() => {
        //console.log("Request updated-canceled");
      })
      .catch((error) => {
        alert(error.message);
      });

    updateDoc(
      doc(db, "ClientsAccountDetails", request.owner, "appoitments", docName),
      data
    )
      .then(() => {
        //console.log("appoitment updated-canceled");
      })
      .catch((error) => {
        alert(error.message);
      });
    var data2 = {};
    data2[hour] = {
      reserved: "canceled",
    };
    updateDoc(
      doc(
        db,
        "ServiceAccountsDetails",
        auth.currentUser.email,
        "calendar",
        date
      ),
      data2
    )
      .then(() => {
        // console.log(
        //   "date doc updated for " +
        //     auth.currentUser.email +
        //     " date: " +
        //     date +
        //     " hour" +
        //     hour
        // );
        navigation.navigate("Schedule");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <Screen>
      {loaded ? (
        <>
          <InfoListItem title={"Category"} info={request.category} />
          <InfoListItem title={"Car"}>
            <CarListItem
              title={request.carMake + " " + request.carModel}
              subTitle={request.carYear}
              image={request.carImage}
              onPress={() => {
                navigation.navigate("CarDetails", request.carVinNumber);
              }}
            />
          </InfoListItem>
          <InfoListItem
            title={"Details"}
            info={request.details.length ? request.details : "no details"}
          />
          <InfoListItem title={"Images"}>
            {request.images.length ? (
              <View style={styles.imagesContainer}>
                {request.images.map((imageUrl, key) => {
                  return (
                    <Image
                      style={styles.image}
                      source={{ uri: imageUrl }}
                      key={key}
                    />
                  );
                })}
              </View>
            ) : (
              <AppText style={{ padding: 5, textAlign: "center" }}>
                no images
              </AppText>
            )}
          </InfoListItem>
        </>
      ) : null}
      {!request.done ? (
        <>
          <AppTextInput
            icon="gold"
            onChangeText={(text) => setFinalPrice(text)}
            keyboardType="number-pad"
            placeholder="Final price for the visit"
          />
          <AppTextInput
            icon="car-cruise-control"
            onChangeText={(text) => setOdometer(text)}
            keyboardType="number-pad"
            placeholder="Currenet odometer"
          />
          <View style={{ flexDirection: "row" }}>
            <AppButton
              title="Cancel appointment"
              color="dark"
              style={{ flex: 0.5, margin: 2 }}
              onPress={() => {
                cancelRequest();
              }}
            />
            <AppButton
              title="Confirm"
              color="secondary"
              style={{ flex: 0.5, margin: 2 }}
              onPress={() => {
                confirmRequest();
              }}
            />
          </View>
        </>
      ) : (
        <InfoListItem title={"Already done!"} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
  detailsTag: {
    marginTop: 5,
    fontSize: 24,
    textAlign: "center",
  },
  detailsContainer: {
    marginTop: 5,
    backgroundColor: colors.white,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
  },
  image: {
    resizeMode: "contain",
    width: 400,
    height: 400,
    margin: 5,
  },
  imagesContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ScheduleDetailsScreen;
