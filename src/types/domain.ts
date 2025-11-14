export const USER_ROLES = ['MEMBER', 'ADMIN'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const EVENT_STATUSES = ['UPCOMING', 'COMPLETED', 'CANCELLED'] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export const REGISTRATION_STATUSES = ['REGISTERED', 'CANCELLED', 'ATTENDED'] as const;
export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];

export const RESOURCE_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
export type ResourceStatus = (typeof RESOURCE_STATUSES)[number];

export const REGIONS = ['NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL'] as const;
export type Region = (typeof REGIONS)[number];

export const INDUSTRIES = ['SAAS', 'FINTECH', 'HEALTHCARE', 'ECOMMERCE', 'OTHER'] as const;
export type Industry = (typeof INDUSTRIES)[number];

export const ANNOUNCEMENT_AUDIENCES = ['ALL', 'MEMBERS', 'ADMINS'] as const;
export type AnnouncementAudience = (typeof ANNOUNCEMENT_AUDIENCES)[number];
