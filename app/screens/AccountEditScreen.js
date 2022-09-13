import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import * as Yup from "yup";

import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import { auth, getAccountDetails, db } from "../api/firebase";
import { doc, updateDoc } from "firebase/firestore";
import MapView, { Marker } from "react-native-maps";
import AppText from "../components/AppText";
import * as Location from "expo-location";

const validationSchema = Yup.object().shape({
  serviceName: Yup.string().required().min(2).label("Service Name"),
  adress: Yup.string().required().min(10).label("Adress"),
  phone: Yup.string()
    .required()
    .matches(
      /^((\\+[0-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Invalid Phone number"
    ),
});

function AccountEditScreen({ navigation }) {
  const [coordsX, setCoordsX] = useState(26.10401); //longitude
  const [coordsY, setCoordsY] = useState(44.42946); //latitude
  var initialValues = {
    adress: "",
    phone: "",
    serviceName: auth.currentUser.displayName.substring(8),
  };
  useEffect(() => {
    loadAccountDetailsFromDB();
  }, []);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (!status) return;
    const {
      coords: { latitude, longitude },
    } = await Location.getLastKnownPositionAsync({});

    setCoordsX(longitude);
    setCoordsY(latitude);
  };
  const loadAccountDetailsFromDB = async () => {
    getLocation();
    const result = await getAccountDetails(auth.currentUser.email);
    //console.log("service details incarcate" + auth.currentUser.email);
    //console.log(result[0]);
    initialValues.adress = result[0].adress;
    initialValues.phone = result[0].phone;
    result[0].lng && setCoordsX(result[0].lng);
    result[0].lat && setCoordsY(result[0].lat);
  };

  const handleUpdate = async (values) => {
    var data = {
      adress: values.adress,
      name: values.serviceName,
      phone: values.phone,
      lat: coordsY,
      lng: coordsX,
    };
    updateDoc(doc(db, "ServiceAccountsDetails", auth.currentUser.email), data)
      .then(() => {
        //console.log("ServiceAccountsDetails updated");
      })
      .catch((error) => {
        alert(error.message);
      });

    auth.currentUser.updateProfile({
      displayName: "Service " + values.serviceName,
    });
    navigation.pop();
  };

  return (
    <ScrollView style={styles.container}>
      <AppForm
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={handleUpdate}
        validationSchema={validationSchema}
      >
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="polaroid"
          name="serviceName"
          placeholder={"Service Name"}
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="map-marker"
          name="adress"
          placeholder="Adress"
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="phone"
          name="phone"
          placeholder="Phone number"
          textContentType="telephoneNumber"
          keyboardType="phone-pad"
        />
        <SubmitButton title="Save" backgroundcolor="medium" />
      </AppForm>
      <AppText style={{ textAlign: "center" }}>
        Pick the service location on map (long press the pin to move)
      </AppText>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coordsY,
          longitude: coordsX,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          draggable
          coordinate={{ latitude: coordsY, longitude: coordsX }}
          onDragEnd={(e) => {
            setCoordsX(parseFloat(e.nativeEvent.coordinate.longitude));
            setCoordsY(parseFloat(e.nativeEvent.coordinate.latitude));
          }}
        />
      </MapView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  map: {
    width: 400,
    height: 400,
    marginBottom: 20,
  },
});

export default AccountEditScreen;
