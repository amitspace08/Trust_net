export interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  avatar: string;
  online: boolean;
  status: "Active" | "Inactive";
  at: number;
  // Location sharing properties
  shareLocation: boolean;
  lastUpdated: string;
  distance: string;
  latitude: number;
  longitude: number;
}

export interface ContactRequest {
  id: string;
  name: string;
  phone: string;
  relation: string;
  avatar: string;
  online: boolean;
  type: "incoming" | "outgoing";
  status: "Pending" | "Accepted" | "Rejected";
  at: number;
}

// Complete mock user directory with location details
export const MOCK_USER_DIRECTORY = [
  {
    name: "Mom",
    phone: "+1 (555) 012-3456",
    relation: "Family",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiQElO-UMyGEASHYNtlKiY2V8wSQC7vzZ9fMK06sQGomHuEuqyMVCDiTN6MH5TXHCtjFXXbR7OOH5MFbq_wF-GdjwhfTO_v1RzsBpu76Cfubg8BV_UlYknOutPmLxoi6WMUDKGryKolfqL-iWNPCltt1PnVxAYjJMlg4lLLPR4iF7BTAM0CgJRW4VvCQERaQVoqRnJ8A53NoX6zH_zvwNRWjFnk6RmrsWSSi3xd4NZ-ISqWEJdWm8TrtEWOxJbxG7WdzKeO5E-QkNc",
    online: true,
    shareLocation: true,
    lastUpdated: "2 mins ago",
    distance: "0.8 km",
    latitude: 12.974,
    longitude: 77.591,
  },
  {
    name: "Riya",
    phone: "+1 (555) 987-6543",
    relation: "Friend",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA8Fk8OzxEG0bBzVgPeewMDP75pPjhy6jJ2MsBqCHkJfuXUvT71nTGR3phzeH3hj-70poLiXJKnj-sIX_b_2pLTRo17YooMxXiFnKj-gJ_aivhSGpP2VYfL5BMvWZHx7C64I0sUmHc3hSTJSPnca2tvMKiUaQE0xbpYz2mM16cEYC55o-H-IxlElcFAeNNKjOFFefgwdEW5ep_hp5bqKi5kBcAj7AB71dDwKql9f002IPouhr9WH4UDdMXh5zFnOrmrqXcEz38yxPAp",
    online: true,
    shareLocation: true,
    lastUpdated: "5 mins ago",
    distance: "1.5 km",
    latitude: 12.968,
    longitude: 77.604,
  },
  {
    name: "Arjun",
    phone: "+1 (555) 456-7890",
    relation: "Colleague",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuACfjmYlU8iii7s7LSbJSHv5rNHFTq8s5ueejb8WApJ4UJAG1DJcBIm5jvGlGCsfXMERiUSg06hIP9l7xxQCHqUmwTtV-K3Yvcke2jBbdmFXPCz7GgagQxecialWRuVNCZMk3R7LnAMmUHkZaOgZ--WF1-iwsbzqKfmjq0JjaZ5l4ySiP6631z2YZD8headhQ9tdTvA3rvRkiOPAicDDaHBhc5fTM-YP-im6sQbdLpADTo7aYyOVKPuVBQhCXd0BozbWa-BH6Rtk17t",
    online: false,
    shareLocation: false, // Disallowed sharing
    lastUpdated: "3 hours ago",
    distance: "4.2 km",
    latitude: 12.985,
    longitude: 77.585,
  },
  {
    name: "Neha",
    phone: "+1 (555) 111-2222",
    relation: "Friend",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCz7NXTobBoxZS1LdenK3OFVM6-ycj1Al0vdt_05W4mAnVc1HKeAU5X0wjI4mOW_96iJATXDwzN-KX96CFeKDO8aO5kU1HyKVdYegXeE9YTmQb2Kix9oUmHDQEHhucM6cypQ8UlakJgcpMGTHzXNQkEjTfm_AzkyYwrEfI9Smfr9IQDRqdex7Wv-1va9Yfj7UROZo-uWN3zTHBjlrZ-dZeQpt1dseQjejo3DphHZV9e69BUGJ_0bUb_2zzgaycMWMNkgSGKmHcq05Zn",
    online: true,
    shareLocation: true,
    lastUpdated: "Just now",
    distance: "2.1 km",
    latitude: 12.979,
    longitude: 77.601,
  },
  {
    name: "Amit Patel",
    phone: "+1 (555) 333-4444",
    relation: "Neighbor",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBqKJau6jwMTr6vH6d26Tv1qITburRYz5wRShmY_rp2XWgZwlsXLRNIMprBXGfg3xXzitKpE8W2f0CTQ_ss8J8V3-COU8_KlfOYetVtYGoaBJnVUDQ7arjALd787_L-ETvHWv0IlhC1cftMJATFEEdl-pBEpD_J-CsOsIIocB9dBKBtkWT0RY_cWs4igh9MPAc2YdebZYLyTGZ_HdlZGrzFjMEEScMjznDRa28mL86-k4hoZRkAtLYj7rT4-xIsyoM3yronrBklG06K",
    online: true,
    shareLocation: true,
    lastUpdated: "12 mins ago",
    distance: "3.0 km",
    latitude: 12.962,
    longitude: 77.589,
  },
  {
    name: "Rahul Sharma",
    phone: "+1 (555) 123-4567",
    relation: "Friend",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBqKJau6jwMTr6vH6d26Tv1qITburRYz5wRShmY_rp2XWgZwlsXLRNIMprBXGfg3xXzitKpE8W2f0CTQ_ss8J8V3-COU8_KlfOYetVtYGoaBJnVUDQ7arjALd787_L-ETvHWv0IlhC1cftMJATFEEdl-pBEpD_J-CsOsIIocB9dBKBtkWT0RY_cWs4igh9MPAc2YdebZYLyTGZ_HdlZGrzFjMEEScMjznDRa28mL86-k4hoZRkAtLYj7rT4-xIsyoM3yronrBklG06K",
    online: true,
    shareLocation: true,
    lastUpdated: "1 min ago",
    distance: "2.4 km",
    latitude: 12.963,
    longitude: 77.599,
  },
  {
    name: "Sara Jones",
    phone: "+1 (555) 765-4321",
    relation: "Colleague",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCz7NXTobBoxZS1LdenK3OFVM6-ycj1Al0vdt_05W4mAnVc1HKeAU5X0wjI4mOW_96iJATXDwzN-KX96CFeKDO8aO5kU1HyKVdYegXeE9YTmQb2Kix9oUmHDQEHhucM6cypQ8UlakJgcpMGTHzXNQkEjTfm_AzkyYwrEfI9Smfr9IQDRqdex7Wv-1va9Yfj7UROZo-uWN3zTHBjlrZ-dZeQpt1dseQjejo3DphHZV9e69BUGJ_0bUb_2zzgaycMWMNkgSGKmHcq05Zn",
    online: false,
    shareLocation: false,
    lastUpdated: "5 hours ago",
    distance: "5.1 km",
    latitude: 12.98,
    longitude: 77.61,
  },
];

