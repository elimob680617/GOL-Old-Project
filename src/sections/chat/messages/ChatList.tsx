import { useEffect, useState, FC, Dispatch, SetStateAction } from 'react';
import dynamic from 'next/dynamic';
import { Checkbox, Grid, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import { useSelector } from 'src/redux/store';
import { MessageResponseDto } from 'src/@types/sections/serverTypes';

const MsgTxtParser = dynamic(() => import('./MsgTxtParser'), { ssr: false });

const OtherMsg = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.spacing(2, 2, 2, 0),
  padding: theme.spacing(1.625, 1.375),
  color: theme.palette.surface['onSurface'],
}));
const MyMsg = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.primary['light'],
  borderRadius: theme.spacing(2, 0, 2, 2),
  padding: theme.spacing(1.625, 1.375),
  color: theme.palette.surface['onSurface'],
}));
const MsgDate = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.primary['main'],
  borderRadius: theme.spacing(11),
  padding: theme.spacing(1),
  color: theme.palette.surface['main'],
  whiteSpace: 'pre',
}));
const MsgTime = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  color: theme.palette.grey[500],
}));
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const isValidURL = (input: string) => {
  const res = input.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return res !== null;
};

const ChatList: FC<{
  chat: MessageResponseDto;
  list: MessageResponseDto[];
  index: number;
  selectedMsg: string[];
  setSelectedMsg: Dispatch<SetStateAction<string[]>>;
}> = ({ chat, list, index, setSelectedMsg, selectedMsg }) => {
  const { isSelect } = useSelector((state) => state.selectMsg);
  const [time, setTime] = useState(false);

  useEffect(() => {
    if (
      index &&
      new Date(list[index].createdDateTime).getDate() - new Date(list[index - 1].createdDateTime).getDate()
    ) {
      setTime(true);
    }

    return () => {
      setTime(false);
    };
  }, [index, list]);

  return (
    <>
      {time && (
        <Grid
          container
          spacing={2}
          sx={{
            padding: '24px',
          }}
        >
          <Grid item xs={5} />
          <Grid item xs={2}>
            {
              <MsgDate variant="caption">
                {new Date(chat.createdDateTime).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                })}
              </MsgDate>
            }
          </Grid>
          <Grid item xs={5} />
        </Grid>
      )}
      <Grid
        container
        spacing={2}
        sx={{
          padding: '24px',
        }}
      >
        {isSelect && (
          <Grid item xs={1}>
            {isSelect && (
              <Checkbox
                {...label}
                icon={<RadioButtonUncheckedRoundedIcon />}
                checkedIcon={<CheckCircleRoundedIcon />}
                onChange={(event) => {
                  if (event.target.checked) {
                    setSelectedMsg((last) => [...last, chat.id as string]);
                  } else {
                    setSelectedMsg((last) => {
                      const temp = [...last];
                      const index = temp.findIndex((element) => element === chat.id);
                      temp.splice(index, 1);
                      return [...temp];
                    });
                  }
                }}
              />
            )}
          </Grid>
        )}
        <Grid item xs={isSelect ? 4 : 5}>
          {chat.mine && (
            <>
              {isValidURL(chat.text!) ? (
                <MsgTxtParser text={chat.text!} mine={false} />
              ) : (
                <OtherMsg variant="body2">{chat.text!}</OtherMsg>
              )}

              <MsgTime variant="caption">
                {new Date(chat.createdDateTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </MsgTime>
            </>
          )}
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={5}>
          {!chat.mine && (
            <Stack
              sx={{
                alignItems: 'flex-end',
              }}
            >
              {isValidURL(chat.text!) ? (
                <MsgTxtParser text={chat.text!} mine={true} />
              ) : (
                <MyMsg variant="body2">{chat.text!}</MyMsg>
              )}

              <MsgTime variant="caption">
                {new Date(chat.createdDateTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </MsgTime>
            </Stack>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ChatList;
