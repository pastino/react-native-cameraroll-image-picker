import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, View } from "react-native";
import ImageItem from "./ImageItem";
import CameraRoll, {
  GroupType,
  AssetType,
  PhotoIdentifiersPage,
} from "@react-native-community/cameraroll";
import * as T from "./types";

// callback: 이미지 선택 시 콜백 기능. (필수!). 선택한 이미지 배열과 현재 선택된 이미지를 반환합니다.
// initialNumToRender: 첫 번째 렌더 패스에서 렌더링할 행 수를 지정합니다. (기본값: 5)
// groupTypes: 사진을 가져올 그룹으로 '앨범', '전체', '이벤트', '얼굴', '라이브러리', 'PhotoStream' 및 'SavedPhotos' 중 하나입니다. (기본값: 저장된 사진)
// assetType: 자산 유형으로 '사진', '동영상' 또는 '전체' 중 하나입니다. (기본값: 사진)
// selected: 이미 선택된 이미지 배열입니다. (기본: [])
// selectSingleItem: 한 번에 하나의 이미지만 선택하는 부울. (기본값: false)
// maximum: 선택한 이미지의 최대 개수입니다. (기본값: 15)
// imagesPerRow: 행당 이미지 수입니다. (기본값: 3)
// imageMargin: 한 이미지의 여백 크기입니다. (기본값: 5)
// containerWidth: 카메라 롤 피커 컨테이너의 너비입니다. (기본값: 장치 너비)
// selectedMarker: 사용자가 선택한 이미지 마커 구성요소. (기본값: 체크 표시).
// backgroundColor: 배경색을 설정합니다. (기본값: 흰색).
// emptyText: 사진이 없을 때 목록 대신 표시할 텍스트입니다. (기본값: '사진 없음.')
// emptyTextStyle: 에 적용할 스타일 emptyText입니다. (기본값: textAlign: 'center')
// loader: 로더 구성 요소 노드입니다. (기본값: <ActivityIndicator />)

interface Props {
  callback?: (item: T.Photo, index: number) => void;
  initialNumToRender?: number;
  groupTypes?: GroupType;
  assetType?: AssetType;
  currentAlbum?: any;
  selected?: T.Photo[];
  // selectSingleItem?: boolean;
  maximum?: number;
  imagesPerRow?: number;
  imageMargin?: number;
  containerWidth?: number;
  backgroundColor?: string;
  emptyText?: any;
  emptyTextStyle?: any;
  loader?: any;
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
  callback,
  initialNumToRender = 20,
  groupTypes = "All",
  assetType = "Photos",
  currentAlbum,
  selected,
  // selectSingleItem,
  maximum = 15,
  imagesPerRow = 3,
  imageMargin = 1,
  containerWidth = width,
  backgroundColor = "white",
  emptyText,
  emptyTextStyle,
  loader,
}: Props) => {
  const PHOTO_LENGTH = initialNumToRender;
  const MAX_SELECT_PHOTO_LENGTH = maximum;
  const IMAGE_SIZE =
    containerWidth / imagesPerRow - (imageMargin - imageMargin / imagesPerRow);

  const [photos, setPhotos] = useState<T.Photo[]>([]);
  const [galleryInfo, setGalleryInfo] = useState<
    PhotoIdentifiersPage["page_info"]
  >({
    end_cursor: "",
    has_next_page: false,
    start_cursor: "",
  });

  const [selectedPhotos, setSelectedPhotos] = useState<T.Photo[]>([]);

  const options = {
    first: PHOTO_LENGTH,
    assetType,
    groupName: currentAlbum,
    groupTypes,
  };

  const handlePhoto = {
    get: async function () {
      const newPhotoData: PhotoIdentifiersPage = await CameraRoll.getPhotos(
        options
      );
      const newPhotos = this.makePhotoBudle(newPhotoData);
      this.set(newPhotos);
      this.setGalleryInfo(newPhotoData.page_info);
    },
    set: async (photos: T.Photo[]) => {
      setPhotos(photos);
    },
    setGalleryInfo: async (pageInfo: PhotoIdentifiersPage["page_info"]) => {
      setGalleryInfo(pageInfo);
    },
    /**
     * Returns the sum of a and b
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

  const handleSelect = (item: T.Photo, targetIndex: number) => {
    if (selectedPhotos.length === MAX_SELECT_PHOTO_LENGTH) {
      console.log("더 이상 이미지를 선택할 수 없습니다.");
      return;
    }
    callback && callback(item, targetIndex);
  };

  useEffect(() => {
    handlePhoto.get();
  }, [currentAlbum]);

  const handleRenderItem = ({
    item,
    index,
  }: {
    item: T.Photo;
    index: number;
  }) => {
    const selectedIndex =
      selected?.findIndex((photo: any) => photo.uri === item.uri) || -1;
    let isChecked = false;
    if (selectedIndex !== -1) isChecked = true;

    const isMarginRight = (index + 1) % imagesPerRow !== 0;

    return (
      <ImageItem
        item={item}
        isChecked={isChecked}
        selectedIndex={selectedIndex}
        handleSelect={() => handleSelect(item, selectedIndex)}
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
        keyExtractor={(item: T.Photo) => item.uri}
        numColumns={imagesPerRow}
        onEndReachedThreshold={0.8}
      />
    </View>
  );
};

export default ImagePicker;
