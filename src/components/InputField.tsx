import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export const InputField = ({ value, onChangeText, placeholder }: { value: string; onChangeText: (text: string) => void; placeholder: string }) => (
    <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
    />
);

const styles = StyleSheet.create({
    input: { borderWidth: 1, padding: 10, borderRadius: 5, borderColor: '#ccc', marginVertical: 10 }
});
