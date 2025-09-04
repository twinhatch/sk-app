import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

const CustomUserDropdown = ({ data, selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemSelect = (item) => {
    setSelected(item);
    toggleDropdown();
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleDropdown}>
        <Text>{selected ? selected.value : 'Select an item'}</Text>
      </TouchableOpacity>
      {isOpen && (
        <FlatList
          data={data}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemSelect(item)}>
              <Text>{item.value}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

export default CustomUserDropdown;
