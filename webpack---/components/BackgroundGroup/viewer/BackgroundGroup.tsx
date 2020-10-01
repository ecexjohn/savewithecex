import React from 'react';

export type BackgroundGroupProps = {
  children: () => React.ReactNode;
};

const BackgroundGroup: React.FC<BackgroundGroupProps> = props => {
  const { children } = props;

  return <div id="BACKGROUND_GROUP">{children()}</div>;
};

export default BackgroundGroup;
