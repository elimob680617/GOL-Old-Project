import { Box, IconButton, Stack } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import { SURFACE } from 'src/theme/palette';
import { styled } from '@mui/material/styles';
import rightArrow from 'public/icons/right arrow/24/Outline.svg';
import leftArrow from 'public/icons/left arrow/24/Outline.svg';
import SimpleVideo from 'src/components/video/SimpleVideo';
import { useSwipeable } from 'react-swipeable';

// type PostMediaType = 'video' | 'img';
interface IImageStyleProps {
  limitHeight: boolean;
}
// interface IPostMedia {
//   link: string;
//   type: PostMediaType;
//   thumbnail?: string;
// }
interface ICarousel {
  media: any;
  dots?: boolean;
  arrows?: boolean;
  height?: number;
  width?: number;
}

const CarouselArrow = styled(IconButton)((theme) => ({
  backgroundColor: SURFACE.main,
  height: 32,
  width: 32,
}));

function MediaCarousel({ media, dots, arrows, width, height }: ICarousel) {
  const [carousel, setCarousel] = useState<number>(0);

  const ImgStyle = styled('img')<IImageStyleProps>(({ theme, limitHeight }) => ({
    maxHeight: 400,
    height: height ? height : 400,
    width: width ? width : '80%',
    margin: 'auto',
  }));
  const handlers = useSwipeable({
    onSwipedLeft: () => (carousel === media.length ? setCarousel(media.length) : setCarousel(carousel + 1)),
    onSwipedRight: () => (carousel === 0 ? setCarousel(0) : setCarousel(carousel - 1)),
  });
  return (
    <Box
      {...handlers}
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
      }}
    >
      {arrows && (
        <Box sx={{ position: 'absolute', left: 2, top: '40%' }}>
          <CarouselArrow
            onClick={() => {
              carousel === 0 ? setCarousel(0) : setCarousel(carousel - 1);
            }}
          >
            <Image src={leftArrow} alt="left" />
          </CarouselArrow>
        </Box>
      )}
      {media[carousel]?.type === 'img' ? (
        <ImgStyle
          limitHeight={true}
          key={media[carousel]?.link}
          src={
            media[carousel]?.link.indexOf('http') >= 0 || media[carousel]?.link.indexOf('https') >= 0
              ? media[carousel]?.link
              : `http://${media[carousel]?.link}`
          }
        />
      ) : media[carousel]?.type === 'video' ? (
        <SimpleVideo autoShow controls src={media[carousel]?.link} maxHeight={400} />
      ) : media[carousel]?.url ? (
        <ImgStyle
          limitHeight={true}
          key={media[carousel]?.url}
          src={
            media[carousel]?.url.indexOf('http') >= 0 || media[carousel]?.url.indexOf('https') >= 0
              ? media[carousel]?.url
              : `http://${media[carousel]?.url}`
          }
        />
      ) : null}
      {arrows && (
        <Box sx={{ position: 'absolute', right: 0, top: '40%' }}>
          <CarouselArrow
            onClick={() => {
              carousel === media.length ? setCarousel(media.length - 2) : setCarousel(carousel + 1);
            }}
          >
            <Image src={rightArrow} alt="right" />
          </CarouselArrow>
        </Box>
      )}

      {dots ? (
        <Box sx={{ width: '100%', textAlign: 'center', mt: 1, display: 'flex', justifyContent: 'center' }}>
          {media.map((item, index) => (
            <Stack key={item.id} justifyContent="center" sx={{ m: 1 }}>
              {index === carousel ? (
                <img src="/icons/dotPrimary.svg" width={5} height={5} alt="selected-location" />
              ) : (
                <img src="/icons/dot.svg" width={5} height={5} alt="selected-location" />
              )}
            </Stack>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}

export default MediaCarousel;
