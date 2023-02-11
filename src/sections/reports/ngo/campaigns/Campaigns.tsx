import React, { useEffect, useState } from 'react';
//mui
import { Box, Button, Collapse, InputAdornment, MenuItem, Select, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import { DataGridPro,GridColDef } from '@mui/x-data-grid-pro';
//hook-form
import { useForm } from 'react-hook-form';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
//icon
//component
import dayjs from 'dayjs';
import { Icon } from 'src/components/Icon';
import useDebounce from 'src/utils/useDebounce';
import { useLazyGetCampaignsInfoQuery } from 'src/_requests/graphql/history/queries/getCampaignsInfo.generated';
import DateDialog from '../../components/DateDialog';
import GOLPagination from '../../components/GOLPagination';
import ExportFile from './ExportFile';
// import NoResult from '../components/NoResult';
//...
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
const ClearAllStyle = styled(Button)(({ theme }) => ({
  width: 118,
  height: 40,
  color: theme.palette.grey[900],
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  borderRadius: theme.spacing(1),
}));
const DateStyle = styled(Stack)(({ theme }) => ({
  height: 40,
  width: 164,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2.5),
  cursor: 'pointer',
}));
//....................................................................

//...............................................................................................................
//type
interface filterDataType {
  search?: string;
  from?: Date;
  to?: Date;
  status?: string;
  sortBy?: string;
  column?: string;
}

