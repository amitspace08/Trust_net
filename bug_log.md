# TrustNet Bug Log & Resolution Status

This document logs all identified bugs and their resolution status for S3 (Maps & Location) and S4 (Features & Integration) tracks.

## Resolved Bugs

### 1. Firestore Security Rules Permission Denied on Termination / Layer 2 Creation
- **Bug**: The security rules for `active_layer2_alerts` only allowed reads/writes if `resource.data.receiverUID == request.auth.uid`. Since the creator (distressed user) is not the receiver, they were blocked from creating Layer 2 alerts, and blocked from deleting them when ending/cancelling the SOS.
- **Resolution**: Updated `firestore.rules` to allow both the receiver and the creator of the corresponding SOS session to read, create, update, and delete alerts.

### 2. Accidental Shadowing of User Variable in Map Markers
- **Bug**: In `src/components/ui/Map.tsx`, `users.filter((user) => ...)` shadowed the outer `user` object from `useAuth()`. As a result, the check `user.id !== user?.id` compared the contact to itself (always false), causing all trusted contact pins to be hidden.
- **Resolution**: Renamed the callback parameter to `u` so that `user?.id` correctly references the logged-in user, restoring Layer 1 trusted contact pins.

### 3. Local Storage Sync Loop / Incomplete Cancellation Cleanup
- **Bug**: If a cleanup action inside `endSOS` or `cancelSOS` failed, the exception crashed the function, leaving `trustnet_active_sos_session` in `localStorage`. The page was stuck in the active state.
- **Resolution**: Wrapped all auxiliary cleanup calls in separate try-catch blocks in `sosService.ts` and ensured that the double-tap handler always removes `localStorage` keys and transitions states, regardless of API errors.

### 4. Missing Profile Location Synchronization
- **Bug**: Turning location sharing ON in the Profile page only wrote to `localStorage` and never updated Firestore.
- **Resolution**: Updated `toggleLocationSharing` in `profile.tsx` to get current coordinates and write `sharingEnabled: true` and location to Firestore when toggled ON.

### 5. Static Simulated Map & Movement on Responder Page
- **Bug**: The SOS receiver page used hardcoded percentages and step animations, completely disconnected from real distressed-user coordinates.
- **Resolution**: Implemented continuous responder geolocation watching, real-time Haversine distance/ETA calculations, and a viewport bounding box mapping system that dynamically renders the pins and dashed route line based on exact GPS coordinates.

### 6. Missing Out-of-App Session Restoration
- **Bug**: Logging in/out did not authenticate with Firebase Auth, failing all rules requiring `request.auth != null`.
- **Resolution**: Integrated Firebase Auth `signInWithEmailAndPassword` and `createUserWithEmailAndPassword` with automatic anonymous login fallback into the `AuthProvider`.

## Verification Status
- **Typechecking**: `npx tsc --noEmit` completed with **0 errors**.
- **Real-Time Synchronizations**: Hooked up onSnapshot listeners for the Trust Circle and Outgoing/Incoming requests, eliminating mock data.
