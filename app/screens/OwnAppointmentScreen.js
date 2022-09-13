import React from "react";
import { StyleSheet } from "react-native";
import AppPicker from "../components/AppPicker";
import PickerItem from "../components/PickerItem";
import * as Yup from "yup";
import Screen from "../components/Screen";
import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import { auth, db } from "../api/firebase";
import { doc, updateDoc } from "firebase/firestore";
import AppButton from "../components/AppButton";

const validationSchema = Yup.object().shape({
  clientName: Yup.string().label("Client name"),
  clientPhone: Yup.string()
    .required()
    .matches(
      /^((\\+[0-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Invalid phone number"
    ),
  clientEmail: Yup.string().email().label("Email"),
  category: Yup.string().required().label("Category"),
  make: Yup.string().label("Make"),
  model: Yup.string().label("Model"),
  year: Yup.number().max(2025).label("Year"),
  description: Yup.string().label("Description"),
});

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
function OwnAppointmentScreen({ route, navigation }) {
  var { hour, date } = route.params;

  const handleSubmit = async (listing) => {
    var data = {};
    data[hour] = {
      reserved: "own",
      clientName: listing.clientName,
      clientPhone: listing.clientPhone,
      clientEmail: listing.clientEmail,
      category: listing.category,
      make: listing.make,
      model: listing.model,
      year: listing.year,
      description: listing.description,
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
    <Screen style={styles.container}>
      <AppForm
        initialValues={{
          clientName: "",
          clientPhone: "",
          clientEmail: "",
          category: "",
          make: "",
          model: "",
          year: "",
          description: "",
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <AppFormField
          maxLength={255}
          name="clientName"
          placeholder="Client Name"
        />
        <AppFormField
          maxLength={12}
          name="clientPhone"
          keyboardType="numeric"
          placeholder="Client phone number"
        />
        <AppFormField
          maxLength={255}
          name="clientEmail"
          placeholder="Client email"
        />
        <AppPicker
          items={categories}
          name="category"
          PickerItemComponent={PickerItem}
          placeholder="Category"
        />
        <AppFormField maxLength={255} name="make" placeholder="Car make" />
        <AppFormField maxLength={255} name="model" placeholder="Car model" />
        <AppFormField
          name="year"
          maxLength={4}
          keyboardType="numeric"
          placeholder="Car year"
        />
        <AppFormField
          maxLength={255}
          multiline
          name="description"
          numberOfLines={3}
          placeholder="Details"
        />

        <SubmitButton title="Add" backgroundcolor="secondary" />
      </AppForm>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default OwnAppointmentScreen;
