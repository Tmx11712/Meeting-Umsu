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
            $table->index('date');
            $table->index('status');
            $table->index('created_by');
            $table->index('current_stage');
        });

        Schema::table('meeting_participants', function (Blueprint $table) {
            $table->index('meeting_id');
            $table->index('user_id');
        });

        Schema::table('meeting_recordings', function (Blueprint $table) {
            $table->index('meeting_id');
            $table->index('status');
        });

        Schema::table('meeting_transcripts', function (Blueprint $table) {
            $table->index('meeting_id');
            $table->index('recording_id');
        });

        Schema::table('meeting_attendances', function (Blueprint $table) {
            $table->index('meeting_id');
            $table->index('user_id');
            $table->index('status');
        });

        Schema::table('meeting_minutes', function (Blueprint $table) {
            $table->index('meeting_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('meetings', function (Blueprint $table) {
            $table->dropIndex(['date']);
            $table->dropIndex(['status']);
            $table->dropIndex(['created_by']);
            $table->dropIndex(['current_stage']);
        });

        Schema::table('meeting_participants', function (Blueprint $table) {
            $table->dropIndex(['meeting_id']);
            $table->dropIndex(['user_id']);
        });

        Schema::table('meeting_recordings', function (Blueprint $table) {
            $table->dropIndex(['meeting_id']);
            $table->dropIndex(['status']);
        });

        Schema::table('meeting_transcripts', function (Blueprint $table) {
            $table->dropIndex(['meeting_id']);
            $table->dropIndex(['recording_id']);
        });

        Schema::table('meeting_attendances', function (Blueprint $table) {
            $table->dropIndex(['meeting_id']);
            $table->dropIndex(['user_id']);
            $table->dropIndex(['status']);
        });

        Schema::table('meeting_minutes', function (Blueprint $table) {
            $table->dropIndex(['meeting_id']);
            $table->dropIndex(['status']);
        });
    }
};