const CONTACTS_KEY = "trustnet_contacts_v2";
const REQUESTS_KEY = "trustnet_requests_v2";

export function loadContacts(): Contact[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CONTACTS_KEY);
    if (!raw) {
      // Seed default contacts to match wireframe
      const defaults: Contact[] = [
        {
          id: "mom",
          name: "Mom",
          phone: "+1 (555) 012-3456",
          relation: "Family",
          avatar: MOCK_USER_DIRECTORY[0].avatar,
          online: true,
          status: "Active",
          at: Date.now(),
          shareLocation: true,
          lastUpdated: "2 mins ago",
          distance: "0.8 km",
          latitude: MOCK_USER_DIRECTORY[0].latitude,
          longitude: MOCK_USER_DIRECTORY[0].longitude,
        },
        {
          id: "riya",
          name: "Riya",
          phone: "+1 (555) 987-6543",
          relation: "Friend",
          avatar: MOCK_USER_DIRECTORY[1].avatar,
          online: true,
          status: "Active",
          at: Date.now(),
          shareLocation: true,
          lastUpdated: "5 mins ago",
          distance: "1.5 km",
          latitude: MOCK_USER_DIRECTORY[1].latitude,
          longitude: MOCK_USER_DIRECTORY[1].longitude,
        },
        {
          id: "arjun",
          name: "Arjun",
          phone: "+1 (555) 456-7890",
          relation: "Colleague",
          avatar: MOCK_USER_DIRECTORY[2].avatar,
          online: false,
          status: "Inactive",
          at: Date.now(),
          shareLocation: false,
          lastUpdated: "3 hours ago",
          distance: "4.2 km",
          latitude: MOCK_USER_DIRECTORY[2].latitude,
          longitude: MOCK_USER_DIRECTORY[2].longitude,
        },
      ];
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(defaults));
      return defaults;
    }
    const parsed = JSON.parse(raw) as Contact[];
    let updated = false;
    const migrated = parsed.map((c) => {
      const dir = MOCK_USER_DIRECTORY.find((u) => u.phone === c.phone);
      const shareLoc =
        c.shareLocation !== undefined
          ? c.shareLocation
          : dir
            ? dir.shareLocation
            : c.status === "Active";
      const lastUp = c.lastUpdated || (dir ? dir.lastUpdated : "Just now");
      const dist = c.distance || (dir ? dir.distance : "1.0 km");
      const lat = c.latitude !== undefined ? c.latitude : dir ? dir.latitude : 12.9716;
      const lng = c.longitude !== undefined ? c.longitude : dir ? dir.longitude : 77.5946;

      if (
        c.shareLocation === undefined ||
        !c.lastUpdated ||
        !c.distance ||
        c.latitude === undefined ||
        c.longitude === undefined
      ) {
        updated = true;
        return {
          ...c,
          shareLocation: shareLoc,
          lastUpdated: lastUp,
          distance: dist,
          latitude: lat,
          longitude: lng,
        };
      }
      return c;
    });

    if (updated) {
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(migrated));
    }
    return migrated;
  } catch {
    return [];
  }
}

