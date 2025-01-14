import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimWhiteSpace',
  standalone: true,
})
export class TrimWhiteSpacePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    return value.replace(/\s/g, '');
  }
}
