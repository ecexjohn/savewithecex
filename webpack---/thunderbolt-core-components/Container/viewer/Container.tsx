import * as React from 'react';
import MeshContainer, {
  MeshContainerProps,
} from '../../MeshContainer/viewer/MeshContainer';

const Container: React.FC<MeshContainerProps> = ({
  id,
  wedges,
  rotatedComponents,
  children,
}) => {
  return (
    <div id={id}>
      <MeshContainer
        id={id}
        rotatedComponents={rotatedComponents}
        wedges={wedges}
      >
        {children}
      </MeshContainer>
    </div>
  );
};

export default Container;
