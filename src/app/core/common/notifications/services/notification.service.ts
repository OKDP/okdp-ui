import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification, NotificationType } from '../../../models';
import { nowIsoString } from '../../../constants';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = new Map<string, Notification>();
  private messagesSubject = new BehaviorSubject<Notification[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor() {}

  onSuccess(
    service: string,
    project: string,
    catalogId: string,
    message: string,
    creationTimestamp: string = nowIsoString()
  ): void {
    this.addMessage(service, project, NotificationType.Success, catalogId, message, creationTimestamp);
  }

  onError(
    service: string,
    project: string,
    catalogId: string,
    message: string,
    creationTimestamp: string = nowIsoString()
  ): void {
    this.addMessage(service, project, NotificationType.Error, catalogId, message, creationTimestamp);
  }

  onInfo(
    service: string,
    project: string,
    catalogId: string,
    message: string,
    creationTimestamp: string = nowIsoString()
  ): void {
    this.addMessage(service, project, NotificationType.Info, catalogId, message, creationTimestamp);
  }

  onWarning(
    service: string,
    project: string,
    catalogId: string,
    message: string,
    creationTimestamp: string = nowIsoString()
  ): void {
    this.addMessage(service, project, NotificationType.Warning, catalogId, message, creationTimestamp);
  }

  private addMessage(
    service: string,
    project: string,
    type: NotificationType,
    catalogId: string,
    message: string,
    creationTimestamp: string
  ): void {
    const newMessage: Notification = { type, service, project, catalogId, message, creationTimestamp };
    this.notifications.set(`${service}/${project}`, newMessage);
    this.messagesSubject.next([...this.notifications.values()]);
    //setTimeout(() => this.removeMessage(service), NOTIFICATION_MESSAGE_VISIBILITY_TIMEOUT);
  }

  updateMessage(service: string, project: string, message: string): void {
    if (this.notifications.has(`${service}/${project}`)) {
      const existingMessage = this.notifications.get(`${service}/${project}`);
      if (existingMessage) {
        existingMessage.message = message;
        this.messagesSubject.next([...this.notifications.values()]);
      }
    }
  }

  remove(service: string, project: string): void {
    this.notifications.delete(`${service}/${project}`);
    this.messagesSubject.next([...this.notifications.values()]);
  }

  clearAll(): void {
    this.notifications.clear();
    this.messagesSubject.next([]);
  }

  clear(filtredNotifications: Notification[]): void {
    if (!Array.isArray(filtredNotifications) || filtredNotifications.length === 0) return;

    for (const n of filtredNotifications) {
      if (!n) continue;
      this.notifications.delete(`${n.service}/${n.project}`);
    }

    this.messagesSubject.next([...this.notifications.values()]);
  }
}
