import { ReactNode } from 'react';
import ProjectDateDialog from './ProjectDateDialog';
import ProjectDeleteConfirmDialog from './ProjectDeleteConfirmDialog';
import ProjectDiscardDialog from './ProjectDiscardDialog';
import ProjectEditPhotoDialog from './ProjectEditPhotoDialog';
import ProjectListDialog from './ProjectListDialog';
import ProjectLocationDialog from './ProjectLocationDialog';
import ProjectNewDialog from './ProjectNewDialog';
import ProjectPhotoDialog from './ProjectPhotoDialog';
import SelectProjectAudienceDialog from './SelectProjectAudienceDialog';

const projectRoutes: Record<string, ReactNode> = {
  'project-list': <ProjectListDialog />,
  'project-new': <ProjectNewDialog />,
  'project-start-date': <ProjectDateDialog />,
  'project-end-date': <ProjectDateDialog isEndDate />,
  'project-location': <ProjectLocationDialog />,
  'project-photo': <ProjectPhotoDialog />,
  'project-edit-photo': <ProjectEditPhotoDialog />,
  'project-delete': <ProjectDeleteConfirmDialog />,
  'project-discard': <ProjectDiscardDialog />,
  'project-audience': <SelectProjectAudienceDialog />,
};

export default projectRoutes;
