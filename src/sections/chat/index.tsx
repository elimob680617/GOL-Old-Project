import { Grid, styled, Container, Box } from '@mui/material';
import ConnectionsList from 'src/sections/chat/contacts/ConnectionsList';
import ChatBox from 'src/sections/chat/messages/ChatBox';
import NoChatBox from 'src/sections/chat/messages/NoChatBox';
import { useRouter } from 'next/router';

const RootStyle = styled('div')(() => ({
  height: '100%',
  marginTop: '16px',
}));

const Index = () => {
  const {
    query: { id },
  } = useRouter();
  return (
    <Box sx={{ bgcolor: 'background.neutral', height: '100vh' }}>
      <Container
        maxWidth="lg"
        sx={(theme) => ({
          [theme.breakpoints.up('sm')]: {
            px: 0,
          },
        })}
      >
        <RootStyle>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <ConnectionsList />
            </Grid>
            <Grid item xs={7}>
              {id ? <ChatBox /> : <NoChatBox />}
            </Grid>
          </Grid>
        </RootStyle>
      </Container>
    </Box>
  );
};

export default Index;
