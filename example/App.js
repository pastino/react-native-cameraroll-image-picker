import React from 'react';
import {Text, View} from 'react-native';
import ImagePicker, {getAlbums} from 'react-native-cameraroll-image-picker';

const App = () => {
  useEffect(() => {
    (async function handleGetAlbums() {
      const result = await getAlbums();
      setAlbums(result);
    })();
  }, []);

  return (
    <View>
      <Text>13123</Text>
    </View>
  );
};

export default App;
