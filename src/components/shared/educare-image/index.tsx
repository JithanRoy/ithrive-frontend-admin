import type { SyntheticEvent } from 'react';
import { Blurhash } from 'react-blurhash';
import { useMemoizedFn } from 'ahooks';

import { Image } from 'antd';

import classNames from 'classnames';
import type { ImageProps } from 'rc-image';

import { getImagePathToLink } from '@library/functions';
import type { TImageEntity } from '@library/types';

type EducareImageProps = Omit<ImageProps, 'src'> & {
    variant?: 'avatar' | 'social-avatar' | 'default' | 'details';
    image: TImageEntity;
    blurHash?: typeof Blurhash.defaultProps;
};

const EducareImage = ({ variant = 'default', image, blurHash, width = 175, height = 175, alt, ...props }: EducareImageProps) => {
    let rounded = 'rounded-sm';
    if (variant === 'avatar' || variant === 'social-avatar') {
        width = 30;
        height = 30;
        rounded = 'rounded-full';
    }
    if (variant === 'details') {
        width = 86;
        height = 86;
        rounded = 'rounded-full';
    }
    if (!!image?.blurHash) {
        props.placeholder = <Blurhash key={image.blurHash} hash={image.blurHash} width={width} height={height} {...blurHash} />;
    }
    const addDefaultSrc = useMemoizedFn((ev: SyntheticEvent<HTMLImageElement, Event>) => {
        if (variant === 'social-avatar') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            ev.target.src = `/assets/missing_avatar.png`;
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            ev.target.src = `${getImagePathToLink('')}`;
        }
    });
    return (
        <Image
            style={{ width, height }}
            {...props}
            alt={alt || 'img'}
            className={classNames(rounded, props.className)}
            src={getImagePathToLink(image?.imagePath)}
            onError={addDefaultSrc}
        />
    );
};
export default EducareImage;
