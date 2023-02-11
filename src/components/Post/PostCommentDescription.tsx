import { Box, Stack, Typography, useTheme } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { PATH_APP } from 'src/routes/paths';

interface IPostDes {
  title?: string;
  description: string;
  PostNo?: boolean;
  id?: string;
}

const PostDesContent = styled(Typography)(({ theme }) => ({}));

const BoxWrapper = styled(Box)(({ theme }) => ({
  '& .anchor': {
    textDecoration: 'none',
  },
}));

const SeeMore = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  color: theme.palette.grey[800],
}));

const PostCommentDescription: FC<IPostDes> = ({ title, description, PostNo, id }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const pRef = useRef<HTMLSpanElement>(null);
  const [showSeeMore, setShowSeeMore] = useState<boolean>(false);
  const [slicedDescription, setSlicedDescription] = useState('');
  const { push } = useRouter();
  const theme = useTheme();
  useEffect(() => {
    const height = 195;
    if (description && description?.length >= height && pRef?.current!.offsetHeight >= 85) {
      setShowSeeMore(true);
      setSlicedDescription(description.slice(0, height));
    }
  }, [description]);

  return (
    <BoxWrapper ref={boxRef}>
      <Box sx={{ paddingright: 0, paddingLeft: 0, position: 'relative', overflow: 'hidden', height: 'auto' }}>
        {title && (
          <Box sx={{ paddingTop: 2 }} onClick={() => push(`${PATH_APP.post.postDetails.index}/${id}`)}>
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
          <PostDesContent
            sx={{
              overflow: 'hidden',
              height: 'auto',
              '& p': { marginBottom: 0 },
            }}
            variant="body1"
            dangerouslySetInnerHTML={{
              __html: showSeeMore ? slicedDescription : description,
            }}
          />
          {showSeeMore && (
            <SeeMore onClick={() => (!PostNo ? setShowSeeMore(false) : push(`/post-details/${id}`))}>
              <Typography variant="body1" color={theme.palette.grey[500]}>
                ...see more
              </Typography>
            </SeeMore>
          )}
        </Stack>

        <PostDesContent
          sx={{ visibility: 'hidden', position: 'absolute', zIndex: 0, top: 0 }}
          ref={pRef}
          variant="body1"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        {/* </ShowMoreText> */}
        {/* )} */}
      </Box>
    </BoxWrapper>
  );
};

export default PostCommentDescription;
