

import ProfileInfo from '@/components/profile/ProfileInfo';
import { getUserInfo } from './loaders';

export default async function UserDashboard() {
  const info = await getUserInfo();

  if (!info) {
    throw new Error('Failed to load profile.');
  }

  return <ProfileInfo info={info} />;
}