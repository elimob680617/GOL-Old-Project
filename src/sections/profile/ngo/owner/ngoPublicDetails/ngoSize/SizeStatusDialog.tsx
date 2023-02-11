import {
  Box,
  Dialog,
  Divider,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Icon } from 'src/components/Icon';
import { Loading } from 'src/components/loading';
import { ngoSizeSelector, ngoSizeUpdated } from 'src/redux/slices/profile/ngoPublicDetails-slice';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_APP } from 'src/routes/paths';
import { useGetNumberRangeQuery } from 'src/_requests/graphql/profile/ngoPublicDetails/queries/getNumberRange.generated';

export default function SizeStatusDialog() {
  const { data: sizeNGO, isFetching } = useGetNumberRangeQuery({
    filter: {
      all: true,
    },
  });
  const dispatch = useDispatch();
  const ngoSize = useSelector(ngoSizeSelector);
  const router = useRouter();

  const [index, setIndex] = useState<string | null>(null);

  useEffect(() => {
    if (index !== null) {
      dispatch(
        ngoSizeUpdated({
          ...ngoSize,
          id: sizeNGO?.getNumberRanges?.listDto?.items?.[index]?.id,
          desc: sizeNGO?.getNumberRanges?.listDto?.items?.[index]?.desc || undefined,
          isChange: true,
        })
      );
      router.back();
    }
  }, [index, router]);

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router.back()}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router.back()}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              NGO Size
            </Typography>
          </Box>
          <Link href={PATH_APP.profile.ngo.publicDetails.ngoSize.root} passHref>
            <IconButton>
              <Icon name="Close-1" />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          {isFetching ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Loading />
            </Box>
          ) : (
            <RadioGroup
              onChange={(e) => {
                setIndex(e.target.value);
              }}
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
            >
              {sizeNGO?.getNumberRanges?.listDto?.items?.map((_size, i) => (
                <>
                  <FormControlLabel
                    checked={ngoSize?.id === _size?.id}
                    key={_size?.id}
                    value={i}
                    control={<Radio />}
                    label={_size?.desc || ''}
                  />
                </>
              ))}
            </RadioGroup>
          )}
        </Stack>
      </Stack>
    </Dialog>
  );
}