interface ICampaignReport {
  id?: string;
  campaignId?: string;
  campaignName?: string;
  campaignStatus?: string;
  campaignTarget?: string;
  receivedMoney?: string;
  raisedFund?: string;
  startDate?: string;
  updateDate?: string;
  endDate?: string;
}
function Campaigns(props) {
  const { id } = props;
  const initialData = {
    search: '',
    from: undefined,
    to: undefined,
    status: '',
    sortBy: '',
    column: '',
  };
  const [openCollapse, setOpenCollapse] = useState(false);
  const [filterData, setFilterData] = React.useState<filterDataType>({
    search: '',
    from: undefined,
    to: undefined,
    status: '',
    sortBy: '',
    column: '',
  });

  const [exportFile, setExportFile] = useState('');
  const [isFromDateDialog, setIsFromDateDialog] = useState(false);
  const [isToDateDialog, setIsToDateDialog] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [rows, setRows] = useState<ICampaignReport[]>([]);
  const [getCampaignsInfo, { data: campaignsInfoData, isLoading }] = useLazyGetCampaignsInfoQuery();
  const [orderByFields, setOrderByFields] = useState<string[]>([]);
  const [filter, setFilter] = useState<filterDataType>({});

  //...........................................
  const handleClickCollapse = () => {
    setOpenCollapse(!openCollapse);
  };
  //....................................................................

  //...............................................................................................................
  //service
  useEffect(() => {
    getCampaignsInfo({
      filter: {
        pageSize: 6,
        pageIndex: 1,
        orderByFields,
        filterExpression: `ownerUserId == (\"${id}\")`,
      },
    });
  }, [filterData]);
  useEffect(() => {
    if (campaignsInfoData?.getCampaignsInfo.listDto?.items) {
      let campaignsReports: ICampaignReport[] = [];
      campaignsReports = (campaignsInfoData?.getCampaignsInfo.listDto?.items).map((campaignReport) => {
        const returned: ICampaignReport = {
          id: campaignReport?.campaignId || undefined,
          campaignId: campaignReport?.ownerUserId || undefined,
          campaignName: campaignReport?.campaignName || '-',
          campaignStatus: campaignReport?.campaignStatus || '-',
          campaignTarget: campaignReport?.target,
          raisedFund: campaignReport?.raisedFund,
          startDate: dayjs(campaignReport?.startDate).format('YYYY-MM-DD'),
          endDate: dayjs(campaignReport?.endDate).format('YYYY-MM-DD'),
          updateDate: dayjs(campaignReport?.updateDate).format('YYYY-MM-DD'),
          receivedMoney: campaignReport?.raisedFund,
        };

        return returned;
      });
      setRows(campaignsReports);
    }
  }, [campaignsInfoData]);

  const handleFilter = (filter: filterDataType) => {
    let filterExpression = `ownerUserId == (\"${id}\")`;
    let orderByFields = [''];
    if (filter.sortBy) {
      orderByFields = [`${orderByFields}`];
    }
    if (filter.status) {
      filterExpression += ` && CampaignStatus==\"${filter.status}\"`;
    }
    if (filter.search) {
      filterExpression += ` && CampaignName.Contains(\"${filter.search}\")`;
    }
    if (filter.from) {
      filterExpression += ` && startDate >= DateTimeOffset.Parse(\"${dayjs(filter.from).format(
        'YYYY-MM-DD'
      )}\").UtcDateTime`;
    }
    if (filter.to) {
      filterExpression += ` && endDate <= DateTimeOffset.Parse(\"${dayjs(filter.to).format(
        'YYYY-MM-DD'
      )}\").UtcDateTime`;
    }
    return filterExpression;
  };

  const apply = (filter?: filterDataType) => {
    const filterObject = filter || filterData;
    setFilter(filterObject);
    getCampaignsInfo({
      filter: {
        pageSize: 6,
        pageIndex: 1,
        orderByFields,
        orderByDescendings: [false],
        filterExpression: handleFilter(filterObject),
      },
    });
  };

  const clearAll = () => {
    setFilterData(initialData);
    apply(initialData);
    setOrderByFields([]);
  };

  const pageChange = (newPage: number) => {
    setPage(newPage);
    getCampaignsInfo({
      filter: {
        pageSize: 6,
        pageIndex: newPage,
        orderByFields,
        orderByDescendings: [false],
        filterExpression: handleFilter(filter),
      },
    });
  };
  //...........................................................hook-form
  const onSubmit = () => {};
  const methods = useForm({});

  const {
    handleSubmit,
    formState: {},
  } = methods;
  //............../
  //............................................................DataGrid

  const columns: GridColDef[] = [
    {
      field: 'campaignName',
      headerName: 'Campaign Name',
      width: 141,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => (
        <Typography
          variant="body2"
          sx={{
            display: '-webkit-box',
            '-webkit-line-clamp': '2',
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'pre-wrap',
            textAlign: 'center',
          }}
        >
          {cellValues.value}
        </Typography>
      ),
    },

    {
      field: 'campaignStatus',
      headerName: 'Status',
      width: 141,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => (
        <Stack
          alignItems={'center'}
          justifyContent={'center'}
          sx={{
            py: 0.5,
            ...(cellValues.value === 'SUCCESSFUL'
              ? { bgcolor: '#28BF64', color: '#fff' }
              : cellValues.value === 'FINISHED'
              ? { bgcolor: '#2092E4', color: '#fff' }
              : cellValues.value === 'INTERRUPTED'
              ? { bgcolor: '#D27722', color: '#fff' }
              : { bgcolor: '#13968E', color: '#fff' }),
            width: 102,
            borderRadius: 1,
          }}
        >
          <Typography variant="caption">{cellValues.value}</Typography>
        </Stack>
      ),
    },
    {
      field: 'campaignTarget',
      headerName: 'Campaign Target',
      type: 'number',
      width: 141,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => <Typography variant="body2">${cellValues.value.toLocaleString()}</Typography>,
    },
    {
      field: 'receivedMoney',
      headerName: 'Received Money',
      sortable: false,
      width: 141,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => <Typography variant="body2">${cellValues.value.toLocaleString()}</Typography>,
      // valueGetter: (params: GridValueGetterParams) => `${params.row.CampaignName || ''} ${params.row.NGOName || ''}`,
    },
    {
      field: 'raisedFund',
      headerName: 'Raised Fund',
      sortable: false,
      width: 141,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => <Typography variant="body2">${cellValues.value.toLocaleString()}</Typography>,
      // valueGetter: (params: GridValueGetterParams) => `${params.row.CampaignName || ''} ${params.row.NGOName || ''}`,
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      sortable: false,
      width: 141,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => <Typography variant="body2">{cellValues.value}</Typography>,
    },
    {
      field: 'updateDate',
      headerName: 'Update Date',
      sortable: false,
      width: 140,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => <Typography variant="body2">{cellValues.value}</Typography>,
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      sortable: false,
      width: 140,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => <Typography variant="body2">{cellValues.value}</Typography>,
    },
  ];

  //.............................................................................
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" px={2} py={2}>
          <Stack direction="row">
            <Typography variant="subtitle1" color="primary.dark">
              Campaigns Data
            </Typography>
            <ImageArrowDown onClick={handleClickCollapse}>
              {openCollapse ? <Icon name="upper-arrow" /> : <Icon name="down-arrow" />}
            </ImageArrowDown>
          </Stack>
          <ExportFile openCollapse={openCollapse} exportFile={exportFile} setExportFile={setExportFile} />
        </Stack>
        {/*............................................................................*/}
        <Collapse in={openCollapse} timeout="auto" unmountOnExit>
          {/*------------------------->>>Filter*/}
          {/*...search */}
          <Stack mt={3} mb={2} direction="row" alignItems="center" gap={2} px={2}>
            <Stack direction="row" spacing={2} sx={{ width: 164 }}>
              <RHFTextField
                onChange={(e) => setFilterData((prev) => ({ ...prev, search: e.target.value as string }))}
                value={filterData.search}
                size="small"
                name="search"
                type="text"
                placeholder="Name or Title"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon name="Research" color="grey.500" type="solid" />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            {/*...from */}
            <DateStyle
              direction="row"
              spacing={2}
              onClick={() => {
                setIsFromDateDialog(true);
              }}
            >
              {!filterData.from ? (
                <Typography variant="body2" color="text.secondary">
                  From:
                </Typography>
              ) : (
                <Typography variant="body2" color="text.primary">
                  {filterData.from ? dayjs(filterData.from).format('YYYY-MM-DD') : ''}
                </Typography>
              )}

              <Icon name="calendar" type="linear" color="grey.500" />
            </DateStyle>
            {/*...to */}

            <DateStyle
              direction="row"
              spacing={2}
              onClick={() => {
                setIsToDateDialog(true);
              }}
            >
              {!filterData.to ? (
                <Typography variant="body2" color="text.secondary">
                  To:
                </Typography>
              ) : (
                <Typography variant="body2" color="text.primary">
                  {filterData.to ? dayjs(filterData.to).format('YYYY-MM-DD') : ''}
                </Typography>
              )}

              <Icon name="calendar" type="linear" color="grey.500" />
            </DateStyle>
            {/*...status */}
            <Stack>
              <Box>
                <Select
                  sx={{ width: 107 }}
                  size="small"
                  value={filterData.status}
                  displayEmpty
                  onChange={(e) => setFilterData((prev) => ({ ...prev, status: e.target.value as string }))}
                  renderValue={
                    !filterData.status
                      ? () => (
                          <Typography variant="button" color="text.secondary">
                            Status
                          </Typography>
                        )
                      : undefined
                  }
                >
                  <MenuItem value={'Active'}>Active</MenuItem>
                  <MenuItem value={'Interrupted'}>Interrupted</MenuItem>
                  <MenuItem value={'Finished'}>Finished</MenuItem>
                  <MenuItem value={'Successful'}>Successful</MenuItem>
                </Select>
              </Box>
            </Stack>
            {/*...start by */}
            <Stack>
              <Box>
                <Select
                  sx={{ width: 107 }}
                  size="small"
                  value={orderByFields[0]}
                  displayEmpty
                  onChange={(e) => setOrderByFields([e.target.value as string])}
                  renderValue={
                    !orderByFields[0]
                      ? () => (
                          <Typography variant="button" color="text.secondary">
                            Sort By
                          </Typography>
                        )
                      : undefined
                  }
                >
                  <MenuItem value={'campaignName'}>Campaign Name</MenuItem>
                  <MenuItem value={'campaignStatus'}>Status</MenuItem>
                  <MenuItem value={'target'}>campaign Target</MenuItem>
                  <MenuItem value={'raisedFund'}>raised Fund</MenuItem>
                  <MenuItem value={'updateDate'}>update Date</MenuItem>
                </Select>
              </Box>
            </Stack>
            {/*...column  */}
            <Stack>
              <Box>
                <Select
                  sx={{ width: 107 }}
                  size="small"
                  value={filterData.column}
                  displayEmpty
                  // onChange={(e) => setFilterData((prev) => ({ ...prev, column: e.target.value as string }))}
                  renderValue={
                    !filterData.column
                      ? () => (
                          <Typography variant="button" color="text.secondary">
                            Column
                          </Typography>
                        )
                      : undefined
                  }
                >
                  <MenuItem value={'1'}>Received Money</MenuItem>
                  <MenuItem value={'2'}>Raised Fund</MenuItem>
                  <MenuItem value={'3'}>Donors</MenuItem>
                </Select>
              </Box>
            </Stack>
            {/*...clearAll  */}
            <ClearAllStyle onClick={clearAll}>
              <Stack mr={1}>
                <Icon name="Close" color="grey.500" />
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="center" p={0}>
                <Typography color="text.secondary" variant="button">
                  Clear All
                </Typography>
              </Stack>
            </ClearAllStyle>
            {/*...Apply*/}
            <Button variant="contained" onClick={() => apply()}>
              Apply
            </Button>
          </Stack>
          <Box sx={{ width: 'calc(100% + 32px)', bgcolor: 'background.neutral', height: 16, ml: -2 }} />
          {/*...DataGridPro */}
          <Stack>
            <Box style={{ height: 430, width: '100%', position: 'relative' }}>
              <DataGrid rows={rows} columns={columns} disableSelectionOnClick disableColumnMenu hideFooter />
              {/* Pagination */}
              <Stack sx={{ position: 'absolute', p: 1.5, bottom: 0, right: 0 }}>
                <GOLPagination
                  totalText={`Total: ${campaignsInfoData?.getCampaignsInfo?.listDto?.count} campaigns, Raised Fund: ${campaignsInfoData?.getCampaignsInfo?.listDto?.items?.[0]?.raisedFund}`}
                  currentPage={page}
                  pageChange={pageChange}
                  count={Math.round(campaignsInfoData?.getCampaignsInfo?.listDto?.count / 5)}
                />
              </Stack>
            </Box>
            {/* <NoResult /> */}
          </Stack>
        </Collapse>
      </Stack>
      <DateDialog
        value={filterData?.from || null}
        open={isFromDateDialog}
        onClose={(date) => {
          setIsFromDateDialog(false);
          if (date instanceof Date) {
            setFilterData((prev) => ({ ...prev, from: date }));
          }
        }}
        isFromDate={true}
      />
      <DateDialog
        minDate={filterData?.from || null}
        value={filterData?.to || null}
        open={isToDateDialog}
        onClose={(date) => {
          setIsToDateDialog(false);
          if (date instanceof Date) {
            setFilterData((prev) => ({ ...prev, to: date }));
          }
        }}
        isFromDate={false}
      />
    </FormProvider>
  );
}

export default Campaigns;
