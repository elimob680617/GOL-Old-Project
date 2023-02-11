import React, { FC, ReactNode, useLayoutEffect, useState } from 'react';
import { FilterByEnum, RequestEnum, StatusEnum } from 'src/@types/sections/serverTypes';
import { IconButton, useTheme, ButtonProps, Icon } from '@mui/material';
import { UserAdd, CloseCircle, TickCircle } from 'iconsax-react';
import { useUpdateConnectionMutation } from 'src/_requests/graphql/connection/mutations/updateConnection.generated';
import { useFollowMutation } from 'src/_requests/graphql/connection/mutations/follow.generated';
import { LoadingButton } from '@mui/lab';
import { useDispatch } from 'src/redux/store';
import { onFollow, onChangeStatus } from 'src/redux/slices/connection/connections';
import WarningDialog from './WarningDialog';
import { StateType } from './PopOverChecker';

const RemoveIcon = (
  <Icon>
    <img alt="" src="/icons/removeUser.svg" />
  </Icon>
);

const ButtonChecker: FC<{
  meToOther?: StatusEnum;
  otherToMe?: StatusEnum;
  itemType: FilterByEnum;
  itemId: string;
  url: string | string[];
  index: number;
  fullName: string;
}> = ({ meToOther, otherToMe, itemId, itemType, url, index, fullName }) => {
  const [changeStatus, { isLoading: updateLoading }] = useUpdateConnectionMutation();
  const [followUser, { isLoading: followLoading }] = useFollowMutation();
  const [modal, setModal] = useState<StateType>({
    warningText: '',
    buttonText: '',
    show: false,
  });
  const dispatch = useDispatch();

  const theme = useTheme();
  const [buttonAtt, setButtonAtt] = useState<{
    variant: ButtonProps['variant'];
    text: string;
    px: number;
    py: number;
    backgroundColor: string;
    borderColor: string;
    startIcon?: ReactNode;
    actionType?: RequestEnum;
  }>({
    variant: 'contained',
    text: 'Follow',
    px: 2.9,
    py: 0.5,
    backgroundColor: '',
    borderColor: '',
    startIcon: <UserAdd />,
  });

  useLayoutEffect(() => {
    switch (meToOther) {
      case StatusEnum.Accepted:
        setButtonAtt({
          variant: 'text',
          text: 'Unfollow',
          px: 4.1,
          py: 0.9,
          backgroundColor: theme.palette.grey[100],
          borderColor: '',
          actionType: RequestEnum.Unfollow,
        });
        break;
      case StatusEnum.Muted:
        setButtonAtt({
          variant: 'text',
          text: 'Unfollow',
          px: 4.1,
          py: 0.9,
          backgroundColor: theme.palette.grey[100],
          borderColor: '',
          actionType: RequestEnum.Unfollow,
        });
        break;
      case StatusEnum.Requested:
        setButtonAtt({
          variant: 'outlined',
          text: 'Requested',
          px: 3.1,
          py: 0.9,
          backgroundColor: '',
          borderColor: theme.palette.grey[300],
          actionType: RequestEnum.Unfollow,
        });
        break;

      default:
        setButtonAtt({
          variant: 'contained',
          text: 'Follow',
          px: 2.9,
          py: 0.5,
          backgroundColor: '',
          borderColor: '',
          startIcon: <UserAdd />,
        });
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meToOther]);

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

  const handleFollow = async () => {
    try {
      const { data }: any = await followUser({
        filter: {
          dto: {
            itemId,
            itemType,
          },
        },
      });
      dispatch(
        onFollow({
          index: index,
          meToOther: data?.follow.listDto.items[0]?.meToOtherStatus,
          otherToMe: data?.follow.listDto.items[0]?.otherToMeStatus,
        })
      );
    } catch (error) {}
  };

  return (
    <>
      {url === 'requests' && otherToMe === StatusEnum.Requested ? (
        <>
          {updateLoading ? (
            <LoadingButton
              loading
              variant="outlined"
              size="small"
              sx={{
                width: 120,
                height: 32,
              }}
            >
              loading...
            </LoadingButton>
          ) : (
            <>
              <IconButton onClick={() => handleChangeStatus(RequestEnum.Reject)}>
                <CloseCircle color={theme.palette.error.main} />
              </IconButton>
              <IconButton onClick={() => handleChangeStatus(RequestEnum.Accept)}>
                <TickCircle color={theme.palette.primary.main} variant="Bold" />
              </IconButton>
            </>
          )}
        </>
      ) : (
        <LoadingButton
          loading={updateLoading || followLoading}
          onClick={() => {
            if (!buttonAtt.actionType) {
              handleFollow();
            } else if (buttonAtt.actionType === RequestEnum.Unfollow) {
              setModal({
                warningText: `Are you sure you want to Unfollow ${fullName}?`,
                actionType: RequestEnum.Unfollow,
                buttonText: 'Unfollow',
                show: true,
                icon: RemoveIcon,
              });
            } else {
              handleChangeStatus(buttonAtt.actionType);
            }
          }}
          variant={buttonAtt.variant}
          size="small"
          startIcon={buttonAtt.startIcon}
          sx={{
            px: buttonAtt.px,
            py: buttonAtt.py,
            backgroundColor: buttonAtt.backgroundColor,
            borderColor: buttonAtt.borderColor,
            width: 120,
            height: 32,
          }}
        >
          {buttonAtt.text}
        </LoadingButton>
      )}
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

export default ButtonChecker;
