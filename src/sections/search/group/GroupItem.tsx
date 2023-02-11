import { Avatar, AvatarGroup, Box, Button, Stack, styled, Typography } from '@mui/material';

const ButtonStyle = styled(Button)(({ theme }) => ({
  px: 2.9,
  py: 0.5,
  width: 80,
  height: 32,
}));

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  width: 24,
  height: 24,
  '&:last-child': {
    marginLeft: `${theme.spacing(-1)}!important`,
  },
}));

interface IImgStyleProps {
  background: string;
}

const ImgStyle = styled(Box)<IImgStyleProps>(({ theme, background }) => ({
  width: '80px',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  background: `url(${background})`,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
}));

function GroupItem() {
  return (
    <Stack sx={{ height: 80 }} direction="row" spacing={2}>
      <ImgStyle
        sx={{ width: 80, border: (theme) => `1px solid ${theme.palette.background.neutral}`, borderRadius: 1 }}
        background="https://i0.wp.com/www.jbox.com.br/wp/wp-content/uploads/2021/12/spy-family-anime-anya-destacada.jpg?fit=774%2C489&quality=99&strip=all&ssl=1"
      />
      <Stack spacing={1} sx={{ flex: 1 }} justifyContent="center">
        <Typography sx={{ fontSize: '16px', lineHeight: '20px' }} color="text.primary" variant="subtitle1">
          Group Name
        </Typography>
        <Typography sx={{ fontSize: '12px', lineHeight: '15px' }} color="text.secondary" variant="subtitle1">
          25 members
        </Typography>
        <AvatarGroup sx={{ flexDirection: 'row' }}>
          <AvatarStyle alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
          <AvatarStyle alt="Travis Howard" src="https://mui.com/static/images/avatar/1.jpg" />
          <AvatarStyle alt="Cindy Baker" src="https://mui.com/static/images/avatar/1.jpg" />
          <AvatarStyle alt="Agnes Walker" src="https://mui.com/static/images/avatar/1.jpg" />
        </AvatarGroup>
      </Stack>
      <ButtonStyle variant="primary">Join</ButtonStyle>
      {/* <ButtonStyle sx={{ bgcolor: 'grey.100' }}>Leave</ButtonStyle> */}
    </Stack>
  );
}

export default GroupItem;
