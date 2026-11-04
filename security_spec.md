# Security Specification for THEBHIMSENART Firestore Rules

## 1. Data Invariants
- **Inquiry Creation**: Anyone (including unauthenticated public visitors) can create an inquiry in `/inquiries/{inquiryId}` provided `inquiryId` is a valid alphanumeric ID (`<= 128` chars), the payload strictly contains `['name', 'email', 'brand', 'subject', 'message', 'read', 'createdAt']`, `read == false`, `createdAt == request.time`, and all strings respect strict length bounds (`name <= 120`, `email <= 200`, `brand <= 150`, `subject <= 200`, `message <= 4000`).
- **Inquiry Reading & Management**: Only verified admins (`isAdmin()`) or internal admin collection checks may read, update (`read` status), or delete inquiries, protecting customer PII (`email`, `name`, `message`). However, to allow the Artist Portal to read and manage inquiries seamlessly when logged into the Artist Portal or via Google Auth (`deveshshinde04@gmail.com` / `artbyganesh2002@gmail.com`), we also provide secure rules.
- **Artwork Catalog**: Public visitors can read published artworks (`resource.data.status == 'published'`), and admins can create, update, or delete artworks.

## 2. The "Dirty Dozen" Payloads
1. **Shadow Field Injection on Inquiry**: `{ name: "A", email: "a@b.com", brand: "", subject: "S", message: "M", read: false, createdAt: SERVER_TIMESTAMP, isAdmin: true }` -> Rejected by `hasOnly()`.
2. **Pre-Read Inquiry Spoof**: `{ name: "A", email: "a@b.com", brand: "", subject: "S", message: "M", read: true, createdAt: SERVER_TIMESTAMP }` -> Rejected because `read == false` is required on create.
3. **Forged Timestamp on Inquiry**: `{ name: "A", email: "a@b.com", brand: "", subject: "S", message: "M", read: false, createdAt: "2020-01-01" }` -> Rejected by `incoming().createdAt == request.time`.
4. **Denial-of-Wallet 1MB Message**: `{ name: "A", email: "a@b.com", brand: "", subject: "S", message: "A".repeat(10000), read: false, createdAt: SERVER_TIMESTAMP }` -> Rejected by `message.size() <= 4000`.
5. **ID Poisoning on Inquiry**: Creating `/inquiries/invalid$id!@#` -> Rejected by `isValidId(inquiryId)`.
6. **Immutable Field Mutation on Inquiry Update**: Updating `email` or `message` on an existing inquiry -> Rejected by `affectedKeys().hasOnly(['read'])` and immutability checks.
7. **Value Poisoning on Inquiry Update**: Updating `read` to `"yes"` (string instead of bool) -> Rejected by `isValidInquiry(incoming())`.
8. **Shadow Field on Artwork Create**: Adding `hacked: true` to `/artworks/{artworkId}` -> Rejected by `hasOnly()`.
9. **Unbounded Tags Array on Artwork**: Passing 50 tags to `tags` array -> Rejected by `tags.size() <= 10`.
10. **Invalid Status Enum on Artwork**: Setting `status: "archived"` -> Rejected by `status in ['published', 'draft']`.
11. **Negative Views/Likes Count**: Setting `viewsCount: -5` -> Rejected by `viewsCount >= 0`.
12. **Path Traversal / Unknown Collection Write**: Writing to `/unknown_collection/doc1` -> Rejected by global default-deny `match /{document=**} { allow read, write: if false; }`.
