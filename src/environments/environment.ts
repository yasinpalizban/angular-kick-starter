// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  baseUrl: 'http://localhost:3000/api/',
  siteUrl: 'http://localhost:3000/',
  siteAddress: {
    one: 'http://localhost:4200',
    two: 'http://localhost:4200',
  },
  logger: true,
  pusher: {
    key: '3bf76050d243c21ee0ce',
    cluster: 'ap2',
  },
  captcha: {
    siteKey: '6LdiKdQUAAAAAAbkUBRIhTfxx4Ylpjg-r69sqQ56',
    secretKey: '6LdiKdQUAAAAAHeEgN84MOFHEeScAl0C4dTEOOZJ',
  },

  socialMedia: {
    google: {
      clientId: '985186487834-d4gntkqq1d53gf3ijbap5mpmobm0f5lr.apps.googleusercontent.com',
      clientSecret: 'pERt1Rw87j2PeJAcvG78R99w'
    },
    facebook: {
      clientId: '',
      clientSecret: ''
    },
    instagram: {
      clientId: '',
      clientSecret: ''
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
