import React, { useMemo } from 'react';

import { useRecoilValue } from 'recoil';
import { permissionsState } from '@store/permissionAtom';

interface PermissionWrapperProps {
    module: string;
    permissions: string | string[]; // Union type for string or array of strings
    children: React.ReactNode;
}

export const useHasPermissions = (permissions: any[], module: string, requiredPermission: string | string[]): boolean => {
    const permissionArray = typeof requiredPermission === 'string' ? [requiredPermission] : requiredPermission;
    const modulePermissions = useMemo(() => permissions.find(perm => perm.module === module), [permissions, module]);
    return modulePermissions ? permissionArray.some(permission => modulePermissions.permissions.includes(permission)) : false;
};

const EduCarePermissionWrapper: React.FC<PermissionWrapperProps> = ({ module, permissions, children }) => {
    const allPermissions = useRecoilValue(permissionsState); // Fetch permissions

    const hasPermission = useHasPermissions(allPermissions, module, permissions);

    if (!hasPermission) {
        return <div className="collapse"></div>;
    }

    return <>{children}</>;
};

export default EduCarePermissionWrapper;
