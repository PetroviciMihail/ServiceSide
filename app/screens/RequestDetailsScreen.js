import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { ListItem } from "../components/lists";
import CarListItem from "../components/lists/CarListItem";
import AppText from "../components/AppText";
import colors from "../config/colors";
import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import { doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { db, auth, getRequestOffers } from "../api/firebase";
import InfoListItem from "../components/lists/InfoListItem";
function RequestDetailsScreen({ route, navigation }) {
  const item = route.params;

  const [price, setPrice] = useState();
  const [offers, setOffers] = useState();

  const submitOffer = () => {
    var datestring = item.timeadded;

    var docName = item.carVinNumber + datestring;
    var data = {
      offers: arrayUnion(price),
      services: arrayUnion(auth.currentUser.email),
    };
    updateDoc(doc(db, "ServiceRequests", docName), data)
      .then(() => {
        //console.log("Request updated");
      })
      .catch((error) => {
        alert(error.message);
      });

    ////////////////////////////////
    var time = new Date();
    var datestringoffer =
      time.getDate() +
      "-" +
      (time.getMonth() + 1) +
      "-" +
      time.getFullYear() +
      " " +
      time.getHours() +
      ":" +
      time.getMinutes();

    var offerDocName = datestringoffer;

    var data = {
      serviceName: auth.currentUser.displayName,
      serviceMail: auth.currentUser.email,
      price: price,
      //details
      data: datestringoffer,
      timeadded: item.timeadded,
      carVinNumber: item.carVinNumber,
      distance: item.distance,
    };
    setDoc(doc(db, "ServiceRequests", docName, "Offers", offerDocName), data)
      .then(() => {
        //console.log("offer added for the request: " + docName);
      })
      .catch((error) => {
        alert(error.message);
      });
    navigation.pop();
  };

  useEffect(() => {
    getRequestDetailsFromDB();
  }, []);

  const getRequestDetailsFromDB = async () => {
    const result = await getRequestOffers(
      item.owner,
      item.carVinNumber + item.timeadded
    );
    //console.log(" request details incarcate");
    setOffers(result);
  };
  return (
    <ScrollView style={styles.container}>
      <InfoListItem title="Categoria" info={item.category} />
      <InfoListItem title={"Car"}>
        <CarListItem
          title={item.carMake + " " + item.carModel}
          subTitle={item.carYear}
          image={item.carImage}
          onPress={() => {
            navigation.navigate("CarDetails", item.carVinNumber);
          }}
        />
      </InfoListItem>
      <InfoListItem
        title={"Details"}
        info={item.details ? item.details : "no details"}
      />
      <InfoListItem title={"Images"}>
        <View style={styles.imagesContainer}>
          {item.images.length ? (
            item.images.map((imageUrl, key) => {
              return (
                <Image
                  style={styles.image}
                  source={{ uri: imageUrl }}
                  key={key}
                />
              );
            })
          ) : (
            <AppText style={{ padding: 5, textAlign: "center" }}>
              No images
            </AppText>
          )}
        </View>
      </InfoListItem>
      <AppTextInput
        icon="gold"
        onChangeText={(text) => setPrice(text)}
        keyboardType="number-pad"
        placeholder="Price for the visit"
      />
      <AppButton
        title="Send the offer"
        onPress={submitOffer}
        color="secondary"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
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
    width: "100%",
    height: 300,
  },
  imagesContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RequestDetailsScreen;
