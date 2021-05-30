import React from "react";
import AdminPanel from './AdminPanel';
import { RouteNames } from "../../shared/consts/RouteNames";

export const AdminPanelExport: React.FC = () => {
  return (
    <AdminPanel currentRoute={RouteNames.adminPanelExport}>
      <p>Export</p>
    </AdminPanel>
  );
};

export default AdminPanelExport;