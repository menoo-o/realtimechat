// # Profile display component

import { UserInfo } from '@/app/dashboard/user/loaders';

export default function ProfileInfo({ info }: { info: UserInfo }) {
  return (
    <div>
      <h2 className="text-xl mb-4">Your Profile</h2>
      <div>
        <p>
          <strong>Name:</strong> {info.first_name} {info.last_name}
        </p>
        <p>
          <strong>Email:</strong> {info.email}
        </p>
        <p>
          <strong>Verified:</strong> {info.email_confirmed_at ? 'Yes' : 'No'}
        </p>
      </div>
    </div>
  );
}