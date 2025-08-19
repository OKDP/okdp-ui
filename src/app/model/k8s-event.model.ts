export interface K8sEvent {
  metadata: {
    name: string;
    namespace: string;
  };

  message: string;
  reason: string;
  type: string;
  firstTimestamp?: string;
  lastTimestamp?: string;
  count?: number;
  eventTime?: string | null;
}
