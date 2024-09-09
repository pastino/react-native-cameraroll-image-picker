import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  PermissionsAndroid,
  Platform,
  Text,
  View,
} from "react-native";
import ImageItem from "./ImageItem";
import CameraRoll, {
  GroupType,
  AssetType,
  PhotoIdentifiersPage,
  Album,
} from "@react-native-community/cameraroll";
import { check, PERMISSIONS, RESULTS } from "react-native-permissions";
import { PhotoState, AlbumState } from "./types";

interface Props {
  ref?: any;
  initialNumToRender?: number;
  groupTypes?: GroupType;
  assetType?: AssetType;
  maximum?: number;
  imagesPerRow?: number;
  imageMargin?: number;
  containerWidth?: number;
  backgroundColor?: string;
  emptyText?: string;
  emptyTextStyle?: string;
  loader?: JSX.Element;
  album?: string;
  albums?: AlbumState[];
  isMultiSelect?: boolean;
  isOnlySelectToday?: boolean;
  photoHeaderComponent?: JSX.Element;
  emptyComponent?: JSX.Element;
  onChangePhotosEvent?: (e: {
    selected: PhotoState[];
    item: PhotoState;
    index: number;
    isChecked: boolean;
  }) => void;
  onMaxSelectedEvent?: () => void;
  getAlbumsData?: (albums: AlbumState[]) => void;
  onChangeAlbumEvent?: (album: string) => void;
}

export const getAlbums = async () => {
  const albumsData = await CameraRoll.getAlbums({
    assetType: "Photos",
  });
  const newAlbums: any = [];
  for (let i = 0; i < albumsData.length; i++) {
    const newObj: any = {};
    const d = albumsData[i];
    newObj.label = d.title;
    newObj.value = d.title;
    newObj.count = d.count;
    newAlbums.push(newObj);
  }
  return [{ label: "All", value: "All" }, ...newAlbums];
};
const { width } = Dimensions.get("screen");

