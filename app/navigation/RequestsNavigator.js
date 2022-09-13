import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import ServiceRequestScreen from "../screens/ServiceRequestScreen";

import RequestDetailsScreen from "../screens/RequestDetailsScreen";
import CarDetailsScreen from "../screens/CarDetailsScreen";

const Stack = createStackNavigator();

function RequestsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyRequests"
        component={ServiceRequestScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        options={{ title: "Request Details" }}
        name="Details"
        component={RequestDetailsScreen}
      />
      <Stack.Screen
        options={{ title: "Car Details" }}
        name="CarDetails"
        component={CarDetailsScreen}
      />
    </Stack.Navigator>
  );
}
export default RequestsNavigator;
