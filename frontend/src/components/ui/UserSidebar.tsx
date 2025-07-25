import React, { useState } from 'react';
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    Avatar,
    Dialog,
    DialogBody,
    DialogHeader,
    DialogFooter,
    Button
} from '@material-tailwind/react';
import { FaUserCircle } from 'react-icons/fa';
import NoteForm from './NoteForme';
import { useAuth } from '../../context/AuthContext';
import type { User } from '../../types/auth';

interface UserSidebarProps {
    users: User[];
}

const UserSidebar: React.FC<UserSidebarProps> = ({ users }) => {
    const { selectedLayoutCourse } = useAuth();
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleOpen = (user: User) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedUser(null);
        setOpen(false);
    };
    return (
        <aside className="space-y-2">
            <Card shadow={false} className="h-full bg-blue-800 text-white">
                <div className="p-4 border-b">
                    <Typography variant="h5" color="white">
                        Utilisateurs
                    </Typography>
                </div>
                <List>
                    {users.map((user) => (
                        <ListItem
                            key={user.id}
                            onClick={() => handleOpen(user)}
                            className="cursor-pointer hover:bg-blue-700"
                        >
                            <ListItemPrefix>
                                {user.avatar ? (
                                    <Avatar src={user.avatar} alt={user.username} size="sm" />
                                ) : (
                                    <FaUserCircle size={24} />
                                )}
                            </ListItemPrefix>
                            <div>
                                <Typography variant="small" color="white">
                                    {user.username}
                                </Typography>
                                <Typography variant="paragraph" className="text-xs text-gray-300">
                                    {user.email}
                                </Typography>
                            </div>
                        </ListItem>
                    ))}
                </List>
            </Card>

            {/* Modal Dialog pour NoteForm */}
            <Dialog open={open} handler={handleClose} size="lg">
                <DialogHeader>Ajouter une note à {selectedUser?.username}</DialogHeader>
                <DialogBody {...({} as any)}>
                    {selectedUser && selectedLayoutCourse ? (
                        <NoteForm
                            eleveID={`${selectedUser.id}`}
                            onSubmit={(bool) => setOpen(bool)}
                        />
                    ) : (
                        <div className="text-center text-gray-500">Chargement du formulaire...</div>
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={handleClose}>
                        Fermer
                    </Button>
                </DialogFooter>
            </Dialog>
        </aside>
    );
};

export default UserSidebar;
