import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../config/colors";
import Screen from "../components/Screen";
import { ListItem } from "../components/lists";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import { auth, db } from "../api/firebase";
import { doc, updateDoc } from "firebase/firestore";
function OwnAppointmentDetailsScreen({ route, navigation }) {
  const { appointment, date, hour } = route.params;
  const cancelRequest = () => {
    var data = {};
    data[hour] = {
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
      data
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
      <ListItem title="Categoria" subTitle={appointment.category} />
      <View style={styles.detailsContainer}>
        <AppText style={styles.detailsTag}>Nume Client</AppText>
        {appointment.clientName.length ? (
          <AppText style={styles.details}>{appointment.clientName}</AppText>
        ) : (
          <AppText style={styles.details}>-</AppText>
        )}
      </View>
      <View style={styles.detailsContainer}>
        <AppText style={styles.detailsTag}>Numar de telefon client</AppText>
        {appointment.clientPhone.length ? (
          <AppText style={styles.details}>{appointment.clientPhone}</AppText>
        ) : (
          <AppText style={styles.details}>no phone</AppText>
        )}
      </View>
      <View style={styles.detailsContainer}>
        <AppText style={styles.detailsTag}>E-mail client</AppText>
        {appointment.clientEmail.length ? (
          <AppText style={styles.details}>{appointment.clientEmail}</AppText>
        ) : (
          <AppText style={styles.details}>-</AppText>
        )}
      </View>
      <View style={styles.detailsContainer}>
        <AppText style={styles.detailsTag}>Marca mașinii</AppText>
        {appointment.make.length ? (
          <AppText style={styles.details}>{appointment.make}</AppText>
        ) : (
          <AppText style={styles.details}>-</AppText>
        )}
      </View>
      <View style={styles.detailsContainer}>
        <AppText style={styles.detailsTag}>Modelul</AppText>
        {appointment.model.length ? (
          <AppText style={styles.details}>{appointment.model}</AppText>
        ) : (
          <AppText style={styles.details}>-</AppText>
        )}
      </View>
      <View style={styles.detailsContainer}>
        <AppText style={styles.detailsTag}>Anul</AppText>
        {appointment.year.length ? (
          <AppText style={styles.details}>{appointment.year}</AppText>
        ) : (
          <AppText style={styles.details}>-</AppText>
        )}
      </View>
      <View style={styles.detailsContainer}>
        <AppText style={styles.detailsTag}>Descriere</AppText>
        {appointment.description.length ? (
          <AppText style={styles.details}>{appointment.description}</AppText>
        ) : (
          <AppText style={styles.details}>-</AppText>
        )}
      </View>
      <AppButton
        title="Delete"
        color="dark"
        style={{ flex: 0.5, margin: 2 }}
        onPress={() => {
          cancelRequest();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
  detailsContainer: {
    marginTop: 5,
    backgroundColor: colors.white,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
  },
  detailsTag: {
    marginTop: 5,
    fontSize: 24,
    textAlign: "center",
  },
});

export default OwnAppointmentDetailsScreen;
