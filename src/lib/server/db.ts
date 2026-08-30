import { User, UserRole } from "@/lib/types";

export interface ServerUser extends User {
  passwordHash: string;
}

// Pre-computed bcrypt hash for seed club initial password "terra@2026"
// Generated using bcrypt (salt rounds: 10)
const DEFAULT_SEED_PASSWORD_HASH = "$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.";

// Server-side user database
const serverUsers: ServerUser[] = [
  // --- EXECUTIVE COMMITTEE (EXCOMM) ---
  {
    id: "user-swayam",
    username: "swayam",
    passwordHash: DEFAULT_SEED_PASSWORD_HASH,
    email: "swayam@terra.club",
    name: "TM Swayam",
    role: "admin",
    executiveTitle: "Vice President Education & System Administrator",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Swayam",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-aadhya",
    username: "aadhya",
    passwordHash: DEFAULT_SEED_PASSWORD_HASH,
    email: "aadhya@terra.club",
    name: "TM Aadhya",
    role: "officer",
    executiveTitle: "Club President",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Aadhya",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-rohit",
    username: "rohit",
    passwordHash: DEFAULT_SEED_PASSWORD_HASH,
    email: "rohit@terra.club",
    name: "TM Rohit",
    role: "officer",
    executiveTitle: "Immediate Past President",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Rohit",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-samarth",
    username: "samarth",
    passwordHash: DEFAULT_SEED_PASSWORD_HASH,
    email: "samarth@terra.club",
    name: "TM Samarth",
    role: "officer",
    executiveTitle: "Vice President Membership",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Samarth",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-sanchana",
    username: "sanchana",
    passwordHash: DEFAULT_SEED_PASSWORD_HASH,
    email: "sanchana@terra.club",
    name: "TM Sanchana",
    role: "officer",
    executiveTitle: "Vice President Public Relations",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Sanchana",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-malavika",
    username: "malavika",
    passwordHash: DEFAULT_SEED_PASSWORD_HASH,
    email: "malavika@terra.club",
    name: "TM Malavika",
    role: "officer",
    executiveTitle: "Club Secretary",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Malavika",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-gabria",
    username: "gabria",
    passwordHash: DEFAULT_SEED_PASSWORD_HASH,
    email: "gabria@terra.club",
    name: "TM Gabria",
    role: "officer",
    executiveTitle: "Club Treasurer",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Gabria",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-kavya",
    username: "kavya",
    passwordHash: DEFAULT_SEED_PASSWORD_HASH,
    email: "kavya@terra.club",
    name: "TM Kavya",
    role: "officer",
    executiveTitle: "Sergeant at Arms",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Kavya",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },

  // --- CLUB MEMBERS ---
  {
    id: "user-prarthna",
    username: "prarthna",
    passwordHash: DEFAULT_SEED_PASSWORD_HASH,
    email: "prarthna@terra.club",
    name: "TM Prarthna",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Prarthna",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-gautami",
    username: "gautami",
    passwordHash: DEFAULT_SEED_PASSWORD_HASH,
    email: "gautami@terra.club",
    name: "TM Gautami",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Gautami",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-mayur",
    username: "mayur",
    passwordHash: DEFAULT_SEED_PASSWORD_HASH,
    email: "mayur@terra.club",
    name: "TM Mayur",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Mayur",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-suyash",
    username: "suyash",
    passwordHash: DEFAULT_SEED_PASSWORD_HASH,
    email: "suyash@terra.club",
    name: "TM Suyash",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Suyash",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-sangeeth",
    username: "sangeeth",
    passwordHash: DEFAULT_SEED_PASSWORD_HASH,
    email: "sangeeth@terra.club",
    name: "TM Sangeeth",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Sangeeth",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-krishnameet",
    username: "krishnameet",
    passwordHash: DEFAULT_SEED_PASSWORD_HASH,
    email: "krishnameet@terra.club",
    name: "TM Krishnameet",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Krishnameet",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-hemal",
    username: "hemal",
    passwordHash: DEFAULT_SEED_PASSWORD_HASH,
    email: "hemal@terra.club",
    name: "TM Hemal",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Hemal",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-smiyra",
    username: "smiyra",
    passwordHash: DEFAULT_SEED_PASSWORD_HASH,
    email: "smiyra@terra.club",
    name: "TM Smiyra",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Smiyra",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-makshita",
    username: "makshita",
    passwordHash: DEFAULT_SEED_PASSWORD_HASH,
    email: "makshita@terra.club",
    name: "TM Makshita",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Makshita",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-evelyn",
    username: "evelyn",
    passwordHash: DEFAULT_SEED_PASSWORD_HASH,
    email: "evelyn@terra.club",
    name: "TM Evelyn",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Evelyn",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-pavitra",
    username: "pavitra",
    passwordHash: DEFAULT_SEED_PASSWORD_HASH,
    email: "pavitra@terra.club",
    name: "TM Pavitra",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Pavitra",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
  {
    id: "user-devanuj",
    username: "devanuj",
    passwordHash: DEFAULT_SEED_PASSWORD_HASH,
    email: "devanuj@terra.club",
    name: "TM Devanuj",
    role: "member",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TM%20Devanuj",
    phone: "",
    bio: "",
    joinedDate: "",
    speechesDelivered: 0,
    rolesCompleted: 0,
    pathwayName: "",
    pathwayLevel: 0,
    memberId: "",
  },
];

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getUserByUsernameOrEmail(identifier: string): Promise<ServerUser | undefined> {
  const clean = identifier.trim().toLowerCase();
  const supabase = createServerSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .or(`username.ilike.${clean},email.ilike.${clean}`)
        .limit(1)
        .single();

      if (data && !error) {
        return {
          id: data.id,
          username: data.username,
          email: data.email,
          passwordHash: data.password_hash,
          name: data.name,
          role: data.role as UserRole,
          avatar: data.avatar,
          executiveTitle: data.executive_title,
          phone: data.phone,
          bio: data.bio,
          joinedDate: data.joined_date,
          speechesDelivered: data.speeches_delivered,
          rolesCompleted: data.roles_completed,
          pathwayName: data.pathway_name,
          pathwayLevel: data.pathway_level,
          memberId: data.member_id,
          awardsWon: data.awards_won,
        };
      }
    } catch {}
  }

  return serverUsers.find(
    (u) => u.username.toLowerCase() === clean || u.email.toLowerCase() === clean
  );
}

export async function getUserById(id: string): Promise<ServerUser | undefined> {
  const supabase = createServerSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .limit(1)
        .single();

      if (data && !error) {
        return {
          id: data.id,
          username: data.username,
          email: data.email,
          passwordHash: data.password_hash,
          name: data.name,
          role: data.role as UserRole,
          avatar: data.avatar,
          executiveTitle: data.executive_title,
          phone: data.phone,
          bio: data.bio,
          joinedDate: data.joined_date,
          speechesDelivered: data.speeches_delivered,
          rolesCompleted: data.roles_completed,
          pathwayName: data.pathway_name,
          pathwayLevel: data.pathway_level,
          memberId: data.member_id,
          awardsWon: data.awards_won,
        };
      }
    } catch {}
  }

  return serverUsers.find((u) => u.id === id);
}

export function getAllPublicUsers(): User[] {
  return serverUsers.map(({ passwordHash, ...user }) => user);
}

export function createServerUser(user: ServerUser): ServerUser {
  serverUsers.push(user);
  return user;
}
