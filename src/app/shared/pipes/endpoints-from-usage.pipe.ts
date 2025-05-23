import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'endpointsFromUsage',
  standalone: true,
})
export class EndpointsFromUsagePipe implements PipeTransform {
  transform(usage: { text?: string } | undefined): string[] {
    if (!usage?.text) return [];

    const regex = /(https?:\/\/[^\s]+)/g;
    const matches = usage.text.match(regex);
    return matches || [];
  }
}
