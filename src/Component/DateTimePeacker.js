import {View, Text} from 'react-native';
import React from 'react';
import DatePicker from 'react-native-date-picker';

const DateTimePeacker = props => {
  console.log(props);
  return (
    <View>
      {props.type === 'start' ? (
        <DatePicker
          modal
          open={props.open}
          date={props.datepeack}
          mode={props.mode}
          // mode="datetime"
          androidVariant={'nativeAndroid'}
          confirmText="Done"
          maximumDate={props?.maxdate}
          minimumDate={new Date()}
          onConfirm={date => {
            console.log(date);
            props.timeselect(date);
          }}
          onCancel={() => {
            props.setOpenTime(false);
          }}
        />
      ) : (
        <DatePicker
          modal
          open={props.open}
          date={props.datepeack}
          mode={props.mode}
          androidVariant={'nativeAndroid'}
          confirmText="Done"
          minimumDate={props?.mindate || new Date()}
          maximumDate={props.maxdate}
          onConfirm={date => {
            console.log(date);
            props.timeselect(date);
          }}
          onCancel={() => {
            props.setOpenTime(false);
          }}
        />
      )}
    </View>
  );
};

export default DateTimePeacker;
