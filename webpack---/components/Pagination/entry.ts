import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent(
      'Pagination',
      () =>
        Promise.all([
          import(
            './viewer/skinComps/PaginationForm/PaginationForm.skin' /* webpackChunkName: "Pagination_PaginationForm" */
          ),
          import(
            './viewer/Pagination.controller' /* webpackChunkName: "Pagination_PaginationForm" */
          ),
        ]).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            controller: controllerModule.default,
          };
        }),
      'PaginationForm',
    );

    hostAPI.registerComponent(
      'Pagination',
      () =>
        Promise.all([
          import(
            './viewer/skinComps/PaginationStrip/PaginationStrip.skin' /* webpackChunkName: "Pagination_PaginationStrip" */
          ),
          import(
            './viewer/Pagination.controller' /* webpackChunkName: "Pagination_PaginationStrip" */
          ),
        ]).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            controller: controllerModule.default,
          };
        }),
      'PaginationStrip',
    );
  },
};

export default entry;
