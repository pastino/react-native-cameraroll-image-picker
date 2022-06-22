/// <reference types="react" />
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
declare const ImageItem: ({ handleSelect, item, isChecked, selectedIndex, isMultiSelect, styles, }: Props) => JSX.Element;
export default ImageItem;
