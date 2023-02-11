import { Icon, Popover, Stack, useTheme, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { Slash } from 'iconsax-react';
import { Dispatch, FC, ReactNode, SetStateAction, useState } from 'react';
import { FilterByEnum, RequestEnum, StatusEnum } from 'src/@types/sections/serverTypes';
import { useUpdateConnectionMutation } from 'src/_requests/graphql/connection/mutations/updateConnection.generated';
import { useDispatch } from 'src/redux/store';
import { onChangeStatus } from 'src/redux/slices/connection/connections';
import WarningDialog from './WarningDialog';
import { useCreateMessageByUserNameMutation } from 'src/_requests/graphql/chat/mutations/createMessageByUserName.generated';
import { LoadingButton } from '@mui/lab';

const MessagesIcon = (
  <Icon>
    <img alt="" src="/icons/Outline.svg" />
  </Icon>
);
const RemoveIcon = (
  <Icon>
    <img alt="" src="/icons/removeUser.svg" />
  </Icon>
);
const MuteIcon = (
  <Icon>
    <img alt="" src="/icons/MuteIcon.svg" />
  </Icon>
);

export type StateType = {
  actionFn?: (actionType: RequestEnum) => Promise<void>;
  onClose?: Dispatch<SetStateAction<StateType>>;
  warningText: string;
  actionType?: RequestEnum;
  buttonText: string;
  show: boolean;
  icon?: ReactNode;
};

const PopOverChecker: FC<{
  index: number;
  meToOther?: StatusEnum;
  itemType?: FilterByEnum;
  itemId: string;
  anchorEl: HTMLButtonElement | null;
  url?: string | string[];
  fullName: string;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}> = ({ anchorEl, setAnchorEl, itemType, itemId, meToOther, url, index, fullName }) => {
  const theme = useTheme();
  const { push } = useRouter();
  const dispatch = useDispatch();
  const [modal, setModal] = useState<StateType>({
    warningText: '',
    buttonText: '',
    show: false,
  });
  const [changeStatus] = useUpdateConnectionMutation();
  const [createMessageByUserName, { isLoading }] = useCreateMessageByUserNameMutation();

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChangeStatus = async (actionType: RequestEnum) => {
    try {
      setModal({
        warningText: '',
        buttonText: '',
        show: false,
      });
      const { data }: any = await changeStatus({
        filter: {
          dto: {
            itemId,
            actionType,
          },
        },
      });
      dispatch(
        onChangeStatus({
          index: index,
          actionType: actionType,
          otherToMe: data?.updateConnection.listDto.items[0]?.otherToMeStatus,
          meToOther: data?.updateConnection.listDto.items[0]?.meToOtherStatus,
        })
      );
    } catch (error) {}
  };

  const chatHandler = async () => {
    const { data }: any = await createMessageByUserName({
      message: { dto: { toUserId: itemId, text: 'hi', readMessage: false } },
    });
    push(`/chat/${data?.createMessageByUserName.listDto.items[0]?.roomId}`);
  };

  return (
    <>
      <Popover
        id="3dotpopup"
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Stack px={1} py={1}>
          {itemType !== FilterByEnum.Hashtag && (
            <LoadingButton
              loading={isLoading}
              onClick={() => {
                chatHandler();
                setAnchorEl(null);
              }}
              variant="text"
              size="large"
              startIcon={MessagesIcon}
              sx={{
                width: '100%',
                color: theme.palette.surface.onSurface,
              }}
            >
              Send Message
            </LoadingButton>
          )}
          {itemType !== FilterByEnum.Hashtag && url === 'followers' && (
            <Button
              onClick={() => {
                setModal({
                  warningText: `Are you sure you want to Remove ${fullName}?`,
                  actionType: RequestEnum.Remove,
                  buttonText: 'Remove',
                  show: true,
                  icon: RemoveIcon,
                });
                setAnchorEl(null);
              }}
              variant="text"
              size="large"
              startIcon={RemoveIcon}
              sx={{
                width: '100%',
                color: theme.palette.error.dark,
                justifyContent: 'stretch',
              }}
            >
              Remove
            </Button>
          )}
          {url === 'followings' && (
            <Button
              onClick={() => {
                if (meToOther === StatusEnum.Muted) {
                  setModal({
                    warningText: `Are you sure you want to Unmute ${fullName}?`,
                    actionType: RequestEnum.UnMute,
                    buttonText: 'Unmute',
                    show: true,
                    icon: MuteIcon,
                  });
                } else {
                  setModal({
                    warningText: `Are you sure you want to Mute ${fullName}?`,
                    actionType: RequestEnum.Mute,
                    buttonText: 'Mute',
                    show: true,
                    icon: MuteIcon,
                  });
                }
                setAnchorEl(null);
              }}
              variant="text"
              size="large"
              startIcon={MuteIcon}
              sx={{
                width: '100%',
                color: theme.palette.error.dark,
                justifyContent: 'stretch',
              }}
            >
              {meToOther === StatusEnum.Muted ? 'Unmute' : 'Mute'}
            </Button>
          )}
          {itemType !== FilterByEnum.Hashtag && url !== 'requested' && (
            <Button
              onClick={() => {
                setModal({
                  warningText: `Are you sure you want to Block ${fullName}?`,
                  actionType: RequestEnum.Block,
                  buttonText: 'Block',
                  show: true,
                  icon: <Slash />,
                });
                setAnchorEl(null);
              }}
              variant="text"
              size="large"
              startIcon={<Slash color={theme.palette.error.dark} />}
              sx={{
                width: '100%',
                color: theme.palette.error.dark,
                justifyContent: 'stretch',
              }}
            >
              Block
            </Button>
          )}
        </Stack>
      </Popover>

      <WarningDialog
        show={modal.show}
        onClose={setModal}
        warningText={modal.warningText}
        actionFn={handleChangeStatus}
        actionType={modal.actionType}
        buttonText={modal.buttonText}
        icon={modal.icon}
      />
    </>
  );
};

export default PopOverChecker;
