import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Checkbox, Card, Typography } from '@material-tailwind/react';
import type { User } from '../../types/auth.d';

interface Props {
  users: User[];
  selected: Set<string>;
  onToggle: (userId: string) => void;
}

const UserListCard: React.FC<Props> = ({ users, selected, onToggle }) => {
  return (
    <div className="space-y-3 max-h-80 overflow-y-auto p-2">
      {users.map((user) => {
        const id = `${user?.id}`;
        return (
          <Card
            key={id}
            className={`flex items-center gap-4 p-3 cursor-pointer transition-colors ${selected.has(id)
              ? 'bg-blue-50 border-blue-200'
              : 'bg-white hover:bg-gray-50'
              }`}
            onClick={() => onToggle(id)}
          >
            <div className="flex items-center gap-4 w-full">
              <Checkbox
                crossOrigin=""
                checked={selected.has(id)}
                onChange={() => onToggle(id)}
                onClick={(e) => e.stopPropagation()}
                ripple={false}
              />

              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstname} ${user.lastname}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="text-blue-500">
                  <FaUserCircle size={40} />
                </div>
              )}

              <div>
                <Typography variant="h6">
                  {user.firstname} {user.lastname}
                </Typography>
                <Typography variant="small" color="gray">
                  @{user.username}
                </Typography>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default UserListCard;