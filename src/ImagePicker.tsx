import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  PermissionsAndroid,
  Platform,
  View,
} from "react-native";
import ImageItem from "./ImageItem";
import CameraRoll, {
  GroupType,
  AssetType,
  PhotoIdentifiersPage,
  Album,
} from "@react-native-community/cameraroll";
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
  albums: T.Album[];
  onImagePress?: (item: T.Photo, index: number, isCheck: boolean) => void;
  onMaxSelectedEvent?: () => void;
  getAlbumsData?: (albums: T.Album[]) => void;
  onChangeAlbumEvent?: (album: T.Album) => void;
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

const ImagePicker = ({
  ref,
  initialNumToRender = 50,
  groupTypes = "Album",
  assetType = "Photos",
  initAlbum = { label: "All", value: "All", count: 0 },
  selected,
  maximum = 15,
  imagesPerRow = 3,
  imageMargin = 1,
  containerWidth = width,
  backgroundColor = "white",
  onImagePress,
  onMaxSelectedEvent,
  getAlbumsData,
  onChangeAlbumEvent,
  albums,
  emptyText,
  emptyTextStyle,
  loader,
}: Props) => {
  const PHOTO_LENGTH = initialNumToRender;
  const MAX_SELECT_PHOTO_LENGTH = maximum;
  const IMAGE_SIZE =
    containerWidth / imagesPerRow - (imageMargin - imageMargin / imagesPerRow);

  const [currentAlbum, setCurrentAlbum] = useState(initAlbum);
  const [photos, setPhotos] = useState<T.Photo[]>([]);
  const [galleryInfo, setGalleryInfo] = useState<
    PhotoIdentifiersPage["page_info"]
  >({
    end_cursor: "",
    has_next_page: false,
  });

  const options =
    currentAlbum?.label === "All"
      ? {
          first: PHOTO_LENGTH,
          assetType,
          groupTypes,
        }
      : {
          first: PHOTO_LENGTH,
          assetType,
          groupName: currentAlbum?.label,
          groupTypes,
        };

  const handlePhoto = {
    /**
     * @param isDuplicateBug There is a bug that pagination cannot be done on certain devices. If there is a bug, images are received in bulk.
     */
    get: async function (isDuplicateBug = false): Promise<void> {
      const newPhotoData: PhotoIdentifiersPage = await CameraRoll.getPhotos({
        ...options,
        first: isDuplicateBug ? 5000 : options?.first,
      });
      const newPhotos = this.makePhotoBudle(newPhotoData);
      this.set(newPhotos);
      this.setGalleryInfo(newPhotoData.page_info);
    },
    getMore: async function (): Promise<void> {
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
    },
    /**
     * Check the bug where pagination is not working on a specific device
     */
    bypassDuplicateImageBug: async function (newPhotos: T.Photo[]) {
      if (photos.length === 0) return false;
      const uriArr = photos.map((item) => item.uri);
      const isDuplicate = uriArr.includes(newPhotos[0].uri);
      if (!isDuplicate) return false;
      await this.get(true);
      return true;
    },
    set: (photos: T.Photo[]): void => {
      setPhotos(photos);
    },
    setGalleryInfo: (pageInfo: PhotoIdentifiersPage["page_info"]): void => {
      setGalleryInfo(pageInfo);
    },
    /**
     * Returns Photo Array
     * @param newPhotoData Image bundle obtained by CameraRoll's getPhotos method [Array]
     * @returns Array{name, type, uri}
     */
    makePhotoBudle: (newPhotoData: PhotoIdentifiersPage): T.Photo[] => {
      let newPhotos: T.Photo[] = [];
      for (let i = 0; i < newPhotoData.edges.length; i++) {
        const edge = newPhotoData.edges[i];
        const newImageObj = {
          name: `image${i}.jpg`,
          type: "image/jpeg",
          uri: edge.node.image.uri,
        };
        newPhotos.push(newImageObj);
      }
      return newPhotos;
    },
  };

  const handleAlbum = {
    get: async function () {
      const albumsData = await CameraRoll.getAlbums({
        assetType: "Photos",
      });
      const newAlbums = await this.makeAlbumBudle(albumsData);
      getAlbumsData && getAlbumsData([...albums, ...newAlbums]);
    },
    setCurrentAlbum: (album: T.Album) => {
      setCurrentAlbum(album);
    },
    makeAlbumBudle: (albumsData: Album[]): T.Album[] => {
      const newAlbums: T.Album[] = [];
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
    photo: T.Photo;
    order: number;
    isChecked: boolean;
  }) => {
    if (selected?.length === MAX_SELECT_PHOTO_LENGTH) {
      onMaxSelectedEvent && onMaxSelectedEvent();
      return;
    }
    onImagePress && onImagePress(photo, order, isChecked);
  };

  const checkReadStoragePermission = async () => {
    const isGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    if (!isGranted)
      console.warn("no atuthentification 'READ_EXTERNAL_STORAGE'");
  };

  const checkWriteStoragePermission = async () => {
    const isGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    if (!isGranted)
      console.warn("no atuthentification 'WRITE_EXTERNAL_STORAGE'");
  };

  const registRef = () => {
    if (ref)
      ref.current = {
        getAlbum: handleAlbum.get(),
        ...ref.current,
      };
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      checkReadStoragePermission();
      checkWriteStoragePermission();
    }
    handleAlbum.get();
    registRef();
  }, []);

  useEffect(() => {
    handlePhoto.get();
    onChangeAlbumEvent && onChangeAlbumEvent(currentAlbum);
  }, [currentAlbum]);

  const handleRenderItem = ({
    item,
    index,
  }: {
    item: T.Photo;
    index: number;
  }) => {
    const selectedIndex = selected?.findIndex(
      (photo: any) => photo.uri === item.uri
    );

    const isChecked = selected
      ?.map((photo: T.Photo) => photo.uri)
      .includes(item.uri);

    const isMarginRight = (index + 1) % imagesPerRow !== 0;

    return (
      <ImageItem
        item={item}
        isChecked={isChecked}
        selectedIndex={selectedIndex}
        handleSelect={() =>
          handleSelect({ photo: item, order: selectedIndex, isChecked })
        }
        styles={{
          width: IMAGE_SIZE,
          height: IMAGE_SIZE,
          marginRight: isMarginRight ? imageMargin : 0,
          marginBottom: imageMargin,
        }}
      />
    );
  };

  return (
    <View style={{ backgroundColor }}>
      <FlatList
        style={{ width: containerWidth }}
        data={photos}
        renderItem={handleRenderItem}
        keyExtractor={(item) => item.uri}
        numColumns={imagesPerRow}
        onEndReached={() => handlePhoto.getMore()}
        onEndReachedThreshold={0.8}
      />
    </View>
  );
};

export default ImagePicker;
