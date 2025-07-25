import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ParentDashboard from '../components/dashboard/ParentDashboard';
import Layout from '../components/layout/Layout';
import Dashboard from '../components/dashboard/Dashboard';
// import api, { type RegisterPayload } from "../services/api";
const DashboardPage: React.FC = () => {
    // const [error, setError] = useState('');
    const { role } = useAuth()

    const renderDashboard = () => {
        console.log("role ===>>>>>>>>> " + role);

        switch (role?.toLowerCase()) {
            case 'admin': return <Dashboard />;
            case 'eleve': return <Dashboard />;
            case 'parent': return <ParentDashboard />;
            default: return <Dashboard />;
        }
    };

    return (
        <Layout>
            {renderDashboard()}
        </Layout>
    );
};

export default DashboardPage;