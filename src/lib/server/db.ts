import { User, UserRole } from "@/lib/types";

export interface ServerUser extends User {
  passwordHash: string;
}

export const DEFAULT_SEED_PASSWORD_HASH = "$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.";

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
        .or(`username.ilike.${clean},email.ilike.${clean}`);

      if (data && data.length > 0 && !error) {
        const u = data[0];
        return {
          id: u.id,
          username: u.username,
          email: u.email,
          passwordHash: u.password_hash,
          name: u.name,
          role: u.role as UserRole,
          avatar: u.avatar,
          executiveTitle: u.executive_title,
          phone: u.phone || "",
          bio: u.bio || "",
          joinedDate: u.joined_date || "",
          speechesDelivered: u.speeches_delivered || 0,
          rolesCompleted: u.roles_completed || 0,
          pathwayName: u.pathway_name || "",
          pathwayLevel: u.pathway_level || 0,
          memberId: u.member_id || "",
          awardsWon: u.awards_won || 0,
        };
      }
    } catch (e) {
      console.warn("Supabase lookup error:", e);
    }
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
        .eq("id", id);

      if (data && data.length > 0 && !error) {
        const u = data[0];
        return {
          id: u.id,
          username: u.username,
          email: u.email,
          passwordHash: u.password_hash,
          name: u.name,
          role: u.role as UserRole,
          avatar: u.avatar,
          executiveTitle: u.executive_title,
          phone: u.phone || "",
          bio: u.bio || "",
          joinedDate: u.joined_date || "",
          speechesDelivered: u.speeches_delivered || 0,
          rolesCompleted: u.roles_completed || 0,
          pathwayName: u.pathway_name || "",
          pathwayLevel: u.pathway_level || 0,
          memberId: u.member_id || "",
          awardsWon: u.awards_won || 0,
        };
      }
    } catch (e) {
      console.warn("Supabase lookup by ID error:", e);
    }
  }

  return serverUsers.find((u) => u.id === id);
}

import { hashPassword } from "@/lib/server/auth";

export async function updateServerUser(
  userId: string,
  updates: Partial<User> & { password?: string }
): Promise<User | null> {
  const user = serverUsers.find((u) => u.id === userId);
  let newPasswordHash: string | undefined;

  if (updates.password && updates.password.trim()) {
    newPasswordHash = await hashPassword(updates.password.trim());
  }

  if (user) {
    if (updates.name !== undefined) user.name = updates.name;
    if (updates.email !== undefined) user.email = updates.email;
    if (updates.phone !== undefined) user.phone = updates.phone;
    if (updates.bio !== undefined) user.bio = updates.bio;
    if (updates.avatar !== undefined) user.avatar = updates.avatar;
    if (updates.role !== undefined) user.role = updates.role;
    if (updates.executiveTitle !== undefined) user.executiveTitle = updates.executiveTitle;
    if (updates.joinedDate !== undefined) user.joinedDate = updates.joinedDate;
    if (updates.pathwayName !== undefined) user.pathwayName = updates.pathwayName;
    if (updates.pathwayLevel !== undefined) user.pathwayLevel = updates.pathwayLevel;
    if (updates.speechesDelivered !== undefined) user.speechesDelivered = updates.speechesDelivered;
    if (updates.rolesCompleted !== undefined) user.rolesCompleted = updates.rolesCompleted;
    if (updates.memberId !== undefined) user.memberId = updates.memberId;
    if (updates.awardsWon !== undefined) user.awardsWon = updates.awardsWon;
    if (newPasswordHash) user.passwordHash = newPasswordHash;
  }

  const supabase = createServerSupabaseClient();
  if (supabase) {
    try {
      const supabaseUpdates: Record<string, any> = {};
      if (updates.name !== undefined) supabaseUpdates.name = updates.name;
      if (updates.email !== undefined) supabaseUpdates.email = updates.email;
      if (updates.phone !== undefined) supabaseUpdates.phone = updates.phone;
      if (updates.bio !== undefined) supabaseUpdates.bio = updates.bio;
      if (updates.avatar !== undefined) supabaseUpdates.avatar = updates.avatar;
      if (updates.role !== undefined) supabaseUpdates.role = updates.role;
      if (updates.executiveTitle !== undefined) supabaseUpdates.executive_title = updates.executiveTitle;
      if (updates.joinedDate !== undefined) supabaseUpdates.joined_date = updates.joinedDate;
      if (updates.pathwayName !== undefined) supabaseUpdates.pathway_name = updates.pathwayName;
      if (updates.pathwayLevel !== undefined) supabaseUpdates.pathway_level = updates.pathwayLevel;
      if (updates.speechesDelivered !== undefined) supabaseUpdates.speeches_delivered = updates.speechesDelivered;
      if (updates.rolesCompleted !== undefined) supabaseUpdates.roles_completed = updates.rolesCompleted;
      if (updates.memberId !== undefined) supabaseUpdates.member_id = updates.memberId;
      if (updates.awardsWon !== undefined) supabaseUpdates.awards_won = updates.awardsWon;
      if (newPasswordHash) supabaseUpdates.password_hash = newPasswordHash;

      const { error } = await supabase.from("users").update(supabaseUpdates).eq("id", userId);
      if (error) {
        console.error("Supabase user update error:", error);
      }
    } catch (e) {
      console.warn("Supabase user update exception:", e);
    }
  }

  const updated = user || (await getUserById(userId));
  if (!updated) return null;
  const { passwordHash: _, ...publicUser } = updated;
  return publicUser;
}

export async function addServerUser(
  user: User & { password?: string }
): Promise<User> {
  const passwordHash = user.password && user.password.trim()
    ? await hashPassword(user.password.trim())
    : DEFAULT_SEED_PASSWORD_HASH;

  const serverUser: ServerUser = {
    ...user,
    passwordHash,
  };

  serverUsers.push(serverUser);

  const supabase = createServerSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("users").insert({
        id: user.id,
        username: user.username,
        email: user.email,
        password_hash: passwordHash,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone || "",
        bio: user.bio || "",
        joined_date: user.joinedDate || "",
        executive_title: user.executiveTitle || null,
        pathway_name: user.pathwayName || "",
        pathway_level: user.pathwayLevel || 1,
        speeches_delivered: user.speechesDelivered || 0,
        roles_completed: user.rolesCompleted || 0,
        member_id: user.memberId || "",
        awards_won: user.awardsWon || 0,
      });
    } catch {}
  }

  const { passwordHash: _, ...publicUser } = serverUser;
  return publicUser;
}

export async function deleteServerUser(userId: string): Promise<boolean> {
  const index = serverUsers.findIndex((u) => u.id === userId);
  if (index !== -1) {
    serverUsers.splice(index, 1);
  }

  const supabase = createServerSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("users").delete().eq("id", userId);
    } catch {}
  }

  return true;
}

export function getAllPublicUsers(): User[] {
  return serverUsers.map(({ passwordHash, ...user }) => user);
}

export function createServerUser(user: ServerUser): ServerUser {
  serverUsers.push(user);
  return user;
}
