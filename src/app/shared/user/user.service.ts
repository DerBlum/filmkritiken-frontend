import { Injectable } from "@angular/core";
import { MsalBroadcastService, MsalService } from "@azure/msal-angular";
import { AuthenticationResult, InteractionStatus } from "@azure/msal-browser";
import { AccountInfo } from "@azure/msal-common";
import { of, Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";

var minute: 60_000;

@Injectable()
export class UserService {

    private readonly _destroying$ = new Subject<void>();

    private accountInfo: AccountInfo;
    private authToken: string;
    private authTokenExpiryDate: Date;

    constructor(
        private authService: MsalService,
        private msalBroadcastService: MsalBroadcastService,
    ) {
        this.initUserData();
    }

    ngOnInit(): void {
        this.msalBroadcastService.inProgress$
            .pipe(
                filter((status: InteractionStatus) => status === InteractionStatus.None),
                takeUntil(this._destroying$)
            )
            .subscribe(() => {
                this.initUserData();
            });
    }

    ngOnDestroy(): void {
        this._destroying$.next(undefined);
        this._destroying$.complete();
    }

    public loginViaPopup(): void {
        this.authService.loginPopup()
            .subscribe((response: AuthenticationResult) => {
                this.authService.instance.setActiveAccount(response.account);
                this.setUserInfo(response);
            });
    }

    public logout(): void {
        this.authService.logoutPopup({
            mainWindowRedirectUri: "/",
        });
        this.accountInfo = undefined;
        this.authToken = undefined;
        this.authTokenExpiryDate = undefined;
    }

    public isLoggedIn(): boolean {
        if (this.accountInfo) {
            return true;
        }
        return false;
    }

    public getAuthToken(): string {
        if (!this.isLoggedIn()) {
            return undefined;
        }

        if (this.authTokenExpiryDate < new Date(Date.now() + (1 * minute))) {
            this.refreshToken();
        }
        return this.authToken;
    }

    public hasRole(role: string): boolean {
        if (!this.isLoggedIn()) {
            return undefined;
        }

        let userRoles = ((this.accountInfo.idTokenClaims as any).roles as String[])
        return userRoles.includes(role);
    }

    private initUserData() {
        let activeAccount = this.authService.instance.getActiveAccount();

        if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
            let accounts = this.authService.instance.getAllAccounts();
            activeAccount = accounts[0];
            this.authService.instance.setActiveAccount(activeAccount);
        }

        if (activeAccount) {
            this.accountInfo = activeAccount;
            this.refreshToken();
        }
    }

    private refreshToken(): void {
        if (this.isLoggedIn()) {
            // FIXME: Make this call synchronous somehow
            //of(
            this.authService.acquireTokenSilent({
                scopes: [],
            })
                .subscribe((response: AuthenticationResult) => {
                    this.authService.instance.setActiveAccount(response.account);
                    this.setUserInfo(response);
                }, (error: any) => {
                    console.log("Acquiring Token failed because of error: " + error);
                })
                //).toPromise()
                ;
        }
    }

    private setUserInfo(authResult: AuthenticationResult): void {
        if (authResult) {
            this.accountInfo = authResult.account;
            this.authToken = authResult.idToken
            this.authTokenExpiryDate = authResult.expiresOn;
        } else {
            this.accountInfo = null;
        }
    }

}