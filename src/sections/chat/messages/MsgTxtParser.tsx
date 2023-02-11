import { FC, memo, useState, useEffect } from 'react';
import LinkPreview from './LinkPreview';
import axios from 'axios';
import { Typography } from '@mui/material';
import Linkify from './Linkify';

const getURL = (input: string) => {
  const res = input.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  if (res !== null) {
    return res[0];
  }
  return;
};
const MsgTxtParser: FC<{ text: string; mine: boolean }> = ({ text, mine }) => {
  const [meta, setMeta] = useState({ title: '', caption: '', image: '', success: false });
  const url = getURL(text);
  const accessToken = window.localStorage.getItem('accessToken');
  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(`/api/getmeta?url=${url}&token=${accessToken}`);
      setMeta({
        title: data.ogTitle || data.twitterTitle,
        caption: data.ogDescription || data.twitterDescription || 'Description is not available...',
        image:
          (data.ogImage?.url &&
            (data.ogImage?.url.startsWith('http')
              ? data.ogImage?.url
              : `${data.requestUrl}${data.ogImage?.url.slice(1)}`)) ||
          (data.twitterImage?.url &&
            (data.twitterImage?.url.startsWith('http')
              ? data.twitterImage?.url
              : `${data.requestUrl}${data.twitterImage?.url.slice(1)}`)) ||
          '/icons/link/24/Outline.svg',
        success: data.success,
      });
    };
    getData();
  }, [url]);

  return (
    <>
      {meta.success ? (
        <>
          <LinkPreview
            url={url!}
            imageUrl={meta.image}
            title={`${meta.title?.slice(0, 14)}${meta.title?.length > 14 ? '...' : ''}`}
            caption={`${meta.caption?.slice(0, 36)}${meta.caption?.length > 36 ? '...' : ''}`}
            mine={mine}
          />
          <Typography sx={{ mt: '8px' }} variant="body2">
            {text}
          </Typography>
        </>
      ) : (
        <Linkify text={text} mine={mine} />
      )}
    </>
  );
};

export default memo(MsgTxtParser);
