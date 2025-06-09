import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-subscription-plan',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './subscription-plan.component.html',
  styleUrl: './subscription-plan.component.css'
})
export class SubscriptionPlanComponent {
  plans: any[] = [];
  constructor(private router: Router, private srevice: SharedService) {
    // this.router.navigateByUrl('/author/auther-dashboard');
  }

  ngOnInit() {
    this.srevice.get('author/allPlans').subscribe((res: any) => {
      this.plans = res.plans;
    });
  }

  initiateStripePayment(planId: number) {
    this.srevice.postAPI('author/subscribe', { plan_id: planId }).subscribe((res: any) => {
      if (res.status) {
        // window.location.href = res.url;
        console.log(window.location.origin + '/success');

      }
    });
  }
}
