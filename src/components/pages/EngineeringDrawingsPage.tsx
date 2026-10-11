import React from 'react';
import { EngineeringSvgViewer } from '../drawings/EngineeringSvgViewer';

export const EngineeringDrawingsPage: React.FC = () => {
  return (
    <div style={{ flex: 1, height: 'calc(100vh - 64px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <EngineeringSvgViewer />
    </div>
  );
};
