import { Box, Button, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import iconProfileWizard from 'public/icons/wizard/ngo-wizard-profile-icon.png';
import React, { useState } from 'react';
import { PathAppCaller } from 'src/routes/paths';

interface WizardProps {
  percentage: number;
  fromHomePage: boolean;
}

export default function Wizard(props: WizardProps) {
  const router = useRouter();
  const { percentage, fromHomePage } = props;
  const [closeWizardNgo, setCloseWizardNgo] = useState(localStorage.getItem('closeWizardNgo') === 'true');

  function handleRoute() {
    if (fromHomePage) {
      localStorage.setItem('homePageWizard', 'true');
    }
    const paths = PathAppCaller();
    router.push(paths.profile.ngo.wizard.wizardList);
  }

  const handleCloseWizard = () => {
    localStorage.setItem('closeWizardNgo', 'true');
    setCloseWizardNgo(true);
  };

  if (closeWizardNgo) return <></>;

  if (percentage === 100) return <></>;

  return (
    <>
      <Stack
        justifyContent="space-between"
        alignItems="center"
        direction="row"
        sx={{ backgroundColor: 'background.paper' }}
      >
        <Stack direction="row" alignItems="center" sx={{ pl: 2.5 }}>
          <Box sx={{ width: 40, height: 40, mr: 2 }}>
            <Image src={iconProfileWizard} alt="Profile Wizard Icon" width={'100%'} height={'100%'} />
          </Box>
          <Box>
            <CircularProgress
              variant="determinate"
              value={percentage}
              sx={{ my: 3, position: 'relative', zIndex: 10 }}
            />
            <CircularProgress
              variant="determinate"
              value={100}
              sx={{ my: 3, position: 'absolute', ml: -5, color: 'grey.300', zIndex: 1 }}
            />
          </Box>
          <Stack direction="row" alignItems="center" sx={{ gap: 0.4, px: 1.2 }}>
            <Typography variant="subtitle1" color="primary.main">
              {percentage + '%'}
            </Typography>
            <Typography variant="subtitle1" color="grey.500">
              Completed
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button color="info" onClick={handleRoute}>
            Complete Your Profile
          </Button>
          <IconButton sx={{ mr: 2, color: 'grey.500' }} onClick={handleCloseWizard}>
            &#215;
          </IconButton>
        </Stack>
      </Stack>
    </>
  );
}
