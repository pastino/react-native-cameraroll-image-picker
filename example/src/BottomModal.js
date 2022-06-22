import React from 'react';
import {SafeAreaView, Text, TouchableWithoutFeedback, View} from 'react-native';
import Modal from 'react-native-modal';

const BottomModal = ({
  isVisible,

  albumList,
  close,
  onPress,
  currentAlbum,
}) => {
  return (
    <View>
      <Modal
        isVisible={isVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.8}
        onBackdropPress={close}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={300}
        animationInTiming={300}
        animationOutTiming={300}
        hideModalContentWhileAnimating
        onBackButtonPress={close}
        useNativeDriver
        style={[
          {
            width: '100%',
            justifyContent: 'flex-end',
            alignItems: 'center',
            margin: 0,
          },
        ]}>
        <SafeAreaView
          style={[
            {
              width: '100%',
              backgroundColor: 'white',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            },
          ]}>
          <View style={[{padding: 20}]}>
            {albumList.map(({value}, index) => (
              <View key={value} style={{marginBottom: 20}}>
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => onPress(value)}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{marginLeft: 6}}>{value}</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            ))}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default BottomModal;
