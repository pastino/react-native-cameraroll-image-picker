import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Dimensions, FlatList, View } from "react-native";
import ImageItem from "./ImageItem";
import CameraRoll from "@react-native-community/cameraroll";
export const getAlbums = async () => {
    const albumsData = await CameraRoll.getAlbums({
        assetType: "Photos",
    });
    const newAlbums = [];
    for (let i = 0; i < albumsData.length; i++) {
        const newObj = {};
        const d = albumsData[i];
        newObj.label = d.title;
        newObj.value = d.title;
        newObj.count = d.count;
        newAlbums.push(newObj);
    }
    return [{ label: "All", value: "All" }, ...newAlbums];
};
const { width } = Dimensions.get("screen");
const ImagePicker = ({ callback, initialNumToRender = 20, groupTypes = "All", assetType = "Photos", currentAlbum, selected, 
// selectSingleItem,
maximum = 15, imagesPerRow = 3, imageMargin = 1, containerWidth = width, backgroundColor = "white", emptyText, emptyTextStyle, loader, }) => {
    const PHOTO_LENGTH = initialNumToRender;
    const MAX_SELECT_PHOTO_LENGTH = maximum;
    const IMAGE_SIZE = containerWidth / imagesPerRow - (imageMargin - imageMargin / imagesPerRow);
    const [photos, setPhotos] = useState([]);
    const [galleryInfo, setGalleryInfo] = useState({
        end_cursor: "",
        has_next_page: false,
        start_cursor: "",
    });
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const options = {
        first: PHOTO_LENGTH,
        assetType,
        groupName: currentAlbum,
        groupTypes,
    };
    const handlePhoto = {
        get: async function () {
            const newPhotoData = await CameraRoll.getPhotos(options);
            const newPhotos = this.makePhotoBudle(newPhotoData);
            this.set(newPhotos);
            this.setGalleryInfo(newPhotoData.page_info);
        },
        set: async (photos) => {
            setPhotos(photos);
        },
        setGalleryInfo: async (pageInfo) => {
            setGalleryInfo(pageInfo);
        },
        /**
         * Returns the sum of a and b
         * @param newPhotoData Image bundle obtained by CameraRoll's getPhotos method [Array]
         * @returns Array{name, type, uri}
         */
        makePhotoBudle: (newPhotoData) => {
            let newPhotos = [];
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
    const handleSelect = (item, targetIndex) => {
        if (selectedPhotos.length === MAX_SELECT_PHOTO_LENGTH) {
            console.log("더 이상 이미지를 선택할 수 없습니다.");
            return;
        }
        callback && callback(item, targetIndex);
    };
    useEffect(() => {
        handlePhoto.get();
    }, [currentAlbum]);
    const handleRenderItem = ({ item, index, }) => {
        const selectedIndex = selected?.findIndex((photo) => photo.uri === item.uri) || -1;
        let isChecked = false;
        if (selectedIndex !== -1)
            isChecked = true;
        const isMarginRight = (index + 1) % imagesPerRow !== 0;
        return (_jsx(ImageItem, { item: item, isChecked: isChecked, selectedIndex: selectedIndex, handleSelect: () => handleSelect(item, selectedIndex), styles: {
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                marginRight: isMarginRight ? imageMargin : 0,
                marginBottom: imageMargin,
            } }));
    };
    return (_jsx(View, { style: { backgroundColor }, children: _jsx(FlatList, { style: { width: containerWidth }, data: photos, renderItem: handleRenderItem, keyExtractor: (item) => item.uri, numColumns: imagesPerRow, onEndReachedThreshold: 0.8 }) }));
};
export default ImagePicker;
