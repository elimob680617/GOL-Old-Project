import { Grid, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { useDispatch } from 'react-redux';

function GifGridComment({ gifs, gifSelected, setShowGifs }: any) {
  const dispatch = useDispatch();
  return (
    <Grid container xs={12} justifyContent={'center'} spacing={0.25}>
      {gifs ? (
        gifs.map((gif: any) => (
          <Grid item xs={6} justifyContent={'center'} key={gif.id} sx={{ cursor: 'pointer' }}>
            <Image
              src={gif.gifUrl}
              width={2}
              height={1}
              layout="responsive"
              alt={gif.title}
              onClick={() => {
                gifSelected(gif.gifUrl);
                setShowGifs(false);
              }}
            />
          </Grid>
        ))
      ) : (
        <Grid
          xs={12}
          sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Typography variant="subtitle2" color={'primary.light'}>
            GIFs Not Found
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default GifGridComment;
