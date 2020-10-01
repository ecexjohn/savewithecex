import React from 'react';
import { IGroupProps } from '../Group.types';
import MeshContainer from '../../../thunderbolt-core-components/MeshContainer/viewer/MeshContainer';

const Group: React.FC<IGroupProps> = props => {
  const { id, meshProps, children } = props;

  return (
    <div id={id}>
      <MeshContainer id={id} {...meshProps}>
        {children}
      </MeshContainer>
    </div>
  );
};

export default Group;
