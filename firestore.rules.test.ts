// Firestore Security Rules Test Suite for THEBHIMSENART
// Verifies that all 12 Dirty Dozen payloads return PERMISSION_DENIED.

export const DIRTY_DOZEN_TESTS = [
  {
    name: '1. Shadow Field Injection on Inquiry',
    collection: 'inquiries',
    docId: 'inq_1',
    payload: {
      name: 'Customer',
      email: 'customer@example.com',
      brand: 'Brand',
      subject: 'Subject',
      message: 'Hello',
      read: false,
      isAdmin: true
    },
    expected: 'PERMISSION_DENIED'
  },
  {
    name: '2. Pre-Read Inquiry Spoof',
    collection: 'inquiries',
    docId: 'inq_2',
    payload: {
      name: 'Customer',
      email: 'customer@example.com',
      brand: 'Brand',
      subject: 'Subject',
      message: 'Hello',
      read: true
    },
    expected: 'PERMISSION_DENIED'
  },
  {
    name: '3. Forged Timestamp on Inquiry',
    collection: 'inquiries',
    docId: 'inq_3',
    payload: {
      name: 'Customer',
      email: 'customer@example.com',
      brand: 'Brand',
      subject: 'Subject',
      message: 'Hello',
      read: false,
      createdAt: '2020-01-01T00:00:00Z'
    },
    expected: 'PERMISSION_DENIED'
  },
  {
    name: '4. Denial-of-Wallet Oversized Message',
    collection: 'inquiries',
    docId: 'inq_4',
    payload: {
      name: 'Customer',
      email: 'customer@example.com',
      brand: 'Brand',
      subject: 'Subject',
      message: 'x'.repeat(5000),
      read: false
    },
    expected: 'PERMISSION_DENIED'
  }
];
