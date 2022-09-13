import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import RequestDetailsScreen from "../screens/RequestDetailsScreen";
import MyScheduleScreen from "../screens/MyScheduleScreen";
import CarDetailsScreen from "../screens/CarDetailsScreen";
import ScheduleDetailsScreen from "../screens/ScheduleDetailsScreen";
import OwnAppointmentScreen from "../screens/OwnAppointmentScreen";
import OwnAppointmentDetailsScreen from "../screens/OwnAppointmentDetailsScreen";

const Stack = createStackNavigator();

function ScheduleNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Schedule"
        component={MyScheduleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        options={{ title: "Appointment Details" }}
        name="Details"
        component={ScheduleDetailsScreen}
      />
      <Stack.Screen name="CarDetails" component={CarDetailsScreen} />
      <Stack.Screen
        options={{ title: "Add your own Appointment" }}
        name="NewAppointment"
        component={OwnAppointmentScreen}
      />
      <Stack.Screen
        options={{ title: "Own appointment" }}
        name="OwnAppoitmentDetails"
        component={OwnAppointmentDetailsScreen}
      />
    </Stack.Navigator>
  );
}
export default ScheduleNavigator;
