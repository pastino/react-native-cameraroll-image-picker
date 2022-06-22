import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
/**
 * Returns the sum of a and b
 * @param handleSelect callback on image selection
 * @param item photo item
 * @param isChecked
 * @param selectedIndex selected image order
 * @param isMultiSelect
 * @param styles photo styles
 */
const ImageItem = ({ handleSelect, item, isChecked, selectedIndex, isMultiSelect, styles, }) => {
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
    return (_jsxs(TouchableOpacity, { activeOpacity: 1, style: { position: "relative" }, onPress: handleSelect, children: [_jsx(Image, { style: styles, onError: () => setError(true), source: { uri: item.uri } }), isChecked ? (!isMultiSelect ? (_jsx(View, { style: selectCircleStyles, children: _jsx(Image, { source: require("./assets/check-on.png"), style: { width: 25, height: 25 } }) })) : (_jsx(View, { style: {
                    ...selectCircleStyles,
                    backgroundColor: "#FFD54F",
                }, children: _jsx(Text, { style: { color: "#2D3239", fontWeight: "700" }, children: selectedIndex + 1 }) }))) : (_jsx(View, { style: {
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
                } }))] }));
};
export default ImageItem;
