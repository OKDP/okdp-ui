import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, ActivatedRoute, RouterLink } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { StepperService } from '../services/stepper.service';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatStepperModule, MatIconModule],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnInit {
  stepLabels: string[] = [];
  currentStep: number = 0;

  constructor(
    private route: ActivatedRoute,
    private stepperService: StepperService
  ) {}

  ngOnInit(): void {
    const childRoutes = this.route.routeConfig?.children ?? [];

    this.stepLabels = childRoutes.map(r => r.data?.['step']).filter(label => !!label);

    const info = childRoutes.find(r => r.data?.['info'])?.data?.['info'];
    if (info) this.stepLabels.push(info);

    this.stepperService.currentStep$.subscribe(step => {
      this.currentStep = step;
    });
  }

  onStepActivate(_: any) {
    const childRoutes = this.route.routeConfig?.children ?? [];
    const activePath = this.route.firstChild?.snapshot.routeConfig?.path ?? '';

    const matchingIndex = childRoutes.findIndex(route => {
      const pattern = '^' + route.path!.replace(/:\w+/g, '[^/]+') + '$';
      return new RegExp(pattern).test(activePath);
    });

    if (matchingIndex !== -1) {
      this.currentStep = matchingIndex;
      this.stepperService.setStep(matchingIndex);
    }
  }

  isStepCompleted(index: number): boolean {
    return index < this.currentStep;
  }
}
