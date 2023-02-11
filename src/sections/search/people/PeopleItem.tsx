//mui
import { Avatar, Stack, styled } from '@mui/material';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { FilterByEnum, ItemTypeEnum } from 'src/@types/sections/serverTypes';
import { ISearchUserResponse } from 'src/@types/user';
import { PATH_APP } from 'src/routes/paths';
import ProfileButtonChecker from 'src/sections/profile/components/ProfileButtonChecker';
import { useAddLastSeenMutation } from 'src/_requests/graphql/search/mutations/addLastSeen.generated';
import { ClickableText } from '../SharedStyled';
export const PeopleItemStyle = styled(Stack)(({ theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: theme.spacing(2),
  border: '1px solid',
  borderColor: theme.palette.grey[100],
  width: 152,
}));

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  cursor: 'pointer',
}));

const PeopleItem: FC<{ people: ISearchUserResponse; index: number; varient?: 'ngo' | 'normal' }> = ({
  people,
  index,
  varient,
}) => {
  const [addLastSeenRequest] = useAddLastSeenMutation();

  const { push } = useRouter();

  const handleRouting = () => {
    addLastSeenRequest({
      filter: {
        dto: {
          itemId: people.id,
          itemType:
            varient === 'normal' ? ItemTypeEnum.People : varient === 'ngo' ? ItemTypeEnum.Ngos : ItemTypeEnum.People,
        },
      },
    });
    push(
      varient === 'normal'
        ? `${PATH_APP.profile.user.view.root}/${people.id}`
        : varient === 'ngo'
        ? `${PATH_APP.profile.ngo.viewNgo}/${people.id}`
        : `${PATH_APP.profile.user.view.root}/${people.id}`
    );
  };

  return (
    <>
      <PeopleItemStyle p={2} sx={{ height: 177 }}>
        <Stack sx={{ width: '100%', height: '100%' }} spacing={2} justifyContent="space-between" alignItems="center">
          <AvatarStyle
            onClick={() => {
              handleRouting();
            }}
            variant={varient === 'ngo' ? 'rounded' : 'circular'}
            src={people.avatarUrl || ''}
          />

          <Stack sx={{ width: '100%', height: 33 }} alignItems="center">
            <ClickableText
              onClick={() => handleRouting()}
              sx={{ width: '100%', textAlign: 'center' }}
              variant="subtitle2"
              color="text.primary"
              noWrap
            >
              {people.fullName}
            </ClickableText>

            <ClickableText
              onClick={() => handleRouting()}
              sx={{ width: '100%', textAlign: 'center' }}
              variant="caption"
              color="text.secondary"
              noWrap
            >
              {people.headline}
            </ClickableText>
          </Stack>

          <ProfileButtonChecker
            fullName={people.fullName || ''}
            itemId={people.id}
            itemType={FilterByEnum.Normal}
            meToOther={people.meToOtherStatus as any}
            otherToMe={people.otherToMeStatus as any}
          />
        </Stack>
      </PeopleItemStyle>
    </>
  );
};

export default PeopleItem;
