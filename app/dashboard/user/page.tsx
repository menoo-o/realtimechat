
// app/dashboard/user/page.tsx
// app/dashboard/user/page.tsx
import ProfileInfo from '@/components/profile/ProfileInfo';
import MessageDisplay from '@/components/user/MessageDisplay';
import { getUserInfo } from './loaders';

export default async function UserDashboard() {
  const info = await getUserInfo();
  if (!info) {
    throw new Error('Failed to load profile.');
  }

  return (
    <div>
      <ProfileInfo info={info} />
      <MessageDisplay />
    </div>
  );
}