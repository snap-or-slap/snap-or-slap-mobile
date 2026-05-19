export type HomeTabKey = 'friends' | 'challenges' | 'notifications' | 'profile';

export interface HomeTabItem {
  key: HomeTabKey;
  label: string;
}
