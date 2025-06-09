import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthWrapperService } from '../../service/auth-wrapper.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  standalone: true,
  imports: [MatCardModule, MatButtonModule, FontAwesomeModule],
})
export class SignInComponent {
  private apiUrl = 'http://localhost:5235/api/auth';
  faGoogle = faGoogle;
  faFacebook = faFacebook;
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authWrapper: AuthWrapperService
  ) {}

  signInWithGoogle() {
    console.log('Initiating Google Sign-In with Popup');
    this.authService
      .loginWithPopup({
        authorizationParams: {
          connection: 'google-oauth2',
          scope: 'openid profile email',
          audience: 'http://localhost:5235',
        },
      })
      .subscribe({
        next: () => {
          console.log('Popup login successful');
          this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
            console.log('isAuthenticated:', isAuthenticated);
            if (isAuthenticated) {
              this.authService.user$.subscribe((user) => {
                console.log('User:', user);
                if (user && user.sub) {
                  this.authService.idTokenClaims$.subscribe((claims) => {
                    const idToken = claims?.__raw;
                    if (idToken) {
                      this.http
                        .post<{ token: string }>(
                          `${this.apiUrl}/external-login-callback`,
                          { idToken }
                        )
                        .subscribe({
                          next: (response) => {
                            localStorage.setItem('jwt_token', response.token);
                            this.authWrapper.checkAuthStatus();
                            this.router.navigate(['/employee-list']);
                          },
                          error: (error) => {
                            console.error(
                              'Backend authentication error:',
                              error
                            );
                          },
                        });
                    }
                  });
                } else {
                  console.error('User or user.sub is undefined');
                }
              });
            } else {
              console.log('User is not authenticated');
            }
          });
        },
        error: (err) => {
          console.error('Popup login error:', err);
          console.error('Error details:', err.message, err.stack);
        },
      });
  }

  // signInWithFacebook() {
  //   console.log('Initiating Facebook Sign-In with Popup');
  //   this.authService
  //     .loginWithPopup({
  //       authorizationParams: {
  //         connection: 'facebook',
  //         scope: 'openid profile email',
  //         audience: 'http://localhost:5235', // match your backend API audience
  //       },
  //     })
  //     .subscribe({
  //       next: () => {
  //         console.log('Facebook popup login successful');
  //         this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
  //           if (isAuthenticated) {
  //             this.authService.user$.subscribe((user) => {
  //               const accessToken = user?.['https://dev-8v7vvlbu53evh5jt.us.auth0.com/facebook_access_token'];
  //               console.log('Access token from user metadata:', accessToken);
  //               console.log('Facebook User:', user);
  //               if (user && user.sub) {
  //                 this.authService.idTokenClaims$.subscribe((claims) => {
  //                   const idToken = claims?.__raw;
  //                   if (idToken) {
  //                     this.http
  //                       .post<{ token: string }>(
  //                         `${this.apiUrl}/facebook-token`,
  //                         { idToken : idToken }
  //                       )
  //                       .subscribe({
  //                         next: (response) => {
  //                           localStorage.setItem('jwt_token', response.token);
  //                           this.authWrapper.checkAuthStatus();
  //                           this.router.navigate(['/employee-list']);
  //                         },
  //                         error: (error) => {
  //                           console.error(
  //                             'Backend authentication error:',
  //                             error
  //                           );
  //                         },
  //                       });
  //                   }
  //                 });
  //               } else {
  //                 console.error('User or user.sub is undefined');
  //               }
  //             });
  //           } else {
  //             console.log('User is not authenticated');
  //           }
  //         });
  //       },
  //       error: (err) => {
  //         console.error('Facebook popup login error:', err);
  //       },
  //     });
  // }
  signInWithFacebook() {
    console.log('Initiating Facebook Sign-In with Popup');
    this.authService
      .loginWithPopup({
        authorizationParams: {
          connection: 'facebook',
          scope: 'openid profile email',
          audience: 'http://localhost:5235', // match your backend API audience
        },
      })
      .subscribe({
        next: () => {
          console.log('Facebook popup login successful');
          this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
            if (isAuthenticated) {
              this.authService.user$.subscribe((user) => {
                console.log('Facebook User:', user);

                // Get the ID token
                this.authService.idTokenClaims$.subscribe((claims) => {
                  if (claims) {
                    const idToken = claims?.__raw;

                    // Extract Facebook access token from user metadata
                    const facebookAccessToken =
                      user?.[
                        'https://dev-8v7vvlbu53evh5jt.us.auth0.com/facebook_access_token'
                      ];
                    console.log(
                      'Facebook access token from user metadata:',
                      facebookAccessToken
                    );

                    // Option 1: Send the Auth0 ID token
                    this.http
                      .post<{ token: string }>(
                        `${this.apiUrl}/facebook-token`,
                        { idToken: idToken }
                      )
                      .subscribe({
                        next: (response) => {
                          localStorage.setItem('jwt_token', response.token);
                          this.authWrapper.checkAuthStatus();
                          this.router.navigate(['/employee-list']);
                        },
                        error: (error) => {
                          console.error('Backend authentication error:', error);

                          // If using option 2, uncomment this part and comment out the above post
                          /*
                        // Option 2: Send the Facebook access token directly
                        if (facebookAccessToken) {
                          this.http
                            .post<{ token: string }>(
                              `${this.apiUrl}/facebook-token`,
                              { idToken: facebookAccessToken }
                            )
                            .subscribe({
                              next: (response) => {
                                localStorage.setItem('jwt_token', response.token);
                                this.authWrapper.checkAuthStatus();
                                this.router.navigate(['/employee-list']);
                              },
                              error: (err) => {
                                console.error('Backend authentication with Facebook token error:', err);
                              },
                            });
                        } else {
                          console.error('Facebook access token not available');
                        }
                        */
                        },
                      });
                  }
                });
              });
            } else {
              console.log('User is not authenticated');
            }
          });
        },
        error: (err) => {
          console.error('Facebook popup login error:', err);
        },
      });
  }
}
