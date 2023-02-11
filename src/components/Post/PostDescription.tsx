import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { FC, useEffect, useRef, useState } from 'react';
import { PATH_APP } from 'src/routes/paths';

interface IPostDes {
  title?: string;
  description: string;
  PostNo?: boolean;
  id?: string;
  isSent?: boolean;
}
const SentPostTitle = styled(Box)(({ theme }) => ({
  display: '-webkit-box',
  '-webkit-line-clamp': '2',
  '-webkit-box-orient': 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));
const PostDesContent = styled(Typography)(({ theme }) => ({}));

const BoxWrapper = styled(Box)(({ theme }) => ({
  '& .anchor': {
    textDecoration: 'none',
  },
}));

const SeeMore = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  color: theme.palette.grey[500],
}));

const PostDes: FC<IPostDes> = ({ title, description, PostNo, id, isSent = false }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const pRef = useRef<HTMLSpanElement>(null);
  const [showSeeMore, setShowSeeMore] = useState<boolean>(false);
  const [slicedDescription, setSlicedDescription] = useState('');
  const { push } = useRouter();

  useEffect(() => {
    const height = 195;
    if (description.length >= height && pRef?.current!.offsetHeight >= 85) {
      setShowSeeMore(true);
      setSlicedDescription(description.slice(0, height));
    }
  }, [description]);

  return (
    <BoxWrapper ref={boxRef}>
      <Box sx={{ paddingRight: 2, paddingLeft: 2, position: 'relative' }}>
        {title && (
          <Box sx={{ paddingTop: 2, wordBreak: 'break-word' }} onClick={() => push(`/post/post-details/${id}`)}>
            <Typography variant="subtitle1">{title}</Typography>
          </Box>
        )}
        {/* {boxRef.current && (
          <ShowMoreText
            width={boxRef.current.clientWidth - 32}
            lines={3}
            more="see more"
            expanded={false}
            truncatedEndingComponent="..."
            anchorClass="anchor"
            less=""
          > */}

        <Stack sx={{ position: 'relative' }}>
          {isSent ? (
            <SentPostTitle>
              <Typography variant="body2" dangerouslySetInnerHTML={{ __html: description }} />
            </SentPostTitle>
          ) : (
            <>
              <PostDesContent
                sx={{ overflow: 'hidden', height: 'auto', '& p': { marginBottom: 0 } }}
                variant="body1"
                dangerouslySetInnerHTML={{ __html: description }}
              />
              {showSeeMore ||
                (PostNo && (
                  <SeeMore
                    onClick={() => (!PostNo ? setShowSeeMore(false) : push(`${PATH_APP.post.postDetails.index}/${id}`))}
                  >
                    <Typography variant="body1">...see more</Typography>
                  </SeeMore>
                ))}
            </>
          )}
        </Stack>
        <PostDesContent
          sx={{
            visibility: 'hidden',
            position: 'absolute',
            zIndex: 0,
            top: 0,
            maxHeight: 130,
            overflow: 'hidden',
            width: 'calc(100% - 32px)',
          }}
          ref={pRef}
          variant="body1"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </Box>
    </BoxWrapper>
  );
};

export default PostDes;
