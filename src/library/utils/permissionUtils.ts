import { useRecoilValue } from 'recoil';
import { permissionsState } from '@store/permissionAtom';

type Permission = {
    module: string;
    permissions: string[];
};

export const useHasPermission = (module: string, requiredPermission: string): boolean => {
    const permissions = useRecoilValue<Permission[]>(permissionsState);

    const modulePermissions = permissions.find(perm => perm.module === module);
    return modulePermissions ? modulePermissions.permissions.includes(requiredPermission) : false;
};
