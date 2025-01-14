interface StatusDict {
  [key: string]: { icon: string; class: string };
}

export const STATUS_RUNNING = 'Running';
export const STATUS_STOPPED = 'Stopped';
export const STATUS_FAILED = 'Failed';
export const STATUS_UNKNOWN = 'Unknown';

export const Status: StatusDict = {
  Running: { icon: 'check_circle', class: 'text-success' },
  Stopped: { icon: 'stop_circle', class: 'text-primary' },
  Failed: { icon: 'error', class: 'text-danger' },
  Unknown: { icon: 'help', class: 'text-warning' },
};
