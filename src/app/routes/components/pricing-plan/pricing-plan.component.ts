import { Component, inject } from '@angular/core';
import { PricingPlan } from 'src/app/common/models/pricing-plan.model';
import { ThemeService } from 'src/app/common/services/theme.service';
import { PRICING_PLANS } from './pricing-plan-constants';

@Component({
  selector: 'app-pricing-plan',
  templateUrl: './pricing-plan.component.html',
  styleUrls: ['./pricing-plan.component.scss'],
})
export class PricingPlanComponent {
  public isAnnual: boolean = false;
  protected themeService = inject(ThemeService);
  protected pricingPlans: Array<PricingPlan> = PRICING_PLANS;
}
