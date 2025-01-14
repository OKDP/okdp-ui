import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'endpointsFromUsage',
  standalone: true,
})
export class EndpointsFromUsagePipe implements PipeTransform {
  transform(usage: string): string[] {
    if (!usage) return [];
    const regex = /<a href="([^"]+)">/g;
    const matches: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(usage)) !== null) {
      const url = match[1];
      if (url) {
        matches.push('https://' + url);
      }
    }
    return matches;
  }
}
