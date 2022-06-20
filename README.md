# `react-native-cameraroll-image-picker`


Image Picker with cameraroll


https://user-images.githubusercontent.com/47880048/174566194-e25ac508-bc4e-4543-aa4e-275d2c8d229b.mp4



## Getting started

`$ npm install @react-native-community/cameraroll --save`
`$ npm install react-native-cameraroll-image-picker --save && npx pod-install`

### Permissions

**iOS**

The user's permission is required in order to access the Camera Roll on devices running iOS 10 or later. Add the `NSPhotoLibraryUsageDescription` key in your `Info.plist` with a string that describes how your app will use this data. This key will appear as `Privacy - Photo Library Usage Description` in Xcode.

If you are targeting devices running iOS 11 or later, you will also need to add the `NSPhotoLibraryAddUsageDescription` key in your `Info.plist`. Use this key to define a string that describes how your app will use this data. By adding this key to your `Info.plist`, you will be able to request write-only access permission from the user. If you try to save to the camera roll without this permission, your app will exit.

**Android**

Permission is required to read and write to the external storage.

On Expo, follow the guide [here](https://docs.expo.io/versions/latest/sdk/permissions/) for requesting the permission.

On react-native-cli or ejected apps, adding the following lines will add the capability for the app to request the permission. Find more info on Android Permissions [here](https://reactnative.dev/docs/permissionsandroid).

```xml
<manifest>
...
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
...
<application>
```

### Components

- [`ImagePicker`](#ImagePicker)

### Methods

- [`getAlbums`](#getAlbums)

---

# Reference

## Components

### `ImagePicker`

component accepts the following props...

**Parameters:**

| Name   | Type   | Required | Description                                      |
| ------ | ------ | -------- | ------------------------------------------------ |
| params | object | No       | Expects a params with the shape described below. |

- `ref` : {any} : you can use getAlbum method.
- `initialNumToRender` : {number} : Number of photos to load first. [default 50]
- `groupTypes` : {string} : Specifies which group types to filter the results to. Valid values are:
  - `Album`
  - `All` // default
  - `Event`
  - `Faces`
  - `Library`
  - `PhotoStream`
  - `SavedPhotos`
- `assetType` : {string} : Specifies filter on asset type. Valid values are:
  - `All`
  - `Videos`
  - `Photos` // default
- `maximum` : {number} : Maximum number of selectable images. [default 15]
- `imagesPerRow` : {number} : number of spaces. [default 3]
- `imageMargin` : {number} : gap between images. [default 1]
- `containerWidth` : {number} : screen width. [default Dimension screen width]
- `backgroundColor` : {string} : backgroundColor [default white]
- `emptyText` : {string} : Text to be displayed when the image is empty. [default null]
- `emptyTextStyle` : {object} : Text style to show if image is empty. [default null]
- `loader` : {element} : Loading Component [default null]
- `album` : {string} : current album [default All]
- `albums` : {array} : album list [default []]
- `isMultiSelect` : {boolean} : Whether to allow multiple selections or not. [default false]
- `onChangePhotosEvent` : {(e: {
  selected: {
  name: string;
  type: string;
  uri: string;
  }[];
  item: {
  name: string;
  type: string;
  uri: string;
  };
  index: number;
  isChecked: boolean;
  }) => void} : event when the selected image changes.
- `onMaxSelectedEvent` : {() => void} : Event when image selection is no longer possible.
- `getAlbumsData` : {(albums:
  {
  label: string;
  value: string;
  count: number;
  }[]) => void} : Import album list.
- `onChangeAlbumEvent` : {(album: string) => void} : Event when the selected album is changed.

```javascript
import ImagePicker from "react-native-cameraroll-image-picker";

return (
  <ImagePicker
    initialNumToRender={50}
    album={"All"}
    maximum={5}
    onChangePhotosEvent={(e) => setSelected(e?.selected)}
    isMultiSelect={true}
  />
);
```

## Methods

### `getAlbums()`

```javascript
import ImagePicker, { getAlbums } from "react-native-cameraroll-image-picker";

await getAlbums();
```

Returns a Promise with a list of albums

**Returns:**

Array of `Album` object

- label: {string};
- value: {string};
- count: {number};

---

#### Example

```javascript
import React, { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import ImagePicker, { getAlbums } from "react-native-cameraroll-image-picker";
import styled from "styled-components/native";
import ImagePickerHeader from "@/styles/ui/Header/ImagePickerHeader";

const ImagePickerView = ({ navigation: { goBack }, route }) => {
  const [albums, setAlbums] = useState([{ label: "All", value: "All" }]);
  const [currentAlbum, setCurrentAlbum] = useState("All");
  const [selected, setSelected] = useState < any > [];

  const handleSelectAlbum = (album) => {
    setCurrentAlbum(album);
  };

  const handleCompleteSelect = async () => {
    if (!selected?.[0]?.uri) return;
    console.log(selected);
  };

  useEffect(() => {
    (async function handleGetAlbums() {
      const result = await getAlbums();
      setAlbums(result);
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container>
        <ImagePickerHeader
          onSelectAlbum={handleSelectAlbum}
          onCompleteSelect={handleCompleteSelect}
          albums={albums}
          currentAlbum={currentAlbum}
          goBack={goBack}
        />
        <View style={{ flex: 1 }}>
          <ImagePicker
            initialNumToRender={50}
            album={currentAlbum}
            maximum={1}
            onChangePhotosEvent={(e) => setSelected(e?.selected)}
          />
        </View>
      </Container>
    </SafeAreaView>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: white;
`;

export default ImagePickerView;
```

---
