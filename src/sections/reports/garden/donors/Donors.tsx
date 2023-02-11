import React, { useEffect, useState } from 'react';
//mui
import {
  Box,
  Collapse,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
//icon
import { Icon } from 'src/components/Icon';
//service
import { useLazyGetCampaignDonorsInfoQuery } from 'src/_requests/graphql/history/queries/getCampaignDonorsInfo.generated';
import { useLazyGetCampaignListQuery } from 'src/_requests/graphql/history/queries/getCampaignList.generated';
//component
import { useLazyGetCampaignDetailsInfoQuery } from 'src/_requests/graphql/history/queries/getCampaignDetailsInfo.generated';
import CampaignDonation from './CampaignDonation';
//...
import dayjs from 'dayjs';
import GOLPagination from '../../components/GOLPagination';
import NoResult from '../components/NoResult';

//.............................................................................
const ImageArrowDown = styled(Box)(({ theme }) => ({
  width: 24,
  height: 24,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  borderRadius: 9,
  marginLeft: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}));

const CardStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  width: 270,
  height: 88,
  borderRadius: theme.spacing(1),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'start',
  gap: theme.spacing(1),
}));
const AvatarStyle = styled(Box)(({ theme }) => ({
  width: 56,
  height: 56,
  borderRadius: theme.spacing(8),
  backgroundColor: theme.palette.background.neutral,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
//....................................................................

//............................................................DataGrid
const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'No.',
    width: 80,
    align: 'center',
    headerAlign: 'center',
    renderCell: (cellValues) => <Typography variant="body2">{cellValues.value}</Typography>,
  },
  {
    field: 'raisedFund',
    headerName: 'Donated Money',
    width: 162,
    align: 'center',
    headerAlign: 'center',
    renderCell: (cellValues) => <Typography variant="body2">${cellValues.value}</Typography>,
  },
  {
    field: 'raisedFundDateTime',
    headerName: 'Date and Time',
    width: 170,
    align: 'center',
    headerAlign: 'center',
    renderCell: (cellValues) => <Typography variant="body2">{cellValues.value}</Typography>,
  },
  {
    field: 'rate',
    headerName: 'Rate',
    type: 'number',
    width: 95,
    align: 'center',
    headerAlign: 'center',
    renderCell: (cellValues) => <Typography variant="body2">{cellValues.value}</Typography>,
  },
];
//................Data Grid Type
interface IDonorsReport {
  id?: number;
  campaignName?: string;
  raisedFund?: number;
  rate?: string;
  avatarImageUrl?: string;
  firstName?: string;
  lastName?: string;
  raisedFundDateTime?: string;
}
//...............................................................................................................

function Campaigns() {
  const [getCampaignList, { data: campaignListData }] = useLazyGetCampaignListQuery();
  const [getCampaignDonorsInfo, { data: campaignDonorsInfoData }] = useLazyGetCampaignDonorsInfoQuery();
  const [getCampaignDetailsInfo, { data: campaignDetailsInfoData }] = useLazyGetCampaignDetailsInfoQuery();
  //...
  const campaignList = campaignListData?.getCampaignsInfo?.listDto?.items;
  const campaignDonorsInfo = campaignDonorsInfoData?.getCampaignDonorsInfo?.listDto?.count;
  const campaignDetailsInfo = campaignDetailsInfoData?.getCampaignDetailsInfo?.listDto?.items?.[0];

  //.............................................state
  const [openCollapse, setOpenCollapse] = useState(false);
  const [answer, setAnswer] = React.useState('');
  const [exportFile, setExportFile] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<IDonorsReport[]>([]);
  const [page, setPage] = useState<number>(0);

  //.............................................useEffect
  useEffect(() => {
    getCampaignList({
      filter: {
        pageIndex: 0,
        pageSize: 10,
        filterExpression: search.length ? `campaignName.Contains(\"${search}\")` : undefined,
      },
    });
  }, [getCampaignList, search]);

  useEffect(() => {
    if (campaignList) {
      setCampaignId(campaignList?.[0]?.campaignId as string);
    }
  }, [campaignList]);
  useEffect(() => {
    if (campaignId) {
      getCampaignDonorsInfo({
        filter: { dto: { campaignId }, pageSize: 5, pageIndex: 0 },
      });
    }
  }, [campaignId, getCampaignDonorsInfo]);
  useEffect(() => {
    if (campaignId) {
      getCampaignDetailsInfo({ filter: { dto: { campaignId } } });
    }
  }, [campaignId, getCampaignDetailsInfo]);
  //.........................
  const handleClickCollapse = () => {
    setOpenCollapse(!openCollapse);
  };
  const searchCampaign = (searchValue) => {
    setSearch(searchValue);
  };
  useEffect(() => {
    if (campaignDonorsInfoData?.getCampaignDonorsInfo.listDto?.items) {
      let campaignDonorsInfo: IDonorsReport[] = [];
      campaignDonorsInfo = (campaignDonorsInfoData?.getCampaignDonorsInfo.listDto?.items).map(
        (campaignDonor, index) => {
          const returned: IDonorsReport = {
            id: index + 1,
            raisedFund: campaignDonor?.raisedFund || undefined,
            raisedFundDateTime: dayjs(campaignDonor?.raisedFundDateTime).format('YYYY-MM-DD'),
            rate: campaignDonor?.rate,
          };
          return returned;
        }
      );

      setRows(campaignDonorsInfo);
    }
  }, [campaignId, campaignDonorsInfoData]);
  //...
  const pageChange = (newPage: number) => {
    setPage(newPage);
    getCampaignDonorsInfo({
      filter: {
        pageSize: 5,
        pageIndex: newPage,
        dto: {
          campaignId: campaignId,
        },
      },
    });
  };
  //.............................................................................
  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center" px={2} py={2}>
        <Stack direction="row">
          <Typography variant="subtitle1" color="primary.dark">
            Donors Data
          </Typography>
          <ImageArrowDown onClick={handleClickCollapse}>
            {openCollapse ? <Icon name="upper-arrow" /> : <Icon name="down-arrow" />}
          </ImageArrowDown>
        </Stack>
        <Stack direction="row" gap={2} display={!openCollapse ? 'none' : 'flex'}>
          <Box>
            <Select
              size="small"
              value={answer}
              displayEmpty
              onChange={(event) => setAnswer(event.target.value)}
              renderValue={
                answer !== ''
                  ? undefined
                  : () => (
                      <Typography variant="button" color="grey.900">
                        Overview
                      </Typography>
                    )
              }
            >
              <MenuItem value={'ThisWeek'}>This Week</MenuItem>
              <MenuItem value={'ThisMonth'}>This Month</MenuItem>
              <MenuItem value={'ThisYear'}>This Year</MenuItem>
              <MenuItem value={'Overview'}>Overview</MenuItem>
            </Select>
          </Box>
          <Box>
            <Select
              sx={{
                '& .MuiSelect-select': {
                  paddingRight: '0px !important',
                },
              }}
              size="small"
              value={exportFile}
              displayEmpty
              onChange={(event) => setExportFile(event.target.value)}
              IconComponent={() => (
                <Stack alignItems="center" justifyContent="center" pr={2}>
                  <Icon name="Report" color="grey.500" />
                </Stack>
              )}
              renderValue={
                exportFile !== ''
                  ? undefined
                  : () => (
                      <Typography variant="button" color="grey.900">
                        Export
                      </Typography>
                    )
              }
            >
              <MenuItem value={'CSV'}>CSV</MenuItem>
              <MenuItem value={'Excel'}>Excel</MenuItem>
              <MenuItem value={'PDF'}>PDF</MenuItem>
            </Select>
          </Box>
        </Stack>
      </Stack>
      {/*............................................................................*/}
      <Collapse in={openCollapse} timeout="auto" unmountOnExit>
        <Box sx={{ width: 'calc(100% + 32px)', bgcolor: 'background.neutral', height: 16, ml: -2 }} />
        {/*************************(Donors Data)***********************************/}
        <Stack pt={2}>
          <Grid container lg={12}>
            <Grid item lg={2.2}>
              <Stack spacing={2} pl={2} sx={{ height: 342 }}>
                <Typography variant="subtitle2" color="text.primary">
                  Campaigns
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="search"
                  type="search"
                  placeholder="Search"
                  onChange={(e) => searchCampaign(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon name="Research" color="grey.500" />
                      </InputAdornment>
                    ),
                  }}
                />
                {/*...RadioGroup */}
                {campaignList?.length ? (
                  <FormControl sx={{ overflow: 'scroll', pl: 1 }}>
                    <RadioGroup
                      name="radio-buttons-group"
                      value={campaignId}
                      onChange={(e) => setCampaignId(e.target.value)}
                    >
                      {campaignList?.map((campaign) => (
                        <FormControlLabel
                          key={campaign?.campaignId}
                          value={campaign?.campaignId}
                          control={<Radio />}
                          label={campaign?.campaignName as string}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                ) : (
                  <Stack alignItems="center" justifyContent="center" width="100%" height="100%">
                    <NoResult />
                  </Stack>
                )}
              </Stack>
            </Grid>
            <Box sx={{ height: 'calc(100% +32px)', bgcolor: 'background.neutral', width: 8, ml: 2 }} />
            {/*...Donors */}
            <Grid item lg={3.8}>
              <CampaignDonation campaignId={campaignId} />
            </Grid>
            <Box sx={{ height: 'calc(100% +32px)', bgcolor: 'background.neutral', width: 8, ml: 2 }} />
            {/*...DataGrid */}
            <Grid item lg={5.45}>
              <Box style={{ height: 370, width: '100%', position: 'relative' }}>
                {campaignDonorsInfo ? (
                  <DataGrid rows={rows} columns={columns} disableSelectionOnClick disableColumnMenu hideFooter />
                ) : (
                  <Stack height="100%" width="100%" alignItems="center" justifyContent="center">
                    <NoResult />
                  </Stack>
                )}
                <Stack sx={{ position: 'absolute', p: 1.5, bottom: 0, right: 0 }}>
                  {campaignDonorsInfo ? (
                    <GOLPagination
                      totalText={`Total: ${campaignDonorsInfoData?.getCampaignDonorsInfo?.listDto?.count} campaigns, Raised Fund: ${campaignDonorsInfoData?.getCampaignDonorsInfo?.listDto?.items?.[0]?.raisedFund}`}
                      currentPage={page}
                      pageChange={pageChange}
                      count={Math.round(campaignDonorsInfoData?.getCampaignDonorsInfo?.listDto?.count / 5)}
                    />
                  ) : (
                    <Typography variant="button" color="primary.main">
                      No Result
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Grid>
          </Grid>
          {/*...Campaign X */}
          <Box sx={{ width: 'calc(100% + 32px)', bgcolor: 'background.neutral', height: 16, ml: -2 }} />
          <Stack p={2}>
            <Typography variant="subtitle2" color="primary.main">
              {campaignDetailsInfo?.campaignName}
            </Typography>
          </Stack>
          <Box sx={{ width: 'calc(100% + 32px)', bgcolor: 'background.neutral', height: 16, ml: -2 }} />
          {/*...cards */}

          <Stack sx={{ bgcolor: 'background.neutral' }} gap={2} direction="row" flexWrap="wrap">
            <CardStyle spacing={1} py={2} px={2}>
              <AvatarStyle>
                <Icon name="Advertise" color="grey.500" />
              </AvatarStyle>
              <Stack>
                <Typography variant="subtitle2" color="text.secondary">
                  Campaign View
                </Typography>
                <Typography variant="subtitle2" color="text.primary">
                  {campaignDetailsInfo?.campaignView}
                </Typography>
              </Stack>
            </CardStyle>
            <CardStyle spacing={1} py={2} px={2}>
              <AvatarStyle>
                <Icon name="impression" color="grey.500" />
              </AvatarStyle>
              <Stack>
                <Typography variant="subtitle2" color="text.secondary">
                  Impression
                </Typography>
                <Typography variant="subtitle2" color="text.primary">
                  {campaignDetailsInfo?.impression}
                </Typography>
              </Stack>
            </CardStyle>
            <CardStyle spacing={1} py={2} px={2}>
              <AvatarStyle>
                <Icon name="engagement-percent" color="grey.500" />
              </AvatarStyle>
              <Stack>
                <Typography variant="subtitle2" color="text.secondary">
                  Engagement percent
                </Typography>
                <Typography variant="subtitle2" color="text.primary">
                  {campaignDetailsInfo?.impression}
                </Typography>
              </Stack>
            </CardStyle>
            <CardStyle spacing={1} py={2} px={2}>
              <AvatarStyle>
                <Icon name="public" color="grey.500" type="solid" />
              </AvatarStyle>
              <Stack>
                <Typography variant="subtitle2" color="text.secondary">
                  Earned Follower
                </Typography>
                <Typography variant="subtitle2" color="text.primary">
                  {campaignDetailsInfo?.earnedFollower}
                </Typography>
              </Stack>
            </CardStyle>
            <CardStyle spacing={1} py={2} px={2}>
              <AvatarStyle>
                <Icon name="heart" color="grey.500" />
              </AvatarStyle>
              <Stack>
                <Typography variant="subtitle2" color="text.secondary">
                  Likes
                </Typography>
                <Typography variant="subtitle2" color="text.primary">
                  {campaignDetailsInfo?.numberOfLikes}
                </Typography>
              </Stack>
            </CardStyle>
            <CardStyle spacing={1} py={2} px={2}>
              <AvatarStyle>
                <Icon name="comment" color="grey.500" />
              </AvatarStyle>
              <Stack>
                <Typography variant="subtitle2" color="text.secondary">
                  Comments
                </Typography>
                <Typography variant="subtitle2" color="text.primary">
                  {campaignDetailsInfo?.numberOfComments}
                </Typography>
              </Stack>
            </CardStyle>
            <CardStyle spacing={1} py={2} px={2}>
              <AvatarStyle>
                <Icon name="Save" color="grey.500" />
              </AvatarStyle>
              <Stack>
                <Typography variant="subtitle2" color="text.secondary">
                  Saved
                </Typography>
                <Typography variant="subtitle2" color="text.primary">
                  {campaignDetailsInfo?.numberOfSaved}
                </Typography>
              </Stack>
            </CardStyle>
            <CardStyle spacing={1} py={2} px={2}>
              <AvatarStyle>
                <Icon name="Reshare" color="grey.500" />
              </AvatarStyle>
              <Stack>
                <Typography variant="subtitle2" color="text.secondary">
                  Reshared
                </Typography>
                <Typography variant="subtitle2" color="text.primary">
                  {campaignDetailsInfo?.numberOfReshared}
                </Typography>
              </Stack>
            </CardStyle>
          </Stack>
          <Box sx={{ width: 'calc(100% + 32px)', bgcolor: 'background.neutral', height: 16, ml: -2 }} />
        </Stack>
      </Collapse>
    </Stack>
  );
}

export default Campaigns;
