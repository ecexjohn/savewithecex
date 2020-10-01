import * as React from 'react';
import cx from 'classnames';
import { IAppWidgetProps } from '../AppWidget.types';
import MeshContainer from '../../../thunderbolt-core-components/MeshContainer/viewer/MeshContainer';
import style from './style/AppWidget.scss';

/**
 * TODO - how should the scrollMixin be migrated? and the overflowWrapperMixin?
 * TODO - consider using uiType here to separate the loader skin
 */
const AppWidget: React.FC<IAppWidgetProps> = props => {
  const { id, skin = 'AppWidgetSkin', children, meshProps } = props;
  const meshContainerProps = {
    id,
    ...meshProps,
  };

  const shouldShowLoader = skin === 'AppWidgetLoaderSkin';

  return (
    <div
      id={id}
      className={cx(style.root, {
        [style.loading]: shouldShowLoader,
      })}
    >
      {shouldShowLoader ? (
        <div role="alert" aria-busy="true" className={style.preloader} />
      ) : (
        <MeshContainer {...meshContainerProps}>{children}</MeshContainer>
      )}
    </div>
  );
};

export default AppWidget;
