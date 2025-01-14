import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification, NotificationType } from '../../../models';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = new Map<string, Notification>();
  private messagesSubject = new BehaviorSubject<Notification[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor() {}

  onSuccess(service: string, message: string): void {
    this.addMessage(service, NotificationType.Success, message);
  }

  onError(service: string, message: string): void {
    this.addMessage(service, NotificationType.Error, message);
  }

  onInfo(service: string, message: string): void {
    this.addMessage(service, NotificationType.Info, message);
  }

  private addMessage(service: string, type: NotificationType, message: string): void {
    const newMessage: Notification = { type, service, message };
    this.notifications.set(service, newMessage);
    this.messagesSubject.next([...this.notifications.values()]);
    //setTimeout(() => this.removeMessage(service), NOTIFICATION_MESSAGE_VISIBILITY_TIMEOUT);
  }

  updateMessage(service: string, message: string): void {
    if (this.notifications.has(service)) {
      const existingMessage = this.notifications.get(service);
      if (existingMessage) {
        existingMessage.message = message;
        this.messagesSubject.next([...this.notifications.values()]);
      }
    }
  }

  removeMessage(service: string): void {
    this.notifications.delete(service);
    this.messagesSubject.next([...this.notifications.values()]);
  }
}
