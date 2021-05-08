import { Component } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'fk-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'filmkritiken-frontend';
  isLoggedIn = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
  ) { }

  ngOnInit(): void {
    this.refreshLoginState();
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.refreshLoginState();
        this.checkAndSetActiveAccount();
      })
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  loginPopup() {
    this.authService.loginPopup()
      .subscribe((response: AuthenticationResult) => {
        this.authService.instance.setActiveAccount(response.account);
      });
  }

  checkAndSetActiveAccount() {
    let activeAccount = this.authService.instance.getActiveAccount();

    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  logout() {
    this.authService.logoutPopup({
      mainWindowRedirectUri: "/"
    })
  }

  refreshLoginState() {
    this.isLoggedIn = this.authService.instance.getAllAccounts.length > 0;
  }

}
