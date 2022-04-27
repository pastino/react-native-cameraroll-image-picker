import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {StyleSheet, View} from 'react-native';
// libs
import ImagePicker, {getAlbums} from 'react-native-cameraroll-image-picker';
// styles
import ImagePickerHeader from './ImagePickerHeader';

const ImagePickerView = () => {
  const [albums, setAlbums] = useState([{label: 'All', value: 'All'}]);
  const [currentAlbum, setCurrentAlbum] = useState('All');
  const [selected, setSelected] = useState<any>([]);

  const handleSelectAlbum = (album: string) => {
    setCurrentAlbum(album);
  };

  const handleCompleteSelect = () => {
    console.log(selected);
  };

  useEffect(() => {
    (async function handleGetAlbums() {
      const result = await getAlbums();
      console.log('result', result);
      setAlbums(result);
    })();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <ImagePickerHeader
          albums={albums}
          currentAlbum={currentAlbum}
          onSelectAlbum={handleSelectAlbum}
          onCompleteSelect={handleCompleteSelect}
        />
        <View style={{flex: 1}}>
          {/* <ImagePicker
            initialNumToRender={50}
            album={currentAlbum}
            maximum={5}
            onChangePhotosEvent={e => setSelected(e?.selected)}
          /> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default ImagePickerView;
