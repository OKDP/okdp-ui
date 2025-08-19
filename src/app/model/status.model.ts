export interface Status {
  icon: string;
  class: string;
}

export const STATUS_RUNNING = 'RUNNING';
export const STATUS_STOPPED = 'STOPPED';
export const STATUS_FAILED = 'FAILED';
export const STATUS_ACTIVE = 'ACTIVE';
export const STATUS_TERMINATING = 'TERMINATING';
export const STATUS_UNKNOWN = 'UNKNOWN';
export const RELEASE_PHASE_READY = 'READY';
export const RELEASE_PHASE_ERROR = 'ERROR';
export const RELEASE_PHASE_WAIT_OCI = 'WAIT_OCI';
export const RELEASE_PHASE_WAIT_HELM_REPO = 'WAIT_REPO';
export const RELEASE_PHASE_WAIT_HELM_RELEASES = 'WAIT_HREL';
export const RELEASE_PHASE_WAIT_DEPENDENCIES = 'WAIT_DEPS';
export const RELEASE_PHASE_SUSPENDED = 'SUSPENDED';

export const STATE_SUCCEEDED = 'SUCCEEDED';
export const STATE_RUNNING = 'RUNNING';
export const STATE_WAITING = 'WAITING';
export const STATE_TERMINATED = 'TERMINATED';
export const STATE_UNKNOWN = 'UNKNOWN';

export const STATE_HEALTHY = 'HEALTHY';
export const STATE_COMPLETED = 'COMPLETED';
export const STATE_NOT_READY = 'NOTREADY';
export const STATE_PENDING = 'PENDING';
export const STATE_FAILED = 'FAILED';

export function ToStatusView(status: string | undefined): [string, string] {
  const statusLabel = status?.toLowerCase() || 'unknown';

  switch (status?.toUpperCase()) {
    case STATE_RUNNING:
    case STATE_HEALTHY:
    case STATE_COMPLETED:
    case STATE_SUCCEEDED:
    case STATUS_ACTIVE:
    case RELEASE_PHASE_READY:
      return [statusLabel, 'check_circle'];
    case STATE_FAILED:
    case STATUS_FAILED:
    case RELEASE_PHASE_ERROR:
      return [statusLabel, 'error'];
    case STATE_PENDING:
    case STATE_WAITING:
    case RELEASE_PHASE_WAIT_OCI:
    case RELEASE_PHASE_WAIT_HELM_REPO:
    case RELEASE_PHASE_WAIT_HELM_RELEASES:
    case STATUS_TERMINATING:
    case RELEASE_PHASE_WAIT_DEPENDENCIES:
      return [statusLabel, 'hourglass_top'];
    case STATUS_RUNNING:
    case RELEASE_PHASE_SUSPENDED:
      return [statusLabel, 'pause_circle_filled'];
    case STATE_TERMINATED:
    case STATUS_STOPPED:
      return [statusLabel, 'stop_circle'];
    default:
      return [statusLabel, 'help_outline'];
  }
}
