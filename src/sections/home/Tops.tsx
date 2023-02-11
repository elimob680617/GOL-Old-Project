import { Avatar, Box, Card, Stack, styled, Tab, Tabs, Typography } from '@mui/material';
import { FC, useState } from 'react';

const TitleStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: 14,
  color: theme.palette.text.primary,
}));

interface ITabInterface {
  active: boolean;
}

const TabStyle = styled(Tab)<ITabInterface>(({ theme, active }) => ({
  color: active ? `${theme.palette.primary.main}!important` : `${theme.palette.text.secondary}!important`,
  fontWeight: 300,
  fontSize: '14px',
  lineHeight: '17.5px',
}));

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const NameStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: 14,
  lineHeight: '17.5px',
  color: theme.palette.text.primary,
}));

const ExplainStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: 12,
  lineHeight: '15px',
  color: theme.palette.text.secondary,
}));

const Tops: FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  return (
    <Card sx={{ padding: 2, width: 264 }}>
      <Stack spacing={2}>
        <Stack sx={{ cursor: 'pointer' }} direction="row" justifyContent="space-between">
          <TitleStyle variant="subtitle2">Tops</TitleStyle>
          <img src="/icons/right arrow/24/Outline.svg" width={20} height={20} alt="connection-arrow" />
        </Stack>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
            <TabStyle active={tabValue === 0} label="Company" {...a11yProps(0)} />
            <TabStyle active={tabValue === 1} label="NGO" {...a11yProps(1)} />
            <TabStyle active={tabValue === 2} label="People" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <Stack spacing={2}>
            <Stack sx={{ cursor: 'pointer' }} spacing={1} direction="row">
              <Avatar src="/icons/" />
              <Stack spacing={0.5}>
                <NameStyle variant="body2">Google</NameStyle>
                <ExplainStyle variant="caption">120.26 GARD</ExplainStyle>
              </Stack>
            </Stack>
            <Stack sx={{ cursor: 'pointer' }} spacing={1} direction="row">
              <Avatar src="/icons/" />
              <Stack spacing={0.5}>
                <NameStyle variant="body2">Apple</NameStyle>
                <ExplainStyle variant="caption">120.26 GARD</ExplainStyle>
              </Stack>
            </Stack>
            <Stack sx={{ cursor: 'pointer' }} spacing={1} direction="row">
              <Avatar src="/icons/" />
              <Stack spacing={0.5}>
                <NameStyle variant="body2">Airbnb</NameStyle>
                <ExplainStyle variant="caption">120.26 GARD</ExplainStyle>
              </Stack>
            </Stack>
          </Stack>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          Item Three
        </TabPanel>
      </Stack>
    </Card>
  );
};

export default Tops;
