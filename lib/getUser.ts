import { supabase } from "./supabase";

// ─────────────────────────────────────────────
// GET AUTH USER
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
// GET CURRENT LOGGED IN USER
// checks admins → event_heads → core_team
// ─────────────────────────────────────────────
export async function getCurrentUser() {
  try {
    const user = await getUser();

    if (!user?.email) {
      return null;
    }

    // CHECK ADMINS
    const { data: admin } = await supabase
      .from("admins")
      .select("*")
      .eq("email", user.email)
      .single();

    if (admin) {
      return {
        ...admin,
        user_type: "admin",
      };
    }

    // CHECK EVENT HEADS
    const { data: eventHead } = await supabase
      .from("event_heads")
      .select("*")
      .eq("email", user.email)
      .single();

    if (eventHead) {
      return {
        ...eventHead,
        user_type: "event_head",
      };
    }

    // CHECK CORE TEAM
    const { data: coreMember } = await supabase
      .from("core_team")
      .select("*")
      .eq("email", user.email)
      .single();

    if (coreMember) {
      return {
        ...coreMember,
        user_type: "core_team",
      };
    }

    return null;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
}

// ─────────────────────────────────────────────
// GET USER TYPE
// admin | core_team | event_head
// ─────────────────────────────────────────────
export async function getUserRole() {
  try {
    const user = await getCurrentUser();

    if (!user?.user_type) {
      return null;
    }

    return user.user_type;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

// ─────────────────────────────────────────────
// CHECK AUTHORIZATION
// checks all 3 tables
// ─────────────────────────────────────────────
export async function checkIfAuthorized(email: string) {
  try {
    // CHECK ADMINS
    const { data: admin } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (admin) {
      return {
        ...admin,
        user_type: "admin",
      };
    }

    // CHECK EVENT HEADS
    const { data: eventHead } = await supabase
      .from("event_heads")
      .select("*")
      .eq("email", email)
      .single();

    if (eventHead) {
      return {
        ...eventHead,
        user_type: "event_head",
      };
    }

    // CHECK CORE TEAM
    const { data: coreMember } = await supabase
      .from("core_team")
      .select("*")
      .eq("email", email)
      .single();

    if (coreMember) {
      return {
        ...coreMember,
        user_type: "core_team",
      };
    }

    return null;
  } catch (error) {
    console.error("Authorization Check Error:", error);
    return null;
  }
}

// ─────────────────────────────────────────────
// GET ALL CORE TEAM MEMBERS
// ─────────────────────────────────────────────
export async function getAllCoreTeamMembers() {
  try {
    const { data, error } = await supabase
      .from("core_team")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

// ─────────────────────────────────────────────
// GET ALL EVENT HEADS
// ─────────────────────────────────────────────
export async function getAllEventHeads() {
  try {
    const { data, error } = await supabase
      .from("event_heads")
      .select(`
        *,
        events (
          id,
          event_name,
          department
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

// ─────────────────────────────────────────────
// GET ALL ADMINS
// ─────────────────────────────────────────────
export async function getAllAdmins() {
  try {
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}