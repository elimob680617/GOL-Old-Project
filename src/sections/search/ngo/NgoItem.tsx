//mui
import { Stack, styled, Avatar } from '@mui/material';
//iconSax
import { useRouter } from 'next/router';
import { FC } from 'react';
import { FilterByEnum, ItemTypeEnum } from 'src/@types/sections/serverTypes';
import { ISearchNgoReponse } from 'src/@types/user';
import { PATH_APP } from 'src/routes/paths';
import ProfileButtonChecker from 'src/sections/profile/components/ProfileButtonChecker';
import { useAddLastSeenMutation } from 'src/_requests/graphql/search/mutations/addLastSeen.generated';
import { ClickableText } from '../SharedStyled';

export const NgoItemStyle = styled(Stack)(({ theme }) => ({}));

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: theme.spacing(1),
}));

const NgoItem: FC<{ ngo: ISearchNgoReponse; index: number }> = ({ index, ngo }) => {
  const { push } = useRouter();
  const [addLastSeenRequest] = useAddLastSeenMutation();

  const handleRouting = () => {
    addLastSeenRequest({ filter: { dto: { itemId: ngo.id, itemType: ItemTypeEnum.Ngos } } });
    push(`${PATH_APP.profile.ngo.viewNgo}/${ngo.id}`);
  };

  return (
    <>
      <NgoItemStyle
        sx={{ width: '100%' }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Stack sx={{ width: 'calc(100% - 136px)' }} direction="row" alignItems="center" spacing={2}>
          <AvatarStyle
            onClick={() => {
              handleRouting();
            }}
            variant="square"
            src={ngo.avatarUrl || ''}
          >
            {(!ngo.avatarUrl && ngo.fullName![0]) || ''}
          </AvatarStyle>

          <ClickableText
            sx={{ width: '100%' }}
            textOverflow="ellipsis"
            noWrap
            variant="subtitle1"
            color="surface.onSurface"
            onClick={() => {
              handleRouting();
            }}
          >
            {ngo.fullName}
          </ClickableText>
        </Stack>
        <ProfileButtonChecker
          fullName={ngo.fullName || ''}
          itemId={ngo.id}
          itemType={FilterByEnum.Ngo}
          meToOther={ngo.meToOtherStatus as any}
          otherToMe={ngo.otherToMeStatus as any}
        />
      </NgoItemStyle>
    </>
  );
};

export default NgoItem;
