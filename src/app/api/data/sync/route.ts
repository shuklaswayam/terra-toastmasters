import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      success: false,
      message: "Supabase not connected. Stored in client cache.",
    });
  }

  try {
    const { action, payload } = await req.json();

    switch (action) {
      // --- MEETINGS ---
      case "create_meeting": {
        const { meeting, roles, agenda } = payload;
        if (meeting) {
          await supabase.from("meetings").upsert({
            id: meeting.id,
            meeting_number: meeting.meetingNumber,
            slug: meeting.slug,
            title: meeting.title,
            theme: meeting.theme,
            word_of_the_day: meeting.wordOfTheDay,
            meeting_date: meeting.meetingDate,
            start_time: meeting.startTime,
            end_time: meeting.endTime,
            venue_type: meeting.venueType,
            location_name: meeting.locationName,
            status: meeting.status,
            toastmaster_of_the_day: meeting.tmodName,
            general_evaluator: meeting.generalEvaluator,
            table_topics_master: meeting.tableTopicsMaster,
          });
        }
        if (roles && roles.length > 0) {
          const mappedRoles = roles.map((r: any) => ({
            id: r.id,
            meeting_id: r.meetingId,
            role_name: r.roleName,
            category: r.category,
            allocated_minutes: r.allocatedMinutes,
            assigned_user_id: r.assignedUserId || null,
            assigned_user_name: r.assignedUserName || null,
            assigned_user_avatar: r.assignedUserAvatar || null,
            speech_title: r.speechTitle || null,
            speech_pathway_project: r.speechPathwayProject || null,
            is_locked: !!r.isLocked,
          }));
          await supabase.from("meeting_roles").upsert(mappedRoles);
        }
        if (agenda && agenda.length > 0) {
          const mappedAgenda = agenda.map((a: any) => ({
            id: a.id,
            meeting_id: a.meetingId,
            sequence_order: a.sequenceOrder,
            start_time_offset: a.startTimeOffset,
            item_title: a.itemTitle,
            presenter_name: a.presenterName,
            duration_minutes: a.durationMinutes,
          }));
          await supabase.from("agenda_items").upsert(mappedAgenda);
        }
        break;
      }

      case "update_meeting_role": {
        const { roleId, updates } = payload;
        await supabase
          .from("meeting_roles")
          .update({
            assigned_user_id: updates.assignedUserId || null,
            assigned_user_name: updates.assignedUserName || null,
            assigned_user_avatar: updates.assignedUserAvatar || null,
            speech_title: updates.speechTitle || null,
            speech_pathway_project: updates.speechPathwayProject || null,
            is_locked: updates.isLocked !== undefined ? updates.isLocked : false,
          })
          .eq("id", roleId);
        break;
      }

      // --- CONTESTS ---
      case "create_contest":
      case "update_contest": {
        const { contest } = payload;
        if (contest) {
          await supabase.from("contests").upsert({
            id: contest.id,
            title: contest.title,
            category: contest.category,
            contest_date: contest.contestDate,
            location_name: contest.locationName,
            status: contest.status,
            chair_id: contest.chairId,
            chair_name: contest.chairName,
            chief_judge_id: contest.chiefJudgeId,
            chief_judge_name: contest.chiefJudgeName,
            contest_master_id: contest.contestMasterId || null,
            contest_master_name: contest.contestMasterName || null,
            max_contestants: contest.maxContestants,
            test_speaker_count: contest.testSpeakerCount || 0,
            eligibility_notes: contest.eligibilityNotes,
            notes: contest.notes || "",
          });
        }
        break;
      }

      case "add_contestant": {
        const { participant } = payload;
        if (participant) {
          await supabase.from("contest_participants").upsert({
            id: participant.id,
            contest_id: participant.contestId,
            user_id: participant.userId,
            user_name: participant.userName,
            user_avatar: participant.userAvatar,
            speech_title: participant.speechTitle,
            speaking_order: participant.speakingOrder,
            registered_at: participant.registeredAt,
          });
        }
        break;
      }

      case "remove_contestant": {
        const { participantId } = payload;
        if (participantId) {
          await supabase.from("contest_participants").delete().eq("id", participantId);
        }
        break;
      }

      case "update_contest_role": {
        const { contestId, roleKey, assignment } = payload;
        await supabase
          .from("contest_role_assignments")
          .upsert({
            id: assignment.id || `cra-${contestId}-${roleKey}`,
            contest_id: contestId,
            role_key: roleKey,
            role_label: assignment.roleLabel || roleKey,
            recruited_by: assignment.recruitedBy || "cc",
            is_confidential: !!assignment.isConfidential,
            user_id: assignment.userId || null,
            user_name: assignment.userName || null,
            user_avatar: assignment.userAvatar || null,
            is_guest: !!assignment.isGuest,
            guest_name: assignment.guestName || null,
            guest_club: assignment.guestClub || null,
            guest_email: assignment.guestEmail || null,
            guest_phone: assignment.guestPhone || null,
            notes: assignment.notes || "",
            is_confirmed: assignment.isConfirmed !== false,
          });
        break;
      }

      // --- EVENTS ---
      case "create_event": {
        const { event } = payload;
        if (event) {
          await supabase.from("events").upsert({
            id: event.id,
            title: event.title,
            category: event.category,
            event_date: event.eventDate,
            start_time: event.startTime,
            location_name: event.locationName,
            description: event.description,
            host_name: event.hostName,
            dress_code: event.dressCode || "",
          });
        }
        break;
      }

      case "rsvp_event": {
        const { eventId, userId, userName, userAvatar, status } = payload;
        await supabase.from("event_rsvps").upsert({
          id: `rsvp-${eventId}-${userId}`,
          event_id: eventId,
          user_id: userId,
          user_name: userName,
          user_avatar: userAvatar,
          status,
        });
        break;
      }
    }

    return NextResponse.json({ success: true, action });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
