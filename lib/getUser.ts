import { supabase } from "./supabase";
import type { UserRole } from "@/types/database.types";

// ─────────────────────────────────────────────
// Get authenticated auth user
// ─────────────────────────────────────────────
export async function getUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Auth Error:", error.message);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

// ─────────────────────────────────────────────
// Get current logged-in profile
// ─────────────────────────────────────────────
export async function getCurrentUser() {
  try {
    const user = await getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Profile Error:", error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
}

// ─────────────────────────────────────────────
// Get current user's role
// ─────────────────────────────────────────────
export async function getUserRole(): Promise<UserRole | null> {
  try {
    const profile = await getCurrentUser();

    if (!profile || !profile.role) {
      return null;
    }

    const allowedRoles: UserRole[] = [
      "superadmin",
      "coordinator",
      "volunteer",
      "event_head",
    ];

    if (allowedRoles.includes(profile.role as UserRole)) {
      return profile.role as UserRole;
    }

    return null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

// ─────────────────────────────────────────────
// Get profile by ID
// ─────────────────────────────────────────────
export async function getProfileById(userId: string) {
  try {
    if (!userId) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error getting profile by ID:", error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getProfileById:", error);
    return null;
  }
}

// ─────────────────────────────────────────────
// Get all team members
// ─────────────────────────────────────────────
export async function getAllTeamMembers() {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error getting team members:", error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllTeamMembers:", error);
    return [];
  }
}