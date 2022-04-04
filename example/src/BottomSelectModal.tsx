import React from 'react';
import {View, TouchableWithoutFeedback, Text} from 'react-native';
import Modal from 'react-native-modal';

interface Props {
  isVisible: boolean;
  value: string | number;
  onPress: (item: string | number) => void;
  close: () => void;
  selectableList: any;
}

const BottomSelectModal = ({
  isVisible,
  value,
  onPress,
  close,
  selectableList,
}: Props) => {
  return (
    <Modal isVisible={isVisible}>
      <View></View>
    </Modal>
  );
};

export default BottomSelectModal;
