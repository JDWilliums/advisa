# Firebase Security Rules for Market Research

This document explains how to set up Firebase security rules for the Market Research functionality.

## Overview

The Market Research functionality requires read and write access to several Firestore collections:

- `competitors`: Stores competitor data
- `marketTrends`: Stores market trend data
- `marketOpportunities`: Stores market opportunity data
- `users/{userId}/savedReports`: Stores saved reports for each user

## Security Rules

Add the following rules to your Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own user data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow authenticated users to read and write their own saved reports
      match /savedReports/{reportId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Allow authenticated users to read competitor data
    match /competitors/{competitorId} {
      allow read: if request.auth != null;
      // Only allow writes from authenticated users with specific validation
      allow write: if request.auth != null && 
                    request.resource.data.name is string &&
                    request.resource.data.website is string &&
                    request.resource.data.industry is string;
    }
    
    // Allow authenticated users to read market trends
    match /marketTrends/{trendId} {
      allow read: if request.auth != null;
      // Only allow writes from authenticated users with specific validation
      allow write: if request.auth != null && 
                    request.resource.data.name is string &&
                    request.resource.data.description is string &&
                    request.resource.data.industry is string;
    }
    
    // Allow authenticated users to read market opportunities
    match /marketOpportunities/{opportunityId} {
      allow read: if request.auth != null;
      // Only allow writes from authenticated users with specific validation
      allow write: if request.auth != null && 
                    request.resource.data.opportunity is string &&
                    request.resource.data.description is string &&
                    request.resource.data.industry is string;
    }
  }
}
```

## How to Apply These Rules

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Firestore Database
4. Click on the "Rules" tab
5. Replace the existing rules with the rules above
6. Click "Publish"

## Testing the Rules

You can test these rules using the Firebase Rules Playground:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Firestore Database
4. Click on the "Rules" tab
5. Click "Rules Playground"
6. Create test cases for reading and writing to each collection

## Troubleshooting

If you encounter "Missing or insufficient permissions" errors:

1. Check that you're authenticated (signed in)
2. Verify that the security rules have been published
3. Ensure that your data structure matches the expected format in the rules
4. Check the Firebase console logs for more detailed error information

## Development Mode

During development, you can use more permissive rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // WARNING: These rules are for development only and should not be used in production
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**WARNING**: These development rules allow any authenticated user to read and write any document. Use only in development environments.

## Production Considerations

For production environments, consider adding additional security measures:

1. Rate limiting to prevent abuse
2. Data validation to ensure data integrity
3. Role-based access control for admin functions
4. Field-level security for sensitive data

## Further Reading

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Security Rules Cookbook](https://firebase.google.com/docs/firestore/security/rules-conditions)
- [Testing Security Rules](https://firebase.google.com/docs/firestore/security/test-rules) 