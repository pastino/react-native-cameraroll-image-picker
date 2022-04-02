import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import * as T from "./types";

interface Props {
  handleSelect: () => void;
  item: T.Photo;
  isChecked: boolean;
  selectedIndex: number;
  styles?: {};
}

/**
 * Returns the sum of a and b
 * @param handleSelect callback on image selection
 * @param item photo item
 * @param isChecked
 * @param selectedIndex selected image order
 * @param styles photo styles
 */
const ImageItem = ({
  handleSelect,
  item,
  isChecked,
  selectedIndex,
  styles,
}: Props) => {
  const [error, setError] = useState(false);

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
        <View
          style={{
            width: 25,
            height: 25,
            borderRadius: 15,
            backgroundColor: "#FFD54F",
            position: "absolute",
            top: 5,
            left: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#2D3239", fontWeight: "700" }}>
            {selectedIndex + 1}
          </Text>
        </View>
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
