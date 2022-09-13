import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, FlatList } from "react-native";
import { Calendar } from "react-native-calendars";
import { auth, getServiceSchedule } from "../api/firebase";
import AppText from "../components/AppText";
import { useNavigation } from "@react-navigation/native";
import HourListItem from "../components/lists/HourListItem";
import Constants from "expo-constants";
import { useIsFocused } from "@react-navigation/native";
import colors from "../config/colors";

const hours = [
  { hour: 8 },
  { hour: 9 },
  { hour: 10 },
  { hour: 11 },
  { hour: 12 },
  { hour: 13 },
  { hour: 14 },
  { hour: 15 },
  { hour: 16 },
  { hour: 17 },
  { hour: 18 },
];

function MyScheduleScreen(params) {
  const navigation = useNavigation();
  const [dateSelected, setDateSelected] = useState();
  const [schedule, setSchedule] = useState({});
  const [loaded, setLoaded] = useState(0);
  const isFocused = useIsFocused();
  useEffect(() => {
    getServiceScheduleFromDB();
  }, [dateSelected]);
  useEffect(() => {
    getServiceScheduleFromDB();
  }, [isFocused]);
  const getServiceScheduleFromDB = async () => {
    const result = await getServiceSchedule(
      auth.currentUser.email,
      dateSelected
    );
    // console.log(result);
    setSchedule(result);
    setLoaded(1);
  };

  return (
    <View style={styles.container}>
      <Calendar
        // Handler which gets executed on day press. Default = undefined
        onDayPress={(day) => {
          var date = new Date(day.dateString);
          if (date.getDay() != 0 && date.getDay() != 6) {
            setLoaded(0);
            setDateSelected(day.dateString);
            // console.log(day);
            // console.log("selected day", day);
          }
        }}
        hideExtraDays={true}
        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
        monthFormat={"yyyy MM"}
        // Handler which gets executed when visible month changes in calendar. Default = undefined
        onMonthChange={(month) => {
          // console.log("month changed", month);
        }}
        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
        firstDay={1}
        // Handler which gets executed when press arrow icon left. It receive a callback can go back month
        onPressArrowLeft={(subtractMonth) => subtractMonth()}
        // Handler which gets executed when press arrow icon right. It receive a callback can go next month
        onPressArrowRight={(addMonth) => addMonth()}
        // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
        disableAllTouchEventsForDisabledDays={true}
        // Enable the option to swipe between months. Default = false
        enableSwipeMonths={true}
      />
      {dateSelected && loaded ? (
        <FlatList
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 5,
          }}
          data={hours}
          keyExtractor={(item) => item.hour.toString()}
          numColumns={1}
          renderItem={({ item }) => (
            <HourListItem
              schedule={schedule}
              hour={item.hour}
              onPress={() => {
                if (schedule[item.hour].reserved === "reserved")
                  navigation.navigate("Details", {
                    appointment: schedule[item.hour],
                    date: dateSelected,
                    hour: item.hour,
                  });
                if (
                  Object.keys(schedule[item.hour]).length === 0 ||
                  schedule[item.hour].reserved === "canceled"
                )
                  navigation.navigate("NewAppointment", {
                    hour: item.hour,
                    date: dateSelected,
                  });
                if (schedule[item.hour].reserved === "own")
                  navigation.navigate("OwnAppoitmentDetails", {
                    appointment: schedule[item.hour],
                    date: dateSelected,
                    hour: item.hour,
                  });
              }}
            />
          )}
        />
      ) : (
        <AppText style={{ textAlign: "center", marginTop: 40 }}>
          Select a date to see the hourly schedule
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: colors.backgroundColor,
    padding: 5,
    flex: 1,
  },
});

export default MyScheduleScreen;
