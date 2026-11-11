import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

function getClientSnapshot(): boolean {
    return true;
}

function getServerSnapshot(): boolean {
    return false;
}

export function useIsClient(): boolean {
    return useSyncExternalStore(
        emptySubscribe,
        getClientSnapshot,
        getServerSnapshot,
    );
}
