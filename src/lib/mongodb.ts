import { Resume } from './types';

// Simple in-memory storage for local development without Docker
const globalAny: any = global;
if (!globalAny._resumesDb) {
    globalAny._resumesDb = [];
}

export const getResumesDb = (): Resume[] => {
    return globalAny._resumesDb;
};

export const setResumesDb = (data: Resume[]) => {
    globalAny._resumesDb = data;
};
