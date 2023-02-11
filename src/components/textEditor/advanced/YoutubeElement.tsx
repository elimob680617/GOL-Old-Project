import { Box, styled } from '@mui/material';
import { FC } from 'react';

const WrapperStyle = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  paddingBottom: '56.25%',
  position: 'relative',
  height: 0,
  '& iframe': {
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
}));

interface IYoutubeElementProps {
  embedId: string;
  children: any;
}

const YoutubeElement: FC<IYoutubeElementProps> = (props) => {
  const { embedId, children } = props;
  return (
    <WrapperStyle className="video-responsive">
      <iframe
        width="100%"
        src={`https://www.youtube.com/embed/${embedId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
      {children}
    </WrapperStyle>
  );
};

export default YoutubeElement;
