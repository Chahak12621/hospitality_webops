import type { UserRole } from '@/types/database.types';

export const ROLE_PERMISSIONS = {
  superadmin: {
    canViewTeam: true,
    canEditTeam: true,
    canDeleteTeam: true,
    canAssignToEvent: true,
    canViewAllGuests: true,
    canEditAllGuests: true,
    canDeleteAllGuests: true,
    canCreateGuests: true,
    canViewInventory: true,
    canEditInventory: true,
    canDeleteInventory: true,
    canViewDashboard: true,
    canManageEvents: true,
    canSearchMembers: true,
  },
  coordinator: {
    canViewTeam: true,
    canEditTeam: false,
    canDeleteTeam: false,
    canAssignToEvent: false,
    canViewAllGuests: true,
    canEditAllGuests: false,
    canDeleteAllGuests: false,
    canCreateGuests: false,
    canViewInventory: true,
    canEditInventory: true,
    canDeleteInventory: false,
    canViewDashboard: true,
    canManageEvents: false,
    canSearchMembers: true,
  },
  volunteer: {
    canViewTeam: true,
    canEditTeam: false,
    canDeleteTeam: false,
    canAssignToEvent: false,
    canViewAllGuests: true,
    canEditAllGuests: false,
    canDeleteAllGuests: false,
    canCreateGuests: false,
    canViewInventory: true,
    canEditInventory: true,
    canDeleteInventory: false,
    canViewDashboard: true,
    canManageEvents: false,
    canSearchMembers: true,
  },
  event_head: {
    canViewTeam: false,
    canEditTeam: false,
    canDeleteTeam: false,
    canAssignToEvent: false,
    canViewAllGuests: false,   // only own guests
    canEditAllGuests: false,   // only own guests
    canDeleteAllGuests: false,
    canCreateGuests: true,     // can create guests
    canViewInventory: false,
    canEditInventory: false,
    canDeleteInventory: false,
    canViewDashboard: true,
    canManageEvents: false,
    canSearchMembers: false,
  },
};

export function hasPermission(
  role: UserRole,
  permission: keyof typeof ROLE_PERMISSIONS['superadmin']
): boolean {
  return ROLE_PERMISSIONS[role]?.[permission] ?? false;
}

export function canAccessPage(role: UserRole, page: string): boolean {
  const pageAccessMap: Record<string, UserRole[]> = {
    '/dashboard': ['superadmin', 'coordinator', 'volunteer', 'event_head'],
    '/dashboard/team': ['superadmin', 'coordinator', 'volunteer'],
    '/dashboard/guests': ['superadmin', 'coordinator', 'volunteer', 'event_head'],
    '/dashboard/inventory': ['superadmin', 'coordinator', 'volunteer'],
    '/dashboard/events': ['superadmin'],
  };

  return pageAccessMap[page]?.includes(role) ?? false;
}