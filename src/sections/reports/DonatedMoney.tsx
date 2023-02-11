import React, { useEffect, useState } from 'react';
//mui
import { Box, Button, Collapse, InputAdornment, MenuItem, Select, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
//next
import Image from 'next/image';
//hook-form
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
//icon
import { Icon } from 'src/components/Icon';
//component
import { getDate, getYear } from 'date-fns';
import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import DateDialog from 'src/sections/reports/components/DateDialog';
import getMonthName from 'src/utils/getMonthName';
import { useLazyGetDonatedReportQueryQuery } from 'src/_requests/graphql/history/queries/getDonatedReport.generated';
import dayjs from 'dayjs';
import useDebounce from 'src/utils/useDebounce';
import GOLPagination from './components/GOLPagination';

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
interface IDonatedReport {
  id?: number;
  campaignName?: string;
  campaignStatus?: string;
  ngoName?: string;
  donatedMoney?: string;
  payDate?: string;
}
function DonatedMoney() {
  const router = useRouter();
  const { user } = useAuth();
  const [openCollapse, setOpenCollapse] = useState(false);
  const initialData = {
    search: '',
    from: undefined,
    to: undefined,
    status: '',
    sortBy: '',
    column: '',
  };
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
  const [rows, setRows] = useState<IDonatedReport[]>([]);
  const [getDonateReport, { data: donateReportData, isLoading: donateReportLoading }] =
    useLazyGetDonatedReportQueryQuery();
  const donatedReportRows = donateReportData?.getDonatedReportQuery.listDto?.items?.[0];
  const [orderByFields, setOrderByFields] = useState<string[]>([]);
  const [filter, setFilter] = useState<filterDataType>({});
  //....................................................................

  //...............................................................................................................
  //service

  useEffect(() => {
    getDonateReport({
      filter: {
        pageSize: 6,
        pageIndex: 1,
        orderByFields,
        // filterExpression: `NgoId == (\"${donatedReportRows?.ownerUserId}\")`,
        dto: { id: user?.id },
      },
    });
  }, []);

  useEffect(() => {
    if (donateReportData?.getDonatedReportQuery.listDto?.items) {
      let donatedReports: IDonatedReport[] = [];
      donatedReports = (donateReportData?.getDonatedReportQuery.listDto?.items).map((donateReport, index) => {
        const returned: IDonatedReport = {
          id: index,
          campaignName: donateReport?.campaignName || '-',
          donatedMoney: donateReport?.raisedFund,
          campaignStatus: donateReport?.campaignStatus || '-',
          ngoName: donateReport?.ngoName || '-',
          payDate: dayjs(donateReport?.raisedFundDateTime).format('YYYY-MM-DD'),
        };

        return returned;
      });
      setRows(donatedReports);
    }
  }, [donateReportData]);

  const handleFilter = (filter: filterDataType) => {
    let filterExpression = '';
    if (filter.status) {
      filterExpression += `${filterExpression.length ? '&&' : ''} CampaignStatus==\"${filter.status}\"`;
    }
    if (filter.search) {
      filterExpression += `${filterExpression.length ? '&&' : ''} CampaignName.Contains(\"${filter.search}\")`;
    }
    if (filter.from) {
      filterExpression += `${filterExpression.length ? '&&' : ''} startDate >= DateTimeOffset.Parse(\"${dayjs(
        filter.from
      ).format('YYYY-MM-DD')}\").UtcDateTime`;
    }
    if (filter.to) {
      filterExpression += `${filterExpression.length ? '&&' : ''} endDate <= DateTimeOffset.Parse(\"${dayjs(
        filter.to
      ).format('YYYY-MM-DD')}\").UtcDateTime`;
    }
    return filterExpression;
  };

  const apply = (filter?: filterDataType) => {
    const filterObject = filter || filterData;
    setFilter(filterObject);
    getDonateReport({
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
    getDonateReport({
      filter: {
        pageSize: 6,
        pageIndex: newPage,
        orderByFields,
        orderByDescendings: [false],
        filterExpression: handleFilter(filter),
      },
    });
  };
  //...........................................
  const handleClickCollapse = () => {
    setOpenCollapse(!openCollapse);
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
      width: 224,
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
      field: 'ngoName',
      headerName: 'NGO Name',
      width: 224,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => <Typography variant="body2">{cellValues.value}</Typography>,
    },
    {
      field: 'campaignStatus',
      headerName: 'Campaign Status',
      width: 224,
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
      field: 'donatedMoney',
      headerName: 'Donated Money',
      sortable: false,
      width: 224,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => <Typography variant="body2">${cellValues.value.toLocaleString()}</Typography>,
      // valueGetter: (params: GridValueGetterParams) => `${params.row.CampaignName || ''} ${params.row.NGOName || ''}`,
    },
    {
      field: 'payDate',
      headerName: 'Pay Date',
      sortable: false,
      width: 224,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => <Typography variant="body2">{cellValues.value}</Typography>,
    },
  ];

  //.............................................................................
  return (
    <>
      <Stack direction="row" spacing={3} px={4} py={2} sx={{ bgcolor: 'background.paper', borderRadius: 1, mt: 5 }}>
        <Box sx={{ cursor: 'pointer' }} onClick={() => router.back()}>
          <Icon name="left-arrow" color="grey.500" />
        </Box>

        <Typography variant="body1" color="text.primary">
          {user?.userType === UserTypeEnum.Normal ? 'Financial Report of Normal user' : 'My Donation'}
        </Typography>
      </Stack>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" px={2} py={2}>
            <Stack direction="row">
              <Typography variant="subtitle1" color="primary.dark">
                Donated money
              </Typography>

              <ImageArrowDown onClick={handleClickCollapse}>
                {openCollapse ? (
                  <Icon name="upper-arrow" color="grey.500" />
                ) : (
                  <Icon name="down-arrow" color="grey.500" />
                )}
              </ImageArrowDown>
            </Stack>
            <Stack display={!openCollapse ? 'none' : 'flex'}>
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
                          <Typography variant="button" color="gray.900">
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
                    onChange={(e) => setFilterData((prev) => ({ ...prev, column: e.target.value as string }))}
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
            <Box sx={{ width: 'calc(100% + 32px)', bgcolor: 'background.neutral', height: 8, ml: -2 }} />
            {/*...DataGridPro */}
            <Stack>
              <Box style={{ height: 430, width: '100%', position: 'relative' }}>
                <DataGrid rows={rows} columns={columns} disableSelectionOnClick disableColumnMenu hideFooter />
                {/* Pagination */}
                <Stack sx={{ position: 'absolute', p: 1.5, bottom: 0, right: 0 }}>
                  <GOLPagination
                    totalText={`Total: ${donateReportData?.getDonatedReportQuery?.listDto?.count} campaigns, ${donateReportData?.getDonatedReportQuery?.listDto?.items?.[0]?.raisedFund}`}
                    currentPage={page}
                    pageChange={pageChange}
                    count={Math.round(donateReportData?.getDonatedReportQuery?.listDto?.count / 5)}
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
    </>
  );
}

export default DonatedMoney;
