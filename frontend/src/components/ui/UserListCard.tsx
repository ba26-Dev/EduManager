// UserListCard.tsx
import React from 'react';
import type { User } from '../../services/api';

interface Props {
  users: User[];
  selected: Set<string>;
  onToggle: (userId: string) => void;
}

const UserListCard: React.FC<Props> = ({ users, selected, onToggle }) => {
  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {users.map((user) => {
        const id = user.id ?? user.username;
        return (
          <div
            key={id}
            className={`flex items-center gap-4 p-3 border rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 ${
              selected.has(id) ? 'bg-blue-50' : 'bg-white'
            }`}
            onClick={() => onToggle(id)}
          >
            <input
              type="checkbox"
              checked={selected.has(id)}
              onChange={() => onToggle(id)}
              className="form-checkbox"
              onClick={(e) => e.stopPropagation()}
            />
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white">
                {user.firstname[0]}
                {user.lastname[0]}
              </div>
            )}
            <div>
              <div className="font-medium">{user.firstname} {user.lastname}</div>
              <div className="text-sm text-gray-500">@{user.username}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserListCard;
