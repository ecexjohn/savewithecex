import { UnpackValueTypes } from '@wix/editor-elements-types';

export const keyCodes = {
  enter: 13,
  space: 32,
  end: 35,
  home: 36,
  escape: 27,
  arrowLeft: 37,
  arrowUp: 38,
  arrowRight: 39,
  arrowDown: 40,
  tab: 9,
} as const;

type KeyCode = UnpackValueTypes<typeof keyCodes>;

function activateByKey(key: KeyCode): React.KeyboardEventHandler<HTMLElement> {
  return event => {
    if (event.keyCode === key) {
      event.currentTarget.click();
    }
  };
}

export const activateBySpaceButton = activateByKey(keyCodes.space);
export const activateByEnterButton = activateByKey(keyCodes.enter);
export const activateBySpaceOrEnterButton: React.KeyboardEventHandler<HTMLElement> = event => {
  activateByEnterButton(event);
  activateBySpaceButton(event);
};
export const activateByEscapeButton = activateByKey(keyCodes.escape);

export const HAS_CUSTOM_FOCUS_CLASSNAME = 'has-custom-focus';
