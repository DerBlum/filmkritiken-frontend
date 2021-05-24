import { Injectable } from "@angular/core";
import { MsalBroadcastService, MsalService } from "@azure/msal-angular";
import { AuthenticationResult, EndSessionRequest, InteractionStatus } from "@azure/msal-browser";
import { AccountInfo } from "@azure/msal-common";
import { from, Observable, of, PartialObserver, Subject } from "rxjs";
import { catchError, filter, map, take, takeUntil } from "rxjs/operators";

var minute: 60_000;

@Injectable()
export class UserService {

    private readonly _destroying$ = new Subject<void>();

    private accountInfo: AccountInfo;
    private authToken: String;
    private authTokenExpiryDate: Date;

    private loginChanged = new Subject<boolean>();

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
                this.onLoginFinished(response);
            });
    }

    public logout(): void {
        localStorage.clear();
        this.onLogout();
    }

    public isLoggedIn(): boolean {
        if (this.accountInfo) {
            return true;
        }
        return false;
    }

    public subscribeToLoginState(observer: PartialObserver<boolean>) {
        this.loginChanged.subscribe(observer);
    }

    public getAuthToken(): Observable<String> {
        if (!this.isLoggedIn()) {
            return of(undefined);
        }

        if (!this.authToken || this.authTokenExpiryDate < new Date(Date.now() + (1 * minute))) {
            return this.refreshToken();
        }
        return of(this.authToken);
    }

    public hasRole(role: String): boolean {
        if (!this.isLoggedIn()) {
            return undefined;
        }

        let userRoles = ((this.accountInfo.idTokenClaims as any).roles as String[]);
        return userRoles.includes(role);
    }

    public getUsername(): string {
        return this.accountInfo?.name;
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
        }
    }

    private refreshToken(): Observable<String> {

        if (this.isLoggedIn()) {
            return from(this.authService.instance.acquireTokenSilent({
                scopes: []
            })).pipe(
                take(1),
                map(authResult => {
                    this.onLoginFinished(authResult);
                    return this.authToken;
                }),
                catchError(error => {
                    console.log("Acquiring Token failed because of error: " + error);
                    this.onLogout();
                    this.loginViaPopup();
                    return of(undefined);
                })
            );
        }

        return of(undefined)
    }

    private onLoginFinished(authResult: AuthenticationResult): void {
        this.authService.instance.setActiveAccount(authResult.account);
        this.setUserInfo(authResult);
        this.loginChanged.next(true);
    }

    private onLogout(): void {
        this.setUserInfo(undefined);
        this.loginChanged.next(false);
    }

    private setUserInfo(authResult: AuthenticationResult): void {
        if (authResult) {
            this.accountInfo = authResult.account;
            this.authToken = authResult.idToken
            this.authTokenExpiryDate = authResult.expiresOn;
        } else {
            this.accountInfo = undefined;
            this.authToken = undefined;
            this.authTokenExpiryDate = undefined;
        }
    }

}