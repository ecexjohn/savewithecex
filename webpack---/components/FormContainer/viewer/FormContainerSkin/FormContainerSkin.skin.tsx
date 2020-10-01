import * as React from 'react';
import { IFormContainerProps } from '../../FormContainer.types';
import { FormContainerRoot } from '../shared/FormContainerRoot';
import MeshContainer from '../../../../thunderbolt-core-components/MeshContainer/viewer/MeshContainer';
import style from './FormContainerSkin.scss';

const FormContainerSkin: React.FC<IFormContainerProps> = props => {
  const { id, meshProps, onSubmit, children } = props;
  const meshContainerProps = {
    id,
    ...meshProps,
    children,
  };

  return (
    <FormContainerRoot id={id} className={style.root} onSubmit={onSubmit}>
      <MeshContainer {...meshContainerProps} />
    </FormContainerRoot>
  );
};

export default FormContainerSkin;
