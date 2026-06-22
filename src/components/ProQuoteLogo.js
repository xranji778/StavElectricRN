import React from 'react';
import { Image, View } from 'react-native';

// Brand mark: the official "הצעות מחיר" logo image.
// `gradient` is accepted for backward compatibility but ignored.
export default function ProQuoteLogo({ size = 44 }) {
  return (
    <View style={{
      width: size, height: size,
      borderRadius: Math.round(size * 0.22),
      overflow: 'hidden',
      backgroundColor: '#0F1729',
    }}>
      <Image
        source={require('../../assets/proquote-logo.png')}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}
