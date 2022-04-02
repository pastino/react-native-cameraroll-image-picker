/// <reference types="react" />
import { GroupType, AssetType } from "@react-native-community/cameraroll";
import * as T from "./types";
interface Props {
    ref?: any;
    initialNumToRender?: number;
    groupTypes?: GroupType;
    assetType?: AssetType;
    initAlbum?: T.Album;
    selected: T.Photo[];
    maximum?: number;
    imagesPerRow?: number;
    imageMargin?: number;
    containerWidth?: number;
    backgroundColor?: string;
    emptyText?: any;
    emptyTextStyle?: any;
    loader?: any;
    albums?: T.Album[];
    onImagePress?: (item: T.Photo, index: number, isCheck: boolean) => void;
    onMaxSelectedEvent?: () => void;
    getAlbumsData?: (albums: T.Album[]) => void;
    onChangeAlbumEvent?: (album: T.Album) => void;
}
export declare const getAlbums: () => Promise<any[]>;
export declare const ImagePicker: ({ ref, initialNumToRender, groupTypes, assetType, initAlbum, selected, maximum, imagesPerRow, imageMargin, containerWidth, backgroundColor, onImagePress, onMaxSelectedEvent, getAlbumsData, onChangeAlbumEvent, albums, emptyText, emptyTextStyle, loader, }: Props) => JSX.Element;
export {};
