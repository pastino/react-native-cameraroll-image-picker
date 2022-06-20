import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { PhotoState } from "./types";

interface Props {
  handleSelect: () => void;
  item: PhotoState;
  isChecked: boolean;
  selectedIndex: number;
  isMultiSelect: boolean;
  styles?: {};
}

/**
 * Returns the sum of a and b
 * @param handleSelect callback on image selection
 * @param item photo item
 * @param isChecked
 * @param selectedIndex selected image order
 * @param isMultiSelect
 * @param styles photo styles
 */
const ImageItem = ({
  handleSelect,
  item,
  isChecked,
  selectedIndex,
  isMultiSelect,
  styles,
}: Props) => {
  const [error, setError] = useState(false);

  const selectCircleStyles = {
    width: 25,
    height: 25,
    borderRadius: 15,

    position: "absolute",
    top: 5,
    left: 5,
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{ position: "relative" }}
      onPress={handleSelect}
    >
      <Image
        style={styles}
        onError={() => setError(true)}
        source={{ uri: item.uri }}
      />
      {isChecked ? (
        !isMultiSelect ? (
          <View style={selectCircleStyles as never}>
            <Image
              source={require("./assets/check-on.png")}
              style={{ width: 25, height: 25 }}
            />
          </View>
        ) : (
          <View
            style={
              {
                ...selectCircleStyles,
                backgroundColor: "#FFD54F",
              } as never
            }
          >
            <Text style={{ color: "#2D3239", fontWeight: "700" }}>
              {selectedIndex + 1}
            </Text>
          </View>
        )
      ) : (
        <View
          style={{
            width: 25,
            height: 25,
            borderRadius: 15,
            backgroundColor: "black",
            opacity: 0.5,
            position: "absolute",
            top: 5,
            left: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      )}
    </TouchableOpacity>
  );
};

export default ImageItem;
