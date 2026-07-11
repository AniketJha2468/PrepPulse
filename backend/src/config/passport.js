const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: GitHubStrategy } = require('passport-github2');

const User = require('../models/User');
const env = require('./env');
const { AUTH_PROVIDERS } = require('../constants/authProviders.constants');

const findOrCreateOAuthUser = async ({ provider, providerId, email, fullName, avatarUrl }) => {
  const existingProviderUser = await User.findOne({ authProvider: provider, providerId });
  if (existingProviderUser) {
    return existingProviderUser;
  }

  if (email) {
    const existingEmailUser = await User.findOne({ email: email.toLowerCase() });
    if (existingEmailUser) {
      const conflictError = new Error(
        'An account with this email already exists using a different sign-in method.'
      );
      conflictError.isOAuthConflict = true;
      throw conflictError;
    }
  }

  return User.create({
    fullName: fullName || 'PrepPulse User',
    email,
    authProvider: provider,
    providerId,
    avatarUrl: avatarUrl || null,
    isEmailVerified: true,
  });
};

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: env.GOOGLE_CLIENT_ID,
//       clientSecret: env.GOOGLE_CLIENT_SECRET,
//       callbackURL: env.GOOGLE_CALLBACK_URL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
//         const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

//         const user = await findOrCreateOAuthUser({
//           provider: AUTH_PROVIDERS.GOOGLE,
//           providerId: profile.id,
//           email,
//           fullName: profile.displayName,
//           avatarUrl,
//         });

//         return done(null, user);
//       } catch (error) {
//         if (error.isOAuthConflict) {
//           return done(null, false, { message: error.message });
//         }
//         return done(error);
//       }
//     }
//   )
// );

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: env.GITHUB_CLIENT_ID,
//       clientSecret: env.GITHUB_CLIENT_SECRET,
//       callbackURL: env.GITHUB_CALLBACK_URL,
//       scope: ['user:email'],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const primaryEmail =
//           profile.emails && profile.emails[0] ? profile.emails[0].value : null;
//         const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

//         const user = await findOrCreateOAuthUser({
//           provider: AUTH_PROVIDERS.GITHUB,
//           providerId: String(profile.id),
//           email: primaryEmail,
//           fullName: profile.displayName || profile.username,
//           avatarUrl,
//         });

//         return done(null, user);
//       } catch (error) {
//         if (error.isOAuthConflict) {
//           return done(null, false, { message: error.message });
//         }
//         return done(error);
//       }
//     }
//   )
// );

module.exports = passport;
