import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Triangle from 'react-native-triangle';
import VectorIcon from './VectorIcon';
import ColorInfo from '../../theme/colorInfo';
import CommonStyles from '../../theme/commonStyles';
import {getResponsiveSize} from '../../utility/appUtility';

const MarkerLocation = props => {
  return (
    <View>
      <View style={[CommonStyles.center, styles.mainContainer]}>
        <Text
          style={[
            CommonStyles.font_segoeui,
            {color: ColorInfo.white, fontSize: getResponsiveSize(16)},
          ]}>
          {props.title ?? 'Save Location'}
        </Text>
      </View>
      <View style={[{alignItems: 'center'}]}>
        <Triangle
          width={10}
          height={6}
          color={ColorInfo.mainColor}
          direction="down"
        />
      </View>
      <View style={[CommonStyles.center]}>
        <VectorIcon.MaterialIcons
          name="location-pin"
          size={getResponsiveSize(42)}
          color={ColorInfo.mainColor}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  selectedItem: {
    backgroundColor: ColorInfo.YELLOW8,
  },
  mainContainer: {
    backgroundColor: ColorInfo.mainColor,
    paddingVertical: getResponsiveSize(6),
    paddingHorizontal: getResponsiveSize(16),
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    borderRadius: getResponsiveSize(14),
    overflow: 'hidden',
  },
});

export default MarkerLocation;
