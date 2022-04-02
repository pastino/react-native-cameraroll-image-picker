/// <reference types="react" />
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
declare const ImageItem: ({ handleSelect, item, isChecked, selectedIndex, styles, }: Props) => JSX.Element;
export default ImageItem;