export function saveContacts(contacts: Contact[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

export function loadRequests(): ContactRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    if (!raw) {
      // Seed default requests to match wireframe
      const defaults: ContactRequest[] = [
        {
          id: "neha-req",
          name: "Neha",
          phone: "+1 (555) 111-2222",
          relation: "Friend",
          avatar: MOCK_USER_DIRECTORY[3].avatar,
          online: true,
          type: "outgoing",
          status: "Pending",
          at: Date.now(),
        },
        {
          id: "amit-req",
          name: "Amit Patel",
          phone: "+1 (555) 333-4444",
          relation: "Neighbor",
          avatar: MOCK_USER_DIRECTORY[4].avatar,
          online: true,
          type: "incoming",
          status: "Pending",
          at: Date.now(),
        },
      ];
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveRequests(requests: ContactRequest[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

export interface Layer2Candidate {
  id: string;
  name: string;
  phone: string;
  relation: string;
  avatar: string;
  online: boolean;
  distance: string;
  mutualContact: string;
}

// Social trust graph mapping Layer 1 contact phones to their friends' phones
export const MOCK_SOCIAL_GRAPH: Record<string, string[]> = {
  "+1 (555) 012-3456": [], // Mom
  "+1 (555) 987-6543": ["+1 (555) 123-4567"], // Riya knows Rahul Sharma
  "+1 (555) 456-7890": ["+1 (555) 765-4321"], // Arjun knows Sara Jones
};

// Returns deduplicated and proximity-sorted second degree connections
export function getLayer2Candidates(): Layer2Candidate[] {
  const contacts = loadContacts(); // Priya's Layer 1 contacts
  const candidatesMap = new Map<string, Layer2Candidate>();

  contacts.forEach((c) => {
    // If the contact is active (meaning they are in Priya's L1 circle)
    if (c.status === "Active") {
      const friendsList = MOCK_SOCIAL_GRAPH[c.phone] || [];
      friendsList.forEach((friendPhone) => {
        // Exclude Priya herself (we don't alert the distressed user) and direct L1 contacts
        const isDirect = contacts.some((dir) => dir.phone === friendPhone);
        if (isDirect) return;

        // Check if the user exists in the main directory
        const dirUser = MOCK_USER_DIRECTORY.find((u) => u.phone === friendPhone);
        if (dirUser && !candidatesMap.has(friendPhone)) {
          candidatesMap.set(friendPhone, {
            id: dirUser.phone.replace(/[^0-9]/g, ""),
            name: dirUser.name,
            phone: dirUser.phone,
            relation: dirUser.relation,
            avatar: dirUser.avatar,
            online: dirUser.online,
            distance: dirUser.distance || "1.5 km",
            mutualContact: c.name, // e.g., "Riya"
          });
        }
      });
    }
  });

  return Array.from(candidatesMap.values());
}
