// src/app/stripe-payment/stripe-payment.component.ts

import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { PricingPlan } from 'src/app/common/models/pricing-plan.model';

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.scss'],
})
export class StripePaymentComponent implements OnInit {
  @Input() pricingPlan: PricingPlan | undefined;
  private stripePromise: Promise<any>;

  constructor(private router: Router) {
    this.stripePromise = loadStripe('your_stripe_publishable_key');
  }

  ngOnInit(): void {}

  async redirectToCheckout() {
    const stripe = await this.stripePromise;

    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: this.pricingPlan?.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cancel`,
    });

    if (error) {
      console.error('Error:', error);
    }
  }
}
