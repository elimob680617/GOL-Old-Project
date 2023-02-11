import { Avatar, Box, Button, Stack, styled, Typography } from '@mui/material';

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
  borderRadius: '80px',
  overflow: 'hidden',
  background: `url(${background})`,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
}));

function PageItem() {
  return (
    <Stack sx={{ height: 80 }} direction="row" spacing={2}>
      <ImgStyle background="https://i0.wp.com/www.jbox.com.br/wp/wp-content/uploads/2021/12/spy-family-anime-anya-destacada.jpg?fit=774%2C489&quality=99&strip=all&ssl=1" />
      <Stack spacing={1} sx={{ flex: 1 }} justifyContent="center">
        <Typography sx={{ fontSize: '16px', lineHeight: '20px' }} color="text.primary" variant="subtitle1">
          Page Name
        </Typography>
        <Typography sx={{ fontSize: '12px', lineHeight: '15px' }} color="text.secondary" variant="subtitle1">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of
          the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </Typography>
      </Stack>
      <ButtonStyle variant="primary">Follow</ButtonStyle>
      {/* <ButtonStyle sx={{ bgcolor: 'grey.100',color:'text.primary' }}>Unfollow</ButtonStyle> */}
      {/* <ButtonStyle variant="outlined" sx={{ color:(theme)=> theme.palette.grey[800], border:(theme)=> `1px solid ${theme.palette.grey[300]}` }}>
        Requested
      </ButtonStyle> */}
    </Stack>
  );
}

export default PageItem;
