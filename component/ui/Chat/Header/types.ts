export interface ChatHeaderProps {
  title: string;
  theme?: string;
  level?: string;
  politeness?: string;
  customTheme?: string;
  chatPage?: boolean;
  history?: any;
  analysis?: any;
  id?: string;
  characterName?: string;
  overlayOpened?: boolean;
  setOverlayOpened?: (open: boolean) => void;
}
