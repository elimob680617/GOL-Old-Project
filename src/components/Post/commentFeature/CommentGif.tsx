import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Tab,
} from '@mui/material';
import { FC, useState } from 'react';
import gifIcon from '/public/icons/comment/24/input/GIF.svg';
import Image from 'next/image';
import { useLazyGetGifQuery } from 'src/_requests/graphql/post/create-post/queries/getGifQuery.generated';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import GifGridComment from 'src/components/Gif/GifGridComment';
import { CloseIcon } from 'src/theme/overrides/CustomIcons';

interface ICommentGifProps {
  gifSelected: (url: string) => void;
}
const CommentGif: FC<ICommentGifProps> = (props) => {
  const { gifSelected } = props;
  const [showGifs, setShowGifs] = useState<boolean>(false);
  const [value, setValue] = useState<string>('Trending');
  const [getGifs, { isLoading: getGifLoading, data: getGif }] = useLazyGetGifQuery();
  const [searchValue, setSearchValue] = useState('');

  const handleGifOpen = () => {
    setShowGifs(true);
    getGifs({
      filter: { dto: { searchTerm: searchValue || value }, pageIndex: 2, pageSize: 20 },
    })
      .unwrap()
      .then((res) => {})
      .catch((err) => {});
  };
  const handleChange = (event: any, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Stack sx={{ position: 'relative' }}>
      <IconButton onClick={handleGifOpen}>
        <Image src={gifIcon} alt="gif" width={29} height={29} />
      </IconButton>
      {/* {showGifs && (
        <ClickAwayListener onClickAway={() => setShowGifs(false)}>
          <Stack
            alignItems="center"
            sx={{
              position: 'absolute',
              top: 53,
              right: -20,
              padding: 2,
              paddingTop: 0,
              width: 250,
              height: 300,
              borderRadius: 1,
              bgcolor: 'background.default',
              zIndex: 2,
              overflow: 'auto',
            }}
            spacing={3}
          >
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                position: 'sticky',
                top: 0,
                zIndex: 2,
                bgcolor: 'background.default',
                paddingTop: 2,
              }}
            >
              <TextField
                value={searchedText}
                onChange={(e) => setSearchedText(e.target.value)}
                id="search-gif"
                placeholder="Search GIF"
                variant="outlined"
              />
            </Stack>

            {gettingGifLoading && <CircularProgress />}

            {!gettingGifLoading && (
              <Stack spacing={0.25}>
                {gifs?.getGifsQuery?.listDto?.items?.length !== 0 ? (
                  gifs?.getGifsQuery?.listDto?.items?.map((gif) => (
                    <GifWrapper
                      onClick={() => {
                        gifSelected(gif?.gifUrl || '');
                      }}
                      key={gif?.id}
                    >
                      <img src={gif?.gifUrl || ''} alt={gif?.title || ''} />
                    </GifWrapper>
                  ))
                ) : (
                  <Box>
                    <Image src={NoGif} alt="" />
                  </Box>
                )}
              </Stack>
            )}
          </Stack>
        </ClickAwayListener>
      )} */}
      <Dialog open={showGifs} maxWidth="sm" fullWidth aria-labelledby="responsive-dialog-title" sx={{ zIndex: 9998 }}>
        <DialogTitle sx={{ padding: 0 }}>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} sx={{ pr: 2 }}>
            <Typography
              variant="subtitle1"
              color="GrayText.primary"
              sx={{ margin: 2.25 }}
              justifyContent={'space-around'}
            >
              Select GIF
            </Typography>
            <IconButton onClick={() => setShowGifs(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ height: 536, marginTop: 1 }}>
          <TabContext value={value}>
            <Typography variant="button">
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Trending" value="Trending" onClick={() => setSearchValue('')} />
                <Tab label="Reaction" value="Reaction" onClick={() => setSearchValue('')} />
                <Tab label="Love" value="Love" onClick={() => setSearchValue('')} />
                <Tab label="Sad" value="Sad" onClick={() => setSearchValue('')} />
                <Tab label="Sport" value="Sport" onClick={() => setSearchValue('')} />
                <Tab label="TV" value="TV" onClick={() => setSearchValue('')} />
              </TabList>
            </Typography>
            <Typography variant="body1">
              {/* <Search
              type={'text'}
              placeholder="Search GIF"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
            /> */}
              <TextField
                variant="outlined"
                placeholder="Search GIF"
                sx={{ width: '100%', height: '2.5rem', marginTop: 3, marginBottom: 3 }}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </Typography>
            <TabPanel value="Trending">
              {getGifLoading && <CircularProgress />}
              <GifGridComment
                gifSelected={gifSelected}
                setShowGifs={setShowGifs}
                gifs={getGif?.getGifsQuery.listDto?.items}
              />
            </TabPanel>
            <TabPanel value="Reaction">
              {getGifLoading && <CircularProgress />}
              <GifGridComment
                gifSelected={gifSelected}
                setShowGifs={setShowGifs}
                gifs={getGif?.getGifsQuery.listDto?.items}
              />
            </TabPanel>
            <TabPanel value="Love">
              {getGifLoading && <CircularProgress />}
              <GifGridComment
                gifSelected={gifSelected}
                setShowGifs={setShowGifs}
                gifs={getGif?.getGifsQuery.listDto?.items}
              />
            </TabPanel>
            <TabPanel value="Sad">
              {getGifLoading && <CircularProgress />}
              <GifGridComment
                gifSelected={gifSelected}
                setShowGifs={setShowGifs}
                gifs={getGif?.getGifsQuery.listDto?.items}
              />
            </TabPanel>
            <TabPanel value="Sport">
              {getGifLoading && <CircularProgress />}
              <GifGridComment
                gifSelected={gifSelected}
                setShowGifs={setShowGifs}
                gifs={getGif?.getGifsQuery.listDto?.items}
              />
            </TabPanel>
            <TabPanel value="TV">
              {getGifLoading && <CircularProgress />}
              <GifGridComment
                gifSelected={gifSelected}
                setShowGifs={setShowGifs}
                gifs={getGif?.getGifsQuery.listDto?.items}
              />
            </TabPanel>
          </TabContext>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default CommentGif;
