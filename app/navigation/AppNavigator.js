import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import AccountNavigator from "./AccountNavigator";

import RequestsNavigator from "./RequestsNavigator";
import ScheduleNavigator from "./ScheduleNavigator";

const Tab = createBottomTabNavigator();

function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Service Requests"
        component={RequestsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="request-quote" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="My Schedule"
        component={ScheduleNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calendar-clock"
              color={color}
              size={size}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="My Account"
        component={AccountNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default AppNavigator;
