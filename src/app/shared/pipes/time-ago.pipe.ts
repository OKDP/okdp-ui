import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { parseISO } from 'date-fns/parseISO';

@Pipe({ name: 'timeAgo', standalone: true })
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    const d = typeof value === 'string' ? parseISO(value) : value;
    return formatDistanceToNow(d, { addSuffix: true });
  }
}
