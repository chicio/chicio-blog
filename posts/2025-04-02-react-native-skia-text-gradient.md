---
title: "Creating Stunning Gradients in React Native with Skia"
description: "Learn how to create stunning text with React Native using Skia. In this post, we’ll 
explore how to leverage Skia’s powerful features to bring vibrant gradients to life."
date: 2025-04-02
image: /images/posts/skia-gradients-featured.jpg
tags: [ react native, swift, ios, apple, android, java, mobile application development, javascript, typescript, expo ]
authors: [ fabrizio_duroni, antonino_gitto ]
---

*Learn how to create stunning text with React Native using Skia. In this post, we’ll explore how to leverage Skia’s 
powerful features to bring vibrant gradients to life.*

---

As I mentioned in my [latest post](/blog/post/2025/03/17/locale-ios-app-device), we’ve been working on some exciting new
features and projects for our mobile apps. One of these required creating stunning gradient text with custom,
eye-catching shapes.

In the past, I’ve already shared how much I
love [react-native-skia](/blog/post/2024/03/02/react-native-skia-svg-background-shape-text) and how it empowers
developers to create impressive 2D graphics. Recently, we integrated the library into our mobile apps and migrated some
custom shapes to use this framework, such as the one mentioned in the article above.

That previous implementation was a simple shape using our primary color. This
time, [Antonino Gitto](https://www.linkedin.com/in/antonino-gitto/) and I had to push the boundaries further: we were
asked to create custom text and shapes featuring gradient colors.

Our goal was to achieve the effects shown in the image below.

![The text with gradients and custom shapes we created with react-native-skia](/images/posts/skia-gradients.jpg)

Naturally, we chose to use [react-native-skia](/blog/post/2024/03/02/react-native-skia-svg-background-shape-text) again
because:

* It gives us the flexibility to create complex custom shapes while also allowing us to reuse SVG primitives designed by
  our team.
* It provides extensive support for gradients with plenty of customization options.

## Implementation

....talk about GradientText component

```typescript jsx
import React, {useMemo} from 'react';
import {
    Canvas,
    FontWeight,
    LinearGradient,
    Mask,
    Paragraph,
    Rect,
    Skia,
    TextAlign,
    useFonts,
    vec,
} from '@shopify/react-native-skia';
import {Dimensions, ViewStyle} from 'react-native';

const fontFamilyName = 'Ubuntu';
const paragraphPadding = 5;

export enum GradientFontWeight {
    Regular = 400,
    Bold = 700,
}

export enum GradientTextAlignment {
    Left = 0,
    Right = 1,
    Center = 2,
}

const skiaFontWeight: Record<GradientFontWeight, FontWeight> = {
    [GradientFontWeight.Regular]: FontWeight.Normal,
    [GradientFontWeight.Bold]: FontWeight.Bold
}

const skiaTextAlign: Record<GradientTextAlignment, TextAlign> = {
    [GradientTextAlignment.Center]: TextAlign.Center,
    [GradientTextAlignment.Left]: TextAlign.Left,
    [GradientTextAlignment.Right]: TextAlign.Right,
}

interface Gradient {
    colors: string[];
    startPercentages: [number, number]
    endPercentages: [number, number]
}

interface FontStyle {
    size: number;
    weight: GradientFontWeight;
    alignment: GradientTextAlignment;
    lineHeight: number
}

interface GradientTextProps {
    text: string;
    fontStyle: FontStyle;
    gradient: Gradient
    containerStyle?: ViewStyle;
}

export const GradientText: React.FC<GradientTextProps> = ({
                                                              text,
                                                              fontStyle,
                                                              gradient,
                                                              containerStyle,
                                                          }) => {
    const customFontMgr = useFonts({
        [fontFamilyName]: [
            require(`../assets/fonts/Ubuntu-Bold.ttf`),
            require(`../assets/fonts/Ubuntu-Regular.ttf`),
        ],
    });

    const paragraph = useMemo(() => {
        if (!customFontMgr) {
            return null;
        }

        return Skia
            .ParagraphBuilder
            .Make({textAlign: skiaTextAlign[fontStyle.alignment]}, customFontMgr)
            .pushStyle({
                fontSize: fontStyle.size,
                fontStyle: {
                    weight: skiaFontWeight[fontStyle.weight]
                },
                color: Skia.Color('black'),
                heightMultiplier: fontStyle.lineHeight
            })
            .addText(text)
            .build();
    }, [customFontMgr]);

    if (!paragraph) {
        return null
    }

    paragraph.layout(Dimensions.get('window').width);

    const paragraphHeight = paragraph.getHeight() + paragraphPadding;
    const paragraphWidth = paragraph.getLongestLine() + paragraphPadding;

    const canvasStyle: ViewStyle = {
        width: paragraphWidth,
        height: paragraphHeight,
        ...containerStyle,
    };

    return (
        <Canvas style={canvasStyle}>
            <Mask
                mode={'alpha'}
                mask={<Paragraph paragraph={paragraph} x={0} y={0} width={paragraphWidth}/>}>
                <Rect x={0} y={0} width={paragraphWidth} height={paragraphHeight}>
                    <LinearGradient
                        start={vec(
                            gradient.startPercentages[0] * paragraphWidth,
                            gradient.startPercentages[1] * paragraphHeight,
                        )}
                        end={vec(
                            gradient.endPercentages[0] * paragraphWidth,
                            gradient.endPercentages[1] * paragraphHeight,
                        )}
                        colors={gradient.colors}
                    />
                </Rect>
            </Mask>
        </Canvas>
    );
};
```

....talk about PromotionTextWithPath

```typescript jsx
import React from 'react';
import {Canvas, LinearGradient, Mask, Path, Rect, vec,} from '@shopify/react-native-skia';
import {LayoutChangeEvent, StyleSheet, Text, View, ViewStyle,} from 'react-native';

const underlineSvg =
    'M1.83778 3C1.07806 3 0.407248 2.69942 0.253688 2.26222C0.0839635 1.77037 0.649712 1.29218 1.53066 1.19199C2.43586 1.09179 23.9909 -1.2354 46.5642 0.895963C47.4452 0.977939 48.0433 1.44702 47.8897 1.94343C47.7442 2.43983 46.9118 2.77229 46.0308 2.69032C24.0475 0.622712 2.36312 2.95901 2.1449 2.98178C2.03984 2.99545 1.93477 3 1.8297 3H1.83778Z';
const underlineBaseWidth = 48;
const underlineBaseHeight = 3;
const underlineMultiplierFactor = 1.1;
const padding = 5;

interface UnderlineConfig {
    scalingFactor: number;
    width: number;
    height: number;
}

interface LastMinuteDealsPromotionBadgeProps {
    style?: ViewStyle;
}

export const PromotionTextWithPath: React.FC<
    LastMinuteDealsPromotionBadgeProps
> = ({style}) => {
    const [underlineConfig, setUnderlineConfig] = React.useState<UnderlineConfig | null>(null);

    const onDealsTextLayout = (event: LayoutChangeEvent) => {
        const {width} = event.nativeEvent.layout;
        const scalingFactor =
            (width / underlineBaseWidth) * underlineMultiplierFactor;
        const underlineWidth = width * underlineMultiplierFactor;
        const underlineHeight = underlineBaseHeight * scalingFactor;

        setUnderlineConfig({
            scalingFactor,
            width: underlineWidth,
            height: underlineHeight,
        });
    };

    return (
        <View style={{...styles.container, ...style}}>
            <Text style={styles.deals} onLayout={onDealsTextLayout}>
                DEALS
            </Text>
            {
                underlineConfig && <Canvas style={{
                    width: underlineConfig.width,
                    height: underlineConfig.height + padding,
                    position: 'absolute',
                    bottom: -padding,
                    left: -5,
                }}>
                    <Mask
                        mode={'alpha'}
                        mask={
                            <Path
                                path={underlineSvg}
                                color={'#EAEAEB'}
                                transform={[{scale: underlineConfig.scalingFactor}]}
                            />
                        }>
                        <Rect
                            x={0}
                            y={0}
                            width={underlineConfig.width}
                            height={underlineConfig.height}>
                            <LinearGradient
                                start={vec(0, underlineBaseHeight / 2)}
                                end={vec(underlineConfig.width, underlineBaseHeight / 2)}
                                colors={[
                                    '#F2007C', '#F7AF17'
                                ]}
                            />
                        </Rect>
                    </Mask>
                </Canvas>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 2,
        overflow: "visible"
    },
    deals: {
        fontSize: 48,
        fontFamily: 'PermanentMarker-Regular'
    },
});
```

## Conclusion

The codebase with the implementation above can be found in
this [github repo](https://github.com/chicio/React-Native-Skia-Gradients). 
