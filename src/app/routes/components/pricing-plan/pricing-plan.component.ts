import { Component, inject } from '@angular/core';
import { PricingPlan } from 'src/app/common/models/pricing-plan.model';
import { Store } from '@ngrx/store';
import { PRICING_PLANS } from './pricing-plan-constants';
import { selectIsDarkTheme } from 'src/app/store/theme/theme.selectors';

@Component({
  selector: 'app-pricing-plan',
  templateUrl: './pricing-plan.component.html',
  styleUrls: ['./pricing-plan.component.scss'],
})
export class PricingPlanComponent {
  public isAnnual = false;
  protected pricingPlans: Array<PricingPlan> = PRICING_PLANS;
  protected _store = inject(Store);
  public isDarkTheme$ = this._store.select(selectIsDarkTheme);
}
