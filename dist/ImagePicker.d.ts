/// <reference types="react" />
import { GroupType, AssetType } from "@react-native-community/cameraroll";
import * as T from "./types";
interface Props {
    callback?: (item: T.Photo, index: number) => void;
    initialNumToRender?: number;
    groupTypes?: GroupType;
    assetType?: AssetType;
    currentAlbum?: any;
    selected?: T.Photo[];
    maximum?: number;
    imagesPerRow?: number;
    imageMargin?: number;
    containerWidth?: number;
    backgroundColor?: string;
    emptyText?: any;
    emptyTextStyle?: any;
    loader?: any;
}
export declare const getAlbums: () => Promise<any[]>;
declare const ImagePicker: ({ callback, initialNumToRender, groupTypes, assetType, currentAlbum, selected, maximum, imagesPerRow, imageMargin, containerWidth, backgroundColor, emptyText, emptyTextStyle, loader, }: Props) => JSX.Element;
export default ImagePicker;
