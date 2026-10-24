<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('meetings', function (Blueprint $table) {
            $table->index(['date', 'status'], 'idx_meetings_date_status');
            $table->index(['current_stage', 'status'], 'idx_meetings_stage_status');
        });

        Schema::table('meeting_action_items', function (Blueprint $table) {
            $table->index('status', 'idx_action_items_status');
            $table->index(['meeting_id', 'status'], 'idx_action_items_meeting_status');
        });

        Schema::table('meeting_types', function (Blueprint $table) {
            $table->index('is_active', 'idx_meeting_types_is_active');
        });

        Schema::table('meeting_rooms', function (Blueprint $table) {
            $table->index('is_active', 'idx_meeting_rooms_is_active');
        });

        Schema::table('meeting_transcription_chunks', function (Blueprint $table) {
            $table->index('status', 'idx_chunks_status');
            $table->index(['recording_id', 'status'], 'idx_chunks_rec_status');
        });

        Schema::table('meeting_documents', function (Blueprint $table) {
            $table->index('category', 'idx_documents_category');
        });

        Schema::table('meeting_approvals', function (Blueprint $table) {
            $table->index(['meeting_id', 'decision'], 'idx_approvals_meeting_decision');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('meetings', function (Blueprint $table) {
            $table->dropIndex('idx_meetings_date_status');
            $table->dropIndex('idx_meetings_stage_status');
        });

        Schema::table('meeting_action_items', function (Blueprint $table) {
            $table->dropIndex('idx_action_items_status');
            $table->dropIndex('idx_action_items_meeting_status');
        });

        Schema::table('meeting_types', function (Blueprint $table) {
            $table->dropIndex('idx_meeting_types_is_active');
        });

        Schema::table('meeting_rooms', function (Blueprint $table) {
            $table->dropIndex('idx_meeting_rooms_is_active');
        });

        Schema::table('meeting_transcription_chunks', function (Blueprint $table) {
            $table->dropIndex('idx_chunks_status');
            $table->dropIndex('idx_chunks_rec_status');
        });

        Schema::table('meeting_documents', function (Blueprint $table) {
            $table->dropIndex('idx_documents_category');
        });

        Schema::table('meeting_approvals', function (Blueprint $table) {
            $table->dropIndex('idx_approvals_meeting_decision');
        });
    }
};
