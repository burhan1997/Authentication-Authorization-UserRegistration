# Authentication

Authentication is the process of verifying the identity of a user, process, or device, to grant access to resources in a system. This process is critical for the security and privacy when multiple users share the same resource.

For example, when we want to withdraw cash from an ATM machine, we authenticate with our bank card and a 4-digit PIN code. After authentication, we enter a special screen personalized for our bank account, where we can only perform actions for that account. Because many users use the same ATM, it's important for such authentication to exist and work well. A failed authentication system may cause security breaches, such as allowing a user to withdraw money from a different bank account.

Authentication systems are complicated and are researched by many scholars and companies. In this section, we will provide you with the basics of how to implement authentication in your NodeJS application.

## Authentication vs Authorization

While Authentication allows us to verify the identity of a user, Authorization allows us to determine what resources this user is allowed to access.

For example, a user can be successfully authenticated by providing the correct username and password combination but with no access to the system. In this scenario, the user successfully passed the authentication process but still got rejected from using the system due to the lack of permissions.

In conclusion, authentication checks who you are, and authorization checks what you are allowed to do.

## Types of authentication

There are many ways of implementing authentication:

- Password authentication (e.g., email/password combination)
- Biometric authentication (e.g., fingerprints, face scan)
- Certificate-based authentication
- Hardware-based authentication (e.g., smart cards, NFC)

# User Registration

In order to build a multi-user application, it is essential to store and track a list of all the allowed users for the application. Additionally, implementing authentication and authorization is crucial.

- **Authentication System:** This system prevents users from impersonating others and performing actions as other users.
- **Authorization System:** This system prevents users from accessing resources they are not allowed to access.

## Registration Implementation

To track the list of users, a user database is commonly utilized. This database securely stores all the necessary information about each user required for the application, including authentication credentials such as passwords.

# Suggestions for Improving the Registration Endpoint

1. **Add Random User ID**:
   - Incorporate a random user ID into the user object using the uuid library or crypto.randomUUID() function.

2. **Persist User Database**:
   - Implement saving the user database into a JSON file using the File System module to prevent data loss upon application termination.

3. **Enhance isValidUser Function**:
   - Improve the isValidUser function to include checks for email validity, minimum password length, and existing username in the user database.

4. **Create HTML Client**:
   - Develop an HTML client with a registration form and utilize fetch to send POST requests for user registration.
