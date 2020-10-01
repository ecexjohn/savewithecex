import * as React from 'react';
import { IContainerLogicProps } from '../../Container.types';
import MeshContainer from '../../../../thunderbolt-core-components/MeshContainer/viewer/MeshContainer';

export const ContainerLogic: React.FC<IContainerLogicProps> = props => {
  const {
    id,
    className,
    meshProps,
    renderSlot,
    children,
    onClick,
    onDblClick,
    onMouseEnter,
    onMouseLeave,
  } = props;

  const meshContainerProps = {
    id,
    children,
    ...meshProps,
  };

  return (
    <div
      id={id}
      className={className}
      onClick={onClick}
      onDoubleClick={onDblClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {renderSlot({
        containerChildren: <MeshContainer {...meshContainerProps} />,
      })}
    </div>
  );
};
