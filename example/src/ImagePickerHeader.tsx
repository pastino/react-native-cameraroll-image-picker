import React, {useState} from 'react';
import {Dimensions, Text, TouchableWithoutFeedback} from 'react-native';
// import BottomSelectModal from '@/commons/Modals/BottomSelectModal';
import {View} from 'react-native';
import {StyleSheet} from 'react-native';

const {width} = Dimensions.get('screen');

interface Props {
  onSelectAlbum: (album: string) => void;
  onCompleteSelect: () => void;
  albums: {label: string; value: string}[];
  currentAlbum: string;
}

const ImagePickerHeader = ({
  onSelectAlbum,
  onCompleteSelect,
  albums,
  currentAlbum,
}: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  const handlePressAlbumOption = () => {
    setIsVisible(!isVisible);
  };
  const handleSelectAlbum = (album: string) => {
    onSelectAlbum(album);
    handlePressAlbumOption();
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={handlePressAlbumOption}>
          <View style={styles.album}>
            <Text style={{fontSize: 16, marginLeft: 10}}>{currentAlbum}</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={onCompleteSelect}>
          <Text style={{fontWeight: '700', fontSize: 15, color: 'green'}}>
            Complete
          </Text>
        </TouchableWithoutFeedback>
      </View>
      {/* <BottomSelectModal
        isVisible={isVisible}
        onPress={handleSelectAlbum}
        selectableList={albums.map(item => item.value)}
        value={currentAlbum}
        close={handlePressAlbumOption}
      /> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width,
    paddingHorizontal: 20,
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    zIndex: 1,
  },
  album: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ImagePickerHeader;
