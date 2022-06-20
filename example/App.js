import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import ImagePicker, {getAlbums} from 'react-native-cameraroll-image-picker';
import Header from './src/Header';
import usePhotoLibraryPermission from './src/PhotoLibraryPermission';

const ImagePickerView = () => {
  const [albums, setAlbums] = useState([{label: 'All', value: 'All'}]);
  const [currentAlbum, setCurrentAlbum] = useState('All');
  const [selected, setSelected] = useState([]);

  const {getAvailability} = usePhotoLibraryPermission();

  const handleSelectAlbum = album => {
    setCurrentAlbum(album);
  };

  const handleCompleteSelect = async () => {
    if (!selected?.[0]?.uri) return;
    console.log(selected);
  };

  const getLibraryPermission = async () => {
    await getAvailability();
  };

  const getAlbumHandler = async () => {
    const result = await getAlbums();
    setAlbums(result);
  };

  useEffect(() => {
    getLibraryPermission();
    getAlbumHandler();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Header
          onSelectAlbum={handleSelectAlbum}
          onCompleteSelect={handleCompleteSelect}
          albums={albums}
          currentAlbum={currentAlbum}
        />
        <ScrollView>
          <ImagePicker
            initialNumToRender={50}
            album={currentAlbum}
            maximum={10}
            onChangePhotosEvent={e => setSelected(e?.selected)}
            isMultiSelect={true}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ImagePickerView;
