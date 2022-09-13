import React, { useEffect, useState } from "react";
import { StyleSheet, Image } from "react-native";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import { ListItem2 } from "../components/lists";
import { getCarDetails } from "../api/firebase";
import InfoListItem from "../components/lists/InfoListItem";

function CarDetailsScreen({ route }) {
  const [car, setCar] = useState({});
  const carVinNumber = route.params;
  const [loaded, setLoaded] = useState(0);
  useEffect(() => {
    getCarFromDB();
  }, []);

  const getCarFromDB = async () => {
    const result = await getCarDetails(carVinNumber);
    setCar(result);
    //console.log(result);
    setLoaded(1);
  };
  return (
    <Screen>
      {loaded ? (
        <>
          {car.carImageUrl ? (
            <Image style={styles.image} source={{ uri: car.carImageUrl }} />
          ) : null}
          <InfoListItem title={"Make"} info={car.make} />
          <InfoListItem title={"Model"} info={car.model} />
          <InfoListItem title={"Vin Number"} info={car.vinNumber} />
          <InfoListItem title={"Year"} info={car.year} />
          <InfoListItem title={"Details"} info={car.extraDetails} />
        </>
      ) : (
        <AppText style={{ alignItems: "center", justifyContent: "center" }}>
          Loading...
        </AppText>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: "contain",
    width: "100%",
    height: 300,
    margin: 5,
  },
  imagesContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CarDetailsScreen;
