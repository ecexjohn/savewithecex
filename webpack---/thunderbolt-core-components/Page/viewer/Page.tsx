import * as React from 'react';
import { PageProps } from '../Page.types';

const Page: React.FC<PageProps> = ({
  id,
  skin: PageClass,
  pageDidMount,
  onClick = () => {},
  onDblClick = () => {},
  children,
}) => {
  return (
    <PageClass
      id={id}
      pageDidMount={pageDidMount}
      onClick={onClick}
      onDblClick={onDblClick}
    >
      {children as () => React.ReactNode}
    </PageClass>
  );
};

export default Page;
