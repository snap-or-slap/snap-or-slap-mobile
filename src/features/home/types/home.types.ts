export type HomeTabKey = 'friends' | 'challenges' | 'profile';

export interface HomeTabItem {
  key: HomeTabKey;
  label: string;
}