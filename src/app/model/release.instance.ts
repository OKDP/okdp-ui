import { Release } from '../api/_model';

export const ReleasePhaseReady = 'READY';
export const ReleasePhaseError = 'ERROR';
export const ReleasePhaseWaitOci = 'WAIT_OCI';
export const ReleasePhaseWaitHelmRepo = 'WAIT_REPO';
export const ReleasePhaseWaitHelmReleases = 'WAIT_HREL';
export const ReleasePhaseWaitDependencies = 'WAIT_DEPS';
export const ReleasePhaseSuspended = 'SUSPENDED';

export class ReleaseInstance {
  constructor(
    public release: Release,
    public icon: string,
    public description: string,
    public endpoint: string
  ) {}

  get statusPhase(): string {
    return this.release.status?.phase?.toUpperCase() || 'UNKNOWN';
  }

  get statusIcon(): string {
    switch (this.statusPhase) {
      case ReleasePhaseReady:
        return 'check_circle';
      case ReleasePhaseError:
        return 'error';
      case ReleasePhaseWaitOci:
      case ReleasePhaseWaitHelmRepo:
      case ReleasePhaseWaitHelmReleases:
      case ReleasePhaseWaitDependencies:
        return 'hourglass_top';
      case ReleasePhaseSuspended:
        return 'pause_circle_filled';
      default:
        return 'help_outline';
    }
  }
}
