<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /**
         * [EDUKASI ARSITEKTUR: DATABASE MIGRATION]
         * Daripada membuat tabel secara manual di phpMyAdmin atau DBeaver, Laravel menggunakan file Migration.
         * Ini berfungsi sebagai "Version Control" untuk database.
         * Jika ada tim baru yang bergabung, mereka cukup menjalankan `php artisan migrate` dan skema database akan
         * otomatis terbuat persis sama, lengkap dengan Foreign Key dan Relasinya (`->references('id')->on('users')`).
         */
        Schema::create('meetings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('duration')->default(0); // in seconds
            $table->string('location');
            $table->string('type');
            $table->text('notes')->nullable();
            $table->string('status')->default('terjadwal'); // terjadwal, berlangsung, selesai, dibatalkan
            $table->uuid('created_by');
            $table->integer('current_stage')->default(1);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('meeting_participants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('meeting_id');
            $table->uuid('user_id');
            $table->boolean('is_invited')->default(true);
            $table->timestamps();

            $table->foreign('meeting_id')->references('id')->on('meetings')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('meeting_recordings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('meeting_id');
            $table->string('file_path');
            $table->bigInteger('file_size')->default(0);
            $table->integer('duration_seconds')->default(0);
            $table->string('source')->default('system_record'); // upload, system_record
            $table->string('status')->default('recording'); // recording, uploaded, processing, transcribing, completed, failed
            $table->uuid('recorded_by');
            $table->string('openai_model_used')->nullable();
            $table->timestamps();

            $table->foreign('meeting_id')->references('id')->on('meetings')->onDelete('cascade');
            $table->foreign('recorded_by')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('meeting_transcripts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('meeting_id');
            $table->uuid('recording_id');
            $table->integer('timestamp_seconds');
            $table->string('speaker')->nullable();
            $table->text('text');
            $table->boolean('is_live')->default(false);
            $table->integer('sequence_order')->default(0);
            $table->timestamps();

            $table->foreign('meeting_id')->references('id')->on('meetings')->onDelete('cascade');
            $table->foreign('recording_id')->references('id')->on('meeting_recordings')->onDelete('cascade');
        });

        Schema::create('meeting_transcript_corrections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('transcript_id');
            $table->text('original_text');
            $table->text('corrected_text');
            $table->uuid('corrected_by');
            $table->timestamps();

            $table->foreign('transcript_id')->references('id')->on('meeting_transcripts')->onDelete('cascade');
            $table->foreign('corrected_by')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('meeting_attendances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('meeting_id');
            $table->uuid('user_id');
            $table->string('status')->default('tidak_hadir'); // hadir, terlambat, tidak_hadir
            $table->timestamp('check_in_time')->nullable();
            $table->string('method')->nullable(); // qr_code, manual
            $table->uuid('recorded_by')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('meeting_id')->references('id')->on('meetings')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('recorded_by')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('meeting_minutes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('meeting_id');
            $table->json('content')->nullable();
            $table->integer('ai_topics_count')->default(0);
            $table->integer('ai_decisions_count')->default(0);
            $table->timestamp('ai_summary_generated_at')->nullable();
            $table->string('version')->default('v1.0');
            $table->string('status')->default('draft'); // draft, review, siap_dikirim, menunggu_persetujuan, disetujui, ditolak
            $table->uuid('reviewed_by')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_notes')->nullable();
            $table->timestamps();

            $table->foreign('meeting_id')->references('id')->on('meetings')->onDelete('cascade');
            $table->foreign('reviewed_by')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('meeting_action_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('meeting_id');
            $table->uuid('minute_id')->nullable();
            $table->text('description');
            $table->string('pic'); // string directly to avoid constraints if external name is typed
            $table->date('deadline')->nullable();
            $table->string('status')->default('open'); // open, in_progress, done
            $table->timestamps();

            $table->foreign('meeting_id')->references('id')->on('meetings')->onDelete('cascade');
            $table->foreign('minute_id')->references('id')->on('meeting_minutes')->onDelete('cascade');
        });

        Schema::create('meeting_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('meeting_id');
            $table->string('file_path');
            $table->string('file_name');
            $table->bigInteger('file_size');
            $table->string('mime_type');
            $table->string('category'); // notulen_pdf, notulen_docx, action_items_xlsx, supporting
            $table->uuid('uploaded_by')->nullable();
            $table->timestamps();

            $table->foreign('meeting_id')->references('id')->on('meetings')->onDelete('cascade');
            $table->foreign('uploaded_by')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('meeting_approvals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('meeting_id');
            $table->uuid('minute_id');
            $table->uuid('approved_by');
            $table->string('decision'); // approved, rejected
            $table->text('notes')->nullable();
            $table->timestamp('decided_at')->nullable();
            $table->timestamps();

            $table->foreign('meeting_id')->references('id')->on('meetings')->onDelete('cascade');
            $table->foreign('minute_id')->references('id')->on('meeting_minutes')->onDelete('cascade');
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meeting_approvals');
        Schema::dropIfExists('meeting_documents');
        Schema::dropIfExists('meeting_action_items');
        Schema::dropIfExists('meeting_minutes');
        Schema::dropIfExists('meeting_attendances');
        Schema::dropIfExists('meeting_transcript_corrections');
        Schema::dropIfExists('meeting_transcripts');
        Schema::dropIfExists('meeting_recordings');
        Schema::dropIfExists('meeting_participants');
        Schema::dropIfExists('meetings');
    }
};
