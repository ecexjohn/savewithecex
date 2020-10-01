import { IComponentController } from '@wix/editor-elements-types';
import { ISlideShowContainerControllerActions } from '../SlideShowContainer.types';

const mapActionsToProps: IComponentController = ({
  updateProps,
}): ISlideShowContainerControllerActions => ({
  changeSlide: (slideIndex: number) => {
    updateProps({
      currentSlideIndex: slideIndex,
    });
  },
  play: () => {
    updateProps({
      isPlaying: true,
    });
  },
  pause: () => {
    updateProps({
      isPlaying: false,
    });
  },
});

export default mapActionsToProps;
