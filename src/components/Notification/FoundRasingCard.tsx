import { Avatar, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import ReactDOMServer from 'react-dom/server';
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import { PRIMARY } from 'src/theme/palette';
import { PATH_APP } from 'src/routes/paths';

type itemCard = {
  id: number;
  useAvatar: string;
  userName: string;
  userType: string;
  action: string;
  time: string;
  status: boolean;
};

interface IFoundRasingCard {
  item: itemCard;
}

const MentionId = styled('span')(({ theme }) => ({}));

function FoundRasingCard(props: IFoundRasingCard) {
  const { item } = props;
  const [body, setBody] = useState<string>('');

  const MentionElementCreator = (fullname: string, username: string, id: string) => (
    <MentionId id={id} style={{ color: PRIMARY.main }}>
      <Link href={PATH_APP.profile.ngo.root + '/view/' + id}>{fullname}</Link>
    </MentionId>
  );

  const BrElementCreator = () => <br />;

  useEffect(() => {
    if (!item) return;
    let body = item.action;
    const mentions = body?.match(/╣(.*?)╠/g) || [];

    body = body?.replace(/\\n/g, ReactDOMServer.renderToStaticMarkup(BrElementCreator()));

    mentions.forEach((mention) => {
      const mentionedValue = mention.replace('╣', '').replace('╠', '');
      body = body?.replace(
        mention,
        ReactDOMServer.renderToStaticMarkup(MentionElementCreator(mentionedValue, mentionedValue, mentionedValue))
      );
    });

    body ? setBody(body) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  return (
    <Box
      sx={{
        mt: 1,
        p: 1,
        borderRadius: '8px',
        bgcolor: item.status ? (theme) => theme.palette.grey[100] : null,
      }}
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      flexWrap={'wrap'}
    >
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Avatar src={item.useAvatar} variant={item?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'} />
        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle2">{item.userName}</Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ maxWidth: 350 }}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </Box>
      </Box>
      <Typography variant="caption" color="text.disabled">
        {item.time}
      </Typography>
    </Box>
  );
}

export default FoundRasingCard;
