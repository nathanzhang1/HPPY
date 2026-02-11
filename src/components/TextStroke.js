// Source - https://stackoverflow.com/a/61570686
// Posted by lub0v, modified by community. See post 'Timeline' for change history
// Retrieved 2026-02-10, License - CC BY-SA 4.0
// Converted to functional React component

import React, { Children, cloneElement, isValidElement } from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  outline: {
    position: 'absolute'
  },
});

export default function TextStroke({ children, color, stroke }) {
  const createClones = (w, h, shadowColor) => {
    return Children.map(children, child => {
      if (isValidElement(child)) {
        const currentProps = child.props || {};
        const currentStyle = currentProps.style || {};

        const newProps = {
          ...currentProps,
          style: [
            currentStyle,
            {
              textShadowOffset: {
                width: w,
                height: h
              },
              textShadowColor: shadowColor,
              textShadowRadius: 1
            }
          ]
        };
        return cloneElement(child, newProps);
      }
      return child;
    });
  };

  const strokeW = stroke;
  const top = createClones(0, -strokeW * 1.2, color);
  const topLeft = createClones(-strokeW, -strokeW, color);
  const topRight = createClones(strokeW, -strokeW, color);
  const right = createClones(strokeW, 0, color);
  const bottom = createClones(0, strokeW, color);
  const bottomLeft = createClones(-strokeW, strokeW, color);
  const bottomRight = createClones(strokeW, strokeW, color);
  const left = createClones(-strokeW * 1.2, 0, color);

  return (
    <View>
      <View style={styles.outline}>{left}</View>
      <View style={styles.outline}>{right}</View>
      <View style={styles.outline}>{bottom}</View>
      <View style={styles.outline}>{top}</View>
      <View style={styles.outline}>{topLeft}</View>
      <View style={styles.outline}>{topRight}</View>
      <View style={styles.outline}>{bottomLeft}</View>
      {bottomRight}
    </View>
  );
}
