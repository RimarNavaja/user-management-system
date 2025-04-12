import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { Subscription } from "rxjs";

import { Alert, AlertType } from "@app/_models";
import { AlertService } from "@app/_services";

@Component({ selector: "alert", templateUrl: "alert.component.html" })
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id = "default-alert"; // used in template
  @Input() fade = true; // fade alert on close

  alerts: Alert[] = []; // array of alerts
  alertSubscription: Subscription; // subscription to alert service
  routeSubscription: Subscription; // subscription to router events

  constructor(private router: Router, private alertService: AlertService) {}

  ngOnInit() {
    //subscribe to new alert notifications
    this.alertSubscription = this.alertService
      .onAlert(this.id)
      .subscribe((alert) => {
        // clear alerts when an empty alert is received
        if (!alert.message) {
          this.alerts = this.alerts.filter((x) => x.keepAfterRouteChange); // remove current alert and keep others
          this.alerts.forEach((x) => delete x.keepAfterRouteChange); // remove keepAfterRouteChange flag from all alerts
          return;
        }

        // add alert to array
        this.alerts.push(alert);

        // auto close alert after timeout
        if (alert.autoClose) {
          setTimeout(() => this.removeAlert(alert), 3000);
        }
      });

    //clear alerts on location change
    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.alertService.clear(this.id); // clear alerts on location change
      }
    });
  }

  ngOnDestroy() {
    //unsubscribe to avoid memory leaks
    this.alertSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  removeAlert(alert: Alert) {
    //check if already removed to prevent error on auto close
    if (!this.alerts.includes(alert)) return; // alert already removed

    if (this.fade) {
      // fade out alert
      alert.fade = true;
      setTimeout(() => this.removeAlert(alert), 250); // wait for fade out to finish before removing alert
    } else {
      // remove alert immediately
      this.alerts = this.alerts.filter((x) => x !== alert);
    }
  }

  cssClasses(alert: Alert) {
    if (!alert) return;

    const classes = ["alert", "alert-dismissable"];

    const alertTypeClass = {
      [AlertType.Success]: "alert alert-success",
      [AlertType.Error]: "alert alert-danger",
      [AlertType.Info]: "alert alert-info",
      [AlertType.Warning]: "alert alert-warning",
    };

    classes.push(alertTypeClass[alert.type]); // add alert type class

    if (alert.fade) {
      classes.push("fade"); // add fade class
    }

    return classes.join(" "); // join classes into a string
  }
}
