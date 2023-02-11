import { Skeleton } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useLazyGetCampaignsRecentInfoQuery } from 'src/_requests/graphql/history/queries/getCampaignsRecentInfo.generated';
import CampaginItemsWrapper from './CampaginItemsWrapper';
import CampaginReportItem from './CampaginReportItem';

interface IReport {
  campaignName?: string;
  campaignId?: any;
  numberOfRates?: string;
  numberOfComments?: number;
  numberOfLikes?: number;
  numberOfReshared?: number;
  donors?: number;
  numberOfSaved?: number;
  target?: number;
  raisedFund?: number;
  averageRate?: any;
  engagementPercent?: number;
  impression?: number;
  earnedFollower?: number;
  campaignView?: number;
  numberOfFinished?: number;
  numberOfIntrupted?: number;
  numberOfSuccessFul?: number;
  numberOfActive?: number;
  daysLeft?: string;
}

const Reports = () => {
  const [getReports, { data: reportsResponse, isLoading }] = useLazyGetCampaignsRecentInfoQuery();
  const [report, setReport] = useState<IReport>();
  const { push } = useRouter();

  useEffect(() => {
    getReports({ filter: {} });
  }, []);

  useEffect(() => {
    if (reportsResponse?.getCampaignsRecentInfo.listDto?.items) {
      setReport(reportsResponse?.getCampaignsRecentInfo.listDto?.items[0] as IReport);
    }
  }, [reportsResponse]);

  return (
    <CampaginItemsWrapper title="Report" linkCallBack={() => push('/report/ngo')} spacing={2}>
      {!isLoading && (
        <>
          <CampaginReportItem
            title="Raised Fund"
            value={`$${report?.raisedFund || 0}`}
            iconSize={32}
            icon="dollar-coin"
          />
          <CampaginReportItem title="Donors" value={report?.donors || 0} iconSize={32} icon="Poverty-Alleviation" />
          <CampaginReportItem
            title="Impression"
            value={`$${report?.impression || 0}`}
            iconSize={32}
            icon="impression"
          />
          <CampaginReportItem
            title="Engagement Precentage"
            value={`${report?.engagementPercent || 0}%`}
            iconSize={32}
            icon="impression"
          />
        </>
      )}
      {isLoading && (
        <>
          <Skeleton variant="rectangular" width="100%" height={60} />
          <Skeleton variant="rectangular" width="100%" height={60} />
          <Skeleton variant="rectangular" width="100%" height={60} />
          <Skeleton variant="rectangular" width="100%" height={60} />
        </>
      )}
    </CampaginItemsWrapper>
  );
};

export default Reports;
