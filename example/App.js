import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import ImagePicker, {getAlbums} from 'react-native-cameraroll-image-picker';

const App = () => {
  const [currentAlbum, setCurrentAlbum] = useState('All');
  // useEffect(() => {
  //   (async function handleGetAlbums() {
  //     const result = await getAlbums();
  //     setAlbums(result);
  //   })();
  // }, []);

  return (
    <View style={{flex: 1}}>
      <ImagePicker
        initialNumToRender={50}
        album={currentAlbum}
        maximum={5}
        onChangePhotosEvent={e => setSelected(e?.selected)}
      />
    </View>
  );
};

export default App;
