import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EndpointsFromUsagePipe } from '../../../../shared/pipes';

@Component({
  selector: 'app-release-details',
  standalone: true,
  imports: [CommonModule],
  providers: [EndpointsFromUsagePipe],
  templateUrl: './release-details.component.html',
  styleUrls: ['./release-details.component.scss'],
  animations: [],
})
export class ReleaseDetailsComponent implements OnInit {
  ngOnInit(): void {}
}
