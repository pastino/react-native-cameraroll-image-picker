/// <reference types="react" />
import { GroupType, AssetType } from "@react-native-community/cameraroll";
import * as T from "./types";
interface Props {
    ref?: any;
    initialNumToRender?: number;
    groupTypes?: GroupType;
    assetType?: AssetType;
    initAlbum?: T.Album;
    maximum?: number;
    imagesPerRow?: number;
    imageMargin?: number;
    containerWidth?: number;
    backgroundColor?: string;
    emptyText?: any;
    emptyTextStyle?: any;
    loader?: any;
    album?: string;
    albums?: T.Album[];
    onChangePhotosEvent?: (e: {
        selected: T.Photo[];
        item: T.Photo;
        index: number;
        isChecked: boolean;
    }) => void;
    onMaxSelectedEvent?: () => void;
    getAlbumsData?: (albums: T.Album[]) => void;
    onChangeAlbumEvent?: (album: string) => void;
}
export declare const getAlbums: () => Promise<any[]>;
export declare const ImagePicker: ({ ref, initialNumToRender, groupTypes, assetType, maximum, imagesPerRow, imageMargin, containerWidth, backgroundColor, onChangePhotosEvent, onMaxSelectedEvent, getAlbumsData, onChangeAlbumEvent, album, albums, emptyText, emptyTextStyle, loader, }: Props) => JSX.Element;
export {};
