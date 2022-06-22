import React, {useState} from 'react';
import {Text, TouchableWithoutFeedback, View} from 'react-native';
import BottomModal from './BottomModal';

const ImagePickerHeader = ({
  albums,
  onSelectAlbum,
  onCompleteSelect,
  currentAlbum,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handlePressAlbumOption = () => {
    setIsVisible(!isVisible);
  };

  const handleSelectAlbum = album => {
    onSelectAlbum(album);
    handlePressAlbumOption();
  };

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableWithoutFeedback onPress={handlePressAlbumOption}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 16, marginLeft: 10}}>{currentAlbum}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <TouchableWithoutFeedback onPress={onCompleteSelect}>
          <Text style={[{fontWeight: '700', fontSize: 15, color: 'black'}]}>
            Update
          </Text>
        </TouchableWithoutFeedback>
      </View>
      <BottomModal
        isVisible={isVisible}
        albumList={albums}
        onPress={album => handleSelectAlbum(album)}
        close={handlePressAlbumOption}
        currentAlbum={currentAlbum}
      />
    </>
  );
};

export default ImagePickerHeader;
