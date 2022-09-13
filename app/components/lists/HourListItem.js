import React from "react";
import { View, StyleSheet } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import colors from "../../config/colors";
import AppText from "../AppText";
function HourListItem({ schedule, hour, onPress }) {
  return (
    <View
      style={{
        backgroundColor:
          schedule[hour].reserved === "reserved"
            ? "orange"
            : schedule[hour].reserved === "own"
            ? "#b39200"
            : colors.brigthGreen,
        width: "90%",
        margin: 2,
        padding: 10,
        borderColor: colors.medium,
        borderWidth: 2,
        borderRadius: 10,
        alignSelf: "center",
      }}
    >
      <TouchableWithoutFeedback onPress={onPress}>
        <AppText>
          {hour}:00{" "}
          {schedule[hour].reserved === "reserved"
            ? "Reserved (tap for details)"
            : schedule[hour].reserved === "own"
            ? "Own appointment (tap for details"
            : "Free (tap to add own)"}
        </AppText>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default HourListItem;
