import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      hasSupabase: false,
      message: "Supabase environment variables not configured. Using client/local persistence.",
    });
  }

  try {
    const [
      meetingsRes,
      meetingRolesRes,
      agendaItemsRes,
      contestsRes,
      contestRolesRes,
      contestParticipantsRes,
      eventsRes,
      eventRsvpsRes,
      usersRes,
    ] = await Promise.all([
      supabase.from("meetings").select("*").order("meeting_number", { ascending: false }),
      supabase.from("meeting_roles").select("*"),
      supabase.from("agenda_items").select("*").order("sequence_order", { ascending: true }),
      supabase.from("contests").select("*").order("contest_date", { ascending: true }),
      supabase.from("contest_role_assignments").select("*"),
      supabase.from("contest_participants").select("*").order("speaking_order", { ascending: true }),
      supabase.from("events").select("*").order("event_date", { ascending: true }),
      supabase.from("event_rsvps").select("*"),
      supabase.from("users").select("id, username, email, name, role, executive_title, avatar, phone, bio, joined_date, speeches_delivered, roles_completed, pathway_name, pathway_level, member_id, awards_won"),
    ]);

    // Map database snake_case to app camelCase
    const meetings = (meetingsRes.data || []).map((m: any) => ({
      id: m.id,
      meetingNumber: m.meeting_number,
      slug: m.slug,
      title: m.title,
      theme: m.theme,
      wordOfTheDay: m.word_of_the_day,
      meetingDate: m.meeting_date,
      startTime: m.start_time,
      endTime: m.end_time,
      venueType: m.venue_type,
      locationName: m.location_name,
      status: m.status,
      tmodName: m.toastmaster_of_the_day,
      generalEvaluator: m.general_evaluator,
      tableTopicsMaster: m.table_topics_master,
    }));

    const meetingRoles = (meetingRolesRes.data || []).map((r: any) => ({
      id: r.id,
      meetingId: r.meeting_id,
      roleName: r.role_name,
      category: r.category,
      allocatedMinutes: r.allocated_minutes,
      assignedUserId: r.assigned_user_id,
      assignedUserName: r.assigned_user_name,
      assignedUserAvatar: r.assigned_user_avatar,
      speechTitle: r.speech_title,
      speechPathwayProject: r.speech_pathway_project,
      isLocked: r.is_locked,
      claimedAt: r.claimed_at,
    }));

    const agendaItems = (agendaItemsRes.data || []).map((a: any) => ({
      id: a.id,
      meetingId: a.meeting_id,
      sequenceOrder: a.sequence_order,
      startTimeOffset: a.start_time_offset,
      itemTitle: a.item_title,
      presenterName: a.presenter_name,
      durationMinutes: a.duration_minutes,
    }));

    const contests = (contestsRes.data || []).map((c: any) => {
      const participants = (contestParticipantsRes.data || [])
        .filter((p: any) => p.contest_id === c.id)
        .map((p: any) => ({
          id: p.id,
          contestId: p.contest_id,
          userId: p.user_id,
          userName: p.user_name,
          userAvatar: p.user_avatar,
          speechTitle: p.speech_title,
          speakingOrder: p.speaking_order,
          registeredAt: p.registered_at,
          isGuest: p.is_guest,
          guestClub: p.guest_club,
        }));

      const roleAssignments = (contestRolesRes.data || [])
        .filter((r: any) => r.contest_id === c.id)
        .map((r: any) => ({
          id: r.id,
          contestId: r.contest_id,
          roleKey: r.role_key,
          roleLabel: r.role_label,
          recruitedBy: r.recruited_by,
          isConfidential: r.is_confidential,
          userId: r.user_id,
          userName: r.user_name,
          userAvatar: r.user_avatar,
          isGuest: r.is_guest,
          guestName: r.guest_name,
          guestClub: r.guest_club,
          guestEmail: r.guest_email,
          guestPhone: r.guest_phone,
          notes: r.notes,
          isConfirmed: r.is_confirmed,
        }));

      return {
        id: c.id,
        title: c.title,
        category: c.category,
        contestDate: c.contest_date,
        registrationDeadline: c.registration_deadline || c.contest_date,
        maxContestants: c.max_contestants || 8,
        status: c.status,
        chairId: c.chair_id,
        chairName: c.chair_name,
        chiefJudgeId: c.chief_judge_id,
        chiefJudgeName: c.chief_judge_name,
        contestMasterId: c.contest_master_id,
        contestMasterName: c.contest_master_name,
        testSpeakerCount: c.test_speaker_count || 0,
        eligibilityNotes: c.eligibility_notes || "",
        notes: c.notes || "",
        locationName: c.location_name || "",
        participants,
        roleAssignments,
      };
    });

    const events = (eventsRes.data || []).map((e: any) => {
      const rsvps = (eventRsvpsRes.data || [])
        .filter((r: any) => r.event_id === e.id)
        .map((r: any) => ({
          id: r.id,
          eventId: r.event_id,
          userId: r.user_id,
          userName: r.user_name,
          userAvatar: r.user_avatar,
          status: r.status,
          createdAt: r.created_at,
        }));

      return {
        id: e.id,
        title: e.title,
        category: e.category,
        eventDate: e.event_date,
        startTime: e.start_time,
        locationName: e.location_name,
        description: e.description,
        hostName: e.host_name,
        dressCode: e.dress_code,
        rsvps,
      };
    });

    const users = (usersRes.data || []).map((u: any) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      name: u.name,
      role: u.role,
      executiveTitle: u.executive_title,
      avatar: u.avatar,
      phone: u.phone || "",
      bio: u.bio || "",
      joinedDate: u.joined_date || "",
      speechesDelivered: u.speeches_delivered || 0,
      rolesCompleted: u.roles_completed || 0,
      pathwayName: u.pathway_name || "",
      pathwayLevel: u.pathway_level || 0,
      memberId: u.member_id || "",
      awardsWon: u.awards_won || 0,
    }));

    return NextResponse.json({
      hasSupabase: true,
      data: {
        meetings: meetings.length > 0 ? meetings : null,
        meetingRoles: meetingRoles.length > 0 ? meetingRoles : null,
        agendaItems: agendaItems.length > 0 ? agendaItems : null,
        contests: contests.length > 0 ? contests : null,
        events: events.length > 0 ? events : null,
        users: users.length > 0 ? users : null,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      hasSupabase: false,
      error: error.message || "Failed to fetch from Supabase.",
    });
  }
}
