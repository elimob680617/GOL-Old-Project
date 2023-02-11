import React, { ReactNode } from 'react';
import SelectConnection from './common/SelectConnection';
import SelectLocation from './common/SelectLocation';
import WelcomeWellDoneDialog from './common/WelcomeWellDoneDialog';
import SelectJoinReason from './ngo/SelectJoinReason';
import SelectWorkField from './ngo/SelectWorkField';
import SelectCategory from './normal/SelectCategory';
import SelectGender from './normal/SelectGender';

const afterSignUpRouts: Record<string, ReactNode> = {
  welcome: <WelcomeWellDoneDialog />,
  gender: <SelectGender />,
  location: <SelectLocation />,
  categories: <SelectCategory />,
  'suggest-people': <SelectConnection />,
  reasons: <SelectJoinReason />,
  fields: <SelectWorkField />,
  done: <WelcomeWellDoneDialog isDone />,
};

export default afterSignUpRouts;
