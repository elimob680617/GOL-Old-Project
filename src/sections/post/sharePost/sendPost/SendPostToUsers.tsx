import { Box, Button, Typography } from '@mui/material';

import { LoadingButton } from '@mui/lab';
import { resetSendPost } from 'src/redux/slices/post/sendPost';
import { dispatch } from 'src/redux/store';
import { useCreateMessageByUserNameMutation } from 'src/_requests/graphql/chat/mutations/createMessageByUserName.generated';
//icon
import { Icon } from 'src/components/Icon';

function SendPostToUsers(props) {
  const { userId, text } = props;
  const [createMessageByUserName, { isLoading, isSuccess }] = useCreateMessageByUserNameMutation();
  const sendPostHandler = async () => {
    const { data }: any = await createMessageByUserName({
      message: { dto: { toUserId: userId, text: text, readMessage: false } },
    });
    // Router.push(`/chat/${data?.createMessageByUserName?.listDto?.items[0]?.roomId}`);
    if (data?.createMessageByUserName?.listDto?.items[0]?.roomId) {
      dispatch(resetSendPost());
    }
  };
  return (
    <>
      {!isSuccess ? (
        <LoadingButton variant="contained" sx={{ width: 100 }} onClick={sendPostHandler} loading={isLoading}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <Icon name="Send" color="common.white" type="linear" />
            Send
          </Box>
        </LoadingButton>
      ) : (
        <Button disabled variant="secondary" sx={{ width: 100 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <Icon name="Approve-Tick" color="common.black" type="linear" />
            <Typography sx={{ color: 'primary' }}>Sent</Typography>
          </Box>
        </Button>
      )}
    </>
  );
}

export default SendPostToUsers;
