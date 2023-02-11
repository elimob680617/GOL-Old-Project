import { Button, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import CustomLink from 'src/components/CustomLink';
import { PATH_APP } from 'src/routes/paths';
const CreateCampaingBanner = () => (
  <Stack
    sx={{ p: 2, borderRadius: 1, bgcolor: 'common.white' }}
    alignItems="center"
    justifyContent="center"
    spacing={3}
  >
    <Image src="/images/post/posting.svg" width={230} height={185} alt="create-campagin" />
    <Typography variant="caption" color="text.secondary">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna
      fringilla urna, porttitor
    </Typography>
    <CustomLink path={PATH_APP.post.createPost.campainPost.new}>
      <Button variant="contained">Create Campaign Post</Button>
    </CustomLink>
  </Stack>
);

export default CreateCampaingBanner;