export const ImagePicker = ({
  ref,
  initialNumToRender = 50,
  groupTypes = "All",
  assetType = "Photos",
  maximum = 15,
  imagesPerRow = 3,
  imageMargin = 1,
  containerWidth = width,
  backgroundColor = "white",
  onChangePhotosEvent,
  onMaxSelectedEvent,
  getAlbumsData,
  onChangeAlbumEvent,
  album = "All",
  albums = [],
  isMultiSelect = false,
  isOnlySelectToday = false,
  photoHeaderComponent,
  emptyComponent,
  emptyText,
  emptyTextStyle,
  loader,
}: Props) => {
  const PHOTO_LENGTH = initialNumToRender;
  const MAX_SELECT_PHOTO_LENGTH = maximum;
  const IMAGE_SIZE =
    containerWidth / imagesPerRow - (imageMargin - imageMargin / imagesPerRow);

  const [selected, setSelected] = useState<PhotoState[]>([]);
  const [photos, setPhotos] = useState<PhotoState[]>([]);
  const [galleryInfo, setGalleryInfo] = useState<
    PhotoIdentifiersPage["page_info"]
  >({
    end_cursor: "",
    has_next_page: false,
  });

  const options =
    album === "All"
      ? {
          first: PHOTO_LENGTH,
          assetType,
          groupTypes,
        }
      : {
          first: PHOTO_LENGTH,
          assetType,
          groupName: album,
          groupTypes,
        };

  const registRef = () => {
    if (ref)
      ref.current = {
        getAlbum: albumHandler.get(),
        ...ref.current,
      };
  };

  class Photo {
    constructor() {}
    /**
     * @param isDuplicateBug There is a bug that pagination cannot be done on certain devices. If there is a bug, images are received in bulk.
     */
    get = async (isDuplicateBug = false): Promise<void> => {
      const date = new Date().setHours(0, 0, 0, 0);
      const newPhotoData: PhotoIdentifiersPage = await CameraRoll.getPhotos({
        ...options,
        first: isDuplicateBug ? 5000 : options?.first,
        fromTime: isOnlySelectToday ? date : undefined,
      });
      const newPhotos = this.makePhotoBudle(newPhotoData);
      if (newPhotos.length === 0) {
        console.warn("image length 0");
        return;
      }
      this.set(newPhotos);
      this.setGalleryInfo(newPhotoData.page_info);
    };

    getMore = async (): Promise<void> => {
      if (!galleryInfo.has_next_page || !galleryInfo?.end_cursor) return;
      const newPhotoData = await CameraRoll.getPhotos({
        after: galleryInfo.end_cursor,
        ...options,
      });
      const newPhotos = this.makePhotoBudle(newPhotoData);
      const isDuplicate = await this.bypassDuplicateImageBug(newPhotos);
      if (isDuplicate) return;
      this.set([...photos, ...newPhotos]);
      this.setGalleryInfo(newPhotoData.page_info);
    };

    /**
     * Check the bug where pagination is not working on a specific device
     */
    bypassDuplicateImageBug = async (newPhotos: PhotoState[]) => {
      if (photos.length === 0) return false;
      const uriArr = photos.map((item) => item.uri);
      const isDuplicate = uriArr.includes(newPhotos[0].uri);
      if (!isDuplicate) return false;
      await this.get(true);
      return true;
    };

    set = (photos: PhotoState[]): void => {
      setPhotos(photos);
    };

    setGalleryInfo = (pageInfo: PhotoIdentifiersPage["page_info"]): void => {
      setGalleryInfo(pageInfo);
    };
    /**
     * Returns Photo Array
     * @param newPhotoData Image bundle obtained by CameraRoll's getPhotos method [Array]
     * @returns Array{name, type, uri}
     */
    makePhotoBudle = (newPhotoData: PhotoIdentifiersPage): PhotoState[] => {
      let newPhotos: PhotoState[] = [];
      for (let i = 0; i < newPhotoData.edges.length; i++) {
        const edge = newPhotoData.edges[i];
        const newImageObj = {
          name: `image${i}.jpg`,
          type: "image/jpeg",
          uri: edge.node.image.uri,
          location: edge.node.location,
          timestamp: edge.node.timestamp,
        };
        newPhotos.push(newImageObj);
      }
      return newPhotos;
    };
  }

  const photoHandler = new Photo();

  const albumHandler = {
    get: async function () {
      const albumsData = await CameraRoll.getAlbums({
        assetType: "Photos",
      });
      const newAlbums = await this.makeAlbumBudle(albumsData);
      getAlbumsData && getAlbumsData([...albums, ...newAlbums]);
    },

    makeAlbumBudle: (albumsData: Album[]): AlbumState[] => {
      const newAlbums: AlbumState[] = [];
      for (let i = 0; i < albumsData.length; i++) {
        const newObj = { label: "", value: "", count: 0 };
        const d = albumsData[i];
        newObj.label = d.title;
        newObj.value = d.title;
        newObj.count = d.count;
        newAlbums.push(newObj);
      }
      return newAlbums;
    },
  };

  const handleSelect = ({
    photo,
    order,
    isChecked,
  }: {
    photo: PhotoState;
    order: number;
    isChecked: boolean;
  }) => {
    if (isMultiSelect) {
      const copiedPhotos: PhotoState[] = selected.slice();
      if (order === -1) {
        if (selected.length === MAX_SELECT_PHOTO_LENGTH) {
          onMaxSelectedEvent && onMaxSelectedEvent();
        } else {
          copiedPhotos.push(photo);
        }
      } else {
        copiedPhotos.splice(order, 1);
      }
      setSelected(copiedPhotos);
      onChangePhotosEvent &&
        onChangePhotosEvent({
          selected: copiedPhotos,
          item: photo,
          index: order,
          isChecked: isChecked,
        });
      return;
    }
    setSelected([photo]);
    onChangePhotosEvent &&
      onChangePhotosEvent({
        selected: [photo],
        item: photo,
        index: order,
        isChecked: isChecked,
      });
  };

  const checkAndroidReadStoragePermission = async () => {
    const isGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    if (!isGranted)
      console.warn("no atuthentification 'READ_EXTERNAL_STORAGE'");
  };

  const checkAndroidWriteStoragePermission = async () => {
    const isGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    if (!isGranted)
      console.warn("no atuthentification 'WRITE_EXTERNAL_STORAGE'");
  };

  const checkIOSLibraryPermission = async () => {
    const { GRANTED } = RESULTS;
    const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
    if (result !== GRANTED)
      console.warn("no atuthentification 'PHOTO_LIBRARY'");
  };

  const checkPhotoLibraryPermission = async () => {
    if (Platform.OS === "android") {
      checkAndroidReadStoragePermission();
      checkAndroidWriteStoragePermission();
    } else {
      checkIOSLibraryPermission();
    }
  };

  useEffect(() => {
    checkPhotoLibraryPermission();
    registRef();
  }, []);

  useEffect(() => {
    photoHandler.get();
    onChangeAlbumEvent && onChangeAlbumEvent(album);
  }, [album]);

  const handleRenderItem = ({
    item,
    index,
  }: {
    item: PhotoState;
    index: number;
  }) => {
    const isMarginRight = (index + 1) % imagesPerRow !== 0;
    const selectedIndex = selected.findIndex((photo) => photo.uri === item.uri);
    let isChecked = false;
    if (selectedIndex !== -1) isChecked = true;

    const isToday =
      new Date(item.timestamp * 1000).toDateString() ===
      new Date().toDateString();
    const shouldDim = isOnlySelectToday && !isToday;
    const formattedDate = new Date(item.timestamp * 1000)
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, ".");

    return (
      <View
        style={{
          position: "relative",
          width: IMAGE_SIZE,
          height: IMAGE_SIZE,
          marginRight: isMarginRight ? imageMargin : 0,
          marginBottom: imageMargin,
        }}
      >
        <ImageItem
          item={item}
          isChecked={isChecked}
          selectedIndex={selectedIndex}
          handleSelect={() =>
            handleSelect({ photo: item, order: selectedIndex, isChecked })
          }
          isMultiSelect={isMultiSelect}
          styles={{
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
          }}
        />
        {shouldDim && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "black",
              opacity: 0.5,
            }}
          >
            <View
              style={{
                position: "absolute",
                bottom: 5,
                right: 5,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: 2,
                borderRadius: 3,
              }}
            >
              <Text style={{ color: "white", fontSize: 10 }}>
                {formattedDate}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ backgroundColor }}>
      <FlatList
        style={{
          width: containerWidth,
          backgroundColor: isOnlySelectToday ? "black" : "white",
        }}
        data={photos}
        renderItem={handleRenderItem}
        ListHeaderComponent={isOnlySelectToday ? photoHeaderComponent : null}
        keyExtractor={(item) => item.uri}
        ListEmptyComponent={emptyComponent}
        numColumns={imagesPerRow}
        onEndReached={() => photoHandler.getMore()}
        onEndReachedThreshold={0.8}
      />
    </View>
  );
};
