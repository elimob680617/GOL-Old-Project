import { Skeleton, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CampaignStatusEnum, CampaignStatusEnumType } from 'src/@types/sections/serverTypes';
import Avatar from 'src/components/Avatar';
import { PATH_APP } from 'src/routes/paths';
import { useLazyGetCampaignListQuery } from 'src/_requests/graphql/history/queries/getCampaignList.generated';
import { useLazyGetDonatedReportQueryQuery } from 'src/_requests/graphql/history/queries/getDonatedReport.generated';
import CampaginItemsWrapper from './CampaginItemsWrapper';
import CampaginItem from './CampaingItem';

interface IReport {
  campaignId?: string;
  campaignName: string;
  ownerUserId?: any;
  ngoName?: string;
  campaignStatus?: CampaignStatusEnumType;
  target?: any;
  raisedFund?: any;
  startDate?: any;
  updateDate?: any;
  endDate?: any;
}

const Donations = () => {
  const [getReportsQuery, { data: reportsResponse, isLoading }] = useLazyGetCampaignListQuery();

  useEffect(() => {
    getReportsQuery({
      filter: {
        pageSize: 3,
        pageIndex: 1,
        orderByDescendings: [true],
        orderByFields: ['raisedFund'],
      },
    });
  }, []);

  const [reports, setReports] = useState<IReport[]>([]);
  const { push } = useRouter();

  useEffect(() => {
    if (reportsResponse?.getCampaignsInfo.listDto?.items) {
      const tempReports = reportsResponse!.getCampaignsInfo!.listDto!.items!;
      setReports(tempReports as any);
    }
  }, [reportsResponse]);

  return (
    <CampaginItemsWrapper title="Donation" linkCallBack={() => push('/report/donated-money')}>
      {!isLoading &&
        reports.length > 0 &&
        reports.map((report) => (
          <CampaginItem
            key={report.ownerUserId}
            avatar={
              <Avatar src={''} sx={{ borderRadius: 1, width: 48, height: 48 }}>
                {report.campaignName[0]}
              </Avatar>
            }
            date={
              <Typography variant="caption" color="text.secondary" noWrap>
                {report.startDate}
              </Typography>
            }
            title={
              <Typography variant="subtitle2" color="text.primary" noWrap>
                {report.campaignName}
              </Typography>
            }
            hasBorder
            price={`$${report.target}`}
            rate={4}
            status={report.campaignStatus}
          />
        ))}
      {isLoading && (
        <>
          <Skeleton variant="rectangular" width="100%" height={60} />
          <Skeleton variant="rectangular" width="100%" height={60} />
          <Skeleton variant="rectangular" width="100%" height={60} />
        </>
      )}
    </CampaginItemsWrapper>
  );
};

export default Donations;
