import { Avatar, Box, Button, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import ReactDOMServer from 'react-dom/server';
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import { PRIMARY } from 'src/theme/palette';
import { PATH_APP } from 'src/routes/paths';

type cardData = {
  id?: number;
  useAvatar?: string;
  userName?: string;
  userType?: string;
  action?: string;
  time?: string;
  status?: boolean;
  activity?: boolean | null;
  activityStatus?: boolean | null;
};

interface INotifCard {
  CardData: cardData;
}

const MentionId = styled('span')(({ theme }) => ({}));

function NotifCard(props: INotifCard) {
  const { CardData } = props;
  const [body, setBody] = useState<string>('');

  const MentionElementCreator = (fullname: string, username: string, id: string) => (
    <MentionId id={id} style={{ color: PRIMARY.main }}>
      <Link href={PATH_APP.profile.ngo.root + '/view/' + id}>{fullname}</Link>
    </MentionId>
  );

  const BrElementCreator = () => <br />;

  useEffect(() => {
    if (!CardData) return;
    let body = CardData.action;
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
  }, [CardData]);

  return (
    <Box
      sx={{
        mt: 1,
        p: 1,
        borderRadius: '8px',
        bgcolor: CardData.status ? (theme) => theme.palette.grey[100] : null,
      }}
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      flexWrap={'wrap'}
    >
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Avatar src={CardData.useAvatar} variant={CardData?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'} />
        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle2">{CardData.userName}</Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ maxWidth: 350 }}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </Box>
      </Box>
      <Box>
        {CardData.activityStatus !== null && CardData.activity === false ? (
          <Typography variant="caption" color="text.disabled" sx={{ mr: 1 }}>
            {CardData.activityStatus === true ? (
              <Typography variant="button" color="primary.main">
                Accepted
              </Typography>
            ) : (
              <Typography variant="button" color="text.secondary">
                Rejected
              </Typography>
            )}
          </Typography>
        ) : null}
        <Typography variant="caption" color="text.disabled">
          {CardData.time}
        </Typography>
      </Box>
      {CardData.activity && CardData.activityStatus !== null ? (
        <Grid container spacing={1} xs={12} sx={{ width: '100%', mt: 2, mb: 1 }}>
          <Grid item xs={8}>
            <Button variant="contained" sx={{ width: '100%' }}>
              Accept
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button variant="outlined" color="inherit" sx={{ width: '100%' }}>
              Reject
            </Button>
          </Grid>
        </Grid>
      ) : null}
    </Box>
  );
}

export default NotifCard;
